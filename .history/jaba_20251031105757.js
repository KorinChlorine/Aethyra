// ====== Global Variables ======
let values = []; // full dataset
let currentContinent = null;
const paths = document.querySelectorAll(".path");
const cardHolder = document.querySelector(".card-holder");
const titleElement = document.querySelector(".card-title");
const pagination = document.getElementById("pagination");
const AboutSection = document.querySelector(".about-container")
const PlaceSection = document.querySelector(".place-container")
const cardsPerPage = 8;
let previousContinent = null


// ====== Restore selected continent on page load ======

// ====== Restore selected continent on page load ======
document.addEventListener("DOMContentLoaded", () => {
  const savedContinent = sessionStorage.getItem("Active");
  if (savedContinent) {
    const continent = JSON.parse(savedContinent);
    console.log(continent);
    displayContinent(continent);
    changeVisibility();

    // Re-activate path
    const activePath = document.querySelector(`#${continent.continent}`);
    if (activePath) {
      activePath.classList.add("active");
      previousContinent = activePath; // optional: to maintain state
    }

    document.querySelector(".place-container").scrollIntoView({
      behavior: "smooth",
      block:"center"
    });
  }
});
// ====== Restore selected continent on page load ======


// ====== Fetch data ======
fetch("data.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch JSON");
    return res.json();
  })
  .then(data => values = data)
  .catch(err => console.error(err));
// ====== Fetch data ======



// ====== Path click listeners ======
paths.forEach(path => {
  path.classList.remove("active")
  path.addEventListener("click", e => {
    const id = e.target.id;
    const continent = values.find(c => c.continent === id);
    if (!continent) return;

    if (previousContinent) previousContinent.classList.remove("active")

    changeVisibility()
    path.classList.add("active")
    previousContinent = path
    sessionStorage.setItem("Active", JSON.stringify(continent)); //sets up active continent upon user click
    displayContinent(continent);

    document.querySelector(".about-container").scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  });
});


// ====== Functions ======

// function for triggering visibility
function changeVisibility() {
  AboutSection.classList.add("active")
  PlaceSection.classList.add("active")  
}

//function for displaying info about the continent
function displayContinent(continent) {
  const continentImage = document.querySelector(".continent-image")
  const continentDesc = document.querySelector(".continent-description")

  continentDesc.textContent = continent.description
  continentImage.src = continent.image
  currentContinent = continent;
  titleElement.textContent = continent.continent;
  setupPagination(continent);
  showPage(continent, 1);
}

let cardsPerPage = getCardsPerPage(); // set based on screen size

// adjust cards per page when screen resizes
window.addEventListener("resize", () => {
  const newCardsPerPage = getCardsPerPage();
  if (newCardsPerPage !== cardsPerPage) {
    cardsPerPage = newCardsPerPage;
    setupPagination(currentContinent); // re-render pagination
  }
});

// helper function: returns number of cards depending on screen width
function getCardsPerPage() {
  const width = window.innerWidth;

  if (width < 600) return 3; // mobile view: 3 cards (1 per row)
  else if (width < 992) return 6; // tablet: maybe 6 cards
  else return 8; // desktop: 8 cards (2 rows × 4 per row)
}

// global current continent for re-rendering on resize
let currentContinent = null;

function showPage(continent, page) {
  cardHolder.innerHTML = "";

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const pagePlaces = continent.places.slice(start, end);

  pagePlaces.forEach(place => {
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4 col-lg-3"; // responsive Bootstrap grid
    card.innerHTML = `
      <div class="card text-white bg-dark h-100 position-relative overflow-hidden">
        <img src="${place.image}" class="card-img img-fluid" alt="${place.name}">
        <div class="card-overlay d-flex flex-column justify-content-center align-items-center text-center">
          <h5 class="fw-bold">${place.name}</h5>
          <p class="overlay-desc small px-3">${place.description || "Discover this amazing place!"}</p> 
          <button class="btn btn-light btn-sm see-more-btn">See More</button>
        </div>
      </div>
    `;

    card.querySelector(".see-more-btn").addEventListener("click", e => {
      e.stopPropagation();
      window.location.href = `destination.html?continent=${continent.continent}&place=${place.id}`;
    });

    cardHolder.appendChild(card);
  });
}

function setupPagination(continent) {
  currentContinent = continent;
  pagination.innerHTML = "";

  const pageCount = Math.ceil(continent.places.length / cardsPerPage);
  if (pageCount <= 1) return;

  let currentPage = 1;

  // === PREV button ===
  const prevLi = document.createElement("li");
  prevLi.className = "page-item";
  prevLi.innerHTML = `<a href="#" class="page-link prev">&lt;</a>`;
  prevLi.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      showPage(continent, currentPage);
      updateActivePage();
    }
  });
  pagination.appendChild(prevLi);

  // === NUMBERED buttons ===
  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a href="#" class="page-link">${i}</a>`;

    li.addEventListener("click", e => {
      e.preventDefault();
      currentPage = i;
      showPage(continent, currentPage);
      updateActivePage();
    });

    pagination.appendChild(li);
  }

  // === NEXT button ===
  const nextLi = document.createElement("li");
  nextLi.className = "page-item";
  nextLi.innerHTML = `<a href="#" class="page-link next">&gt;</a>`;
  nextLi.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage < pageCount) {
      currentPage++;
      showPage(continent, currentPage);
      updateActivePage();
    }
  });
  pagination.appendChild(nextLi);

  function updateActivePage() {
    document.querySelectorAll(".page-item").forEach(el => el.classList.remove("active"));
    pagination.children[currentPage].classList.add("active");
  }

  // initialize
  showPage(continent, currentPage);
  updateActivePage();
}
