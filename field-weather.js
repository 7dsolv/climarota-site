"use strict";

(function exposeFieldWeather(root) {
  const WORK_PROFILES = Object.freeze({
    survey: Object.freeze({ label: "Medição de campo", rain: 60, wind: 40 }),
    concrete: Object.freeze({ label: "Concretagem externa", rain: 30, wind: 40 }),
    lifting: Object.freeze({ label: "Guindaste / içamento", rain: 50, wind: 25 }),
    height: Object.freeze({ label: "Trabalho em altura", rain: 50, wind: 25 }),
  });
  const THUNDER_CODES = new Set([95, 96, 99]);
  const SEVERE_RAIN_CODES = new Set([65, 67, 82]);

  function assessWorkWindow(forecast, workType) {
    const profile = WORK_PROFILES[workType];
    if (!profile) throw new Error("Selecione um tipo de trabalho conhecido.");
    if (!forecast || !Number.isFinite(forecast.temperature)
      || !Number.isFinite(forecast.wind)
      || !Number.isFinite(forecast.rainProbability)
      || !Number.isFinite(forecast.weatherCode)) {
      return {
        level: "unknown",
        label: "Dados incompletos",
        reasons: ["Confira a previsão e os alertas oficiais antes do trabalho."],
      };
    }

    const reasons = [];
    if (THUNDER_CODES.has(forecast.weatherCode)) {
      reasons.push("Trovoada prevista: interrompa a exposição e siga os procedimentos locais de abrigo.");
    } else if (SEVERE_RAIN_CODES.has(forecast.weatherCode)) {
      reasons.push("Código de chuva intensa previsto; verifique drenagem, acesso e procedimento da atividade.");
    }
    if (forecast.rainProbability >= profile.rain) {
      reasons.push(`Chance de chuva (${forecast.rainProbability}%) acima do parâmetro indicativo desta atividade (${profile.rain}%).`);
    }
    if (forecast.wind >= profile.wind) {
      reasons.push(`Vento previsto (${forecast.wind} km/h) acima do parâmetro indicativo desta atividade (${profile.wind} km/h).`);
    }
    if (forecast.temperature >= 35) {
      reasons.push(`Temperatura prevista (${forecast.temperature}°C) elevada; consulte o plano de calor, pausas e hidratação do local.`);
    }

    const level = reasons.some((reason) => reason.startsWith("Trovoada"))
      || reasons.some((reason) => reason.includes("acima do parâmetro"))
      ? "attention"
      : reasons.length
        ? "caution"
        : "review";
    return {
      level,
      label: level === "attention"
        ? "Verifique o plano antes de iniciar"
        : level === "caution"
          ? "Condição a revisar"
          : "Sem gatilhos deste protótipo",
      reasons: reasons.length ? reasons : ["Parâmetros indicativos não acionados; isso não comprova condições seguras."],
    };
  }

  const api = Object.freeze({ WORK_PROFILES, assessWorkWindow });
  root.ClimaRotaFieldWeather = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
