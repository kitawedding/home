/* ==========================================================
   Wedding Invitation - Vanilla JS
   Semua data dimuat dari data.json
   ========================================================== */

const STORAGE_KEY_MUSIC = 'wedding_music_playing';
const STORAGE_KEY_COMMENTS = 'wedding_comments';
const STORAGE_KEY_MUSICPOS = 'wedding_music_pos';

let DATA = {};

/* ---------- Util ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function getGuestFromURL() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  return to ? decodeURIComponent(to.replace(/\+/g, ' ')) : null;
}

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- Load Data ---------- */
async function loadData() {
  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    DATA = await res.json();
  } catch (e) {
    console.error('Gagal load data.json', e);
    DATA = {};
  }
  renderAll();
}

/* ---------- Render ---------- */
function renderAll() {
  const c = DATA.couple || {};
  const coupleStr = `${c.maleName || ''} & ${c.femaleName || ''}`;
  $$('[data-bind="couple"]').forEach(el => el.textContent = coupleStr);

  // Guest
  const guest = getGuestFromURL() || (DATA.guest && DATA.guest.defaultName) || 'Tamu Undangan';
  $('#guestName').textContent = guest;

  // Hero date
  if (DATA.date && DATA.date.weddingDate) {
    const d = new Date(DATA.date.weddingDate);
    $('#heroDate').textContent = d.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
  }

  // Music src
  const audio = $('#audio');
  if (DATA.music && DATA.music.src) audio.src = DATA.music.src;

  // Backgrounds
  if (DATA.backgrounds) {
    $$('[data-bg]').forEach(el => {
      const key = el.dataset.bg;
      const url = DATA.backgrounds[key];
      if (url) el.style.backgroundImage = `url('${url}')`;
    });
  }

  // Quote
  if (DATA.quote) {
    $('#quoteArabic').textContent = DATA.quote.arabic || '';
    $('#quoteTrans').textContent = DATA.quote.translation || '';
    $('#quoteRef').textContent = DATA.quote.reference || '';
  }
  if (c.initial) $('#initial').textContent = c.initial;

  // Mempelai
  if (DATA.groom) {
    $('#groomName').textContent = DATA.groom.name || '';
    $('#groomFather').textContent = DATA.groom.father || '';
    $('#groomMother').textContent = DATA.groom.mother || '';
    if (DATA.groom.image) $('#groomImg').src = DATA.groom.image;
  }
  if (DATA.bride) {
    $('#brideName').textContent = DATA.bride.name || '';
    $('#brideFather').textContent = DATA.bride.father || '';
    $('#brideMother').textContent = DATA.bride.mother || '';
    if (DATA.bride.image) $('#brideImg').src = DATA.bride.image;
  }

  // Acara
  if (DATA.akad) {
    $('#akadDate').textContent = DATA.akad.date || '';
    $('#akadTime').textContent = DATA.akad.time || '';
    $('#akadAddr').textContent = DATA.akad.address || '';
    if (DATA.akad.maps) $('#akadMaps').href = DATA.akad.maps;
  }
  if (DATA.resepsi) {
    $('#resDate').textContent = DATA.resepsi.date || '';
    $('#resTime').textContent = DATA.resepsi.time || '';
    $('#resAddr').textContent = DATA.resepsi.address || '';
    if (DATA.resepsi.maps) $('#resMaps').href = DATA.resepsi.maps;
  }

  // Gift
  const giftGrid = $('#giftGrid');
  giftGrid.innerHTML = '';
  (DATA.gift || []).forEach(g => {
    const div = document.createElement('div');
    div.className = 'gift-card reveal';
    div.innerHTML = `
      <div class="bank-name">${g.bank || ''}</div>
      <div class="rek-no">${g.number || ''}</div>
      <div class="rek-name">a.n. ${g.name || ''}</div>
      <button class="btn btn-gold sm copy-btn" data-num="${g.number || ''}">Salin Nomor</button>
    `;
    giftGrid.appendChild(div);
  });
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.dataset.num;
      navigator.clipboard.writeText(num).then(() => showToast('Nomor rekening disalin'));
    });
  });

  // Closing
  if (DATA.closing) $('#closingText').textContent = DATA.closing.text || '';

  // Social
  if (DATA.social) {
    if (DATA.social.instagram) $('#igLink').href = DATA.social.instagram;
    if (DATA.social.whatsapp) $('#waLink').href = DATA.social.whatsapp;
  }

  // Re-observe new elements
  observeReveals();
  renderComments();
}

/* ---------- Open Invitation ---------- */
$('#openBtn').addEventListener('click', () => {
  const cover = $('#cover');
  const main = $('#main');
  cover.style.transition = 'opacity 1s ease, transform 1.2s ease';
  cover.style.opacity = '0';
  cover.style.transform = 'scale(1.05)';
  setTimeout(() => {
    cover.style.display = 'none';
    main.classList.remove('hidden');
    document.body.classList.remove('locked');
    playMusic();
    $('#musicBtn').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => $('#hero').scrollIntoView({ behavior: 'smooth' }), 300);
    observeReveals();
  }, 1000);
});

