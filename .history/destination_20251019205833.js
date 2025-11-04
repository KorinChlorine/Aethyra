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


//function for rendering tourist spots
const touristSpots = [
    {
      name: "Tokyo Tower",
      image: "tokyo.jpg",
      details: {
        history:
          "Tokyo Tower was completed in 1958 and was inspired by the Eiffel Tower in Paris. It symbolizes Japan’s post-war recovery and modernization.",
        info:
          "Tokyo Tower is 333 meters tall and serves as a communications and observation tower located in Minato, Tokyo.",
      },
    },
    {
      name: "Senso-ji Temple",
      image: "sensoji.jpg",
      details: {
        history:
          "Senso-ji is Tokyo’s oldest Buddhist temple, founded in 645 AD. It was built to honor the goddess Kannon.",
        info:
          "Located in Asakusa, it is famous for its huge red lantern and vibrant market street, Nakamise-dori.",
      },
    },
    {
      name: "Shibuya Crossing",
      image: "shibuya.jpg",
      details: {
        history:
          "Shibuya Crossing became famous as a symbol of Tokyo’s fast-paced urban life in the late 20th century.",
        info:
          "Hundreds of people cross at once in all directions, surrounded by neon lights and big screens.",
      },
    },
  ];

  let index = 0;
  const spotName = document.getElementById("spotName");
  const spotDesc = document.getElementById("spotDesc");
  const spotImage = document.getElementById("spotImage");
  const historyBtn = document.getElementById("historyBtn");
  const detailsBtn = document.getElementById("detailsBtn");

  function updateSpot() {
    const spot = touristSpots[index];
    spotName.textContent = spot.name;
    spotDesc.textContent = spot.details.history;
    spotImage.src = spot.image;
    historyBtn.classList.add("active");
    detailsBtn.classList.remove("active");
  }

  document.getElementById("nextBtn").addEventListener("click", () => {
    index = (index + 1) % touristSpots.length;
    updateSpot();
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    index = (index - 1 + touristSpots.length) % touristSpots.length;
    updateSpot();
  });

  historyBtn.addEventListener("click", () => {
    const spot = touristSpots[index];
    spotDesc.textContent = spot.details.history;
    historyBtn.classList.add("active");
    detailsBtn.classList.remove("active");
  });

  detailsBtn.addEventListener("click", () => {
    const spot = touristSpots[index];
    spotDesc.textContent = spot.details.info;
    detailsBtn.classList.add("active");
    historyBtn.classList.remove("active");
  });

  // Initialize first spot
  updateSpot();



// function for rendering food
function renderFood(Foods){
  const carouselInner = document.querySelector("#FoodCarousel .carousel-inner");
  const indicators = document.querySelector(".carousel-indicators");
  const imageScrollFood = document.querySelector(".image-scroll-food")

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
    <h3 class="fw-bold food-title position-relative">${food.FoodName}</h3>
    <p class="info"> ${food.Description}</p>
  `;

    carouselInner.appendChild(item);
    // scope buttons and info to the current carousel item
  });

  // Set initial image
  imageScrollFood.src = Foods[0].Image;

  // Listen to carousel slide change
  const FoodCarousel = document.querySelector('#FoodCarousel');
  FoodCarousel.addEventListener('slid.bs.carousel', (event) => {
    const activeIndex = event.to;
    imageScrollFood.src = Foods[activeIndex].Image;
  });
}


