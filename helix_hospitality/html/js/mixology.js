// Ultra-Realistic Mixology Engine & Minigame Controller
let allRecipes = [];
let wholesaleSupply = {};
let selectedRecipe = null;
let currentVenueId = null;
let currentBarId = null;

let craftStep = 0; // 0: pouring, 1: shaking, 2: ready
let pourProgress = 0;
let pourInterval = null;
let qualityScore = 100;
let rhythmInterval = null;
let rhythmPos = 0;
let rhythmDirection = 1;
let currentShakerHits = 0;
const REQUIRED_SHAKER_HITS = 2;

let currentVolumeMl = 0;
let targetVolumeMl = 75;
let currentTempC = 18;
let currentDilution = 0;

window.initMixologyStation = function(venueId, barId, recipes, wholesale) {
  currentVenueId = venueId;
  currentBarId = barId;
  allRecipes = recipes || [];
  wholesaleSupply = wholesale || {};

  document.getElementById('stationVenueSubtitle').innerText = `${venueId.toUpperCase()} • BAR STATION #${barId}`;
  renderRecipeList(allRecipes);
  resetMixologyWorkspace();

  document.getElementById('mixologyStation').classList.remove('hidden');
};

function renderRecipeList(recipes) {
  const container = document.getElementById('recipeList');
  container.innerHTML = '';

  recipes.forEach(r => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => selectRecipe(r, card);

    card.innerHTML = `
      <div class="recipe-card-info">
        <h4>${r.label}</h4>
        <span>${r.category ? r.category.toUpperCase() : 'COCKTAIL'}</span>
      </div>
      <span class="recipe-card-price">$${r.basePrice || 35}</span>
    `;
    container.appendChild(card);
  });
}

function filterRecipes() {
  const q = document.getElementById('recipeSearchInput').value.toLowerCase();
  const filtered = allRecipes.filter(r => r.label.toLowerCase().includes(q) || (r.category && r.category.toLowerCase().includes(q)));
  renderRecipeList(filtered);
}

function switchRecipeTab(tab) {
  document.querySelectorAll('.recipe-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  if (tab === 'all') {
    renderRecipeList(allRecipes);
  } else {
    const filtered = allRecipes.filter(r => (r.category || 'cocktails').toLowerCase() === tab.toLowerCase());
    renderRecipeList(filtered);
  }
}

function resetMixologyWorkspace() {
  selectedRecipe = null;
  document.getElementById('mixologyEmptyState').classList.remove('hidden');
  document.getElementById('mixologyActiveCraft').classList.add('hidden');
  stopPouring();
  clearInterval(rhythmInterval);
}

function selectRecipe(recipe, cardElement) {
  selectedRecipe = recipe;
  document.querySelectorAll('.recipe-card').forEach(c => c.classList.remove('active'));
  if (cardElement) cardElement.classList.add('active');

  document.getElementById('mixologyEmptyState').classList.add('hidden');
  document.getElementById('mixologyActiveCraft').classList.remove('hidden');

  document.getElementById('craftDrinkTitle').innerText = recipe.label;
  document.getElementById('craftCategoryBadge').innerText = recipe.category || 'Cocktail';
  document.getElementById('craftBuffBadge').innerHTML = `<i class="fa-solid fa-bolt"></i> +${(recipe.buffType || 'Stamina').toUpperCase()}`;
  document.getElementById('craftGlassBadge').innerHTML = `<i class="fa-solid fa-wine-glass"></i> ${(recipe.glassType || 'Coupe').toUpperCase()}`;

  // Reset Telemetry
  currentVolumeMl = 0;
  targetVolumeMl = 0;
  (recipe.ingredients || []).forEach(ing => { targetVolumeMl += (ing.amount || 30); });
  if (targetVolumeMl === 0) targetVolumeMl = 75;

  currentTempC = 18;
  currentDilution = 0;
  updateTelemetry();

  // Glass Structure setup
  const glassUnit = document.getElementById('glassUnit');
  const glassType = recipe.glassType || 'coupe';
  glassUnit.className = `glass-unit ${glassType}`;

  // Reset rim dressing
  const rimEl = document.getElementById('glassRimDressing');
  rimEl.className = 'glass-rim-dressing';
  if (recipe.garnish === 'margarita_salt') rimEl.classList.add('salt');
  else if (recipe.garnish === 'cane_sugar_rim') rimEl.classList.add('sugar');
  else if (recipe.garnish === 'crushed_peppermint') rimEl.classList.add('peppermint');

  // Garnish Display
  renderPhysicalGarnish(recipe.garnish);

  // Reset liquid & meter
  const glassLiquid = document.getElementById('glassLiquid');
  glassLiquid.style.height = '0%';
  const liquidColor = recipe.color || 'rgba(255, 42, 127, 0.85)';
  glassLiquid.style.background = `linear-gradient(180deg, ${liquidColor}, rgba(20, 20, 30, 0.95))`;

  // Update stream color
  const liquidStream = document.getElementById('liquidStream');
  if (liquidStream) {
    liquidStream.style.background = `linear-gradient(180deg, #fff, ${liquidColor})`;
  }

  document.getElementById('pourMeterFill').style.width = '0%';
  pourProgress = 0;
  qualityScore = 100;
  craftStep = 0;
  currentShakerHits = 0;

  // Render Ingredients summary chips
  const ingSummary = document.getElementById('craftIngredientsSummary');
  ingSummary.innerHTML = '';
  (recipe.ingredients || []).forEach(ing => {
    const chip = document.createElement('div');
    chip.className = 'ing-pill';
    chip.innerHTML = `<i class="fa-solid fa-bottle-droplet"></i> ${ing.label || ing.item} (${ing.amount || 30}ml)`;
    ingSummary.appendChild(chip);
  });

  // Reset views
  document.getElementById('pourBottleVisual').classList.add('hidden');
  document.getElementById('cobblerShakerVisual').classList.add('hidden');
  document.getElementById('glassUnit').classList.remove('hidden');

  document.getElementById('btnHoldPour').classList.remove('hidden');
  document.getElementById('btnShakerRhythm').classList.add('hidden');
  document.getElementById('shakerRhythmContainer').classList.add('hidden');
  document.getElementById('btnFinishCraft').disabled = true;

  if (recipe.ingredients && recipe.ingredients[0]) {
    const firstLabel = recipe.ingredients[0].label || recipe.ingredients[0].item;
    document.getElementById('currentIngredientLabel').innerText = `Current: ${firstLabel}`;
    document.getElementById('bottleLabelText').innerText = firstLabel.toUpperCase().substring(0, 12);
  }

  // Play bottle uncork sound
  if (window.mixologyAudio) {
    window.mixologyAudio.playCorkPop();
  }
}

