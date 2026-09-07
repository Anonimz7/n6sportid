(() => {
  let globalUnit = 'metric';

  const toNumber = (value) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const timeToSeconds = (hours, minutes, seconds) => (
    (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)
  );

  const formatTime = (totalSeconds, includeHours = true) => {
    const safeSeconds = Math.max(0, Math.round(totalSeconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = Math.floor(safeSeconds % 60);

    if (includeHours && hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const convertDistanceToMetric = (distance) => (
    globalUnit === 'imperial' ? distance * 1.60934 : distance
  );

  const convertDistanceFromMetric = (distance) => (
    globalUnit === 'imperial' ? distance / 1.60934 : distance
  );

  const showError = (errorId, message) => {
    const errorEl = document.getElementById(errorId);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.add('show');
    const resultsId = errorId.replace('Error', 'Results');
    const resultsEl = document.getElementById(resultsId);
    if (resultsEl) resultsEl.classList.remove('show');
  };

  const showResults = (resultsId, html) => {
    const errorId = resultsId.replace('Results', 'Error');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.classList.remove('show');
    const resultsEl = document.getElementById(resultsId);
    if (!resultsEl) return;
    resultsEl.innerHTML = html;
    resultsEl.classList.add('show');
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const updateAllLabels = () => {
    const isMetric = globalUnit === 'metric';
    const distanceUnit = isMetric ? 'km' : 'miles';

    const labelIds = [
      'paceDistanceLabel',
      'recentRaceDistanceLabel',
      'targetRaceDistanceLabel',
      'improvementDistanceLabel',
      'splitDistanceLabel',
      'splitIntervalLabel',
      'strideDistanceLabel',
      'vo2DistanceLabel',
      'trainingDistanceLabel'
    ];

    labelIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const text = el.textContent;
      if (/(km|miles)/.test(text)) {
        el.textContent = text.replace(/(km|miles)/, distanceUnit);
      }
    });

    const strideLengthLabel = document.getElementById('strideLengthLabel');
    if (strideLengthLabel) {
      strideLengthLabel.textContent = isMetric ? 'Stride Length (cm)' : 'Stride Length (inches)';
    }
  };

  const setActiveTab = (tabName) => {
    const panels = document.querySelectorAll('.tools-panel');
    panels.forEach((panel) => {
      panel.classList.add('hidden');
      panel.classList.remove('active');
    });

    const buttons = document.querySelectorAll('.tools-tab-btn');
    buttons.forEach((btn) => {
      btn.classList.remove('active', 'bg-white/5', 'border-neon', 'text-white');
      btn.classList.add('border-transparent', 'text-slateish');
    });

    const panel = document.getElementById(tabName);
    if (panel) {
      panel.classList.remove('hidden');
      panel.classList.add('active');
      const hash = panel.getAttribute('data-hash');
      if (hash) window.location.hash = hash;
    }

    const activeBtn = document.querySelector(`.tools-tab-btn[data-tab="${tabName}"]`);
    if (activeBtn) {
      activeBtn.classList.remove('border-transparent', 'text-slateish');
      activeBtn.classList.add('active', 'bg-white/5', 'border-neon', 'text-white');
    }
  };

  const openTabByHash = (hash) => {
    const panels = document.querySelectorAll('.tools-panel');
    for (const panel of panels) {
      if (panel.getAttribute('data-hash') === hash) {
        setActiveTab(panel.id);
        return;
      }
    }
  };

  const updatePaceDistanceLabel = () => {
    const paceUnit = document.getElementById('paceUnit');
    const label = document.getElementById('paceDistanceLabel');
    const input = document.getElementById('paceDistance');
    if (!paceUnit || !label || !input) return;
    if (paceUnit.value === 'meter') {
      label.textContent = 'Distance (m)';
      input.step = '1';
      input.placeholder = 'e.g., 5000';
    } else {
      label.textContent = `Distance (${globalUnit === 'metric' ? 'km' : 'miles'})`;
      input.step = '0.1';
      input.placeholder = 'e.g., 5';
    }
  };

  const updateSplitDistance = () => {
    const select = document.getElementById('splitDistanceSelect');
    const input = document.getElementById('splitDistance');
    if (!select || !input) return;
    if (select.value === 'custom') {
      input.classList.remove('hidden');
      input.disabled = false;
      input.placeholder = 'e.g., 21.1';
      input.value = '';
    } else {
      input.classList.add('hidden');
      input.disabled = true;
      input.value = select.value;
      input.placeholder = select.options[select.selectedIndex].text;
    }
  };

  const updateRecentRaceDistance = () => {
    const select = document.getElementById('recentRaceDistanceSelect');
    const input = document.getElementById('recentRaceDistance');
    if (!select || !input) return;
    if (select.value === 'custom') {
      input.classList.remove('hidden');
      input.disabled = false;
      input.placeholder = 'e.g., 10';
      input.value = '';
    } else {
      input.classList.add('hidden');
      input.disabled = true;
      input.value = select.value;
      input.placeholder = select.options[select.selectedIndex].text;
    }
  };

  const updateTargetRaceDistance = () => {
    const select = document.getElementById('targetRaceDistanceSelect');
    const input = document.getElementById('targetRaceDistance');
    if (!select || !input) return;
    if (select.value === 'custom') {
      input.classList.remove('hidden');
      input.disabled = false;
      input.placeholder = 'e.g., 21.1';
      input.value = '';
    } else {
      input.classList.add('hidden');
      input.disabled = true;
      input.value = select.value;
      input.placeholder = select.options[select.selectedIndex].text;
    }
  };

  const updateSplitStrategy = () => {
    const strategy = document.getElementById('splitStrategy');
    const group = document.getElementById('splitPercentageGroup');
    if (!strategy || !group) return;
    if (strategy.value === 'even') {
      group.classList.add('hidden');
    } else {
      group.classList.remove('hidden');
    }
  };

  const updateSplitPercentageValue = () => {
    const slider = document.getElementById('splitPercentage');
    const display = document.getElementById('splitPercentageValue');
    if (!slider || !display) return;
    display.textContent = `${parseFloat(slider.value).toFixed(1)}%`;
  };

  const calculateMagicMile = () => {
    const hours = toNumber(document.getElementById('magicHours')?.value);
    const minutes = toNumber(document.getElementById('magicMinutes')?.value);
    const seconds = toNumber(document.getElementById('magicSeconds')?.value);

    const totalSeconds = timeToSeconds(hours, minutes, seconds);
    if (totalSeconds === 0) {
      showError('magicMileError', 'Masukkan waktu magic mile yang valid.');
      return;
    }

    const mileToKm = 1.60934;
    const basePace = totalSeconds / (globalUnit === 'metric' ? mileToKm : 1);
    const predictions = {
      '5K': basePace * (globalUnit === 'metric' ? 5 : 3.1) * 1.05,
      '10K': basePace * (globalUnit === 'metric' ? 10 : 6.2) * 1.08,
      'Half Marathon': basePace * (globalUnit === 'metric' ? 21.1 : 13.1) * 1.15,
      'Marathon': basePace * (globalUnit === 'metric' ? 42.2 : 26.2) * 1.2
    };

    let results = '<div class="tools-result-grid">';
    results += `<div class="tools-result-item"><div class="tools-result-label">Magic Mile Time</div><div class="tools-result-value">${formatTime(totalSeconds, true)}</div></div>`;
    Object.entries(predictions).forEach(([race, time]) => {
      results += `<div class="tools-result-item"><div class="tools-result-label">${race} Prediction</div><div class="tools-result-value">${formatTime(time, true)}</div></div>`;
    });
    results += '</div>';
    showResults('magicMileResults', results);
  };

  const calculateMarathonPace = () => {
    const hours = toNumber(document.getElementById('marathonHours')?.value);
    const minutes = toNumber(document.getElementById('marathonMinutes')?.value);
    const seconds = toNumber(document.getElementById('marathonSeconds')?.value);
    const totalSeconds = timeToSeconds(hours, minutes, seconds);
    if (totalSeconds === 0) {
      showError('marathonError', 'Masukkan target waktu marathon yang valid.');
      return;
    }

    const marathonDistance = globalUnit === 'metric' ? 42.195 : 26.2;
    const pacePerUnit = totalSeconds / marathonDistance;
    const speed = (marathonDistance / (totalSeconds / 3600)).toFixed(2);
    const paceUnit = globalUnit === 'metric' ? 'min/km' : 'min/mile';
    const speedUnit = globalUnit === 'metric' ? 'km/h' : 'mph';

    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Required Pace</div><div class="tools-result-value">${formatTime(pacePerUnit, false)} ${paceUnit}</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Average Speed</div><div class="tools-result-value">${speed} ${speedUnit}</div></div>
      </div>
    `;
    showResults('marathonResults', results);
  };

  const calculatePace = () => {
    const paceUnitInput = document.getElementById('paceUnit')?.value || 'meter';
    const distance = toNumber(document.getElementById('paceDistance')?.value);
    const hours = toNumber(document.getElementById('paceHours')?.value);
    const minutes = toNumber(document.getElementById('paceMinutes')?.value);
    const seconds = toNumber(document.getElementById('paceSeconds')?.value);

    if (!distance) {
      showError('paceError', 'Masukkan jarak yang valid.');
      return;
    }

    const totalSeconds = timeToSeconds(hours, minutes, seconds);
    if (totalSeconds === 0) {
      showError('paceError', 'Masukkan waktu yang valid.');
      return;
    }

    const distanceKm = paceUnitInput === 'meter' ? distance / 1000 : distance;
    const pacePerKm = totalSeconds / distanceKm;
    const pacePerUnit = globalUnit === 'metric' ? pacePerKm : pacePerKm * 1.60934;
    const paceUnit = globalUnit === 'metric' ? 'min/km' : 'min/mile';

    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Pace</div><div class="tools-result-value">${formatTime(pacePerUnit, false)} ${paceUnit}</div></div>
      </div>
    `;
    showResults('paceResults', results);
  };

  const calculateRacePredictor = () => {
    const recentDistance = toNumber(document.getElementById('recentRaceDistance')?.value);
    const targetDistance = toNumber(document.getElementById('targetRaceDistance')?.value);
    const hours = toNumber(document.getElementById('recentRaceHours')?.value);
    const minutes = toNumber(document.getElementById('recentRaceMinutes')?.value);
    const seconds = toNumber(document.getElementById('recentRaceSeconds')?.value);

    if (!recentDistance || !targetDistance) {
      showError('racePredictorError', 'Masukkan jarak race yang valid.');
      return;
    }

    const totalSeconds = timeToSeconds(hours, minutes, seconds);
    if (totalSeconds === 0) {
      showError('racePredictorError', 'Masukkan waktu race yang valid.');
      return;
    }

    const recentDistanceMetric = convertDistanceToMetric(recentDistance);
    const targetDistanceMetric = convertDistanceToMetric(targetDistance);
    const predictedSeconds = totalSeconds * Math.pow(targetDistanceMetric / recentDistanceMetric, 1.06);

    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Predicted Time</div><div class="tools-result-value">${formatTime(predictedSeconds, true)}</div></div>
      </div>
    `;
    showResults('racePredictorResults', results);
  };

  const calculateImprovement = () => {
    const currentHours = toNumber(document.getElementById('currentBestHours')?.value);
    const currentMinutes = toNumber(document.getElementById('currentBestMinutes')?.value);
    const currentSeconds = toNumber(document.getElementById('currentBestSeconds')?.value);
    const targetHours = toNumber(document.getElementById('targetTimeHours')?.value);
    const targetMinutes = toNumber(document.getElementById('targetTimeMinutes')?.value);
    const targetSeconds = toNumber(document.getElementById('targetTimeSeconds')?.value);

    const currentTime = timeToSeconds(currentHours, currentMinutes, currentSeconds);
    const targetTime = timeToSeconds(targetHours, targetMinutes, targetSeconds);
    if (currentTime === 0 || targetTime === 0) {
      showError('improvementError', 'Masukkan waktu saat ini dan target dengan benar.');
      return;
    }

    const improvement = currentTime - targetTime;
    const percentImprovement = ((currentTime - targetTime) / currentTime * 100).toFixed(2);
    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Time Improvement</div><div class="tools-result-value">${formatTime(improvement, true)} (${percentImprovement}%)</div></div>
      </div>
    `;
    showResults('improvementResults', results);
  };

  const calculateSplits = () => {
    const distance = toNumber(document.getElementById('splitDistance')?.value);
    const interval = toNumber(document.getElementById('splitInterval')?.value);
    const hours = toNumber(document.getElementById('splitHours')?.value);
    const minutes = toNumber(document.getElementById('splitMinutes')?.value);
    const seconds = toNumber(document.getElementById('splitSeconds')?.value);

    if (!distance || !interval) {
      showError('splitError', 'Masukkan jarak dan interval yang valid.');
      return;
    }

    const totalSeconds = timeToSeconds(hours, minutes, seconds);
    if (totalSeconds === 0) {
      showError('splitError', 'Masukkan waktu total yang valid.');
      return;
    }

    const distanceMetric = convertDistanceToMetric(distance);
    const intervalMetric = convertDistanceToMetric(interval);
    const numberOfSplits = Math.floor(distanceMetric / intervalMetric);

    const basePace = totalSeconds / distanceMetric;
    const distanceUnit = globalUnit === 'metric' ? 'km' : 'miles';
    const paceUnit = globalUnit === 'metric' ? 'min/km' : 'min/mile';

    let results = '<div class="tools-result-grid">';
    let cumulativeTime = 0;
    for (let i = 1; i <= numberOfSplits; i += 1) {
      const splitTime = basePace * intervalMetric;
      cumulativeTime += splitTime;
      results += `<div class="tools-result-item"><div class="tools-result-label">${(interval * i)} ${distanceUnit}</div><div class="tools-result-value">${formatTime(cumulativeTime, true)} (${formatTime(globalUnit === 'metric' ? basePace : basePace * 1.60934, false)} ${paceUnit})</div></div>`;
    }
    results += '</div>';
    showResults('splitResults', results);
  };

  const calculateStepsToDistance = () => {
    const steps = toNumber(document.getElementById('stepsCount')?.value);
    const strideLength = toNumber(document.getElementById('strideLength')?.value);
    if (!steps || !strideLength) {
      showError('stepsError', 'Masukkan jumlah langkah dan stride length yang valid.');
      return;
    }

    let distanceMeters;
    if (globalUnit === 'metric') {
      distanceMeters = (steps * strideLength) / 100;
    } else {
      distanceMeters = (steps * strideLength * 2.54) / 100;
    }

    const distanceKm = distanceMeters / 1000;
    const distanceMiles = distanceKm * 0.621371;
    const displayDistance = globalUnit === 'metric' ? distanceKm : distanceMiles;
    const distanceUnit = globalUnit === 'metric' ? 'km' : 'miles';

    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Distance</div><div class="tools-result-value">${displayDistance.toFixed(2)} ${distanceUnit}</div></div>
      </div>
    `;
    showResults('stepsResults', results);
  };

  const calculateStrideLength = () => {
    const distance = toNumber(document.getElementById('strideDistance')?.value);
    const steps = toNumber(document.getElementById('strideStepsCount')?.value);
    if (!distance || !steps) {
      showError('strideLengthError', 'Masukkan jarak dan jumlah langkah yang valid.');
      return;
    }

    const distanceMetric = convertDistanceToMetric(distance);
    const distanceMeters = distanceMetric * 1000;
    const strideLengthCm = (distanceMeters / steps) * 100;
    const strideLengthInches = strideLengthCm / 2.54;
    const displayStrideLength = globalUnit === 'metric' ? strideLengthCm : strideLengthInches;
    const strideUnit = globalUnit === 'metric' ? 'cm' : 'inches';

    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Stride Length</div><div class="tools-result-value">${displayStrideLength.toFixed(1)} ${strideUnit}</div></div>
      </div>
    `;
    showResults('strideLengthResults', results);
  };

  const calculateVDOT = (distKm, timeSec) => {
    const timeMin = timeSec / 60;
    const velocity = (distKm * 1000 / timeSec) * 60;
    const vo2 = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);
    const percentMax = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMin) + 0.2989558 * Math.exp(-0.1932605 * timeMin);
    return vo2 / percentMax;
  };

  const getPaceFromVDOT = (vdot, percent) => {
    const vo2Target = percent * vdot;
    const a = 0.000104;
    const b = 0.182258;
    const c = -(vo2Target + 4.6);
    const discriminant = Math.pow(b, 2) - 4 * a * c;
    if (discriminant < 0) return null;
    const v = (-b + Math.sqrt(discriminant)) / (2 * a);
    const secPerKm = (1000 / v) * 60;
    return globalUnit === 'metric' ? secPerKm : secPerKm * 1.60934;
  };

  const calculateTrainingPaces = () => {
    const distance = toNumber(document.getElementById('trainingDistance')?.value);
    const bestHours = toNumber(document.getElementById('bestTimeHours')?.value);
    const bestMinutes = toNumber(document.getElementById('bestTimeMinutes')?.value);
    const bestSeconds = toNumber(document.getElementById('bestTimeSeconds')?.value);

    const bestTimeSec = timeToSeconds(bestHours, bestMinutes, bestSeconds);
    if (distance <= 0 || bestTimeSec <= 0) {
      showError('trainingPaceError', 'Masukkan jarak dan waktu race terbaik.');
      return;
    }

    const distMetric = convertDistanceToMetric(distance);
    const vdot = calculateVDOT(distMetric, bestTimeSec);
    const paceUnit = globalUnit === 'metric' ? 'min/km' : 'min/mile';
    const trainingPercents = { easy: 0.65, moderate: 0.75, tempo: 0.85, interval: 0.95, repetition: 1.0 };

    let results = '<div class="tools-result-grid">';
    results += `<div class="tools-result-item"><div class="tools-result-label">Estimated VDOT</div><div class="tools-result-value">${vdot.toFixed(1)}</div></div>`;
    Object.entries(trainingPercents).forEach(([name, pct]) => {
      const sec = getPaceFromVDOT(vdot, pct);
      if (!sec) return;
      results += `<div class="tools-result-item"><div class="tools-result-label">${name.toUpperCase()}</div><div class="tools-result-value">${formatTime(sec, false)} ${paceUnit}</div></div>`;
    });
    results += '</div>';
    showResults('trainingPaceResults', results);
  };

  const calculateVO2Max = () => {
    const distance = toNumber(document.getElementById('vo2Distance')?.value);
    const hours = toNumber(document.getElementById('vo2Hours')?.value);
    const minutes = toNumber(document.getElementById('vo2Minutes')?.value);
    const seconds = toNumber(document.getElementById('vo2Seconds')?.value);

    if (!distance) {
      showError('vo2Error', 'Masukkan jarak yang valid.');
      return;
    }
    const totalSeconds = timeToSeconds(hours, minutes, seconds);
    if (totalSeconds === 0) {
      showError('vo2Error', 'Masukkan waktu yang valid.');
      return;
    }

    const distanceMetric = convertDistanceToMetric(distance);
    const velocityMPerMin = (distanceMetric * 1000) / (totalSeconds / 60);
    const vo2Max = -4.6 + 0.182258 * velocityMPerMin + 0.000104 * Math.pow(velocityMPerMin, 2);
    const pace = totalSeconds / distanceMetric;
    const adjustedPace = globalUnit === 'metric' ? pace : pace * 1.60934;
    const paceUnit = globalUnit === 'metric' ? 'min/km' : 'min/mile';

    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Race Pace</div><div class="tools-result-value">${formatTime(adjustedPace, false)} ${paceUnit}</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Estimated VO2 Max</div><div class="tools-result-value">${vo2Max.toFixed(1)} ml/kg/min</div></div>
      </div>
    `;
    showResults('vo2Results', results);
  };

  const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));

  const calculateHydration = () => {
    const durationMin = Math.round(toNumber(document.getElementById('hydDuration')?.value));
    const replacePct = toNumber(document.getElementById('hydReplacePct')?.value) || 0.6;
    const tempC = toNumber(document.getElementById('hydTemp')?.value);
    const humidity = toNumber(document.getElementById('hydHumidity')?.value);
    const sweatRateInput = toNumber(document.getElementById('hydSweatRate')?.value);
    const saltiness = document.getElementById('hydSaltiness')?.value || 'normal';

    if (!durationMin || durationMin < 10) {
      showError('hydrationError', 'Durasi lari minimal 10 menit.');
      return;
    }

    const safeTempC = Number.isFinite(tempC) ? clampNumber(tempC, 0, 50) : 28;
    const safeHumidity = Number.isFinite(humidity) ? clampNumber(humidity, 0, 100) : 70;

    let sweatRateMlPerHour;
    if (Number.isFinite(sweatRateInput) && sweatRateInput > 0) {
      sweatRateMlPerHour = clampNumber(sweatRateInput, 200, 2500);
    } else {
      let estimated = 600;
      estimated += (safeTempC - 20) * 25;
      estimated += (safeHumidity - 50) * 5;
      if (durationMin >= 90) estimated += 50;
      sweatRateMlPerHour = clampNumber(estimated, 350, 1800);
    }

    const mgPerLiterMap = { low: 500, normal: 700, high: 900 };
    const sodiumMgPerLiter = mgPerLiterMap[saltiness] || 700;
    const sodiumMgPerHour = (sweatRateMlPerHour / 1000) * sodiumMgPerLiter;

    const recommendedMlPerHour = clampNumber(sweatRateMlPerHour * replacePct, 200, 1200);
    const totalMl = recommendedMlPerHour * (durationMin / 60);
    const totalSodiumMg = sodiumMgPerHour * (durationMin / 60);

    const toOz = (ml) => ml / 29.5735;
    const perHourText = globalUnit === 'imperial'
      ? `${Math.round(recommendedMlPerHour)} ml/hr (${toOz(recommendedMlPerHour).toFixed(0)} fl oz/hr)`
      : `${Math.round(recommendedMlPerHour)} ml/hr`;

    const totalText = globalUnit === 'imperial'
      ? `${Math.round(totalMl)} ml (${toOz(totalMl).toFixed(0)} fl oz)`
      : `${Math.round(totalMl)} ml`;

    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Sweat Rate (est.)</div><div class="tools-result-value">${Math.round(sweatRateMlPerHour)} ml/hr</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Target Intake</div><div class="tools-result-value">${perHourText}</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Total Intake</div><div class="tools-result-value">${totalText}</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Sodium (est.)</div><div class="tools-result-value">${Math.round(sodiumMgPerHour)} mg/hr</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Total Sodium</div><div class="tools-result-value">${Math.round(totalSodiumMg)} mg</div></div>
      </div>
    `;
    showResults('hydrationResults', results);
  };

  const calculateFuelingPlan = () => {
    const hours = toNumber(document.getElementById('fuelHours')?.value);
    const minutes = toNumber(document.getElementById('fuelMinutes')?.value);
    const seconds = toNumber(document.getElementById('fuelSeconds')?.value);
    const intensity = document.getElementById('fuelIntensity')?.value || 'race';
    const tolerance = document.getElementById('fuelTolerance')?.value || 'medium';
    const fuelType = document.getElementById('fuelType')?.value || 'gel';
    const intervalMin = Math.round(toNumber(document.getElementById('fuelInterval')?.value)) || 20;

    const totalSec = timeToSeconds(hours, minutes, seconds);
    if (!totalSec || totalSec < 20 * 60) {
      showError('fuelingError', 'Durasi minimal 20 menit.');
      return;
    }

    const durationHours = totalSec / 3600;
    let baseCarbs;
    if (durationHours < 1) baseCarbs = 25;
    else if (durationHours < 2) baseCarbs = 50;
    else if (durationHours < 3) baseCarbs = 70;
    else baseCarbs = 85;

    const intensityAdj = intensity === 'easy' ? -10 : intensity === 'tempo' ? 0 : 5;
    const toleranceAdj = tolerance === 'low' ? -15 : tolerance === 'high' ? 10 : 0;
    const carbsPerHour = clampNumber(baseCarbs + intensityAdj + toleranceAdj, 20, 95);
    const carbsPerInterval = carbsPerHour * (intervalMin / 60);

    const gelCarbs = 25;
    const drinkCarbsPer500 = 30;
    let guidance = '';
    if (fuelType === 'gel') {
      guidance = `approx ${(carbsPerHour / gelCarbs).toFixed(1)} gel/hr (assume ${gelCarbs}g/gel)`;
    } else if (fuelType === 'drink') {
      const mlPerHour = (carbsPerHour / drinkCarbsPer500) * 500;
      guidance = `approx ${Math.round(mlPerHour)} ml/hr drink (assume ${drinkCarbsPer500}g/500ml)`;
    } else {
      const gelHalf = (carbsPerHour * 0.5) / gelCarbs;
      const drinkHalfMl = ((carbsPerHour * 0.5) / drinkCarbsPer500) * 500;
      guidance = `approx ${gelHalf.toFixed(1)} gel/hr + ${Math.round(drinkHalfMl)} ml/hr drink`;
    }

    const scheduleLines = [];
    for (let t = intervalMin; t < Math.ceil(totalSec / 60) + 0.1; t += intervalMin) {
      if (t > (totalSec / 60)) break;
      scheduleLines.push(`${formatTime(t * 60, true)} -> ~${Math.round(carbsPerInterval)} g`);
    }

    const scheduleHtml = scheduleLines.length ? scheduleLines.join('<br>') : 'Durasi terlalu pendek.';
    const results = `
      <div class="tools-result-grid">
        <div class="tools-result-item"><div class="tools-result-label">Durasi</div><div class="tools-result-value">${formatTime(totalSec, true)}</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Rekomendasi Karbo</div><div class="tools-result-value">${Math.round(carbsPerHour)} g/hr</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Per ${intervalMin} menit</div><div class="tools-result-value">~${Math.round(carbsPerInterval)} g</div></div>
        <div class="tools-result-item"><div class="tools-result-label">Panduan Praktis</div><div class="tools-result-value">${guidance}</div></div>
        <div class="tools-result-item" style="align-items:flex-start;">
          <div class="tools-result-label">Jadwal</div>
          <div class="tools-result-value" style="white-space:normal;line-height:1.35;">${scheduleHtml}</div>
        </div>
      </div>
    `;
    showResults('fuelingResults', results);
  };

  const calculateHeartRateZones = () => {
    const age = toNumber(document.getElementById('hrAge')?.value);
    const hrRestInput = document.getElementById('hrRest')?.value;
    const hrRest = hrRestInput ? toNumber(hrRestInput) : 60;
    if (!age) {
      showError('heartRateError', 'Usia wajib diisi.');
      return;
    }

    const hrmax = 220 - age;
    const hrr = hrmax - hrRest;
    const zones = [
      { name: 'Zone 1 - Recovery', min: 0.5, max: 0.6 },
      { name: 'Zone 2 - Easy', min: 0.6, max: 0.7 },
      { name: 'Zone 3 - Moderate', min: 0.7, max: 0.8 },
      { name: 'Zone 4 - Tempo', min: 0.8, max: 0.9 },
      { name: 'Zone 5 - Interval', min: 0.9, max: 1.0 }
    ];

    let results = '<div class="tools-result-grid">';
    results += `<div class="tools-result-item"><div class="tools-result-label">HR Max (estimasi)</div><div class="tools-result-value">${Math.round(hrmax)} bpm</div></div>`;
    zones.forEach((z) => {
      const minHR = Math.round(hrRest + (z.min * hrr));
      const maxHR = Math.round(hrRest + (z.max * hrr));
      results += `<div class="tools-result-item"><div class="tools-result-label">${z.name}</div><div class="tools-result-value">${minHR}-${maxHR} bpm</div></div>`;
    });
    results += '</div>';
    showResults('heartRateResults', results);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const unitSelect = document.getElementById('globalUnit');
    if (unitSelect) {
      unitSelect.addEventListener('change', () => {
        globalUnit = unitSelect.value;
        updateAllLabels();
        updatePaceDistanceLabel();
      });
    }

    document.querySelectorAll('.tools-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        setActiveTab(btn.getAttribute('data-tab'));
      });
    });

    document.getElementById('paceUnit')?.addEventListener('change', updatePaceDistanceLabel);
    document.getElementById('splitDistanceSelect')?.addEventListener('change', updateSplitDistance);
    document.getElementById('recentRaceDistanceSelect')?.addEventListener('change', updateRecentRaceDistance);
    document.getElementById('targetRaceDistanceSelect')?.addEventListener('change', updateTargetRaceDistance);
    document.getElementById('splitStrategy')?.addEventListener('change', updateSplitStrategy);
    document.getElementById('splitPercentage')?.addEventListener('input', updateSplitPercentageValue);

    document.getElementById('btnMagicMile')?.addEventListener('click', calculateMagicMile);
    document.getElementById('btnMarathon')?.addEventListener('click', calculateMarathonPace);
    document.getElementById('btnPace')?.addEventListener('click', calculatePace);
    document.getElementById('btnPredictor')?.addEventListener('click', calculateRacePredictor);
    document.getElementById('btnImprovement')?.addEventListener('click', calculateImprovement);
    document.getElementById('btnSplits')?.addEventListener('click', calculateSplits);
    document.getElementById('btnSteps')?.addEventListener('click', calculateStepsToDistance);
    document.getElementById('btnStride')?.addEventListener('click', calculateStrideLength);
    document.getElementById('btnTraining')?.addEventListener('click', calculateTrainingPaces);
    document.getElementById('btnHydration')?.addEventListener('click', calculateHydration);
    document.getElementById('btnFueling')?.addEventListener('click', calculateFuelingPlan);
    document.getElementById('btnVo2')?.addEventListener('click', calculateVO2Max);
    document.getElementById('btnHeart')?.addEventListener('click', calculateHeartRateZones);

    updateAllLabels();
    updatePaceDistanceLabel();
    updateSplitDistance();
    updateRecentRaceDistance();
    updateTargetRaceDistance();
    updateSplitStrategy();
    updateSplitPercentageValue();

    const hash = window.location.hash.substring(1);
    if (hash) openTabByHash(hash);
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) openTabByHash(hash);
  });
})();
