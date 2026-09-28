"use strict";

(function exposeTripLedger(root) {
  const EVENTS_KEY = "climarota:events:v1";
  const CONSENT_KEY = "climarota:local-history-consent:v1";
  const MAX_EVENTS = 300;

  function readEvents() {
    const saved = localStorage.getItem(EVENTS_KEY);
    if (saved === null) return [];
    const events = JSON.parse(saved);
    if (!Array.isArray(events)) {
      throw new Error("O diário local está inválido. Exporte-o antes de limpar os dados.");
    }
    return events;
  }

  function writeEvent(event) {
    const events = readEvents();
    events.push(event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
    return event;
  }

  function createId() {
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function saveTrip(snapshot) {
    if (!snapshot || !snapshot.destinationName || !Array.isArray(snapshot.forecastSamples)) {
      throw new Error("Não há um resumo de viagem válido para registrar.");
    }
    const distanceKm = Number(snapshot.distanceKm);
    const durationSeconds = Number(snapshot.durationSeconds);
    if (!Number.isFinite(distanceKm) || !Number.isFinite(durationSeconds) || durationSeconds < 0) {
      throw new Error("Distância ou duração inválida; a viagem não foi registrada.");
    }
    const payload = {
      tripId: createId(),
      originName: String(snapshot.originName || "Ponto inicial"),
      destinationName: String(snapshot.destinationName),
      distanceKm,
      durationSeconds,
      observedAt: new Date().toISOString(),
      estimatedArrivalAt: new Date(Date.now() + (durationSeconds * 1000)).toISOString(),
      forecastSamples: snapshot.forecastSamples.map((sample) => ({
        distanceKm: Number(sample.distanceKm),
        precipitationProbability: Number(sample.forecast?.precipitationProbability),
        weatherCode: Number(sample.forecast?.weatherCode),
        temperature: Number(sample.forecast?.temperature),
      })).filter((sample) => Object.values(sample).every(Number.isFinite)),
    };
    if (payload.forecastSamples.length === 0) {
      throw new Error("Sem previsões horárias válidas; a viagem não foi registrada.");
    }
    writeEvent({ type: "trip_saved", occurredAt: new Date().toISOString(), payload });
    return payload;
  }

  function saveOutcome(tripId, outcome) {
    if (!["rained", "dry"].includes(outcome)) {
      throw new Error("Selecione um resultado válido para avaliar a previsão.");
    }
    const events = readEvents();
    const trip = events.find((event) => event.type === "trip_saved" && event.payload.tripId === tripId);
    if (!trip) throw new Error("A viagem não foi encontrada no diário local.");
    if (!canEvaluate(trip)) {
      throw new Error("A avaliação fica disponível após o horário estimado de chegada.");
    }
    if (events.some((event) => event.type === "trip_outcome" && event.payload.tripId === tripId)) {
      throw new Error("Esta viagem já tem uma avaliação registrada.");
    }
    const samples = trip.payload.forecastSamples;
    if (!samples.length) throw new Error("A viagem não tem dados de previsão para avaliar.");
    const probability = Math.max(...samples.map((sample) => sample.precipitationProbability));
    return writeEvent({
      type: "trip_outcome",
      occurredAt: new Date().toISOString(),
      payload: {
        tripId,
        observedRain: outcome === "rained" ? 1 : 0,
        forecastProbability: probability / 100,
      },
    });
  }

  function canEvaluate(trip) {
    const arrivalTime = Date.parse(trip?.payload?.estimatedArrivalAt);
    return Number.isFinite(arrivalTime) && arrivalTime <= Date.now();
  }

  function summarize(events = readEvents()) {
    const trips = events.filter((event) => event.type === "trip_saved");
    const outcomes = events.filter((event) => event.type === "trip_outcome");
    const tripsWithOutcomes = trips.filter((trip) => outcomes.some(
      (outcome) => outcome.payload.tripId === trip.payload.tripId,
    ));
    const scores = tripsWithOutcomes.map((trip) => {
      const outcome = outcomes.find((event) => event.payload.tripId === trip.payload.tripId);
      return (outcome.payload.forecastProbability - outcome.payload.observedRain) ** 2;
    });
    return {
      trips,
      outcomes,
      evaluatedCount: scores.length,
      brierScore: scores.length
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : null,
    };
  }

  function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === "yes";
  }

  function setConsent(consented) {
    if (consented) {
      localStorage.setItem(CONSENT_KEY, "yes");
    } else {
      localStorage.removeItem(CONSENT_KEY);
    }
  }

  function clearHistory() {
    localStorage.removeItem(EVENTS_KEY);
  }

  const api = Object.freeze({
    readEvents,
    saveTrip,
    saveOutcome,
    summarize,
    canEvaluate,
    hasConsent,
    setConsent,
    clearHistory,
  });
  root.ClimaRotaTripLedger = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
