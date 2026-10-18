// Optional: paste a link to message Ryan, e.g. "https://wa.me/60123456789"
// Leave it empty to hide the "PM Ryan" button.
const PM_LINK = "";

const $ = (id) => document.getElementById(id);
const pages = document.querySelectorAll(".page");

function showPage(id) {
  pages.forEach((p) => p.classList.toggle("active", p.id === id));
  document.body.classList.toggle("sad", id === "page-no");
}

if (PM_LINK) {
  $("pm-link").href = PM_LINK;
  $("pm-link").hidden = false;
}

/* ---------- balloons ---------- */
const colors = ["#ff5d8f", "#ffd166", "#4cc9f0", "#a78bfa", "#06d6a0", "#ff9f1c"];

function launchBalloons(count = 28) {
  const box = $("balloons");
  for (let i = 0; i < count; i++) {
    const b = document.createElement("div");
    const size = 44 + Math.random() * 36;
    b.className = "balloon";
    b.style.width = size + "px";
    b.style.height = size * 1.25 + "px";
    b.style.left = Math.random() * 95 + "vw";
    b.style.setProperty("--c", colors[i % colors.length]);
    b.style.setProperty("--t", 6 + Math.random() * 5 + "s");
    b.style.setProperty("--d", Math.random() * 2.5 + "s");
    b.addEventListener("animationend", () => b.remove());
    box.appendChild(b);
  }
}

/* ---------- fireworks ---------- */
const canvas = $("fireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let launching = false;
let looping = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function burst(x, y) {
  const hue = Math.random() * 360;
  for (let i = 0; i < 70; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      hue: hue + Math.random() * 40,
    });
  }
}

function loop() {
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + 0.06;
    p.life -= 0.014;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${Math.max(p.life, 0)})`;
    ctx.fill();
  }
  particles = particles.filter((p) => p.life > 0);

  if (particles.length || launching) {
    requestAnimationFrame(loop);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    looping = false;
  }
}

function fireworks(duration = 6000) {
  launching = true;
  const timer = setInterval(() => {
    burst(
      canvas.width * (0.1 + Math.random() * 0.8),
      canvas.height * (0.1 + Math.random() * 0.45)
    );
  }, 450);
  setTimeout(() => {
    clearInterval(timer);
    launching = false;
  }, duration);
  if (!looping) {
    looping = true;
    loop();
  }
}

/* ---------- rain (for the sad page) ---------- */
(function makeRain() {
  const box = $("rain");
  for (let i = 0; i < 60; i++) {
    const d = document.createElement("div");
    d.className = "drop";
    d.style.left = Math.random() * 100 + "vw";
    d.style.setProperty("--t", 0.9 + Math.random() * 0.9 + "s");
    d.style.setProperty("--d", Math.random() * 2 + "s");
    box.appendChild(d);
  }
})();

/* ---------- buttons ---------- */
$("btn-yes").addEventListener("click", () => {
  showPage("page-yes");
  launchBalloons();
  fireworks();
});

$("btn-no").addEventListener("click", () => showPage("page-no"));
$("btn-back").addEventListener("click", () => showPage("page-invite"));

$("celebrate").addEventListener("click", () => {
  launchBalloons(18);
  fireworks(4000);
});