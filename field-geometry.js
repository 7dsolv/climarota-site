"use strict";

(function exposeFieldGeometry(root) {
  const EARTH_RADIUS_METERS = 6371008.8;

  function validatePoint(point) {
    if (!Array.isArray(point) || point.length < 2
      || !Number.isFinite(point[0]) || !Number.isFinite(point[1])
      || Math.abs(point[0]) > 180 || Math.abs(point[1]) > 90) {
      throw new Error("A medição contém uma coordenada inválida.");
    }
  }

  function distanceMeters(start, end) {
    validatePoint(start);
    validatePoint(end);
    const radians = (degrees) => degrees * Math.PI / 180;
    const latitudeStart = radians(start[1]);
    const latitudeEnd = radians(end[1]);
    const latitudeDelta = latitudeEnd - latitudeStart;
    const longitudeDelta = radians(end[0] - start[0]);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(latitudeStart) * Math.cos(latitudeEnd) * Math.sin(longitudeDelta / 2) ** 2;
    return 2 * EARTH_RADIUS_METERS
      * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  function lineLengthMeters(points) {
    if (!Array.isArray(points) || points.length < 2) {
      throw new Error("Adicione ao menos dois pontos para medir uma distância.");
    }
    return points.slice(1).reduce(
      (total, point, index) => total + distanceMeters(points[index], point),
      0,
    );
  }

  function polygonAreaSquareMeters(points) {
    if (!Array.isArray(points) || points.length < 3) {
      throw new Error("Adicione ao menos três pontos para medir uma área.");
    }
    points.forEach(validatePoint);
    let signedArea = 0;
    for (let index = 0; index < points.length; index += 1) {
      const current = points[index];
      const next = points[(index + 1) % points.length];
      let longitudeDelta = next[0] - current[0];
      if (longitudeDelta > 180) longitudeDelta -= 360;
      if (longitudeDelta < -180) longitudeDelta += 360;
      signedArea += longitudeDelta * Math.PI / 180
        * (2 + Math.sin(current[1] * Math.PI / 180)
          + Math.sin(next[1] * Math.PI / 180));
    }
    return Math.abs(signedArea * EARTH_RADIUS_METERS ** 2 / 2);
  }

  const api = Object.freeze({ distanceMeters, lineLengthMeters, polygonAreaSquareMeters });
  root.ClimaRotaFieldGeometry = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
