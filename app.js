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
  workspaceButtons: [...document.querySelectorAll("[data-select-workspace]")],
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
  routeOptionsPanel: document.querySelector("#route-options-panel"),
  routeOptionsList: document.querySelector("#route-options-list"),
  journeyPanel: document.querySelector("#journey-panel"),
  journeyConsumption: document.querySelector("#journey-consumption"),
  journeyFuelPrice: document.querySelector("#journey-fuel-price"),
  journeyVehicle: document.querySelector("#journey-vehicle"),
  rentalInputs: document.querySelector("#rental-inputs"),
  rentalDays: document.querySelector("#rental-days"),
  rentalDailyPrice: document.querySelector("#rental-daily-price"),
  journeyEstimate: document.querySelector("#journey-estimate"),
  journeyWaze: document.querySelector("#journey-waze"),
  journeyMaps: document.querySelector("#journey-maps"),
  journeyHotels: document.querySelector("#journey-hotels"),
  journeyCars: document.querySelector("#journey-cars"),
  vehicleNavPanel: document.querySelector("#vehicle-nav-panel"),
  vehicleNavToggle: document.querySelector("#vehicle-nav-toggle"),
  vehicleNavVoice: document.querySelector("#vehicle-nav-voice"),
  vehicleNavGuidance: document.querySelector("#vehicle-nav-guidance"),
  vehicleNavNext: document.querySelector("#vehicle-nav-next"),
  vehicleNavDistance: document.querySelector("#vehicle-nav-distance"),
  vehicleNavEta: document.querySelector("#vehicle-nav-eta"),
  vehicleNavStatus: document.querySelector("#vehicle-nav-status"),
  vehicleNavMap: document.querySelector("#vehicle-nav-map"),
  vehicleNavMapNext: document.querySelector("#vehicle-nav-map-next"),
  vehicleNavMapDistance: document.querySelector("#vehicle-nav-map-distance"),
  vehicleNavMapStop: document.querySelector("#vehicle-nav-map-stop"),
  stayCheckin: document.querySelector("#stay-checkin"),
  stayCheckout: document.querySelector("#stay-checkout"),
  stayAdults: document.querySelector("#stay-adults"),
  stayRooms: document.querySelector("#stay-rooms"),
  stayBookingLink: document.querySelector("#stay-booking-link"),
  stayStatus: document.querySelector("#stay-status"),
  discoveryCenter: document.querySelector("#discovery-center"),
  discoverMarcos: document.querySelector("#discover-marcos"),
  clearDiscoveries: document.querySelector("#clear-discoveries"),
  discoveryStatus: document.querySelector("#discovery-status"),
  discoveryList: document.querySelector("#discovery-list"),
  saveJourney: document.querySelector("#save-journey"),
  journeySaveNote: document.querySelector("#journey-save-note"),
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
  importAceinnaTrajectory: document.querySelector("#import-aceinna-trajectory"),
  clearAceinnaTrajectory: document.querySelector("#clear-aceinna-trajectory"),
  aceinnaTrajectoryFile: document.querySelector("#aceinna-trajectory-file"),
  aceinnaTrajectoryDialog: document.querySelector("#aceinna-trajectory-dialog"),
  aceinnaTrajectoryForm: document.querySelector("#aceinna-trajectory-form"),
  closeAceinnaTrajectoryDialog: document.querySelector("#close-aceinna-trajectory-dialog"),
  aceinnaTrajectoryFormat: document.querySelector("#aceinna-trajectory-format"),
  aceinnaTrajectoryFileName: document.querySelector("#aceinna-trajectory-file-name"),
  aceinnaTrajectoryStatus: document.querySelector("#aceinna-trajectory-status"),
  pntPath: document.querySelector("#pnt-path"),
  pntDuration: document.querySelector("#pnt-duration"),
  pntSampleRate: document.querySelector("#pnt-sample-rate"),
  pntSpeed: document.querySelector("#pnt-speed"),
  pntGnssNoise: document.querySelector("#pnt-gnss-noise"),
  pntImuBias: document.querySelector("#pnt-imu-bias"),
  pntGnssInterval: document.querySelector("#pnt-gnss-interval"),
  pntSeed: document.querySelector("#pnt-seed"),
  runPntSimulation: document.querySelector("#run-pnt-simulation"),
  exportPntSimulation: document.querySelector("#export-pnt-simulation"),
  clearPntSimulation: document.querySelector("#clear-pnt-simulation"),
  pntStatus: document.querySelector("#pnt-status"),
  pntMetrics: document.querySelector("#pnt-metrics"),
  pntInertialRmse: document.querySelector("#pnt-inertial-rmse"),
  pntGnssRmse: document.querySelector("#pnt-gnss-rmse"),
  pntFusedRmse: document.querySelector("#pnt-fused-rmse"),
  pntGnssFixes: document.querySelector("#pnt-gnss-fixes"),
  eventName: document.querySelector("#event-name"),
  eventCity: document.querySelector("#event-city"),
  eventDate: document.querySelector("#event-date"),
  searchEvents: document.querySelector("#search-events"),
  locateEvent: document.querySelector("#locate-event"),
  eventSearchResults: document.querySelector("#event-search-results"),
  eventStatus: document.querySelector("#event-status"),
  shareEventLocation: document.querySelector("#share-event-location"),
  clearEventLocation: document.querySelector("#clear-event-location"),
  eventShareBox: document.querySelector("#event-share-box"),
  eventShareLink: document.querySelector("#event-share-link"),
  copyEventShare: document.querySelector("#copy-event-share"),
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
let routeLayers = [];
let routeChoices = [];
let selectedRouteIndex = 0;
let currentLocation = { ...INITIAL_LOCATION };
let destination = null;
let currentTripSnapshot = null;
let savedRouteIndexes = new Set();
let discoveries = [];
let discoveryLayers = [];
let discoveryAbortController = null;
let discoveryCache = null;
let discoveryCoverage = "";
const markedPassages = new Set();
const completedMissions = new Set();
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
let pendingAceinnaTrajectoryFile = null;
let aceinnaTrajectoryLayer = null;
let pntSimulationResult = null;
let pntSimulationLayers = null;
let eventPoint = null;
let eventMarker = null;
let routeRequestVersion = 0;
let weatherRequestVersion = 0;
let searchRequestVersion = 0;
let lastTrackingWeatherAt = 0;
let vehicleNavWatchId = null;
let vehicleNavRoute = null;
let vehicleNavMarker = null;
let vehicleNavAccuracy = null;
let vehicleNavLayer = null;
let vehicleNavGeneration = 0;
let vehicleNavOffRoute = 0;
let vehicleNavLastRerouteAt = 0;
let vehicleNavSpeechKey = "";
let vehicleNavVoiceEnabled = true;
let vehicleNavRouteLoading = false;

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
  const requestVersion = ++weatherRequestVersion;
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
  if (requestVersion !== weatherRequestVersion) return false;
  if (!response.ok) {
    throw new Error(`Serviço meteorológico indisponível (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (requestVersion !== weatherRequestVersion) return false;
  if (!data.current || !data.hourly) {
    throw new Error("A previsão recebida está incompleta. Tente novamente.");
  }
  renderWeather(data);
  latestWorkForecast = forecastForCurrentHour(data);
  renderWorkConditions();
  return true;
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

  const upcoming = data.hourly.time
    .map((time, index) => ({ time, index }))
    .filter(({ time }) => time >= current.time)
    .slice(0, 6);

  elements.forecastList.replaceChildren();
  for (const { time, index } of upcoming) {
    const [hourDescription, hourSymbol] = describeWeather(data.hourly.weather_code[index]);
    const item = document.createElement("div");
    item.className = "forecast-item";

    const timeElement = document.createElement("time");
    timeElement.dateTime = time;
    timeElement.textContent = time.slice(11, 16);
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
      if (elements.discoveryCenter.value === "origin") clearDiscoveries();
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
  const requestVersion = ++routeRequestVersion;
  const coords = `${currentLocation.lon},${currentLocation.lat};${target.lon},${target.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true&alternatives=3`;
  const response = await fetch(url);
  if (requestVersion !== routeRequestVersion) return false;
  if (!response.ok) {
    throw new Error(`Serviço de rotas indisponível (HTTP ${response.status}).`);
  }
  const data = await response.json();
  if (requestVersion !== routeRequestVersion) return false;
  const routes = data.routes?.slice(0, 3);
  if (!routes?.length) {
    throw new Error("Não foi possível traçar uma rota de carro para esse destino.");
  }
  if (routes.some((route) => (
    !Number.isFinite(route.distance) || route.distance < 0
    || !Number.isFinite(route.duration) || route.duration < 0
    || !route.geometry
  ))) {
    throw new Error("O serviço de rotas retornou uma ou mais estimativas inválidas.");
  }

  destination = target;
  stopVehicleNavigation();
  clearDiscoveries();
  elements.discoveryCenter.querySelector('option[value="destination"]').disabled = false;
  elements.discoveryCenter.querySelector('option[value="route"]').disabled = false;
  elements.vehicleNavPanel.hidden = false;
  clearRouteLayers();
  if (destinationMarker) map.removeLayer(destinationMarker);
  const destinationPopup = document.createElement("span");
  destinationPopup.textContent = target.name;
  destinationMarker = L.marker([target.lat, target.lon])
    .addTo(map)
    .bindPopup(destinationPopup);

  elements.routeDestination.textContent = target.name;
  elements.routeCard.hidden = false;
  elements.routeOptionsPanel.hidden = true;
  elements.routeOptionsList.replaceChildren();
  elements.destinationWeather.hidden = false;
  elements.destinationWeatherName.textContent = target.name;
  elements.routeAnalysis.hidden = false;
  elements.analysisSummary.textContent = "Calculando previsão para os horários estimados de chegada…";
  elements.routeWeatherList.replaceChildren();
  currentTripSnapshot = null;
  savedRouteIndexes = new Set();

  const tasks = await Promise.allSettled([
    fetchDestinationWeather(target),
    window.ClimaRotaRouteAnalysis.analyzeRoutes(routes.map((route) => ({
      geometry: route.geometry,
      durationSeconds: route.duration,
    }))),
  ]);
  if (requestVersion !== routeRequestVersion) return false;
  const destinationResult = tasks[0];
  const routeWeatherResult = tasks[1];
  if (destinationResult.status === "rejected") {
    elements.destinationDescription.textContent = "Previsão temporariamente indisponível";
  } else {
    renderDestinationWeather(destinationResult.value);
  }
  if (routeWeatherResult.status === "rejected") {
    elements.analysisSummary.textContent = routeWeatherResult.reason.message;
    elements.routeWeatherList.replaceChildren();
    elements.routeAnalysis.classList.add("analysis-error");
    routeChoices = routes.map((route) => ({ ...route, weatherSamples: null }));
  } else {
    elements.routeAnalysis.classList.remove("analysis-error");
    routeChoices = routes.map((route, index) => ({
      ...route,
      weatherSamples: routeWeatherResult.value[index],
    }));
  }
  selectedRouteIndex = routeChoices.reduce(
    (fastestIndex, route, index) => (
      route.duration < routeChoices[fastestIndex].duration ? index : fastestIndex
    ),
    0,
  );
  renderRouteOptions();
  selectRoute(selectedRouteIndex, true);
  const errors = tasks
    .filter((task) => task.status === "rejected")
    .map((task) => task.reason.message);
  if (errors.length) throw new Error(errors.join(" "));
  return true;
}

function clearRouteLayers() {
  routeLayers.forEach((layer) => {
    if (map && map.hasLayer(layer)) map.removeLayer(layer);
  });
  routeLayers = [];
  routeLayer = null;
}

function renderRouteOptions() {
  elements.routeOptionsList.replaceChildren();
  elements.routeOptionsPanel.hidden = routeChoices.length < 1;
  if (!routeChoices.length) return;
  const fastestIndex = routeChoices.reduce(
    (best, route, index) => (
      route.duration < routeChoices[best].duration ? index : best
    ),
    0,
  );
  const summaries = routeChoices.map((route) => (
    route.weatherSamples
      ? window.ClimaRotaRouteAnalysis.summarizeRouteWeather(route.weatherSamples)
      : null
  ));
  const knownWeather = summaries
    .map((summary, index) => ({ summary, index }))
    .filter(({ summary }) => Number.isFinite(summary?.peakPrecipitationProbability));
  const dryerRoute = knownWeather.length > 1
    ? knownWeather.reduce((best, item) => (
      item.summary.peakPrecipitationProbability
        < best.summary.peakPrecipitationProbability ? item : best
    ))
    : null;
  const dryerRouteIndex = dryerRoute?.index ?? -1;

  routeChoices.forEach((route, index) => {
    const button = document.createElement("button");
    button.className = "route-option";
    button.type = "button";
    button.dataset.routeIndex = String(index);
    button.setAttribute("aria-pressed", String(index === selectedRouteIndex));

    const heading = document.createElement("strong");
    heading.textContent = `Rota ${index + 1}`;
    const estimate = document.createElement("span");
    estimate.textContent = `${(route.distance / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km · ${formatDuration(route.duration)}`;
    const summary = summaries[index];
    const climate = document.createElement("small");
    climate.textContent = summary?.peakPrecipitationProbability === null || !summary
      ? "Previsão indisponível"
      : `Máx. ${summary.peakPrecipitationProbability}% nos pontos amostrados${summary.stormExpected ? " · trovoada indicada" : ""}`;
    const badges = [];
    if (index === fastestIndex) badges.push("Mais rápida (estimativa)");
    if (index === dryerRouteIndex) badges.push("Menor chance máxima amostrada");
    const badgeLine = document.createElement("small");
    badgeLine.className = "route-option-badges";
    badgeLine.textContent = badges.join(" · ") || "Alternativa de percurso";
    button.append(heading, estimate, climate, badgeLine);
    elements.routeOptionsList.append(button);
  });
}

function selectRoute(index, fitMap = false) {
  if (!Number.isInteger(index) || !routeChoices[index] || !map) {
    throw new Error("A rota selecionada não está disponível.");
  }
  selectedRouteIndex = index;
  if (vehicleNavWatchId !== null) stopVehicleNavigation();
  clearRouteLayers();
  const boundsLayers = [];
  routeChoices.forEach((choice, routeIndex) => {
    if (routeIndex === index) return;
    const layer = L.geoJSON(choice.geometry, {
      style: {
        color: routeIndex % 2 === 0 ? "#527e9b" : "#bb7955",
        weight: 4,
        opacity: 0.65,
        dashArray: "7 7",
      },
      bubblingMouseEvents: false,
    });
    layer.on("click", (event) => {
      event.originalEvent?.stopPropagation();
      selectRoute(routeIndex);
    });
    layer.addTo(map);
    routeLayers.push(layer);
    boundsLayers.push(layer);
  });
  routeLayer = L.geoJSON(routeChoices[index].geometry, {
    style: { color: "#577b32", weight: 7, opacity: 0.96 },
    bubblingMouseEvents: false,
  }).addTo(map);
  routeLayer.on("click", (event) => event.originalEvent?.stopPropagation());
  routeLayers.push(routeLayer);
  boundsLayers.push(routeLayer);
  if (fitMap) {
    const bounds = L.featureGroup(boundsLayers).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [45, 45] });
  }

  const route = routeChoices[index];
  elements.routeSummary.textContent = `${(route.distance / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km · ${formatDuration(route.duration)} · estimativa sem trânsito ao vivo`;
  [...elements.routeOptionsList.querySelectorAll("[data-route-index]")].forEach((button) => {
    button.setAttribute("aria-pressed", String(Number(button.dataset.routeIndex) === index));
  });
  if (route.weatherSamples) {
    elements.routeAnalysis.classList.remove("analysis-error");
    renderRouteWeather(route.weatherSamples);
    currentTripSnapshot = {
      originName: currentLocation.name,
      destinationName: destination.name,
      distanceKm: route.distance / 1000,
      durationSeconds: route.duration,
      forecastSamples: route.weatherSamples,
    };
  } else {
    elements.analysisSummary.textContent = "A previsão para comparar o clima das rotas está indisponível. Os percursos ainda são estimativas sem trânsito ao vivo.";
    elements.routeWeatherList.replaceChildren();
    elements.routeAnalysis.classList.add("analysis-error");
    currentTripSnapshot = null;
  }
  renderJourney();
}

function renderJourney() {
  const route = routeChoices[selectedRouteIndex];
  if (!destination || !route) {
    elements.journeyPanel.hidden = true;
    return;
  }
  elements.journeyPanel.hidden = false;
  const links = window.ClimaRotaJourneyPlanner.buildTravelLinks(destination);
  elements.journeyWaze.href = links.waze;
  elements.journeyMaps.href = links.googleMaps;
  elements.journeyHotels.href = links.hotels;
  elements.journeyCars.href = links.rentalCars;
  renderStayLink();

  const consumption = elements.journeyConsumption.value.trim();
  const fuelPrice = elements.journeyFuelPrice.value.trim();
  const isRental = elements.journeyVehicle.value === "rental";
  elements.rentalInputs.hidden = !isRental;
  if (!consumption || !fuelPrice) {
    elements.journeyEstimate.textContent = "Informe consumo e preço para estimar o combustível da rota escolhida.";
  } else {
    try {
      const estimate = window.ClimaRotaJourneyPlanner.estimateFuel(
        route.distance / 1000,
        Number(consumption),
        Number(fuelPrice),
      );
      const cost = estimate.fuelCost.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      let summary = `Combustível estimado: ${estimate.liters.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} L · ${cost}, só ida.`;
      if (isRental) {
        const days = elements.rentalDays.value.trim();
        const dailyPrice = elements.rentalDailyPrice.value.trim();
        if (!days || !dailyPrice) {
          summary += " Informe dias e diária para somar o aluguel.";
        } else {
          const rentalCost = window.ClimaRotaJourneyPlanner.estimateRentalCost(Number(days), Number(dailyPrice));
          const currency = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
          summary += ` Aluguel informado: ${currency(rentalCost)}. Total parcial: ${currency(estimate.fuelCost + rentalCost)}.`;
        }
      }
      elements.journeyEstimate.textContent = summary;
    } catch (error) {
      elements.journeyEstimate.textContent = error.message;
    }
  }

  const saved = savedRouteIndexes.has(selectedRouteIndex);
  elements.saveJourney.disabled = !elements.historyConsent.checked || !currentTripSnapshot || saved;
  elements.journeySaveNote.textContent = !elements.historyConsent.checked
    ? "Ative o diário local para guardar a rota selecionada."
    : !currentTripSnapshot
      ? "O diário requer dados de previsão disponíveis para esta rota."
      : saved
        ? "Esta rota já foi guardada no diário desta sessão."
        : "A rota escolhida será guardada neste navegador após seu clique.";
}

function localIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initializeStayDates() {
  const today = new Date();
  const checkin = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const checkout = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
  elements.stayCheckin.min = localIsoDate(today);
  elements.stayCheckin.value = localIsoDate(checkin);
  elements.stayCheckout.min = localIsoDate(checkout);
  elements.stayCheckout.value = localIsoDate(checkout);
}

function renderStayLink() {
  elements.stayBookingLink.removeAttribute("href");
  elements.stayBookingLink.setAttribute("aria-disabled", "true");
  elements.stayBookingLink.tabIndex = -1;
  if (!destination) {
    elements.stayStatus.textContent = "Trace uma rota para pesquisar hospedagem no destino.";
    return;
  }
  try {
    if (elements.stayCheckin.value < localIsoDate(new Date())) {
      throw new Error("Escolha uma data de entrada a partir de hoje.");
    }
    const url = window.ClimaRotaJourneyPlanner.buildBookingSearchLink(destination, {
      checkin: elements.stayCheckin.value,
      checkout: elements.stayCheckout.value,
      adults: Number(elements.stayAdults.value),
      rooms: Number(elements.stayRooms.value),
    });
    elements.stayBookingLink.href = url;
    elements.stayBookingLink.setAttribute("aria-disabled", "false");
    elements.stayBookingLink.tabIndex = 0;
    elements.stayStatus.textContent = "A Booking.com mostrará preços e disponibilidade no próprio site. Nenhuma reserva é feita aqui.";
  } catch (error) {
    elements.stayStatus.textContent = error.message;
  }
}

function clearDiscoveries() {
  discoveryAbortController?.abort();
  discoveryAbortController = null;
  discoveryLayers.forEach((layer) => { if (map?.hasLayer(layer)) map.removeLayer(layer); });
  discoveryLayers = [];
  discoveries = [];
  discoveryCoverage = "";
  elements.discoveryList.replaceChildren();
  elements.clearDiscoveries.hidden = true;
  elements.discoverMarcos.disabled = false;
  elements.discoveryStatus.textContent = "Clique em Buscar marcos para explorar pontos do OpenStreetMap.";
}

function renderDiscoveries() {
  elements.discoveryList.replaceChildren();
  const count = discoveries.filter((item) => markedPassages.has(item.id)).length;
  const missions = discoveries.filter((item) => completedMissions.has(item.id)).length;
  elements.discoveryStatus.textContent = discoveries.length
    ? `${discoveries.length} marcos · ${count} passagens · ${missions} missões concluídas nesta lista. Dados do OpenStreetMap via Photon.${discoveryCoverage}`
    : "Nenhum marco dessas categorias foi encontrado até 2,5 km do ponto escolhido.";
  elements.clearDiscoveries.hidden = discoveries.length === 0;
  discoveries.forEach((item) => {
    const card = document.createElement("article");
    card.className = "discovery-card";
    const heading = document.createElement("div");
    heading.className = "discovery-card-header";
    const title = document.createElement("strong");
    title.textContent = item.name;
    const distance = document.createElement("span");
    distance.textContent = item.routeKm === undefined
      ? `${item.distanceMeters.toLocaleString("pt-BR")} m`
      : `perto do km ${item.routeKm}`;
    heading.append(title, distance);
    const category = document.createElement("small");
    category.textContent = item.label;
    const task = document.createElement("p");
    task.textContent = item.task;
    const actions = document.createElement("div");
    actions.className = "discovery-card-actions";
    const mapButton = document.createElement("button");
    mapButton.type = "button";
    mapButton.textContent = "Ver no mapa";
    mapButton.addEventListener("click", () => {
      map.setView([item.lat, item.lon], Math.max(map.getZoom(), 15));
      const layer = discoveryLayers.find((candidate) => candidate.discoveryId === item.id);
      layer?.openPopup();
      document.querySelector(".map-column").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const markButton = document.createElement("button");
    markButton.type = "button";
    markButton.textContent = markedPassages.has(item.id) ? "Passagem marcada" : "Marcar passagem";
    markButton.disabled = markedPassages.has(item.id);
    markButton.addEventListener("click", () => markPassage(item, markButton));
    const missionButton = document.createElement("button");
    missionButton.type = "button";
    missionButton.textContent = completedMissions.has(item.id) ? "Missão concluída" : "Concluir missão";
    missionButton.disabled = !markedPassages.has(item.id) || completedMissions.has(item.id);
    missionButton.addEventListener("click", () => {
      completedMissions.add(item.id);
      renderDiscoveries();
      elements.discoveryStatus.textContent = "Missão registrada nesta sessão por sua confirmação. A atividade não foi verificada pelo aplicativo.";
    });
    const source = document.createElement("a");
    source.href = item.sourceUrl;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = "Ver no OSM";
    actions.append(mapButton, markButton, missionButton, source);
    card.append(heading, category, task, actions);
    elements.discoveryList.append(card);
  });
}

function markPassage(item, button) {
  if (!navigator.geolocation) {
    elements.discoveryStatus.textContent = "Este navegador não oferece localização GPS para marcar a passagem.";
    return;
  }
  button.disabled = true;
  elements.discoveryStatus.textContent = "Solicitando GPS uma vez para conferir proximidade do marco…";
  navigator.geolocation.getCurrentPosition((position) => {
    if (!discoveries.some((discovery) => discovery.id === item.id)) return;
    const result = window.ClimaRotaJourneyDiscovery.canMarkPassage(item, position);
    if (result.allowed) markedPassages.add(item.id);
    renderDiscoveries();
    elements.discoveryStatus.textContent = result.reason;
  }, (error) => {
    button.disabled = false;
    elements.discoveryStatus.textContent = error.code === 1
      ? "Permissão de GPS negada. Autorize a localização para marcar a passagem."
      : "Não foi possível obter um GPS preciso agora. Tente em local aberto.";
  }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
}

async function discoverMarcos() {
  if (!map) {
    elements.discoveryStatus.textContent = "O mapa não está disponível. Recarregue a página e tente novamente.";
    return;
  }
  const mode = elements.discoveryCenter.value;
  const center = mode === "destination" ? destination : currentLocation;
  const route = routeChoices[selectedRouteIndex];
  if ((mode === "route" && !route) || (mode === "destination" && !destination)) {
    elements.discoveryStatus.textContent = "Trace uma rota antes de explorar esse trecho.";
    return;
  }
  const discovery = window.ClimaRotaJourneyDiscovery;
  let centers;
  try {
    centers = mode === "route" ? discovery.sampleRouteCenters(route.geometry) : [center];
  } catch (error) {
    elements.discoveryStatus.textContent = error.message;
    return;
  }
  const urls = centers.map((point) => discovery.buildDiscoveryUrl(point));
  const cacheKey = urls.join("|");
  discoveryAbortController?.abort();
  const controller = new AbortController();
  discoveryAbortController = controller;
  let timedOut = false;
  const timeoutId = setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
  elements.discoverMarcos.disabled = true;
  elements.discoveryStatus.textContent = mode === "route"
    ? "Buscando paradas reais em três trechos da rota…"
    : "Buscando pontos reais perto do local escolhido…";
  try {
    let items;
    if (discoveryCache?.url === cacheKey && Date.now() - discoveryCache.time < 300000) {
      items = discoveryCache.items;
      discoveryCoverage = discoveryCache.coverage;
    } else {
      const requests = await Promise.allSettled(urls.map(async (url) => {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Serviço de pontos indisponível (HTTP ${response.status}).`);
        return (await response.json()).features;
      }));
      if (requests.every((result) => result.status === "rejected")) {
        throw requests[0].reason;
      }
      const batches = requests.map((result) => result.status === "fulfilled" ? result.value : []);
      const completed = requests.filter((result) => result.status === "fulfilled").length;
      discoveryCoverage = completed === requests.length ? "" : ` ${completed} de ${requests.length} trechos consultados.`;
      items = mode === "route" ? discovery.mergeRouteDiscoveries(batches, centers)
        : discovery.normalizeDiscoveries(batches[0], center);
      discoveryCache = { url: cacheKey, time: Date.now(), items, coverage: discoveryCoverage };
    }
    if (controller.signal.aborted) return;
    discoveryLayers.forEach((layer) => { if (map?.hasLayer(layer)) map.removeLayer(layer); });
    discoveryLayers = [];
    discoveries = items;
    items.forEach((item) => {
      const popup = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = item.name;
      const detail = document.createElement("p");
      detail.textContent = `${item.label} · ${item.task}`;
      popup.append(name, detail);
      const layer = L.circleMarker([item.lat, item.lon], {
        radius: 8, color: "#193525", weight: 2, fillColor: "#c6f36b", fillOpacity: 0.9,
        bubblingMouseEvents: false,
      }).addTo(map).bindPopup(popup);
      layer.discoveryId = item.id;
      discoveryLayers.push(layer);
    });
    renderDiscoveries();
  } catch (error) {
    if (timedOut) {
      elements.discoveryStatus.textContent = "A busca de marcos demorou demais. Tente novamente mais tarde.";
    } else if (!controller.signal.aborted) {
      elements.discoveryStatus.textContent = `${error.message} Tente novamente mais tarde.`;
    }
  } finally {
    clearTimeout(timeoutId);
    if (discoveryAbortController === controller) discoveryAbortController = null;
    elements.discoverMarcos.disabled = false;
  }
}

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

