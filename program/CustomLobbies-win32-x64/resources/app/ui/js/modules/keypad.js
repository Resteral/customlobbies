// Electronic Keypad Security Terminal Module
window.KeypadTerminal = {
  currentPin: "1234",
  enteredCode: "",
  targetObjectId: null,
  onUnlockCallback: null,

  open(objectId = 'door_1', currentPin = "1234", onUnlock = null) {
    this.targetObjectId = objectId;
    this.currentPin = currentPin || "1234";
    this.enteredCode = "";
    this.onUnlockCallback = onUnlock;

    document.getElementById('modal-keypad')?.classList.remove('hidden');
    this.updateDisplay();
  },

  close() {
    document.getElementById('modal-keypad')?.classList.add('hidden');
  },

  pressKey(digit) {
    if (this.enteredCode.length < 4) {
      this.enteredCode += digit.toString();
      this.updateDisplay();
    }
  },

  clear() {
    this.enteredCode = "";
    this.updateDisplay();
  },

  submit() {
    const statusEl = document.getElementById('keypad-status-text');

    if (this.enteredCode === this.currentPin) {
      if (statusEl) {
        statusEl.textContent = "ACCESS GRANTED - UNLOCKING";
        statusEl.style.color = "var(--accent-emerald)";
      }

      setTimeout(() => {
        alert("🔓 Keypad PIN accepted. Security door unlocked!");
        if (this.onUnlockCallback) this.onUnlockCallback();
        this.close();
      }, 400);
    } else {
      if (statusEl) {
        statusEl.textContent = "ACCESS DENIED - INVALID PIN";
        statusEl.style.color = "var(--accent-danger)";
      }
      this.enteredCode = "";
      setTimeout(() => {
        this.updateDisplay();
      }, 800);
    }
  },

  setNewPin() {
    const newPin = prompt("Enter a new 4-digit security PIN code for this door/gate:", this.currentPin);
    if (newPin && newPin.length === 4 && !isNaN(newPin)) {
      this.currentPin = newPin;
      alert(`Security PIN updated to: ${newPin}`);
    } else if (newPin) {
      alert("PIN must be exactly 4 numeric digits!");
    }
  },

  bypassWithLockpick() {
    this.close();
    window.LockpickMinigame?.open(() => {
      alert("🔓 Security keypad successfully bypassed via lockpick tension!");
    });
  },

  updateDisplay() {
    const disp = document.getElementById('keypad-code-display');
    const statusEl = document.getElementById('keypad-status-text');

    if (disp) {
      disp.textContent = this.enteredCode ? "*".repeat(this.enteredCode.length) : "----";
    }
    if (statusEl && (!statusEl.textContent.includes('ACCESS') || this.enteredCode.length === 0)) {
      statusEl.textContent = "ENTER 4-DIGIT SECURITY PIN";
      statusEl.style.color = "var(--text-muted)";
    }
  }
};
