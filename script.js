// ============================================================
// FALLING FLOWERS â€” SVG petals drift from top to bottom
// ============================================================
(function () {
  const field = document.getElementById('flowerField');
  if (!field) return;

  // Colour palette matching the dark crimson theme
  const colours = [
    '#C8393A', '#9a1a20', '#F5EBE6',
    '#C4909A', '#e05050', '#7a0e14',
    '#F0E4E0', '#A84350'
  ];

  // Four SVG flower shapes (as inline SVG strings)
  const shapes = [
    // 5-petal rounded flower
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.65" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(72  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(144 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(216 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(288 20 20)"/>
      <circle  cx="20" cy="20" r="5" fill="${c}" opacity="0.8"/>
    </svg>`,

    // 6-petal daisy
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(60  20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(120 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(240 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(300 20 20)"/>
      <circle  cx="20" cy="20" r="4.5" fill="${c}" opacity="0.8"/>
    </svg>`,

    // Single petal / leaf shape
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.55" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4 C 28 12, 28 28, 20 36 C 12 28, 12 12, 20 4 Z"/>
    </svg>`,

    // 4-petal sakura style
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(90  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(270 20 20)"/>
      <circle  cx="20" cy="20" r="4" fill="${c}" opacity="0.75"/>
    </svg>`,
  ];

  const TOTAL = 10;  // number of flowers in the pool
  const rnd = (a, b) => Math.random() * (b - a) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < TOTAL; i++) {
    const el = document.createElement('div');
    el.className = 'flower';

    const size = rnd(14, 32);                   // px
    const colour = pick(colours);
    const shapeIdx = Math.floor(rnd(0, shapes.length));
    const duration = rnd(7, 18);                    // fall speed (s)
    const spinSpeed = rnd(4, 14);                    // rotation speed (s)
    const delay = rnd(-duration, 0);             // stagger so they're already mid-air
    const leftPct = rnd(0, 100);                   // horizontal start
    const drift = `${rnd(-80, 80)}px`;           // horizontal wander during fall

    el.style.cssText = `
      left: ${leftPct}%;
      --drift: ${drift};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    el.innerHTML = shapes[shapeIdx](colour, Math.round(size));

    // Apply spin speed to the inner svg
    const svg = el.querySelector('svg');
    if (svg) {
      svg.style.animationDuration = `${spinSpeed}s`;
    }

    field.appendChild(el);
  }
})();


const NIKAH_DATE = new Date('2027-01-03T11:30:00+05:30').getTime();

const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-mins');
const cdSecs = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now = Date.now();
  let diff = NIKAH_DATE - now;

  if (diff <= 0) {
    cdDays.textContent = '00';
    cdHours.textContent = '00';
    cdMins.textContent = '00';
    cdSecs.textContent = '00';
    return;
  }

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  cdDays.textContent = pad(days);
  cdHours.textContent = pad(hours);
  cdMins.textContent = pad(mins);
  cdSecs.textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// SPLASH SCREEN â€” dismiss on "Open Invitation" click + autoplay music
// ============================================================
const splashOverlay = document.getElementById('splashOverlay');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicRing = document.getElementById('musicRing');
const iconOn = musicBtn.querySelector('.music-icon--on');
const iconOff = musicBtn.querySelector('.music-icon--off');

// Update button appearance to match actual playing state
function syncMusicBtn(playing) {
  if (playing) {
    iconOn.style.display = '';
    iconOff.style.display = 'none';
    musicBtn.setAttribute('aria-label', 'Pause music');
    musicRing.classList.add('spinning');
  } else {
    iconOn.style.display = 'none';
    iconOff.style.display = '';
    musicBtn.setAttribute('aria-label', 'Play music');
    musicRing.classList.remove('spinning');
  }
}

// Attempt autoplay when user clicks "Open Invitation"
openInvitationBtn.addEventListener('click', () => {
  splashOverlay.classList.add('hidden');
  splashOverlay.addEventListener('transitionend', () => {
    splashOverlay.remove();
  }, { once: true });

  // Make the floating music toggle button visible
  musicBtn.classList.add('visible');

  // Autoplay — browsers allow this after a user gesture
  bgMusic.volume = 0.55;
  bgMusic.play().then(() => {
    syncMusicBtn(true);
  }).catch(() => {
    // Autoplay blocked — show button in paused state
    syncMusicBtn(false);
  });
});

// Toggle play / pause via floating button
musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => syncMusicBtn(true));
  } else {
    bgMusic.pause();
    syncMusicBtn(false);
  }
});

// Keep button in sync if audio ends unexpectedly (shouldn't happen with loop)
bgMusic.addEventListener('pause', () => syncMusicBtn(false));
bgMusic.addEventListener('play', () => syncMusicBtn(true));

// ============================================================
// REVEAL ON SCROLL
// ============================================================
const revealTargets = document.querySelectorAll(
  '.occasion-card, .family-card, .countdown-grid, .venue-card, .rsvp-card, .section-title, .section-eyebrow, .invite-note p, .couples-img-container, .wish-card'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ============================================================
// RSVP & PRIVATE WISHES CONTROLLER (SHIHAB-NAFIYA MODEL)
// ============================================================

const RSVP_STORAGE_KEY = 'mahin_beema_rsvps';
const OWNER_PASSWORD = 'MAHIN2027'; // Primary password (also accepts MAHIN, BEEMA, 2027)

// Pre-populate with a warm sample wish if empty so the owner immediately sees the dashboard layout
(function initDefaultRsvps() {
  try {
    if (!localStorage.getItem(RSVP_STORAGE_KEY)) {
      const initialDemos = [
        {
          id: 'rsvp_sample_1',
          name: 'Shan & Family',
          attendance: 'Joyfully Accept',
          guests: '3 Persons',
          message: 'Heartiest congratulations to Mahin & Beema! May Allah bless your union with endless happiness, love, and barakah.',
          date: '03 Jan 2027',
          timestamp: Date.now()
        }
      ];
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(initialDemos));
    }
  } catch (err) {
    console.warn('Storage initialisation error:', err);
  }
})();

function getStoredRsvps() {
  try {
    return JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function saveStoredRsvps(list) {
  try {
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save RSVP:', e);
  }
}

// Attendance Radio Button Toggle (Hides guest count dropdown when declining)
function toggleGuestCount(show) {
  const guestGroup = document.getElementById('guestCountGroup');
  if (guestGroup) {
    guestGroup.style.display = show ? 'flex' : 'none';
  }
}

// Form Submission Handler
function submitRsvpForm(e) {
  if (e && e.preventDefault) e.preventDefault();

  const nameInput = document.getElementById('rsvpName');
  const msgInput  = document.getElementById('rsvpMessage');
  const guestsEl  = document.getElementById('rsvpGuests');
  const attendEl  = document.querySelector('input[name="rsvpAttend"]:checked');
  const submitBtn = document.getElementById('rsvpSubmitBtn');

  const name = nameInput ? nameInput.value.trim() : '';
  const attendance = attendEl ? attendEl.value : 'Joyfully Accept';
  const isDecline = attendance === 'Regretfully Decline';
  const guests = isDecline ? '0 Persons' : (guestsEl ? guestsEl.value : '1 Person');
  const message = msgInput ? msgInput.value.trim() : '';

  // Validation
  if (!name) {
    if (nameInput) {
      nameInput.focus();
      nameInput.style.borderColor = 'var(--gold)';
      nameInput.style.boxShadow = '0 0 0 3px rgba(200,57,58,0.25)';
      setTimeout(() => {
        nameInput.style.borderColor = '';
        nameInput.style.boxShadow = '';
      }, 2200);
    }
    return;
  }

  // Visual feedback
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Recording RSVP…';
  }

  // Create new entry
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const newEntry = {
    id: 'rsvp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: name,
    attendance: attendance,
    guests: guests,
    message: message,
    date: dateFormatted,
    timestamp: Date.now()
  };

  const list = getStoredRsvps();
  list.unshift(newEntry); // Add newest at top
  saveStoredRsvps(list);

  // If owner view is currently open, live update it
  if (sessionStorage.getItem('mahin_beema_unlocked') === '1') {
    renderOwnerRsvps();
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm & Send RSVP';
    }
    const form = document.getElementById('rsvpForm');
    const successBox = document.getElementById('rsvpSuccessBox');
    if (form) form.hidden = true;
    if (successBox) successBox.hidden = false;
  }, 400);
}

// Reset form for another response
function resetRsvpForm() {
  const form = document.getElementById('rsvpForm');
  const successBox = document.getElementById('rsvpSuccessBox');
  if (form) {
    form.reset();
    form.hidden = false;
  }
  if (successBox) {
    successBox.hidden = true;
  }
  toggleGuestCount(true);
}

// ============================================================
// OWNER LOGIN & LOCK MODAL CONTROLS
// ============================================================

function openWishesUnlockModal() {
  const modal = document.getElementById('wishesPassModal');
  const input = document.getElementById('wishesPassInput');
  const err = document.getElementById('ownerPassError');
  if (err) err.style.display = 'none';
  if (input) input.value = '';
  if (modal) modal.classList.add('open');
  setTimeout(() => input && input.focus(), 150);
}

function closeWishesPassModal() {
  const modal = document.getElementById('wishesPassModal');
  if (modal) modal.classList.remove('open');
}

function checkWishesPassword() {
  const input = document.getElementById('wishesPassInput');
  const err = document.getElementById('ownerPassError');
  const val = (input ? input.value : '').trim().toUpperCase();

  // Accept MAHIN2027, 2027, MAHIN, BEEMA
  const validKeys = ['MAHIN2027', '2027', 'MAHIN', 'BEEMA'];

  if (validKeys.includes(val)) {
    sessionStorage.setItem('mahin_beema_unlocked', '1');
    closeWishesPassModal();
    unlockWishesView();
  } else {
    if (err) {
      err.textContent = 'Incorrect password. Please try again.';
      err.style.display = 'block';
    }
    if (input) {
      input.focus();
      input.select();
    }
  }
}

function unlockWishesView() {
  const lockCard = document.getElementById('wishesLockCard');
  const ownerView = document.getElementById('ownerRsvpView');
  if (lockCard) lockCard.style.display = 'none';
  if (ownerView) {
    ownerView.style.display = 'block';
    renderOwnerRsvps();
  }
}

function relockWishes() {
  sessionStorage.removeItem('mahin_beema_unlocked');
  const lockCard = document.getElementById('wishesLockCard');
  const ownerView = document.getElementById('ownerRsvpView');
  if (lockCard) lockCard.style.display = 'block';
  if (ownerView) ownerView.style.display = 'none';
}

function initWishesLock() {
  if (sessionStorage.getItem('mahin_beema_unlocked') === '1') {
    unlockWishesView();
  }
}

// ============================================================
// RENDER OWNER DASHBOARD (STATS & CARDS)
// ============================================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderOwnerRsvps() {
  const rsvps = getStoredRsvps();
  const container = document.getElementById('rsvpListContainer');
  const totalEl = document.getElementById('statTotalRsvps');
  const acceptEl = document.getElementById('statAccepted');
  const declineEl = document.getElementById('statDeclined');
  const guestsEl = document.getElementById('statTotalGuests');

  let acceptedCount = 0;
  let declinedCount = 0;
  let totalHeadcount = 0;

  rsvps.forEach(r => {
    if (r.attendance === 'Joyfully Accept') {
      acceptedCount++;
      const num = parseInt(r.guests) || 1;
      totalHeadcount += num;
    } else {
      declinedCount++;
    }
  });

  if (totalEl) totalEl.textContent = rsvps.length;
  if (acceptEl) acceptEl.textContent = acceptedCount;
  if (declineEl) declineEl.textContent = declinedCount;
  if (guestsEl) guestsEl.textContent = totalHeadcount;

  if (!container) return;

  if (rsvps.length === 0) {
    container.innerHTML = `
      <div class="rsvp-empty-msg">
        No RSVPs or wishes received yet. Submissions through the form above will appear here.
      </div>
    `;
    return;
  }

  container.innerHTML = rsvps.map(item => {
    const isAccept = item.attendance === 'Joyfully Accept';
    const badgeClass = isAccept ? 'accept' : 'decline';
    const badgeIcon = isAccept ? '✓' : '✕';
    const safeName = escapeHtml(item.name || 'Anonymous Guest');
    const safeMsg = escapeHtml(item.message || '');
    const guestBadge = isAccept ? `<span class="rsvp-badge guests">${escapeHtml(item.guests || '1 Person')}</span>` : '';

    return `
      <div class="rsvp-item-card" data-id="${item.id}">
        <div class="rsvp-item-header">
          <span class="rsvp-item-name">${safeName}</span>
          <div class="rsvp-item-badges">
            <span class="rsvp-badge ${badgeClass}">${badgeIcon} ${escapeHtml(item.attendance)}</span>
            ${guestBadge}
          </div>
        </div>
        ${safeMsg ? `<p class="rsvp-item-msg">&ldquo;${safeMsg}&rdquo;</p>` : ''}
        <div class="rsvp-item-footer">
          <span>${escapeHtml(item.date || '')}</span>
          <button type="button" class="rsvp-del-btn" onclick="deleteRsvp('${item.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteRsvp(id) {
  if (!confirm('Are you sure you want to delete this RSVP?')) return;
  const list = getStoredRsvps().filter(item => item.id !== id);
  saveStoredRsvps(list);
  renderOwnerRsvps();
}

// ============================================================
// EXPORT TO CSV
// ============================================================

function exportRsvpsCsv() {
  const rsvps = getStoredRsvps();
  if (rsvps.length === 0) {
    alert('No RSVPs to export yet.');
    return;
  }

  const headers = ['Name', 'Attendance', 'Guests', 'Message', 'Date'];
  const rows = rsvps.map(r => [
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${(r.attendance || '').replace(/"/g, '""')}"`,
    `"${(r.guests || '').replace(/"/g, '""')}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    `"${(r.date || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'mahin_beema_wedding_rsvps.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initialize on page load
initWishesLock();