async function fetchDestinationWeather(target) {
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
  const currentHour = data.current.time.slice(0, 13);
  const hourIndex = data.hourly.time.findIndex((time) => time.slice(0, 13) === currentHour);
  const rain = hourIndex >= 0 ? data.hourly.precipitation_probability[hourIndex] : null;
  return { symbol, temperature: data.current.temperature_2m, description, rain };
}

function renderDestinationWeather(weather) {
  elements.destinationSymbol.textContent = weather.symbol;
  elements.destinationTemperature.textContent = `${Math.round(weather.temperature)}°`;
  elements.destinationDescription.textContent = weather.description;
  elements.destinationRain.textContent = `Chuva: ${weather.rain ?? "--"}%`;
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
  if (!elements.historyConsent.checked || !currentTripSnapshot
    || savedRouteIndexes.has(selectedRouteIndex)) return;
  try {
    window.ClimaRotaTripLedger.saveTrip(currentTripSnapshot);
    savedRouteIndexes.add(selectedRouteIndex);
    renderJourney();
    renderHistory();
    showNotice("Rota escolhida guardada no diário deste navegador.");
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
  } else if (mode === "event") {
    elements.measurementStatus.textContent = "Clique no mapa para marcar e compartilhar um ponto fixo de encontro. Isso não ativa rastreamento de pessoas.";
    elements.measurementStatus.hidden = false;
  } else if (elements.measurementStatus.textContent.startsWith("Clique no mapa")) {
    elements.measurementStatus.hidden = true;
  }
}

