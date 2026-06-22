/* ===================================================
   🎂 Aya's Birthday Wishlist - Logic
=================================================== */

// 🔑 URL backend (Google Apps Script Web App)
const API_URL = "https://script.google.com/macros/s/AKfycbxgjDhLtFAwdAJ89YR5IsrcQvkMWk1LpSaetKqEbo1TlOPCOIPlkwkLCf1T5lSS9HkM/exec";

/* ---------------------------------------------------
   📋 DATA KATALOG (DUMMY — gampang diedit!)
   Tambah/ubah/hapus item sesukamu.
   Field: emoji, judul, deskripsi, kategori
--------------------------------------------------- */
const KATALOG = [
  // 🍽️ Makanan
  { emoji: "🍜", judul: "Makan Gacoan", desc: "Pedesnya level berapa nih? Aku temenin sampai keringetan~ 🌶️", kategori: "Makanan" },
  { emoji: "🍲", judul: "Makan Seblak", desc: "Seblak kerupuk-cekernya komplit, kuahnya nendang. Slurpp!", kategori: "Makanan" },
  { emoji: "🍗", judul: "Makan Pecel Ayam", desc: "Ayam goreng + sambel terasi + lalapan. Simpel tapi juara!", kategori: "Makanan" },
  { emoji: "🍲", judul: "Makan Hotpot", desc: "Celup-celup sampai kenyang, anget-anget berdua. 🔥", kategori: "Makanan" },
  { emoji: "🍽️", judul: "Makan Fancyyyyy", desc: "Sekali-kali makan mewah, dandan cantik, kamu yang paling spesial malam itu. ✨", kategori: "Makanan" },

  // 🎬 Jalan-jalan
  { emoji: "🎬", judul: "Nonton Bioskop Berdua", desc: "Kamu pilih filmnya, aku yang traktir popcorn-nya 🍿", kategori: "Jalan-jalan" },
  { emoji: "🌳", judul: "Piknik Sore di Taman", desc: "Bawa tikar, snack, dan obrolan nggak penting yang seru.", kategori: "Jalan-jalan" },
  { emoji: "🌃", judul: "Lihat City Light Malam", desc: "Keliling kota sambil ngobrol sampai lupa waktu.", kategori: "Jalan-jalan" },
  { emoji: "☕", judul: "Cafe Hopping Aesthetic", desc: "Cari kafe lucu, foto-foto, ngopi, sampai betah seharian.", kategori: "Jalan-jalan" },
  { emoji: "🎡", judul: "Main ke Wahana/Pasar Malam", desc: "Naik bianglala, main game, menang boneka buat kamu! 🧸", kategori: "Jalan-jalan" },

  // 🎁 Kado Fisik
  { emoji: "💐", judul: "Buket Bunga Favoritmu", desc: "Bunga seger buat bikin harimu makin cerah.", kategori: "Kado Fisik" },
  { emoji: "🧸", judul: "Boneka Peluk-pelukan", desc: "Biar ada yang nemenin tidur pas aku lagi nggak ada.", kategori: "Kado Fisik" },
  { emoji: "📖", judul: "Buku yang Kamu Pengen", desc: "Sebut judulnya, aku cariin + kasih catatan kecil di dalamnya.", kategori: "Kado Fisik" },
  { emoji: "💄", judul: "Skincare / Makeup Wishlist", desc: "Yang udah lama kamu pengenin tapi nahan-nahan beli 😆", kategori: "Kado Fisik" },
  { emoji: "📿", judul: "Aksesoris Couple", desc: "Gelang/kalung pasangan, biar kita matchy walau jauh. 🫶", kategori: "Kado Fisik" },

  // 🫂 Quality Time
  { emoji: "📞", judul: "Video Call Semaleman", desc: "Ngobrol sampai salah satu dari kita ketiduran duluan.", kategori: "Quality Time" },
  { emoji: "👩‍🍳", judul: "Masak Bareng Online", desc: "Resep yang sama, dapur beda, ketawa bareng. 🍳", kategori: "Quality Time" },
  { emoji: "💌", judul: "Surat Cinta Tulisan Tangan", desc: "Isi hati yang nggak muat diketik, aku tulis tangan buatmu.", kategori: "Quality Time" },
  { emoji: "🎮", judul: "Main Game Bareng", desc: "Mabar sampai emosi tapi tetep ketawa-ketawa. 🎯", kategori: "Quality Time" },
  { emoji: "🎧", judul: "Dengerin Playlist Berdua", desc: "Tuker lagu favorit, dengerin bareng sambil cerita.", kategori: "Quality Time" },
];

