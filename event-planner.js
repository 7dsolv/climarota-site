"use strict";

(function exposeEventPlanner(root) {
  const MAX_SHARE_LENGTH = 1800;

  function cleanText(value, label, maximumLength, required = true) {
    if (typeof value !== "string") throw new Error(`${label} inválido.`);
    const result = value.trim().replace(/\s+/g, " ");
    if (required && !result) throw new Error(`${label} é obrigatório.`);
    if (result.length > maximumLength) {
      throw new Error(`${label} deve ter no máximo ${maximumLength} caracteres.`);
    }
    return result;
  }

  function validateDate(value) {
    const date = cleanText(value ?? "", "Data do evento", 10, false);
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Informe a data do evento no formato válido.");
    }
    if (date) {
      const parsed = new Date(`${date}T00:00:00Z`);
      if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
        throw new Error("A data do evento não existe.");
      }
    }
    return date;
  }

  function validateEvent(event) {
    if (!event || typeof event !== "object") throw new Error("Dados do evento inválidos.");
    const result = {
      name: cleanText(event.name, "Nome do evento", 100),
      venue: cleanText(event.venue, "Local do evento", 140),
      latitude: Number(event.latitude),
      longitude: Number(event.longitude),
      date: validateDate(event.date),
    };
    if (!Number.isFinite(result.latitude) || Math.abs(result.latitude) > 85
      || !Number.isFinite(result.longitude) || Math.abs(result.longitude) > 180) {
      throw new Error("As coordenadas do ponto de encontro são inválidas.");
    }
    return Object.freeze(result);
  }

  function buildSearchLinks(query, location, date) {
    const eventName = cleanText(query, "Busca", 100);
    const eventLocation = cleanText(location ?? "", "Cidade ou região", 100, false);
    const eventDate = validateDate(date);
    const searchText = [eventName, eventLocation, eventDate].filter(Boolean).join(" ");
    const providers = [
      ["Google — eventos", "eventos shows ingressos"],
      ["Ticketmaster", "site:ticketmaster.com.br ingresso"],
      ["Sympla", "site:sympla.com.br ingressos"],
      ["Eventbrite", "site:eventbrite.com.br ingresso evento"],
    ];
    return providers.map(([label, scope]) => {
      const url = new URL("https://www.google.com/search");
      url.searchParams.set("q", `${scope} ${searchText}`);
      return Object.freeze({ label, url: url.toString() });
    });
  }

  function createMeetupUrl(baseUrl, event) {
    const validated = validateEvent(event);
    const url = new URL(baseUrl);
    url.hash = new URLSearchParams({ meetup: JSON.stringify(validated) }).toString();
    if (url.toString().length > MAX_SHARE_LENGTH) {
      throw new Error("O link do ponto de encontro excedeu o limite.");
    }
    return url.toString();
  }

  function readMeetupUrl(href) {
    const url = new URL(href);
    if (!url.hash.startsWith("#")) return null;
    const parameters = new URLSearchParams(url.hash.slice(1));
    const serialized = parameters.get("meetup");
    if (serialized === null) return null;
    if (url.hash.length > MAX_SHARE_LENGTH) throw new Error("O link do evento é muito longo.");
    let event;
    try {
      event = JSON.parse(serialized);
    } catch {
      throw new Error("O link do ponto de encontro está corrompido.");
    }
    return validateEvent(event);
  }

  const api = Object.freeze({ buildSearchLinks, createMeetupUrl, readMeetupUrl, validateEvent });
  root.ClimaRotaEventPlanner = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
