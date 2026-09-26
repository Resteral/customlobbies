/**
 * Paradise Coast RP - Interactive Server Tools
 * Penal Code Calculator, Drug / Crafting Calculator, and Interactive Keybind Matrix
 */

class WikiTools {
  constructor() {
    this.selectedCharges = []; // { code, qty }
    this.guiltyPlea = false;
    this.firstOffender = false;
    this.cooperation = false;
  }

  // ==========================================
  // 1. PCPD Penal Code & Arrest Calculator
  // ==========================================
  renderPenalCalculator(container) {
    const penalCodes = window.wikiStorage.getPenalCodes();
    
    // Group by category
    const categories = [...new Set(penalCodes.map(p => p.category))];

    container.innerHTML = `
      <div class="tool-view-card">
        <div class="tool-header">
          <div class="tool-badge">⚖️ PCPD & DOJ TOOL</div>
          <h2>Penal Code & Arrest Sentencing Calculator</h2>
          <p>Search official Paradise Coast penal codes, stack multiple offenses, calculate jail time, fines, and apply standard plea reductions.</p>
        </div>

        <div class="calc-grid-layout">
          <!-- Left Column: Search & Charge Selector -->
          <div class="calc-selector-panel">
            <div class="calc-search-box">
              <input type="text" id="penal-search-input" placeholder="🔍 Search penal code or offense name..." />
              <select id="penal-cat-filter">
                <option value="all">All Categories</option>
                ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>

            <div class="penal-codes-scroll-list" id="penal-codes-list">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- Right Column: Arrest Docket / Summary -->
          <div class="calc-docket-panel">
            <div class="docket-header">
              <h3>📋 Active Arrest Docket</h3>
              <button class="clear-docket-btn" id="clear-docket-btn">Clear All</button>
            </div>

            <div class="suspect-info-inputs">
              <input type="text" id="docket-suspect-name" placeholder="Suspect IC Name" />
              <input type="text" id="docket-officer-name" placeholder="Arresting Officer & Badge #" />
            </div>

            <div class="docket-items-list" id="docket-items-list">
              <div class="docket-empty-msg">No charges selected. Click an offense from the list on the left.</div>
            </div>

            <!-- Plea Reductions -->
            <div class="docket-reductions-section">
              <h4>Sentence Reductions & Mitigations</h4>
              <label class="reduction-toggle">
                <input type="checkbox" id="reduc-guilty-plea" />
                <span>Guilty Plea Deal (-20% Months & Fines)</span>
              </label>
              <label class="reduction-toggle">
                <input type="checkbox" id="reduc-first-offense" />
                <span>First-Time Offender (-15% Months)</span>
              </label>
              <label class="reduction-toggle">
                <input type="checkbox" id="reduc-cooperation" />
                <span>Cooperated with Investigation (-10% Months)</span>
              </label>
            </div>

            <!-- Totals -->
            <div class="docket-summary-box">
              <div class="summary-row">
                <span>Total Charges Count:</span>
                <strong id="summary-charge-count">0</strong>
              </div>
              <div class="summary-row">
                <span>Base Fine:</span>
                <strong id="summary-base-fine">$0</strong>
              </div>
              <div class="summary-row">
                <span>Base Jail Sentence:</span>
                <strong id="summary-base-months">0 Months</strong>
              </div>
              <div class="summary-row highlight-fine">
                <span>Final Fine (After Reductions):</span>
                <strong id="summary-final-fine">$0</strong>
              </div>
              <div class="summary-row highlight-jail">
                <span>Final Jail Time:</span>
                <strong id="summary-final-months">0 Months</strong>
              </div>
              <div class="summary-row">
                <span>Driver License Points:</span>
                <strong id="summary-points">0 Pts</strong>
              </div>
            </div>

            <div class="docket-actions">
              <button class="primary-tool-btn" id="copy-mdt-report-btn">📄 Copy MDT Report</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindPenalCalculatorEvents(container);
    this.renderPenalCodesList();
    this.updateDocketUI();
  }

  bindPenalCalculatorEvents(container) {
    const searchInp = container.querySelector('#penal-search-input');
    const catFilter = container.querySelector('#penal-cat-filter');

    const doFilter = () => {
      const q = searchInp.value.toLowerCase().trim();
      const cat = catFilter.value;
      this.renderPenalCodesList(q, cat);
    };

    searchInp.addEventListener('input', doFilter);
    catFilter.addEventListener('change', doFilter);

    container.querySelector('#clear-docket-btn').addEventListener('click', () => {
      this.selectedCharges = [];
      this.updateDocketUI();
    });

    container.querySelector('#reduc-guilty-plea').addEventListener('change', (e) => {
      this.guiltyPlea = e.target.checked;
      this.updateDocketUI();
    });

    container.querySelector('#reduc-first-offense').addEventListener('change', (e) => {
      this.firstOffender = e.target.checked;
      this.updateDocketUI();
    });

    container.querySelector('#reduc-cooperation').addEventListener('change', (e) => {
      this.cooperation = e.target.checked;
      this.updateDocketUI();
    });

    container.querySelector('#copy-mdt-report-btn').addEventListener('click', () => {
      this.copyMdtReport(container);
    });
  }

  renderPenalCodesList(filterQuery = '', filterCategory = 'all') {
    const listEl = document.getElementById('penal-codes-list');
    if (!listEl) return;

    const penalCodes = window.wikiStorage.getPenalCodes();
    const filtered = penalCodes.filter(p => {
      const matchCat = filterCategory === 'all' || p.category === filterCategory;
      const matchQuery = !filterQuery || 
        p.code.toLowerCase().includes(filterQuery) || 
        p.title.toLowerCase().includes(filterQuery) ||
        p.severity.toLowerCase().includes(filterQuery);
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="p-4 text-center text-muted">No penal codes matching your query.</div>`;
      return;
    }