/* --------------------------------------------------- */

const catalogEl = document.getElementById("catalog");
const filtersEl = document.getElementById("filters");
const checkoutBtn = document.getElementById("checkoutBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");

let currentFilter = "all";
const selected = new Set();   // simpan index item yang dipilih

/* ===== RENDER KATALOG ===== */
function renderCatalog() {
  catalogEl.innerHTML = "";

  KATALOG.forEach((item, i) => {
    if (currentFilter !== "all" && item.kategori !== currentFilter) return;

    const card = document.createElement("div");
    card.className = "card" + (selected.has(i) ? " card--selected" : "");
    card.innerHTML = `
      <div class="card__emoji">${item.emoji}</div>
      <div class="card__body">
        <div class="card__title">${item.judul}</div>
        <div class="card__desc">${item.desc}</div>
      </div>
      <button class="card__add" aria-label="Pilih kado">${selected.has(i) ? "✓" : "+"}</button>
    `;

    // klik di mana pun di card = toggle pilih
    card.addEventListener("click", () => toggleSelect(i));
    catalogEl.appendChild(card);
  });
}

/* ===== TOGGLE PILIH ===== */
function toggleSelect(index) {
  if (selected.has(index)) selected.delete(index);
  else selected.add(index);

  renderCatalog();
  updateCheckoutBtn();
}

/* ===== UPDATE TOMBOL CHECKOUT ===== */
function updateCheckoutBtn() {
  const count = selected.size;
  if (count === 0) {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Pilih kado dulu ya 🥺";
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = `Kabulkan Permintaanku! ✨ (${count})`;
  }
}

/* ===== FILTER KATEGORI ===== */
filtersEl.addEventListener("click", (e) => {
  const pill = e.target.closest(".pill");
  if (!pill) return;

  document.querySelectorAll(".pill").forEach((p) => p.classList.remove("pill--active"));
  pill.classList.add("pill--active");
  currentFilter = pill.dataset.category;
  renderCatalog();
});

/* ===== CHECKOUT → KIRIM KE BACKEND ===== */
checkoutBtn.addEventListener("click", async () => {
  if (selected.size === 0) return;

  // gabung semua kado terpilih
  const items = [...selected].map((i) => KATALOG[i]);
  const kado = items.map((it) => it.judul).join(", ");
  const kategori = [...new Set(items.map((it) => it.kategori))].join(", ");

  // ubah tombol jadi state loading
  checkoutBtn.classList.add("checkout-btn--loading");
  checkoutBtn.textContent = "Mengirim... 💌";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      // ⚠️ text/plain biar gak kena CORS preflight (penting untuk Apps Script!)
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ kado, kategori }),
      redirect: "follow",
    });

    const data = await res.json();

    if (data.status === "success") {
      showSuccess();
    } else {
      throw new Error(data.message || "Gagal mengirim");
    }
  } catch (err) {
    alert("Yaah, ada error 😢: " + err.message + "\nCoba lagi ya.");
  } finally {
    checkoutBtn.classList.remove("checkout-btn--loading");
    updateCheckoutBtn();
  }
});

/* ===== SUCCESS MODAL + CONFETTI ===== */
function showSuccess() {
  modalOverlay.classList.add("modal-overlay--show");
  modalOverlay.setAttribute("aria-hidden", "false");
  fireConfetti();

  // reset pilihan
  selected.clear();
  renderCatalog();
  updateCheckoutBtn();
}

