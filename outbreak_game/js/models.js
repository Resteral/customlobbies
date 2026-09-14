// ============================================================================
// RESIDENT EVIL OUTBREAK - Procedural 3D Asset & Model Generator (Complete)
// ============================================================================

class OutbreakModels {
  constructor() {
    this.materials = {};
    this.textures = {};
    this.initTextures();
    this.initMaterials();
  }

  // --- PROCEDURAL TEXTURES VIA CANVAS ---
  createProceduralTexture(type, color1 = '#333333', color2 = '#111111') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (type === 'wood') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = color2;
      ctx.lineWidth = 2;
      for (let i = 0; i < 256; i += 8) {
        ctx.beginPath();
        ctx.moveTo(0, i + Math.sin(i * 0.1) * 4);
        ctx.bezierCurveTo(80, i + Math.cos(i * 0.05) * 6, 180, i - Math.sin(i * 0.08) * 8, 256, i);
        ctx.stroke();
      }
    } else if (type === 'tiles' || type === 'hospital_tiles') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = color2;
      ctx.lineWidth = 2;
      for (let x = 0; x <= 256; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
      }
      for (let y = 0; y <= 256; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
      }
      if (type === 'hospital_tiles') {
        ctx.fillStyle = 'rgba(100, 0, 0, 0.35)'; // Dried blood stains
        ctx.beginPath(); ctx.arc(120, 160, 45, 0, Math.PI * 2); ctx.fill();
      }
    } else if (type === 'subway_tiles') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = color2;
      ctx.lineWidth = 2;
      for (let x = 0; x <= 256; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
      }
      for (let y = 0; y <= 256; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
      }
    } else if (type === 'wallpaper') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = color2;
      for (let x = 16; x < 256; x += 32) {
        for (let y = 16; y < 256; y += 32) {
          ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        }
      }
    } else if (type === 'asphalt') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#111' : '#3a3a3a';
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
      }
    } else if (type === 'flesh') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = 'rgba(120, 10, 10, 0.6)';
      for (let i = 0; i < 20; i++) {
        ctx.fillRect(Math.random() * 240, Math.random() * 240, Math.random() * 20 + 4, Math.random() * 20 + 4);
      }
    } else if (type === 'crimson_flesh') {
      ctx.fillStyle = '#8b0000';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = 'rgba(255, 30, 30, 0.4)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(Math.random() * 240, Math.random() * 240, Math.random() * 12 + 2, Math.random() * 12 + 2);
      }
    } else if (type === 'metal') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = color2;
      ctx.lineWidth = 1;
      for (let i = 0; i < 256; i += 4) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i + Math.random() * 4 - 2); ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  initTextures() {
    this.textures.barWood = this.createProceduralTexture('wood', '#542911', '#2c1407');
    this.textures.floorWood = this.createProceduralTexture('wood', '#3d200f', '#221107');
    this.textures.floorWood.repeat.set(4, 4);
    this.textures.barTile = this.createProceduralTexture('tiles', '#3a444a', '#1e2428');
    this.textures.hospitalTile = this.createProceduralTexture('hospital_tiles', '#d8e2dc', '#8d99ae');
    this.textures.hospitalTile.repeat.set(6, 6);
    this.textures.subwayTile = this.createProceduralTexture('subway_tiles', '#c2c9d1', '#5a626a');
    this.textures.subwayTile.repeat.set(8, 4);
    this.textures.barWall = this.createProceduralTexture('wallpaper', '#4a1515', '#240707');
    this.textures.hospitalWall = this.createProceduralTexture('tiles', '#4a625f', '#1f2e2d');
    this.textures.asphalt = this.createProceduralTexture('asphalt', '#1a1a1a', '#0d0d0d');
    this.textures.asphalt.repeat.set(8, 8);
    this.textures.rustyMetal = this.createProceduralTexture('metal', '#5c4331', '#2d1a0d');
    this.textures.zombieSkin = this.createProceduralTexture('flesh', '#4f5c49', '#633b3b');
    this.textures.crimsonSkin = this.createProceduralTexture('crimson_flesh', '#800a0a', '#400000');
  }

  initMaterials() {
    this.materials.woodFloor = new THREE.MeshStandardMaterial({ map: this.textures.floorWood, roughness: 0.8, metalness: 0.1 });
    this.materials.barWall = new THREE.MeshStandardMaterial({ map: this.textures.barWall, roughness: 0.9 });
    this.materials.barTile = new THREE.MeshStandardMaterial({ map: this.textures.barTile, roughness: 0.5, metalness: 0.2 });
    this.materials.hospitalTile = new THREE.MeshStandardMaterial({ map: this.textures.hospitalTile, roughness: 0.3, metalness: 0.1 });
    this.materials.hospitalWall = new THREE.MeshStandardMaterial({ map: this.textures.hospitalWall, roughness: 0.6 });
    this.materials.subwayTile = new THREE.MeshStandardMaterial({ map: this.textures.subwayTile, roughness: 0.4, metalness: 0.2 });
    this.materials.asphalt = new THREE.MeshStandardMaterial({ map: this.textures.asphalt, roughness: 0.95 });
    this.materials.metal = new THREE.MeshStandardMaterial({ map: this.textures.rustyMetal, roughness: 0.4, metalness: 0.8 });
    this.materials.shinyMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    this.materials.glass = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.35, roughness: 0.1, transmission: 0.9 });
    this.materials.blood = new THREE.MeshBasicMaterial({ color: 0x8b0000 });
    this.materials.neonRed = new THREE.MeshBasicMaterial({ color: 0xff1133 });
    this.materials.neonBlue = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    this.materials.neonYellow = new THREE.MeshBasicMaterial({ color: 0xffe600 });
    this.materials.chitinBoss = new THREE.MeshStandardMaterial({ color: 0x3d182b, roughness: 0.3, metalness: 0.6 });
    this.materials.leechFlesh = new THREE.MeshStandardMaterial({ color: 0x220510, roughness: 0.15, metalness: 0.4 });
  }

  // --- ALL 8 SURVIVOR CHARACTERS ---
  createCharacter(charId) {
    const group = new THREE.Group();
    group.name = `character_${charId}`;

    let skinColor = 0xffdfc4;
    let shirtColor = 0x223366;
    let pantsColor = 0x181e28;
    let hairColor = 0x3d2314;
    let hasBackpack = false;
    let hasHat = false;
    let hasCoat = false;
    let hasVest = false;

    if (charId === 'kevin') {
      shirtColor = 0x1f2c4c;
      pantsColor = 0x181e2b;
      hairColor = 0x4a2e1b;
      hasHat = true;
    } else if (charId === 'cindy') {
      skinColor = 0xffe2cf;
      shirtColor = 0xf0f0f0;
      pantsColor = 0x222222;
      hairColor = 0xb38646;
      hasVest = true;
    } else if (charId === 'alyssa') {
      skinColor = 0xffdfc4;
      shirtColor = 0x991122;
      pantsColor = 0x2b333d;
      hairColor = 0x1c130d;
    } else if (charId === 'david') {
      skinColor = 0xe8cca8;
      shirtColor = 0x222222;
      pantsColor = 0x474a51;
      hairColor = 0x1a1a1a;
    } else if (charId === 'yoko') {
      skinColor = 0xfce1cc;
      shirtColor = 0x2b5735;
      pantsColor = 0x1c2130;
      hairColor = 0x0a0a0a;
      hasBackpack = true;
    } else if (charId === 'mark') {
      skinColor = 0x6e473b;
      shirtColor = 0x3a4b5c;
      pantsColor = 0x1f242e;
      hairColor = 0x1a1a1a;
      hasHat = true;
      hasVest = true;
    } else if (charId === 'george') {
      skinColor = 0xffe0cd;
      shirtColor = 0x224466;
      pantsColor = 0x2f343b;
      hairColor = 0x5a4235;
      hasCoat = true;
    } else if (charId === 'jim') {
      skinColor = 0x734d38;
      shirtColor = 0xd9822b;
      pantsColor = 0x1a2130;
      hairColor = 0x151515;
      hasHat = true;
    }

    const matSkin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7 });
    const matShirt = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.8 });
    const matPants = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.85 });
    const matHair = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
    const matShoe = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    const pelvis = new THREE.Group();
    pelvis.position.y = 0.85;
    group.add(pelvis);

    const torsoGeo = new THREE.BoxGeometry(0.38, 0.45, 0.22);
    const torso = new THREE.Mesh(torsoGeo, matShirt);
    torso.position.y = 0.22;
    torso.castShadow = true;
    pelvis.add(torso);

    if (hasCoat) {
      const coatGeo = new THREE.BoxGeometry(0.42, 0.65, 0.24);
      const coatMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.7 });
      const coat = new THREE.Mesh(coatGeo, coatMat);
      coat.position.y = 0.15;
      pelvis.add(coat);
    }

    if (charId === 'mark') {
      const tacVestGeo = new THREE.BoxGeometry(0.42, 0.46, 0.26);
      const tacVestMat = new THREE.MeshStandardMaterial({ color: 0x1e2420, roughness: 0.9 });
      const tacVest = new THREE.Mesh(tacVestGeo, tacVestMat);
      tacVest.position.y = 0.22;
      pelvis.add(tacVest);
    }

    if (charId === 'cindy') {
      const vestGeo = new THREE.BoxGeometry(0.39, 0.35, 0.23);
      const vestMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.7 });
      const vest = new THREE.Mesh(vestGeo, vestMat);
      vest.position.y = 0.22;
      pelvis.add(vest);
      const bow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.04), this.materials.neonRed);
      bow.position.set(0, 0.38, 0.12);
      pelvis.add(bow);
    }

    if (hasBackpack) {
      const packGeo = new THREE.BoxGeometry(0.32, 0.42, 0.18);
      const packMat = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.9 });
      const pack = new THREE.Mesh(packGeo, packMat);
      pack.position.set(0, 0.22, -0.18);
      pack.castShadow = true;
      pelvis.add(pack);
    }

    const headGeo = new THREE.BoxGeometry(0.22, 0.24, 0.22);
    const head = new THREE.Mesh(headGeo, matSkin);
    head.position.y = 0.58;
    head.castShadow = true;
    pelvis.add(head);

    const hairGeo = new THREE.BoxGeometry(0.24, 0.1, 0.24);
    const hair = new THREE.Mesh(hairGeo, matHair);
    hair.position.set(0, 0.68, 0);
    pelvis.add(hair);

    if (hasHat) {
      const capMat = (charId === 'jim') ? new THREE.MeshStandardMaterial({ color: 0x1a2638 }) : matShirt;
      const capGeo = new THREE.BoxGeometry(0.26, 0.07, 0.28);
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(0, 0.72, 0.02);
      const visorGeo = new THREE.BoxGeometry(0.24, 0.02, 0.12);
      const visor = new THREE.Mesh(visorGeo, matShoe);
      visor.position.set(0, 0.7, 0.18);
      pelvis.add(cap);
      pelvis.add(visor);
    }

    const lightHolder = new THREE.Group();
    lightHolder.position.set(0.12, 0.38, 0.12);
    const spotLight = new THREE.SpotLight(0xfff5e6, 3.5, 14, Math.PI / 5, 0.4, 1.2);
    spotLight.position.set(0, 0, 0.1);
    spotLight.target.position.set(0, 0, 5);
    lightHolder.add(spotLight);
    lightHolder.add(spotLight.target);
    pelvis.add(lightHolder);

    const armGeo = new THREE.BoxGeometry(0.11, 0.36, 0.11);
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.25, 0.4, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, hasCoat ? new THREE.MeshStandardMaterial({ color: 0xf5f5f5 }) : matShirt);
    leftArmMesh.position.y = -0.18;
    leftArm.add(leftArmMesh);
    pelvis.add(leftArm);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.25, 0.4, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, hasCoat ? new THREE.MeshStandardMaterial({ color: 0xf5f5f5 }) : matShirt);
    rightArmMesh.position.y = -0.18;
    rightArm.add(rightArmMesh);

    const weaponSocket = new THREE.Group();
    weaponSocket.position.set(0, -0.4, 0.05);
    rightArm.add(weaponSocket);
    pelvis.add(rightArm);

    const legGeo = new THREE.BoxGeometry(0.13, 0.45, 0.13);
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.1, 0, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, matPants);
    leftLegMesh.position.y = -0.22;
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);
    pelvis.add(leftLeg);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.1, 0, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, matPants);
    rightLegMesh.position.y = -0.22;
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);
    pelvis.add(rightLeg);

    group.userData = { pelvis, torso, head, leftArm, rightArm, leftLeg, rightLeg, weaponSocket, spotLight, walkTime: 0 };
    return group;
  }

  // --- ZOMBIES & CRIMSON HEADS ---
  createZombie(type = 'male') {
    const group = new THREE.Group();
    group.name = `zombie_${type}`;

    let matSkin = new THREE.MeshStandardMaterial({ map: this.textures.zombieSkin, roughness: 0.9 });
    let shirtColor = 0x3d352e;
    let pantsColor = 0x221e1a;
    let isCrawler = false;

    if (type === 'crimson') {
      matSkin = new THREE.MeshStandardMaterial({ map: this.textures.crimsonSkin, roughness: 0.8 });
      shirtColor = 0x5a1818;
    } else if (type === 'cop') {
      shirtColor = 0x1f2c4c;
      pantsColor = 0x181e2b;
    } else if (type === 'crawler') {
      isCrawler = true;
    }

    const matShirt = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.95 });
    const matPants = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.95 });

    const pelvis = new THREE.Group();
    pelvis.position.y = isCrawler ? 0.25 : 0.85;
    group.add(pelvis);

    const torsoGeo = new THREE.BoxGeometry(0.38, 0.46, 0.24);
    const torso = new THREE.Mesh(torsoGeo, matShirt);
    torso.position.y = 0.22;
    torso.rotation.x = isCrawler ? 0.9 : 0.15;
    torso.castShadow = true;
    pelvis.add(torso);

    const headGeo = new THREE.BoxGeometry(0.22, 0.24, 0.22);
    const head = new THREE.Mesh(headGeo, matSkin);
    head.position.set(0, 0.58, 0.08);
    head.rotation.set(0.2, 0.1, -0.15);
    head.castShadow = true;
    pelvis.add(head);

    if (type === 'crimson') {
      const eyeGeo = new THREE.SphereGeometry(0.02, 6, 6);
      const eyeL = new THREE.Mesh(eyeGeo, this.materials.neonRed);
      eyeL.position.set(-0.06, 0.62, 0.2);
      const eyeR = new THREE.Mesh(eyeGeo, this.materials.neonRed);
      eyeR.position.set(0.06, 0.62, 0.2);
      pelvis.add(eyeL);
      pelvis.add(eyeR);
    }

    const armGeo = new THREE.BoxGeometry(0.11, 0.38, 0.11);
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.25, 0.38, 0.05);
    const leftArmMesh = new THREE.Mesh(armGeo, matSkin);
    leftArmMesh.position.y = -0.19;
    leftArm.add(leftArmMesh);
    leftArm.rotation.x = isCrawler ? -0.5 : -1.1;
    pelvis.add(leftArm);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.25, 0.38, 0.05);
    const rightArmMesh = new THREE.Mesh(armGeo, matSkin);
    rightArmMesh.position.y = -0.19;
    rightArm.add(rightArmMesh);
    rightArm.rotation.x = isCrawler ? -0.5 : -1.25;
    pelvis.add(rightArm);

    if (!isCrawler) {
      const legGeo = new THREE.BoxGeometry(0.13, 0.45, 0.13);
      const leftLeg = new THREE.Group();
      leftLeg.position.set(-0.1, 0, 0);
      const leftLegMesh = new THREE.Mesh(legGeo, matPants);
      leftLegMesh.position.y = -0.22;
      leftLeg.add(leftLegMesh);
      pelvis.add(leftLeg);

      const rightLeg = new THREE.Group();
      rightLeg.position.set(0.1, 0, 0);
      const rightLegMesh = new THREE.Mesh(legGeo, matPants);
      rightLegMesh.position.y = -0.22;
      rightLeg.add(rightLegMesh);
      pelvis.add(rightLeg);
    }

    group.userData = {
      pelvis, torso, head, leftArm, rightArm,
      type, isCrawler, hp: type === 'crimson' ? 140 : (isCrawler ? 70 : 100),
      maxHp: type === 'crimson' ? 140 : 100, isDead: false
    };
    return group;
  }

  // --- BOSS 1: GIANT MUTANT FLEA QUEEN ---
  createBossMonster() {
    const group = new THREE.Group();
    group.name = 'boss_mutant_flea';

    const abdomenGeo = new THREE.SphereGeometry(1.6, 16, 12);
    abdomenGeo.scale(1.0, 0.8, 1.4);
    const abdomen = new THREE.Mesh(abdomenGeo, this.materials.chitinBoss);
    abdomen.position.set(0, 1.4, -0.8);
    abdomen.castShadow = true;
    group.add(abdomen);

    const thoraxGeo = new THREE.BoxGeometry(1.4, 1.2, 1.4);
    const thorax = new THREE.Mesh(thoraxGeo, this.materials.chitinBoss);
    thorax.position.set(0, 1.5, 0.8);
    thorax.castShadow = true;
    group.add(thorax);

    const pincerGeo = new THREE.ConeGeometry(0.15, 0.9, 8);
    pincerGeo.rotateX(Math.PI / 2);
    const pincerL = new THREE.Mesh(pincerGeo, this.materials.metal);
    pincerL.position.set(-0.5, 1.2, 1.8);
    pincerL.rotation.y = 0.3;
    const pincerR = new THREE.Mesh(pincerGeo, this.materials.metal);
    pincerR.position.set(0.5, 1.2, 1.8);
    pincerR.rotation.y = -0.3;
    group.add(pincerL);
    group.add(pincerR);

    for (let i = 0; i < 3; i++) {
      const zOffset = (i - 1) * 0.9;
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 2.2), this.materials.chitinBoss);
      legL.position.set(-1.2, 1.0, zOffset);
      legL.rotation.z = Math.PI / 4;
      group.add(legL);

      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 2.2), this.materials.chitinBoss);
      legR.position.set(1.2, 1.0, zOffset);
      legR.rotation.z = -Math.PI / 4;
      group.add(legR);
    }

    group.userData = { isBoss: true, hp: 600, maxHp: 600, isDead: false };
    return group;
  }

  // --- BOSS 2: THE LEECH MONSTER (G-HULK) ---
  createLeechBoss() {
    const group = new THREE.Group();
    group.name = 'boss_leech_monster';

    // Massive undulating gelatinous body
    const bodyGeo = new THREE.DodecahedronGeometry(1.8, 2);
    bodyGeo.scale(1.1, 1.5, 1.1);
    const body = new THREE.Mesh(bodyGeo, this.materials.leechFlesh);
    body.position.set(0, 1.8, 0);
    body.castShadow = true;
    group.add(body);

    // Giant Maw
    const mawGeo = new THREE.TorusGeometry(0.6, 0.2, 8, 16);
    const maw = new THREE.Mesh(mawGeo, this.materials.blood);
    maw.position.set(0, 2.0, 1.4);
    group.add(maw);

    // 4 Writhing Tentacles
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.04, 2.8, 8), this.materials.leechFlesh);
      tentacle.position.set(Math.cos(angle) * 1.2, 1.5, Math.sin(angle) * 1.2);
      tentacle.rotation.x = Math.sin(angle) * 0.6;
      tentacle.rotation.z = Math.cos(angle) * 0.6;
      tentacle.castShadow = true;
      group.add(tentacle);
    }

    group.userData = { isBoss: true, hp: 750, maxHp: 750, isDead: false };
    return group;
  }

  // --- WEAPONS (INCLUDING MAGNUM & GRENADE LAUNCHER) ---
  createWeaponMesh(weaponType) {
    const group = new THREE.Group();

    if (weaponType === 'handgun') {
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.2), this.materials.shinyMetal);
      slide.position.set(0, 0.05, 0.05);
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.1, 0.06), new THREE.MeshStandardMaterial({ color: 0x111111 }));
      grip.position.set(0, 0, -0.02);
      grip.rotation.x = -0.3;
      group.add(slide);
      group.add(grip);
    } else if (weaponType === 'magnum') {
      // .357 Magnum Revolver (Silver barrel + Heavy cylinder)
      const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.32), this.materials.shinyMetal);
      barrel.position.set(0, 0.06, 0.12);
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 12), this.materials.shinyMetal);
      cylinder.rotation.x = Math.PI / 2;
      cylinder.position.set(0, 0.04, -0.03);
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.07), this.materials.barWood);
      grip.position.set(0, -0.04, -0.06);
      grip.rotation.x = -0.4;
      group.add(barrel);
      group.add(cylinder);
      group.add(grip);
    } else if (weaponType === 'grenade_launcher') {
      // M79 Break-Action Grenade Launcher
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 12), this.materials.metal);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.05, 0.15);
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.35), this.materials.barWood);
      stock.position.set(0, -0.02, -0.15);
      group.add(barrel);
      group.add(stock);
    } else if (weaponType === 'shotgun') {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65), this.materials.metal);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.04, 0.2);
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.35), this.materials.woodFloor);
      stock.position.set(0, 0, -0.15);
      group.add(barrel);
      group.add(stock);
    } else if (weaponType === 'spear') {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4), this.materials.woodFloor);
      shaft.position.set(0, 0.4, 0);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.25, 0.06), this.materials.shinyMetal);
      blade.position.set(0, 1.15, 0);
      group.add(shaft);
      group.add(blade);
    } else if (weaponType === 'medical_shooter') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.25), this.materials.metal);
      const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.15), new THREE.MeshStandardMaterial({ color: 0x39ff14 }));
      vial.rotation.x = Math.PI / 2;
      vial.position.set(0, 0.08, 0);
      group.add(body);
      group.add(vial);
    } else if (weaponType === 'pipe') {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8), this.materials.metal);
      pipe.position.set(0, 0.2, 0);
      group.add(pipe);
    }

    return group;
  }

  // --- ITEM WORLD PICKUPS ---
  createItemPickupMesh(item) {
    const group = new THREE.Group();
    group.name = `pickup_${item.id}`;

    let mesh;
    if (item.id.includes('herb_green')) mesh = this.createHerbPot(0x2e8b57);
    else if (item.id.includes('herb_red')) mesh = this.createHerbPot(0xcc2222);
    else if (item.id.includes('herb_blue')) mesh = this.createHerbPot(0x2266cc);
    else if (item.id.includes('firstaid')) {
      const spray = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22), new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
      spray.position.y = 0.11;
      group.add(spray);
    } else if (item.id.includes('ammo')) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.18), new THREE.MeshStandardMaterial({ color: item.id.includes('magnum') ? 0xd4af37 : (item.id.includes('grenade') ? 0x2e8b57 : 0xb22222) }));
      group.add(box);
    } else if (item.id.includes('key')) {
      const keyMesh = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 8, 16), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8 }));
      keyMesh.position.y = 0.05;
      group.add(keyMesh);
    } else if (item.id.includes('ink_ribbon')) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.12), new THREE.MeshStandardMaterial({ color: 0x111111 }));
      group.add(rib);
    } else {
      const wp = this.createWeaponMesh(item.type || 'handgun');
      group.add(wp);
    }

    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x44ff88, transparent: true, opacity: 0.8 }));
    glow.position.y = 0.35;
    group.add(glow);

    group.userData = { item, glow };
    return group;
  }

  createHerbPot(color) {
    const group = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.15, 12), new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12), new THREE.MeshStandardMaterial({ color: color, roughness: 0.9 }));
    leaves.position.y = 0.12;
    group.add(pot);
    group.add(leaves);
    return group;
  }

  // --- ENVIRONMENT ASSETS ---
  createBarCounter() {
    const group = new THREE.Group();
    const mainCounter = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.0, 0.9), this.materials.barWood);
    mainCounter.position.set(0, 0.5, 0);
    const cornerCounter = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 2.5), this.materials.barWood);
    cornerCounter.position.set(1.8, 0.5, 1.7);
    group.add(mainCounter);
    group.add(cornerCounter);
    return group;
  }

  createBarStool() {
    const group = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x801010, roughness: 0.6 }));
    seat.position.y = 0.65;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.65, 8), this.materials.shinyMetal);
    pole.position.y = 0.325;
    group.add(seat);
    group.add(pole);
    return group;
  }

  createJukebox() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.6), new THREE.MeshStandardMaterial({ color: 0x4a2306, roughness: 0.4 }));
    body.position.y = 0.8;
    group.add(body);
    return group;
  }

  createPushableTable() {
    const group = new THREE.Group();
    group.name = 'pushable_table';
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.9), this.materials.barWood);
    top.position.y = 0.76;
    group.add(top);
    const legGeo = new THREE.BoxGeometry(0.08, 0.72, 0.08);
    [[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, this.materials.barWood);
      leg.position.set(x, 0.36, z);
      group.add(leg);
    });
    group.userData = { isBarricade: true, isPlaced: false, hpBonus: 250 };
    return group;
  }

  createDoor(id, targetRoom, isLocked = false, requiredKey = null) {
    const group = new THREE.Group();
    group.name = `door_${id}`;
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x221811 });
    const postL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 0.15), frameMat);
    postL.position.set(-0.6, 1.1, 0);
    const postR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 0.15), frameMat);
    postR.position.set(0.6, 1.1, 0);
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.15), frameMat);
    topBar.position.set(0, 2.15, 0);

    const doorPanel = new THREE.Group();
    doorPanel.position.set(-0.55, 0, 0);
    const panelMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.1, 0.06), this.materials.woodFloor);
    panelMesh.position.set(0.55, 1.05, 0);
    doorPanel.add(panelMesh);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8 }));
    knob.position.set(0.98, 1.0, 0.05);
    doorPanel.add(knob);

    group.add(postL);
    group.add(postR);
    group.add(topBar);
    group.add(doorPanel);

    group.userData = { id, targetRoom, isLocked, requiredKey, hp: 150, maxHp: 150, isBroken: false, doorPanel };
    return group;
  }

  createPoliceCar() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 4.4), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    body.position.y = 0.5;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 2.2), this.materials.glass);
    cabin.position.set(0, 1.0, -0.2);
    group.add(body);
    group.add(cabin);
    return group;
  }

  createEvacuationHumvee() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 5.0), new THREE.MeshStandardMaterial({ color: 0x3d4835 }));
    body.position.y = 0.9;
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12), this.materials.neonYellow);
    beacon.position.set(0, 2.2, 0);
    group.add(body);
    group.add(beacon);
    return group;
  }

  createSubwayTurnstile() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 1.2), this.materials.shinyMetal);
    body.position.y = 0.45;
    group.add(body);
    return group;
  }

  createSubwayTrainCar() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 14.0), new THREE.MeshStandardMaterial({ color: 0x6a7b8c, metalness: 0.8 }));
    body.position.set(0, 1.4, 0);
    group.add(body);
    return group;
  }

  // --- SCENARIO 3: HOSPITAL ENVIRONMENT ASSETS ---
  createHospitalGurney() {
    const group = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.8), this.materials.shinyMetal);
    frame.position.y = 0.35;
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.75), new THREE.MeshStandardMaterial({ color: 0xdde5ed }));
    mattress.position.y = 0.7;
    group.add(frame);
    group.add(mattress);
    return group;
  }

  createTypewriter() {
    const group = new THREE.Group();
    group.name = 'typewriter_save';
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.45), new THREE.MeshStandardMaterial({ color: 0x1a2118, roughness: 0.5 }));
    body.position.y = 0.8;
    const carriage = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12), this.materials.shinyMetal);
    carriage.rotation.z = Math.PI / 2;
    carriage.position.set(0, 0.95, -0.1);
    group.add(body);
    group.add(carriage);
    group.userData = { isTypewriter: true };
    return group;
  }

  createRescueHelicopter() {
    const group = new THREE.Group();
    const milMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.5 }); // UBCS Black/Navy
    const fuselage = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 6.5), milMat);
    fuselage.position.y = 1.6;
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 4.5), milMat);
    tail.rotation.x = Math.PI / 2;
    tail.position.set(0, 1.8, -4.5);
    const rotor = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.04, 0.35), this.materials.shinyMetal);
    rotor.position.set(0, 2.7, 0);

    const searchLight = new THREE.SpotLight(0xffffff, 4.5, 25, Math.PI / 4, 0.3);
    searchLight.position.set(0, 1.2, 2.5);
    searchLight.target.position.set(0, 0, 8.0);

    group.add(fuselage);
    group.add(tail);
    group.add(rotor);
    group.add(searchLight);
    group.add(searchLight.target);
    return group;
  }
}

window.outbreakModels = new OutbreakModels();
