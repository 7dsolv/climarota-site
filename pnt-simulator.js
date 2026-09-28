"use strict";

(function exposePntSimulator(root) {
  const MAX_DURATION_SECONDS = 900;
  const MAX_SAMPLE_RATE_HZ = 10;
  const MAX_SAMPLES = 9001;
  const STANDARD_GRAVITY = 9.80665;

  function seededRandom(seed) {
    let state = seed >>> 0;
    if (state === 0) state = 0x6d2b79f5;
    return () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function validateOptions(options) {
    if (!options || !Number.isFinite(options.durationSeconds)
      || options.durationSeconds <= 0 || options.durationSeconds > MAX_DURATION_SECONDS) {
      throw new Error("A duração deve ficar entre 1 e 900 segundos.");
    }
    if (!Number.isFinite(options.sampleRateHz)
      || options.sampleRateHz <= 0 || options.sampleRateHz > MAX_SAMPLE_RATE_HZ) {
      throw new Error("A frequência deve ficar entre 0 e 10 Hz.");
    }
    if (!Number.isFinite(options.speedMetersPerSecond)
      || options.speedMetersPerSecond <= 0 || options.speedMetersPerSecond > 30) {
      throw new Error("A velocidade deve ficar entre 0 e 30 m/s.");
    }
    if (!Number.isFinite(options.gnssNoiseMeters)
      || options.gnssNoiseMeters < 0 || options.gnssNoiseMeters > 50) {
      throw new Error("O ruído GNSS deve ficar entre 0 e 50 metros.");
    }
    if (!Number.isFinite(options.imuBiasMg)
      || options.imuBiasMg < 0 || options.imuBiasMg > 50) {
      throw new Error("O viés inercial deve ficar entre 0 e 50 mg.");
    }
    if (!Number.isFinite(options.gnssIntervalSeconds)
      || options.gnssIntervalSeconds < 1 || options.gnssIntervalSeconds > 60) {
      throw new Error("O intervalo GNSS deve ficar entre 1 e 60 segundos.");
    }
    if (!Number.isSafeInteger(options.seed) || options.seed < 0 || options.seed > 0xffffffff) {
      throw new Error("A semente aleatória deve ser um inteiro entre 0 e 4.294.967.295.");
    }
    if (!["straight", "loop", "sweep"].includes(options.path)) {
      throw new Error("Selecione um formato de trajetória disponível.");
    }
    const sampleCount = Math.ceil(options.durationSeconds * options.sampleRateHz) + 1;
    if (sampleCount > MAX_SAMPLES) {
      throw new Error(`Reduza a duração ou a frequência para não exceder ${MAX_SAMPLES} amostras.`);
    }
  }

  function calculateRmse(truth, estimate) {
    const squaredError = truth.reduce((total, point, index) => {
      const eastError = estimate[index].east - point.east;
      const northError = estimate[index].north - point.north;
      return total + eastError ** 2 + northError ** 2;
    }, 0);
    return Math.sqrt(squaredError / truth.length);
  }

  function calculateGnssRmse(truth, fixes, sampleInterval) {
    const squaredError = fixes.reduce((total, fix) => {
      const index = Math.min(truth.length - 1, Math.round(fix.time / sampleInterval));
      const eastError = fix.east - truth[index].east;
      const northError = fix.north - truth[index].north;
      return total + eastError ** 2 + northError ** 2;
    }, 0);
    return Math.sqrt(squaredError / fixes.length);
  }

  function simulate(options) {
    validateOptions(options);
    const random = seededRandom(options.seed);
    let spareGaussian = null;
    const gaussian = () => {
      if (spareGaussian !== null) {
        const result = spareGaussian;
        spareGaussian = null;
        return result;
      }
      const first = Math.max(Number.MIN_VALUE, random());
      const second = random();
      const magnitude = Math.sqrt(-2 * Math.log(first));
      spareGaussian = magnitude * Math.sin(2 * Math.PI * second);
      return magnitude * Math.cos(2 * Math.PI * second);
    };
    const interval = 1 / options.sampleRateHz;
    const count = Math.ceil(options.durationSeconds * options.sampleRateHz) + 1;
    const biasMagnitude = options.imuBiasMg * STANDARD_GRAVITY / 1000;
    const biasAngle = random() * Math.PI * 2;
    const biasEast = biasMagnitude * Math.cos(biasAngle);
    const biasNorth = biasMagnitude * Math.sin(biasAngle);
    const turnRate = 2 * Math.PI / options.durationSeconds;
    const turnRadius = options.speedMetersPerSecond / turnRate;
    const sweepPeriod = Math.max(60, options.durationSeconds / 3);

    const truth = [];
    for (let index = 0; index < count; index += 1) {
      const time = Math.min(index * interval, options.durationSeconds);
      let east;
      let north;
      if (options.path === "loop") {
        const angle = turnRate * time;
        east = turnRadius * Math.sin(angle);
        north = turnRadius * (1 - Math.cos(angle));
      } else if (options.path === "sweep") {
        east = options.speedMetersPerSecond * time;
        north = 60 * Math.sin(2 * Math.PI * time / sweepPeriod);
      } else {
        east = options.speedMetersPerSecond * time;
        north = 0;
      }
      truth.push({ time, east, north });
    }

    const acceleration = truth.map((point, index) => {
      const previous = truth[Math.max(0, index - 1)];
      const next = truth[Math.min(truth.length - 1, index + 1)];
      if (index === 0 || index === truth.length - 1) return { east: 0, north: 0 };
      const intervalBefore = point.time - previous.time;
      const intervalAfter = next.time - point.time;
      const span = (intervalBefore + intervalAfter) / 2;
      const velocityEastBefore = (point.east - previous.east) / intervalBefore;
      const velocityEastAfter = (next.east - point.east) / intervalAfter;
      const velocityNorthBefore = (point.north - previous.north) / intervalBefore;
      const velocityNorthAfter = (next.north - point.north) / intervalAfter;
      return {
        east: (velocityEastAfter - velocityEastBefore) / span,
        north: (velocityNorthAfter - velocityNorthBefore) / span,
      };
    });

    const gnss = [];
    const inertial = [{ time: 0, east: truth[0].east, north: truth[0].north }];
    const fused = [{ time: 0, east: truth[0].east, north: truth[0].north }];
    const initialVelocityEast = (truth[1].east - truth[0].east) / interval;
    const initialVelocityNorth = (truth[1].north - truth[0].north) / interval;
    let inertialVelocityEast = initialVelocityEast;
    let inertialVelocityNorth = initialVelocityNorth;
    let fusedVelocityEast = initialVelocityEast;
    let fusedVelocityNorth = initialVelocityNorth;
    let previousGnssIndex = 0;
    let previousGnssFixTime = 0;
    const alpha = 0.72;
    const beta = 0.24;

    for (let index = 0; index < truth.length; index += 1) {
      const point = truth[index];
      const isFix = index === 0 || point.time - truth[previousGnssIndex].time
        >= options.gnssIntervalSeconds - interval / 2;
      let fix = null;
      if (isFix) {
        fix = {
          time: point.time,
          east: point.east + gaussian() * options.gnssNoiseMeters,
          north: point.north + gaussian() * options.gnssNoiseMeters,
        };
        gnss.push(fix);
        previousGnssIndex = index;
      }
      if (index === 0) continue;

      const previousInertial = inertial[index - 1];
      const imu = acceleration[index - 1];
      const stepSeconds = point.time - truth[index - 1].time;
      const measuredEast = imu.east + biasEast;
      const measuredNorth = imu.north + biasNorth;
      inertialVelocityEast += measuredEast * stepSeconds;
      inertialVelocityNorth += measuredNorth * stepSeconds;
      inertial.push({
        time: point.time,
        east: previousInertial.east + inertialVelocityEast * stepSeconds,
        north: previousInertial.north + inertialVelocityNorth * stepSeconds,
      });

      const previousFused = fused[index - 1];
      fusedVelocityEast += measuredEast * stepSeconds;
      fusedVelocityNorth += measuredNorth * stepSeconds;
      let estimatedEast = previousFused.east
        + fusedVelocityEast * stepSeconds;
      let estimatedNorth = previousFused.north
        + fusedVelocityNorth * stepSeconds;
      if (fix) {
        const eastResidual = fix.east - estimatedEast;
        const northResidual = fix.north - estimatedNorth;
        estimatedEast += alpha * eastResidual;
        estimatedNorth += alpha * northResidual;
        const timeSincePreviousFix = Math.max(interval, point.time - previousGnssFixTime);
        fusedVelocityEast += beta * eastResidual / timeSincePreviousFix;
        fusedVelocityNorth += beta * northResidual / timeSincePreviousFix;
        previousGnssFixTime = point.time;
      }
      fused.push({ time: point.time, east: estimatedEast, north: estimatedNorth });
    }

    const metrics = Object.freeze({
      samples: truth.length,
      gnssFixes: gnss.length,
      inertialRmseMeters: calculateRmse(truth, inertial),
      gnssRmseMeters: calculateGnssRmse(truth, gnss, interval),
      fusedRmseMeters: calculateRmse(truth, fused),
      finalInertialDriftMeters: Math.hypot(
        inertial[inertial.length - 1].east - truth[truth.length - 1].east,
        inertial[inertial.length - 1].north - truth[truth.length - 1].north,
      ),
    });

    return Object.freeze({
      truth: Object.freeze(truth),
      gnss: Object.freeze(gnss),
      inertial: Object.freeze(inertial),
      fused: Object.freeze(fused),
      metrics,
    });
  }

  function toGeographicCoordinates(points, anchor, yawDegrees = 0) {
    if (!Array.isArray(points) || points.length < 1) {
      throw new Error("A trilha precisa conter ao menos uma posição.");
    }
    if (!anchor || !Number.isFinite(anchor.latitude) || Math.abs(anchor.latitude) > 85
      || !Number.isFinite(anchor.longitude) || Math.abs(anchor.longitude) > 180
      || !Number.isFinite(yawDegrees)) {
      throw new Error("A referência geográfica ou orientação é inválida.");
    }
    const radius = 6371008.8;
    const latitudeRadians = anchor.latitude * Math.PI / 180;
    const yaw = yawDegrees * Math.PI / 180;
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    return points.map(({ east, north }) => {
      if (!Number.isFinite(east) || !Number.isFinite(north)
        || Math.hypot(east, north) > 100000) {
        throw new Error("A trajetória contém uma posição inválida ou ultrapassa 100 km da origem.");
      }
      const rotatedEast = east * cosYaw + north * sinYaw;
      const rotatedNorth = -east * sinYaw + north * cosYaw;
      const latitude = anchor.latitude + rotatedNorth / radius * 180 / Math.PI;
      const longitude = anchor.longitude
        + rotatedEast / (radius * Math.cos(latitudeRadians)) * 180 / Math.PI;
      if (Math.abs(latitude) > 90) throw new Error("A trajetória gera latitude inválida.");
      return [
        ((longitude + 180) % 360 + 360) % 360 - 180,
        latitude,
      ];
    });
  }

  function exportCsv(result) {
    if (!result || !Array.isArray(result.truth) || !Array.isArray(result.inertial)
      || !Array.isArray(result.fused)) {
      throw new Error("Não há resultado válido para exportar.");
    }
    const gnssByTime = new Map(result.gnss.map((fix) => [fix.time, fix]));
    const rows = ["time_s,true_east_m,true_north_m,gnss_east_m,gnss_north_m,inertial_east_m,inertial_north_m,fused_east_m,fused_north_m"];
    for (let index = 0; index < result.truth.length; index += 1) {
      const truth = result.truth[index];
      const fix = gnssByTime.get(truth.time);
      const inertial = result.inertial[index];
      const fused = result.fused[index];
      rows.push([
        truth.time, truth.east, truth.north, fix?.east ?? "", fix?.north ?? "",
        inertial.east, inertial.north, fused.east, fused.north,
      ].join(","));
    }
    return `${rows.join("\n")}\n`;
  }

  const api = Object.freeze({ simulate, toGeographicCoordinates, exportCsv });
  root.ClimaRotaPntSimulator = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
