// ============================================================================
// RESIDENT EVIL OUTBREAK - 3D Engine (Scenario 1, 2, & 3 Hospital)
// ============================================================================

class OutbreakEngine {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.currentRoomId = 'js_bar';
    this.currentCameraZone = null;
    this.rooms = {};
    this.colliders = [];
    this.particles = [];
    this.lights = [];
    this.doors = [];
    this.pickups = [];
    this.barricades = [];
    this.typewriters = [];
    this.isPaused = false;
    this.controlMode = 'modern';
    this.initialized = false;
  }

  init(containerElement) {
    if (this.initialized) return;
    this.initialized = true;
    this.container = containerElement;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050508);
    this.scene.fog = new THREE.FogExp2(0x08090d, 0.045);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(0, 1, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);
    window.addEventListener('resize', () => this.onResize());

    this.ambientLight = new THREE.AmbientLight(0x222633, 0.6);
    this.scene.add(this.ambientLight);

    this.buildRooms();
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  buildRooms() {
    const models = window.outbreakModels;

    // ==========================================
    // SCENARIO 1: J's BAR ROOMS
    // ==========================================
    const barRoom = new THREE.Group();
    barRoom.name = 'room_js_bar';
    const barFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 14), models.materials.woodFloor);
    barFloor.rotation.x = -Math.PI / 2;
    barRoom.add(barFloor);

    const createWall = (w, h, d, x, y, z, mat, parent, roomId) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      wall.position.set(x, y, z);
      parent.add(wall);
      this.colliders.push({ minX: x - w/2, maxX: x + w/2, minZ: z - d/2, maxZ: z + d/2, isWall: true, roomId });
    };

    createWall(16, 4, 0.4, 0, 2, -7, models.materials.barWall, barRoom, 'js_bar');
    createWall(16, 4, 0.4, 0, 2, 7, models.materials.barWall, barRoom, 'js_bar');
    createWall(0.4, 4, 14, -8, 2, 0, models.materials.barWall, barRoom, 'js_bar');
    createWall(0.4, 4, 14, 8, 2, 0, models.materials.barWall, barRoom, 'js_bar');

    const counter = models.createBarCounter();
    counter.position.set(-3.5, 0, -3.5);
    barRoom.add(counter);

    const jukebox = models.createJukebox();
    jukebox.position.set(-6.8, 0, 3.5);
    barRoom.add(jukebox);

    const entranceDoor = models.createDoor('bar_front', 'downtown_street', true, 'street_unlocked');
    entranceDoor.position.set(0, 0, 6.8);
    barRoom.add(entranceDoor);
    this.doors.push(entranceDoor);

    const backDoor = models.createDoor('bar_backroom', 'storage_room', false, null);
    backDoor.position.set(5.5, 0, -6.8);
    barRoom.add(backDoor);
    this.doors.push(backDoor);

    const table1 = models.createPushableTable();
    table1.position.set(-1.5, 0, 3.5);
    barRoom.add(table1);
    this.barricades.push(table1);

    const barLight = new THREE.PointLight(0xffa550, 1.8, 9);
    barLight.position.set(-3.5, 2.8, -3.5);
    barRoom.add(barLight);

    const barCameras = [
      { id: 'cam_bar_lounge', bounds: { minX: -8, maxX: 8, minZ: 0, maxZ: 8 }, pos: new THREE.Vector3(5.5, 4.2, 5.8), look: new THREE.Vector3(0, 1.2, 2.5) },
      { id: 'cam_bar_counter', bounds: { minX: -8, maxX: 2, minZ: -7, maxZ: 0 }, pos: new THREE.Vector3(-6.2, 3.8, 1.5), look: new THREE.Vector3(-3.5, 1.0, -3.5) },
      { id: 'cam_bar_backhall', bounds: { minX: 2, maxX: 8, minZ: -7, maxZ: 0 }, pos: new THREE.Vector3(2.5, 3.5, -2.5), look: new THREE.Vector3(5.5, 1.2, -6.5) }
    ];
    this.rooms['js_bar'] = { group: barRoom, cameras: barCameras };

    // Storage Room
    const storageRoom = new THREE.Group();
    storageRoom.name = 'room_storage_room';
    const sFloor = new THREE.Mesh(new THREE.PlaneGeometry(10, 12), models.materials.barTile);
    sFloor.rotation.x = -Math.PI / 2;
    storageRoom.add(sFloor);
    createWall(10, 3.5, 0.4, 0, 1.75, -6, models.materials.barWall, storageRoom, 'storage_room');
    createWall(10, 3.5, 0.4, 0, 1.75, 6, models.materials.barWall, storageRoom, 'storage_room');
    createWall(0.4, 3.5, 12, -5, 1.75, 0, models.materials.barWall, storageRoom, 'storage_room');
    createWall(0.4, 3.5, 12, 5, 1.75, 0, models.materials.barWall, storageRoom, 'storage_room');

    const sDoorBar = models.createDoor('storage_to_bar', 'js_bar', false, null);
    sDoorBar.position.set(0, 0, 5.8);
    storageRoom.add(sDoorBar);
    this.doors.push(sDoorBar);

    const sDoorRoof = models.createDoor('storage_to_roof', 'rooftop', true, 'brass_key');
    sDoorRoof.position.set(0, 0, -5.8);
    storageRoom.add(sDoorRoof);
    this.doors.push(sDoorRoof);

    const storageCameras = [
      { id: 'cam_storage_south', bounds: { minX: -5, maxX: 5, minZ: 0, maxZ: 6 }, pos: new THREE.Vector3(-3.8, 3.2, 4.8), look: new THREE.Vector3(0, 1.2, 0) },
      { id: 'cam_storage_north', bounds: { minX: -5, maxX: 5, minZ: -6, maxZ: 0 }, pos: new THREE.Vector3(3.8, 3.4, -4.8), look: new THREE.Vector3(0, 1.0, -2.5) }
    ];
    this.rooms['storage_room'] = { group: storageRoom, cameras: storageCameras };

    // Rooftop & Downtown Street
    const roofRoom = new THREE.Group();
    roofRoom.name = 'room_rooftop';
    const rFloor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), models.materials.asphalt);
    rFloor.rotation.x = -Math.PI / 2;
    roofRoom.add(rFloor);
    const roofDoorDown = models.createDoor('roof_to_storage', 'storage_room', false, null);
    roofDoorDown.position.set(-4.5, 0, -6.6);
    roofRoom.add(roofDoorDown);
    this.doors.push(roofDoorDown);

    const roofToStreetDoor = models.createDoor('roof_to_street', 'downtown_street', true, 'fire_escape_key');
    roofToStreetDoor.position.set(6.6, 0, 2.0);
    roofToStreetDoor.rotation.y = -Math.PI / 2;
    roofRoom.add(roofToStreetDoor);
    this.doors.push(roofToStreetDoor);

    this.rooms['rooftop'] = { group: roofRoom, cameras: [{ id: 'cam_roof', bounds: { minX: -7, maxX: 7, minZ: -7, maxZ: 7 }, pos: new THREE.Vector3(-5.5, 6.2, 5.5), look: new THREE.Vector3(0, 1.0, -1.0) }] };

    const streetRoom = new THREE.Group();
    streetRoom.name = 'room_downtown_street';
    const stFloor = new THREE.Mesh(new THREE.PlaneGeometry(24, 20), models.materials.asphalt);
    stFloor.rotation.x = -Math.PI / 2;
    streetRoom.add(stFloor);
    const humvee = models.createEvacuationHumvee();
    humvee.position.set(8.0, 0, 0);
    humvee.rotation.y = -Math.PI / 2;
    streetRoom.add(humvee);
    this.rooms['downtown_street'] = { group: streetRoom, cameras: [{ id: 'cam_street', bounds: { minX: -12, maxX: 12, minZ: -10, maxZ: 10 }, pos: new THREE.Vector3(-8.5, 5.0, -7.5), look: new THREE.Vector3(0, 1.0, 0) }] };

    // ==========================================
    // SCENARIO 2: SUBWAY ROOMS
    // ==========================================
    const subwayConcourse = new THREE.Group();
    subwayConcourse.name = 'room_subway_concourse';
    const scFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), models.materials.subwayTile);
    scFloor.rotation.x = -Math.PI / 2;
    subwayConcourse.add(scFloor);

    const gateToPlatform = models.createDoor('concourse_to_platform', 'subway_platform', true, 'subway_pass');
    gateToPlatform.position.set(0, 0, 7.6);
    subwayConcourse.add(gateToPlatform);
    this.doors.push(gateToPlatform);

    const doorToSubstation = models.createDoor('concourse_to_substation', 'subway_substation', true, 'substation_key');
    doorToSubstation.position.set(7.6, 0, -3.0);
    doorToSubstation.rotation.y = -Math.PI / 2;
    subwayConcourse.add(doorToSubstation);
    this.doors.push(doorToSubstation);

    this.rooms['subway_concourse'] = { group: subwayConcourse, cameras: [{ id: 'cam_sc', bounds: { minX: -8, maxX: 8, minZ: -8, maxZ: 8 }, pos: new THREE.Vector3(-5.2, 4.2, -6.5), look: new THREE.Vector3(0, 1.0, 0) }] };

    const subwaySubstation = new THREE.Group();
    subwaySubstation.name = 'room_subway_substation';
    const subFloor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), models.materials.barTile);
    subFloor.rotation.x = -Math.PI / 2;
    subwaySubstation.add(subFloor);
    const doorSubToConcourse = models.createDoor('substation_to_concourse', 'subway_concourse', false, null);
    doorSubToConcourse.position.set(0, 0, 4.8);
    subwaySubstation.add(doorSubToConcourse);
    this.doors.push(doorSubToConcourse);
    this.rooms['subway_substation'] = { group: subwaySubstation, cameras: [{ id: 'cam_sub', bounds: { minX: -5, maxX: 5, minZ: -5, maxZ: 5 }, pos: new THREE.Vector3(-3.5, 3.8, 3.8), look: new THREE.Vector3(0, 1.2, -2.0) }] };

    const subwayPlatform = new THREE.Group();
    subwayPlatform.name = 'room_subway_platform';
    const pltFloor = new THREE.Mesh(new THREE.PlaneGeometry(24, 16), models.materials.asphalt);
    pltFloor.rotation.x = -Math.PI / 2;
    subwayPlatform.add(pltFloor);
    const train = models.createSubwayTrainCar();
    train.position.set(0, 0, -4.5);
    subwayPlatform.add(train);
    const trainDoor = models.createDoor('platform_to_train', 'subway_train', true, 'train_powered');
    trainDoor.position.set(5.5, 0, -3.0);
    subwayPlatform.add(trainDoor);
    this.doors.push(trainDoor);
    this.rooms['subway_platform'] = { group: subwayPlatform, cameras: [{ id: 'cam_plt', bounds: { minX: -12, maxX: 12, minZ: -8, maxZ: 8 }, pos: new THREE.Vector3(-8.5, 4.5, 6.5), look: new THREE.Vector3(0, 1.2, 0) }] };

    const subwayTrain = new THREE.Group();
    subwayTrain.name = 'room_subway_train';
    const trFloor = new THREE.Mesh(new THREE.PlaneGeometry(6, 12), models.materials.shinyMetal);
    trFloor.rotation.x = -Math.PI / 2;
    subwayTrain.add(trFloor);
    this.rooms['subway_train'] = { group: subwayTrain, cameras: [{ id: 'cam_tr', bounds: { minX: -3, maxX: 3, minZ: -6, maxZ: 6 }, pos: new THREE.Vector3(0, 3.0, 5.0), look: new THREE.Vector3(0, 1.2, -4.0) }] };

    // ==========================================
    // SCENARIO 3: THE HIVE (RACCOON HOSPITAL)
    // ==========================================
    // 1. Reception & ER Lobby
    const hospRec = new THREE.Group();
    hospRec.name = 'room_hospital_reception';
    const hrFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 14), models.materials.hospitalTile);
    hrFloor.rotation.x = -Math.PI / 2;
    hospRec.add(hrFloor);
    createWall(16, 4, 0.4, 0, 2, -7, models.materials.hospitalWall, hospRec, 'hospital_reception');
    createWall(16, 4, 0.4, 0, 2, 7, models.materials.hospitalWall, hospRec, 'hospital_reception');
    createWall(0.4, 4, 14, -8, 2, 0, models.materials.hospitalWall, hospRec, 'hospital_reception');
    createWall(0.4, 4, 14, 8, 2, 0, models.materials.hospitalWall, hospRec, 'hospital_reception');

    // Hospital Gurneys
    const gurney1 = models.createHospitalGurney();
    gurney1.position.set(-3.5, 0, 2.0);
    hospRec.add(gurney1);

    // Door to Lab (North East)
    const doorToLab = models.createDoor('rec_to_lab', 'hospital_lab', true, 'pharmacy_card');
    doorToLab.position.set(5.5, 0, -6.8);
    hospRec.add(doorToLab);
    this.doors.push(doorToLab);

    // Door down to Morgue (West)
    const doorToMorgue = models.createDoor('rec_to_morgue', 'hospital_morgue', false, null);
    doorToMorgue.position.set(-7.8, 0, -2.0);
    doorToMorgue.rotation.y = Math.PI / 2;
    hospRec.add(doorToMorgue);
    this.doors.push(doorToMorgue);

    this.rooms['hospital_reception'] = { group: hospRec, cameras: [{ id: 'cam_hosp_rec', bounds: { minX: -8, maxX: 8, minZ: -7, maxZ: 7 }, pos: new THREE.Vector3(5.2, 4.5, 5.8), look: new THREE.Vector3(0, 1.2, 0) }] };

    // 2. Doctor Hursh's Chemical Lab & Office
    const hospLab = new THREE.Group();
    hospLab.name = 'room_hospital_lab';
    const hlFloor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), models.materials.hospitalTile);
    hlFloor.rotation.x = -Math.PI / 2;
    hospLab.add(hlFloor);

    // Typewriter Save Point
    const typewriter = models.createTypewriter();
    typewriter.position.set(-3.5, 0, -3.5);
    hospLab.add(typewriter);
    this.typewriters.push(typewriter);

    const doorLabToRec = models.createDoor('lab_to_rec', 'hospital_reception', false, null);
    doorLabToRec.position.set(0, 0, 5.8);
    hospLab.add(doorLabToRec);
    this.doors.push(doorLabToRec);

    this.rooms['hospital_lab'] = { group: hospLab, cameras: [{ id: 'cam_lab', bounds: { minX: -6, maxX: 6, minZ: -6, maxZ: 6 }, pos: new THREE.Vector3(3.5, 4.0, 4.5), look: new THREE.Vector3(-2.0, 1.0, -2.0) }] };

    // 3. Flooded Morgue & Cryo Utility
    const hospMorgue = new THREE.Group();
    hospMorgue.name = 'room_hospital_morgue';
    const hmFloor = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), models.materials.hospitalTile);
    hmFloor.rotation.x = -Math.PI / 2;
    hospMorgue.add(hmFloor);

    const doorMorgueToRec = models.createDoor('morgue_to_rec', 'hospital_reception', false, null);
    doorMorgueToRec.position.set(0, 0, 5.8);
    hospMorgue.add(doorMorgueToRec);
    this.doors.push(doorMorgueToRec);

    // Elevator to Helipad (Requires Drainage Valve)
    const doorMorgueToRoof = models.createDoor('morgue_to_roof', 'hospital_helipad', true, 'valve_handle');
    doorMorgueToRoof.position.set(0, 0, -5.8);
    hospMorgue.add(doorMorgueToRoof);
    this.doors.push(doorMorgueToRoof);

    this.rooms['hospital_morgue'] = { group: hospMorgue, cameras: [{ id: 'cam_morgue', bounds: { minX: -7, maxX: 7, minZ: -6, maxZ: 6 }, pos: new THREE.Vector3(-4.5, 4.2, 4.5), look: new THREE.Vector3(0, 1.0, -1.0) }] };

    // 4. Rooftop Helipad (Boss Battle & Evac Helicopter)
    const hospHelipad = new THREE.Group();
    hospHelipad.name = 'room_hospital_helipad';
    const hhFloor = new THREE.Mesh(new THREE.PlaneGeometry(24, 20), models.materials.asphalt);
    hhFloor.rotation.x = -Math.PI / 2;
    hospHelipad.add(hhFloor);

    // Rescue Helicopter
    const heli = models.createRescueHelicopter();
    heli.position.set(6.5, 0, 0);
    hospHelipad.add(heli);

    this.rooms['hospital_helipad'] = { group: hospHelipad, cameras: [{ id: 'cam_helipad', bounds: { minX: -12, maxX: 12, minZ: -10, maxZ: 10 }, pos: new THREE.Vector3(-8.5, 6.0, 7.5), look: new THREE.Vector3(2.0, 1.2, 0) }] };

    this.switchRoom('js_bar', false);
  }

  switchRoom(newRoomId, animate = true) {
    if (!this.rooms[newRoomId]) return;
    if (this.currentRoomId && this.rooms[this.currentRoomId]) {
      this.scene.remove(this.rooms[this.currentRoomId].group);
    }
    this.currentRoomId = newRoomId;
    this.scene.add(this.rooms[newRoomId].group);
    const defaultCam = this.rooms[newRoomId].cameras[0];
    this.setCameraView(defaultCam, animate);
  }

  updateCameraZone(playerPos) {
    const room = this.rooms[this.currentRoomId];
    if (!room || !room.cameras) return;
    for (const cam of room.cameras) {
      const b = cam.bounds;
      if (playerPos.x >= b.minX && playerPos.x <= b.maxX && playerPos.z >= b.minZ && playerPos.z <= b.maxZ) {
        if (this.currentCameraZone !== cam.id) {
          this.currentCameraZone = cam.id;
          this.setCameraView(cam, true);
        }
        break;
      }
    }
  }

  setCameraView(camData, smooth = true) {
    if (!smooth) {
      this.camera.position.copy(camData.pos);
      this.camera.lookAt(camData.look);
      return;
    }
    this.targetCamPos = camData.pos.clone();
    this.targetCamLook = camData.look.clone();
  }

  spawnBloodSpurt(pos) {
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 6, 6);
      const mesh = new THREE.Mesh(geo, window.outbreakModels.materials.blood);
      mesh.position.copy(pos);
      this.scene.add(mesh);
      this.particles.push({
        mesh, vel: new THREE.Vector3((Math.random() - 0.5) * 2.5, Math.random() * 2.5 + 1.0, (Math.random() - 0.5) * 2.5),
        gravity: -9.8, life: 0.6
      });
    }
  }

  spawnMuzzleFlash(pos, dir) {
    const light = new THREE.PointLight(0xffcc44, 4.0, 5);
    light.position.copy(pos);
    this.scene.add(light);
    const flashGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const flashMesh = new THREE.Mesh(flashGeo, new THREE.MeshBasicMaterial({ color: 0xfffae0 }));
    flashMesh.position.copy(pos);
    this.scene.add(flashMesh);
    setTimeout(() => {
      this.scene.remove(light);
      this.scene.remove(flashMesh);
    }, 60);
  }

  update(delta) {
    if (this.isPaused) return;
    if (this.targetCamPos && this.targetCamLook) {
      this.camera.position.lerp(this.targetCamPos, delta * 6.0);
      const currentLook = new THREE.Vector3();
      this.camera.getWorldDirection(currentLook);
      const targetLookDir = this.targetCamLook.clone().sub(this.camera.position).normalize();
      currentLook.lerp(targetLookDir, delta * 6.0);
      this.camera.lookAt(this.camera.position.clone().add(currentLook));
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      p.vel.y += p.gravity * delta;
      p.mesh.position.addScaledVector(p.vel, delta);
      if (p.mesh.position.y < 0.02) {
        p.mesh.position.y = 0.02;
        p.vel.set(0, 0, 0);
      }
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.outbreakEngine = new OutbreakEngine();
