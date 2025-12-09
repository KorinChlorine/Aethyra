document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  try {
    const params = new URLSearchParams(window.location.search);
    const continentName = params.get("continent");
    const placeId = params.get("place");

    const data = await fetchData("data.json");
    const continentData = data.find(c => c.continent === continentName);
    const certainPlace = continentData?.places.find(p => p.id == placeId);

    if (!certainPlace) throw new Error("Place not found");

    renderCarousel(certainPlace);
  } catch (err) {
    console.error(err);
  }
}

async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

function renderCarousel(place) {
  const carouselInner = document.querySelector(".carousel-inner");
  const title = document.querySelector(".card-title");

  carouselInner.innerHTML = "";
  title.textContent = place.name;

  place.carousel?.forEach((src, i) => {
    const div = document.createElement("div");
    div.className = `carousel-item${i === 0 ? " active" : ""}`;
    div.innerHTML = `<img src="${src}" class="d-block w-100" alt="${place.name}">`;
    carouselInner.appendChild(div);
  });
}

const reviews = [
    {
      title: "John Doe",
      text: "Amazing place to visit! The experience was unforgettable."
    },
    {
      title: "Jane Smith",
      text: "Great atmosphere and very friendly locals."
    },
    {
      title: "Alex Tan",
      text: "Beautiful scenery and peaceful environment. 10/10!"
    },
    {
      title: "Maria Lopez",
      text: "I’d definitely recommend this destination to my friends."
    }
  ];

  let currentIndex = 0;

  const title = document.getElementById("reviewTitle");
  const text = document.getElementById("reviewText");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const dotsContainer = document.getElementById("dots");

  // Create dots dynamically
  reviews.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    dot.style.cssText = `
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${index === 0 ? "white" : "gray"};
      cursor: pointer;
      transition: 0.3s;
    `;
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCard();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function updateCard() {
    // Add a simple fade animation
    title.style.opacity = 0;
    text.style.opacity = 0;
    setTimeout(() => {
      title.textContent = reviews[currentIndex].title;
      text.textContent = reviews[currentIndex].text;
      dots.forEach((dot, i) => {
        dot.style.background = i === currentIndex ? "white" : "gray";
      });
      title.style.opacity = 1;
      text.style.opacity = 1;
    }, 200);
  }

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % reviews.length;
    updateCard();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    updateCard();
  });