function fireConfetti() {
  if (typeof confetti !== "function") return;
  const colors = ["#FF85A1", "#FF6B8B", "#FFB3C6", "#FFFFFF"];
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
  setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 200);
  setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 400);
}

modalClose.addEventListener("click", () => {
  modalOverlay.classList.remove("modal-overlay--show");
  modalOverlay.setAttribute("aria-hidden", "true");
});

/* ===================================================
   ✨ FITUR TAMBAHAN
=================================================== */

/* ===== WELCOME SCREEN (amplop) ===== */
const welcomeEl = document.getElementById("welcome");
const envelopeEl = document.getElementById("envelope");
const appEl = document.getElementById("app");

function openEnvelope() {
  welcomeEl.classList.add("welcome--hidden");
  appEl.classList.remove("app--hidden");
  fireConfetti();          // sambut dengan confetti pas dibuka
  startMusic();            // coba putar musik (butuh interaksi user = klik amplop)
  setTimeout(typeLetter, 700);   // mulai ketik surat setelah masuk
  // hapus welcome dari layout setelah animasi selesai
  setTimeout(() => { welcomeEl.style.display = "none"; }, 600);
}
envelopeEl.addEventListener("click", openEnvelope);

/* ===== 🎤 SURAT NGETIK SENDIRI ===== */
/* Edit isi surat di sini. Pakai \n untuk ganti baris. */
const LETTER_TEXT =
  "Hai, Aya 💗\n\n" +
  "Selamat ulang tahun ya! Di hari spesialmu ini, kamu nggak boleh repot mikirin apa-apa. " +
  "Tugas kamu cuma satu: milih apa pun yang kamu mau di bawah ini. " +
  "Mau makan enak, jalan-jalan, atau cuma quality time berdua—semua boleh.\n\n" +
  "Pencet aja kadonya, nanti biar aku yang wujudin. Pokoknya hari ini tentang kamu. 🥰\n\n" +
  "— Dengan cinta, Fakhri";

const letterTextEl = document.getElementById("letterText");
const letterCursor = document.getElementById("letterCursor");
let letterStarted = false;

function typeLetter() {
  if (letterStarted) return;
  letterStarted = true;
  let i = 0;
  const speed = 38; // ms per huruf (makin kecil makin cepat)

  function tick() {
    if (i >= LETTER_TEXT.length) {
      letterCursor.classList.add("letter__cursor--hidden");
      return;
    }
    const ch = LETTER_TEXT[i];
    letterTextEl.innerHTML += ch === "\n" ? "<br/>" : ch;
    i++;
    // jeda lebih lama di tanda baca biar kerasa natural
    const delay = ".!?,".includes(ch) ? speed * 6 : speed;
    setTimeout(tick, delay);
  }
  tick();
}

/* ===== 🎵 MUSIK PEMBUKA (dari folder music/) ===== */
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let musicOn = false;

// pasang lagu dari DAFTAR_LAGU (file daftar.js), ambil yang pertama
(function setupMusic() {
  const lagu = (typeof DAFTAR_LAGU !== "undefined" ? DAFTAR_LAGU : []).filter(Boolean);
  if (bgMusic && lagu.length > 0) {
    bgMusic.src = "music/" + lagu[0].split("|")[0].trim();
  } else if (musicBtn) {
    musicBtn.style.display = "none";   // gak ada lagu -> sembunyikan tombol musik
  }
})();

function startMusic() {
  if (!bgMusic || !bgMusic.src) return;
  bgMusic.volume = 0.5;
  bgMusic.play().then(() => {
    musicOn = true;
    musicBtn.classList.add("music-btn--playing");
    musicBtn.classList.remove("music-btn--off");
  }).catch(() => {
    // browser blokir autoplay — user bisa nyalain manual lewat tombol
    musicOn = false;
    musicBtn.classList.add("music-btn--off");
  });
}

