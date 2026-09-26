// City Underground - Master UI Controller & State Manager
window.CityUndergroundCore = {
  activeState: {
    character: {
      id: 'char_local_1',
      firstName: 'Marcus',
      lastName: 'Vance',
      cash: 500,
      bank: 2500,
      job: 'citizen',
      health: 100,
      hunger: 92,
      thirst: 85
    },
    inventory: [
      { id: 'item_1', itemType: 'food_sandwich', count: 2, slot: 1 },
      { id: 'item_2', itemType: 'drink_water', count: 2, slot: 2 },
      { id: 'item_3', itemType: 'phone', count: 1, slot: 3 },
      { id: 'item_4', itemType: 'contraband_reagents', count: 2, slot: 4 },
      { id: 'item_5', itemType: 'botany_seed', count: 3, slot: 5 }
    ],
    weight: 3.0,
    maxWeight: 35.0
  },

  init() {
    console.log("[CityUnderground] Initializing UI Controller...");

    // Initialize Submodules
    window.CharCreator?.init();
    window.Inventory?.init();
    window.Banking?.init();
    window.Chat?.init();
    window.RadialMenu?.init();
    window.VoiceRadio?.init();
    window.MapSpawner?.init();
    window.BaseBuilder?.init();
    window.CitySimulator?.init();

    // Keybindings
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;

      if (key === 'i') {
        this.toggleModal('modal-inventory');
      } else if (key === 'b') {
        this.toggleModal('modal-banking');
      } else if (key === 'm') {
        this.toggleModal('modal-mdt');
      } else if (key === 'h') {
        window.BaseBuilder?.toggle();
      } else if (key === 'k') {
        window.SkillsUI?.open();
      } else if (key === 'f9') {
        window.MapSpawner?.toggle();
      } else if (key === 'f10') {
        this.toggleModal('modal-admin');
      }
    });

    // Listen to HELIX NUI message events
    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || !data.action) return;
      this.handleServerMessage(data.action, data.payload);
    });

    // Initial HUD update
    window.HUD?.updateStats(this.activeState.character);
    window.Inventory?.updateData(this.activeState.inventory, this.activeState.weight, this.activeState.maxWeight);

    window.Chat?.addMessage('SYS', 'SYSTEM', 'Welcome to City Underground - New Harbor Metro District.');
    window.Chat?.addMessage('SYS', 'TIPS', 'Controls: [W/A/S/D] Walk, [E] Interact, [H] Sims Base Builder, [I] Inventory, [B] Bank, [C] Radial, [K] Skills, [F9] Spawner Tool, [F10] Admin.');
  },

  toggleModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.toggle('hidden');
    }
  },

  sendEvent(eventName, payload) {
    console.log(`[CityUnderground NUI] Dispatching event: ${eventName}`, payload);

    if (window.nuiMessage) {
      window.nuiMessage(eventName, payload);
    }

    this.handleSimulationResponse(eventName, payload);
  },

  sendChatMessage(text) {
    this.sendEvent('CU_Chat_SendMessage', { text });
  },

  handleServerMessage(action, payload) {
    if (action === 'CU_Char_SyncStats') {
      this.activeState.character = payload;
      window.HUD?.updateStats(payload);
    } else if (action === 'CU_Inv_Sync') {
      this.activeState.inventory = payload.items;
      this.activeState.weight = payload.weight;
      window.Inventory?.updateData(payload.items, payload.weight, payload.maxWeight);
    } else if (action === 'CU_Police_DispatchAlert') {
      window.PoliceMDT?.showDispatchAlert(payload);
    }
  },

  handleSimulationResponse(eventName, payload) {
    if (eventName === 'CU_Econ_Deposit') {
      const amt = parseInt(payload);
      if (this.activeState.character.cash >= amt) {
        this.activeState.character.cash -= amt;
        this.activeState.character.bank += amt;
        window.HUD?.updateStats(this.activeState.character);
        window.Chat?.addMessage('LOCAL', 'First Trust ATM', `Deposited $${amt.toLocaleString()} into Bank.`);
      }
    } else if (eventName === 'CU_Econ_Withdraw') {
      const amt = parseInt(payload);
      if (this.activeState.character.bank >= amt) {
        this.activeState.character.bank -= amt;
        this.activeState.character.cash += amt;
        window.HUD?.updateStats(this.activeState.character);
        window.Chat?.addMessage('LOCAL', 'First Trust ATM', `Withdrew $${amt.toLocaleString()} from Bank.`);
      }
    } else if (eventName === 'CU_Police_ToggleDuty') {
      const isCop = this.activeState.character.job === 'police';
      this.activeState.character.job = isCop ? 'citizen' : 'police';
      window.HUD?.updateStats(this.activeState.character);
      window.Chat?.addMessage('SYS', 'POLICE DEPT', isCop ? 'Clocked off duty.' : 'Clocked ON DUTY as Metro Police Officer.');
    } else if (eventName === 'CU_Job_StartDelivery') {
      const dest = { destinationName: "First Trust Bank Lobby", basePayout: 200, bonus: 75 };
      window.HUD?.setObjective(dest);
      this.activeState.inventory.push({ id: 'pkg_' + Date.now(), itemType: 'delivery_parcel', count: 1, slot: 6 });
      window.Inventory?.updateData(this.activeState.inventory, 7.0, 35.0);
      window.Chat?.addMessage('SYS', 'DISPATCH', 'Delivery mission accepted! Transport package to First Trust Bank.');
    } else if (eventName === 'CU_Crime_StartSynthesis') {
      window.CrimeLab?.updateProgress(true, 5);
      setTimeout(() => {
        window.CrimeLab?.updateProgress(false, 0);
        this.activeState.inventory.push({ id: 'crys_' + Date.now(), itemType: 'contraband_crystals', count: 2, slot: 7 });
        window.Inventory?.updateData(this.activeState.inventory, 3.6, 35.0);
        window.Chat?.addMessage('SYS', 'SYNTH LAB', 'Chemical synthesis completed: Refined Starlight Crystals x2 produced!');
      }, 5000);
    } else if (eventName === 'CU_Crime_SellToBuyer') {
      this.activeState.character.cash += 450;
      window.HUD?.updateStats(this.activeState.character);
      window.Chat?.addMessage('LOCAL', 'Street Buyer', 'Deal confirmed. Paid $450 cash for Starlight Crystals.');
      if (Math.random() < 0.4) {
        window.PoliceMDT?.showDispatchAlert("911 DISPATCH: Suspicious contraband transaction reported in back alley!");
      }
    } else if (eventName === 'CU_Veh_Buy') {
      this.activeState.character.bank -= 3500;
      window.HUD?.updateStats(this.activeState.character);
      window.Chat?.addMessage('SYS', 'METRO MOTORS', 'Vehicle purchased! Ready for retrieval in garage.');
      window.CitySimulator.player.inVehicle = true;
    } else if (eventName === 'CU_Prop_Buy') {
      this.activeState.character.bank -= 12000;
      window.HUD?.updateStats(this.activeState.character);
      window.Chat?.addMessage('SYS', 'HARBORVIEW REALTY', 'Apartment 101 purchased successfully! Door keys registered.');
    } else if (eventName === 'CU_Chat_SendMessage') {
      const text = payload.text || '';
      if (text.startsWith('/me ')) {
        window.Chat?.addMessage('ME', '', `*** ${this.activeState.character.firstName} ${this.activeState.character.lastName} ${text.substring(4)}`);
      } else if (text.startsWith('/do ')) {
        window.Chat?.addMessage('DO', '', `* ${text.substring(4)} (( ${this.activeState.character.firstName} ${this.activeState.character.lastName} ))`);
      } else if (text.startsWith('/ooc ') || text.startsWith('// ')) {
        const msg = text.startsWith('// ') ? text.substring(3) : text.substring(5);
        window.Chat?.addMessage('OOC', `[OOC] ${this.activeState.character.firstName}`, msg);
      } else {
        window.Chat?.addMessage('LOCAL', `${this.activeState.character.firstName} ${this.activeState.character.lastName}`, text);
      }
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.CityUndergroundCore.init();
});
