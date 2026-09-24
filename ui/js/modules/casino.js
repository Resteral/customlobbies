// Velvet Lounge Casino & Blackjack Dealer Module
window.Casino = {
  currentBet: 100,
  playerHand: [],
  dealerHand: [],
  isRoundActive: false,

  open() {
    document.getElementById('modal-casino')?.classList.remove('hidden');
    this.resetRound();
  },

  close() {
    document.getElementById('modal-casino')?.classList.add('hidden');
  },

  dealCard() {
    const cards = [
      { val: 2, label: '2' }, { val: 3, label: '3' }, { val: 4, label: '4' },
      { val: 5, label: '5' }, { val: 6, label: '6' }, { val: 7, label: '7' },
      { val: 8, label: '8' }, { val: 9, label: '9' }, { val: 10, label: '10' },
      { val: 10, label: 'J' }, { val: 10, label: 'Q' }, { val: 10, label: 'K' },
      { val: 11, label: 'A' }
    ];
    return cards[Math.floor(Math.random() * cards.length)];
  },

  calculateScore(hand) {
    let score = hand.reduce((acc, c) => acc + c.val, 0);
    let aces = hand.filter(c => c.label === 'A').length;
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  },

  startRound() {
    const char = window.CityUndergroundCore.activeState.character;
    const betInput = parseInt(document.getElementById('casino-bet-input')?.value || 100);
    if (char.cash < betInput) {
      alert("You don't have enough cash on hand to cover this bet!");
      return;
    }

    char.cash -= betInput;
    this.currentBet = betInput;
    this.isRoundActive = true;

    this.playerHand = [this.dealCard(), this.dealCard()];
    this.dealerHand = [this.dealCard(), this.dealCard()];

    window.HUD?.updateStats(char);
    this.render();

    // Check Natural Blackjack
    if (this.calculateScore(this.playerHand) === 21) {
      this.endRound("Natural 21 Blackjack! You win 3:2 payout!", this.currentBet * 2.5);
    }
  },

  hit() {
    if (!this.isRoundActive) return;
    this.playerHand.push(this.dealCard());
    this.render();

    const pScore = this.calculateScore(this.playerHand);
    if (pScore > 21) {
      this.endRound("Bust! Hand exceeded 21. Dealer takes the pot.", 0);
    }
  },

  stand() {
    if (!this.isRoundActive) return;

    // Dealer hits until >= 17
    while (this.calculateScore(this.dealerHand) < 17) {
      this.dealerHand.push(this.dealCard());
    }

    const pScore = this.calculateScore(this.playerHand);
    const dScore = this.calculateScore(this.dealerHand);

    if (dScore > 21) {
      this.endRound("Dealer Busts! You win 1:1 payout!", this.currentBet * 2);
    } else if (pScore > dScore) {
      this.endRound(`You Win (${pScore} vs ${dScore})!`, this.currentBet * 2);
    } else if (pScore === dScore) {
      this.endRound(`Push (${pScore} vs ${dScore})! Bet returned.`, this.currentBet);
    } else {
      this.endRound(`Dealer Wins (${dScore} vs ${pScore})!`, 0);
    }
  },

  endRound(message, payout) {
    this.isRoundActive = false;
    const char = window.CityUndergroundCore.activeState.character;
    if (payout > 0) {
      char.cash += payout;
      window.HUD?.updateStats(char);
    }
    this.render(true);
    document.getElementById('casino-status-text').textContent = message;
  },

  resetRound() {
    this.isRoundActive = false;
    this.playerHand = [];
    this.dealerHand = [];
    document.getElementById('casino-status-text').textContent = "Place your bet and press [Deal Cards] to begin.";
    document.getElementById('casino-player-cards').innerHTML = '';
    document.getElementById('casino-dealer-cards').innerHTML = '';
  },

  render(showDealerHidden = false) {
    const pContainer = document.getElementById('casino-player-cards');
    const dContainer = document.getElementById('casino-dealer-cards');
    if (!pContainer || !dContainer) return;

    pContainer.innerHTML = '';
    dContainer.innerHTML = '';

    // Render Player Hand
    this.playerHand.forEach(c => {
      pContainer.appendChild(this.createCardElement(c.label));
    });
    document.getElementById('casino-player-score').textContent = `Score: ${this.calculateScore(this.playerHand)}`;

    // Render Dealer Hand
    this.dealerHand.forEach((c, idx) => {
      if (idx === 1 && this.isRoundActive && !showDealerHidden) {
        dContainer.appendChild(this.createCardElement('🂠', true));
      } else {
        dContainer.appendChild(this.createCardElement(c.label));
      }
    });

    const dScore = (this.isRoundActive && !showDealerHidden) ? this.dealerHand[0]?.val : this.calculateScore(this.dealerHand);
    document.getElementById('casino-dealer-score').textContent = `Score: ${dScore || 0}`;
  },

  createCardElement(label, isHidden = false) {
    const card = document.createElement('div');
    card.className = 'casino-card';
    card.textContent = label;
    if (isHidden) card.style.background = '#334155';
    return card;
  }
};