function setWorkspaceMode(mode) {
  if (!["all", "travel", "field", "lab"].includes(mode)) return;
  setFieldMode(null);
  document.body.dataset.workspaceMode = mode;
  elements.workspaceButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.selectWorkspace === mode));
  });
  if (map) window.requestAnimationFrame(() => map.invalidateSize());
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
  if (fieldMode === "event") {
    setEventPoint({
      name: elements.eventName.value.trim() || "Ponto de encontro",
      venue: elements.eventCity.value.trim() || "Local escolhido no mapa",
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
      date: elements.eventDate.value,
    });
    elements.measurementStatus.hidden = true;
    setFieldMode(null);
    return;
  }
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

function setEventPoint(event) {
  const point = window.ClimaRotaEventPlanner.validateEvent(event);
  eventPoint = point;
  if (eventMarker && map) map.removeLayer(eventMarker);
  const popup = document.createElement("span");
  popup.textContent = `${point.name} · ponto de encontro`;
  eventMarker = L.marker([point.latitude, point.longitude]).addTo(map).bindPopup(popup);
  map.setView([point.latitude, point.longitude], 16);
  elements.eventCity.value = point.venue;
  elements.shareEventLocation.disabled = false;
  elements.clearEventLocation.hidden = false;
  elements.eventShareBox.hidden = true;
  elements.eventStatus.textContent = `Ponto definido: ${point.venue} · ${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}.`;
}