musicBtn.addEventListener("click", () => {
  if (!bgMusic) return;
  if (musicOn) {
    bgMusic.pause();
    musicOn = false;
    musicBtn.classList.remove("music-btn--playing");
    musicBtn.classList.add("music-btn--off");
  } else {
    startMusic();
  }
});

/* ===== 🎂 KUE TIUP LILIN ===== */
const cakeFlames = document.getElementById("cakeFlames");
const cakeHint = document.getElementById("cakeHint");
let candleBlown = false;

document.getElementById("cake").addEventListener("click", () => {
  if (candleBlown) {
    // nyalain lagi (relight) kalau diklik lagi
    cakeFlames.classList.remove("cake__flames--out");
    cakeHint.textContent = "Tiup lilinnya, yuk! Make a wish 🌟";
    candleBlown = false;
  } else {
    cakeFlames.classList.add("cake__flames--out");
    cakeHint.textContent = "Yeay, wish kamu udah terbang ke langit! 🌠✨";
    candleBlown = true;
    fireConfetti();
  }
});

/* ===== 📸 GALERI FOTO (dari folder foto/) ===== */
/* Daftar foto diambil dari DAFTAR_FOTO (file daftar.js).
   Itu diisi OTOMATIS oleh script "buat-daftar" — kamu gak perlu ngetik manual. */
const galleryEl = document.getElementById("gallery");
const galleryDots = document.getElementById("galleryDots");
const gallerySection = document.querySelector(".gallery-section");

// pecah "namafile.jpg | caption" jadi {url, caption}
function parseFoto(baris) {
  const [nama, caption] = baris.split("|").map((s) => s.trim());
  return { url: "foto/" + nama, caption: caption || "" };
}

function renderGallery() {
  galleryEl.innerHTML = "";
  galleryDots.innerHTML = "";

  const list = (typeof DAFTAR_FOTO !== "undefined" ? DAFTAR_FOTO : []).filter(Boolean);

  // kalau belum ada foto -> sembunyikan section galeri
  if (list.length === 0) {
    if (gallerySection) gallerySection.style.display = "none";
    return;
  }
  if (gallerySection) gallerySection.style.display = "";

  const ditemukan = list.map(parseFoto);
  ditemukan.forEach((foto, i) => {
    const item = document.createElement("div");
    item.className = "gallery__item";
    item.innerHTML = `
      <img src="${foto.url}" alt="Momen kita" loading="lazy" />
      ${foto.caption ? `<div class="gallery__caption">${foto.caption}</div>` : ""}
    `;
    galleryEl.appendChild(item);

    const dot = document.createElement("div");
    dot.className = "gallery__dot" + (i === 0 ? " gallery__dot--active" : "");
    galleryDots.appendChild(dot);
  });

  // update dot aktif saat di-scroll
  galleryEl.onscroll = () => {
    const idx = Math.round(galleryEl.scrollLeft / (galleryEl.scrollWidth / ditemukan.length));
    document.querySelectorAll(".gallery__dot").forEach((d, i) => {
      d.classList.toggle("gallery__dot--active", i === idx);
    });
  };
}

/* ===== COUNTDOWN ke 30 Juni 2026, 00:00 ===== */
const TARGET_DATE = new Date("2026-06-30T00:00:00").getTime();
const cdTimer = document.getElementById("countdownTimer");
const cdEls = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  mins: document.getElementById("cd-mins"),
  secs: document.getElementById("cd-secs"),
};

function updateCountdown() {
  const now = Date.now();
  let diff = TARGET_DATE - now;

  if (diff <= 0) {
    // hari-H tiba! 🎉
    cdTimer.innerHTML = "🎉 Hari ini hari spesialmu! 🎉";
    cdTimer.parentElement.classList.add("countdown--done");
    clearInterval(cdInterval);
    return;
  }

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  cdEls.days.textContent = days;
  cdEls.hours.textContent = String(hours).padStart(2, "0");
  cdEls.mins.textContent = String(mins).padStart(2, "0");
  cdEls.secs.textContent = String(secs).padStart(2, "0");
}
const cdInterval = setInterval(updateCountdown, 1000);
updateCountdown();

