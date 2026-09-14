// Digital Breathalyzer HUD Display
window.initBreathalyzer = function(targetName, bac, legalLimit) {
  bac = parseFloat(bac) || 0.0;
  legalLimit = parseFloat(legalLimit) || 0.08;

  document.getElementById('breathalyzerTargetName').innerText = `PATRON: ${(targetName || 'SUBJECT').toUpperCase()}`;
  document.getElementById('breathalyzerBACVal').innerText = `${bac.toFixed(3)}%`;

  const statusEl = document.getElementById('breathalyzerStatus');
  if (bac <= 0.01) {
    statusEl.innerText = 'SOBER - LEGAL TO OPERATE VEHICLE';
    statusEl.style.color = 'var(--accent-green)';
  } else if (bac < legalLimit) {
    statusEl.innerText = 'IMPAIRED - UNDER LEGAL LIMIT';
    statusEl.style.color = 'var(--accent-gold)';
  } else {
    statusEl.innerText = 'OVER LIMIT - UNLAWFUL INTOXICATION';
    statusEl.style.color = '#ff3366';
  }

  document.getElementById('breathalyzerModal').classList.remove('hidden');
};
