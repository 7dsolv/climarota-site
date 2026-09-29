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

  function estimateRentalCost(days, pricePerDay) {
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      throw new Error("Informe de 1 a 365 dias de aluguel.");
    }
    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0 || pricePerDay > 100000) {
      throw new Error("Informe uma diária válida para o carro alugado.");
    }
    return days * pricePerDay;
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
      rentalCars: "https://www.booking.com/cars/",
    });
  }

  function validIsoDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function buildBookingSearchLink(destination, stay) {
    validateDestination(destination);
    const place = typeof destination.name === "string" ? destination.name.trim() : "";
    if (!place || place.length > 150) {
      throw new Error("Escolha um destino com nome para pesquisar hospedagem.");
    }
    if (!validIsoDate(stay?.checkin) || !validIsoDate(stay?.checkout)
      || stay.checkout <= stay.checkin) {
      throw new Error("Informe datas válidas de entrada e saída para a hospedagem.");
    }
    if (!Number.isInteger(stay.adults) || stay.adults < 1 || stay.adults > 16
      || !Number.isInteger(stay.rooms) || stay.rooms < 1 || stay.rooms > 8
      || stay.rooms > stay.adults) {
      throw new Error("Informe uma quantidade válida de adultos e quartos.");
    }
    const url = new URL("https://www.booking.com/searchresults.html");
    url.searchParams.set("ss", place);
    url.searchParams.set("checkin", stay.checkin);
    url.searchParams.set("checkout", stay.checkout);
    url.searchParams.set("group_adults", String(stay.adults));
    url.searchParams.set("no_rooms", String(stay.rooms));
    return url.toString();
  }

  const api = Object.freeze({ estimateFuel, estimateRentalCost, buildTravelLinks, buildBookingSearchLink });
  root.ClimaRotaJourneyPlanner = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