/* ===== BALON & HATI MELAYANG ===== */
const floatiesEl = document.getElementById("floaties");
const FLOAT_EMOJIS = ["🎈", "💗", "🎈", "💖", "🩷", "🎀"];

function spawnFloaty() {
  const el = document.createElement("div");
  el.className = "floaty";
  el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = 20 + Math.random() * 24 + "px";
  const duration = 6 + Math.random() * 6;      // 6-12 detik
  el.style.animationDuration = duration + "s";
  floatiesEl.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000);
}
setInterval(spawnFloaty, 1200);

/* ===== 🌧️ HUJAN HATI PAS DISENTUH ===== */
const TAP_EMOJIS = ["💗", "💖", "🩷", "✨", "🌸", "💕"];
function spawnTapHeart(x, y) {
  const el = document.createElement("div");
  el.className = "tap-heart";
  el.textContent = TAP_EMOJIS[Math.floor(Math.random() * TAP_EMOJIS.length)];
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
// jangan ganggu klik tombol/kartu — cuma efek visual tambahan
document.addEventListener("pointerdown", (e) => {
  // skip kalau welcome masih kebuka (biar fokus ke amplop)
  if (!welcomeEl.classList.contains("welcome--hidden")) return;
  spawnTapHeart(e.clientX, e.clientY);
});

/* ===== 💌 REVEAL PESAN RAHASIA SAAT SCROLL MENTOK ===== */
const secretEl = document.getElementById("secret");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      secretEl.classList.add("secret--show");
      fireConfetti();
      revealObserver.disconnect();   // cukup sekali
    }
  });
}, { threshold: 0.4 });
if (secretEl) revealObserver.observe(secretEl);

/* ===================================================
   ⏳ TIMELINE PERJALANAN KITA
   Edit tanggal, judul & cerita di sini sesuka kamu.
=================================================== */
const TIMELINE = [
  { emoji: "🎓", date: "2025", title: "Pertama Kenal", desc: "Ketemu di Kantor. Siapa sangka satu kenalan biasa bisa jadi seberkesan ini." },
  { emoji: "🤝", date: "2025", title: "Mulai Deket", desc: "Makin sering bareng, makin banyak cerita & ketawa. Pelan-pelan jadi nyaman." },
  { emoji: "💞", date: "2025", title: "Pernah Jadi Kita", desc: "Sempat jalan bareng sebagai sepasang. Banyak momen manis yang nggak akan aku lupa." },
  { emoji: "🌤️", date: "Sekarang", title: "Tetap Baik", desc: "Jalan kita beda sekarang, tapi nggak ada yang jadi musuh. Aku tetap doain yang terbaik buat kamu." },
  { emoji: "🎂", date: "Hari Ini", title: "Ulang Tahunmu!", desc: "Apa pun yang udah lewat, hari ini aku cuma mau bilang: makasih, dan selamat ulang tahun, Aya. 🎈" },
];
const timelineEl = document.getElementById("timeline");
function renderTimeline() {
  if (!timelineEl) return;
  TIMELINE.forEach((t) => {
    const item = document.createElement("div");
    item.className = "tl-item";
    item.innerHTML = `
      <div class="tl-emoji">${t.emoji}</div>
      <div class="tl-date">${t.date}</div>
      <div class="tl-title">${t.title}</div>
      <div class="tl-desc">${t.desc}</div>
    `;
    timelineEl.appendChild(item);
  });

  // reveal beranimasi pas di-scroll
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("tl-item--show");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  timelineEl.querySelectorAll(".tl-item").forEach((el) => obs.observe(el));
}

