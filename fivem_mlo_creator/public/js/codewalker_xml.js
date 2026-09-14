/**
 * CodeWalker XML Generator & Parser for FiveM MLO Interiors
 * Compliant with GTA V CMapTypes (ytyp) and CMapData (ymap) schemas
 */

class CodeWalkerXML {
    /**
     * Converts Euler Angles (degrees) to Quaternion (x, y, z, w)
     */
    static eulerToQuaternion(pitch, roll, yaw) {
        // Angles in radians
        const p = (pitch * Math.PI) / 180 / 2;
        const r = (roll * Math.PI) / 180 / 2;
        const y = (yaw * Math.PI) / 180 / 2;

        const sinP = Math.sin(p);
        const cosP = Math.cos(p);
        const sinR = Math.sin(r);
        const cosR = Math.cos(r);
        const sinY = Math.sin(y);
        const cosY = Math.cos(y);

        return {
            x: Number((sinP * cosR * cosY - cosP * sinR * sinY).toFixed(6)),
            y: Number((cosP * sinR * cosY + sinP * cosR * sinY).toFixed(6)),
            z: Number((cosP * cosR * sinY - sinP * sinR * cosY).toFixed(6)),
            w: Number((cosP * cosR * cosY + sinP * sinR * sinY).toFixed(6))
        };
    }

    /**
     * Converts Quaternion (x, y, z, w) to Euler Angles (degrees)
     */
    static quaternionToEuler(q) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        // Roll (x-axis rotation)
        const sinr_cosp = 2 * (w * x + y * z);
        const cosr_cosp = 1 - 2 * (x * x + y * y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);

        // Pitch (y-axis rotation)
        const sinp = 2 * (w * y - z * x);
        let pitch;
        if (Math.abs(sinp) >= 1) {
            pitch = (Math.sign(sinp) * Math.PI) / 2; // use 90 degrees if out of range
        } else {
            pitch = Math.asin(sinp);
        }

        // Yaw (z-axis rotation)
        const siny_cosp = 2 * (w * z + x * y);
        const cosy_cosp = 1 - 2 * (y * y + z * z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);

