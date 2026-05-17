document.addEventListener("DOMContentLoaded", () => {
    let appData = {};

    // 1. FETCH JSON DATA INFRASTRUCTURE
    fetch("data.json")
        .then(response => {
            if (!response.ok) throw new Error("Gagal memuat konfigurasi data.");
            return response.json();
        })
        .then(data => {
            appData = data;
            initializeInvitation(data);
        })
        .catch(error => {
            console.error("Error Core Config Initialization:", error);
            // Dynamic Minimal Fallback
            document.querySelector(".pair-names").innerText = "Firin & Sihah";
        });

    // 2. PARSE AND HYDRATE DOM DATA ENGINE
    function initializeInvitation(data) {
        // Handle Guest Parameters from URL string
        const urlParams = new URLSearchParams(window.location.search);
        const guestParam = urlParams.get("to");
        const guestElement = document.getElementById("guest-name");
        if (guestElement) {
            guestElement.innerText = guestParam ? decodeURIComponent(guestParam) : data.guest.defaultName;
        }

        // Set Dynamic Global Names
        const coupleString = `${data.couple.maleName} & ${data.couple.femaleName}`;
        document.querySelector(".pair-names").innerText = coupleString;
        document.querySelectorAll(".dynamic-couple-names").forEach(el => el.innerText = coupleString);
        document.querySelectorAll(".dynamic-initial").forEach(el => el.innerText = data.couple.initial);

        // Background Hero Images & Section Config
        const heroSec = document.getElementById("hero");
        if (heroSec && data.akad?.bgImage) heroSec.style.backgroundImage = `url('${data.akad.bgImage}')`;
        const coverSec = document.getElementById("cover");
        if (coverSec && data.resepsi?.bgImage) coverSec.style.backgroundImage = `url('${data.resepsi.bgImage}')`;

        // Section #2 Date Text Update
        const dateTextEl = document.querySelector(".wedding-date-text");
        if (dateTextEl && data.akad?.date) dateTextEl.innerText = data.akad.date;

        // Section #3 Quranic Quote Core
        document.getElementById("quote-arabic").innerText = data.quote.arabic;
        document.getElementById("quote-translation").innerText = data.quote.translation;
        document.getElementById("quote-ref").innerText = data.quote.reference;

        // Section #4 Mempelaifikasi
        document.getElementById("groom-name").innerText = data.groom.name;
        document.getElementById("groom-father").innerText = data.groom.father;
        document.getElementById("groom-mother").innerText = data.groom.mother;
        document.getElementById("groom-img").src = data.groom.image;

        document.getElementById("bride-name").innerText = data.bride.name;
        document.getElementById("bride-father").innerText = data.bride.father;
        document.getElementById("bride-mother").innerText = data.bride.mother;
        document.getElementById("bride-img").src = data.bride.image;

        // Section #6 Acara
        document.getElementById("akad-date").innerText = data.akad.date;
        document.getElementById("akad-time").innerText = data.akad.time;
        document.getElementById("akad-address").innerText = data.akad.address;
        document.getElementById("akad-maps").href = data.akad.maps;

        document.getElementById("resepsi-date").innerText = data.resepsi.date;
        document.getElementById("resepsi-time").innerText = data.resepsi.time;
        document.getElementById("resepsi-address").innerText = data.resepsi.address;
        document.getElementById("resepsi-maps").href = data.resepsi.maps;

        // Section #7 Build Custom Gift Cards Programmatically
        const containerGift = document.getElementById("gift-cards-container");
        if (containerGift && data.gift) {
            containerGift.innerHTML = ""; // Flush
            data.gift.forEach(item => {
                const card = document.createElement("div");
                card.className = "gift-card glassmorphism";
                card.innerHTML = `
                    <div class="bank-logo">${item.bank}</div>
                    <div class="account-number">${item.number}</div>
                    <div class="account-holder">a.n. ${item.name}</div>
                    <button class="btn-copy" data-copy="${item.number}">Salin Rekening</button>
                `;
                containerGift.appendChild(card);
            });
            attachClipboardListeners();
        }

        // Initialize Embedded Real-time Countdown Execution
        startCountdownClock(data.date.weddingDate);

        // Initialize Audio Driver Configuration
        const audioInstance = document.getElementById("wedding-audio");
        if (audioInstance) audioInstance.src = data.music.src;

        // Load Comment Board Execution
        renderLiveComments();

        // Bootstrapping Core Viewport Interaction Animators
        initializeIntersectionObserver();
    }

    // 3. CORE SOUND CONTROLLER & DEPLOY AUDIO LOGIC
    const audioContainer = document.getElementById("audio-container");
    const audio = document.getElementById("wedding-audio");
    const musicToggleBtn = document.getElementById("music-toggle");
    const playIcon = musicToggleBtn.querySelector(".icon-play");
    const pauseIcon = musicToggleBtn.querySelector(".icon-pause");

    function playWeddingMusic() {
        audio.play().then(() => {
            localStorage.setItem("momenin_music_state", "playing");
            playIcon.style.display = "none";
            pauseIcon.style.display = "block";
        }).catch(err => console.log("User Interaction Needed for Audio Playback."));
    }

    function pauseWeddingMusic() {
        audio.pause();
        localStorage.setItem("momenin_music_state", "paused");
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    }

    musicToggleBtn.addEventListener("click", () => {
        if (audio.paused) {
            playWeddingMusic();
        } else {
            pauseWeddingMusic();
        }
    });

    // 4. ACTION INTERFACES BUTTON (OPEN INVITATION & SCROLL MECHANICS)
    const openBtn = document.getElementById("btn-open-invitation");
    openBtn.addEventListener("click", () => {
        document.body.classList.remove("scroll-locked");
        document.getElementById("cover").classList.add("dismissed");
        audioContainer.style.display = "flex";
        
        // Auto-Play State Manager
        playWeddingMusic();

        // Cinematic smooth auto navigation scroll immediately after open button click
        setTimeout(() => {
            document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
        }, 300);
    });

    document.getElementById("btn-save-date").addEventListener("click", () => {
        document.getElementById("acara").scrollIntoView({ behavior: "smooth" });
    });

    // 5. INTERSECTION OBSERVER ANIMATION MOTOR
    function initializeIntersectionObserver() {
        const elementsToAnimate = document.querySelectorAll(".reveal-element");
        const animationConfig = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

        const viewObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    // Optimization Unobserve Once Triggered
                    observer.unobserve(entry.target);
                }
            });
        }, animationConfig);

        elementsToAnimate.forEach(node => viewObserver.observe(node));
    }

    // 6. HIGH FREQUENCY REALTIME COUNTDOWN MATRIX ENGINE
    function startCountdownClock(targetDateIsoString) {
        const targetMs = new Date(targetDateIsoString).getTime();

        function evaluateTime() {
            const currentMs = new Date().getTime();
            const distance = targetMs - currentMs;

            if (distance < 0) {
                clearInterval(intervalId);
                document.querySelector(".countdown-board").innerHTML = "<p class='text-gold'>Hari Bahagia Telah Tiba!</p>";
                return;
            }

            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = d < 10 ? "0" + d : d;
            document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
            document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
            document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
        }

        evaluateTime(); // Pre-execution fast load
        const intervalId = setInterval(evaluateTime, 1000);
    }

    // 7. DRAGGABLE FLOATING CONTROLLER PARADIGM LAYER (SUPPORT MOUSE & TOUCH SENSITIVE)
    let activeDrag = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    audioContainer.addEventListener("touchstart", dragStart, { passive: true });
    document.addEventListener("touchend", dragEnd, { passive: true });
    document.addEventListener("touchmove", drag, { passive: false });

    audioContainer.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("mousemove", drag, false);

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        if (e.target === audioContainer || audioContainer.contains(e.target)) activeDrag = true;
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        activeDrag = false;
    }

    function drag(e) {
        if (!activeDrag) return;
        
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            e.preventDefault(); // Lock cursor scroll leakage on desktop dragging
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        // Perform boundary tracking transformations
        audioContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }

    // 8. CLIPBOARD CONTROLLER WITH ANIMATED LUXURY TOAST WIDGET
    function attachClipboardListeners() {
        document.querySelectorAll(".btn-copy").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const textToCopy = e.target.getAttribute("data-copy");
                navigator.clipboard.writeText(textToCopy).then(() => {
                    fireToastNotification();
                });
            });
        });
    }

    function fireToastNotification() {
        const toast = document.getElementById("toast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    // 9. RE-ENGINEERED RSVP DATA STORAGE MACHINE WITHOUT BACKEND
    const rsvpForm = document.getElementById("rsvp-form");
    rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputName = document.getElementById("rsvp-name").value.trim();
        const inputStatus = document.getElementById("rsvp-status").value;
        const inputMessage = document.getElementById("rsvp-message").value.trim();

        if (!inputName || !inputStatus || !inputMessage) return;

        const newCommentPayload = {
            id: Date.now(),
            name: inputName,
            status: inputStatus,
            message: inputMessage,
            timestamp: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })
        };

        let currentHistory = JSON.parse(localStorage.getItem("momenin_rsvp_data")) || [];
        currentHistory.unshift(newCommentPayload); // Newest elements go first
        localStorage.setItem("momenin_rsvp_data", JSON.stringify(currentHistory));

        rsvpForm.reset();
        renderLiveComments();
    });

    function renderLiveComments() {
        const commentsWrapper = document.getElementById("comments-timeline");
        const totalCountEl = document.getElementById("count-total");
        const hadirCountEl = document.getElementById("count-hadir");
        const tidakCountEl = document.getElementById("count-tidak");

        const dataCollection = JSON.parse(localStorage.getItem("momenin_rsvp_data")) || [];

        // Counters Calculation Engine
        let totalHadir = 0;
        let totalAbsen = 0;
        commentsWrapper.innerHTML = "";

        if (dataCollection.length === 0) {
            commentsWrapper.innerHTML = `<p class="text-muted text-center" style="padding: 1rem;">Belum ada ucapan. Menjadi yang pertama?</p>`;
        } else {
            dataCollection.forEach(node => {
                if (node.status === "Hadir") totalHadir++;
                else totalAbsen++;

                const statusClass = node.status === "Hadir" ? "hadir" : "absen";

                const cardNode = document.createElement("div");
                cardNode.className = "comment-card glassmorphism";
                cardNode.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-name">${escapeHtml(node.name)}</span>
                        <span class="badge-status ${statusClass}">${node.status}</span>
                    </div>
                    <p class="comment-text">${escapeHtml(node.message)}</p>
                    <div class="comment-time">${node.timestamp} WIB</div>
                `;
                commentsWrapper.appendChild(cardNode);
            });
        }

        totalCountEl.innerText = dataCollection.length;
        hadirCountEl.innerText = totalHadir;
        tidakCountEl.innerText = totalAbsen;
    }

    // Security sanitization method against XSS injection vulnerabilities
    function escapeHtml(string) {
        return string
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});