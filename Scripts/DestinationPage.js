document.addEventListener("DOMContentLoaded", () => {
  init();
});

// FETCH DATA
//general variables
let currentCity_id;

// fetch cities
async function fetchCities(city_id) {
    const res = await fetch(`../Backend/getCities.php?city_id=${city_id}`)
    const cities = await res.json()
    return cities
}

// fetch city images
async function fetchCityImages(city_id) {
    const res = await fetch(`../Backend/getCityImages.php?city_id=${city_id}`)
    const cities = await res.json()
    return cities
}

// fetch tourist spots
async function fetchSpots(city_id) {
    const res = await fetch(`../Backend/getTouristSpot.php?city_id=${city_id}`)
    const spots = await res.json()
    return spots
}

//fetch foods
async function fetchFoods(city_id) {
    const res = await fetch(`../Backend/getFoods.php?city_id=${city_id}`)
    const foods = await res.json()
    return foods
}

//fetch activities
async function fetchActivities(city_id) {
    const res = await fetch(`../Backend/getActivities.php?city_id=${city_id}`)
    const activities = await res.json()
    return activities
}

async function fetchReviews(city_id) {
    const res = await fetch(`../Backend/getReviews.php?city_id=${city_id}`)
    const reviews = await res.json()
    return reviews
}

 //end of FETCH DATA
async function init() {
  try {
    const params = new URLSearchParams(window.location.search);
    const countryName = params.get("country");
    const placeId = params.get("place");   //city id

    console.log(countryName)
    console.log(placeId)
    
    currentCity_id = placeId

    const city = await fetchCities(placeId) //fetch city

    const images = await fetchCityImages(placeId) //fetch images
    console.log(images.city)

    const spots = await fetchSpots(placeId) //fetch spots

    const foods = await fetchFoods(placeId) //fetch foods

    const activities = await fetchActivities(placeId) //fetch activities

    const reviews = await fetchReviews(placeId) //fetch reviews

    // const data = await fetchData("../Scripts/data.json");



    // const countryData = continentData.countries.find(
    //   (c) => c.country === countryName
    // );
    // if (!countryData) throw new Error("Country not found");

    // const cityData = countryData.cities.find((city) => city.id == placeId);
    // if (!cityData) throw new Error("City not found");

    console.log(city.data)
    renderCarousel(city.data, countryName, images.city);
    updateMainCard(city);
    createReviews(reviews);
    renderTouristSpots(spots);
    renderFood(foods);
    RenderActivities(activities);
  } catch (err) {
    console.error(err);
  }
}

async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

function renderCarousel(city, countryName, images) {
  console.log(city)
  const carouselInner = document.querySelector(".carousel-inner");
  const carouselTitle = document.querySelector(".HeroTitle");
  const subTitle = document.querySelector(".sub-hero");

  carouselTitle.textContent = ` ${city.name}`;
  subTitle.textContent = ` ${countryName}`
  // const title = document.querySelector(".card-title");

  carouselInner.innerHTML = "";
  // title.textContent = place.name;

  //loop through carousel image
  images.forEach((imageObj, i) => {
    const div = document.createElement("div");
    div.className = `carousel-item${i === 0 ? " active" : ""}`;
    div.innerHTML = `<img src="${imageObj.image_path}" class="img-fluid d-block w-100 h-100" alt="${countryName}">`;
    carouselInner.appendChild(div);
  });
}

// function for updating the about the place card
function updateMainCard(city) {
  console.log(city)
  const title = document.querySelector(".destination-title");
  const desc = document.querySelector(".destination-description");
  title.textContent = city.data.name;
  desc.textContent = city.data.description;
}

//create pagination
let reviews = [];
let currentIndex = 0;