$('#saveBtn').addEventListener('click', () => {
  $('#acara').scrollIntoView({ behavior: 'smooth' });
});

/* ---------- Music ---------- */
const audio = $('#audio');
const musicBtn = $('#musicBtn');

function playMusic() {
  const savedPos = parseFloat(localStorage.getItem(STORAGE_KEY_MUSICPOS)) || 0;
  if (savedPos) audio.currentTime = savedPos;
  audio.play().then(() => {
    musicBtn.classList.add('playing');
    localStorage.setItem(STORAGE_KEY_MUSIC, '1');
  }).catch(() => {});
}
function pauseMusic() {
  audio.pause();
  musicBtn.classList.remove('playing');
  localStorage.setItem(STORAGE_KEY_MUSIC, '0');
}
musicBtn.addEventListener('click', (e) => {
  if (musicBtn._dragged) { musicBtn._dragged = false; return; }
  audio.paused ? playMusic() : pauseMusic();
});

// Save position
setInterval(() => {
  if (!audio.paused) localStorage.setItem(STORAGE_KEY_MUSICPOS, audio.currentTime);
}, 1500);

// Resume on reload (if opened before)
window.addEventListener('load', () => {
  if (localStorage.getItem(STORAGE_KEY_MUSIC) === '1' && !$('#main').classList.contains('hidden')) {
    playMusic();
  }
});

/* ---------- Draggable music button ---------- */
(() => {
  let startX, startY, origX, origY, dragging = false;
  const onDown = (e) => {
    dragging = true;
    musicBtn._dragged = false;
    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX; startY = p.clientY;
    const rect = musicBtn.getBoundingClientRect();
    origX = rect.left; origY = rect.top;
    musicBtn.style.transition = 'none';
  };
  const onMove = (e) => {
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - startX, dy = p.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) musicBtn._dragged = true;
    let nx = origX + dx, ny = origY + dy;
    nx = Math.max(8, Math.min(window.innerWidth - 60, nx));
    ny = Math.max(8, Math.min(window.innerHeight - 60, ny));
    musicBtn.style.left = nx + 'px';
    musicBtn.style.top = ny + 'px';
    musicBtn.style.right = 'auto';
    musicBtn.style.bottom = 'auto';
  };
  const onUp = () => { dragging = false; musicBtn.style.transition = ''; };
  musicBtn.addEventListener('mousedown', onDown);
  musicBtn.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
})();

/* ---------- Countdown ---------- */
function startCountdown() {
  const target = DATA.date && DATA.date.weddingDate ? new Date(DATA.date.weddingDate).getTime() : 0;
  if (!target) return;
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    $('#cdDays').textContent = d;
    $('#cdHours').textContent = String(h).padStart(2,'0');
    $('#cdMin').textContent = String(m).padStart(2,'0');
    $('#cdSec').textContent = String(s).padStart(2,'0');
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Reveal on scroll ---------- */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          revealObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
  }
  $$('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
}

/* ---------- Parallax ---------- */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      $$('.section[data-bg]').forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = (rect.top * 0.15);
          s.style.backgroundPosition = `center calc(50% + ${offset}px)`;
        }
      });
      ticking = false;
    });
    ticking = true;
  }
});

/* ---------- RSVP / Comments ---------- */
$('#rsvpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#rName').value.trim();
  const msg = $('#rMsg').value.trim();
  const status = $('#rStatus').value;
  if (!name || !msg || !status) return;
  const comments = getComments();
  comments.unshift({ name, msg, status, time: Date.now() });
  localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
  e.target.reset();
  renderComments();
  showToast('Terima kasih atas ucapannya');
});

function getComments() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_COMMENTS)) || []; }
  catch { return []; }
}

function formatTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Baru saja';
  if (diff < 3600000) return Math.floor(diff/60000) + ' menit lalu';
  if (diff < 86400000) return Math.floor(diff/3600000) + ' jam lalu';
  return new Date(ts).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
}

function renderComments() {
  const list = getComments();
  const wrap = $('#comments');
  wrap.innerHTML = '';
  let hadir = 0, tidak = 0;
  list.forEach(c => {
    if (c.status === 'hadir') hadir++; else tidak++;
    const el = document.createElement('div');
    el.className = 'comment';
    el.innerHTML = `
      <div class="c-head">
        <span class="c-name">${escapeHtml(c.name)}</span>
        <span class="c-status ${c.status}">${c.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}</span>
      </div>
      <div class="c-msg">${escapeHtml(c.msg)}</div>
      <div class="c-time">${formatTime(c.time)}</div>
    `;
    wrap.appendChild(el);
  });
  $('#stHadir').textContent = hadir;
  $('#stTidak').textContent = tidak;
  $('#stKom').textContent = list.length;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* ---------- Init ---------- */
loadData().then(() => {
  startCountdown();
  observeReveals();
});
