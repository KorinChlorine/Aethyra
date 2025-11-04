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
    updateMainCard(certainPlace)
    createReviews(certainPlace)
    renderTouristSpots(certainPlace.touristSpots)
    renderFood(certainPlace.Foods)
    RenderActivities(certainPlace.Activities)
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
  const carouselTitle = document.querySelector(".HeroTitle"); 
  carouselTitle.textContent = ` ${place.name}` 
  const title = document.querySelector(".card-title");

  carouselInner.innerHTML = "";
  title.textContent = place.name;

  place.carousel?.forEach((src, i) => {
    const div = document.createElement("div");
    div.className = `carousel-item${i === 0 ? " active" : ""}`;
    div.innerHTML = `<img src="${src}" class="img-fluid d-block w-100 h-100" alt="${place.name}">`;
    carouselInner.appendChild(div);
  });
}

// function for updating the about the place card
function updateMainCard(Destination){
  const title = document.querySelector(".destination-title")
  const desc = document.querySelector(".destination-description")
  title.textContent = Destination.name
  desc.textContent = Destination.description
}

//create pagination for reviews
function createReviews(certainPlace) {
  let currentIndex = 0;

  const title = document.getElementById("reviewTitle");
  const text = document.getElementById("reviewText");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const dotsContainer = document.getElementById("dots");
  const starsContainer = document.getElementById("stars"); // ⭐ container for stars (add in HTML)

  dotsContainer.innerHTML = ""; // clear previous dots
  starsContainer.innerHTML = ""; // clear stars if any

  // Create dots dynamically
  certainPlace.reviews.forEach((review, index) => {
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
    const review = certainPlace.reviews[currentIndex];

    // Fade animation
    title.style.opacity = 0;
    text.style.opacity = 0;
    starsContainer.style.opacity = 0;

    setTimeout(() => {
      title.textContent = review.title;
      text.textContent = review.text;

      // === STAR RATING DISPLAY ===
      starsContainer.innerHTML = ""; // clear old stars
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.innerHTML = i <= review.rating ? "&#9733;" : "&#9734;"; // ★ or ☆
        star.style.cssText = `
          color: gold;
          font-size: 1.5rem;
          margin-right: 2px;
          transition: 0.3s;
        `;
        starsContainer.appendChild(star);
      }

      dots.forEach((dot, i) => {
        dot.style.background = i === currentIndex ? "white" : "gray";
      });

      title.style.opacity = 1;
      text.style.opacity = 1;
      starsContainer.style.opacity = 1;
    }, 200);
  }

  // Initialize first review
  updateCard();

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % certainPlace.reviews.length;
    updateCard();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + certainPlace.reviews.length) % certainPlace.reviews.length;
    updateCard();
  });
}


// Render Tourist Spots
function renderTouristSpots(touristSpots) {
  const carousel = document.querySelector("#touristCarousel");
  const carouselInner = carousel.querySelector(".carousel-inner");
  const indicators = carousel.querySelector(".carousel-indicators");
  const imageScroll = document.querySelector(".tourist-section-pic");
  const touristCard = document.querySelector(".tourist-section-card");

  // Clear old content (optional)
  carouselInner.innerHTML = "";
  indicators.innerHTML = "";

  touristSpots.forEach((spot, index) => {
    // --- Create indicator ---
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#touristCarousel";
    indicator.dataset.bsSlideTo = index;
    if (index === 0) indicator.classList.add("active");
    indicators.appendChild(indicator);

    // --- Create carousel item ---
    const item = document.createElement("div");
    item.classList.add("carousel-item", "section-item");
    if (index === 0) item.classList.add("active");

    // store image as data attribute (used for bg updates)
    item.dataset.bg = spot.image;

    item.innerHTML = `
      <h3 class="fw-bold tourist-title">${spot.name}</h3>
      <div class="card-navigation-button position-relative">
        <button class="History active">History</button>
        <button class="Destination">Details</button>
      </div>
      <p class="info">${spot.details.history}</p>
    `;

    carouselInner.appendChild(item);

    // --- Handle inner text toggle ---
    const history = item.querySelector(".History");
    const destination = item.querySelector(".Destination");
    const info = item.querySelector(".info");

    history.addEventListener("click", () => {
      info.textContent = spot.details.history;
      history.classList.add("active");
      destination.classList.remove("active");
    });

    destination.addEventListener("click", () => {
      info.textContent = spot.details.info;
      destination.classList.add("active");
      history.classList.remove("active");
    });
  });

  // --- Set initial background ---
  const firstItem = carousel.querySelector(".carousel-item.active");
  if (firstItem) {
    const bgUrl = firstItem.dataset.bg;
    imageScroll.src = bgUrl;
    touristCard.style.setProperty("--bg-url", `url(${bgUrl})`);
  }

  // --- Update background on slide change ---
  carousel.addEventListener("slid.bs.carousel", (e) => {
    const activeItem = e.relatedTarget; // not "event.relatedTarget"
    const bgUrl = activeItem.dataset.bg;

    // Optional: update your <img> if you still have it
    if (imageScroll) imageScroll.src = bgUrl;

    // Update pseudo-element background via CSS variable
    touristCard.style.setProperty("--bg-url", `url(${bgUrl})`);
  });
}