function createReviews(reviewsData) {
  reviews = (reviewsData || []).map((item, index) => ({
    id: item.review_id || index + 1,       
    username: item.name || "Anonymous",
    text: item.review || "",               
    rating: item.rating || 5,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name || index}`,
  }));

  currentIndex = 0;
  renderReview();
}

function renderReview() {
  if (!reviews.length) return;

  const review = reviews[currentIndex];

  document.getElementById("reviewText").textContent = `"${review.text}"`;
  document.getElementById("authorImage").src = review.image;
  document.getElementById("authorImage").alt = review.name;
  document.getElementById("authorUsername").textContent = review.username;

  // Stars
  const starsContainer = document.getElementById("starsContainer");
  starsContainer.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i");
    star.className = `fas fa-star star ${i < review.rating ? "filled" : ""}`;
    starsContainer.appendChild(star);
  }

  // Dots
  const dotsContainer = document.getElementById("paginationDots");
  dotsContainer.innerHTML = "";
  reviews.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = `dot ${idx === currentIndex ? "active" : ""}`;
    dot.setAttribute("aria-label", `Go to review ${idx + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = idx;
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
      <p class="info">${spot.history}</p>
    `;

    carouselInner.appendChild(item);

    // --- Handle inner text toggle ---
    const history = item.querySelector(".History");
    const destination = item.querySelector(".Destination");
    const info = item.querySelector(".info");

    history.addEventListener("click", () => {
      info.textContent = spot.history;
      history.classList.add("active");
      destination.classList.remove("active");
    });

    destination.addEventListener("click", () => {
      info.textContent = spot.details;
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
    item.dataset.bg = food.image; // store the bg image URL

    item.innerHTML = `
      <h3 class="fw-bold food-title">${food.name}</h3>
      <div class="card-navigation-button position-relative">
        <button class="About active">About</button>
        <button class="WhereToFind">Where to find it</button>
      </div>
      <p class="info food-info position-relative w-100">${food.about}</p>
    `;

    carouselInner.appendChild(item);

    // Toggle button logic
    const About = item.querySelector(".About");
    const WhereToFind = item.querySelector(".WhereToFind");
    const info = item.querySelector(".info");

    About.addEventListener("click", () => {
      info.textContent = food.about;
      About.classList.add("active");
      WhereToFind.classList.remove("active");
    });

    WhereToFind.addEventListener("click", () => {
      info.textContent = food.location;
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
    console.log(activity);
    item.dataset.bg = activity.image;

    item.innerHTML = `
      <h3 class="fw-bold activities-title">${activity.name}</h3>
      <div class="card-navigation-button position-relative">
        <button class="details-btn active">Description</button>
        <button class="location-btn">Location</button>
      </div>
      <div class="activity-content">
        <div class="details-content">
              <p><strong></strong> ${activity.location}</p>

        </div>
        <div class="location-content" style="display:none;">
        <p>${activity.description}</p>
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


document.querySelector(".addReview").addEventListener("click", () =>{
  openReviewModal()
})
// ================================
// OPEN & CLOSE MODAL
// ================================
const reviewModal = document.getElementById("reviewModal");
const closeModal = document.getElementById("closeModal");

// Open modal (call this when clicking the Add Review button)
function openReviewModal() {
  reviewModal.style.display = "flex";
}

// Close modal
closeModal.onclick = () => {
  reviewModal.style.display = "none";
};

// Close when clicking outside modal content
window.onclick = (event) => {
  if (event.target === reviewModal) {
    reviewModal.style.display = "none";
  }
};


// ================================
// STAR RATING SYSTEM
// ================================
const stars = document.querySelectorAll(".star-rating span");
const ratingInput = document.getElementById("reviewRating");

let selectedRating = 0;

stars.forEach(star => {
  // Hover effect
  star.addEventListener("mouseover", () => {
    highlightStars(star.dataset.value);
  });

  // Remove hover when mouse leaves the star rating container
  star.parentElement.addEventListener("mouseleave", () => {
    highlightStars(selectedRating);
  });

  // Click to select rating
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;
    ratingInput.value = selectedRating;
    highlightStars(selectedRating);
  });
});

// Highlight stars function
function highlightStars(rating) {
  stars.forEach(s => {
    s.classList.remove("hovered", "selected");
    if (s.dataset.value <= rating) {
      s.classList.add("selected");
    }
  });
}


// ================================
// FORM SUBMISSION
// ================================
document.getElementById("reviewForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("reviewName").value.trim();
  const reviewText = document.getElementById("reviewTextInput").value.trim();
  const rating = ratingInput.value;
  const city_id = document.getElementById("city_id").value = currentCity_id;

  if (!rating) {
    alert("Please select a star rating.");
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append("city_id", city_id);
  formData.append("name", name);
  formData.append("review", reviewText);
  formData.append("rating", rating);

  // SEND TO PHP BACKEND
  fetch("../Backend/addReviews.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {

    if (data.success) {
      alert("Review submitted! Waiting for approval.");
    } else {
      alert("Error: " + data.message);
    }

    // Close modal
    reviewModal.style.display = "none";

    // Reset form
    document.getElementById("reviewForm").reset();
    selectedRating = 0;
    highlightStars(0);
  })
  .catch(err => console.error("Error:", err));
});