/* ===================================================
   🎡 SPIN THE WHEEL (ide kencan random)
=================================================== */
const WHEEL_OPTS = [
  "Nonton 🎬", "Gacoan 🌶️", "Cafe Date ☕", "Quality Time 🫂",
  "Makan Fancy ✨", "Piknik 🌳", "Mabar 🎮", "Surprise! 🎁",
];
const wheelColors = ["#FF85A1", "#FFB3C6", "#FF6B8B", "#FFC2D4"];
const wheelCanvas = document.getElementById("wheel");
const wheelResult = document.getElementById("wheelResult");
const spinBtn = document.getElementById("spinBtn");
let wheelAngle = 0;
let spinning = false;

function drawWheel() {
  if (!wheelCanvas) return;
  const ctx = wheelCanvas.getContext("2d");
  const n = WHEEL_OPTS.length;
  const r = wheelCanvas.width / 2;
  const slice = (2 * Math.PI) / n;

  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  for (let i = 0; i < n; i++) {
    const start = i * slice;
    const mid = start + slice / 2;

    // gambar slice
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r, start, start + slice);
    ctx.fillStyle = wheelColors[i % wheelColors.length];
    ctx.fill();

    // teks — selalu terbaca lurus (slice bawah di-flip biar gak kebalik)
    ctx.save();
    ctx.translate(r, r);
    ctx.rotate(mid);
    // kalau teks ada di sisi bawah (kebalik), putar 180° dan baca dari sisi dalam
    const flip = mid > Math.PI / 2 && mid < (3 * Math.PI) / 2;
    if (flip) {
      ctx.rotate(Math.PI);
      ctx.textAlign = "left";
    } else {
      ctx.textAlign = "right";
    }
    ctx.fillStyle = "#5C3D46";
    ctx.font = "bold 12px Quicksand, sans-serif";
    ctx.textBaseline = "middle";
    const x = flip ? -(r - 12) : (r - 12);
    ctx.fillText(WHEEL_OPTS[i], x, 0);
    ctx.restore();
  }
}

if (spinBtn) {
  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    wheelResult.textContent = "";

    const n = WHEEL_OPTS.length;
    const winner = Math.floor(Math.random() * n);
    const sliceDeg = 360 / n;
    // pointer di atas (270°). hitung putaran biar slice winner berhenti di atas.
    const target = 360 * 5 + (270 - (winner * sliceDeg + sliceDeg / 2));
    wheelAngle += target;
    wheelCanvas.style.transform = `rotate(${wheelAngle}deg)`;

    setTimeout(() => {
      wheelResult.textContent = "🎉 " + WHEEL_OPTS[winner] + "!";
      fireConfetti();
      spinning = false;
    }, 4100);
  });
}

/* ===================================================
   🎟️ KUPON DIGITAL
=================================================== */
const KUPON = [
  { icon: "💆", text: "1x Pijatan Gratis kapan aja" },
  { icon: "😤", text: "1x 'Nggak Boleh Marah' ke aku" },
  { icon: "🍔", text: "1x Traktir Makan Apa Aja" },
  { icon: "🎬", text: "1x Nonton, kamu yang pilih filmnya" },
  { icon: "🤗", text: "1x Peluk Erat Tanpa Alasan" },
];
const couponsEl = document.getElementById("coupons");
function renderKupon() {
  if (!couponsEl) return;
  couponsEl.innerHTML = "";
  KUPON.forEach((k) => {
    const c = document.createElement("div");
    c.className = "coupon";
    c.innerHTML = `
      <div class="coupon__icon">${k.icon}</div>
      <div class="coupon__text">${k.text}</div>
      <div class="coupon__stamp">DIPAKAI ✓</div>
    `;
    c.addEventListener("click", () => {
      c.classList.toggle("coupon--used");
      if (c.classList.contains("coupon--used")) fireConfetti();
    });
    couponsEl.appendChild(c);
  });
}

