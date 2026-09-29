"use strict";

(function exposeVehicleNavigation(root) {
  const radians = Math.PI / 180;
  const earthRadius = 6371000;

  function validPoint(point) {
    return Number.isFinite(point?.lat) && Math.abs(point.lat) <= 90
      && Number.isFinite(point?.lon) && Math.abs(point.lon) <= 180;
  }

  function distanceMeters(a, b) {
    if (!validPoint(a) || !validPoint(b)) throw new Error("Coordenadas inválidas.");
    const y = (b.lat - a.lat) * radians;
    const x = (b.lon - a.lon) * radians * Math.cos((a.lat + b.lat) * radians / 2);
    return earthRadius * Math.hypot(x, y);
  }

  function nearestOnRoute(point, route) {
    if (!validPoint(point) || !Array.isArray(route?.path) || route.path.length < 2) {
      throw new Error("Rota ou posição inválida.");
    }
    let nearest = { distanceMeters: Infinity, progressMeters: 0 };
    for (let index = 1; index < route.path.length; index += 1) {
      const a = route.path[index - 1];
      const b = route.path[index];
      const scaleX = earthRadius * radians * Math.cos(point.lat * radians);
      const scaleY = earthRadius * radians;
      const ax = (a.lon - point.lon) * scaleX;
      const ay = (a.lat - point.lat) * scaleY;
      const bx = (b.lon - point.lon) * scaleX;
      const by = (b.lat - point.lat) * scaleY;
      const dx = bx - ax;
      const dy = by - ay;
      const fraction = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)));
      const distance = Math.hypot(ax + fraction * dx, ay + fraction * dy);
      if (distance < nearest.distanceMeters) {
        nearest = {
          distanceMeters: distance,
          progressMeters: route.cumulative[index - 1]
            + fraction * (route.cumulative[index] - route.cumulative[index - 1]),
        };
      }
    }
    return nearest;
  }

  function prepareRoute(raw) {
    const coordinates = raw?.geometry?.coordinates;
    const steps = raw?.legs?.flatMap((leg) => leg.steps || []);
    if (!Array.isArray(coordinates) || coordinates.length < 2 || !Array.isArray(steps)
      || !Number.isFinite(raw.distance) || raw.distance < 0
      || !Number.isFinite(raw.duration) || raw.duration < 0) {
      throw new Error("A rota não trouxe instruções de direção válidas.");
    }
    const path = coordinates.map(([lon, lat]) => ({ lat, lon }));
    if (path.some((point) => !validPoint(point))) throw new Error("A rota contém coordenadas inválidas.");
    const cumulative = [0];
    for (let index = 1; index < path.length; index += 1) {
      cumulative.push(cumulative[index - 1] + distanceMeters(path[index - 1], path[index]));
    }
    const prepared = { path, cumulative, totalMeters: cumulative.at(-1), distance: raw.distance,
      duration: raw.duration, geometry: raw.geometry, maneuvers: [] };
    for (const step of steps) {
      const location = step?.maneuver?.location;
      const point = { lat: location?.[1], lon: location?.[0] };
      if (!validPoint(point) || !step?.maneuver?.type) continue;
      if (step.maneuver.type === "depart" || step.maneuver.type === "notification"
        || step.maneuver.type === "exit roundabout" || step.maneuver.type === "exit rotary") continue;
      prepared.maneuvers.push({
        type: step.maneuver.type,
        modifier: step.maneuver.modifier,
        exit: step.maneuver.exit,
        name: typeof step.name === "string" ? step.name.slice(0, 90) : "",
        progressMeters: nearestOnRoute(point, prepared).progressMeters,
      });
    }
    prepared.maneuvers.sort((a, b) => a.progressMeters - b.progressMeters);
    if (!prepared.maneuvers.length) throw new Error("A rota não trouxe manobras utilizáveis.");
    return prepared;
  }

  function formatDistance(meters) {
    if (meters < 1000) return `${Math.max(10, Math.round(meters / 10) * 10)} metros`;
    return `${(meters / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} quilômetros`;
  }

  function maneuverText(maneuver) {
    const side = {
      left: "à esquerda", "slight left": "levemente à esquerda", "sharp left": "acentuadamente à esquerda",
      right: "à direita", "slight right": "levemente à direita", "sharp right": "acentuadamente à direita",
      straight: "em frente", uturn: "para retornar",
    }[maneuver.modifier] || "em frente";
    const road = maneuver.name ? ` na ${maneuver.name}` : "";
    if (maneuver.type === "arrive") return "Você chegou ao destino";
    if (["roundabout", "rotary"].includes(maneuver.type)) {
      return Number.isInteger(maneuver.exit) ? `Na rotatória, pegue a saída ${maneuver.exit}${road}`
        : `Entre na rotatória e siga ${side}${road}`;
    }
    if (["on ramp", "off ramp"].includes(maneuver.type)) return `Pegue a alça ${side}${road}`;
    if (maneuver.type === "merge") return `Entre na via ${side}${road}`;
    if (maneuver.type === "fork") return `Mantenha-se ${side}${road}`;
    if (maneuver.type === "new name") return `Continue${road}`;
    return `Siga ${side}${road}`;
  }

  function progressAt(point, route) {
    const nearest = nearestOnRoute(point, route);
    const remainingMeters = Math.max(0, route.distance * (1 - nearest.progressMeters / (route.totalMeters || 1)));
    const nextIndex = route.maneuvers.findIndex((maneuver) => maneuver.progressMeters >= nearest.progressMeters + 8);
    const maneuver = nextIndex >= 0 ? route.maneuvers[nextIndex] : route.maneuvers.at(-1);
    return {
      ...nearest,
      remainingMeters,
      remainingSeconds: route.duration * (remainingMeters / (route.distance || 1)),
      nextIndex: nextIndex >= 0 ? nextIndex : route.maneuvers.length - 1,
      maneuver,
      maneuverMeters: Math.max(0, maneuver.progressMeters - nearest.progressMeters),
    };
  }

  function shouldRecalculate(progress, accuracy, consecutiveOffRoute, elapsedMs) {
    return Number.isFinite(accuracy) && accuracy <= 50
      && progress.distanceMeters > Math.max(80, accuracy * 2)
      && consecutiveOffRoute >= 3 && elapsedMs >= 30000;
  }

  const api = Object.freeze({ prepareRoute, progressAt, maneuverText, formatDistance,
    shouldRecalculate, distanceMeters, nearestOnRoute });
  root.ClimaRotaVehicleNavigation = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
