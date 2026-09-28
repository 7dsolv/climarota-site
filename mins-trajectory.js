"use strict";

(function exposeMinsTrajectory(root) {
  const EARTH_RADIUS_METERS = 6371008.8;
  const MAX_SAMPLES = 50000;
  const MAX_OFFSET_METERS = 100000;

  function parseTrajectory(text) {
    if (typeof text !== "string" || !text.trim()) {
      throw new Error("O arquivo de trajetória MINS está vazio.");
    }

    const samples = [];
    let previousTime = -Infinity;
    for (const [lineIndex, line] of text.split(/\r?\n/).entries()) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const values = trimmed.split(/[\s,]+/).map(Number);
      if (values.length < 8 || values.some((value) => !Number.isFinite(value))) {
        throw new Error(`A linha ${lineIndex + 1} não contém uma pose MINS válida.`);
      }
      const [time, x, y, z, qw, qx, qy, qz] = values;
      if (time <= previousTime) {
        throw new Error(`Os tempos da trajetória devem estar em ordem crescente (linha ${lineIndex + 1}).`);
      }
      if (Math.hypot(qw, qx, qy, qz) === 0) {
        throw new Error(`A orientação da pose na linha ${lineIndex + 1} é inválida.`);
      }
      samples.push({ time, x, y, z });
      if (samples.length > MAX_SAMPLES) {
        throw new Error(`O arquivo excede o limite de ${MAX_SAMPLES} amostras.`);
      }
      previousTime = time;
    }

    if (samples.length < 2) {
      throw new Error("A trajetória precisa conter ao menos duas poses.");
    }
    return samples;
  }

  function toGeographicCoordinates(samples, anchor, yawDegrees = 0) {
    if (!Array.isArray(samples) || samples.length < 2) {
      throw new Error("A trajetória precisa conter ao menos duas poses.");
    }
    if (!anchor || !Number.isFinite(anchor.latitude) || Math.abs(anchor.latitude) > 85
      || !Number.isFinite(anchor.longitude) || Math.abs(anchor.longitude) > 180
      || !Number.isFinite(yawDegrees)) {
      throw new Error("Informe uma origem válida e uma orientação local válida.");
    }

    const latitudeRadians = anchor.latitude * Math.PI / 180;
    const yawRadians = yawDegrees * Math.PI / 180;
    const cosYaw = Math.cos(yawRadians);
    const sinYaw = Math.sin(yawRadians);
    const cosLatitude = Math.cos(latitudeRadians);
    const coordinates = samples.map(({ x, y }) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new Error("A trajetória contém uma posição local inválida.");
      }
      const east = x * cosYaw + y * sinYaw;
      const north = -x * sinYaw + y * cosYaw;
      if (Math.hypot(east, north) > MAX_OFFSET_METERS) {
        throw new Error("A trajetória ultrapassa 100 km da origem; a conversão local não é precisa nessa escala.");
      }
      const latitude = anchor.latitude + north / EARTH_RADIUS_METERS * 180 / Math.PI;
      const longitude = anchor.longitude
        + east / (EARTH_RADIUS_METERS * cosLatitude) * 180 / Math.PI;
      if (Math.abs(latitude) > 90) {
        throw new Error("A trajetória gera uma latitude geográfica inválida.");
      }
      return [
        ((longitude + 180) % 360 + 360) % 360 - 180,
        latitude,
      ];
    });
    return coordinates;
  }

  const api = Object.freeze({ parseTrajectory, toGeographicCoordinates });
  root.ClimaRotaMinsTrajectory = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
