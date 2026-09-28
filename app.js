"use strict";

const INITIAL_LOCATION = {
  lat: -23.5505,
  lon: -46.6333,
  name: "São Paulo, SP",
};

const weatherDescriptions = {
  0: ["Céu limpo", "☀"],
  1: ["Predominantemente limpo", "🌤"],
  2: ["Parcialmente nublado", "⛅"],
  3: ["Nublado", "☁"],
  45: ["Neblina", "〰"],
  48: ["Neblina com geada", "〰"],
  51: ["Garoa leve", "☂"],
  53: ["Garoa moderada", "☂"],
  55: ["Garoa intensa", "☂"],
  56: ["Garoa congelante leve", "❄"],
  57: ["Garoa congelante intensa", "❄"],
  61: ["Chuva leve", "☂"],
  63: ["Chuva moderada", "☂"],
  65: ["Chuva intensa", "☂"],
  66: ["Chuva congelante leve", "❄"],
  67: ["Chuva congelante intensa", "❄"],
  71: ["Neve leve", "❄"],
  73: ["Neve moderada", "❄"],
  75: ["Neve intensa", "❄"],
  77: ["Grãos de neve", "❄"],
  80: ["Pancadas de chuva leves", "🌦"],
  81: ["Pancadas de chuva moderadas", "🌧"],
  82: ["Pancadas de chuva fortes", "🌧"],
  85: ["Pancadas de neve leves", "❄"],
  86: ["Pancadas de neve fortes", "❄"],
  95: ["Trovoada", "⚡"],
  96: ["Trovoada com granizo leve", "⛈"],
  99: ["Trovoada com granizo forte", "⛈"],
};

const elements = {
  locateButton: document.querySelector("#locate-button"),
  destinationForm: document.querySelector("#destination-form"),
  destinationInput: document.querySelector("#destination-input"),
  locationName: document.querySelector("#location-name"),
  updatedAt: document.querySelector("#updated-at"),
  temperature: document.querySelector("#temperature"),
  weatherDescription: document.querySelector("#weather-description"),
  weatherSymbol: document.querySelector("#weather-symbol"),
  feelsLike: document.querySelector("#feels-like"),
  wind: document.querySelector("#wind"),
  humidity: document.querySelector("#humidity"),
  rainNow: document.querySelector("#rain-now"),
  forecastList: document.querySelector("#forecast-list"),
  notice: document.querySelector("#notice"),
  routeCard: document.querySelector("#route-card"),
  routeDestination: document.querySelector("#route-destination"),
  routeSummary: document.querySelector("#route-summary"),
  clearRoute: document.querySelector("#clear-route"),
  destinationWeather: document.querySelector("#destination-weather"),
  destinationWeatherName: document.querySelector("#destination-weather-name"),
  destinationSymbol: document.querySelector("#destination-symbol"),
  destinationTemperature: document.querySelector("#destination-temperature"),
  destinationDescription: document.querySelector("#destination-description"),
  destinationRain: document.querySelector("#destination-rain"),
  routeAnalysis: document.querySelector("#route-analysis"),
  analysisSummary: document.querySelector("#analysis-summary"),
  routeWeatherList: document.querySelector("#route-weather-list"),
  workType: document.querySelector("#work-type"),
  workStatusBadge: document.querySelector("#work-status-badge"),
  workTemperature: document.querySelector("#work-temperature"),
  workWind: document.querySelector("#work-wind"),
  workRain: document.querySelector("#work-rain"),
  workRiskList: document.querySelector("#work-risk-list"),
  workspaceConsent: document.querySelector("#workspace-consent"),
  fieldSiteList: document.querySelector("#field-site-list"),
  clearSites: document.querySelector("#clear-sites"),
  exportSites: document.querySelector("#export-sites"),
  countrySelect: document.querySelector("#authority-country"),
  authorityNote: document.querySelector("#authority-note"),
  authorityLink: document.querySelector("#authority-link"),
  trackToggle: document.querySelector("#track-toggle"),
  mapActions: [...document.querySelectorAll("[data-map-mode]")],
  finishMeasurement: document.querySelector("#finish-measurement"),
  measurementStatus: document.querySelector("#measurement-status"),
  clearMeasurements: document.querySelector("#clear-measurements"),
  mapLayer: document.querySelector("#map-layer"),
  siteDialog: document.querySelector("#site-dialog"),
  siteForm: document.querySelector("#site-form"),
  closeSiteDialog: document.querySelector("#close-site-dialog"),
  siteName: document.querySelector("#site-name"),
  siteKind: document.querySelector("#site-kind"),
  siteCoordinateHint: document.querySelector("#site-coordinate-hint"),
  importMinsTrajectory: document.querySelector("#import-mins-trajectory"),
  minsTrajectoryFile: document.querySelector("#mins-trajectory-file"),
  minsTrajectoryDialog: document.querySelector("#mins-trajectory-dialog"),
  minsTrajectoryForm: document.querySelector("#mins-trajectory-form"),
  closeMinsTrajectoryDialog: document.querySelector("#close-mins-trajectory-dialog"),
  minsAnchorLatitude: document.querySelector("#mins-anchor-latitude"),
  minsAnchorLongitude: document.querySelector("#mins-anchor-longitude"),
  minsAnchorYaw: document.querySelector("#mins-anchor-yaw"),
  minsTrajectoryFileName: document.querySelector("#mins-trajectory-file-name"),
  minsTrajectoryStatus: document.querySelector("#mins-trajectory-status"),
  clearMinsTrajectory: document.querySelector("#clear-mins-trajectory"),
  historyConsent: document.querySelector("#history-consent"),
  qualityScore: document.querySelector("#quality-score"),
  historyList: document.querySelector("#history-list"),
  historyActions: document.querySelector("#history-actions"),
  exportHistory: document.querySelector("#export-history"),
  clearHistory: document.querySelector("#clear-history"),
};

