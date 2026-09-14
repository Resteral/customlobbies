/**
 * CombatEngine - Realistic 2D Fighting Simulation & Frame Data Engine
 * Features multi-segment anatomical hitboxes (Head, Torso, Legs), Poise/Guard Crush,
 * Just-Defend Parries, Mass/Inertia physics, Wall-Splat rebounds, and tactical AI.
 */
class CombatEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.groundY = 480;

        this.fighter1 = null;
        this.fighter2 = null;
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];

        this.matchState = "idle";
        this.matchTimer = 90;
        this.frameCounter = 0;
        this.freezeFrames = 0;
        this.screenShake = 0;
        this.bgDim = 0;
        this.winner = null;

        this.onMatchEvent = null;
    }

    resetMatch(f1Data, f2Data) {
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.screenShake = 0;
        this.bgDim = 0;
        this.freezeFrames = 0;
        this.matchTimer = 90;
        this.winner = null;

        this.fighter1 = this.createFighterEntity(f1Data, 220, 1, "red");
        this.fighter2 = this.createFighterEntity(f2Data, 740, -1, "blue");

        this.matchState = "intro";
        this.introTimer = 120;

        if (window.soundSynth) {
            window.soundSynth.announce(`Round 1! ${this.fighter1.data.name} versus ${this.fighter2.data.name}! FIGHT!`);
        }
    }

    createFighterEntity(data, startX, facing, corner) {
        const mass = data.mass || 75;
        const poise = data.stats.poise || data.stats.maxPoise || 100;

        return {
            data: JSON.parse(JSON.stringify(data)),
            corner: corner,
            x: startX,
            y: this.groundY,
            vx: 0,
            vy: 0,
            facing: facing,
            mass: mass,

            state: "idle", // "idle", "walk", "jump", "crouch", "attack", "special", "hurt", "stagger", "victory", "dead"
            stateTimer: 0,
            animFrame: 0,
            animOffset: Math.random() * 100,

            hp: data.stats.hp || data.stats.maxHp,
            maxHp: data.stats.maxHp,
            poise: poise,
            maxPoise: poise,
            poiseRegenTimer: 0,

            meter: 20,
            maxMeter: 100,

            guardState: "none", // "none", "high", "low", "parry"
            isParrying: false,
            parryWindow: 0,

            isSuperActive: false,
            buffTimer: 0,
            buffType: null,
            hitFlash: 0,
            comboCount: 0,
            comboTimer: 0,

            cooldowns: { special1: 0, special2: 0, lowSweep: 0 },
            currentMove: null,
            aiDecisionTimer: 6 + Math.floor(Math.random() * 10)
        };
    }

    update(speedMultiplier = 1.0) {
        if (this.freezeFrames > 0) {
            this.freezeFrames--;
            return;
        }

        const steps = speedMultiplier > 1.5 ? 2 : 1;
        for (let s = 0; s < steps; s++) {
            this.frameCounter++;
            if (this.frameCounter % 60 === 0 && this.matchState === "fighting" && this.matchTimer > 0) {
                this.matchTimer--;
                if (this.matchTimer === 0) this.handleTimeOver();
            }

            if (this.matchState === "intro") {
                this.introTimer--;
                if (this.introTimer <= 0) this.matchState = "fighting";
            } else if (this.matchState === "fighting") {
                this.updateTacticalAI(this.fighter1, this.fighter2);
                this.updateTacticalAI(this.fighter2, this.fighter1);
                this.updatePhysics(this.fighter1, this.fighter2);
                this.updatePhysics(this.fighter2, this.fighter1);
                this.updateProjectiles();
            } else if (this.matchState === "ko_freeze") {
                this.koFreezeTimer--;
                if (this.koFreezeTimer <= 0) {
                    this.matchState = "ended";
                    if (this.onMatchEvent) this.onMatchEvent("match_end", { winner: this.winner });
                }
            }

            this.updateParticles();
            this.updateFloatingTexts();

            if (this.screenShake > 0) this.screenShake *= 0.88;
            if (this.bgDim > 0) this.bgDim -= 0.025;
        }
    }

    updatePhysics(f, opponent) {
        // Mass-influenced gravity
        if (f.y < this.groundY) {
            f.vy += 0.85 * (f.mass / 75);
        }

        f.x += f.vx;
        f.y += f.vy;

        // Friction
        f.vx *= 0.86;

        // Ground Collision & Landing
        if (f.y >= this.groundY) {
            f.y = this.groundY;
            f.vy = 0;
            if (f.state === "jump") f.state = "idle";
        }

        // Arena Boundaries & Wall Splat Rebound
        const minX = 75;
        const maxX = this.width - 75;
        if (f.x <= minX) {
            f.x = minX;
            if (Math.abs(f.vx) > 7) {
                // Wall splat bounce
                f.vx = 8;
                f.vy = -6;
                this.screenShake = 10;
                this.spawnText(f.x + 20, f.y - 60, "WALL SPLAT!", "#ff1744", 20);
                if (window.soundSynth) window.soundSynth.playHit(true);
            }
        } else if (f.x >= maxX) {
            f.x = maxX;
            if (Math.abs(f.vx) > 7) {
                f.vx = -8;
                f.vy = -6;
                this.screenShake = 10;
                this.spawnText(f.x - 20, f.y - 60, "WALL SPLAT!", "#ff1744", 20);
                if (window.soundSynth) window.soundSynth.playHit(true);
            }
        }

        // Auto face opponent when not attacking
        if (f.state !== "attack" && f.state !== "special" && f.state !== "hurt" && f.state !== "stagger") {
            f.facing = f.x < opponent.x ? 1 : -1;
        }

        // Poise Regeneration
        if (f.poise < f.maxPoise && f.state !== "hurt" && f.state !== "stagger") {
            f.poiseRegenTimer++;
            if (f.poiseRegenTimer > 60) {
                f.poise = Math.min(f.maxPoise, f.poise + 0.4);
            }
        }

        // Parry Window tick
        if (f.parryWindow > 0) {
            f.parryWindow--;
            f.isParrying = f.parryWindow > 0;
        }

        // Cooldown ticks
        for (let key in f.cooldowns) {
            if (f.cooldowns[key] > 0) f.cooldowns[key]--;
        }
        if (f.buffTimer > 0) f.buffTimer--;
        if (f.hitFlash > 0) f.hitFlash--;

        // Combo timeout
        if (f.comboTimer > 0) {
            f.comboTimer--;
            if (f.comboTimer <= 0) f.comboCount = 0;
        }

        f.stateTimer--;
        f.animFrame++;

        if (f.stateTimer <= 0) {
            if (f.state === "attack" || f.state === "special" || f.state === "hurt" || f.state === "stagger") {
                f.state = "idle";
                f.currentMove = null;
                f.isSuperActive = false;
                f.guardState = "none";
            }
        }

        // Check active attack frames for melee hitboxes
        if ((f.state === "attack" || f.state === "special") && f.currentMove && f.currentMove.type !== "projectile") {
            const move = f.currentMove;
            const startup = move.startupFrames || 6;
            const active = move.activeFrames || 4;
            if (f.animFrame >= startup && f.animFrame <= startup + active) {
                this.checkRealisticMeleeHit(f, opponent, move);
            }
        }
    }

    /**
     * Tactical AI - Spacing, Whiff Punishing, High/Low Mixups & Frame Advantage
     */
    updateTacticalAI(f, opponent) {
        if (f.state === "hurt" || f.state === "stagger" || f.state === "dead" || f.state === "victory") return;

        f.aiDecisionTimer--;
        if (f.aiDecisionTimer > 0) return;
        f.aiDecisionTimer = 6 + Math.floor(Math.random() * 8);

        const dist = Math.abs(f.x - opponent.x);
        const spd = f.data.stats.speed;
        const roll = Math.random();

        // 1. Super Move Execution
        if (f.meter >= 100 && roll < 0.7 && f.state === "idle") {
            this.executeSuper(f, opponent);
            return;
        }

        // 2. Reactive Defense & Just-Defend Parry
        if (opponent.state === "attack" || opponent.state === "special") {
            const oppMove = opponent.currentMove;
            if (roll < 0.25 && f.parryWindow <= 0) {
                // Attempt Just-Defend Parry!
                f.isParrying = true;
                f.parryWindow = 8; // 8-frame parry window
                f.guardState = "parry";
                return;
            } else if (roll < 0.65) {
                // Guard matching the incoming hit zone
                if (oppMove && oppMove.hitZone === "legs") {
                    f.guardState = "low"; // Crouch block
                    f.state = "crouch";
                } else {
                    f.guardState = "high"; // Standing block
                    f.state = "idle";
                }
                return;
            }
        } else {
            f.guardState = "none";
        }

        // 3. Whiff Punish: If opponent is recovering from a missed attack
        if (opponent.stateTimer > 0 && (opponent.state === "attack" || opponent.state === "special") && dist < 120) {
            this.executeRealisticMove(f, opponent, "heavy");
            return;
        }

        // 4. Close Range Spacing (< 110px) - High / Low Mixups
        if (dist < 110) {
            if (f.state === "idle" || f.state === "walk") {
                if (roll < 0.35) {
                    this.executeRealisticMove(f, opponent, "light"); // High headshot jab
                } else if (roll < 0.65 && f.cooldowns.lowSweep <= 0) {
                    this.executeRealisticMove(f, opponent, "lowSweep"); // Low trip sweep
                } else if (roll < 0.85) {
                    this.executeRealisticMove(f, opponent, "heavy"); // Heavy body hook
                } else {
                    // Backstep spacing
                    f.vx = -f.facing * (spd * 1.5);
                    f.state = "walk";
                }
            }
        }
        // 5. Mid Range (110 - 270px) - Approach & Anti-Air
        else if (dist < 270) {
            if (f.state === "idle" || f.state === "walk") {
                if (opponent.y < this.groundY - 30 && f.cooldowns.special2 <= 0) {
                    this.executeRealisticMove(f, opponent, "special2"); // Anti-Air Uppercut!
                } else if (f.cooldowns.special1 <= 0 && f.meter >= 25 && roll < 0.6) {
                    this.executeRealisticMove(f, opponent, "special1");
                } else if (roll < 0.8) {
                    // Advance into strike range
                    f.vx = f.facing * (spd * 1.1);
                    f.state = "walk";
                }
            }
        }
        // 6. Long Range (> 270px)
        else {
            if (f.cooldowns.special1 <= 0 && roll < 0.55) {
                this.executeRealisticMove(f, opponent, "special1");
            } else {
                f.vx = f.facing * (spd * 1.2);
                f.state = "walk";
            }
        }
    }

    executeRealisticMove(f, opponent, moveKey) {
        const move = f.data.moves[moveKey] || (moveKey === "lowSweep" ? f.data.moves.special3 : null);
        if (!move) return;

        f.state = moveKey === "light" || moveKey === "heavy" || moveKey === "lowSweep" ? "attack" : "special";
        f.stateTimer = move.duration || 20;
        f.animFrame = 0;
        f.currentMove = move;

        if (move.meterCost) f.meter = Math.max(0, f.meter - move.meterCost);
        if (move.cooldown) f.cooldowns[moveKey] = move.cooldown;

        if (move.type === "dash_strike") {
            f.vx = f.facing * (move.speed || 11);
            if (window.soundSynth) window.soundSynth.playWhiff();
        } else if (move.type === "anti_air" && f.y >= this.groundY) {
            f.vy = -13;
            f.vx = f.facing * 4;
            if (window.soundSynth) window.soundSynth.playWhiff();
        } else if (move.type === "projectile") {
            this.spawnProjectile(f, move);
            if (window.soundSynth) window.soundSynth.playLaser();
        } else {
            if (window.soundSynth) window.soundSynth.playWhiff();
        }
    }

    executeSuper(f, opponent) {
        const superMove = f.data.moves.ultimate;
        f.meter = 0;
        f.state = "special";
        f.isSuperActive = true;
        f.stateTimer = 55;
        f.animFrame = 0;
        f.currentMove = superMove;

        this.freezeFrames = 25;
        this.bgDim = 0.88;
        this.screenShake = 18;

        this.spawnText(f.x, f.y - 110, `★ ${superMove.name} ★`, "#ff0055", 28);

        if (window.soundSynth) {
            window.soundSynth.playSuperCharge();
            window.soundSynth.announce(f.data.quotes.taunt || superMove.name);
        }

        if (this.onMatchEvent) {
            this.onMatchEvent("super_activated", { fighter: f, moveName: superMove.name });
        }

        setTimeout(() => {
            if (this.matchState !== "fighting") return;
            for (let i = 0; i < (superMove.hits || 8); i++) {
                setTimeout(() => {
                    if (this.matchState !== "fighting") return;
                    this.spawnProjectile(f, {
                        name: superMove.name,
                        damage: Math.round(superMove.damage / (superMove.hits || 8)),
                        poiseDamage: 15,
                        knockback: 12,
                        speed: 13 + i,
                        color: superMove.color
                    }, i * 14);
                    this.screenShake = 12;
                    if (window.soundSynth) window.soundSynth.playSuperExplosion();
                }, i * 85);
            }
        }, 300);
    }

    spawnProjectile(f, move, offsetY = 0) {
        this.projectiles.push({
            owner: f,
            x: f.x + f.facing * 40,
            y: f.y - 28 + offsetY,
            vx: f.facing * (move.speed || 9),
            vy: 0,
            damage: move.damage,
            poiseDamage: move.poiseDamage || 25,
            knockback: move.knockback || 8,
            color: move.color || "#ff00ff",
            radius: move.type === "super" ? 22 : 14,
            life: 90
        });
    }

    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            const target = p.owner === this.fighter1 ? this.fighter2 : this.fighter1;
            const dist = Math.hypot(p.x - target.x, p.y - (target.y - 25));

            if (dist < 40 + p.radius) {
                this.applyRealisticDamage(target, p.owner, p.damage, p.poiseDamage, p.knockback, "torso", p.color);
                this.projectiles.splice(i, 1);
                continue;
            }

            if (p.x < 20 || p.x > this.width - 20 || p.life <= 0) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    checkRealisticMeleeHit(attacker, defender, move) {
        const dist = Math.abs(attacker.x - defender.x);
        const inFront = (defender.x - attacker.x) * attacker.facing > 0;

        if (dist < 95 && inFront) {
            this.applyRealisticDamage(defender, attacker, move.damage, move.poiseDamage || 25, move.knockback, move.hitZone || "torso", move.color);
            attacker.animFrame = 99; // consume active frames so it doesn't multi-hit
        }
    }

    /**
     * Realistic Damage Engine: Anatomical Zones, Poise Breakdown, Just-Defend Parries & Mass Physics
     */
    applyRealisticDamage(target, attacker, baseDamage, poiseDmg, knockback, hitZone = "torso", color = "#ffea00") {
        if (target.state === "dead") return;

        // 1. Check Just-Defend Parry (Frame-Perfect deflection)
        if (target.isParrying) {
            target.isParrying = false;
            target.parryWindow = 0;
            target.meter = Math.min(100, target.meter + 25);

            // Put attacker in vulnerability recovery
            attacker.state = "hurt";
            attacker.stateTimer = 22;
            attacker.vx = -attacker.facing * 8;

            this.freezeFrames = 12;
            this.screenShake = 14;
            this.spawnText(target.x, target.y - 70, "JUST-DEFEND PARRY!", "#00f0ff", 22);

            if (window.soundSynth) window.soundSynth.playParry();
            return;
        }

        // 2. High/Low Guard Calculations
        let isBlocked = false;
        if (target.guardState === "high") {
            // Standing block defends high & mid, but NOT low sweeps!
            if (hitZone !== "legs") isBlocked = true;
        } else if (target.guardState === "low") {
            // Crouching block defends low & mid, but NOT overhead headshots!
            if (hitZone !== "head") isBlocked = true;
        }

        if (isBlocked) {
            const blockedDmg = Math.max(2, Math.round(baseDamage * 0.18));
            target.hp = Math.max(0, target.hp - blockedDmg);
            target.poise = Math.max(0, target.poise - poiseDmg * 0.8);
            target.poiseRegenTimer = 0;

            const massRatio = 70 / target.mass;
            target.vx = attacker.facing * (knockback * 0.35 * massRatio);

            this.spawnText(target.x, target.y - 60, "BLOCKED!", "#00e5ff", 16);
            if (window.soundSynth) window.soundSynth.playBlock();

            // Check Guard Crush / Poise Break
            if (target.poise <= 0) {
                this.handlePoiseBreak(target, attacker);
            }
            return;
        }

        // 3. Unblocked Hit - Anatomical Multipliers & Status
        let dmg = baseDamage;
        let isHeadshot = hitZone === "head";
        let isLowSweep = hitZone === "legs";

        // Headshots deal 1.4x lethal trauma
        if (isHeadshot) {
            dmg = Math.round(dmg * 1.4);
            this.spawnText(target.x, target.y - 70, "HEADSHOT CRIT!", "#ff0055", 22);
        } else if (isLowSweep) {
            dmg = Math.round(dmg * 1.1);
            this.spawnText(target.x, target.y - 60, "LOW SWEEP TRIP!", "#ffd600", 18);
        }

        // Defense stat mitigation & Poise depletion
        const atkStat = attacker.data.stats.attack;
        const defStat = target.data.stats.defense;
        dmg = Math.round(dmg * (atkStat / 25) * (20 / (20 + defStat)));

        target.hp = Math.max(0, target.hp - dmg);
        target.poise = Math.max(0, target.poise - poiseDmg);
        target.poiseRegenTimer = 0;
        target.hitFlash = 6;
        target.state = "hurt";
        target.stateTimer = isHeadshot ? 24 : 16;

        // Mass-adjusted knockback & launch
        const massRatio = 70 / target.mass;
        target.vx = attacker.facing * (knockback * massRatio);
        target.vy = isLowSweep ? -6 : (isHeadshot ? -8 * massRatio : -4 * massRatio);

        // Meter build
        attacker.meter = Math.min(100, attacker.meter + Math.round(12 * (attacker.data.stats.superGain || 1.0)));
        target.meter = Math.min(100, target.meter + 8);

        // Combo Counter
        attacker.comboCount = (attacker.comboCount || 0) + 1;
        attacker.comboTimer = 60;

        // Sound & Camera FX
        if (window.soundSynth) window.soundSynth.playHit(dmg > 35 || isHeadshot, isHeadshot);
        this.screenShake = Math.max(this.screenShake, isHeadshot ? 16 : 7);

        // Floating Damage Number
        this.spawnText(target.x + (Math.random() - 0.5) * 20, target.y - 50, `-${dmg}`, isHeadshot ? "#ff1744" : "#ffea00", isHeadshot ? 24 : 18);

        // Particle Burst
        for (let i = 0; i < 14; i++) {
            this.particles.push({
                x: target.x,
                y: target.y - (isHeadshot ? 50 : 25),
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.5) * 12 - 3,
                color: color,
                size: 3 + Math.random() * 5,
                life: 25
            });
        }

        // Notify event for hype chat
        if (this.onMatchEvent) {
            this.onMatchEvent("damage", {
                attacker: attacker,
                defender: target,
                damage: dmg,
                combo: attacker.comboCount,
                isHeadshot: isHeadshot
            });
        }

        // Check Poise Break or KO
        if (target.hp <= 0) {
            this.handleKO(attacker, target);
        } else if (target.poise <= 0) {
            this.handlePoiseBreak(target, attacker);
        }
    }

    handlePoiseBreak(target, attacker) {
        target.poise = 0;
        target.state = "stagger";
        target.stateTimer = 50; // Long vulnerable stagger window!
        target.vx = -target.facing * 5;

        this.screenShake = 16;
        this.freezeFrames = 10;
        this.spawnText(target.x, target.y - 85, "GUARD CRUSH!", "#ffd600", 26);

        if (window.soundSynth) window.soundSynth.playPoiseBreak();
    }

    handleKO(winner, loser) {
        this.matchState = "ko_freeze";
        this.koFreezeTimer = 140;
        this.winner = winner;
        loser.state = "dead";
        winner.state = "victory";

        this.freezeFrames = 42;
        this.screenShake = 26;
        this.bgDim = 0.92;

        this.spawnText(this.width / 2, this.height / 2 - 40, "K. O . !", "#ff0033", 64);

        if (window.soundSynth) {
            window.soundSynth.playKO();
            window.soundSynth.playCrowdHype();
            window.soundSynth.announce(`K.O.! Winner is ${winner.data.name}!`);
        }

        if (this.onMatchEvent) this.onMatchEvent("ko", { winner: winner, loser: loser });
    }

    handleTimeOver() {
        this.matchState = "ended";
        const f1Hp = this.fighter1.hp;
        const f2Hp = this.fighter2.hp;

        if (f1Hp > f2Hp) {
            this.winner = this.fighter1;
            this.fighter1.state = "victory";
            this.fighter2.state = "hurt";
        } else {
            this.winner = this.fighter2;
            this.fighter2.state = "victory";
            this.fighter1.state = "hurt";
        }

        this.spawnText(this.width / 2, this.height / 2 - 40, "TIME UP!", "#ffea00", 52);

        if (window.soundSynth) {
            window.soundSynth.playKO();
            window.soundSynth.announce(`Time up! The victor is ${this.winner.data.name}!`);
        }

        if (this.onMatchEvent) this.onMatchEvent("match_end", { winner: this.winner });
    }

    spawnText(x, y, text, color = "#fff", size = 18) {
        this.floatingTexts.push({
            x: x, y: y, text: text, color: color, size: size,
            vy: -1.6, alpha: 1.0, life: 48
        });
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.22;
            p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    updateFloatingTexts() {
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy;
            t.life--;
            t.alpha = t.life / 48;
            if (t.life <= 0) this.floatingTexts.splice(i, 1);
        }
    }

    render(time) {
        const ctx = this.ctx;
        ctx.save();

        if (this.screenShake > 0.5) {
            const sx = (Math.random() - 0.5) * this.screenShake;
            const sy = (Math.random() - 0.5) * this.screenShake;
            ctx.translate(sx, sy);
        }

        this.drawStage(ctx, time);

        if (this.bgDim > 0.05) {
            ctx.fillStyle = `rgba(10, 0, 20, ${Math.min(0.88, this.bgDim)})`;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        this.renderProjectiles(ctx);

        if (this.fighter1) window.spriteRenderer.drawFighter(ctx, this.fighter1, this.matchState, time);
        if (this.fighter2) window.spriteRenderer.drawFighter(ctx, this.fighter2, this.matchState, time);

        this.renderParticles(ctx);
        this.renderFloatingTexts(ctx);
        this.renderRealisticHUD(ctx);

        ctx.restore();
    }

    drawStage(ctx, time) {
        const grad = ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, "#0a0218");
        grad.addColorStop(0.6, "#1f003b");
        grad.addColorStop(1, "#0d0024");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Skyline
        ctx.fillStyle = "#15062c";
        const buildings = [
            { x: 40, w: 70, h: 220 }, { x: 130, w: 90, h: 280 }, { x: 240, w: 60, h: 180 },
            { x: 320, w: 110, h: 320 }, { x: 450, w: 80, h: 260 }, { x: 550, w: 100, h: 300 },
            { x: 670, w: 70, h: 210 }, { x: 760, w: 95, h: 290 }, { x: 870, w: 80, h: 230 }
        ];
        buildings.forEach(b => {
            ctx.fillRect(b.x, 480 - b.h, b.w, b.h);
            ctx.fillStyle = "rgba(255, 230, 0, 0.35)";
            for (let wy = 480 - b.h + 20; wy < 460; wy += 25) {
                for (let wx = b.x + 10; wx < b.x + b.w - 10; wx += 15) {
                    if (Math.sin(wx * wy + time * 0.001) > 0.3) ctx.fillRect(wx, wy, 4, 6);
                }
            }
            ctx.fillStyle = "#15062c";
        });

        // Floor
        const floorGrad = ctx.createLinearGradient(0, 480, 0, this.height);
        floorGrad.addColorStop(0, "#ff007f");
        floorGrad.addColorStop(0.1, "#260640");
        floorGrad.addColorStop(1, "#0a0218");
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, 480, this.width, this.height - 480);

        ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
        ctx.lineWidth = 2;
        for (let x = 0; x <= this.width; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, 480);
            ctx.lineTo(x + (x - this.width / 2) * 0.8, this.height);
            ctx.stroke();
        }
        for (let y = 480; y <= this.height; y += 18) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
    }

    renderProjectiles(ctx) {
        this.projectiles.forEach(p => {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    renderParticles(ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 25;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    renderFloatingTexts(ctx) {
        this.floatingTexts.forEach(t => {
            ctx.save();
            ctx.globalAlpha = t.alpha;
            ctx.font = `900 ${t.size}px "Impact", "Segoe UI", sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = t.color;
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;
            ctx.strokeText(t.text, t.x, t.y);
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
        });
    }

    renderRealisticHUD(ctx) {
        if (!this.fighter1 || !this.fighter2) return;

        const barWidth = 360;
        const barHeight = 22;
        const topY = 28;

        // --- Fighter 1 (Red Corner) ---
        const f1HpRatio = Math.max(0, this.fighter1.hp / this.fighter1.maxHp);
        const f1PoiseRatio = Math.max(0, this.fighter1.poise / this.fighter1.maxPoise);

        // HP Bar
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(40, topY, barWidth, barHeight);
        ctx.fillStyle = f1HpRatio > 0.3 ? "#00e676" : "#ff1744";
        ctx.fillRect(40 + barWidth * (1 - f1HpRatio), topY, barWidth * f1HpRatio, barHeight);
        ctx.strokeStyle = "#ff0055";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(40, topY, barWidth, barHeight);

        // Poise / Posture Gauge (Yellow bar directly beneath HP)
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(40, topY + barHeight + 4, barWidth * 0.85, 6);
        ctx.fillStyle = f1PoiseRatio > 0.3 ? "#ffd600" : "#ff9100";
        ctx.fillRect(40 + (barWidth * 0.85) * (1 - f1PoiseRatio), topY + barHeight + 4, (barWidth * 0.85) * f1PoiseRatio, 6);

        // Super Meter
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(40, topY + barHeight + 14, barWidth * 0.65, 8);
        ctx.fillStyle = this.fighter1.meter >= 100 ? "#ff0077" : "#00e5ff";
        ctx.fillRect(40, topY + barHeight + 14, (barWidth * 0.65) * (this.fighter1.meter / 100), 8);

        // --- Fighter 2 (Blue Corner) ---
        const f2HpRatio = Math.max(0, this.fighter2.hp / this.fighter2.maxHp);
        const f2PoiseRatio = Math.max(0, this.fighter2.poise / this.fighter2.maxPoise);
        const f2X = this.width - 40 - barWidth;

        // HP Bar
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(f2X, topY, barWidth, barHeight);
        ctx.fillStyle = f2HpRatio > 0.3 ? "#00e676" : "#ff1744";
        ctx.fillRect(f2X, topY, barWidth * f2HpRatio, barHeight);
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(f2X, topY, barWidth, barHeight);

        // Poise / Posture Gauge
        const f2PoiseX = this.width - 40 - (barWidth * 0.85);
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(f2PoiseX, topY + barHeight + 4, barWidth * 0.85, 6);
        ctx.fillStyle = f2PoiseRatio > 0.3 ? "#ffd600" : "#ff9100";
        ctx.fillRect(f2PoiseX, topY + barHeight + 4, (barWidth * 0.85) * f2PoiseRatio, 6);

        // Super Meter
        const f2SuperX = this.width - 40 - (barWidth * 0.65);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(f2SuperX, topY + barHeight + 14, barWidth * 0.65, 8);
        ctx.fillStyle = this.fighter2.meter >= 100 ? "#ff0077" : "#00e5ff";
        ctx.fillRect(f2SuperX + (barWidth * 0.65) * (1 - this.fighter2.meter / 100), topY + barHeight + 14, (barWidth * 0.65) * (this.fighter2.meter / 100), 8);

        // Names, Weight Class & Mass
        ctx.font = "bold 15px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`[${this.fighter1.data.tier}] ${this.fighter1.data.name} (${this.fighter1.mass}kg)`, 42, topY - 7);

        ctx.textAlign = "right";
        ctx.fillText(`[${this.fighter2.data.tier}] ${this.fighter2.data.name} (${this.fighter2.mass}kg)`, this.width - 42, topY - 7);

        // Match Timer
        ctx.font = "900 36px 'Impact', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = this.matchTimer <= 10 ? "#ff1744" : "#ffea00";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.strokeText(this.matchTimer.toString(), this.width / 2, topY + 24);
        ctx.fillText(this.matchTimer.toString(), this.width / 2, topY + 24);
    }
}

window.CombatEngine = CombatEngine;
