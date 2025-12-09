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
  const carouselTitle = document.querySelector(".tit"); 
  carouselTitle.textContent = `Visit ${place.name}` 
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


//create pagination for reviews
function createReviews(certainPlace) {
  let currentIndex = 0;

  const title = document.getElementById("reviewTitle");
  const text = document.getElementById("reviewText");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const dotsContainer = document.getElementById("dots");

  dotsContainer.innerHTML = ""; // clear previous dots if any

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

    setTimeout(() => {
      title.textContent = review.title;
      text.textContent = review.text;

      dots.forEach((dot, i) => {
        dot.style.background = i === currentIndex ? "white" : "gray";
      });

      title.style.opacity = 1;
      text.style.opacity = 1;
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
  const imageScroll = document.querySelector(".image-scroll.tourist");

  touristSpots.forEach((spot, index) => {
    // Indicator
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#touristCarousel";
    indicator.dataset.bsSlideTo = index;
    if (index === 0) indicator.classList.add("active");
    indicators.appendChild(indicator);

    // Carousel item
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    if (index === 0) item.classList.add("active");

    item.innerHTML = `
      <h3 class="fw-bold tourist-title">${spot.name}</h3>
      <div class="card-navigation-button position-relative">
        <button class="History active">History</button>
        <button class="Destination">Details</button>
      </div>
      <p class="info">${spot.details.history}</p>
    `;

    carouselInner.appendChild(item);

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

  imageScroll.src = touristSpots[0].image;

  carousel.addEventListener("slid.bs.carousel", (event) => {
    const activeIndex = event.to;
    imageScroll.src = touristSpots[activeIndex].image;
  });
}

// Render Foods
function renderFood(Foods) {
  const carousel = document.querySelector("#FoodCarousel");
  const carouselInner = carousel.querySelector(".carousel-inner");
  const indicators = carousel.querySelector(".carousel-indicators");
  const imageScrollFood = document.querySelector(".image-scroll-food");

  Foods.forEach((food, index) => {
    // Indicator
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#FoodCarousel";
    indicator.dataset.bsSlideTo = index;
    if (index === 0) indicator.classList.add("active");
    indicators.appendChild(indicator);

    // Carousel item
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    if (index === 0) item.classList.add("active");

    item.innerHTML = `
      <h3 class="fw-bold food-title">${food.FoodName}</h3>
      <div class="card-navigation-button position-relative">
       <button class="About active">About</button>
       <button class="WhereToFind">Where to find it</button>
       </div>
      <p class="info food-info position-relative w-100">${food.About}</p>
    `;

    carouselInner.appendChild(item);

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

  imageScrollFood.src = Foods[0].Image;

  carousel.addEventListener("slid.bs.carousel", (event) => {
    const activeIndex = event.to;
    imageScrollFood.src = Foods[activeIndex].Image;
  });
}

// function for rendering activities
function RenderActivities(Activities){
  const carousel = document.querySelector("#ActivitiesCarousel");
  const carouselInner = carousel.querySelector(".carousel-inner");
  const indicators = carousel.querySelector(".carousel-indicators");
  const imageScroll = document.querySelector(".image-scroll.activities");

  Activities.forEach((activity, index) => {
    // Indicator
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#touristCarousel";
    indicator.dataset.bsSlideTo = index;
    if (index === 0) indicator.classList.add("active");
    indicators.appendChild(indicator);

    // Carousel item
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    if (index === 0) item.classList.add("active");

    item.innerHTML = `
      <h3 class="fw-bold tourist-title">${activity.name}</h3>
      <div class="card-navigation-button position-relative">
        <button class="History active">History</button>
        <button class="Destination">Details</button>
      </div>
      
      
      <p class="info">${activity.description}</p>
    `;

    carouselInner.appendChild(item);

    
  });

  imageScroll.src = touristSpots[0].image;

  carousel.addEventListener("slid.bs.carousel", (event) => {
    const activeIndex = event.to;
    imageScroll.src = touristSpots[activeIndex].image;
  });

}

