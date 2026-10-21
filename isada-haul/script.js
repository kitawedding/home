(function () {
  'use strict';

  var cover = document.getElementById('cover');
  var content = document.getElementById('content');
  var btnOpen = document.getElementById('btnOpen');
  var section1 = document.getElementById('section-1');

  /* ---------- Buka undangan -> menuju Section 1 ---------- */
  function openInvitation() {
    document.body.classList.remove('is-locked');
    content.removeAttribute('aria-hidden');
    cover.classList.add('is-open');
    section1.scrollIntoView({ behavior: 'auto', block: 'start' });
    observeReveals();
    setTimeout(function () { cover.style.display = 'none'; }, 1100);
  }
  if (btnOpen) btnOpen.addEventListener('click', openInvitation);

  /* ---------- Reveal bertahap saat scroll ---------- */
  var observer = null;
  function observeReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    observer = observer || new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 0.12 + 's';
      observer.observe(el);
    });
  }
  observeReveals();

  /* ---------- Countdown: Ahad, 15 Nov 2026 (WIB) ---------- */
  var target = new Date('2026-11-15T08:00:00+07:00').getTime();
  var els = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s')
  };
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    if (els.d) els.d.textContent = pad(Math.floor(diff / 86400000));
    if (els.h) els.h.textContent = pad(Math.floor(diff % 86400000 / 3600000));
    if (els.m) els.m.textContent = pad(Math.floor(diff % 3600000 / 60000));
    if (els.s) els.s.textContent = pad(Math.floor(diff % 60000 / 1000));
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Salin nomor rekening ---------- */
  var btnCopy = document.getElementById('btnCopy');
  var copyLabel = document.getElementById('copyLabel');
  if (btnCopy && copyLabel) btnCopy.addEventListener('click', function () {
    var bankNo = document.getElementById('bankNo');
    if (!bankNo) return;
    var no = bankNo.textContent.replace(/\s+/g, '');
    function done() {
      copyLabel.textContent = 'TERSALIN ✓';
      btnCopy.classList.add('is-done');
      setTimeout(function () {
        copyLabel.textContent = 'SALIN NO. REKENING';
        btnCopy.classList.remove('is-done');
      }, 2000);
    }
    function fallback() {
      var t = document.createElement('textarea');
      t.value = no; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(t);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(no).then(done, fallback);
    } else { fallback(); }
  });

  /* ---------- Galeri otomatis + popup ---------- */
  var galleryConfig = window.GALLERY_CONFIG || {};
  var totalFoto = Math.max(0, parseInt(galleryConfig.totalFoto, 15) || 0);
  var folderPath = galleryConfig.folderPath || 'images/';
  var extension = String(galleryConfig.extension || 'jpeg').replace(/^\./, '');
  var horizontalPhotos = Array.isArray(galleryConfig.horizontalPhotos) ? galleryConfig.horizontalPhotos : [];
  var gallery = document.getElementById('galleryContainer');
  var photoPopup = document.getElementById('photoPopup');
  var popupImg = document.getElementById('popupImg');
  var closePopup = document.getElementById('closePhotoPopup');

  if (gallery) {
    for (var i = 1; i <= totalFoto; i++) {
      (function (number) {
        var imgSrc = folderPath + number + '.' + extension;
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'gal__item reveal' + (horizontalPhotos.indexOf(number) !== -1 ? ' horizontal' : '');
        item.setAttribute('aria-label', 'Buka foto galeri ' + number);
        var img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Foto galeri ' + number;
        img.loading = 'lazy';
        img.onerror = function () {
          item.classList.add('gal__item--missing');
          item.title = 'Gambar tidak ditemukan: ' + imgSrc;
          item.remove();
        };
        item.appendChild(img);
        item.addEventListener('click', function () {
          if (!photoPopup || !popupImg) return;
          popupImg.src = imgSrc;
          popupImg.alt = 'Foto galeri ' + number + ' ukuran penuh';
          if (typeof photoPopup.showModal === 'function') photoPopup.showModal();
        });
        gallery.appendChild(item);
      })(i);
    }
    observeReveals();
  }
  function closePhoto() {
    if (photoPopup && photoPopup.open) photoPopup.close();
    if (popupImg) popupImg.src = '';
  }
  if (closePopup) closePopup.addEventListener('click', closePhoto);
  if (photoPopup) {
    photoPopup.addEventListener('click', function (event) {
      if (event.target === photoPopup) closePhoto();
    });
    photoPopup.addEventListener('close', function () {
      if (popupImg) popupImg.src = '';
    });
  }

  /* ---------- Komentar & RSVP via Google Apps Script ---------- */
  var wishConfig = window.WISH_CONFIG || {};
  var scriptUrl = wishConfig.scriptUrl || '';
  var weddingId = wishConfig.weddingId || 'default-wedding';
  var form = document.getElementById('rsvpForm');
  var listEl = document.getElementById('msgList');
  var countEl = document.getElementById('msgCount');
  var totalEl = document.getElementById('comment-count');
  var attendEl = document.getElementById('attend-count');
  var notAttendEl = document.getElementById('not-attend-count');

  function setStats(data) {
    if (totalEl) totalEl.textContent = data.length;
    if (attendEl) attendEl.textContent = data.filter(function (item) { return item.attendance === 'Hadir'; }).length;
    if (notAttendEl) notAttendEl.textContent = data.filter(function (item) { return item.attendance === 'Tidak Hadir'; }).length;
    if (countEl) countEl.textContent = data.length ? data.length + ' ucapan' : 'Belum ada ucapan';
  }

  function renderWishes(data) {
    if (!listEl) return;
    listEl.textContent = '';
    data.slice().reverse().forEach(function (wish) {
      var card = document.createElement('div');
      card.className = 'msg';
      var head = document.createElement('div');
      head.className = 'msg__head';
      var name = document.createElement('span');
      name.className = 'msg__name';
      name.textContent = wish.name || 'Tamu';
      var badge = document.createElement('span');
      var attendance = wish.attendance || 'Belum dikonfirmasi';
      badge.className = 'msg__badge' +
        (attendance === 'Tidak Hadir' ? ' msg__badge--no' :
         attendance === 'Masih Ragu' ? ' msg__badge--maybe' : '');
      badge.textContent = attendance;
      var message = document.createElement('p');
      message.className = 'msg__text';
      message.textContent = wish.message || '';
      head.appendChild(name);
      head.appendChild(badge);
      card.appendChild(head);
      card.appendChild(message);
      listEl.appendChild(card);
    });
    setStats(data);
  }

  function loadWishes() {
    if (!scriptUrl || !listEl) {
      if (countEl) countEl.textContent = 'Komentar belum dikonfigurasi';
      return;
    }
    fetch(scriptUrl + '?action=get&wedding_id=' + encodeURIComponent(weddingId))
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error('Format data komentar tidak sesuai');
        renderWishes(data);
      })
      .catch(function (error) {
        console.error('Gagal memuat komentar:', error);
        if (countEl) countEl.textContent = 'Komentar belum dapat dimuat. Coba muat ulang halaman.';
      });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var nameInput = document.getElementById('rsvpName');
      var messageInput = document.getElementById('rsvpMsg');
      var attendanceInput = document.getElementById('rsvpStatus');
      var submitBtn = form.querySelector('button[type="submit"]');
      var name = nameInput ? nameInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';
      var attendance = attendanceInput ? attendanceInput.value : '';
      if (!name || !message || !attendance || !scriptUrl) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'MENGIRIM...';
      }
      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'add',
          wedding_id: weddingId,
          name: name,
          message: message,
          attendance: attendance
        })
      }).then(function () {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'KIRIM';
        }
        if (countEl) countEl.textContent = 'Ucapan terkirim. Memperbarui daftar...';
        setTimeout(loadWishes, 1000);
      }).catch(function (error) {
        console.error('Gagal mengirim komentar:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'KIRIM';
        }
        if (countEl) countEl.textContent = 'Gagal mengirim ucapan. Silakan coba lagi.';
      });
    });
  }
  loadWishes();
})();