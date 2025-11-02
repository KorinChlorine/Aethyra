let values = [];
let currentContinent = null;
let currentCountry = null;

const paths = document.querySelectorAll(".path");
const aboutSection = document.querySelector(".about-container");
const countrySection = document.querySelector(".country-container");
const citySection = document.querySelector(".place-container");
const countryHolder = document.querySelector(".country-holder");
const cityHolder = document.querySelector(".card-holder");
const pagination = document.getElementById("pagination");
const countryPagination = document.getElementById("countryPagination");
const backBtn = document.getElementById("backToCountries");

let cardsPerPage = getCardsPerPage();

// ====== Fetch data ======
fetch("data.json")
  .then(res => res.json())
  .then(data => values = data)
  .catch(err => console.error("Error loading JSON:", err));

// ====== When continent clicked ======
paths.forEach(path => {
  path.addEventListener("click", e => {
    const id = e.target.id;
    const continent = values.find(c => c.continent === id);
    if (!continent) return;
    displayContinent(continent);
  });
});

function displayContinent(continent) {
  aboutSection.style.display = "block";
  countrySection.style.display = "block";
  citySection.style.display = "none";

  const title = document.querySelector(".card-title");
  const desc = document.querySelector(".continent-description");
  const img = document.querySelector(".continent-image");

  title.textContent = continent.continent;
  desc.textContent = continent.description;
  img.src = continent.image;

  currentContinent = continent;
  setupCountryPagination(continent);
  showCountries(continent, 1);
}

// ====== Countries ======
function showCountries(continent, page) {
  countryHolder.innerHTML = "";
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const pageCountries = continent.countries.slice(start, end);

  pageCountries.forEach(country => {
  
    const card = document.createElement("div");
    card.className = "col-sm-6 col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card text-white bg-dark h-100 position-relative overflow-hidden">
        <img src="${country.image}" class="card-img img-fluid" alt="${country.country}">
        <div class="card-overlay d-flex flex-column justify-content-center align-items-center text-center">
          <h5 class="fw-bold">${country.country}</h5>
          <p class="overlay-desc small px-3">${country.description || "Explore this country!"}</p>
          <button class="btn btn-light btn-sm see-more-btn">See Cities</button>
        </div>
      </div>
    `;
    card.querySelector(".see-more-btn").addEventListener("click", () => {
      displayCities(country);
    });
    countryHolder.appendChild(card);
  });
}

function setupCountryPagination(continent) {
  countryPagination.innerHTML = "";
  const pageCount = Math.ceil(continent.countries.length / cardsPerPage);
  if (pageCount <= 1) return;
  let currentPage = 1;

  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a href="#" class="page-link">${i}</a>`;
    li.addEventListener("click", e => {
      e.preventDefault();
      currentPage = i;
      showCountries(continent, currentPage);
      updateActivePage();
    });
    countryPagination.appendChild(li);
  }

  function updateActivePage() {
    document.querySelectorAll("#countryPagination .page-item").forEach(el => el.classList.remove("active"));
    countryPagination.children[currentPage - 1].classList.add("active");
  }

  showCountries(continent, currentPage);
  updateActivePage();
}

// ====== Cities ======
function displayCities(country) {
  console.log("test")
  console.log(country)

  currentCountry = country;
  aboutSection.style.display = "none";
  countrySection.style.display = "none";
  citySection.style.display = "block";
  setupCityPagination(country);
  showCities(country, 1);
}

function showCities(country, page) {
  cityHolder.innerHTML = "";
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const pageCities = country.cities.slice(start, end);

  pageCities.forEach(city => {
    const card = document.createElement("div");
    card.className = "col-sm-6 col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card text-white bg-dark h-100 position-relative overflow-hidden">
        <img src="${city.image}" class="card-img img-fluid" alt="${city.name}">
        <div class="card-overlay d-flex flex-column justify-content-center align-items-center text-center">
          <h5 class="fw-bold">${city.name}</h5>
          <p class="overlay-desc small px-3">${city.description || "Discover this city!"}</p> 
          <button class="btn btn-light btn-sm see-more-btn">See More</button>
        </div>
      </div>
    `;
    cityHolder.appendChild(card);
  });
}

function setupCityPagination(country) {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(country.cities.length / cardsPerPage);
  if (pageCount <= 1) return;
  let currentPage = 1;

  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a href="#" class="page-link">${i}</a>`;
    li.addEventListener("click", e => {
      e.preventDefault();
      currentPage = i;
      showCities(country, currentPage);
      updateActivePage();
    });
    pagination.appendChild(li);
  }

  function updateActivePage() {
    document.querySelectorAll("#pagination .page-item").forEach(el => el.classList.remove("active"));
    pagination.children[currentPage - 1].classList.add("active");
  }

  showCities(country, currentPage);
  updateActivePage();
}

// ====== Back Button ======
backBtn.addEventListener("click", () => {
  citySection.style.display = "none";
  aboutSection.style.display = "block";
  countrySection.style.display = "block";
});

// ====== Responsive helper ======
function getCardsPerPage() {
  return window.innerWidth < 570 ? 3 : 8;
}
