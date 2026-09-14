/**
 * SpriteRenderer - 3D-Shaded Procedural Character & Battle Damage Renderer
 * Renders physically-grounded anatomical characters with volumetric gradients,
 * specular lighting, dynamic battle wear (scratches, bruises, cracks, smoke),
 * and joint momentum physics.
 */
class SpriteRenderer {
    constructor() {
        this.particlePool = [];
    }

    drawFighter(ctx, fighter, matchState, time) {
        ctx.save();

        const x = fighter.x;
        const y = fighter.y;
        const facing = fighter.facing;
        const scale = (fighter.data.appearance.scale || 1.0) * 1.5;
        const colors = fighter.data.appearance.colors;
        const bodyType = fighter.data.appearance.bodyType;
        const hpPercent = Math.max(0, fighter.hp / fighter.maxHp);

        // Ground Contact Shadow with Realistic Ambient Occlusion
        ctx.save();
        const groundY = 480;
        const shadowDist = Math.max(0, groundY - y);
        const shadowScale = Math.max(0.3, 1.0 - shadowDist / 280);
        const shadowAlpha = Math.max(0.15, 0.5 - shadowDist / 350);

        const shadowGrad = ctx.createRadialGradient(x, groundY, 10 * scale, x, groundY, 50 * scale * shadowScale);
        shadowGrad.addColorStop(0, `rgba(0, 0, 0, ${shadowAlpha})`);
        shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(x, groundY, 50 * scale * shadowScale, 15 * scale * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Translate to fighter origin
        ctx.translate(x, y);
        ctx.scale(facing * scale, scale);

        // Flash white on counter-hit or impact
        if (fighter.hitFlash > 0) {
            ctx.filter = "brightness(250%) contrast(150%)";
        }

        // Just-Defend Parry / Super Aura Effect
        if (fighter.isParrying) {
            this.drawParryShield(ctx, time);
        } else if (fighter.meter >= 100 || fighter.isSuperActive) {
            this.drawVolumetricAura(ctx, colors.glow, time, fighter.isSuperActive);
        }

        // Realistic Physics-Driven Animations & Joint Offsets
        let bobY = Math.sin(time * 0.007 + fighter.animOffset) * 3;
        let bobAngle = Math.sin(time * 0.005 + fighter.animOffset) * 0.03;
        let legOffset = 0;

        // Exhaustion / Heavy panting when HP is low
        if (hpPercent < 0.3 && fighter.state === "idle") {
            bobY = Math.sin(time * 0.02) * 5; // Heavy fast panting
            bobAngle = 0.08;
        }

        if (fighter.state === "walk") {
            bobY = Math.abs(Math.sin(time * 0.016)) * 5;
            legOffset = Math.sin(time * 0.018) * 16;
            bobAngle = Math.sin(time * 0.018) * 0.08;
        } else if (fighter.state === "jump") {
            bobY = -12;
            bobAngle = -0.15;
        } else if (fighter.state === "hurt") {
            bobAngle = -0.35;
            bobY = 6;
        } else if (fighter.state === "stagger") {
            // Guard crushed / Poise broken
            bobAngle = Math.sin(time * 0.04) * 0.25;
            bobY = 4;
        } else if (fighter.state === "attack" || fighter.state === "special") {
            bobAngle = 0.18;
        } else if (fighter.state === "victory") {
            bobY = -14 + Math.abs(Math.sin(time * 0.02)) * 16;
            bobAngle = Math.sin(time * 0.015) * 0.12;
        }

        ctx.translate(0, bobY);
        ctx.rotate(bobAngle);

        // Volumetric 3D Rendering by Body Type
        switch (bodyType) {
            case "pastry_box":
                this.draw3DPastryBox(ctx, colors, fighter, legOffset, hpPercent, time);
                break;
            case "quadruped_beast":
                this.draw3DQuadruped(ctx, colors, fighter, legOffset, hpPercent, time);
                break;
            case "humanoid":
                this.draw3DHumanoid(ctx, colors, fighter, legOffset, hpPercent, time);
                break;
            case "mech_titan":
                this.draw3DMechTitan(ctx, colors, fighter, legOffset, hpPercent, time);
                break;
            case "floating_orb":
                this.draw3DFloatingOrb(ctx, colors, fighter, hpPercent, time);
                break;
            case "avian_winged":
            default:
                this.draw3DAvian(ctx, colors, fighter, legOffset, hpPercent, time);
                break;
        }

        // Render Dynamic Battle Damage Layer (Bruises, Scratches, Cracks, Blood/Jam, Smoke)
        this.renderBattleDamage(ctx, fighter, hpPercent, time);

        // Active Hit Frame Slash FX
        if ((fighter.state === "attack" || fighter.state === "special") && fighter.animFrame >= 3 && fighter.animFrame <= 12) {
            this.drawRealisticSlashFX(ctx, fighter, colors, time);
        }

        ctx.restore();
    }

    drawVolumetricAura(ctx, glowColor, time, isSuper) {
        ctx.save();
        const pulse = 1.0 + Math.sin(time * 0.02) * (isSuper ? 0.2 : 0.1);
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isSuper ? 25 : 12;
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = isSuper ? 5 : 2.5;
        ctx.globalAlpha = 0.55 + Math.sin(time * 0.012) * 0.25;

        ctx.beginPath();
        ctx.arc(0, -28, 44 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    drawParryShield(ctx, time) {
        ctx.save();
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(25, -28, 35, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
        ctx.restore();
    }

    // --- 1. Realistic 3D-Shaded Pop-Tart Wombat ---
    draw3DPastryBox(ctx, colors, fighter, legOffset, hpPercent, time) {
        // Legs with 3D cylindrical lighting
        const legGrad = ctx.createLinearGradient(-30, 0, 30, 0);
        legGrad.addColorStop(0, "#8d5b2d");
        legGrad.addColorStop(0.5, colors.primary);
        legGrad.addColorStop(1, "#5c3818");

        ctx.fillStyle = legGrad;
        ctx.beginPath();
        ctx.roundRect(-22 + legOffset, 12, 14, 18, 5);
        ctx.roundRect(8 - legOffset, 12, 14, 18, 5);
        ctx.fill();

        // Main Crust Body (Volumetric Beveled Pastry)
        const bodyGrad = ctx.createLinearGradient(-32, -60, 32, 20);
        bodyGrad.addColorStop(0, "#e09f67");
        bodyGrad.addColorStop(0.3, colors.primary);
        bodyGrad.addColorStop(1, "#7c4a1e");

        ctx.fillStyle = bodyGrad;
        ctx.strokeStyle = "#5a3514";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-30, -55, 60, 70, 10);
        ctx.fill();
        ctx.stroke();

        // Beveled Frosted Glaze with Specular Highlights
        const glazeGrad = ctx.createLinearGradient(-25, -50, 25, 10);
        glazeGrad.addColorStop(0, "#ff6699");
        glazeGrad.addColorStop(0.4, colors.secondary);
        glazeGrad.addColorStop(1, "#a80038");

        ctx.fillStyle = glazeGrad;
        ctx.beginPath();
        ctx.roundRect(-24, -49, 48, 56, 7);
        ctx.fill();

        // Specular Sheen Reflection
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.ellipse(-12, -38, 14, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Sprinkles with drop shadows
        const sprinkles = [
            { x: -14, y: -40, c: "#ffffff" }, { x: 5, y: -38, c: "#ffd600" },
            { x: -8, y: -25, c: "#00e5ff" }, { x: 12, y: -20, c: "#76ff03" },
            { x: -18, y: -10, c: "#ffffff" }, { x: 4, y: -5, c: "#ffd600" }
        ];
        sprinkles.forEach(s => {
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(s.x + 1, s.y + 1, 5, 3);
            ctx.fillStyle = s.c;
            ctx.fillRect(s.x, s.y, 5, 3);
        });

        // Wombat Anatomical Ears
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(-22, -56, 9, 0, Math.PI * 2);
        ctx.arc(22, -56, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e57373";
        ctx.beginPath();
        ctx.arc(-22, -56, 5, 0, Math.PI * 2);
        ctx.arc(22, -56, 5, 0, Math.PI * 2);
        ctx.fill();

        // Face & Expressive Eyes
        this.drawRealisticFace(ctx, colors, fighter, 0, -28);

        // Arms / Paws with muscle definition
        ctx.fillStyle = legGrad;
        ctx.beginPath();
        if (fighter.state === "attack" || fighter.state === "special") {
            ctx.roundRect(16, -35, 26, 13, 6);
        } else {
            ctx.roundRect(14, -20, 16, 12, 5);
            ctx.roundRect(-24, -20, 14, 12, 5);
        }
        ctx.fill();
    }

    // --- 2. Realistic 3D Quadruped (Capybara) ---
    draw3DQuadruped(ctx, colors, fighter, legOffset, hpPercent, time) {
        const furGrad = ctx.createLinearGradient(-40, -40, 40, 20);
        furGrad.addColorStop(0, "#9c786c");
        furGrad.addColorStop(0.5, colors.primary);
        furGrad.addColorStop(1, "#402c24");

        // Legs with joint shading
        ctx.fillStyle = furGrad;
        ctx.fillRect(-35 + legOffset, 10, 14, 20);
        ctx.fillRect(-15 - legOffset, 10, 14, 20);
        ctx.fillRect(8 + legOffset, 10, 14, 20);
        ctx.fillRect(25 - legOffset, 10, 14, 20);

        // Volumetric Torso
        ctx.fillStyle = furGrad;
        ctx.beginPath();
        ctx.roundRect(-42, -40, 75, 52, 16);
        ctx.fill();

        // Snout & Head
        ctx.fillStyle = furGrad;
        ctx.beginPath();
        ctx.roundRect(12, -54, 38, 36, 12);
        ctx.fill();

        // Cyber Visor with Lens Flare
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 10;
        ctx.fillRect(22, -46, 26, 10);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(26, -45, 6, 3); // Reflection streak
        ctx.shadowBlur = 0;

        // Snout
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.ellipse(47, -32, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Zen Citrus on head
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(28, -62, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(27, -72, 3, 6);
    }

    // --- 3. Realistic 3D Humanoid (Goku of Spaghetti) ---
    draw3DHumanoid(ctx, colors, fighter, legOffset, hpPercent, time) {
        const giGrad = ctx.createLinearGradient(-20, -40, 20, 20);
        giGrad.addColorStop(0, "#ffb74d");
        giGrad.addColorStop(0.5, colors.primary);
        giGrad.addColorStop(1, "#b26a00");

        // Legs
        ctx.fillStyle = colors.secondary;
        ctx.fillRect(-16 + legOffset, 5, 12, 26);
        ctx.fillRect(4 - legOffset, 5, 12, 26);

        // Torso with muscular contours
        ctx.fillStyle = giGrad;
        ctx.beginPath();
        ctx.roundRect(-20, -38, 40, 44, 8);
        ctx.fill();

        // Sash
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(-22, -8, 44, 8);

        // Head (Skin with ambient occlusion)
        const skinGrad = ctx.createRadialGradient(0, -50, 4, 0, -50, 16);
        skinGrad.addColorStop(0, "#ffe0b2");
        skinGrad.addColorStop(1, "#d7ccc8");
        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        ctx.arc(0, -50, 15, 0, Math.PI * 2);
        ctx.fill();

        // Spiky Anime Hair with Highlights
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.moveTo(-18, -50);
        ctx.lineTo(-28, -75);
        ctx.lineTo(-12, -62);
        ctx.lineTo(0, -84);
        ctx.lineTo(14, -65);
        ctx.lineTo(26, -72);
        ctx.lineTo(18, -48);
        ctx.closePath();
        ctx.fill();

        // Face
        this.drawRealisticFace(ctx, colors, fighter, 4, -50);

        // Arms & Fists
        ctx.fillStyle = giGrad;
        if (fighter.state === "attack" || fighter.state === "special") {
            ctx.fillRect(10, -32, 28, 12);
            ctx.fillStyle = skinGrad;
            ctx.beginPath();
            ctx.arc(40, -26, 8, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(12, -30, 14, 22);
            ctx.fillRect(-22, -30, 12, 20);
        }
    }

    // --- 4. Realistic 3D Mech Titan (Mecha Shrek) ---
    draw3DMechTitan(ctx, colors, fighter, legOffset, hpPercent, time) {
        const armorGrad = ctx.createLinearGradient(-32, -60, 32, 20);
        armorGrad.addColorStop(0, "#66bb6a");
        armorGrad.addColorStop(0.5, colors.primary);
        armorGrad.addColorStop(1, "#1b5e20");

        // Hydraulic Legs
        ctx.fillStyle = "#37474f";
        ctx.fillRect(-26 + legOffset, 0, 16, 30);
        ctx.fillRect(10 - legOffset, 0, 16, 30);
        ctx.fillStyle = "#212121";
        ctx.fillRect(-30 + legOffset, 22, 22, 12);
        ctx.fillRect(8 - legOffset, 22, 22, 12);

        // Torso Armor Plates
        ctx.fillStyle = armorGrad;
        ctx.strokeStyle = "#0d3b10";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.roundRect(-32, -50, 64, 52, 12);
        ctx.fill();
        ctx.stroke();

        // Reactor Core with pulsing glow
        const corePulse = 12 + Math.sin(time * 0.015) * 2;
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, -24, corePulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Head Helmet
        ctx.fillStyle = armorGrad;
        ctx.beginPath();
        ctx.roundRect(-18, -72, 36, 24, 6);
        ctx.fill();

        // Ogre Antenna Horns
        ctx.fillStyle = colors.accent;
        ctx.fillRect(-24, -76, 8, 12);
        ctx.fillRect(16, -76, 8, 12);

        // Visor Strip
        ctx.fillStyle = colors.glow;
        ctx.fillRect(-12, -64, 28, 6);

        // Shoulder Missile Pods
        ctx.fillStyle = "#263238";
        ctx.fillRect(-40, -56, 14, 20);
        ctx.fillRect(26, -56, 14, 20);
    }

    // --- 5. Realistic 3D Floating Orb / Espresso ---
    draw3DFloatingOrb(ctx, colors, fighter, hpPercent, time) {
        // Volumetric Metallic Sphere
        const chromeGrad = ctx.createRadialGradient(-10, -35, 4, 0, -25, 34);
        chromeGrad.addColorStop(0, "#ffffff");
        chromeGrad.addColorStop(0.3, colors.secondary);
        chromeGrad.addColorStop(0.8, colors.primary);
        chromeGrad.addColorStop(1, "#1a0c08");

        ctx.fillStyle = chromeGrad;
        ctx.beginPath();
        ctx.arc(0, -25, 32, 0, Math.PI * 2);
        ctx.fill();

        // Pressure Dial Gauge
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -25, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -25);
        const needleAngle = Math.sin(time * 0.03) * 1.3;
        ctx.lineTo(Math.cos(needleAngle) * 12, -25 + Math.sin(needleAngle) * 12);
        ctx.stroke();

        // Glowing vents
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 10;
        ctx.fillRect(-20, -5, 40, 8);
        ctx.shadowBlur = 0;
    }

    // --- 6. Realistic 3D Avian (Vampire Duck) ---
    draw3DAvian(ctx, colors, fighter, legOffset, hpPercent, time) {
        const featherGrad = ctx.createLinearGradient(-20, -40, 20, 20);
        featherGrad.addColorStop(0, "#424242");
        featherGrad.addColorStop(0.5, colors.primary);
        featherGrad.addColorStop(1, "#111111");

        // Webbed feet
        ctx.fillStyle = "#ff9800";
        ctx.fillRect(-14 + legOffset, 12, 12, 15);
        ctx.fillRect(6 - legOffset, 12, 12, 15);

        // Dracula Cape
        ctx.fillStyle = "#0a0a0a";
        ctx.beginPath();
        ctx.moveTo(-35, -45);
        ctx.lineTo(-48, 12);
        ctx.lineTo(-20, 6);
        ctx.closePath();
        ctx.fill();

        // Body
        ctx.fillStyle = featherGrad;
        ctx.beginPath();
        ctx.ellipse(-5, -20, 24, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(8, -46, 18, 0, Math.PI * 2);
        ctx.fill();

        // Beak & Fangs
        ctx.fillStyle = "#ffb300";
        ctx.beginPath();
        ctx.roundRect(16, -44, 28, 14, 6);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(22, -30); ctx.lineTo(26, -20); ctx.lineTo(30, -30);
        ctx.fill();

        // Glowing Eyes
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(14, -50, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    drawRealisticFace(ctx, colors, fighter, offsetX, offsetY) {
        ctx.fillStyle = colors.eye || "#000000";
        if (fighter.state === "hurt" || fighter.state === "stagger") {
            ctx.strokeStyle = colors.eye || "#000";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(offsetX - 10, offsetY - 5); ctx.lineTo(offsetX - 2, offsetY + 3);
            ctx.moveTo(offsetX - 2, offsetY - 5); ctx.lineTo(offsetX - 10, offsetY + 3);
            ctx.moveTo(offsetX + 6, offsetY - 5); ctx.lineTo(offsetX + 14, offsetY + 3);
            ctx.moveTo(offsetX + 14, offsetY - 5); ctx.lineTo(offsetX + 6, offsetY + 3);
            ctx.stroke();
        } else {
            // Expressive eyes with corneal light reflections
            ctx.beginPath();
            ctx.ellipse(offsetX - 6, offsetY, 3.5, 5.5, 0, 0, Math.PI * 2);
            ctx.ellipse(offsetX + 8, offsetY, 3.5, 5.5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(offsetX - 5, offsetY - 2, 1.5, 0, Math.PI * 2);
            ctx.arc(offsetX + 9, offsetY - 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * Dynamic Battle Damage System (Scratches, Bruises, Fractures, Sparks, Blood/Jam, Smoke)
     */
    renderBattleDamage(ctx, fighter, hpPercent, time) {
        if (hpPercent >= 0.85) return;

        ctx.save();

        // Level 1 Damage (HP < 80%): Minor scratches & sweat
        if (hpPercent < 0.8) {
            ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-15, -45); ctx.lineTo(-8, -38);
            ctx.moveTo(5, -15); ctx.lineTo(12, -22);
            ctx.stroke();

            // Sweat droplets
            ctx.fillStyle = "rgba(200, 240, 255, 0.7)";
            ctx.beginPath();
            ctx.arc(10, -56, 2.5, 0, Math.PI * 2);
            ctx.arc(-18, -48, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Level 2 Damage (HP < 50%): Deep lacerations & dripping blood/jam
        if (hpPercent < 0.5) {
            ctx.strokeStyle = fighter.data.appearance.colors.blood || "#b71c1c";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-20, -30); ctx.lineTo(-10, -22); ctx.lineTo(-12, -10);
            ctx.stroke();

            // Dripping droplets
            ctx.fillStyle = fighter.data.appearance.colors.blood || "#b71c1c";
            ctx.beginPath();
            ctx.arc(-12, -8 + Math.sin(time * 0.01) * 3, 3, 0, Math.PI * 2);
            ctx.fill();

            // Armor fracture cracks
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -35); ctx.lineTo(8, -28); ctx.lineTo(4, -18);
            ctx.stroke();
        }

        // Level 3 Damage (HP < 25%): Electrical sparks & smoke
        if (hpPercent < 0.25) {
            // Emitting smoke puffs
            ctx.fillStyle = "rgba(180, 180, 190, 0.45)";
            for (let i = 0; i < 3; i++) {
                const sY = -30 - (time * 0.04 + i * 15) % 35;
                const sX = -10 + Math.sin(time * 0.01 + i) * 12;
                ctx.beginPath();
                ctx.arc(sX, sY, 5 + i * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Electrical Sparks
            if (Math.random() < 0.4) {
                ctx.strokeStyle = "#00f0ff";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(5, -25);
                ctx.lineTo(12 + (Math.random() - 0.5) * 10, -28 + (Math.random() - 0.5) * 10);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    drawRealisticSlashFX(ctx, fighter, colors, time) {
        ctx.save();
        const isSuper = fighter.currentMove && fighter.currentMove.type === "super";
        const hitZone = fighter.currentMove?.hitZone || "torso";

        let arcY = -28;
        if (hitZone === "head") arcY = -48;
        else if (hitZone === "legs") arcY = -5;

        // Dynamic motion trail arc
        const slashGrad = ctx.createRadialGradient(35, arcY, 10, 35, arcY, isSuper ? 65 : 40);
        slashGrad.addColorStop(0, "#ffffff");
        slashGrad.addColorStop(0.4, colors.glow);
        slashGrad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.strokeStyle = slashGrad;
        ctx.lineWidth = isSuper ? 14 : 8;
        ctx.beginPath();
        ctx.arc(35, arcY, isSuper ? 60 : 36, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();

        ctx.restore();
    }
}

window.spriteRenderer = new SpriteRenderer();