    listEl.innerHTML = filtered.map(p => {
      const severityClass = p.severity.toLowerCase().includes('capital') ? 'sev-capital' :
                            p.severity.toLowerCase().includes('class a') ? 'sev-class-a' :
                            p.severity.toLowerCase().includes('felony') ? 'sev-felony' :
                            p.severity.toLowerCase().includes('misdemeanor') ? 'sev-misdemeanor' : 'sev-infraction';
      return `
        <div class="penal-item-card" data-code="${p.code}">
          <div class="penal-item-top">
            <span class="penal-code-tag">${p.code}</span>
            <span class="penal-sev-badge ${severityClass}">${p.severity}</span>
            <span class="penal-cat-pill">${p.category}</span>
          </div>
          <div class="penal-item-title">${p.title}</div>
          <div class="penal-item-stats">
            <span>💵 Fine: $${p.fine.toLocaleString()}</span>
            <span>⏱️ Jail: ${p.jailMonths} Months</span>
            ${p.points > 0 ? `<span>⚠️ Points: ${p.points}</span>` : ''}
          </div>
          <button class="add-charge-btn" onclick="window.wikiTools.addCharge('${p.code}')">+ Add Charge</button>
        </div>
      `;
    }).join('');
  }

  addCharge(code) {
    const existing = this.selectedCharges.find(c => c.code === code);
    if (existing) {
      existing.qty += 1;
    } else {
      this.selectedCharges.push({ code, qty: 1 });
    }
    this.updateDocketUI();
  }

  removeCharge(code) {
    this.selectedCharges = this.selectedCharges.filter(c => c.code !== code);
    this.updateDocketUI();
  }

  changeChargeQty(code, delta) {
    const item = this.selectedCharges.find(c => c.code === code);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      this.removeCharge(code);
    } else {
      this.updateDocketUI();
    }
  }

  updateDocketUI() {
    const docketEl = document.getElementById('docket-items-list');
    if (!docketEl) return;

    const penalCodes = window.wikiStorage.getPenalCodes();

    if (this.selectedCharges.length === 0) {
      docketEl.innerHTML = `<div class="docket-empty-msg">No charges selected. Click an offense on the left to add it to this docket.</div>`;
    } else {
      docketEl.innerHTML = this.selectedCharges.map(sc => {
        const p = penalCodes.find(item => item.code === sc.code);
        if (!p) return '';
        const itemTotalFine = p.fine * sc.qty;
        const itemTotalMonths = p.jailMonths * sc.qty;

        return `
          <div class="docket-item-row">
            <div class="docket-item-details">
              <div class="docket-item-title"><strong>${p.code}</strong> - ${p.title}</div>
              <div class="docket-item-sub">$${p.fine.toLocaleString()} / ${p.jailMonths}m per count</div>
            </div>
            <div class="docket-qty-controls">
              <button class="qty-btn" onclick="window.wikiTools.changeChargeQty('${sc.code}', -1)">-</button>
              <span class="qty-num">${sc.qty}x</span>
              <button class="qty-btn" onclick="window.wikiTools.changeChargeQty('${sc.code}', 1)">+</button>
              <button class="remove-docket-btn" onclick="window.wikiTools.removeCharge('${sc.code}')">✕</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Calculations
    let totalCount = 0;
    let baseFine = 0;
    let baseMonths = 0;
    let totalPoints = 0;

    this.selectedCharges.forEach(sc => {
      const p = penalCodes.find(item => item.code === sc.code);
      if (p) {
        totalCount += sc.qty;
        baseFine += p.fine * sc.qty;
        baseMonths += p.jailMonths * sc.qty;
        totalPoints += (p.points || 0) * sc.qty;
      }
    });

    let fineMultiplier = 1.0;
    let monthsMultiplier = 1.0;

    if (this.guiltyPlea) {
      fineMultiplier -= 0.20;
      monthsMultiplier -= 0.20;
    }
    if (this.firstOffender) {
      monthsMultiplier -= 0.15;
    }
    if (this.cooperation) {
      monthsMultiplier -= 0.10;
    }

    fineMultiplier = Math.max(0.4, fineMultiplier);
    monthsMultiplier = Math.max(0.3, monthsMultiplier);

    const finalFine = Math.round(baseFine * fineMultiplier);
    const finalMonths = Math.round(baseMonths * monthsMultiplier);

    document.getElementById('summary-charge-count').innerText = totalCount;
    document.getElementById('summary-base-fine').innerText = `$${baseFine.toLocaleString()}`;
    document.getElementById('summary-base-months').innerText = `${baseMonths} Months`;
    document.getElementById('summary-final-fine').innerText = `$${finalFine.toLocaleString()}`;
    document.getElementById('summary-final-months').innerText = `${finalMonths} Months`;
    document.getElementById('summary-points').innerText = `${totalPoints} Pts`;
  }

  copyMdtReport(container) {
    const suspect = container.querySelector('#docket-suspect-name').value.trim() || 'Unknown Suspect';
    const officer = container.querySelector('#docket-officer-name').value.trim() || 'PCPD Officer';
    const penalCodes = window.wikiStorage.getPenalCodes();

    if (this.selectedCharges.length === 0) {
      alert('Please add at least one charge before copying the report.');
      return;
    }

    let report = `========================================\n`;
    report += `🚓 PARADISE COAST POLICE DEPARTMENT - ARREST REPORT\n`;
    report += `========================================\n`;
    report += `📅 Date & Time: ${new Date().toLocaleString()}\n`;
    report += `👤 Suspect Name: ${suspect}\n`;
    report += `👮 Arresting Officer: ${officer}\n`;
    report += `----------------------------------------\n`;
    report += `📋 CHARGES & OFFENSES:\n`;

    let baseFine = 0;
    let baseMonths = 0;
    this.selectedCharges.forEach(sc => {
      const p = penalCodes.find(item => item.code === sc.code);
      if (p) {
        report += ` - [${sc.qty}x] ${p.code}: ${p.title} ($${(p.fine * sc.qty).toLocaleString()} / ${p.jailMonths * sc.qty} Mos)\n`;
        baseFine += p.fine * sc.qty;
        baseMonths += p.jailMonths * sc.qty;
      }
    });

    report += `----------------------------------------\n`;
    report += `⚖️ SENTENCING MITIGATIONS:\n`;
    if (this.guiltyPlea) report += ` [X] Guilty Plea Deal Applied (-20%)\n`;
    if (this.firstOffender) report += ` [X] First-Time Offender Reduction (-15%)\n`;
    if (this.cooperation) report += ` [X] Cooperation with PCPD/DOJ (-10%)\n`;
    if (!this.guiltyPlea && !this.firstOffender && !this.cooperation) report += ` [None]\n`;

    const finalFine = document.getElementById('summary-final-fine').innerText;
    const finalMonths = document.getElementById('summary-final-months').innerText;
    const totalPoints = document.getElementById('summary-points').innerText;

    report += `----------------------------------------\n`;
    report += `💰 FINAL PENALTY: ${finalFine}\n`;
    report += `⏱️ FINAL SENTENCE: ${finalMonths}\n`;
    report += `⚠️ DRIVER POINTS: ${totalPoints}\n`;
    report += `========================================`;

    navigator.clipboard.writeText(report).then(() => {
      const btn = container.querySelector('#copy-mdt-report-btn');
      btn.innerText = '✅ Copied to Clipboard!';
      setTimeout(() => btn.innerText = '📄 Copy MDT Report', 2000);
    });
  }

  // ==========================================
  // 2. Crafting & Drug Synthesis Calculator
  // ==========================================
  renderCraftingCalculator(container) {
    const recipes = window.wikiStorage.getCraftingRecipes();

    container.innerHTML = `
      <div class="tool-view-card">
        <div class="tool-header">
          <div class="tool-badge">🧪 ECONOMY & CRAFTING TOOL</div>
          <h2>Drug Synthesis & Crafting Lab Profit Calculator</h2>
          <p>Plan out production runs, calculate raw resource requirements, batch craft times, and estimated street revenue.</p>
        </div>

        <div class="crafting-tool-layout">
          <div class="crafting-config-panel">
            <div class="form-group">
              <label for="recipe-select">Select Blueprint / Synthesis Recipe:</label>
              <select id="recipe-select" class="form-control">
                ${recipes.map(r => `<option value="${r.id}">${r.name} (${r.category})</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label for="batch-qty-input">Batch Production Count:</label>
              <div class="batch-qty-wrapper">
                <input type="number" id="batch-qty-input" value="10" min="1" max="1000" class="form-control" />
                <button class="batch-quick-btn" onclick="document.getElementById('batch-qty-input').value=5; window.wikiTools.updateCraftingCalc();">5x</button>
                <button class="batch-quick-btn" onclick="document.getElementById('batch-qty-input').value=10; window.wikiTools.updateCraftingCalc();">10x</button>
                <button class="batch-quick-btn" onclick="document.getElementById('batch-qty-input').value=50; window.wikiTools.updateCraftingCalc();">50x</button>
                <button class="batch-quick-btn" onclick="document.getElementById('batch-qty-input').value=100; window.wikiTools.updateCraftingCalc();">100x</button>
              </div>
            </div>

            <div class="recipe-info-card" id="recipe-info-card">
              <!-- Dynamically populated -->
            </div>
          </div>

          <div class="crafting-results-panel">
            <h3>📦 Required Ingredients & Output Projections</h3>
            <div class="ingredient-requirements-list" id="ingredient-requirements-list">
              <!-- Dynamically populated -->
            </div>

            <div class="craft-projection-stats">
              <div class="craft-stat-box">
                <span class="stat-label">Total Time Required</span>
                <span class="stat-val" id="craft-total-time">0s</span>
              </div>
              <div class="craft-stat-box">
                <span class="stat-label">Total Units Output</span>
                <span class="stat-val" id="craft-total-units">0</span>
              </div>
              <div class="craft-stat-box highlight-green">
                <span class="stat-label">Gross Street Value</span>
                <span class="stat-val" id="craft-gross-value">$0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const select = container.querySelector('#recipe-select');
    const batchInput = container.querySelector('#batch-qty-input');

    select.addEventListener('change', () => this.updateCraftingCalc());
    batchInput.addEventListener('input', () => this.updateCraftingCalc());

    this.updateCraftingCalc();
  }

  updateCraftingCalc() {
    const select = document.getElementById('recipe-select');
    const batchInput = document.getElementById('batch-qty-input');
    if (!select || !batchInput) return;

    const recipeId = select.value;
    const batchCount = Math.max(1, parseInt(batchInput.value) || 1);
    const recipes = window.wikiStorage.getCraftingRecipes();
    const recipe = recipes.find(r => r.id === recipeId) || recipes[0];

    // Info card
    const infoCard = document.getElementById('recipe-info-card');
    infoCard.innerHTML = `
      <h4>🔬 ${recipe.name}</h4>
      <p><strong>Category:</strong> ${recipe.category}</p>
      <p><strong>Tools Required:</strong> ${recipe.tools.join(', ')}</p>
      <p><strong>Craft Time per Batch:</strong> ${recipe.craftTimeSec} seconds</p>
      <p><strong>Street Value per Unit:</strong> $${recipe.sellPrice.toLocaleString()}</p>
    `;

    // Ingredients
    const ingList = document.getElementById('ingredient-requirements-list');
    ingList.innerHTML = recipe.inputs.map(inp => `
      <div class="ing-row">
        <span class="ing-name">🔹 ${inp.item}</span>
        <span class="ing-qty"><strong>${(inp.qty * batchCount).toLocaleString()}x</strong> required (${inp.qty}x per batch)</span>
      </div>
    `).join('');

    const totalSeconds = recipe.craftTimeSec * batchCount;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const totalOutputUnits = recipe.output.qty * batchCount;
    const totalGross = totalOutputUnits * recipe.sellPrice;

    document.getElementById('craft-total-time').innerText = timeFormatted;
    document.getElementById('craft-total-units').innerText = `${totalOutputUnits.toLocaleString()}x ${recipe.output.item}`;
    document.getElementById('craft-gross-value').innerText = `$${totalGross.toLocaleString()}`;
  }

  // ==========================================
  // 3. Gang Turfs & Interactive Territory Map
  // ==========================================
  renderTurfMap(container) {
    const turfs = window.wikiStorage.getTurfs();

    container.innerHTML = `
      <div class="tool-view-card">
        <div class="tool-header">
          <div class="tool-badge" style="background: rgba(239, 68, 68, 0.15); color: var(--accent-red);">🗺️ GANG WARS & TURFS</div>
          <h2>Interactive Gang Territory & Turf Map</h2>
          <p>Real-time street territory control, faction influence %, drug distribution bonuses, and live gang claims across San Andreas.</p>
        </div>

        <div class="turfs-display-layout">
          <!-- Interactive Map Container -->
          <div class="turf-map-canvas-card">
            <div class="turf-map-overlay-container">
              <div class="turf-map-bg-grid"></div>
              ${turfs.map(t => `
                <div class="turf-map-pin" style="left: ${t.coordinates.x}%; top: ${t.coordinates.y}%; --pin-color: ${t.color}" onclick="window.wikiTools.selectTurfPin('${t.id}')">
                  <div class="pin-pulse"></div>
                  <div class="pin-icon">📍</div>
                  <span class="pin-label">${t.name}</span>
                </div>
              `).join('')}
            </div>
            <div class="turf-map-legend">
              <span>💡 Click any zone pin on the radar map or card below to view details and control info.</span>
            </div>
          </div>

          <!-- Turf Information & Cards -->
          <div class="turf-cards-list" id="turf-cards-list">
            ${turfs.map(t => `
              <div class="turf-status-card" id="turf-card-${t.id}" style="border-left: 4px solid ${t.color};">
                <div class="turf-card-head">
                  <div>
                    <h3 class="turf-card-name">${t.name}</h3>
                    <span class="turf-zone-sub">${t.zone}</span>
                  </div>
                  <span class="turf-influence-pill" style="background: ${t.color}22; color: ${t.color}; border: 1px solid ${t.color}66;">
                    ${t.influence}% Control
                  </span>
                </div>

                <div class="turf-controlling-faction">
                  👑 Controlling Faction: <strong style="color: ${t.color};">${t.controllingFaction}</strong>
                </div>

                <div class="turf-bonus-tag">
                  ✨ <strong>Turf Perk:</strong> ${t.drugBonus}
                </div>

                <p class="turf-desc-p">${t.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  selectTurfPin(turfId) {
    document.querySelectorAll('.turf-status-card').forEach(c => c.classList.remove('active-turf-highlight'));
    const target = document.getElementById(`turf-card-${turfId}`);
    if (target) {
      target.classList.add('active-turf-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ==========================================
  // 4. Player Businesses & Economy Directory
  // ==========================================
  renderBusinessesDirectory(container) {
    const businesses = window.wikiStorage.getBusinesses();

    container.innerHTML = `
      <div class="tool-view-card">
        <div class="tool-header">
          <div class="tool-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-green);">💼 PLAYER COMMERCE</div>
          <h2>Paradise Coast Businesses & Services Directory</h2>
          <p>Official catalog of player-owned garages, restaurants, real estate firms, and entertainment venues with pricing and hiring status.</p>
        </div>

        <div class="business-cards-grid">
          ${businesses.map(b => `
            <div class="business-profile-card">
              <div class="biz-card-top">
                <div class="biz-icon-box">${b.icon}</div>
                <div class="biz-meta">
                  <h3>${b.name}</h3>
                  <span class="biz-cat-tag">${b.category}</span>
                </div>
                <span class="biz-hiring-status ${b.hiring ? 'hiring-open' : 'hiring-closed'}">
                  ${b.hiring ? '🟢 Hiring Now' : '🔴 Closed'}
                </span>
              </div>

              <p class="biz-desc">${b.description}</p>

              <div class="biz-info-pills">
                <span>📍 <strong>Location:</strong> ${b.location}</span>
                <span>👤 <strong>Owner / Manager:</strong> ${b.owner}</span>
              </div>

              <div class="biz-services-section">
                <h4>Featured Services & Menu</h4>
                <div class="biz-services-list">
                  ${b.services.map(s => `
                    <div class="biz-service-row">
                      <span>${s.name}</span>
                      <strong>${s.price}</strong>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 5. Radio Frequencies Scanner & Directory
  // ==========================================
  renderRadioDirectory(container) {
    const radios = window.wikiStorage.getRadioFrequencies();

    container.innerHTML = `
      <div class="tool-view-card">
        <div class="tool-header">
          <div class="tool-badge" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-purple);">📻 COMMUNICATIONS</div>
          <h2>Radio Frequency Directory & Scanner</h2>
          <p>Official dispatch channels for PCPD, SASP, EMS, Mechanics, and civilian operations on Paradise Coast.</p>
        </div>

        <div class="radio-freq-grid">
          ${radios.map(r => `
            <div class="radio-freq-card">
              <div class="rf-header">
                <span class="rf-number">${r.freq} <small>MHz</small></span>
                <span class="rf-agency-badge">${r.agency}</span>
              </div>
              <h3 class="rf-title">${r.name}</h3>
              <p class="rf-desc">${r.desc}</p>
              <button class="rf-copy-btn" onclick="navigator.clipboard.writeText('${r.freq}'); this.innerText='✅ Copied!'; setTimeout(()=>this.innerText='📻 Tune to ${r.freq}', 1500);">
                📻 Tune to ${r.freq}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 6. GTA RP Animations & Emote Searcher
  // ==========================================
  renderEmotesSearch(container) {
    const emotes = window.wikiStorage.getEmotes();

    container.innerHTML = `
      <div class="tool-view-card">
        <div class="tool-header">
          <div class="tool-badge" style="background: rgba(236, 72, 153, 0.15); color: var(--accent-pink);">🎭 ROLEPLAY ANIMATIONS</div>
          <h2>FiveM Emote & Animation Quick Reference</h2>
          <p>Search over popular RP emotes and animation commands. Click any command to instantly copy it for in-game chat!</p>
        </div>

        <div class="emote-search-header">
          <input type="text" id="emote-filter-input" placeholder="🔍 Search animation (e.g. smoke, lean, cpr, mechanic, phone)..." />
        </div>

        <div class="emote-buttons-grid" id="emote-buttons-grid">
          ${emotes.map(e => `
            <div class="emote-card" onclick="navigator.clipboard.writeText('${e.cmd}'); window.wikiApp.showToast('✅ Copied ${e.cmd} to clipboard!');">
              <div class="emote-top">
                <span class="emote-name">${e.name}</span>
                <span class="emote-cat">${e.cat}</span>
              </div>
              <code class="emote-code">${e.cmd}</code>
              ${e.prop !== 'None' ? `<span class="emote-prop">📦 Prop: ${e.prop}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const input = container.querySelector('#emote-filter-input');
    input.addEventListener('input', (ev) => {
      const q = ev.target.value.toLowerCase().trim();
      const filtered = emotes.filter(e => e.name.toLowerCase().includes(q) || e.cmd.toLowerCase().includes(q) || e.cat.toLowerCase().includes(q) || e.prop.toLowerCase().includes(q));
      const grid = document.getElementById('emote-buttons-grid');
      if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No emotes found matching "${q}".</div>`;
      } else {
        grid.innerHTML = filtered.map(e => `
          <div class="emote-card" onclick="navigator.clipboard.writeText('${e.cmd}'); window.wikiApp.showToast('✅ Copied ${e.cmd} to clipboard!');">
            <div class="emote-top">
              <span class="emote-name">${e.name}</span>
              <span class="emote-cat">${e.cat}</span>
            </div>
            <code class="emote-code">${e.cmd}</code>
            ${e.prop !== 'None' ? `<span class="emote-prop">📦 Prop: ${e.prop}</span>` : ''}
          </div>
        `).join('');
      }
    });
  }
}

window.wikiTools = new WikiTools();