/* ===================================================
   ❓ KUIS PASANGAN
=================================================== */
/* Edit pertanyaan & jawaban di sini. "benar" = index opsi yang betul (mulai 0). */
const KUIS = [
  { q: "Makanan favorit Fakhri apa?", opts: ["Sushi", "Gacoan", "Pizza"], benar: 1 },
  { q: "Warna kesukaan Fakhri sekarang?", opts: ["Hitam", "Biru", "Pink (gara-gara kamu 🩷)"], benar: 2 },
  { q: "Kalau lagi kangen, Fakhri biasanya ngapain?", opts: ["Chat duluan 📱", "Diem aja malu", "Pura-pura sibuk"], benar: 0 },
  { q: "Hal paling bikin Fakhri senyum?", opts: ["Menang game", "Notif dari kamu 🥰", "Tidur siang"], benar: 1 },
  { q: "Apa yang paling Fakhri suka dari Aya?", opts: ["Senyumnya", "Semuanya 🥰", "Masakannya"], benar: 1 },
];
const quizEl = document.getElementById("quiz");
const quizScoreEl = document.getElementById("quizScore");
let quizIdx = 0;
let quizScore = 0;

function renderKuis() {
  if (!quizEl) return;
  if (quizIdx >= KUIS.length) {
    quizEl.innerHTML = "";
    let pesan = quizScore === KUIS.length ? "Perfect! Kamu emang paling ngerti aku 💯💗"
              : quizScore >= KUIS.length / 2 ? "Lumayan! Tapi masih harus lebih sering bareng nih 😆"
              : "Hehe gapapa, nanti aku ajarin pelan-pelan 🥰";
    quizScoreEl.textContent = `Skor: ${quizScore}/${KUIS.length} — ${pesan}`;
    fireConfetti();
    return;
  }

  const soal = KUIS[quizIdx];
  quizEl.innerHTML = `
    <div class="quiz__progress">Pertanyaan ${quizIdx + 1} dari ${KUIS.length}</div>
    <div class="quiz__q">${soal.q}</div>
    <div class="quiz__opts"></div>
  `;
  const optsBox = quizEl.querySelector(".quiz__opts");
  soal.opts.forEach((opt, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "quiz__opt";
    b.textContent = opt;
    b.addEventListener("click", () => {
      // disable semua tombol
      optsBox.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
      if (i === soal.benar) {
        b.classList.add("quiz__opt--correct");
        quizScore++;
      } else {
        b.classList.add("quiz__opt--wrong");
        optsBox.querySelectorAll("button")[soal.benar].classList.add("quiz__opt--correct");
      }
      setTimeout(() => { quizIdx++; renderKuis(); }, 1100);
    });
    optsBox.appendChild(b);
  });
}

/* ===================================================
   💌 BALASAN DARI AYA (kirim ke spreadsheet)
=================================================== */
const replyBtn = document.getElementById("replyBtn");
const replyText = document.getElementById("replyText");
const replyStatus = document.getElementById("replyStatus");

if (replyBtn) {
  replyBtn.addEventListener("click", async () => {
    const pesan = replyText.value.trim();
    if (!pesan) { replyStatus.style.color = "#FF6B8B"; replyStatus.textContent = "Tulis dulu pesannya ya 🥺"; return; }

    replyBtn.disabled = true;
    replyStatus.style.color = "#5C3D46";
    replyStatus.textContent = "Mengirim... 💌";

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ kado: "💬 PESAN DARI AYA: " + pesan, kategori: "Balasan" }),
        redirect: "follow",
      });
      replyStatus.style.color = "#4CAF50";
      replyStatus.textContent = "Terkirim! Makasih ya 🥰💗";
      replyText.value = "";
      fireConfetti();
    } catch (err) {
      replyStatus.style.color = "#FF6B8B";
      replyStatus.textContent = "Yaah gagal kirim 😢 coba lagi ya.";
    } finally {
      replyBtn.disabled = false;
    }
  });
}

/* ===== INIT ===== */
renderCatalog();
renderGallery();
updateCheckoutBtn();
drawWheel();
renderKupon();
renderKuis();
renderTimeline();
