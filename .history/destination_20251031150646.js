document.addEventListener("DOMContentLoaded", () => {
  init();
});


async function init() {
  try {
    const params = new URLSearchParams(window.location.search);
    const continentName = params.get("continent");
    const countryName = params.get("country");
    const placeId = params.get("place");

    const data = await fetchData("data.json");

    const continentData = data.find(c => c.continent === continentName);
    if (!continentData) throw new Error("Continent not found");

    const countryData = continentData.countries.find(c => c.country === countryName);
    if (!countryData) throw new Error("Country not found");

    const cityData = countryData.cities.find(city => city.id == placeId);
    if (!cityData) throw new Error("City not found");

    renderCarousel(cityData);
    updateMainCard(cityData);
    createReviews(cityData);
    renderTouristSpots(cityData.touristSpots);
    renderFood(cityData.Foods);
    RenderActivities(cityData.Activities);
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
  // const title = document.querySelector(".card-title");

  carouselInner.innerHTML = "";
  // title.textContent = place.name;

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
let reviews = [];
let currentIndex = 0;

function createReviews(placeData) {
  const reviewsArray = placeData.reviews || [];

  // Map incoming data to the expected review format
  reviews = reviewsArray.map((item, index) => ({
    id: item.id || index + 1,
    name: item.title || item.name || "Anonymous",
    username: item.name || "Verified Guest",
    text: item.text || item.description || "",
    rating: item.rating || 5,
    image: item.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.title || index}`,
  }));

  // Reset to first review and render
  currentIndex = 0;
  renderReview();
}

function renderReview() {
  if (!reviews.length) return;

  const review = reviews[currentIndex];

  // document.getElementById("authorName").textContent = review.name;
  document.getElementById("reviewText").textContent = `"${review.text}"`;
  document.getElementById("authorImage").src = review.image;
  document.getElementById("authorImage").alt = review.name;
  document.getElementById("authorUsername").textContent = review.username;

  // Update stars
  const starsContainer = document.getElementById("starsContainer");
  starsContainer.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i");
    star.className = `fas fa-star star ${i < review.rating ? "filled" : ""}`;
    starsContainer.appendChild(star);
  }

  // Update pagination dots
  const dotsContainer = document.getElementById("paginationDots");
  dotsContainer.innerHTML = "";
  reviews.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `dot ${index === currentIndex ? "active" : ""}`;
    dot.setAttribute("aria-label", `Go to review ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      renderReview();
    });
    dotsContainer.appendChild(dot);
  });
}

function goToPrevious() {
  currentIndex = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
  renderReview();
}

function goToNext() {
  currentIndex = currentIndex === reviews.length - 1 ? 0 : currentIndex + 1;
  renderReview();
}

// Event listeners
document.getElementById("prevBtn").addEventListener("click", goToPrevious);
document.getElementById("nextBtn").addEventListener("click", goToNext);




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
  console.log(touristSpots)

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
  const imageScroll = document.querySelector(".activities-section-pic");
  const ActivitiesCard = document.querySelector(".Activities-section-card");

  // Clear old content
  carouselInner.innerHTML = "";
  indicators.innerHTML = "";

  Activities.forEach((activity, index) => {
    // --- Create indicator ---
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#ActivitiesCarousel";
    indicator.dataset.bsSlideTo = index;
    if (index === 0) indicator.classList.add("active");
    indicators.appendChild(indicator);

    // --- Create carousel item ---
    const item = document.createElement("div");
    item.classList.add("carousel-item", "section-item");
    if (index === 0) item.classList.add("active");

    // store image as data attribute (for easy updates)
    item.dataset.bg = activity.Image;

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

    // --- Button toggle ---
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
  const firstItem = carousel.querySelector(".carousel-item.active");
  if (firstItem) {
    const bgUrl = firstItem.dataset.bg;
    imageScroll.src = bgUrl;
    ActivitiesCard.style.setProperty("--bg-url", `url(${bgUrl})`);
  }

  // Update image on slide change
  carousel.addEventListener("slid.bs.carousel", (e) => {
    const activeItem = e.relatedTarget;
    const bgUrl = activeItem.dataset.bg;
    imageScroll.src = bgUrl;

    // Optional: update image
    if (imageScroll) imageScroll.src = bgUrl;

    // Update pseudo-element background via CSS variable
    ActivitiesCard.style.setProperty("--bg-url", `url(${bgUrl})`);

  });
}