function searchEvents() {
  const links = window.ClimaRotaEventPlanner.buildSearchLinks(
    elements.eventName.value,
    elements.eventCity.value,
    elements.eventDate.value,
  );
  elements.eventSearchResults.replaceChildren();
  for (const result of links) {
    const link = document.createElement("a");
    link.href = result.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = result.label;
    elements.eventSearchResults.append(link);
  }
  elements.eventSearchResults.hidden = false;
  elements.eventStatus.textContent = "Resultados de busca externos; o ClimaRota não confirma disponibilidade, autenticidade ou autorização do vendedor.";
}

async function locateEvent() {
  if (!elements.eventName.value.trim()) throw new Error("Informe o nome do evento ou artista.");
  if (!elements.eventCity.value.trim()) throw new Error("Informe a cidade ou o local do evento.");
  const target = await findDestination(elements.eventCity.value.trim());
  setEventPoint({
    name: elements.eventName.value,
    venue: target.name,
    latitude: target.lat,
    longitude: target.lon,
    date: elements.eventDate.value,
  });
  try {
    const completed = await calculateRoute(target);
    if (!completed) return;
  } catch (error) {
    showNotice(`O local foi encontrado, mas a rota ou parte da previsão falhou: ${error.message}`, true);
  }
}

function prepareEventShare() {
  if (!eventPoint) throw new Error("Marque o ponto do evento no mapa antes de criar o link.");
  const shareRecord = {
    ...eventPoint,
    name: elements.eventName.value.trim() || eventPoint.name,
    date: elements.eventDate.value,
  };
  const shareUrl = window.ClimaRotaEventPlanner.createMeetupUrl(window.location.href, shareRecord);
  elements.eventShareLink.value = shareUrl;
  elements.eventShareBox.hidden = false;
  elements.eventStatus.textContent = "Link preparado. Ele contém um ponto fixo no endereço, não acompanha pessoas. Envie apenas ao grupo desejado.";
}

