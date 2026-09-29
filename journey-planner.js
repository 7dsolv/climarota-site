"use strict";

(function exposeJourneyPlanner(root) {
  function validateDestination(destination) {
    const latitude = destination?.lat;
    const longitude = destination?.lon;
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90
      || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      throw new Error("O destino da viagem contém coordenadas inválidas.");
    }
    return { latitude, longitude };
  }

  function estimateFuel(distanceKm, consumptionKmPerLiter, pricePerLiter) {
    if (!Number.isFinite(distanceKm) || distanceKm < 0 || distanceKm > 20000) {
      throw new Error("A distância da viagem é inválida.");
    }
    if (!Number.isFinite(consumptionKmPerLiter)
      || consumptionKmPerLiter <= 0 || consumptionKmPerLiter > 100) {
      throw new Error("Informe um consumo entre 0 e 100 km/L.");
    }
    if (!Number.isFinite(pricePerLiter) || pricePerLiter <= 0 || pricePerLiter > 1000) {
      throw new Error("Informe um preço por litro válido.");
    }
    const liters = distanceKm / consumptionKmPerLiter;
    return Object.freeze({ liters, fuelCost: liters * pricePerLiter });
  }

  function buildTravelLinks(destination) {
    const { latitude, longitude } = validateDestination(destination);
    const position = `${latitude},${longitude}`;

    const waze = new URL("https://www.waze.com/ul");
    waze.searchParams.set("ll", position);
    waze.searchParams.set("navigate", "yes");
    waze.searchParams.set("utm_source", "climarota");

    const googleMaps = new URL("https://www.google.com/maps/dir/");
    googleMaps.searchParams.set("api", "1");
    googleMaps.searchParams.set("destination", position);
    googleMaps.searchParams.set("travelmode", "driving");

    const hotels = new URL("https://www.google.com/maps/search/");
    hotels.searchParams.set("api", "1");
    hotels.searchParams.set("query", `hotéis perto de ${position}`);

    return Object.freeze({
      waze: waze.toString(),
      googleMaps: googleMaps.toString(),
      hotels: hotels.toString(),
    });
  }

  const api = Object.freeze({ estimateFuel, buildTravelLinks });
  root.ClimaRotaJourneyPlanner = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