function renderPhysicalGarnish(garnishKey) {
  const container = document.getElementById('glassGarnishDisplay');
  container.innerHTML = '';

  if (!garnishKey) return;

  if (garnishKey === 'cocktail_olives') {
    container.innerHTML = `
      <div class="garnish-olive-pick">
        <div class="olive-node"><div class="olive-pimento"></div></div>
        <div class="olive-node"><div class="olive-pimento"></div></div>
        <div class="olive-node"><div class="olive-pimento"></div></div>
        <div class="metal-pick-stem"></div>
      </div>
    `;
  } else if (garnishKey === 'fresh_mint_sprig') {
    container.innerHTML = `<i class="fa-solid fa-seedling garnish-mint-sprig"></i>`;
  } else if (garnishKey === 'cocktail_umbrellas') {
    container.innerHTML = `<i class="fa-solid fa-umbrella-beach garnish-umbrella"></i>`;
  } else if (garnishKey === 'maraschino_cherries') {
    container.innerHTML = `<i class="fa-solid fa-apple-whole" style="color: #c62828; font-size: 26px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.7));"></i>`;
  }
}

function updateTelemetry() {
  document.getElementById('telemetryVolume').innerText = `${Math.round(currentVolumeMl)} / ${targetVolumeMl} ml`;
  document.getElementById('telemetryDilution').innerText = `${Math.round(currentDilution)}%`;
  document.getElementById('telemetryTemp').innerText = `${Math.round(currentTempC)}°C`;
  document.getElementById('currentIngredientRatio').innerText = `${Math.round(currentVolumeMl)} ml / ${targetVolumeMl} ml`;
}

// ============================================================================
// POURING MINIGAME WITH REALISTIC AUDIO & VISUAL STREAM
// ============================================================================
function startPouring() {
  if (!selectedRecipe || craftStep !== 0) return;
  clearInterval(pourInterval);

  // Show bottle pouring animation
  document.getElementById('pourBottleVisual').classList.remove('hidden');

  // Start sound stream
  if (window.mixologyAudio) {
    window.mixologyAudio.startPourSound();
  }

  pourInterval = setInterval(() => {
    if (pourProgress < 100) {
      pourProgress += 1.5;
      currentVolumeMl = (pourProgress / 100) * targetVolumeMl;
      
      document.getElementById('pourMeterFill').style.width = `${pourProgress}%`;
      document.getElementById('glassLiquid').style.height = `${pourProgress * 0.85}%`;

      // Ice cube clink trigger occasionally
      if (Math.random() < 0.08 && window.mixologyAudio) {
        window.mixologyAudio.playIceClink();
      }

      updateTelemetry();
    } else {
      stopPouring();
    }
  }, 30);
}

