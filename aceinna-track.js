"use strict";

(function exposeAceinnaTrack(root) {
  const MAX_SAMPLES = 50000;
  const FORMATS = Object.freeze({
    gnss: { delimiter: ",", headerLines: 1, latitude: 2, longitude: 3, altitude: 4 },
    ins: { delimiter: ",", headerLines: 1, latitude: 4, longitude: 5, altitude: 6 },
    error: { delimiter: ",", headerLines: 0, latitude: 2, longitude: 3, altitude: 4 },
    compact: { delimiter: ",", headerLines: 1, latitude: 1, longitude: 2, altitude: 3 },
    span: { delimiter: null, headerLines: 45, latitude: 2, longitude: 3, altitude: 4 },
  });

  function parseTrajectory(text, format) {
    if (typeof text !== "string" || !text.trim()) {
      throw new Error("O arquivo CSV GNSS/INS está vazio.");
    }
    const definition = FORMATS[format];
    if (!definition) throw new Error("Escolha um formato GNSS/INS reconhecido.");

    const rows = text.split(/\r?\n/);
    const coordinates = [];
    for (let index = definition.headerLines; index < rows.length; index += 1) {
      const line = rows[index].trim();
      if (!line) continue;
      const columns = definition.delimiter
        ? line.split(definition.delimiter).map((value) => value.trim())
        : line.split(/\s+/);
      const coordinateColumns = [
        columns[definition.latitude],
        columns[definition.longitude],
        columns[definition.altitude],
      ];
      const latitude = Number(columns[definition.latitude]);
      const longitude = Number(columns[definition.longitude]);
      const altitude = Number(columns[definition.altitude]);
      if (coordinateColumns.some((value) => value === undefined || value === "")
        || ![latitude, longitude, altitude].every(Number.isFinite)
        || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
        throw new Error(`A linha ${index + 1} não contém latitude/longitude/altitude válidas em graus.`);
      }
      coordinates.push([longitude, latitude]);
      if (coordinates.length > MAX_SAMPLES) {
        throw new Error(`O arquivo excede o limite de ${MAX_SAMPLES} amostras.`);
      }
    }
    if (coordinates.length < 2) {
      throw new Error("A trajetória GNSS/INS precisa conter ao menos duas posições válidas.");
    }
    return coordinates;
  }

  const api = Object.freeze({ parseTrajectory });
  root.ClimaRotaAceinnaTrack = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