let map;
let currentMarker;
let destinationMarker;
let routeLayer;
let currentLocation = { ...INITIAL_LOCATION };
let destination = null;
let currentTripSnapshot = null;
let currentTripId = null;
let historyRefreshTimer;
let streetsLayer;
let terrainLayer;
let fieldMode = null;
let pendingSiteCoordinates = null;
let measurementCoordinates = [];
let measurementLayers = [];
let liveMeasurementLayer = null;
let fieldSiteLayers = [];
let trackWatchId = null;
let trackMarker = null;
let trackAccuracyCircle = null;
let trackTrail = null;
let trackedCoordinates = [];
let latestWorkForecast = null;
let pendingMinsTrajectoryFile = null;
let minsTrajectoryLayer = null;

const WEATHER_AUTHORITIES = Object.freeze({
  BR: {
    label: "INMET",
    url: "https://www.gov.br/inmet/pt-br",
    note: "Abra o INMET para consultar avisos e produtos oficiais. Este painel não acompanha alertas ao vivo.",
  },
  US: {
    label: "NWS",
    url: "https://www.weather.gov/",
    note: "Abra o National Weather Service para consultar alertas locais oficiais. Este painel não acompanha alertas ao vivo.",
  },
  CA: {
    label: "Environment and Climate Change Canada",
    url: "https://weather.gc.ca/warnings/index_e.html",
    note: "Abra os avisos meteorológicos oficiais do Canadá. Este painel não acompanha alertas ao vivo.",
  },
  GB: {
    label: "Met Office",
    url: "https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings",
    note: "Abra avisos e alertas meteorológicos do Met Office. Este painel não acompanha alertas ao vivo.",
  },
  AU: {
    label: "Bureau of Meteorology",
    url: "https://www.bom.gov.au/warnings/",
    note: "Abra alertas e avisos oficiais do Bureau of Meteorology. Este painel não acompanha alertas ao vivo.",
  },
});

const SITE_KIND_LABELS = Object.freeze({
  work: "Local de trabalho",
  measurement: "Ponto de medição",
  hazard: "Perigo informado, não verificado",
  shelter: "Abrigo indicado, confirmar localmente",
});

function describeWeather(code) {
  return weatherDescriptions[code] || ["Condição indisponível", "☁"];
}

function showNotice(message, isError = false) {
  elements.notice.textContent = message;
  elements.notice.classList.toggle("is-error", isError);
  elements.notice.hidden = !message;
}

function setLocationName(name) {
  elements.locationName.textContent = name;
  elements.updatedAt.textContent = `Atualizado às ${new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())}`;
}

function initializeMap() {
  if (!window.L) {
    throw new Error("O mapa não carregou. Verifique a conexão com a internet e recarregue a página.");
  }

  map = L.map("map", { zoomControl: false }).setView(
    [INITIAL_LOCATION.lat, INITIAL_LOCATION.lon],
    12,
  );
  streetsLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  terrainLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>)',
  });
  L.control.zoom({ position: "bottomright" }).addTo(map);
  currentMarker = L.marker([currentLocation.lat, currentLocation.lon])
    .addTo(map)
    .bindPopup("Ponto de referência");
  map.on("click", handleMapClick);
  elements.mapLayer.addEventListener("change", () => {
    if (!map || !streetsLayer || !terrainLayer) return;
    if (elements.mapLayer.value === "terrain") {
      map.removeLayer(streetsLayer);
      terrainLayer.addTo(map);
      document.querySelector(".map-attribution").innerHTML = 'Mapa © <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a> · © OpenStreetMap · rotas © OSRM';
    } else {
      map.removeLayer(terrainLayer);
      streetsLayer.addTo(map);
      document.querySelector(".map-attribution").innerHTML = 'Mapa © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> · rotas © OSRM';
    }
  });
}

async function loadWeather(location) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: "2",
    timezone: "auto",
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Serviço meteorológico indisponível (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (!data.current || !data.hourly) {
    throw new Error("A previsão recebida está incompleta. Tente novamente.");
  }
  renderWeather(data);
  latestWorkForecast = forecastForCurrentHour(data);
  renderWorkConditions();
}

function forecastForCurrentHour(data) {
  const current = data.current;
  const hourly = data.hourly;
  const currentHour = current.time.slice(11, 13);
  const currentDate = current.time.slice(0, 10);
  const hourIndex = hourly.time.findIndex(
    (time) => time.slice(0, 10) === currentDate && time.slice(11, 13) === currentHour,
  );
  return {
    temperature: Number(current.temperature_2m),
    wind: Number(hourIndex >= 0 ? hourly.wind_speed_10m?.[hourIndex] : current.wind_speed_10m),
    rainProbability: Number(hourIndex >= 0
      ? hourly.precipitation_probability?.[hourIndex]
      : NaN),
    weatherCode: Number(current.weather_code),
  };
}

function renderWeather(data) {
  const current = data.current;
  const [description, symbol] = describeWeather(current.weather_code);
  elements.temperature.textContent = Math.round(current.temperature_2m);
  elements.weatherDescription.textContent = description;
  elements.weatherSymbol.textContent = symbol;
  elements.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;
  elements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  elements.humidity.textContent = `${current.relative_humidity_2m}%`;
  elements.rainNow.textContent = `${Number(current.precipitation).toLocaleString("pt-BR")} mm`;

  const now = new Date(current.time).getTime();
  const upcoming = data.hourly.time
    .map((time, index) => ({ time, index }))
    .filter(({ time }) => new Date(time).getTime() >= now)
    .slice(0, 6);

  elements.forecastList.replaceChildren();
  for (const { time, index } of upcoming) {
    const [hourDescription, hourSymbol] = describeWeather(data.hourly.weather_code[index]);
    const item = document.createElement("div");
    item.className = "forecast-item";

    const timeElement = document.createElement("time");
    timeElement.dateTime = time;
    timeElement.textContent = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: data.timezone,
    }).format(new Date(time));
    timeElement.setAttribute("aria-label", hourDescription);

    const icon = document.createElement("span");
    icon.className = "forecast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = hourSymbol;

    const temperature = document.createElement("span");
    temperature.className = "forecast-temp";
    temperature.textContent = `${Math.round(data.hourly.temperature_2m[index])}°`;

    const rain = document.createElement("span");
    rain.className = "forecast-rain";
    rain.textContent = `${data.hourly.precipitation_probability[index] ?? 0}%`;

    item.append(timeElement, icon, temperature, rain);
    elements.forecastList.append(item);
  }
}

