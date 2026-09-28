"use strict";

(function exposeRouteAnalysis(root) {
  const SAMPLE_FRACTIONS = [0, 0.25, 0.5, 0.75, 1];

  function distanceBetween(first, second) {
    const radians = (degrees) => (degrees * Math.PI) / 180;
    const latitudeDelta = radians(second[1] - first[1]);
    const longitudeDelta = radians(second[0] - first[0]);
    const latitudeA = radians(first[1]);
    const latitudeB = radians(second[1]);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  function sampleRoute(geometry) {
    if (!geometry || geometry.type !== "LineString" || !Array.isArray(geometry.coordinates)) {
      throw new Error("A geometria da rota está ausente ou inválida.");
    }
    const coordinates = geometry.coordinates;
    if (coordinates.length < 2 || coordinates.some((point) => (
      !Array.isArray(point)
      || point.length < 2
      || !Number.isFinite(point[0])
      || !Number.isFinite(point[1])
      || Math.abs(point[0]) > 180
      || Math.abs(point[1]) > 90
    ))) {
      throw new Error("A geometria da rota contém coordenadas inválidas.");
    }

    const cumulativeMeters = [0];
    for (let index = 1; index < coordinates.length; index += 1) {
      cumulativeMeters.push(
        cumulativeMeters[index - 1] + distanceBetween(coordinates[index - 1], coordinates[index]),
      );
    }
    const totalMeters = cumulativeMeters.at(-1);
    if (!Number.isFinite(totalMeters) || totalMeters <= 0) {
      throw new Error("A rota não tem distância suficiente para estimar o clima.");
    }

    return SAMPLE_FRACTIONS.map((fraction) => {
      const targetMeters = totalMeters * fraction;
      let upperIndex = cumulativeMeters.findIndex((meters) => meters >= targetMeters);
      if (upperIndex < 1) upperIndex = 1;
      const lowerIndex = upperIndex - 1;
      const segmentMeters = cumulativeMeters[upperIndex] - cumulativeMeters[lowerIndex];
      const segmentFraction = segmentMeters === 0
        ? 0
        : (targetMeters - cumulativeMeters[lowerIndex]) / segmentMeters;
      const start = coordinates[lowerIndex];
      const end = coordinates[upperIndex];
      return {
        fraction,
        distanceKm: (targetMeters / 1000),
        latitude: start[1] + (end[1] - start[1]) * segmentFraction,
        longitude: start[0] + (end[0] - start[0]) * segmentFraction,
      };
    });
  }

  function hourAsUtc(dateTime, utcOffsetSeconds = 0) {
    const parsed = Date.parse(`${dateTime}:00Z`);
    if (!Number.isFinite(parsed)) return null;
    return parsed - (Number(utcOffsetSeconds) * 1000);
  }

  function selectForecastAt(weather, targetTimeMs) {
    if (!weather?.hourly?.time?.length || !Number.isFinite(targetTimeMs)) return null;
    const hours = weather.hourly.time;
    let closestIndex = -1;
    let closestDifference = Infinity;
    for (let index = 0; index < hours.length; index += 1) {
      const hour = hourAsUtc(hours[index], weather.utc_offset_seconds);
      if (hour === null) continue;
      const difference = Math.abs(hour - targetTimeMs);
      if (difference < closestDifference) {
        closestDifference = difference;
        closestIndex = index;
      }
    }
    if (closestIndex < 0 || closestDifference > 90 * 60 * 1000) return null;

    const probability = weather.hourly.precipitation_probability?.[closestIndex];
    const weatherCode = weather.hourly.weather_code?.[closestIndex];
    const temperature = weather.hourly.temperature_2m?.[closestIndex];
    if (![probability, weatherCode, temperature].every(Number.isFinite)) return null;
    return {
      time: hours[closestIndex],
      precipitationProbability: probability,
      weatherCode,
      temperature,
    };
  }

  async function analyzeRoute(geometry, durationSeconds, departureTimeMs = Date.now()) {
    if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
      throw new Error("A duração estimada da rota é inválida.");
    }
    const samples = sampleRoute(geometry);
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
      latitude: samples.map((point) => point.latitude.toFixed(5)).join(","),
      longitude: samples.map((point) => point.longitude.toFixed(5)).join(","),
      hourly: "temperature_2m,precipitation_probability,weather_code",
      forecast_days: "2",
      timezone: "auto",
    });
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Clima ao longo da rota indisponível (HTTP ${response.status}).`);
    }
    const forecasts = await response.json();
    if (!Array.isArray(forecasts) || forecasts.length !== samples.length) {
      throw new Error("A resposta meteorológica da rota está incompleta.");
    }
    return samples.map((sample, index) => ({
      ...sample,
      forecast: selectForecastAt(
        forecasts[index],
        departureTimeMs + (durationSeconds * sample.fraction * 1000),
      ),
    }));
  }

  const api = Object.freeze({ sampleRoute, selectForecastAt, analyzeRoute });
  root.ClimaRotaRouteAnalysis = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
