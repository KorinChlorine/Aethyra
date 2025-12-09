const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

// Initialize classes
slides.forEach((slide, index) => {
  slide.classList.remove("left", "center", "right");
  if (index === 0) slide.classList.add("center");
  else if (index === 1) slide.classList.add("right");
  else if (index === totalSlides - 1) slide.classList.add("left");
});

function rotateSlides() {
  slides.forEach(slide => {
    // Get current state
    if (slide.classList.contains("left")) {
      slide.classList.remove("left"); // disappear/offscreen
    } else if (slide.classList.contains("center")) {
      slide.classList.remove("center");
      slide.classList.add("left"); // move to left peek
    } else if (slide.classList.contains("right")) {
      slide.classList.remove("right");
      slide.classList.add("center"); // move to center
    }
  });

  // Find next slide to become .right
  const currentCenters = Array.from(slides).find(slide => slide.classList.contains("center"));
  const nextIndex = (Array.from(slides).indexOf(currentCenters) + 1) % totalSlides;
  slides[nextIndex].classList.add("right");
}

// Auto rotate every 4 seconds
setInterval(rotateSlides, 4000);
// clock

function updateDateLabel() {
  const now = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const formattedDate = now.toLocaleString("en-US", options);

  document.getElementById("date-label").textContent = formattedDate;
}

// Update once per second
setInterval(updateDateLabel, 1000);

// Initial call
updateDateLabel();

function drawClock(canvasId, timeZone) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const radius = canvas.height / 2;
  ctx.translate(radius, radius);

  setInterval(() => {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius, timeZone);
  }, 1000);
}

function drawFace(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();

  // border
  ctx.lineWidth = radius * 0.05;
  ctx.stroke();
}

function drawNumbers(ctx, radius) {
  let ang;
  ctx.font = radius * 0.28 + "px Arial";   // larger numbers
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  for (let num = 1; num <= 12; num++) {
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.82);     // closer to the edge
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.82);
    ctx.rotate(-ang);
  }
}


function drawTime(ctx, radius, zone) {
  const now = new Date();
  const local = new Date(now.toLocaleString("en-US", { timeZone: zone }));

  let hour = local.getHours();
  let minute = local.getMinutes();
  let second = local.getSeconds();

  hour = hour % 12;
  hour = (hour * Math.PI / 6) +
         (minute * Math.PI / (6 * 60)) +
         (second * Math.PI / (360 * 60));

  // hour hand
  drawHand(ctx, hour, radius * 0.5, radius * 0.06);

  // minute hand
  let minuteAng = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
  drawHand(ctx, minuteAng, radius * 0.75, radius * 0.04);

  // second hand
  let secondAng = second * Math.PI / 30;
  drawHand(ctx, secondAng, radius * 0.85, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}



// Store intervals so they can be replaced
const clockIntervals = {};

// Draw clock with clearable interval
function startClock(canvasId, zone) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  const radius = canvas.width / 2;

  // Always reset transform BEFORE redrawing
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Center drawing
  ctx.translate(radius, radius);

  // Remove old timer
  if (clockIntervals[canvasId]) {
    clearInterval(clockIntervals[canvasId]);
  }

  // Create new timer
  clockIntervals[canvasId] = setInterval(() => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);   // reset each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);

    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius, zone);
  }, 1000);
}


// Initial clocks
startClock("clock-ny", "America/New_York");
startClock("clock-london", "Europe/London");
startClock("clock-moscow", "Europe/Moscow");
startClock("clock-tokyo", "Asia/Tokyo");

// Open modal
document.getElementById("change-timezone-btn").addEventListener("click", () => {
  document.getElementById("tz-modal").classList.remove("hidden");
});

// Close modal
document.getElementById("close-tz-btn").addEventListener("click", () => {
  document.getElementById("tz-modal").classList.add("hidden");
});

// Apply new timezone
document.getElementById("apply-tz-btn").addEventListener("click", () => {
  const selectedClock = document.getElementById("clock-select").value;
  const selectedZone = document.getElementById("timezone-select").value;

  startClock(selectedClock, selectedZone);

  // UPDATE THE CLOCK LABEL 
  const label = document.getElementById("label-" + selectedClock);

  const cleanName = selectedZone.split("/")[1].replace("_", " ");

  label.textContent = cleanName;

  document.getElementById("tz-modal").classList.add("hidden");
});


const funFacts = [
  "Japan has more than 5 million vending machines.",
  "Iceland has no mosquitoes, yes zero!",
  "Canada has the most lakes in the world.",
  "In Switzerland, it’s illegal to own just one guinea pig.",
  "The shortest flight in the world lasts only 90 seconds.",
  "Mahal mo sya pero di ka niya mahal"
];

function setRandomFunFact() {
  const random = Math.floor(Math.random() * funFacts.length);
  document.getElementById("fun-fact").textContent = funFacts[random];
}

// Initial fact
setRandomFunFact();

// Refresh button
document.querySelector(".refresh").addEventListener("click", setRandomFunFact);

// CURRENCY EXCHANGE
const rates = {
  USD: { PHP: 56, EUR: 0.92, JPY: 150 },
  PHP: { USD: 0.018, EUR: 0.016, JPY: 2.7 },
  EUR: { USD: 1.09, PHP: 61, JPY: 163 },
  JPY: { USD: 0.0067, PHP: 0.37, EUR: 0.0061 }
};

document.getElementById("calcBtn").addEventListener("click", () => {

  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;

  if (!amount || !from || !to) {
    alert("Please complete all fields.");
    return;
  }

  if (from === to) {
    alert("Please choose different currencies.");
    return;
  }

  const rate = rates[from][to];
  const converted = amount * rate;

  document.getElementById("rate-result").textContent =
    `${amount} ${from} = ${converted.toFixed(2)} ${to}`;

  const now = new Date();
  document.getElementById("rate-time").textContent =
    `as of ${now.toLocaleString()}`;
});


/* HERO CAROUSEL AUTO-SLIDER */

const heroSlides = document.querySelectorAll(".hero-slide");
let heroIndex = 0;

function switchHeroSlide() {
  // remove active
  heroSlides.forEach(slide => slide.classList.remove("active"));

  // next slide
  heroIndex = (heroIndex + 1) % heroSlides.length;

  // activate new slide
  heroSlides[heroIndex].classList.add("active");
}

// auto slide every 5 seconds
setInterval(switchHeroSlide, 5000);
