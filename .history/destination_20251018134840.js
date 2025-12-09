document.addEventListener("DOMContentLoaded", () => {
  init();
});



// const video = document.querySelector(".image-scroll");

//   const observer = new IntersectionObserver(
//     entries => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           video.play();                   
//           video.classList.add("visible");  
//         } else {
//           video.pause();                  
//           video.classList.remove("visible");
//         }
//       });
//     },
//     { threshold: 0.3 } 
//   );

//   observer.observe(video);


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



//test

const touristSpots = [
  {
    name: "Tokyo Tower",
    image:"japan.jpg",
    description: "An iconic red-and-white tower offering stunning views of Tokyo's skyline.",
    details: {
      history: "Built in 1958 as a symbol of Japan’s post-war rebirth.",
      info: "Height: 333 meters; inspired by the Eiffel Tower."
    }
  },
  {
    name: "Senso-ji Temple",
    image:"korea.jpg",
    description: "Tokyo’s oldest Buddhist temple, located in Asakusa.",
    details: {
      history: "Founded in 645 AD; one of Japan’s most visited spiritual sites.",
      info: "Famous for its Kaminarimon (Thunder Gate)."
    }
  },
  {
    name: "Shibuya Crossing",
    image:"paris.jpg",
    description: "The world-famous intersection where hundreds cross at once.",
    details: {
      history: "Became iconic for representing Tokyo’s organized chaos.",
      info: "Featured in multiple movies and ads."
    }
  }
];


const carouselInner = document.querySelector("#touristCarousel .carousel-inner");
const indicators = document.querySelector(".carousel-indicators");
const imageScroll = document.querySelector(".image-scroll")

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
      <button class="History">History</button>
      <button>Details</button>
    </div>
    <p>${spot.description}</p>
  `;

  carouselInner.appendChild(item);
});

// Set initial image
imageScroll.src = touristSpots[0].image;

// Listen to carousel slide change
const touristCarousel = document.querySelector('#touristCarousel');
touristCarousel.addEventListener('slid.bs.carousel', (event) => {
  const activeIndex = event.to; // Bootstrap gives the new index
  imageScroll.src = touristSpots[activeIndex].image;
});