// Render Foods
function renderFood(Foods) {
  const carousel = document.querySelector("#FoodCarousel");
  const carouselInner = carousel.querySelector(".carousel-inner");
  const indicators = carousel.querySelector(".carousel-indicators");
   const imageScroll = document.querySelector(".food-section-pic");
  const cardContainer = document.querySelector(".food-section-card"); // the card with background

  // Clear old content
  carouselInner.innerHTML = "";
  indicators.innerHTML = "";

  Foods.forEach((food, index) => {
    // Create indicator
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#FoodCarousel";
    indicator.dataset.bsSlideTo = index;
    if (index === 0) indicator.classList.add("active");
    indicators.appendChild(indicator);

    // Create carousel item
    const item = document.createElement("div");
    item.classList.add("carousel-item", "section-item");
    if (index === 0) item.classList.add("active");
    item.dataset.bg = food.Image; // store the bg image URL

    item.innerHTML = `
      <h3 class="fw-bold food-title">${food.FoodName}</h3>
      <div class="card-navigation-button position-relative">
        <button class="About active">About</button>
        <button class="WhereToFind">Where to find it</button>
      </div>
      <p class="info food-info position-relative w-100">${food.About}</p>
    `;

    carouselInner.appendChild(item);

    // Toggle button logic
    const About = item.querySelector(".About");
    const WhereToFind = item.querySelector(".WhereToFind");
    const info = item.querySelector(".info");

    About.addEventListener("click", () => {
      info.textContent = food.About;
      About.classList.add("active");
      WhereToFind.classList.remove("active");
    });

    WhereToFind.addEventListener("click", () => {
      info.textContent = food.Location;
      WhereToFind.classList.add("active");
      About.classList.remove("active");
    });
  });

  // --- Set initial background ---
  const firstItem = carousel.querySelector(".carousel-item.active");
  if (firstItem) {
    const bgUrl = firstItem.dataset.bg;
    imageScroll.src = bgUrl;
    cardContainer.style.setProperty("--bg-url", `url(${bgUrl})`);
  }

  // --- Update background on slide change ---
  carousel.addEventListener("slid.bs.carousel", (e) => {
    const activeItem = e.relatedTarget; // not "event.relatedTarget"
    const bgUrl = activeItem.dataset.bg;

    // Optional: update your <img> if you still have it
    if (imageScroll) imageScroll.src = bgUrl;

    // Update pseudo-element background via CSS variable
    cardContainer.style.setProperty("--bg-url", `url(${bgUrl})`);
  });
}



// function for rendering activities
function RenderActivities(Activities) {
  const carousel = document.querySelector("#ActivitiesCarousel");
  const carouselInner = carousel.querySelector(".carousel-inner");
  const indicators = carousel.querySelector(".carousel-indicators");
  const imageScroll = document.querySelector(".image-scroll-activities");

  Activities.forEach((activity, index) => {
    // Indicator
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#ActivitiesCarousel"; // fix ID
    indicator.dataset.bsSlideTo = index;
    if (index === 0) indicator.classList.add("active");
    indicators.appendChild(indicator);

    // Carousel item
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    if (index === 0) item.classList.add("active");

    item.innerHTML = `
      <h3 class="fw-bold activities-title">${activity.name}</h3>
      <div class="card-navigation-button position-relative">
        <button class="details-btn active">Details</button>
        <button class="location-btn">Location</button>
      </div>
      <div class="activity-content">
        <div class="details-content">
          <p><strong>Price:</strong> ${activity.price} ${activity.currency}</p>
          <p><strong>Age Requirement:</strong> ${activity.ageRequirement}</p>
          <p>${activity.description}</p>
        </div>
        <div class="location-content" style="display:none;">
          <p><strong>Venue:</strong> ${activity.place}</p>
          <p><strong>Address:</strong> ${activity.location}</p>
          <p><strong>Contact:</strong> ${activity.contact}</p>
        </div>
      </div>
    `;

    carouselInner.appendChild(item);

    // Button toggle
    const detailsBtn = item.querySelector(".details-btn");
    const locationBtn = item.querySelector(".location-btn");
    const detailsContent = item.querySelector(".details-content");
    const locationContent = item.querySelector(".location-content");

    detailsBtn.addEventListener("click", () => {
      detailsContent.style.display = "block";
      locationContent.style.display = "none";
      detailsBtn.classList.add("active");
      locationBtn.classList.remove("active");
    });

    locationBtn.addEventListener("click", () => {
      detailsContent.style.display = "none";
      locationContent.style.display = "block";
      detailsBtn.classList.remove("active");
      locationBtn.classList.add("active");
    });
  });

  // Set initial image
  imageScroll.src = Activities[0].Image;

  // Update image on slide
  carousel.addEventListener("slid.bs.carousel", (event) => {
    const activeIndex = event.to;
    imageScroll.src = Activities[activeIndex].Image;
  });
}