function renderWorkConditions() {
  if (!latestWorkForecast) return;
  const forecast = latestWorkForecast;
  elements.workTemperature.textContent = Number.isFinite(forecast.temperature)
    ? `${Math.round(forecast.temperature)}°C`
    : "--°C";
  elements.workWind.textContent = Number.isFinite(forecast.wind)
    ? `${Math.round(forecast.wind)} km/h`
    : "-- km/h";
  elements.workRain.textContent = Number.isFinite(forecast.rainProbability)
    ? `${forecast.rainProbability}%`
    : "--%";

  const assessment = window.ClimaRotaFieldWeather.assessWorkWindow(
    forecast,
    elements.workType.value,
  );
  elements.workStatusBadge.textContent = assessment.label;
  elements.workStatusBadge.className = `work-status-badge work-status-${assessment.level}`;
  elements.workRiskList.replaceChildren();
  for (const reason of assessment.reasons) {
    const item = document.createElement("li");
    item.textContent = reason;
    elements.workRiskList.append(item);
  }
}

function locateUser() {
  if (!navigator.geolocation) {
    showNotice("Este navegador não oferece suporte à localização GPS.", true);
    return;
  }

  elements.locateButton.disabled = true;
  elements.locateButton.textContent = "Obtendo localização…";
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      currentLocation = {
        ...currentLocation,
        lat: coords.latitude,
        lon: coords.longitude,
        name: "Sua localização",
      };
      if (currentMarker && map) {
        currentMarker.setLatLng([currentLocation.lat, currentLocation.lon])
          .bindPopup("Sua localização");
        map.setView([currentLocation.lat, currentLocation.lon], 14);
      }
      setLocationName(currentLocation.name);
      showNotice("");
      try {
        await loadWeather(currentLocation);
      } catch (error) {
        showNotice(error.message, true);
      } finally {
        elements.locateButton.disabled = false;
        elements.locateButton.innerHTML = '<span aria-hidden="true">◎</span> Usar minha localização';
      }
      if (destination && map) {
        calculateRoute(destination).catch((error) => showNotice(error.message, true));
      }
    },
    (error) => {
      const messages = {
        1: "Permissão de localização negada. Autorize o GPS nas configurações do navegador.",
        2: "Não foi possível determinar sua posição. Verifique o GPS e tente de novo.",
        3: "A localização demorou demais. Tente novamente em um local com melhor sinal.",
      };
      showNotice(messages[error.code] || "Não foi possível acessar sua localização.", true);
      elements.locateButton.disabled = false;
      elements.locateButton.innerHTML = '<span aria-hidden="true">◎</span> Usar minha localização';
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
  );
}

