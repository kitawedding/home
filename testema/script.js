let invitationData = {};
let comments = JSON.parse(localStorage.getItem("comments")) || [];

const body = document.body;
const audio = document.getElementById("bgMusic");

async function loadData() {
  try {

    const response = await fetch("data.json");
    invitationData = await response.json();

    setupContent();
    setupCountdown();
    renderGift();
    renderComments();

    document.getElementById("loader").style.display = "none";

  } catch (error) {
    console.error(error);
  }
}

function setupContent() {

  const data = invitationData;

  // COUPLE
  const coupleName =
    `${data.couple?.maleName || "Pria"} & ${data.couple?.femaleName || "Wanita"}`;

  document.getElementById("coverCouple").innerText = coupleName;
  document.getElementById("heroCouple").innerText = coupleName;
  document.getElementById("closingCouple").innerText = coupleName;

  // INITIAL
  document.getElementById("initialText").innerText =
    data.couple?.initial || "FS";

  // HERO DATE
  document.getElementById("heroDate").innerText =
    new Date(data.date.weddingDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  // QUOTE
  document.getElementById("quoteArabic").innerText =
    data.quote?.arabic || "";

  document.getElementById("quoteTranslation").innerText =
    data.quote?.translation || "";

  document.getElementById("quoteReference").innerText =
    data.quote?.reference || "";

  // GROOM
  document.getElementById("groomName").innerText =
    data.groom?.name || "";

  document.getElementById("groomParent").innerText =
    `Putra dari ${data.groom?.father || ""} & ${data.groom?.mother || ""}`;

  document.getElementById("groomImage").src =
    data.groom?.image || "";

  // BRIDE
  document.getElementById("brideName").innerText =
    data.bride?.name || "";

  document.getElementById("brideParent").innerText =
    `Putri dari ${data.bride?.father || ""} & ${data.bride?.mother || ""}`;

  document.getElementById("brideImage").src =
    data.bride?.image || "";

  // EVENT
  document.getElementById("akadDate").innerText =
    data.akad?.date || "";

  document.getElementById("akadTime").innerText =
    data.akad?.time || "";

  document.getElementById("akadAddress").innerText =
    data.akad?.address || "";

  document.getElementById("akadMaps").href =
    data.akad?.maps || "#";

  document.getElementById("resepsiDate").innerText =
    data.resepsi?.date || "";

  document.getElementById("resepsiTime").innerText =
    data.resepsi?.time || "";

  document.getElementById("resepsiAddress").innerText =
    data.resepsi?.address || "";

  document.getElementById("resepsiMaps").href =
    data.resepsi?.maps || "#";

  // MUSIC
  audio.src = data.music?.src || "";

  // BACKGROUND
  document.getElementById("cover").style.backgroundImage =
    `url(${data.backgrounds?.cover || "assets/images/cover.jpg"})`;

  document.getElementById("hero").style.backgroundImage =
    `url(${data.backgrounds?.hero || "assets/images/hero.jpg"})`;

  document.getElementById("closing").style.backgroundImage =
    `url(${data.backgrounds?.closing || "assets/images/closing.jpg"})`;

  // GUEST NAME
  const params = new URLSearchParams(window.location.search);

  const guest =
    params.get("to") ||
    data.guest?.defaultName ||
    "Tamu Undangan";

  document.getElementById("guestName").innerText = guest;
}

function setupCountdown() {

  const target =
    new Date(invitationData.date.weddingDate).getTime();

  setInterval(() => {

    const now = new Date().getTime();

    const distance = target - now;

    const days =
      Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours =
      Math.floor((distance % (1000 * 60 * 60 * 24))
      / (1000 * 60 * 60));

    const minutes =
      Math.floor((distance % (1000 * 60 * 60))
      / (1000 * 60));

    const seconds =
      Math.floor((distance % (1000 * 60))
      / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

  }, 1000);
}

function renderGift() {

  const wrapper = document.getElementById("giftWrapper");

  wrapper.innerHTML = "";

  invitationData.gift.forEach(item => {

    const div = document.createElement("div");

    div.className = "gift-card reveal";

    div.innerHTML = `
      <h3>${item.bank}</h3>

      <p>${item.number}</p>

      <p>a.n ${item.name}</p>

      <button class="btn-gold copy-btn">
        Copy Rekening
      </button>
    `;

    div.querySelector(".copy-btn")
      .addEventListener("click", () => {

      navigator.clipboard.writeText(item.number);

      showToast("Nomor rekening berhasil disalin");

    });

    wrapper.appendChild(div);

  });
}

function showToast(text) {

  const toast = document.getElementById("toast");

  toast.innerText = text;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function renderComments() {

  const wrapper =
    document.getElementById("commentList");

  wrapper.innerHTML = "";

  const hadir =
    comments.filter(c => c.attendance === "Hadir").length;

  const tidak =
    comments.filter(c => c.attendance === "Tidak Hadir").length;

  document.getElementById("hadirCount").innerText = hadir;
  document.getElementById("tidakHadirCount").innerText = tidak;
  document.getElementById("commentCount").innerText = comments.length;

  comments
    .sort((a,b)=>b.time-a.time)
    .forEach(comment => {

    const div = document.createElement("div");

    div.className = "comment-card reveal";

    div.innerHTML = `
      <h4>${comment.name}</h4>

      <small>${comment.attendance}</small>

      <p>${comment.message}</p>

      <small>
        ${new Date(comment.time)
          .toLocaleString("id-ID")}
      </small>
    `;

    wrapper.appendChild(div);

  });
}

document.getElementById("rsvpForm")
.addEventListener("submit", e => {

  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    message: document.getElementById("message").value,
    attendance: document.getElementById("attendance").value,
    time: Date.now()
  };

  comments.push(data);

  localStorage.setItem(
    "comments",
    JSON.stringify(comments)
  );

  renderComments();

  e.target.reset();

  showToast("Ucapan berhasil dikirim");
});

document.getElementById("openInvitation")
.addEventListener("click", async () => {

  body.classList.remove("lock");

  try {
    await audio.play();

    localStorage.setItem("musicPlaying", "true");

  } catch(err){
    console.log(err);
  }

  document.getElementById("hero")
    .scrollIntoView({
      behavior:"smooth"
    });

});

document.getElementById("saveDateBtn")
.addEventListener("click", () => {

  document.getElementById("event")
    .scrollIntoView({
      behavior:"smooth"
    });

});

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if(entry.isIntersecting){

      entry.target.classList.add("active");

    }

  });

},{
  threshold:0.15
});

document.querySelectorAll(".reveal")
.forEach(el => observer.observe(el));

window.addEventListener("load", () => {

  body.classList.add("lock");

  loadData();

});

// MUSIC TOGGLE
const musicBtn =
  document.getElementById("musicControl");

musicBtn.addEventListener("click", () => {

  if(audio.paused){

    audio.play();

    localStorage.setItem("musicPlaying","true");

  }else{

    audio.pause();

    localStorage.setItem("musicPlaying","false");

  }

});

// RESTORE MUSIC STATE
window.addEventListener("load", () => {

  const isPlaying =
    localStorage.getItem("musicPlaying");

  if(isPlaying === "true"){

    audio.play();

  }

});

// DRAG MUSIC BUTTON
let isDragging = false;

musicBtn.addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mousemove", (e) => {

  if(isDragging){

    musicBtn.style.left = `${e.pageX - 30}px`;
    musicBtn.style.top = `${e.pageY - 30}px`;

  }

});

document.addEventListener("mouseup", () => {
  isDragging = false;
});