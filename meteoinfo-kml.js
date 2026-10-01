"use strict";

(function exposeMeteoInfoKml(root) {
  function readCoordinates(node, count) {
    const source = node?.textContent?.trim();
    if (!source) throw new Error("A feição KML não contém coordenadas.");
    const points = source.split(/\s+/).map((entry) => {
      const parts = entry.split(",");
      const lon = Number(parts[0]);
      const lat = Number(parts[1]);
      if (parts.length < 2 || parts.length > 3 || !Number.isFinite(lon)
        || !Number.isFinite(lat) || Math.abs(lon) > 180 || Math.abs(lat) > 90) {
        throw new Error("O KML contém coordenadas geográficas inválidas.");
      }
      return [lon, lat];
    });
    count.total += points.length;
    if (count.total > 10000) throw new Error("O KML excede 10.000 posições.");
    return points;
  }

  function first(node, name) {
    return node.getElementsByTagNameNS("*", name)[0] || null;
  }

  function parseKml(text) {
    if (typeof text !== "string" || !text.trim() || text.length > 2 * 1024 * 1024) {
      throw new Error("Escolha um KML de até 2 MB.");
    }
    if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw new Error("KML com entidades externas não é aceito.");
    if (typeof root.DOMParser !== "function") throw new Error("Este navegador não consegue ler KML.");
    const xml = new root.DOMParser().parseFromString(text, "application/xml");
    if (first(xml, "parsererror") || xml.documentElement?.localName !== "kml") {
      throw new Error("O arquivo não é um KML válido.");
    }
    const placemarks = [...xml.getElementsByTagNameNS("*", "Placemark")];
    const features = [];
    const count = { total: 0 };
    for (const placemark of placemarks) {
      const name = first(placemark, "name")?.textContent?.trim().slice(0, 100) || "Camada MeteoInfo";
      const geometries = [];
      for (const point of placemark.getElementsByTagNameNS("*", "Point")) {
        const coordinates = readCoordinates(first(point, "coordinates"), count);
        geometries.push({ type: "Point", coordinates: coordinates[0] });
      }
      for (const line of placemark.getElementsByTagNameNS("*", "LineString")) {
        const coordinates = readCoordinates(first(line, "coordinates"), count);
        if (coordinates.length < 2) throw new Error("Linha KML precisa de dois pontos.");
        geometries.push({ type: "LineString", coordinates });
      }
      for (const polygon of placemark.getElementsByTagNameNS("*", "Polygon")) {
        const boundaries = [first(polygon, "outerBoundaryIs"),
          ...polygon.getElementsByTagNameNS("*", "innerBoundaryIs")];
        const coordinates = boundaries.map((boundary) => {
          const ring = readCoordinates(first(boundary, "coordinates"), count);
          if (ring.length < 4 || ring[0][0] !== ring.at(-1)[0]
            || ring[0][1] !== ring.at(-1)[1]) throw new Error("Polígono KML precisa de um anel fechado.");
          return ring;
        });
        geometries.push({ type: "Polygon", coordinates });
      }
      for (const geometry of geometries) {
        features.push({ type: "Feature", properties: { name }, geometry });
        if (features.length > 200) throw new Error("O KML excede 200 feições.");
      }
    }
    if (!features.length) throw new Error("O KML não contém pontos, linhas ou polígonos para mostrar.");
    return { type: "FeatureCollection", features };
  }

  const api = Object.freeze({ parseKml });
  root.ClimaRotaMeteoInfoKml = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
