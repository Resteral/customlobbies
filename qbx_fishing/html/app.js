/* ===========================================================
   qbx_fishing - NUI fishing minigame
   Phases: CAST -> WAIT -> BITE -> REEL -> RESULT
   =========================================================== */

const RES = (typeof GetParentResourceName === "function")
    ? GetParentResourceName()
    : "qbx_fishing";

function post(name, data) {
    return fetch(`https://${RES}/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data || {}),
    }).catch(() => {});
}

/* ---------- DOM ---------- */
const el = {
    game: document.getElementById("game"),
    canvas: document.getElementById("scene"),
    rodLabel: document.getElementById("rod-label"),
    phaseText: document.getElementById("phase-text"),
    bite: document.getElementById("bite-prompt"),
    biteTimer: document.getElementById("bite-timer-fill"),
    reel: document.getElementById("reel-ui"),
    zone: document.getElementById("control-zone"),
    fishMarker: document.getElementById("fish-marker"),
    barTrack: document.getElementById("bar-track"),
    progress: document.getElementById("progress-fill"),
    tension: document.getElementById("tension-fill"),
    struggleWarn: document.getElementById("struggle-warn"),
    result: document.getElementById("result"),
    resultTitle: document.getElementById("result-title"),
    resultSub: document.getElementById("result-sub"),
};

const ctx = el.canvas.getContext("2d");
const W = 760, H = 460;
el.canvas.width = W;
el.canvas.height = H;

/* ---------- Scene constants ---------- */
const WATER_Y = 172;                 // surface line
const ROD_BASE = { x: 742, y: 452 }; // off bottom-right corner
const LAND = { x: 300, y: WATER_Y }; // where the bobber lands

/* ---------- State ---------- */
let cfg = null;
let phase = "idle";
let raf = null;
let lastT = 0;

let spaceDown = false;
let spaceEdge = false; // fresh press since last consumed

// scene
let sceneStart = 0;
let bobber = { x: ROD_BASE.x - 40, y: ROD_BASE.y - 200, sunk: 0 };
let ripples = [];
let fishes = [];       // ambient shadows
let biter = null;      // the fish that comes to bite
let waitUntil = 0;

// bite
let biteStart = 0;

// reel
let zonePos = 0.5, zoneVel = 0;
let fishPos = 0.5, fishTarget = 0.5, retarget = 0;
let progress = 0.28;
let reelStart = 0;

// struggle / line tension
let tension = 0;          // 0..1, snaps at 1
let struggling = false;   // is the fish currently thrashing?
let struggleTimer = 0;    // countdown of current phase (struggle or calm)
let graceTimer = 0;       // brief reaction window at the start of a struggle
let critShake = false;    // screen-shake flag while tension is critical

/* ===========================================================
   Message bridge
   =========================================================== */
window.addEventListener("message", (e) => {
    const d = e.data || {};
    if (d.action === "start") start(d.config, d.rodLabel);
    else if (d.action === "forceClose") hardClose();
});

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        if (!spaceDown) spaceEdge = true;
        spaceDown = true;
    }
});
document.addEventListener("keyup", (e) => {
    if (e.code === "Space") { e.preventDefault(); spaceDown = false; }
});

/* ===========================================================
   Lifecycle
   =========================================================== */
function start(config, rodLabel) {
    cfg = config || {};
    el.rodLabel.textContent = rodLabel || "Fishing Rod";
    el.game.classList.remove("hidden");
    el.bite.classList.add("hidden");
    el.reel.classList.add("hidden");
    el.result.classList.add("hidden");
    el.progress.style.height = "0%";

    // reset scene
    ripples = [];
    biter = null;
    bobber = { x: ROD_BASE.x - 40, y: ROD_BASE.y - 200, sunk: 0 };
    spaceDown = false; spaceEdge = false;

    // ambient fish shadows swimming in the deep
    fishes = [];
    for (let i = 0; i < 5; i++) {
        fishes.push({
            x: Math.random() * W,
            y: WATER_Y + 60 + Math.random() * (H - WATER_Y - 90),
            dir: Math.random() < 0.5 ? -1 : 1,
            speed: 18 + Math.random() * 34,
            size: 16 + Math.random() * 22,
        });
    }

    phase = "cast";
    sceneStart = performance.now();
    el.phaseText.textContent = "Casting...";

    lastT = performance.now();
    if (raf) cancelAnimationFrame(raf);
    loop();
}

function finish(hooked, landed, reason) {
    phase = "result";
    el.bite.classList.add("hidden");
    el.reel.classList.add("hidden");
    el.struggleWarn.classList.add("hidden");
    el.barTrack.classList.remove("struggling");
    el.game.classList.remove("shake");
    el.result.classList.remove("hidden");

    if (landed) {
        el.resultTitle.textContent = "FISH ON!";
        el.resultTitle.className = "win";
        el.resultSub.textContent = "You landed it!";
    } else if (hooked) {
        el.resultTitle.textContent = "LINE SNAPPED";
        el.resultTitle.className = "lose";
        el.resultSub.textContent = reason === "tension"
            ? "Too much tension - you reeled through the struggle!"
            : "It fought free...";
    } else {
        el.resultTitle.textContent = "MISSED!";
        el.resultTitle.className = "lose";
        el.resultSub.textContent = "The fish stole your bait";
    }

    setTimeout(() => {
        el.game.classList.add("hidden");
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        phase = "idle";
        post("fishingResult", { hooked, landed });
    }, 1350);
}

function hardClose() {
    el.game.classList.add("hidden");
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    phase = "idle";
}

/* ===========================================================
   Main loop
   =========================================================== */
function loop() {
    const now = performance.now();
    let dt = (now - lastT) / 1000;
    if (dt > 0.05) dt = 0.05; // clamp big frame gaps
    lastT = now;

    update(now, dt);
    render(now);

    if (phase !== "idle") raf = requestAnimationFrame(loop);
}

function update(now, dt) {
    if (phase === "cast") updateCast(now);
    else if (phase === "wait") updateWait(now, dt);
    else if (phase === "bite") updateBite(now);
    else if (phase === "reel") updateReel(now, dt);

    // ambient fish always swim
    for (const f of fishes) {
        f.x += f.dir * f.speed * dt;
        if (f.x < -40) { f.x = W + 40; }
        if (f.x > W + 40) { f.x = -40; }
    }
    // ripples expand & fade
    ripples = ripples.filter((r) => r.life > 0);
    for (const r of ripples) { r.r += 42 * dt; r.life -= dt; }
}

/* ---------- CAST ---------- */
function updateCast(now) {
    const t = (now - sceneStart) / 1300; // 1.3s cast
    if (t >= 1) {
        bobber.x = LAND.x;
        bobber.y = LAND.y;
        splash(LAND.x, LAND.y, 1);
        phase = "wait";
        el.phaseText.textContent = "Waiting for a bite...";
        // random wait 2.2 - 5.5s before a fish commits
        waitUntil = now + 2200 + Math.random() * 3300;
        return;
    }
    // parabolic arc from rod tip to landing spot
    const p = easeOutCubic(Math.min(t / 0.85, 1));
    const sx = ROD_BASE.x - 40, sy = ROD_BASE.y - 210;
    bobber.x = sx + (LAND.x - sx) * p;
    const flat = sy + (LAND.y - sy) * p;
    const arc = Math.sin(p * Math.PI) * 150; // hop up mid-flight
    bobber.y = flat - arc;
}

/* ---------- WAIT ---------- */
function updateWait(now, dt) {
    // gentle bob on the surface
    bobber.x = LAND.x;
    bobber.y = WATER_Y + Math.sin(now / 350) * 2.5;

    // spawn the biter partway through the wait so you can SEE it approach
    if (!biter && now > waitUntil - 1400) {
        biter = {
            x: Math.random() < 0.5 ? 60 : W - 60,
            y: WATER_Y + 150,
            size: 26 + (cfg.tier || 1) * 5,
        };
    }
    if (biter) {
        // home in on the bobber
        biter.x += (bobber.x - biter.x) * Math.min(1, dt * 2.4);
        biter.y += ((WATER_Y + 26) - biter.y) * Math.min(1, dt * 2.4);
    }

    if (now >= waitUntil) {
        phase = "bite";
        biteStart = now;
        el.phaseText.textContent = "BITE!";
        el.bite.classList.remove("hidden");
        spaceEdge = false; // require a fresh press
        splash(bobber.x, WATER_Y, 0.7);
    }
}

/* ---------- BITE (reaction) ---------- */
function updateBite(now) {
    const win = cfg.biteWindowMs || 1100;
    const t = (now - biteStart) / win;
    el.biteTimer.style.transform = `scaleX(${Math.max(0, 1 - t)})`;

    // bobber yanked under, jittering
    bobber.x = LAND.x + Math.sin(now / 40) * 2;
    bobber.y = WATER_Y + 10 + Math.min(18, (now - biteStart) / 18);
    if (biter) { biter.x = bobber.x; biter.y = WATER_Y + 24; }

    if (spaceEdge) {
        spaceEdge = false;
        beginReel(now);
        return;
    }
    if (t >= 1) {
        // missed the window
        el.bite.classList.add("hidden");
        splash(bobber.x, WATER_Y, 0.5);
        finish(false, false);
    }
}

/* ---------- REEL (catch bar fight) ---------- */
function beginReel(now) {
    phase = "reel";
    reelStart = now;
    el.bite.classList.add("hidden");
    el.reel.classList.remove("hidden");
    el.phaseText.textContent = "Reel it in!";

    zonePos = 0.5; zoneVel = 0;
    fishPos = 0.5; fishTarget = 0.5; retarget = 0;
    progress = 0.28;

    // struggle: start calm, first thrash after a gap
    tension = 0;
    struggling = false;
    struggleTimer = randRange(cfg.struggleMinGap || 2.6, cfg.struggleMaxGap || 4.2);
    graceTimer = 0;
    critShake = false;
    el.struggleWarn.classList.add("hidden");
    el.barTrack.classList.remove("struggling");
    el.game.classList.remove("shake");
    el.tension.style.height = "0%";
    el.tension.classList.remove("high");

    layoutBar();
}

const GRAVITY = 1.15;  // pulls control zone down (per s^2, fraction space)
const LIFT = 2.55;     // upward accel while holding SPACE

function updateReel(now, dt) {
    const halfZone = (cfg.barZone || 0.3) / 2;

    // ---- struggle cycle: alternate calm <-> thrashing ----
    struggleTimer -= dt;
    if (graceTimer > 0) graceTimer -= dt;
    if (struggleTimer <= 0) {
        struggling = !struggling;
        if (struggling) {
            struggleTimer = cfg.struggleTime || 1.6;
            // grace: brief window to react before tension starts climbing
            graceTimer = (cfg.struggleGraceMs || 400) / 1000;
        } else {
            struggleTimer = randRange(cfg.struggleMinGap || 2.6, cfg.struggleMaxGap || 4.2);
            graceTimer = 0;
        }
    }

    // ---- line tension ----
    // Reeling (holding SPACE) during a struggle spikes tension - but not during
    // the grace window, which gives you a moment to react and ease off.
    if (struggling && spaceDown && graceTimer <= 0) {
        tension += (cfg.tensionBuild || 0.85) * dt;
    } else {
        tension -= (cfg.tensionEase || 0.7) * dt;
    }
    tension = Math.max(0, Math.min(1, tension));

    // ---- control zone physics ----
    zoneVel += GRAVITY * dt;
    if (spaceDown) zoneVel -= LIFT * dt;
    zonePos += zoneVel * dt;

    if (zonePos < halfZone) { zonePos = halfZone; zoneVel = 0; }
    if (zonePos > 1 - halfZone) { zonePos = 1 - halfZone; zoneVel = 0; }

    // ---- fish movement (darts harder mid-struggle) ----
    retarget -= dt;
    if (retarget <= 0) {
        fishTarget = halfZone + Math.random() * (1 - 2 * halfZone);
        const slip = cfg.fishSlip || 0.5;
        const rt = (0.35 + Math.random() * 0.9) * (1.2 - slip * 0.7);
        retarget = struggling ? rt * 0.45 : rt; // retargets more often while thrashing
    }
    const spd = (cfg.fishSpeed || 0.85) * (struggling ? 1.6 : 1);
    fishPos += Math.sign(fishTarget - fishPos) * Math.min(Math.abs(fishTarget - fishPos), spd * dt);

    // ---- progress ----
    const onFish = Math.abs(fishPos - zonePos) <= halfZone;
    if (onFish) progress += (cfg.fill || 0.3) * dt;
    else progress -= (cfg.drain || 0.22) * dt;
    progress = Math.max(0, Math.min(1, progress));

    layoutBar(onFish);
    layoutTension();

    // ---- surface fight: fish thrashes near the bobber ----
    const thrash = struggling ? 3 : 1;
    bobber.x = LAND.x + Math.sin(now / 70) * 6 * thrash * (1 - progress + 0.3);
    bobber.y = WATER_Y + 6 + Math.sin(now / 55) * 4 * thrash;
    if (biter) { biter.x = bobber.x; biter.y = WATER_Y + 20 + Math.sin(now / 90) * 6; }
    if (Math.random() < (struggling ? 0.22 : 0.06)) splash(bobber.x, WATER_Y, struggling ? 0.6 : 0.35);

    // ---- outcomes ----
    if (tension >= 1) { finish(true, false, "tension"); return; } // line snapped from tension
    if (progress >= 1) { finish(true, true); return; }
    const elapsed = now - reelStart;
    if (elapsed > 1500 && progress <= 0) { finish(true, false); return; }
    if (elapsed > (cfg.reelTimeMs || 14000)) { finish(true, progress > 0.6); }
}

/* Reflect struggle + tension state into the DOM. */
function layoutTension() {
    el.tension.style.height = (tension * 100) + "%";
    const high = tension >= 0.65;
    el.tension.classList.toggle("high", high);

    el.barTrack.classList.toggle("struggling", struggling);
    if (struggling) el.struggleWarn.classList.remove("hidden");
    else el.struggleWarn.classList.add("hidden");

    // critical tension -> shake the whole scene as a danger cue
    const crit = tension >= 0.8;
    if (crit !== critShake) {
        critShake = crit;
        el.game.classList.toggle("shake", crit);
    }
}

function layoutBar(onFish) {
    const trackH = el.barTrack.clientHeight || 340;
    const zoneH = (cfg.barZone || 0.3) * trackH;
    el.zone.style.height = zoneH + "px";
    el.zone.style.top = (zonePos * trackH - zoneH / 2) + "px";
    el.fishMarker.style.top = (fishPos * trackH) + "px";
    el.progress.style.height = (progress * 100) + "%";
    el.zone.classList.toggle("on-fish", !!onFish);
}

/* ===========================================================
   Rendering
   =========================================================== */
function render(now) {
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawWater(now);
    drawFishShadows();
    if (biter && (phase === "wait" || phase === "bite" || phase === "reel")) drawBiter();
    drawRipples();
    drawRod();
    drawLine();
    drawBobber();
}

function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, WATER_Y);
    g.addColorStop(0, "#f7b26a");
    g.addColorStop(0.55, "#e08a5a");
    g.addColorStop(1, "#7a5f7e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, WATER_Y);

    // sun glow
    ctx.save();
    const sun = ctx.createRadialGradient(560, 70, 8, 560, 70, 120);
    sun.addColorStop(0, "rgba(255,240,200,0.95)");
    sun.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, W, WATER_Y);
    ctx.restore();
}

function drawWater(now) {
    const g = ctx.createLinearGradient(0, WATER_Y, 0, H);
    g.addColorStop(0, "#1f7d86");
    g.addColorStop(0.5, "#0e5560");
    g.addColorStop(1, "#062b34");
    ctx.fillStyle = g;
    ctx.fillRect(0, WATER_Y, W, H - WATER_Y);

    // sun reflection shimmer near surface
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#ffe6b0";
    for (let i = 0; i < 7; i++) {
        const y = WATER_Y + 6 + i * 5;
        const w = 90 - i * 8 + Math.sin(now / 300 + i) * 12;
        ctx.fillRect(520 - w / 2, y, w, 2);
    }
    ctx.restore();

    // moving surface highlight line
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) {
        const y = WATER_Y + Math.sin(x / 46 + now / 380) * 2.4;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // faint caustics
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = "#bff5ff";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 12) {
            const y = WATER_Y + 60 + i * 60 + Math.sin(x / 60 + now / 700 + i) * 10;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();
}

function drawFishShadows() {
    ctx.save();
    ctx.fillStyle = "rgba(3, 26, 31, 0.55)";
    for (const f of fishes) {
        drawFishBody(f.x, f.y, f.size, f.dir);
    }
    ctx.restore();
}

function drawBiter() {
    ctx.save();
    ctx.fillStyle = "rgba(6, 34, 40, 0.8)";
    const dir = biter.x < bobber.x ? 1 : -1;
    drawFishBody(biter.x, biter.y, biter.size, dir);
    ctx.restore();
}

function drawFishBody(x, y, size, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    // tail
    ctx.beginPath();
    ctx.moveTo(-size * 0.9, 0);
    ctx.lineTo(-size * 1.4, -size * 0.4);
    ctx.lineTo(-size * 1.4, size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawRipples() {
    ctx.save();
    for (const r of ripples) {
        ctx.globalAlpha = Math.max(0, r.life) * 0.5 * r.strength;
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r, r.r * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

function drawRod() {
    // rod butt off the bottom-right, tip up toward the water
    const tip = { x: 545, y: 120 };
    ctx.save();
    ctx.lineCap = "round";
    // shadow
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(ROD_BASE.x, ROD_BASE.y);
    ctx.lineTo(tip.x + 3, tip.y + 3);
    ctx.stroke();
    // rod
    const g = ctx.createLinearGradient(ROD_BASE.x, ROD_BASE.y, tip.x, tip.y);
    g.addColorStop(0, "#2b1d12");
    g.addColorStop(1, "#a9744f");
    ctx.strokeStyle = g;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(ROD_BASE.x, ROD_BASE.y);
    ctx.quadraticCurveTo(660, 300, tip.x, tip.y);
    ctx.stroke();
    ctx.restore();
    drawRod.tip = tip;
}

function drawLine() {
    const tip = drawRod.tip || { x: 545, y: 120 };
    ctx.save();
    ctx.strokeStyle = "rgba(240,255,255,0.5)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    // slight sag toward the bobber
    const midX = (tip.x + bobber.x) / 2;
    const midY = (tip.y + bobber.y) / 2 + 18;
    ctx.quadraticCurveTo(midX, midY, bobber.x, bobber.y);
    ctx.stroke();
    ctx.restore();
}

function drawBobber() {
    const x = bobber.x, y = bobber.y;
    ctx.save();
    // top red half
    ctx.beginPath();
    ctx.fillStyle = "#e23b3b";
    ctx.arc(x, y, 7, Math.PI, 0);
    ctx.fill();
    // bottom white half
    ctx.beginPath();
    ctx.fillStyle = "#f4f4f4";
    ctx.arc(x, y, 7, 0, Math.PI);
    ctx.fill();
    // rim
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

/* ===========================================================
   Helpers
   =========================================================== */
function splash(x, y, strength) {
    ripples.push({ x, y, r: 4, life: 1.0, strength: strength || 0.6 });
    ripples.push({ x, y, r: 1, life: 1.2, strength: (strength || 0.6) * 0.7 });
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function randRange(min, max) { return min + Math.random() * (max - min); }