async function findDestination(query) {
  const url = new URL("https://photon.komoot.io/api/");
  url.search = new URLSearchParams({ q: query, limit: "1" });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Busca de lugares indisponível (HTTP ${response.status}).`);
  }
  const data = await response.json();
  const feature = data.features?.[0];
  if (!feature) {
    throw new Error("Não encontrei esse destino. Tente informar cidade e estado.");
  }
  const coordinates = feature.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2 || !feature.properties) {
    throw new Error("A busca retornou um resultado de destino incompleto.");
  }
  const [lon, lat] = coordinates;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error("A busca retornou coordenadas inválidas para o destino.");
  }
  const properties = feature.properties;
  const name = [
    properties.name,
    properties.city,
    properties.state,
  ].filter(Boolean).filter((part, index, parts) => parts.indexOf(part) === index).join(", ");
  return { lat, lon, name: name || query };
}

async function calculateRoute(target) {
  if (!map) {
    throw new Error("O mapa não está disponível. Recarregue a página e tente de novo.");
  }
  const coords = `${currentLocation.lon},${currentLocation.lat};${target.lon},${target.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Serviço de rotas indisponível (HTTP ${response.status}).`);
  }
  const data = await response.json();
  const route = data.routes?.[0];
  if (!route) {
    throw new Error("Não foi possível traçar uma rota de carro para esse destino.");
  }
  if (!Number.isFinite(route.distance) || route.distance < 0
    || !Number.isFinite(route.duration) || route.duration < 0
    || !route.geometry) {
    throw new Error("O serviço de rotas retornou uma estimativa inválida.");
  }

  destination = target;
  if (routeLayer) map.removeLayer(routeLayer);
  routeLayer = L.geoJSON(route.geometry, {
    style: { color: "#577b32", weight: 6, opacity: 0.9 },
  }).addTo(map);
  if (destinationMarker) map.removeLayer(destinationMarker);
  destinationMarker = L.marker([target.lat, target.lon])
    .addTo(map)
    .bindPopup(target.name);
  map.fitBounds(routeLayer.getBounds(), { padding: [45, 45] });

  elements.routeDestination.textContent = target.name;
  elements.routeSummary.textContent = `${(route.distance / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km · ${formatDuration(route.duration)}`;
  elements.routeCard.hidden = false;
  elements.destinationWeather.hidden = false;
  elements.destinationWeatherName.textContent = target.name;
  elements.routeAnalysis.hidden = false;
  elements.analysisSummary.textContent = "Calculando previsão para os horários estimados de chegada…";
  elements.routeWeatherList.replaceChildren();
  currentTripSnapshot = null;
  currentTripId = null;

  const tasks = await Promise.allSettled([
    loadDestinationWeather(target),
    window.ClimaRotaRouteAnalysis.analyzeRoute(route.geometry, route.duration),
  ]);
  const destinationResult = tasks[0];
  const routeWeatherResult = tasks[1];
  if (destinationResult.status === "rejected") {
    elements.destinationDescription.textContent = "Previsão temporariamente indisponível";
  }
  if (routeWeatherResult.status === "rejected") {
    elements.analysisSummary.textContent = routeWeatherResult.reason.message;
    elements.routeWeatherList.replaceChildren();
    elements.routeAnalysis.classList.add("analysis-error");
  } else {
    elements.routeAnalysis.classList.remove("analysis-error");
    const samples = routeWeatherResult.value;
    renderRouteWeather(samples);
    currentTripSnapshot = {
      originName: currentLocation.name,
      destinationName: target.name,
      distanceKm: route.distance / 1000,
      durationSeconds: route.duration,
      forecastSamples: samples,
    };
    saveCurrentTrip();
  }
  const errors = tasks
    .filter((task) => task.status === "rejected")
    .map((task) => task.reason.message);
  if (errors.length) throw new Error(errors.join(" "));
}

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

async function loadDestinationWeather(target) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(target.lat),
    longitude: String(target.lon),
    current: "temperature_2m,weather_code",
    hourly: "precipitation_probability",
    forecast_days: "1",
    timezone: "auto",
  });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Previsão no destino indisponível (HTTP ${response.status}).`);
  }
  const data = await response.json();
  const [description, symbol] = describeWeather(data.current.weather_code);
  const currentTime = data.current.time.slice(11, 16);
  const hourIndex = data.hourly.time.findIndex((time) => time.slice(11, 16) === currentTime);
  const rain = hourIndex >= 0 ? data.hourly.precipitation_probability[hourIndex] : null;
  elements.destinationSymbol.textContent = symbol;
  elements.destinationTemperature.textContent = `${Math.round(data.current.temperature_2m)}°`;
  elements.destinationDescription.textContent = description;
  elements.destinationRain.textContent = `Chuva: ${rain ?? "--"}%`;
}

function routeRisk(forecast) {
  if (!forecast) return { label: "Sem dados", level: "unknown" };
  if ([65, 67, 75, 82, 86, 95, 96, 99].includes(forecast.weatherCode)
    || forecast.precipitationProbability >= 60) {
    return { label: "Atenção", level: "high" };
  }
  if (forecast.precipitationProbability >= 30) {
    return { label: "Possibilidade de chuva", level: "medium" };
  }
  return { label: "Baixa chance de chuva", level: "low" };
}

function renderRouteWeather(samples) {
  const available = samples.filter((sample) => sample.forecast);
  if (!available.length) {
    elements.analysisSummary.textContent = "Não há dados horários disponíveis para o período estimado da viagem.";
    elements.routeWeatherList.replaceChildren();
    return;
  }

  const peakProbability = Math.max(...available.map(
    (sample) => sample.forecast.precipitationProbability,
  ));
  const stormExpected = available.some((sample) => [95, 96, 99].includes(sample.forecast.weatherCode));
  if (stormExpected) {
    elements.analysisSummary.textContent = "Trovoada indicada em um trecho: confirme os alertas oficiais antes de sair.";
  } else if (peakProbability >= 60) {
    elements.analysisSummary.textContent = `Chance de chuva elevada em um trecho (${peakProbability}%): considere rever o horário.`;
  } else if (peakProbability >= 30) {
    elements.analysisSummary.textContent = `Há chance de chuva em um trecho (até ${peakProbability}%): leve isso em conta no planejamento.`;
  } else {
    elements.analysisSummary.textContent = `Baixa chance de chuva nos pontos amostrados (máximo ${peakProbability}%).`;
  }

  elements.routeWeatherList.replaceChildren();
  for (const sample of samples) {
    const row = document.createElement("div");
    row.className = "route-weather-row";
    const forecast = sample.forecast;
    if (!forecast) {
    const title = document.createElement("span");
      title.textContent = `${Math.round(sample.distanceKm)} km`;
      const status = document.createElement("span");
      status.textContent = "Previsão indisponível";
      row.append(title, status);
      elements.routeWeatherList.append(row);
      continue;
    }

    const distance = document.createElement("span");
    distance.className = "route-weather-distance";
    distance.textContent = `${Math.round(sample.distanceKm)} km`;
    const conditions = document.createElement("span");
    conditions.className = "route-weather-conditions";
    conditions.textContent = `${Math.round(forecast.temperature)}° · ${forecast.precipitationProbability}% chuva · ${forecast.time.slice(11, 16)} local`;
    const risk = routeRisk(forecast);
    const badge = document.createElement("span");
    badge.className = `route-risk route-risk-${risk.level}`;
    badge.textContent = risk.label;
    row.append(distance, conditions, badge);
    elements.routeWeatherList.append(row);
  }
}

function saveCurrentTrip() {
  if (!elements.historyConsent.checked || !currentTripSnapshot || currentTripId) return;
  try {
    const trip = window.ClimaRotaTripLedger.saveTrip(currentTripSnapshot);
    currentTripId = trip.tripId;
    renderHistory();
  } catch (error) {
    showNotice(`Não foi possível guardar o resumo da viagem: ${error.message}`, true);
  }
}

function renderHistory() {
  window.clearTimeout(historyRefreshTimer);
  elements.historyList.replaceChildren();
  const enabled = elements.historyConsent.checked;
  elements.historyActions.hidden = !enabled;
  if (!enabled) {
    elements.qualityScore.textContent = "Ative o diário para guardar viagens e avaliar previsões.";
    return;
  }

  const summary = window.ClimaRotaTripLedger.summarize();
  if (summary.evaluatedCount === 0) {
    elements.qualityScore.textContent = "Registre uma viagem e informe o resultado após completá-la para avaliar a qualidade da previsão.";
  } else {
    elements.qualityScore.textContent = `Erro Brier ${summary.brierScore.toFixed(4)} em ${summary.evaluatedCount} viagem(ns) avaliada(s). Quanto menor, melhor; amostra pessoal e descritiva, sem ajuste automático do modelo.`;
  }

  for (const event of summary.trips.slice(-3).reverse()) {
    const trip = event.payload;
    const evaluated = summary.outcomes.some((outcome) => outcome.payload.tripId === trip.tripId);
    const item = document.createElement("article");
    item.className = "history-item";
    const heading = document.createElement("strong");
    heading.textContent = trip.destinationName;
    const detail = document.createElement("span");
    const rain = trip.forecastSamples.length
      ? Math.round(Math.max(...trip.forecastSamples.map(
        (sample) => sample.precipitationProbability,
      )))
      : null;
    detail.textContent = `${trip.distanceKm.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km · chance máxima de chuva ${rain ?? "--"}%`;
    item.append(heading, detail);
    if (evaluated) {
      const status = document.createElement("span");
      status.className = "history-evaluated";
      status.textContent = "Resultado informado";
      item.append(status);
    } else if (window.ClimaRotaTripLedger.canEvaluate(event)) {
      const question = document.createElement("span");
      question.textContent = "Choveu durante esse trajeto?";
      item.append(question);
      const actions = document.createElement("div");
      actions.className = "outcome-actions";
      for (const [outcome, label] of [["rained", "Sim, choveu"], ["dry", "Não choveu"]]) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.tripId = trip.tripId;
        button.dataset.outcome = outcome;
        button.textContent = label;
        actions.append(button);
      }
      item.append(actions);
    } else {
      const status = document.createElement("span");
      status.textContent = "Avaliação disponível após o horário estimado de chegada.";
      item.append(status);
    }
    elements.historyList.append(item);
  }

  const nextArrival = summary.trips
    .filter((trip) => !summary.outcomes.some(
      (outcome) => outcome.payload.tripId === trip.payload.tripId,
    ))
    .map((trip) => Date.parse(trip.payload.estimatedArrivalAt))
    .filter((arrivalTime) => Number.isFinite(arrivalTime) && arrivalTime > Date.now())
    .sort((first, second) => first - second)[0];
  if (nextArrival) {
    historyRefreshTimer = window.setTimeout(
      renderHistory,
      Math.min(nextArrival - Date.now() + 1000, 60 * 1000),
    );
  }
}