function stopPouring() {
  if (!pourInterval) return;
  clearInterval(pourInterval);
  pourInterval = null;

  // Hide bottle stream
  document.getElementById('pourBottleVisual').classList.add('hidden');

  // Stop sound stream
  if (window.mixologyAudio) {
    window.mixologyAudio.stopPourSound();
  }

  if (!selectedRecipe || craftStep !== 0) return;

  // Sweetspot is 72% to 88%
  if (pourProgress >= 72 && pourProgress <= 88) {
    qualityScore += 5;
  } else {
    const penalty = Math.abs(80 - pourProgress) * 0.85;
    qualityScore = Math.max(20, qualityScore - penalty);
  }

  if (selectedRecipe.shaken) {
    craftStep = 1;
    document.getElementById('btnHoldPour').classList.add('hidden');
    document.getElementById('btnShakerRhythm').classList.remove('hidden');
    document.getElementById('shakerRhythmContainer').classList.remove('hidden');
    document.getElementById('currentIngredientLabel').innerText = 'Step 2: Shake with Cobbler Shaker to aerate & chill!';

    // Show shaker visual
    document.getElementById('glassUnit').classList.add('hidden');
    document.getElementById('cobblerShakerVisual').classList.remove('hidden');
    document.getElementById('shakerFrostOverlay').style.opacity = '0';

    startShakerRhythm();
  } else {
    craftStep = 2;
    document.getElementById('currentIngredientLabel').innerText = 'Drink poured and ready to serve!';
    document.getElementById('btnFinishCraft').disabled = false;
  }
}

// ============================================================================
// COBBLER SHAKER RHYTHM AERATION & FROST ENGINE
// ============================================================================
function startShakerRhythm() {
  clearInterval(rhythmInterval);
  rhythmPos = 0;
  rhythmDirection = 1;

  rhythmInterval = setInterval(() => {
    rhythmPos += rhythmDirection * 3.5;
    if (rhythmPos >= 92) {
      rhythmPos = 92;
      rhythmDirection = -1;
    } else if (rhythmPos <= 0) {
      rhythmPos = 0;
      rhythmDirection = 1;
    }
    document.getElementById('rhythmBeat').style.left = `${rhythmPos}%`;
  }, 20);
}

function hitShakerBeat() {
  if (craftStep !== 1) return;

  // Target window is 42% to 65%
  const isHit = rhythmPos >= 42 && rhythmPos <= 65;
  currentShakerHits++;

  // Play metallic shaker sound
  if (window.mixologyAudio) {
    window.mixologyAudio.playShakerRattle();
  }

  // Chill telemetry & Increase frost condensation
  currentTempC = Math.max(2, currentTempC - 5.5);
  currentDilution = Math.min(24, currentDilution + 6);
  updateTelemetry();

  const frostOpacity = (currentShakerHits / REQUIRED_SHAKER_HITS) * 0.9;
  document.getElementById('shakerFrostOverlay').style.opacity = frostOpacity;

  if (isHit) {
    qualityScore = Math.min(100, qualityScore + 4);
  } else {
    qualityScore = Math.max(30, qualityScore - 8);
  }

  document.getElementById('rhythmStreakCounter').innerText = `Aeration: ${currentShakerHits}/${REQUIRED_SHAKER_HITS} Beats`;

  if (currentShakerHits >= REQUIRED_SHAKER_HITS) {
    clearInterval(rhythmInterval);
    craftStep = 2;
    document.getElementById('btnShakerRhythm').classList.add('hidden');
    document.getElementById('shakerRhythmContainer').classList.add('hidden');
    document.getElementById('currentIngredientLabel').innerText = 'Chilled and aerated to perfection!';

    // Restore glass view
    document.getElementById('cobblerShakerVisual').classList.add('hidden');
    document.getElementById('glassUnit').classList.remove('hidden');
    document.getElementById('btnFinishCraft').disabled = false;
  }
}

// Keyboard SPACEBAR trigger for Shaker Rhythm
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && craftStep === 1) {
    e.preventDefault();
    hitShakerBeat();
  }
});

// ============================================================================
// COMPLETE & SERVE COCKTAIL
// ============================================================================
function finishCrafting() {
  if (!selectedRecipe || craftStep !== 2) return;

  // Play success sound
  if (window.mixologyAudio) {
    window.mixologyAudio.playSuccessChime();
  }

  fetch(`https://${GetParentResourceName()}/start_crafting_drink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: currentVenueId,
      barId: currentBarId,
      recipeId: selectedRecipe.id,
      qualityScore: qualityScore,
      shaken: selectedRecipe.shaken || false,
      customDrink: selectedRecipe.isCustom ? selectedRecipe : null
    })
  }).then(() => {
    closeAllUI();
  }).catch(() => {});
}