        return {
            pitch: Number(((roll * 180) / Math.PI).toFixed(2)),
            roll: Number(((pitch * 180) / Math.PI).toFixed(2)),
            yaw: Number(((yaw * 180) / Math.PI).toFixed(2))
        };
    }

    /**
     * Calculates combined bounding box and sphere radius for all rooms & entities
     */
    static calculateBounds(rooms, entities) {
        let minX = -10, minY = -10, minZ = -5;
        let maxX = 10, maxY = 10, maxZ = 5;

        if (rooms && rooms.length > 0) {
            rooms.forEach(r => {
                if (r.bbMin && r.bbMax) {
                    minX = Math.min(minX, r.bbMin[0]);
                    minY = Math.min(minY, r.bbMin[1]);
                    minZ = Math.min(minZ, r.bbMin[2]);
                    maxX = Math.max(maxX, r.bbMax[0]);
                    maxY = Math.max(maxY, r.bbMax[1]);
                    maxZ = Math.max(maxZ, r.bbMax[2]);
                }
            });
        }

        if (entities && entities.length > 0) {
            entities.forEach(e => {
                if (e.pos) {
                    minX = Math.min(minX, e.pos.x - 2);
                    minY = Math.min(minY, e.pos.y - 2);
                    minZ = Math.min(minZ, e.pos.z - 1);
                    maxX = Math.max(maxX, e.pos.x + 2);
                    maxY = Math.max(maxY, e.pos.y + 2);
                    maxZ = Math.max(maxZ, e.pos.z + 3);
                }
            });
        }

        const sizeX = maxX - minX;
        const sizeY = maxY - minY;
        const sizeZ = maxZ - minZ;
        const radius = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ) / 2;

        return {
            bbMin: { x: Number(minX.toFixed(4)), y: Number(minY.toFixed(4)), z: Number(minZ.toFixed(4)) },
            bbMax: { x: Number(maxX.toFixed(4)), y: Number(maxY.toFixed(4)), z: Number(maxZ.toFixed(4)) },
            radius: Number(radius.toFixed(4))
        };
    }

    /**
     * Generates .ytyp.xml (CMapTypes) CodeWalker File
     */
    static generateYtypXml(mloData) {
        const archName = (mloData.archetype || mloData.name || 'hei_dlc_mlo_custom').toLowerCase();
        const bounds = this.calculateBounds(mloData.rooms, mloData.entities);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<CMapTypes>
  <extensions />
  <archetypes>
    <Item type="CMloArchetypeDef">
      <lodDist value="150.00000000" />
      <flags value="0" />
      <specialAttribute value="0" />
      <bbMin x="${bounds.bbMin.x}" y="${bounds.bbMin.y}" z="${bounds.bbMin.z}" />
      <bbMax x="${bounds.bbMax.x}" y="${bounds.bbMax.y}" z="${bounds.bbMax.z}" />
      <bsCentre x="${((bounds.bbMin.x + bounds.bbMax.x) / 2).toFixed(4)}" y="${((bounds.bbMin.y + bounds.bbMax.y) / 2).toFixed(4)}" z="${((bounds.bbMin.z + bounds.bbMax.z) / 2).toFixed(4)}" />
      <bsRadius value="${bounds.radius}" />
      <name>${archName}</name>
      <textureDictionary>${archName}</textureDictionary>
      <clipDictionary />
      <drawableDictionary />
      <physicsDictionary>${archName}</physicsDictionary>
      <hdTextureDist value="60.00000000" />
      <assetType>ASSET_TYPE_DRAWABLE</assetType>
      <assetName>${archName}</assetName>
      <rooms>`;

        // Export Rooms
        (mloData.rooms || []).forEach((room, idx) => {
            const rMin = room.bbMin || [-5, -5, -1];
            const rMax = room.bbMax || [5, 5, 4];
            const timecycle = room.timecycle || 'default';
            const blend = room.blend !== undefined ? Number(room.blend).toFixed(8) : '1.00000000';
            const flags = room.flags || 0;
            const floorId = room.floorId !== undefined ? room.floorId : 0;

            xml += `
        <Item type="CMloRoomDef">
          <name>${room.name || (idx === 0 ? 'limbo' : `room_${idx}`)}</name>
          <bbMin x="${rMin[0]}" y="${rMin[1]}" z="${rMin[2]}" />
          <bbMax x="${rMax[0]}" y="${rMax[1]}" z="${rMax[2]}" />
          <blend value="${blend}" />
          <timecycleName>${timecycle}</timecycleName>
          <secondaryTimecycleName />
          <flags value="${flags}" />
          <portalCount value="0" />
          <floorId value="${floorId}" />
        </Item>`;
        });

        xml += `
      </rooms>
      <portals>`;

        // Export Portals
        (mloData.portals || []).forEach((portal, idx) => {
            const fromRoom = portal.fromRoom !== undefined ? portal.fromRoom : 0;
            const toRoom = portal.toRoom !== undefined ? portal.toRoom : 1;
            const flags = portal.flags || 0;
            const mirrorPriority = portal.mirrorPriority || 0;
            const opacity = portal.opacity || 0;
            const verts = portal.vertices || [
                { x: 0, y: 0, z: 0 },
                { x: 0, y: 0, z: 2.5 },
                { x: 2, y: 0, z: 2.5 },
                { x: 2, y: 0, z: 0 }
            ];

            xml += `
        <Item type="CMloPortalDef">
          <roomFrom value="${fromRoom}" />
          <roomTo value="${toRoom}" />
          <flags value="${flags}" />
          <mirrorPriority value="${mirrorPriority}" />
          <opacity value="${opacity}" />
          <vertices>`;

            verts.forEach(v => {
                xml += `
            <Item x="${v.x.toFixed(4)}" y="${v.y.toFixed(4)}" z="${v.z.toFixed(4)}" />`;
            });

            xml += `
          </vertices>
          <attachedObjects />
        </Item>`;
        });

        xml += `
      </portals>
      <entities>`;

        // Export Entities / Props
        (mloData.entities || []).forEach((entity, idx) => {
            const rot = entity.rot || { x: 0, y: 0, z: 0, w: 1 };
            const pos = entity.pos || { x: 0, y: 0, z: 0 };
            const scale = entity.scale || { x: 1, y: 1, z: 1 };
            const parentRoom = entity.room !== undefined ? entity.room : 0;
            const flags = entity.flags || 0;
            const lodDist = entity.lodDist || 100.0;

            xml += `
        <Item type="CMloEntityDef">
          <archetypeName>${entity.model}</archetypeName>
          <flags value="${flags}" />
          <guid value="${idx + 1}" />
          <position x="${pos.x.toFixed(4)}" y="${pos.y.toFixed(4)}" z="${pos.z.toFixed(4)}" />
          <rotation x="${rot.x.toFixed(6)}" y="${rot.y.toFixed(6)}" z="${rot.z.toFixed(6)}" w="${rot.w.toFixed(6)}" />
          <scaleXY value="${scale.x.toFixed(4)}" />
          <scaleZ value="${scale.z.toFixed(4)}" />
          <parentIndex value="${parentRoom}" />
          <lodDist value="${Number(lodDist).toFixed(8)}" />
          <childLodDist value="0.00000000" />
          <lodLevel>LODTYPES_DEPTH_HD</lodLevel>
          <numChildren value="0" />
          <priorityLevel>PRI_REQUIRED</priorityLevel>
          <extensions />
          <ambientOcclusionMultiplier value="255" />
          <artificialAmbientOcclusion value="255" />
          <tintValue value="0" />
        </Item>`;
        });

        xml += `
      </entities>
      <entitySets>`;

        // Export Entity Sets
        (mloData.entitySets || []).forEach(es => {
            xml += `
        <Item type="CMloEntitySet">
          <name>${es.name}</name>
          <locations />
          <entities>`;

            (es.entities || []).forEach(entIndex => {
                xml += `
            <Item value="${entIndex}" />`;
            });

            xml += `
          </entities>
        </Item>`;
        });

        xml += `
      </entitySets>
      <timeCycleModifiers />
    </Item>
  </archetypes>
  <name>${archName}</name>
</CMapTypes>`;

        return xml;
    }

    /**
     * Generates .ymap.xml (CMapData) CodeWalker File
     */
    static generateYmapXml(mloData) {
        const archName = (mloData.archetype || mloData.name || 'hei_dlc_mlo_custom').toLowerCase();
        const worldPos = mloData.position || { x: 0, y: 0, z: 0 };
        const worldRot = mloData.rotation || { x: 0, y: 0, z: 0, w: 1 };
        const bounds = this.calculateBounds(mloData.rooms, mloData.entities);

        const eMinX = (worldPos.x + bounds.bbMin.x - 5).toFixed(4);
        const eMinY = (worldPos.y + bounds.bbMin.y - 5).toFixed(4);
        const eMinZ = (worldPos.z + bounds.bbMin.z - 5).toFixed(4);
        const eMaxX = (worldPos.x + bounds.bbMax.x + 5).toFixed(4);
        const eMaxY = (worldPos.y + bounds.bbMax.y + 5).toFixed(4);
        const eMaxZ = (worldPos.z + bounds.bbMax.z + 5).toFixed(4);

        return `<?xml version="1.0" encoding="UTF-8"?>
<CMapData>
  <name>${archName}_instance</name>
  <parent />
  <flags value="0" />
  <contentFlags value="1" />
  <streamingExtentsMin x="${eMinX}" y="${eMinY}" z="${eMinZ}" />
  <streamingExtentsMax x="${eMaxX}" y="${eMaxY}" z="${eMaxZ}" />
  <entitiesExtentsMin x="${eMinX}" y="${eMinY}" z="${eMinZ}" />
  <entitiesExtentsMax x="${eMaxX}" y="${eMaxY}" z="${eMaxZ}" />
  <entities>
    <Item type="CMloInstanceDef">
      <archetypeName>${archName}</archetypeName>
      <flags value="0" />
      <guid value="10001" />
      <position x="${worldPos.x.toFixed(4)}" y="${worldPos.y.toFixed(4)}" z="${worldPos.z.toFixed(4)}" />
      <rotation x="${worldRot.x.toFixed(6)}" y="${worldRot.y.toFixed(6)}" z="${worldRot.z.toFixed(6)}" w="${worldRot.w.toFixed(6)}" />
      <scaleXY value="1.00000000" />
      <scaleZ value="1.00000000" />
      <parentIndex value="-1" />
      <lodDist value="500.00000000" />
      <childLodDist value="0.00000000" />
      <lodLevel>LODTYPES_DEPTH_HD</lodLevel>
      <numChildren value="0" />
      <priorityLevel>PRI_REQUIRED</priorityLevel>
      <extensions />
      <ambientOcclusionMultiplier value="255" />
      <artificialAmbientOcclusion value="255" />
      <tintValue value="0" />
      <groupId value="0" />
      <floorId value="0" />
      <defaultEntitySets />
      <numExitPortals value="${(mloData.portals || []).filter(p => p.fromRoom === 0 || p.toRoom === 0).length}" />
      <MLOInstflags value="0" />
    </Item>
  </entities>
  <containerLods />
  <boxOccluders />
  <occludeModels />
  <physicsDictionaries />
  <instancedData>
    <Item type="CGrassInstanceListDef" />
  </instancedData>
  <timeCycleModifiers />
  <carGenerators />
  <LODLightsSOA>
    <direction />
    <falloff />
    <falloffExponent />
    <timeAndStateFlags />
    <hash />
    <coneInnerAngle />
    <coneOuterAngleOrCapExt />
    <coronaIntensity />
  </LODLightsSOA>
  <DistantLODLightsSOA>
    <position />
    <RGBI />
    <numStreetLights value="0" />
    <category value="0" />
  </DistantLODLightsSOA>
  <interiorProxyOrder />
</CMapData>`;
    }
}

if (typeof module !== 'undefined') {
    module.exports = CodeWalkerXML;
}