function exportHistory() {
  const events = window.ClimaRotaTripLedger.readEvents();
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "climarota-diario.json";
  link.click();
  URL.revokeObjectURL(downloadUrl);
}

function setFieldMode(mode) {
  if (["line", "area"].includes(fieldMode) && mode !== fieldMode) {
    if (liveMeasurementLayer && map) map.removeLayer(liveMeasurementLayer);
    liveMeasurementLayer = null;
    measurementCoordinates = [];
  }
  fieldMode = mode;
  elements.mapActions.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.mapMode === mode));
  });
  elements.finishMeasurement.hidden = !["line", "area"].includes(mode);
  if (mode === "site") {
    elements.measurementStatus.textContent = "Clique no mapa para posicionar um marcador de campo.";
    elements.measurementStatus.hidden = false;
  } else if (mode === "line" || mode === "area") {
    measurementCoordinates = [];
    if (liveMeasurementLayer && map) map.removeLayer(liveMeasurementLayer);
    liveMeasurementLayer = null;
    elements.measurementStatus.textContent = mode === "line"
      ? "Clique no mapa para adicionar vértices; conclua com dois ou mais pontos."
      : "Clique no mapa para delimitar a área; conclua com três ou mais vértices.";
    elements.measurementStatus.hidden = false;
  } else if (elements.measurementStatus.textContent.startsWith("Clique no mapa")) {
    elements.measurementStatus.hidden = true;
  }
}

function measurementPointCountLabel() {
  return measurementCoordinates.map((point) => [point.lng, point.lat]);
}

