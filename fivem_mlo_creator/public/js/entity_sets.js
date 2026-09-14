/**
 * MLO Entity Sets Manager
 * Controls switchable interior prop sets and generates FiveM runtime toggle Lua scripts.
 */

class EntitySetsManager {
    constructor() {
        this.entitySets = [];
    }

    getEntitySets() {
        return this.entitySets;
    }

    addEntitySet(name = '') {
        const setName = name || `entity_set_${this.entitySets.length + 1}`;
        const newSet = {
            name: setName,
            entities: [],
            active: true // Preview state
        };
        this.entitySets.push(newSet);
        return newSet;
    }

    removeEntitySet(index) {
        if (this.entitySets[index]) {
            this.entitySets.splice(index, 1);
            return true;
        }
        return false;
    }

    toggleEntityInSet(setIndex, entityIndex) {
        const set = this.entitySets[setIndex];
        if (!set) return;

        const idx = set.entities.indexOf(entityIndex);
        if (idx > -1) {
            set.entities.splice(idx, 1);
        } else {
            set.entities.push(entityIndex);
            set.entities.sort((a, b) => a - b);
        }
    }

    isEntityInSet(setIndex, entityIndex) {
        const set = this.entitySets[setIndex];
        return set ? set.entities.includes(entityIndex) : false;
    }

    setEntitySets(sets) {
        this.entitySets = sets || [];
    }
}

if (typeof module !== 'undefined') {
    module.exports = EntitySetsManager;
}
