const typewriter = document.querySelector("#typewriter");
const cursorGlow = document.querySelector(".cursor-glow");
const sparkleCanvas = document.querySelector("#sparkle-canvas");
const sparkleButton = document.querySelector("#sparkle-button");
const meterFill = document.querySelector("#meter-fill");
const sorrySlider = document.querySelector("#sorry-slider");
const meterReadout = document.querySelector("#meter-readout");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const decisionBox = document.querySelector("#decision-box");
const decisionResponse = document.querySelector("#decision-response");
const reasonDisplay = document.querySelector("#reason-display");
const scrollButtons = document.querySelectorAll("[data-scroll]");
const reasonChips = document.querySelectorAll(".reason-chip");
const tiltCards = document.querySelectorAll(".tilt-card");

const heroLines = [
  "I said something I should not have said, and I have been replaying it in my head.",
  "You matter to me like family, which is exactly why I should have responded with more care.",
  "I am not here to defend myself. I am here to say I was wrong and I am sorry."
];

let charIndex = 0;
let lineIndex = 0;

function runTypewriter() {
  const line = heroLines[lineIndex];
  typewriter.textContent = line.slice(0, charIndex);
  charIndex += 1;

  if (charIndex <= line.length) {
    window.setTimeout(runTypewriter, 32);
    return;
  }

  window.setTimeout(() => {
    lineIndex = (lineIndex + 1) % heroLines.length;
    charIndex = 0;
    typewriter.textContent = "";
    runTypewriter();
  }, 1700);
}

function updateMeter(value) {
  meterFill.style.width = `${value}%`;

  let label = "I am politely sorry.";
  if (value > 35) label = "This is a serious apology.";
  if (value > 60) label = "I am deeply and honestly sorry.";
  if (value > 85) label = "I know my words were wrong and I regret them.";
  if (value > 97) label = "Full accountability mode: no excuses, just ownership.";

  meterReadout.textContent = `${value}% sorry. ${label}`;
}

function createSparkBurst(x, y, count = 16) {
  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement("div");
    const angle = (Math.PI * 2 * i) / count;
    const distance = 60 + Math.random() * 100;
    spark.className = "spark-burst";
    spark.textContent = i % 2 === 0 ? "✦" : "✧";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--x-shift", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--y-shift", `${Math.sin(angle) * distance}px`);
    spark.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30}deg)`;
    spark.style.color = i % 2 === 0 ? "#8c0f48" : "#fff7fb";
    document.body.appendChild(spark);
    window.setTimeout(() => spark.remove(), 1300);
  }
}

function moveNoButton() {
  const box = decisionBox.getBoundingClientRect();
  const button = noButton.getBoundingClientRect();
  const maxX = Math.max(0, box.width - button.width - 10);
  const maxY = Math.max(0, box.height - button.height - 10);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noButton.classList.add("escape-mode");
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
}

function celebrateForgiveness() {
  decisionResponse.textContent = "Thank you for hearing me out. I will let my actions match this apology.";
  createSparkBurst(window.innerWidth / 2, window.innerHeight / 2, 28);

  for (let i = 0; i < 7; i += 1) {
    window.setTimeout(() => {
      createSparkBurst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        10
      );
    }, i * 120);
  }
}

function setupSparkles() {
  const context = sparkleCanvas.getContext("2d");
  const particles = [];
  const particleCount = 70;

  function resizeCanvas() {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
  }

  function addParticle(x, y, boost = false) {
    particles.push({
      x,
      y,
      size: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * (boost ? 8 : 1.8),
      vy: (Math.random() - 0.5) * (boost ? 8 : 1.8),
      life: boost ? 100 : 180,
      hue: Math.random() > 0.5 ? 330 : 345
    });
  }

  for (let i = 0; i < particleCount; i += 1) {
    addParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
  }

  function draw() {
    context.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;

      if (particle.life <= 0) {
        particle.x = Math.random() * window.innerWidth;
        particle.y = Math.random() * window.innerHeight;
        particle.vx = (Math.random() - 0.5) * 1.8;
        particle.vy = (Math.random() - 0.5) * 1.8;
        particle.life = 180;
      }

      context.beginPath();
      context.fillStyle = `hsla(${particle.hue}, 100%, 96%, ${particle.life / 180})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(draw);
  }

  resizeCanvas();
  draw();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    if (Math.random() > 0.72) {
      addParticle(event.clientX, event.clientY);
    }
  });

  sparkleButton.addEventListener("click", () => {
    for (let i = 0; i < 36; i += 1) {
      addParticle(window.innerWidth / 2, window.innerHeight / 2, true);
    }
    createSparkBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
  });
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

reasonChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    reasonDisplay.textContent = chip.dataset.reason;
    createSparkBurst(window.innerWidth / 2, window.innerHeight * 0.75, 8);
  });
});

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = ((y / rect.height) - 0.5) * -12;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.addEventListener("pointermove", (event) => {
  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

document.addEventListener("pointerleave", () => {
  cursorGlow.style.opacity = "0";
});

sorrySlider.addEventListener("input", (event) => {
  updateMeter(event.target.value);
});

yesButton.addEventListener("click", celebrateForgiveness);
noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("click", moveNoButton);

window.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
  if (Math.random() > 0.65) {
    createSparkBurst(event.clientX, event.clientY, 10);
  }
});

updateMeter(sorrySlider.value);
runTypewriter();
setupSparkles();