function formatLength(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} km`;
  }
  return `${meters.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} m`;
}

function formatArea(squareMeters) {
  if (squareMeters >= 10000) {
    return `${(squareMeters / 10000).toLocaleString("pt-BR", { maximumFractionDigits: 3 })} ha`;
  }
  return `${squareMeters.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} m²`;
}

function updateLiveMeasurement() {
  const points = measurementPointCountLabel();
  const isArea = fieldMode === "area";
  const shapePoints = isArea && points.length >= 3 ? [...measurementCoordinates, measurementCoordinates[0]] : measurementCoordinates;
  if (liveMeasurementLayer) map.removeLayer(liveMeasurementLayer);
  if (isArea && points.length >= 3) {
    liveMeasurementLayer = L.polygon(shapePoints, {
      color: "#577b32",
      fillColor: "#c6f36b",
      fillOpacity: 0.18,
      weight: 3,
    }).addTo(map);
  } else if (points.length >= 2) {
    liveMeasurementLayer = L.polyline(measurementCoordinates, {
      color: "#577b32",
      dashArray: "7 5",
      weight: 3,
    }).addTo(map);
  } else {
    liveMeasurementLayer = null;
  }

  const minimumPoints = isArea ? 3 : 2;
  if (points.length < minimumPoints) {
    elements.measurementStatus.textContent = `${points.length} ponto(s); adicione pelo menos ${minimumPoints}.`;
    return;
  }
  const value = isArea
    ? formatArea(window.ClimaRotaFieldGeometry.polygonAreaSquareMeters(points))
    : formatLength(window.ClimaRotaFieldGeometry.lineLengthMeters(points));
  elements.measurementStatus.textContent = `${points.length} vértices · ${isArea ? "área aproximada" : "distância"}: ${value}. Conclua para manter o desenho nesta sessão.`;
}

function completeMeasurement() {
  const points = measurementPointCountLabel();
  try {
    if (fieldMode === "line") {
      const length = window.ClimaRotaFieldGeometry.lineLengthMeters(points);
      elements.measurementStatus.textContent = `Distância aproximada: ${formatLength(length)} · ${points.length} pontos.`;
    } else if (fieldMode === "area") {
      const area = window.ClimaRotaFieldGeometry.polygonAreaSquareMeters(points);
      elements.measurementStatus.textContent = `Área aproximada: ${formatArea(area)} · ${points.length} vértices.`;
    } else {
      return;
    }
    if (liveMeasurementLayer) measurementLayers.push(liveMeasurementLayer);
    liveMeasurementLayer = null;
    measurementCoordinates = [];
    setFieldMode(null);
    elements.measurementStatus.hidden = false;
  } catch (error) {
    showNotice(error.message, true);
  }
}

function handleMapClick(event) {
  if (!fieldMode) return;
  if (fieldMode === "site") {
    pendingSiteCoordinates = {
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
    };
    elements.siteCoordinateHint.textContent = elements.workspaceConsent.checked
      ? "As coordenadas deste marcador serão salvas somente neste navegador, porque você ativou essa opção."
      : "O marcador existirá apenas na memória desta sessão. Ative a opção de armazenamento no painel para mantê-lo neste navegador.";
    elements.siteDialog.showModal();
    elements.siteName.focus();
    setFieldMode(null);
    return;
  }
  if (fieldMode === "line" || fieldMode === "area") {
    measurementCoordinates.push(event.latlng);
    updateLiveMeasurement();
  }
}

function renderFieldSites() {
  fieldSiteLayers.forEach((layer) => {
    if (map && map.hasLayer(layer)) map.removeLayer(layer);
  });
  fieldSiteLayers = [];
  const sites = window.ClimaRotaFieldWorkspace.readSites();
  elements.fieldSiteList.replaceChildren();
  elements.clearSites.hidden = sites.length === 0;
  elements.exportSites.hidden = !elements.workspaceConsent.checked || sites.length === 0;

  for (const site of sites) {
    const definition = window.ClimaRotaFieldWorkspace.SITE_KINDS[site.kind];
    let marker;
    if (map) {
      const icon = L.divIcon({
        className: "field-marker-shell",
        html: `<span class="field-marker field-marker-${site.kind}" aria-hidden="true">${definition.icon}</span>`,
        iconSize: [32, 38],
        iconAnchor: [16, 34],
        popupAnchor: [0, -30],
      });
      const popup = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = site.name;
      const type = document.createElement("p");
      type.textContent = SITE_KIND_LABELS[site.kind];
      popup.append(title, type);
      marker = L.marker([site.latitude, site.longitude], { icon })
        .addTo(map)
        .bindPopup(popup);
      fieldSiteLayers.push(marker);
    }

    const item = document.createElement("div");
    item.className = "field-site-item";
    const glyph = document.createElement("span");
    glyph.className = `field-site-glyph field-marker-${site.kind}`;
    glyph.textContent = definition.icon;
    const label = document.createElement("span");
    label.className = "field-site-label";
    label.textContent = site.name;
    const typeLabel = document.createElement("small");
    typeLabel.textContent = SITE_KIND_LABELS[site.kind];
    const focus = document.createElement("button");
    focus.type = "button";
    focus.className = "field-site-focus";
    focus.textContent = "Ver";
    focus.setAttribute("aria-label", `Mostrar no mapa: ${site.name}`);
    focus.addEventListener("click", () => {
      if (!map || !marker) {
        showNotice("O mapa não está disponível; não foi possível focalizar o marcador.", true);
        return;
      }
      map.setView([site.latitude, site.longitude], Math.max(map.getZoom(), 15));
      marker.openPopup();
    });
    item.append(glyph, label, typeLabel, focus);
    elements.fieldSiteList.append(item);
  }
}

function setTrackerButton(isTracking) {
  elements.trackToggle.setAttribute("aria-pressed", String(isTracking));
  elements.trackToggle.classList.toggle("is-tracking", isTracking);
  elements.trackToggle.innerHTML = isTracking
    ? '<span aria-hidden="true">■</span> Parar meu rastreamento'
    : '<span aria-hidden="true">⌖</span> Iniciar meu rastreamento';
}

function stopOwnTracking(clearTrack = true) {
  if (trackWatchId !== null) navigator.geolocation.clearWatch(trackWatchId);
  trackWatchId = null;
  if (clearTrack && map) {
    for (const layer of [trackMarker, trackAccuracyCircle, trackTrail]) {
      if (layer && map.hasLayer(layer)) map.removeLayer(layer);
    }
    trackMarker = null;
    trackAccuracyCircle = null;
    trackTrail = null;
    trackedCoordinates = [];
  }
  setTrackerButton(false);
}

function startOwnTracking() {
  if (!navigator.geolocation) {
    showNotice("Este navegador não oferece suporte à localização.", true);
    return;
  }
  if (trackWatchId !== null) return;
  if (!map) {
    showNotice("O mapa não está disponível; não é possível mostrar sua posição.", true);
    return;
  }
  setTrackerButton(true);
  showNotice("O acompanhamento GPS do seu próprio aparelho fica na memória desta sessão. Nenhuma equipe ou pessoa será rastreada.");
  try {
    trackWatchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const position = [coords.latitude, coords.longitude];
        currentLocation = {
          ...currentLocation,
          lat: coords.latitude,
          lon: coords.longitude,
          name: "Sua localização",
        };
        if (!trackMarker) {
          trackMarker = L.circleMarker(position, {
            radius: 9,
            color: "#fff",
            weight: 3,
            fillColor: "#3478e5",
            fillOpacity: 1,
          }).addTo(map).bindPopup("Seu aparelho · apenas nesta sessão");
          trackAccuracyCircle = L.circle(position, {
            radius: Math.max(0, coords.accuracy || 0),
            color: "#3478e5",
            fillColor: "#3478e5",
            fillOpacity: 0.08,
            weight: 1,
          }).addTo(map);
          trackTrail = L.polyline([], {
            color: "#3478e5",
            opacity: 0.75,
            weight: 3,
          }).addTo(map);
        } else {
          trackMarker.setLatLng(position);
          trackAccuracyCircle.setLatLng(position)
            .setRadius(Math.max(0, coords.accuracy || 0));
        }
        trackedCoordinates.push(position);
        trackedCoordinates = trackedCoordinates.slice(-500);
        trackTrail.setLatLngs(trackedCoordinates);
        map.setView(position, Math.max(map.getZoom(), 14), { animate: false });
        setLocationName("Sua localização · atualizada");
      },
      (error) => {
        const messages = {
          1: "Permissão GPS negada; o rastreamento do aparelho não começou.",
          2: "O GPS não conseguiu determinar sua posição. Verifique o sinal.",
          3: "O GPS demorou demais para responder. Tente novamente.",
        };
        stopOwnTracking();
        showNotice(messages[error.code] || "O rastreamento GPS parou devido a um erro.", true);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    );
  } catch (error) {
    stopOwnTracking();
    showNotice(`Não foi possível iniciar seu rastreamento: ${error.message}`, true);
  }
}

function selectWeatherAuthority() {
  const source = WEATHER_AUTHORITIES[elements.countrySelect.value];
  if (!source) throw new Error("Fonte meteorológica oficial não configurada para essa região.");
  elements.authorityLink.href = source.url;
  elements.authorityLink.textContent = `Abrir ${source.label}`;
  elements.authorityNote.textContent = source.note;
}

function exportFieldSites() {
  const file = new Blob([window.ClimaRotaFieldWorkspace.exportSites()], {
    type: "application/json",
  });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "climarota-anotacoes-campo.json";
  link.click();
  URL.revokeObjectURL(url);
}

function clearRoute() {
  destination = null;
  if (routeLayer && map) map.removeLayer(routeLayer);
  if (destinationMarker && map) map.removeLayer(destinationMarker);
  routeLayer = null;
  destinationMarker = null;
  elements.routeCard.hidden = true;
  elements.destinationWeather.hidden = true;
  elements.routeAnalysis.hidden = true;
  currentTripSnapshot = null;
  currentTripId = null;
  elements.destinationInput.value = "";
  if (map) map.setView([currentLocation.lat, currentLocation.lon], 12);
}

elements.destinationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = elements.destinationInput.value.trim();
  if (!query) {
    showNotice("Digite um destino para traçar a rota.", true);
    elements.destinationInput.focus();
    return;
  }
  elements.destinationForm.querySelector("button").disabled = true;
  showNotice("Buscando destino e calculando trajeto…");
  try {
    const target = await findDestination(query);
    await calculateRoute(target);
    showNotice("");
  } catch (error) {
    showNotice(error.message, true);
  } finally {
    elements.destinationForm.querySelector("button").disabled = false;
  }
});

elements.locateButton.addEventListener("click", locateUser);
elements.clearRoute.addEventListener("click", clearRoute);
elements.importMinsTrajectory.addEventListener("click", () => {
  elements.minsTrajectoryFile.click();
});
elements.minsTrajectoryFile.addEventListener("change", () => {
  const [file] = elements.minsTrajectoryFile.files || [];
  elements.minsTrajectoryFile.value = "";
  if (!file) return;
  if (file.size > 25 * 1024 * 1024) {
    showNotice("O arquivo da trajetória excede o limite de 25 MB.", true);
    return;
  }
  pendingMinsTrajectoryFile = file;
  elements.minsTrajectoryFileName.textContent = `${file.name} · ${(file.size / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} KB. O arquivo será lido somente nesta sessão. A origem informada corresponde ao ponto (0, 0) do referencial local MINS, não necessariamente ao primeiro ponto gravado.`;
  elements.minsTrajectoryStatus.hidden = true;
  elements.minsTrajectoryDialog.showModal();
});
elements.minsTrajectoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = pendingMinsTrajectoryFile;
  if (!file) {
    elements.minsTrajectoryDialog.close();
    showNotice("Selecione novamente o arquivo da trajetória MINS.", true);
    return;
  }
  const anchor = {
    latitude: Number(elements.minsAnchorLatitude.value),
    longitude: Number(elements.minsAnchorLongitude.value),
  };
  const yaw = Number(elements.minsAnchorYaw.value);
  try {
    const samples = window.ClimaRotaMinsTrajectory.parseTrajectory(await file.text());
    const coordinates = window.ClimaRotaMinsTrajectory.toGeographicCoordinates(
      samples,
      anchor,
      yaw,
    );
    const nextLayer = L.polyline(
      coordinates.map(([longitude, latitude]) => [latitude, longitude]),
      { color: "#6546c7", weight: 4, opacity: 0.9 },
    );
    if (minsTrajectoryLayer && map) map.removeLayer(minsTrajectoryLayer);
    minsTrajectoryLayer = nextLayer.addTo(map);
    map.fitBounds(minsTrajectoryLayer.getBounds(), { padding: [35, 35], maxZoom: 16 });
    elements.minsTrajectoryStatus.textContent = `Trilha MINS: ${samples.length.toLocaleString("pt-BR")} poses, apenas nesta sessão. Referência geográfica informada pelo usuário; não é uma solução GNSS do arquivo.`;
    elements.minsTrajectoryStatus.hidden = false;
    elements.clearMinsTrajectory.hidden = false;
    elements.minsTrajectoryDialog.close();
    showNotice("Trilha MINS exibida no mapa; nenhum arquivo ou ponto foi salvo.");
  } catch (error) {
    showNotice(`Não foi possível importar a trajetória MINS: ${error.message}`, true);
  }
});
elements.closeMinsTrajectoryDialog.addEventListener("click", () => {
  elements.minsTrajectoryDialog.close();
});
elements.minsTrajectoryDialog.addEventListener("close", () => {
  pendingMinsTrajectoryFile = null;
  elements.minsTrajectoryForm.reset();
});
elements.clearMinsTrajectory.addEventListener("click", () => {
  if (minsTrajectoryLayer && map) map.removeLayer(minsTrajectoryLayer);
  minsTrajectoryLayer = null;
  elements.minsTrajectoryStatus.hidden = true;
  elements.clearMinsTrajectory.hidden = true;
  showNotice("Trilha MINS removida da memória desta sessão.");
});
elements.trackToggle.addEventListener("click", () => {
  if (trackWatchId === null) startOwnTracking();
  else {
    stopOwnTracking();
    showNotice("O rastreamento do seu aparelho parou; a trilha foi removida da memória.");
  }
});
elements.workType.addEventListener("change", renderWorkConditions);
elements.countrySelect.addEventListener("change", () => {
  try {
    selectWeatherAuthority();
  } catch (error) {
    showNotice(error.message, true);
  }
});
elements.mapActions.forEach((button) => {
  button.addEventListener("click", () => {
    const requestedMode = button.dataset.mapMode;
    setFieldMode(fieldMode === requestedMode ? null : requestedMode);
  });
});
elements.finishMeasurement.addEventListener("click", completeMeasurement);
elements.clearMeasurements.addEventListener("click", () => {
  setFieldMode(null);
  if (liveMeasurementLayer && map) map.removeLayer(liveMeasurementLayer);
  measurementLayers.forEach((layer) => {
    if (map && map.hasLayer(layer)) map.removeLayer(layer);
  });
  measurementLayers = [];
  liveMeasurementLayer = null;
  measurementCoordinates = [];
  elements.measurementStatus.hidden = true;
  showNotice("Desenhos e medições removidos desta sessão.");
});
elements.siteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!pendingSiteCoordinates) {
    showNotice("Clique novamente no mapa para escolher a posição do marcador.", true);
    elements.siteDialog.close();
    return;
  }
  try {
    window.ClimaRotaFieldWorkspace.addSite({
      name: elements.siteName.value,
      kind: elements.siteKind.value,
      ...pendingSiteCoordinates,
    }, elements.workspaceConsent.checked);
    pendingSiteCoordinates = null;
    elements.siteDialog.close();
    elements.siteForm.reset();
    renderFieldSites();
    showNotice("Ponto de campo adicionado ao mapa.");
  } catch (error) {
    showNotice(`Não foi possível adicionar o marcador: ${error.message}`, true);
  }
});
elements.closeSiteDialog.addEventListener("click", () => {
  pendingSiteCoordinates = null;
  elements.siteDialog.close();
});
elements.siteDialog.addEventListener("close", () => {
  pendingSiteCoordinates = null;
});
elements.workspaceConsent.addEventListener("change", () => {
  try {
    if (!elements.workspaceConsent.checked
      && !window.confirm("Revogar o consentimento apagará os pontos persistidos neste navegador. Continuar?")) {
      elements.workspaceConsent.checked = true;
      return;
    }
    window.ClimaRotaFieldWorkspace.setConsent(elements.workspaceConsent.checked);
    renderFieldSites();
    showNotice("");
  } catch (error) {
    elements.workspaceConsent.checked = window.ClimaRotaFieldWorkspace.hasConsent();
    showNotice(`Não foi possível alterar as preferências de armazenamento local: ${error.message}`, true);
  }
});
elements.clearSites.addEventListener("click", () => {
  if (!window.confirm("Apagar todas as anotações de campo deste navegador e desta sessão?")) return;
  try {
    window.ClimaRotaFieldWorkspace.clearSites();
    renderFieldSites();
    showNotice("Anotações de campo apagadas.");
  } catch (error) {
    showNotice(`Não foi possível apagar as anotações: ${error.message}`, true);
  }
});
elements.exportSites.addEventListener("click", () => {
  try {
    exportFieldSites();
  } catch (error) {
    showNotice(`Não foi possível exportar as anotações: ${error.message}`, true);
  }
});
window.addEventListener("pagehide", () => stopOwnTracking());
elements.historyConsent.addEventListener("change", () => {
  try {
    if (!elements.historyConsent.checked) {
      if (!window.confirm("Desativar o diário também apagará os resumos e avaliações guardados neste aparelho. Continuar?")) {
        elements.historyConsent.checked = true;
        return;
      }
      window.ClimaRotaTripLedger.setConsent(false);
      window.ClimaRotaTripLedger.clearHistory();
      currentTripId = null;
    } else {
      window.ClimaRotaTripLedger.setConsent(true);
    }
    renderHistory();
    saveCurrentTrip();
    showNotice("");
  } catch (error) {
    showNotice(`Não foi possível atualizar o diário local: ${error.message}`, true);
  }
});
elements.historyList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-trip-id][data-outcome]");
  if (!button) return;
  try {
    window.ClimaRotaTripLedger.saveOutcome(button.dataset.tripId, button.dataset.outcome);
    renderHistory();
    showNotice("");
  } catch (error) {
    showNotice(`Não foi possível registrar a avaliação: ${error.message}`, true);
  }
});
elements.exportHistory.addEventListener("click", () => {
  try {
    exportHistory();
  } catch (error) {
    showNotice(`Não foi possível exportar o diário: ${error.message}`, true);
  }
});
elements.clearHistory.addEventListener("click", () => {
  if (!window.confirm("Apagar todas as viagens e avaliações guardadas neste aparelho?")) return;
  try {
    window.ClimaRotaTripLedger.clearHistory();
    currentTripId = null;
    renderHistory();
    showNotice("");
  } catch (error) {
    showNotice(`Não foi possível apagar o diário: ${error.message}`, true);
  }
});

try {
  initializeMap();
} catch (error) {
  showNotice(error.message, true);
}
try {
  selectWeatherAuthority();
  elements.workspaceConsent.checked = window.ClimaRotaFieldWorkspace.hasConsent();
  renderFieldSites();
} catch (error) {
  showNotice(`Não foi possível iniciar as ferramentas de campo: ${error.message}`, true);
}
try {
  elements.historyConsent.checked = window.ClimaRotaTripLedger.hasConsent();
  renderHistory();
} catch (error) {
  showNotice(`Não foi possível abrir o diário local: ${error.message}`, true);
}
setLocationName(INITIAL_LOCATION.name);
loadWeather(INITIAL_LOCATION).catch((error) => showNotice(error.message, true));
