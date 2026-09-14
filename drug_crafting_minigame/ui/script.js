let activeConfig = null;
let isRunning = false;
let animationFrameId = null;

// Game State Variables
let currentTemp = 0;
let currentPressure = 0;
let remainingTime = 0;
let totalDuration = 30;

// Inputs
let keysHeld = { heat: false, cool: false };

// Purity Accumulator
let ticksInTargetTemp = 0;
let ticksInTargetPressure = 0;
let totalTicks = 0;
let reagentsInjected = {};
let activePromptReagent = null;
let promptTimeout = null;

// Web Audio API Synthesizer Context
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Synthesize Audio Effects
function playSynthSound(type) {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        if (type === 'vent') {
            // White noise burst for steam release
            const bufferSize = ctx.sampleRate * 0.25;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1200;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);
        } else if (type === 'beep') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'success') {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + (idx * 0.08));
                gain.gain.setValueAtTime(0.2, now + (idx * 0.08));
                gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + (idx * 0.08));
                osc.stop(now + (idx * 0.08) + 0.25);
            });
        } else if (type === 'fail') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.4);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        }
    } catch (e) {
        console.log("Audio play error", e);
    }
}

// Post message to FiveM client
function fetchNUI(eventName, data = {}) {
    return fetch(`https://${GetParentResourceName()}/${eventName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data)
    });
}

// Start Minigame Engine
function startMinigame(recipeConfig) {
    activeConfig = recipeConfig;
    isRunning = true;
    
    currentTemp = recipeConfig.startTemp || 50;
    currentPressure = recipeConfig.startPressure || 10;
    totalDuration = recipeConfig.duration || 30;
    remainingTime = totalDuration;

    ticksInTargetTemp = 0;
    ticksInTargetPressure = 0;
    totalTicks = 0;
    reagentsInjected = {};
    activePromptReagent = null;

    // DOM Setup
    document.getElementById('recipe-title').innerText = recipeConfig.label.toUpperCase();
    document.getElementById('recipe-subtitle').innerText = recipeConfig.subtitle;
    document.getElementById('minigame-container').classList.remove('hidden');
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('reagent-prompt').classList.add('hidden');

    // Target Zones positioning
    setupTargetZones(recipeConfig);
    buildReagentList(recipeConfig);

    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function setupTargetZones(config) {
    // Temp target zone (0°C - 300°C)
    const tempTargetMin = config.targetTemp - config.tempTolerance;
    const tempTargetMax = config.targetTemp + config.tempTolerance;
    const tempBottomPct = (tempTargetMin / 300) * 100;
    const tempHeightPct = ((tempTargetMax - tempTargetMin) / 300) * 100;

    const tempTargetElem = document.getElementById('temp-target-zone');
    tempTargetElem.style.bottom = `${tempBottomPct}%`;
    tempTargetElem.style.height = `${tempHeightPct}%`;

    document.getElementById('target-temp-label').innerText = `${config.targetTemp}°C - TARGET`;

    // Pressure target zone (0 - 100 PSI)
    const pressTargetMin = config.targetPressure - config.pressureTolerance;
    const pressTargetMax = config.targetPressure + config.pressureTolerance;
    const pressBottomPct = (pressTargetMin / 100) * 100;
    const pressHeightPct = ((pressTargetMax - pressTargetMin) / 100) * 100;

    const pressTargetElem = document.getElementById('pressure-target-zone');
    pressTargetElem.style.bottom = `${pressBottomPct}%`;
    pressTargetElem.style.height = `${pressHeightPct}%`;

    document.getElementById('target-pressure-label').innerText = `${config.targetPressure} PSI - TARGET`;
}

function buildReagentList(config) {
    const listElem = document.getElementById('reagent-list');
    listElem.innerHTML = '';
    
    if (!config.reagents) return;
    config.reagents.forEach(r => {
        const item = document.createElement('div');
        item.id = `reagent-item-${r.id}`;
        item.className = 'reagent-item pending';
        item.innerHTML = `<span>${r.label}</span> <strong>PENDING</strong>`;
        listElem.appendChild(item);
    });
}

// Game Loop
let lastFrameTime = performance.now();

function gameLoop(currentTime) {
    if (!isRunning) return;

    const dt = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    // Timer Update
    remainingTime -= dt;
    if (remainingTime <= 0) {
        remainingTime = 0;
        finishMinigame(true);
        return;
    }

    const mins = Math.floor(remainingTime / 60);
    const secs = Math.floor(remainingTime % 60);
    document.getElementById('timer-display').innerText = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Temperature Physics
    if (keysHeld.heat) {
        currentTemp += (activeConfig.heatRate || 3.5) * (dt * 60);
    } else if (keysHeld.cool) {
        currentTemp -= (activeConfig.coolRate || 2.8) * (dt * 60);
    } else {
        currentTemp += (activeConfig.tempDrift || 0.2) * (dt * 60);
    }
    currentTemp = Math.max(0, Math.min(300, currentTemp));

    // Pressure Physics
    currentPressure += (activeConfig.pressureBuildRate || 2.5) * (dt * 60);
    currentPressure = Math.max(0, currentPressure);

    // Check Catastrophic Overpressure Rupture
    if (currentPressure >= (activeConfig.maxPressure || 100)) {
        finishMinigame(false, "OVERPRESSURE");
        return;
    }

    // Purity Calculation & Tracking
    totalTicks++;
    const isTempInTarget = Math.abs(currentTemp - activeConfig.targetTemp) <= activeConfig.tempTolerance;
    const isPressureInTarget = Math.abs(currentPressure - activeConfig.targetPressure) <= activeConfig.pressureTolerance;

    if (isTempInTarget) ticksInTargetTemp++;
    if (isPressureInTarget) ticksInTargetPressure++;

    // Check Reagent Timers
    const elapsedTime = totalDuration - remainingTime;
    if (activeConfig.reagents) {
        activeConfig.reagents.forEach(r => {
            if (!reagentsInjected[r.id] && elapsedTime >= r.timeTrigger && activePromptReagent !== r.id) {
                triggerReagentPrompt(r);
            }
        });
    }

    // Update UI Elements
    updateUI();

    requestAnimationFrame(gameLoop);
}

function updateUI() {
    // Temperature Gauge
    const tempPct = (currentTemp / 300) * 100;
    document.getElementById('temp-fill').style.height = `${tempPct}%`;
    document.getElementById('temp-readout').innerText = `${Math.floor(currentTemp)}°C`;

    // Pressure Gauge
    const pressPct = (currentPressure / (activeConfig.maxPressure || 100)) * 100;
    document.getElementById('pressure-fill').style.height = `${pressPct}%`;
    
    const pressElem = document.getElementById('pressure-readout');
    pressElem.innerText = `${Math.floor(currentPressure)} PSI`;
    if (pressPct > 80) {
        pressElem.className = 'digital-readout alert-red';
    } else if (pressPct > 55) {
        pressElem.className = 'digital-readout alert-yellow';
    } else {
        pressElem.className = 'digital-readout alert-green';
    }

    // Live Purity Readout
    const currentPurity = calculatePurityScore();
    document.getElementById('purity-readout').innerText = `PURITY: ${Math.floor(currentPurity)}%`;
}

function calculatePurityScore() {
    if (totalTicks === 0) return 100;
    const tempRatio = ticksInTargetTemp / totalTicks;
    const pressRatio = ticksInTargetPressure / totalTicks;
    
    let basePurity = ((tempRatio * 0.5) + (pressRatio * 0.5)) * 100;

    // Penalty for missed reagents
    if (activeConfig.reagents) {
        let missingPenalty = 0;
        activeConfig.reagents.forEach(r => {
            if (r.required && !reagentsInjected[r.id] && (totalDuration - remainingTime) > (r.timeTrigger + 6)) {
                missingPenalty += 20;
            }
        });
        basePurity = Math.max(0, basePurity - missingPenalty);
    }

    return Math.max(0, Math.min(100, basePurity));
}

function triggerReagentPrompt(reagent) {
    activePromptReagent = reagent.id;
    playSynthSound('beep');
    
    const promptElem = document.getElementById('reagent-prompt');
    document.getElementById('prompt-text').innerText = `INJECT ${reagent.label.toUpperCase()}!`;
    promptElem.classList.remove('hidden');
}

function injectCurrentReagent() {
    if (!activePromptReagent) return;
    
    reagentsInjected[activePromptReagent] = true;
    playSynthSound('beep');

    const itemElem = document.getElementById(`reagent-item-${activePromptReagent}`);
    if (itemElem) {
        itemElem.className = 'reagent-item done';
        itemElem.innerHTML = `<span>${activeConfig.reagents.find(r => r.id === activePromptReagent).label}</span> <strong>ADDED</strong>`;
    }

    activePromptReagent = null;
    document.getElementById('reagent-prompt').classList.add('hidden');
}

function ventPressure() {
    if (!isRunning) return;
    currentPressure = Math.max(0, currentPressure - (activeConfig.ventPower || 18));
    playSynthSound('vent');
}

function finishMinigame(success, reason = null) {
    isRunning = false;
    const finalPurity = calculatePurityScore();
    let finalGrade = "F";
    let yieldMult = 0.0;
    let label = "Failed / Ruined";

    if (success && finalPurity >= 50) {
        playSynthSound('success');
        for (let threshold of (window.ConfigGradeThresholds || defaultGradeThresholds)) {
            if (finalPurity >= threshold.minPurity) {
                finalGrade = threshold.grade;
                yieldMult = threshold.yieldMultiplier;
                label = threshold.label;
                break;
            }
        }
    } else {
        playSynthSound('fail');
        success = false;
    }

    // Display Modal
    document.getElementById('result-modal').classList.remove('hidden');
    const iconElem = document.getElementById('modal-status-icon');
    
    if (success) {
        iconElem.className = 'status-icon success';
        iconElem.innerText = '✓';
        document.getElementById('modal-title').innerText = 'SYNTHESIS SUCCESSFUL';
    } else {
        iconElem.className = 'status-icon failed';
        iconElem.innerText = '✕';
        document.getElementById('modal-title').innerText = reason === "OVERPRESSURE" ? 'REACTOR RUPTURED!' : 'SYNTHESIS FAILED';
    }

    document.getElementById('modal-grade').innerText = finalGrade;
    document.getElementById('modal-purity').innerText = `${Math.floor(finalPurity)}%`;
    document.getElementById('modal-rating').innerText = label;

    document.getElementById('modal-close-btn').onclick = () => {
        document.getElementById('minigame-container').classList.add('hidden');
        fetchNUI('minigameComplete', {
            success: success,
            purity: finalPurity,
            grade: finalGrade,
            yieldMultiplier: yieldMult,
            reason: reason
        });
    };
}

const defaultGradeThresholds = [
    { minPurity: 95, grade: "S+", label: "Masterpiece Pure Batch", yieldMultiplier: 1.5 },
    { minPurity: 85, grade: "A", label: "High Grade Batch", yieldMultiplier: 1.2 },
    { minPurity: 70, grade: "B", label: "Standard Street Grade", yieldMultiplier: 1.0 },
    { minPurity: 50, grade: "C", label: "Impure Cut Product", yieldMultiplier: 0.7 },
    { minPurity: 0, grade: "F", label: "Ruined Batch / Failed", yieldMultiplier: 0.0 }
];

// Controls & Keyboard Listeners
window.addEventListener('keydown', (e) => {
    if (!isRunning) return;

    if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        keysHeld.heat = true;
        document.getElementById('btn-heat').classList.add('active');
    }
    if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        keysHeld.cool = true;
        document.getElementById('btn-cool').classList.add('active');
    }
    if (e.code === 'Space') {
        e.preventDefault();
        ventPressure();
        document.getElementById('btn-vent').classList.add('active');
    }
    if (e.key === 'e' || e.key === 'E') {
        injectCurrentReagent();
    }
    if (e.key === 'Escape') {
        isRunning = false;
        document.getElementById('minigame-container').classList.add('hidden');
        fetchNUI('minigameClose');
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        keysHeld.heat = false;
        document.getElementById('btn-heat').classList.remove('active');
    }
    if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        keysHeld.cool = false;
        document.getElementById('btn-cool').classList.remove('active');
    }
    if (e.code === 'Space') {
        document.getElementById('btn-vent').classList.remove('active');
    }
});

// Click Listeners
document.getElementById('btn-heat').addEventListener('mousedown', () => keysHeld.heat = true);
document.getElementById('btn-heat').addEventListener('mouseup', () => keysHeld.heat = false);

document.getElementById('btn-cool').addEventListener('mousedown', () => keysHeld.cool = true);
document.getElementById('btn-cool').addEventListener('mouseup', () => keysHeld.cool = false);

document.getElementById('btn-vent').addEventListener('click', ventPressure);
document.getElementById('btn-inject').addEventListener('click', injectCurrentReagent);

// FiveM Message Listener
window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.action === "startMinigame") {
        startMinigame(data.config);
    }
});
