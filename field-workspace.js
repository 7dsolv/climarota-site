"use strict";

(function exposeFieldWorkspace(root) {
  const SITES_KEY = "climarota:field-sites:v1";
  const CONSENT_KEY = "climarota:field-sites-consent:v1";
  const MAX_SITES = 150;
  const SITE_KINDS = Object.freeze({
    work: Object.freeze({ label: "Local de trabalho", icon: "🏗" }),
    measurement: Object.freeze({ label: "Ponto de medição", icon: "📐" }),
    hazard: Object.freeze({ label: "Perigo observado — não verificado", icon: "⚠" }),
    shelter: Object.freeze({ label: "Abrigo indicado — confirmar localmente", icon: "⛑" }),
  });
  let sessionSites = [];

  function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === "yes";
  }

  function readSavedSites() {
    if (!hasConsent()) return [];
    const value = localStorage.getItem(SITES_KEY);
    if (value === null) return [];
    const sites = JSON.parse(value);
    if (!Array.isArray(sites) || sites.some((site) => !isValidSite(site))) {
      throw new Error("As anotações salvas estão inválidas; exporte ou apague os dados antes de usar.");
    }
    return sites;
  }

  function isValidSite(site) {
    return site
      && typeof site.id === "string"
      && typeof site.name === "string"
      && typeof site.kind === "string"
      && Object.hasOwn(SITE_KINDS, site.kind)
      && Number.isFinite(site.latitude)
      && Math.abs(site.latitude) <= 90
      && Number.isFinite(site.longitude)
      && Math.abs(site.longitude) <= 180;
  }

  function readSites() {
    return [...readSavedSites(), ...sessionSites];
  }

  function createId() {
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function addSite(site, persist = hasConsent()) {
    const name = String(site?.name || "").trim();
    if (!name || name.length > 70) {
      throw new Error("Informe um nome de até 70 caracteres para a anotação.");
    }
    if (!SITE_KINDS[site.kind]) throw new Error("O tipo do ponto de campo é inválido.");
    if (!Number.isFinite(site.latitude) || Math.abs(site.latitude) > 90
      || !Number.isFinite(site.longitude) || Math.abs(site.longitude) > 180) {
      throw new Error("O ponto de campo contém coordenadas inválidas.");
    }
    const savedSite = {
      id: createId(),
      name,
      kind: site.kind,
      latitude: site.latitude,
      longitude: site.longitude,
      observedAt: new Date().toISOString(),
    };
    if (!persist) {
      sessionSites.push(savedSite);
      return savedSite;
    }
    if (!hasConsent()) {
      throw new Error("Ative o armazenamento local antes de salvar pontos entre sessões.");
    }
    const savedSites = readSavedSites();
    if (savedSites.length >= MAX_SITES) {
      throw new Error(`O limite local é de ${MAX_SITES} pontos; apague os antigos antes de continuar.`);
    }
    localStorage.setItem(SITES_KEY, JSON.stringify([...savedSites, savedSite]));
    return savedSite;
  }

  function setConsent(enabled) {
    if (enabled) {
      if (sessionSites.length) {
        const savedSites = hasConsent() ? readSavedSites() : [];
        const available = MAX_SITES - savedSites.length;
        if (sessionSites.length > available) {
          throw new Error(`Há ${sessionSites.length} pontos nesta sessão, mas o diário local comporta somente mais ${available}.`);
        }
        localStorage.setItem(SITES_KEY, JSON.stringify([...savedSites, ...sessionSites]));
        sessionSites = [];
      }
      localStorage.setItem(CONSENT_KEY, "yes");
    } else {
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(SITES_KEY);
      sessionSites = [];
    }
  }

  function clearSites() {
    localStorage.removeItem(SITES_KEY);
    sessionSites = [];
  }

  function exportSites() {
    return JSON.stringify(readSites(), null, 2);
  }

  const api = Object.freeze({
    SITE_KINDS,
    hasConsent,
    readSites,
    addSite,
    setConsent,
    clearSites,
    exportSites,
  });
  root.ClimaRotaFieldWorkspace = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