async function copyEventShare() {
  if (!elements.eventShareLink.value) throw new Error("Prepare o link do ponto antes de copiá-lo.");
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(elements.eventShareLink.value);
      elements.eventStatus.textContent = "Link copiado. Compartilhe-o somente com as pessoas do grupo.";
      return;
    } catch {
      elements.eventShareLink.focus();
      elements.eventShareLink.select();
      elements.eventStatus.textContent = "A cópia automática foi bloqueada. O link está selecionado para copiar manualmente.";
      return;
    }
  }
  elements.eventShareLink.focus();
  elements.eventShareLink.select();
  elements.eventStatus.textContent = "A cópia automática não está disponível. O link está selecionado para copiar manualmente.";
}

function clearEventPoint() {
  if (eventMarker && map) map.removeLayer(eventMarker);
  eventPoint = null;
  eventMarker = null;
  elements.shareEventLocation.disabled = true;
  elements.clearEventLocation.hidden = true;
  elements.eventShareBox.hidden = true;
  elements.eventShareLink.value = "";
  if (window.location.hash.startsWith("#meetup=")) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
  elements.eventStatus.textContent = "Ponto do evento removido desta sessão.";
}

function restoreSharedEventPoint() {
  const sharedEvent = window.ClimaRotaEventPlanner.readMeetupUrl(window.location.href);
  if (!sharedEvent) return;
  elements.eventName.value = sharedEvent.name;
  elements.eventCity.value = sharedEvent.venue;
  elements.eventDate.value = sharedEvent.date;
  setEventPoint(sharedEvent);
  elements.eventStatus.textContent = `Ponto de encontro recebido: ${sharedEvent.name} · posição fixa compartilhada; não há localização ao vivo.`;
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
  lastTrackingWeatherAt = 0;
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

function speakVehicleInstruction(message, key) {
  if (!vehicleNavVoiceEnabled || !window.speechSynthesis || !window.SpeechSynthesisUtterance
    || vehicleNavSpeechKey === key) return;
  vehicleNavSpeechKey = key;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "pt-BR";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function stopVehicleNavigation(message = "Navegação parada. O GPS deixou de ser acompanhado.") {
  vehicleNavGeneration += 1;
  if (vehicleNavWatchId !== null) navigator.geolocation.clearWatch(vehicleNavWatchId);
  vehicleNavWatchId = null;
  vehicleNavRoute = null;
  vehicleNavRouteLoading = false;
  vehicleNavOffRoute = 0;
  vehicleNavSpeechKey = "";
  window.speechSynthesis?.cancel();
  for (const layer of [vehicleNavMarker, vehicleNavAccuracy, vehicleNavLayer]) {
    if (layer && map?.hasLayer(layer)) map.removeLayer(layer);
  }
  vehicleNavMarker = null;
  vehicleNavAccuracy = null;
  vehicleNavLayer = null;
  elements.vehicleNavToggle.textContent = "Iniciar navegação";
  elements.vehicleNavGuidance.hidden = true;
  elements.vehicleNavMap.hidden = true;
  document.querySelector(".map-column").classList.remove("is-navigating");
  elements.vehicleNavStatus.textContent = message;
}

function displayVehicleRoute(route) {
  if (vehicleNavLayer && map.hasLayer(vehicleNavLayer)) map.removeLayer(vehicleNavLayer);
  vehicleNavLayer = L.geoJSON(route.geometry, {
    style: { color: "#3478e5", weight: 8, opacity: 0.9 },
    bubblingMouseEvents: false,
  }).addTo(map);
}

async function requestVehicleRoute(point, generation, isReroute = false) {
  if (vehicleNavRouteLoading || !destination) return;
  vehicleNavRouteLoading = true;
  elements.vehicleNavStatus.textContent = isReroute ? "Saída da rota detectada. Recalculando…" : "Calculando rota a partir do GPS…";
  try {
    const coordinates = `${point.lon},${point.lat};${destination.lon},${destination.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true&alternatives=false`;
    const response = await fetch(url);
    if (generation !== vehicleNavGeneration) return;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (generation !== vehicleNavGeneration) return;
    const raw = data.routes?.[0];
    const route = window.ClimaRotaVehicleNavigation.prepareRoute(raw);
    vehicleNavRoute = route;
    displayVehicleRoute(route);
    if (isReroute) {
      clearRouteLayers();
      routeChoices = [{ ...raw, weatherSamples: null }];
      selectedRouteIndex = 0;
      elements.routeOptionsPanel.hidden = true;
      elements.routeAnalysis.hidden = true;
      elements.routeSummary.textContent = `${(raw.distance / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km · rota recalculada · sem trânsito ao vivo`;
      renderJourney();
    }
    vehicleNavOffRoute = 0;
    vehicleNavSpeechKey = "";
    elements.vehicleNavStatus.textContent = isReroute ? "Rota recalculada com o GPS atual." : "Navegação ativa com o GPS atual.";
  } catch (error) {
    if (generation === vehicleNavGeneration) {
      elements.vehicleNavStatus.textContent = `Não foi possível ${isReroute ? "recalcular" : "iniciar"} a rota: ${error.message}. Verifique a conexão.`;
    }
  } finally {
    if (generation === vehicleNavGeneration) vehicleNavRouteLoading = false;
  }
}

function updateVehiclePosition(position, generation) {
  if (generation !== vehicleNavGeneration || !destination) return;
  const { coords } = position;
  const point = { lat: coords.latitude, lon: coords.longitude };
  const accuracy = coords.accuracy;
  if (!Number.isFinite(point.lat) || !Number.isFinite(point.lon)
    || !Number.isFinite(accuracy) || accuracy < 0
    || !Number.isFinite(position.timestamp) || Math.abs(Date.now() - position.timestamp) > 20000) {
    elements.vehicleNavStatus.textContent = "GPS sem posição recente e válida. Aguardando novo sinal…";
    elements.vehicleNavMapNext.textContent = "GPS sem posição recente";
    elements.vehicleNavMapDistance.textContent = "Confira a via e aguarde novo sinal";
    return;
  }
  const latLng = [point.lat, point.lon];
  if (!vehicleNavMarker) {
    vehicleNavMarker = L.circleMarker(latLng, { radius: 11, color: "#fff", weight: 3,
      fillColor: "#3478e5", fillOpacity: 1 }).addTo(map).bindPopup("Posição do aparelho");
    vehicleNavAccuracy = L.circle(latLng, { radius: accuracy, color: "#3478e5",
      fillColor: "#3478e5", fillOpacity: 0.08, weight: 1 }).addTo(map);
  } else {
    vehicleNavMarker.setLatLng(latLng);
    vehicleNavAccuracy.setLatLng(latLng).setRadius(accuracy);
  }
  map.setView(latLng, Math.max(map.getZoom(), 15), { animate: false });
  currentLocation = { ...currentLocation, ...point, name: "Sua localização" };
  if (accuracy > 100) {
    elements.vehicleNavStatus.textContent = `GPS impreciso (±${Math.round(accuracy)} m). Aguarde sinal melhor antes de seguir instruções.`;
    elements.vehicleNavMapNext.textContent = "GPS impreciso";
    elements.vehicleNavMapDistance.textContent = `Precisão ±${Math.round(accuracy)} m · confira a via`;
    return;
  }
  if (!vehicleNavRoute) {
    if (vehicleNavRouteLoading) return;
    const selected = routeChoices[selectedRouteIndex];
    try {
      const prepared = window.ClimaRotaVehicleNavigation.prepareRoute(selected);
      if (window.ClimaRotaVehicleNavigation.distanceMeters(point, prepared.path[0]) <= 100) {
        vehicleNavRoute = prepared;
        displayVehicleRoute(prepared);
        elements.vehicleNavStatus.textContent = "Navegação ativa na rota escolhida.";
      } else {
        requestVehicleRoute(point, generation);
        return;
      }
    } catch (_error) {
      requestVehicleRoute(point, generation);
      return;
    }
  }
  const navigation = window.ClimaRotaVehicleNavigation;
  const progress = navigation.progressAt(point, vehicleNavRoute);
  if (navigation.distanceMeters(point, destination) <= 35 && accuracy <= 50) {
    stopVehicleNavigation("Você chegou perto do destino. Confirme a entrada e estacione em local permitido.");
    return;
  }
  vehicleNavOffRoute = progress.distanceMeters > Math.max(80, accuracy * 2)
    ? vehicleNavOffRoute + 1 : 0;
  if (navigation.shouldRecalculate(progress, accuracy, vehicleNavOffRoute,
    Date.now() - vehicleNavLastRerouteAt) && !vehicleNavRouteLoading) {
    vehicleNavLastRerouteAt = Date.now();
    requestVehicleRoute(point, generation, true);
  }
  const instruction = navigation.maneuverText(progress.maneuver);
  elements.vehicleNavGuidance.hidden = false;
  elements.vehicleNavNext.textContent = instruction;
  elements.vehicleNavDistance.textContent = `${navigation.formatDistance(progress.maneuverMeters)} até a próxima manobra · ${navigation.formatDistance(progress.remainingMeters)} restantes`;
  elements.vehicleNavMapNext.textContent = instruction;
  elements.vehicleNavMapDistance.textContent = elements.vehicleNavDistance.textContent;
  elements.vehicleNavEta.textContent = `Chegada aproximada: ${new Date(Date.now() + progress.remainingSeconds * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · sem trânsito ao vivo`;
  if (accuracy > 50 || progress.distanceMeters > Math.max(80, accuracy * 2)) {
    elements.vehicleNavStatus.textContent = "Posição fora da rota ou sinal incerto. Confira a via e aguarde o recálculo.";
    return;
  }
  elements.vehicleNavStatus.textContent = `GPS ±${Math.round(accuracy)} m · posição e ETA estimadas`;
  const threshold = progress.maneuverMeters <= 80 ? 80 : progress.maneuverMeters <= 300 ? 300 : 0;
  if (threshold) speakVehicleInstruction(`Em ${navigation.formatDistance(progress.maneuverMeters)}, ${instruction.toLowerCase()}.`, `${progress.nextIndex}:${threshold}`);
}

function startVehicleNavigation() {
  if (!destination || !routeChoices.length || !map) {
    elements.vehicleNavStatus.textContent = "Trace uma rota de carro antes de iniciar a navegação.";
    return;
  }
  if (!navigator.geolocation) {
    elements.vehicleNavStatus.textContent = "Este navegador não oferece acesso ao GPS.";
    return;
  }
  if (trackWatchId !== null) stopOwnTracking();
  const generation = ++vehicleNavGeneration;
  vehicleNavLastRerouteAt = Date.now() - 30000;
  vehicleNavSpeechKey = "";
  speakVehicleInstruction("Navegação iniciada. Aguarde a posição do GPS antes de dirigir.", "start");
  elements.vehicleNavStatus.textContent = "Solicitando GPS em tempo real…";
  elements.vehicleNavToggle.textContent = "Parar navegação";
  elements.vehicleNavMap.hidden = false;
  document.querySelector(".map-column").classList.add("is-navigating");
  try {
    vehicleNavWatchId = navigator.geolocation.watchPosition(
      (position) => updateVehiclePosition(position, generation),
      (error) => stopVehicleNavigation(error.code === 1
        ? "Permissão GPS negada. Autorize a localização no navegador."
        : "GPS indisponível. Verifique o sinal e tente novamente."),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    );
  } catch (error) {
    stopVehicleNavigation(`Não foi possível iniciar o GPS: ${error.message}`);
  }
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
        if (Date.now() - lastTrackingWeatherAt >= 5 * 60 * 1000) {
          lastTrackingWeatherAt = Date.now();
          loadWeather({ ...currentLocation })
            .then((updated) => {
              if (updated) setLocationName("Sua localização");
            })
            .catch((error) => showNotice(`Posição atualizada, mas o clima não carregou: ${error.message}`, true));
        }
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

function buildPntSimulationOptions() {
  const integerInput = (element, label) => {
    const value = Number(element.value);
    if (!Number.isSafeInteger(value)) throw new Error(`${label} precisa ser um número inteiro válido.`);
    return value;
  };
  return {
    path: elements.pntPath.value,
    durationSeconds: Number(elements.pntDuration.value),
    sampleRateHz: Number(elements.pntSampleRate.value),
    speedMetersPerSecond: Number(elements.pntSpeed.value),
    gnssNoiseMeters: Number(elements.pntGnssNoise.value),
    imuBiasMg: Number(elements.pntImuBias.value),
    gnssIntervalSeconds: Number(elements.pntGnssInterval.value),
    seed: integerInput(elements.pntSeed, "A semente"),
  };
}

function addPntPath(layerGroup, points, anchor, yawDegrees, style) {
  const coordinates = window.ClimaRotaPntSimulator.toGeographicCoordinates(
    points,
    anchor,
    yawDegrees,
  ).map(([longitude, latitude]) => [latitude, longitude]);
  return L.polyline(coordinates, style).addTo(layerGroup);
}

function renderPntSimulation(result) {
  if (!map) throw new Error("O mapa precisa estar carregado para exibir a simulação.");
  const anchor = { latitude: currentLocation.lat, longitude: currentLocation.lon };
  const group = L.featureGroup();
  addPntPath(group, result.truth, anchor, 0, {
    color: "#277c47",
    weight: 3,
    opacity: 0.72,
    dashArray: "7 5",
  });
  const gnssCoordinates = window.ClimaRotaPntSimulator.toGeographicCoordinates(
    result.gnss,
    anchor,
  );
  result.gnss.forEach((_, index) => {
    const [longitude, latitude] = gnssCoordinates[index];
    L.circleMarker([latitude, longitude], {
      radius: 4,
      color: "#8e5c05",
      weight: 1,
      fillColor: "#ffc247",
      fillOpacity: 0.88,
    }).addTo(group);
  });
  addPntPath(group, result.inertial, anchor, 0, {
    color: "#dd653e",
    weight: 2,
    opacity: 0.8,
  });
  addPntPath(group, result.fused, anchor, 0, {
    color: "#644ed2",
    weight: 3,
    opacity: 0.95,
  });
  group.addTo(map);
  if (pntSimulationLayers && map.hasLayer(pntSimulationLayers)) {
    map.removeLayer(pntSimulationLayers);
  }
  pntSimulationLayers = group;
  map.fitBounds(group.getBounds(), { padding: [55, 55], maxZoom: 16 });

  const { metrics } = result;
  elements.pntInertialRmse.textContent = `${metrics.inertialRmseMeters.toFixed(1)} m`;
  elements.pntGnssRmse.textContent = `${metrics.gnssRmseMeters.toFixed(1)} m`;
  elements.pntFusedRmse.textContent = `${metrics.fusedRmseMeters.toFixed(1)} m`;
  elements.pntGnssFixes.textContent = metrics.gnssFixes.toLocaleString("pt-BR");
  elements.pntMetrics.hidden = false;
  elements.exportPntSimulation.hidden = false;
  elements.clearPntSimulation.hidden = false;
  elements.pntStatus.textContent = `${metrics.samples.toLocaleString("pt-BR")} amostras sintéticas · ${metrics.finalInertialDriftMeters.toFixed(1)} m de desvio inercial no fim · origem: ${currentLocation.name}. Legenda no mapa: verdade (verde tracejado), GNSS ruidoso (pontos amarelos), inercial (laranja), combinada (roxo).`;
}

function exportPntSimulation() {
  if (!pntSimulationResult) throw new Error("Execute uma simulação antes de exportar.");
  const file = new Blob(
    [window.ClimaRotaPntSimulator.exportCsv(pntSimulationResult)],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "climarota-simulacao-pnt.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function clearPntSimulation() {
  if (pntSimulationLayers && map && map.hasLayer(pntSimulationLayers)) {
    map.removeLayer(pntSimulationLayers);
  }
  pntSimulationLayers = null;
  pntSimulationResult = null;
  elements.pntMetrics.hidden = true;
  elements.exportPntSimulation.hidden = true;
  elements.clearPntSimulation.hidden = true;
  elements.pntStatus.textContent = "Trilhas sintéticas removidas da memória desta sessão.";
}

function clearRoute() {
  stopVehicleNavigation();
  routeRequestVersion += 1;
  searchRequestVersion += 1;
  destination = null;
  renderStayLink();
  clearDiscoveries();
  elements.discoveryCenter.value = "origin";
  elements.discoveryCenter.querySelector('option[value="destination"]').disabled = true;
  elements.discoveryCenter.querySelector('option[value="route"]').disabled = true;
  elements.vehicleNavPanel.hidden = true;
  clearRouteLayers();
  routeChoices = [];
  selectedRouteIndex = 0;
  if (destinationMarker && map) map.removeLayer(destinationMarker);
  destinationMarker = null;
  elements.routeCard.hidden = true;
  elements.routeOptionsPanel.hidden = true;
  elements.routeOptionsList.replaceChildren();
  elements.destinationWeather.hidden = true;
  elements.routeAnalysis.hidden = true;
  elements.journeyPanel.hidden = true;
  currentTripSnapshot = null;
  savedRouteIndexes = new Set();
  elements.destinationInput.value = "";
  if (map) map.setView([currentLocation.lat, currentLocation.lon], 12);
}

elements.destinationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const requestVersion = ++searchRequestVersion;
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
    if (requestVersion !== searchRequestVersion) return;
    const completed = await calculateRoute(target);
    if (!completed) return;
    if (requestVersion !== searchRequestVersion) return;
    showNotice("");
  } catch (error) {
    if (requestVersion === searchRequestVersion) showNotice(error.message, true);
  } finally {
    elements.destinationForm.querySelector("button").disabled = false;
  }
});

elements.locateButton.addEventListener("click", locateUser);
elements.workspaceButtons.forEach((button) => {
  button.addEventListener("click", () => setWorkspaceMode(button.dataset.selectWorkspace));
});
elements.clearRoute.addEventListener("click", clearRoute);
elements.journeyConsumption.addEventListener("input", renderJourney);
elements.journeyFuelPrice.addEventListener("input", renderJourney);
[elements.journeyVehicle, elements.rentalDays, elements.rentalDailyPrice]
  .forEach((control) => control.addEventListener("input", renderJourney));
elements.stayCheckin.addEventListener("change", () => {
  const nextDay = new Date(`${elements.stayCheckin.value}T12:00:00`);
  if (!Number.isNaN(nextDay.getTime())) {
    nextDay.setDate(nextDay.getDate() + 1);
    elements.stayCheckout.min = localIsoDate(nextDay);
    if (elements.stayCheckout.value <= elements.stayCheckin.value) {
      elements.stayCheckout.value = localIsoDate(nextDay);
    }
  }
  renderStayLink();
});
[elements.stayCheckout, elements.stayAdults, elements.stayRooms]
  .forEach((control) => control.addEventListener("change", renderStayLink));
elements.discoverMarcos.addEventListener("click", () => {
  discoverMarcos().catch((error) => {
    elements.discoveryStatus.textContent = error.message;
    elements.discoverMarcos.disabled = false;
  });
});
elements.clearDiscoveries.addEventListener("click", clearDiscoveries);
elements.saveJourney.addEventListener("click", saveCurrentTrip);
elements.routeOptionsList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-route-index]");
  if (!button) return;
  try {
    selectRoute(Number(button.dataset.routeIndex));
    showNotice("");
  } catch (error) {
    showNotice(`Não foi possível selecionar essa rota: ${error.message}`, true);
  }
});
elements.searchEvents.addEventListener("click", () => {
  try {
    searchEvents();
  } catch (error) {
    elements.eventStatus.textContent = `Não foi possível pesquisar: ${error.message}`;
    showNotice(`Verifique os dados do evento: ${error.message}`, true);
  }
});
elements.locateEvent.addEventListener("click", async () => {
  elements.locateEvent.disabled = true;
  elements.eventStatus.textContent = "Localizando o endereço do evento…";
  try {
    await locateEvent();
  } catch (error) {
    elements.eventStatus.textContent = `Local do evento não localizado: ${error.message}`;
    showNotice(`Não foi possível localizar o evento: ${error.message}`, true);
  } finally {
    elements.locateEvent.disabled = false;
  }
});
elements.shareEventLocation.addEventListener("click", () => {
  try {
    prepareEventShare();
    showNotice("");
  } catch (error) {
    showNotice(`Não foi possível preparar o ponto de encontro: ${error.message}`, true);
  }
});
elements.copyEventShare.addEventListener("click", async () => {
  try {
    await copyEventShare();
    if (navigator.clipboard?.writeText) showNotice("Link do ponto de encontro copiado.");
  } catch (error) {
    showNotice(`Não foi possível copiar o link: ${error.message}`, true);
  }
});
elements.clearEventLocation.addEventListener("click", clearEventPoint);
elements.runPntSimulation.addEventListener("click", () => {
  elements.runPntSimulation.disabled = true;
  elements.pntStatus.textContent = "Calculando trajetória sintética local…";
  try {
    const result = window.ClimaRotaPntSimulator.simulate(buildPntSimulationOptions());
    renderPntSimulation(result);
    pntSimulationResult = result;
  } catch (error) {
    elements.pntStatus.textContent = `Simulação não executada: ${error.message}`;
    showNotice(`Não foi possível executar a simulação PNT: ${error.message}`, true);
  } finally {
    elements.runPntSimulation.disabled = false;
  }
});
elements.exportPntSimulation.addEventListener("click", () => {
  try {
    exportPntSimulation();
    showNotice("CSV da simulação sintética exportado neste dispositivo.");
  } catch (error) {
    showNotice(`Não foi possível exportar a simulação: ${error.message}`, true);
  }
});
elements.clearPntSimulation.addEventListener("click", clearPntSimulation);
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
elements.importAceinnaTrajectory.addEventListener("click", () => {
  elements.aceinnaTrajectoryFile.click();
});
elements.aceinnaTrajectoryFile.addEventListener("change", () => {
  const [file] = elements.aceinnaTrajectoryFile.files || [];
  elements.aceinnaTrajectoryFile.value = "";
  if (!file) return;
  if (file.size > 25 * 1024 * 1024) {
    showNotice("O arquivo CSV GNSS/INS excede o limite de 25 MB.", true);
    return;
  }
  pendingAceinnaTrajectoryFile = file;
  elements.aceinnaTrajectoryFileName.textContent = `${file.name} · ${(file.size / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} KB. Será lido localmente. Escolha o perfil das colunas correspondente ao arquivo.`;
  elements.aceinnaTrajectoryStatus.hidden = true;
  elements.aceinnaTrajectoryDialog.showModal();
});
elements.aceinnaTrajectoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = pendingAceinnaTrajectoryFile;
  if (!file) {
    elements.aceinnaTrajectoryDialog.close();
    showNotice("Selecione novamente o arquivo CSV GNSS/INS.", true);
    return;
  }
  try {
    const coordinates = window.ClimaRotaAceinnaTrack.parseTrajectory(
      await file.text(),
      elements.aceinnaTrajectoryFormat.value,
    );
    const nextLayer = L.polyline(
      coordinates.map(([longitude, latitude]) => [latitude, longitude]),
      { color: "#c45a23", weight: 4, opacity: 0.9 },
    );
    if (aceinnaTrajectoryLayer && map) map.removeLayer(aceinnaTrajectoryLayer);
    aceinnaTrajectoryLayer = nextLayer.addTo(map);
    map.fitBounds(aceinnaTrajectoryLayer.getBounds(), { padding: [35, 35], maxZoom: 16 });
    elements.aceinnaTrajectoryStatus.textContent = `Trajetória GNSS/INS Aceinna: ${coordinates.length.toLocaleString("pt-BR")} posições em graus, apenas nesta sessão. Não é o rastreamento GPS ao vivo nem verificação de navegação.`;
    elements.aceinnaTrajectoryStatus.hidden = false;
    elements.clearAceinnaTrajectory.hidden = false;
    elements.aceinnaTrajectoryDialog.close();
    showNotice("CSV GNSS/INS exibido no mapa; nenhum arquivo ou ponto foi enviado ou salvo.");
  } catch (error) {
    showNotice(`Não foi possível importar o CSV GNSS/INS: ${error.message}`, true);
  }
});
elements.closeAceinnaTrajectoryDialog.addEventListener("click", () => {
  elements.aceinnaTrajectoryDialog.close();
});
elements.aceinnaTrajectoryDialog.addEventListener("close", () => {
  pendingAceinnaTrajectoryFile = null;
  elements.aceinnaTrajectoryForm.reset();
});
elements.clearAceinnaTrajectory.addEventListener("click", () => {
  if (aceinnaTrajectoryLayer && map) map.removeLayer(aceinnaTrajectoryLayer);
  aceinnaTrajectoryLayer = null;
  elements.aceinnaTrajectoryStatus.hidden = true;
  elements.clearAceinnaTrajectory.hidden = true;
  showNotice("Trajetória CSV removida da memória desta sessão.");
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
elements.vehicleNavToggle.addEventListener("click", () => {
  if (vehicleNavWatchId === null) startVehicleNavigation();
  else stopVehicleNavigation();
});
elements.vehicleNavMapStop.addEventListener("click", () => stopVehicleNavigation());
elements.vehicleNavVoice.addEventListener("click", () => {
  vehicleNavVoiceEnabled = !vehicleNavVoiceEnabled;
  elements.vehicleNavVoice.setAttribute("aria-pressed", String(vehicleNavVoiceEnabled));
  elements.vehicleNavVoice.textContent = vehicleNavVoiceEnabled ? "Voz ligada" : "Voz desligada";
  if (!vehicleNavVoiceEnabled) window.speechSynthesis?.cancel();
  else vehicleNavSpeechKey = "";
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
      savedRouteIndexes = new Set();
    } else {
      window.ClimaRotaTripLedger.setConsent(true);
    }
    renderHistory();
    renderJourney();
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
    savedRouteIndexes = new Set();
    renderHistory();
    renderJourney();
    showNotice("");
  } catch (error) {
    showNotice(`Não foi possível apagar o diário: ${error.message}`, true);
  }
});

try {
  initializeMap();
  restoreSharedEventPoint();
} catch (error) {
  showNotice(`Não foi possível iniciar o mapa ou abrir o ponto compartilhado: ${error.message}`, true);
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
initializeStayDates();
renderStayLink();
setLocationName(INITIAL_LOCATION.name);
loadWeather(INITIAL_LOCATION).catch((error) => showNotice(error.message, true));
