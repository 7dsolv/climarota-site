"use strict";

(function exposeJourneyDiscovery(root) {
  const categories = Object.freeze({
    "amenity:fuel": { label: "Abastecimento", task: "Confira preço, horário e necessidade de abastecer." },
    "amenity:charging_station": { label: "Recarga", task: "Confira conector, preço e funcionamento antes de parar." },
    "amenity:drinking_water": { label: "Água", task: "Confirme no local se a água está disponível e própria para consumo." },
    "amenity:toilets": { label: "Banheiro", task: "Confirme acesso e horário antes de contar com esta parada." },
    "amenity:cafe": { label: "Pausa", task: "Faça uma pausa em local permitido e confira o horário de atendimento." },
    "amenity:pharmacy": { label: "Farmácia", task: "Confira horário e disponibilidade antes de contar com esta parada." },
    "tourism:hotel": { label: "Hospedagem", task: "Confira disponibilidade, preço e condições diretamente com o local." },
    "tourism:museum": { label: "Cultura", task: "Conheça uma história do lugar e confira horário de visita." },
    "tourism:viewpoint": { label: "Paisagem", task: "Observe a paisagem e as condições do tempo de um local permitido." },
    "leisure:park": { label: "Área verde", task: "Faça uma pausa e observe o ambiente sem sair das áreas permitidas." },
  });

  function validPoint(point) {
    return Number.isFinite(point?.lat) && Math.abs(point.lat) <= 90
      && Number.isFinite(point?.lon) && Math.abs(point.lon) <= 180;
  }

  function distanceMeters(a, b) {
    if (!validPoint(a) || !validPoint(b)) throw new Error("Coordenadas inválidas para medir distância.");
    const radians = Math.PI / 180;
    const lat1 = a.lat * radians;
    const lat2 = b.lat * radians;
    const dLat = (b.lat - a.lat) * radians;
    const dLon = (b.lon - a.lon) * radians;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2)
      * Math.sin(dLon / 2) ** 2;
    const boundedH = Math.min(1, Math.max(0, h));
    return 6371000 * 2 * Math.atan2(Math.sqrt(boundedH), Math.sqrt(1 - boundedH));
  }

  function buildDiscoveryUrl(center) {
    if (!validPoint(center)) throw new Error("Escolha um ponto válido no mapa.");
    const url = new URL("https://photon.komoot.io/reverse");
    url.searchParams.set("lat", String(center.lat));
    url.searchParams.set("lon", String(center.lon));
    url.searchParams.set("limit", "40");
    Object.keys(categories).forEach((tag) => url.searchParams.append("osm_tag", tag));
    return url.toString();
  }

  function normalizeDiscoveries(features, center, radiusMeters = 2500) {
    if (!validPoint(center) || !Array.isArray(features)) throw new Error("A resposta dos pontos é inválida.");
    const candidates = [];
    const seen = new Set();
    for (const feature of features) {
      const properties = feature?.properties;
      const coordinates = feature?.geometry?.coordinates;
      const point = { lat: coordinates?.[1], lon: coordinates?.[0] };
      const category = categories[`${properties?.osm_key}:${properties?.osm_value}`];
      const osmType = { N: "node", W: "way", R: "relation" }[properties?.osm_type];
      const osmId = properties?.osm_id;
      if (!category || !validPoint(point) || !osmType
        || !Number.isSafeInteger(osmId) || osmId <= 0) continue;
      const id = `${osmType}/${osmId}`;
      if (seen.has(id)) continue;
      const distance = distanceMeters(center, point);
      if (distance > radiusMeters) continue;
      seen.add(id);
      const name = typeof properties.name === "string" && properties.name.trim()
        ? properties.name.trim().slice(0, 100) : category.label;
      candidates.push(Object.freeze({
        id, name, label: category.label, task: category.task,
        lat: point.lat, lon: point.lon, distanceMeters: Math.round(distance),
        sourceUrl: `https://www.openstreetmap.org/${id}`,
      }));
    }
    candidates.sort((a, b) => a.distanceMeters - b.distanceMeters);
    const perCategory = new Map();
    return candidates.filter((item) => {
      const count = perCategory.get(item.label) || 0;
      if (count >= 3) return false;
      perCategory.set(item.label, count + 1);
      return true;
    }).slice(0, 12);
  }

  function sampleRouteCenters(geometry, count = 3) {
    const coordinates = geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2 || !Number.isInteger(count)
      || count < 1 || count > 5) throw new Error("A rota não tem pontos válidos para procurar marcos.");
    const points = coordinates.map(([lon, lat]) => ({ lat, lon }));
    if (points.some((point) => !validPoint(point))) throw new Error("A rota contém coordenadas inválidas.");
    const cumulative = [0];
    for (let index = 1; index < points.length; index += 1) {
      cumulative.push(cumulative[index - 1] + distanceMeters(points[index - 1], points[index]));
    }
    const total = cumulative.at(-1);
    if (total < 100) throw new Error("A rota é curta demais para buscar marcos ao longo do caminho.");
    return Array.from({ length: count }, (_, index) => {
      const target = total * (index + 1) / (count + 1);
      const segment = cumulative.findIndex((value) => value >= target);
      const start = Math.max(0, segment - 1);
      const fraction = (target - cumulative[start]) / (cumulative[segment] - cumulative[start] || 1);
      return {
        lat: points[start].lat + (points[segment].lat - points[start].lat) * fraction,
        lon: points[start].lon + (points[segment].lon - points[start].lon) * fraction,
        routeKm: Math.round(target / 1000),
      };
    });
  }

  function mergeRouteDiscoveries(batches, centers) {
    if (!Array.isArray(batches) || !Array.isArray(centers) || batches.length !== centers.length) {
      throw new Error("As paradas da rota estão incompletas.");
    }
    const seen = new Set();
    const perCategory = new Map();
    const combined = [];
    batches.forEach((features, index) => {
      for (const item of normalizeDiscoveries(features, centers[index], 1800)) {
        if (seen.has(item.id) || (perCategory.get(item.label) || 0) >= 3) continue;
        seen.add(item.id);
        perCategory.set(item.label, (perCategory.get(item.label) || 0) + 1);
        combined.push(Object.freeze({ ...item, routeKm: centers[index].routeKm }));
      }
    });
    return combined.slice(0, 12);
  }

  function canMarkPassage(discovery, position) {
    const location = { lat: position?.coords?.latitude, lon: position?.coords?.longitude };
    const accuracy = position?.coords?.accuracy;
    const speed = position?.coords?.speed;
    if (!validPoint(location) || !Number.isFinite(accuracy) || accuracy > 60) {
      return { allowed: false, reason: "O GPS está impreciso. Tente novamente em local aberto." };
    }
    if (Number.isFinite(speed) && speed > 2) {
      return { allowed: false, reason: "Pare em local permitido antes de marcar a passagem." };
    }
    if (!validPoint(discovery) || distanceMeters(location, discovery) > 120) {
      return { allowed: false, reason: "Aproxime-se do marco antes de marcar a passagem." };
    }
    return { allowed: true, reason: "Passagem aproximada confirmada pelo GPS deste aparelho." };
  }

  const api = Object.freeze({ buildDiscoveryUrl, normalizeDiscoveries, sampleRouteCenters,
    mergeRouteDiscoveries, canMarkPassage, distanceMeters });
  root.ClimaRotaJourneyDiscovery = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
