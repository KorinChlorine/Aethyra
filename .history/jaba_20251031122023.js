// ====== Global Variables ======
let values = []; // full dataset
let currentContinent = null;
let currentCountry = null;
const paths = document.querySelectorAll(".path");
const cardHolder = document.querySelector(".card-holder");
const titleElement = document.querySelector(".card-title");
const pagination = document.getElementById("pagination");
const AboutSection = document.querySelector(".about-container");
const PlaceSection = document.querySelector(".place-container");
let cardsPerPage = getCardsPerPage();
let previousContinent = null;

// ====== Restore selected continent on page load ======
document.addEventListener("DOMContentLoaded", () => {
  const savedContinent = sessionStorage.getItem("Active");
  if (savedContinent) {
    const continent = JSON.parse(savedContinent);
    displayContinent(continent);
    changeVisibility();

    const activePath = document.querySelector(`#${continent.continent}`);
    if (activePath) {
      activePath.classList.add("active");
      previousContinent = activePath;
    }

    document.querySelector(".place-container").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
});

// ====== Fetch data ======
fetch("data.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch JSON");
    return res.json();
  })
  .then(data => values = data)
  .catch(err => console.error(err));

// ====== Path click listeners ======
paths.forEach(path => {
  path.classList.remove("active");
  path.addEventListener("click", e => {
    const id = e.target.id;
    const continent = values.find(c => c.continent === id);
    if (!continent) return;

    if (previousContinent) previousContinent.classList.remove("active");

    changeVisibility();
    path.classList.add("active");
    previousContinent = path;
    sessionStorage.setItem("Active", JSON.stringify(continent));
    displayContinent(continent);

    document.querySelector(".about-container").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
});

// ====== Functions ======
function changeVisibility() {
  AboutSection.classList.add("active");
  PlaceSection.classList.add("active");
}

// ====== Display Continent (Show Countries) ======
function displayContinent(continent) {
  const continentImage = document.querySelector(".continent-image");
  const continentDesc = document.querySelector(".continent-description");

  continentDesc.textContent = continent.description;
  continentImage.src = continent.image;
  currentContinent = continent;
  titleElement.textContent = continent.continent;

  setupPaginationForCountries(continent);
  showCountryPage(continent, 1);
}

// ====== Show Countries ======
function showCountryPage(continent, page) {
  cardHolder.innerHTML = "";

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const pageCountries = continent.countries.slice(start, end);

  pageCountries.forEach(country => {
    const card = document.createElement("div");
    card.className = "col-sm-6 col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card text-white bg-dark h-100 position-relative overflow-hidden">
        <img src="${country.image}" class="card-img img-fluid" alt="${country.name}">
        <div class="card-overlay d-flex flex-column justify-content-center align-items-center text-center">
          <h5 class="fw-bold">${country.name}</h5>
          <p class="overlay-desc small px-3">${country.description || "Explore this country!"}</p>
          <button class="btn btn-light btn-sm see-more-btn">See Cities</button>
        </div>
      </div>
    `;

    // show cities when clicked
    card.querySelector(".see-more-btn").addEventListener("click", e => {
      e.stopPropagation();
      displayCities(country);
    });

    cardHolder.appendChild(card);
  });
}

// ====== Display Cities of a Country ======
function displayCities(country) {
  currentCountry = country;
  titleElement.textContent = `${currentContinent.continent} → ${country.name}`;
  setupPaginationForCities(country);
  showCityPage(country, 1);
}

// ====== Show Cities ======
function showCityPage(country, page) {
  cardHolder.innerHTML = "";

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

    card.querySelector(".see-more-btn").addEventListener("click", e => {
      e.stopPropagation();
      window.location.href = `destination.html?continent=${currentContinent.continent}&country=${country.name}&city=${city.id}`;
    });

    cardHolder.appendChild(card);
  });
}

// ====== Pagination for Countries ======
function setupPaginationForCountries(continent) {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(continent.countries.length / cardsPerPage);
  if (pageCount <= 1) return;

  let currentPage = 1;

  const prevLi = createPaginationButton("&lt;", () => {
    if (currentPage > 1) {
      currentPage--;
      showCountryPage(continent, currentPage);
      updateActivePage();
    }
  });
  pagination.appendChild(prevLi);

  for (let i = 1; i <= pageCount; i++) {
    const li = createPaginationButton(i, () => {
      currentPage = i;
      showCountryPage(continent, currentPage);
      updateActivePage();
    });
    pagination.appendChild(li);
  }

  const nextLi = createPaginationButton("&gt;", () => {
    if (currentPage < pageCount) {
      currentPage++;
      showCountryPage(continent, currentPage);
      updateActivePage();
    }
  });
  pagination.appendChild(nextLi);

  function updateActivePage() {
    document.querySelectorAll(".page-item").forEach(el => el.classList.remove("active"));
    pagination.children[currentPage].classList.add("active");
  }

  showCountryPage(continent, currentPage);
  updateActivePage();
}

// ====== Pagination for Cities ======
function setupPaginationForCities(country) {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(country.cities.length / cardsPerPage);
  if (pageCount <= 1) return;

  let currentPage = 1;

  const prevLi = createPaginationButton("&lt;", () => {
    if (currentPage > 1) {
      currentPage--;
      showCityPage(country, currentPage);
      updateActivePage();
    }
  });
  pagination.appendChild(prevLi);

  for (let i = 1; i <= pageCount; i++) {
    const li = createPaginationButton(i, () => {
      currentPage = i;
      showCityPage(country, currentPage);
      updateActivePage();
    });
    pagination.appendChild(li);
  }

  const nextLi = createPaginationButton("&gt;", () => {
    if (currentPage < pageCount) {
      currentPage++;
      showCityPage(country, currentPage);
      updateActivePage();
    }
  });
  pagination.appendChild(nextLi);

  function updateActivePage() {
    document.querySelectorAll(".page-item").forEach(el => el.classList.remove("active"));
    pagination.children[currentPage].classList.add("active");
  }

  showCityPage(country, currentPage);
  updateActivePage();
}

// ====== Helper Functions ======
function createPaginationButton(content, onClick) {
  const li = document.createElement("li");
  li.className = "page-item";
  li.innerHTML = `<a href="#" class="page-link">${content}</a>`;
  li.addEventListener("click", e => {
    e.preventDefault();
    onClick();
  });
  return li;
}

function getCardsPerPage() {
  return window.innerWidth < 570 ? 3 : 8;
}

window.addEventListener("resize", () => {
  const newCardsPerPage = getCardsPerPage();
  if (newCardsPerPage !== cardsPerPage && currentContinent) {
    cardsPerPage = newCardsPerPage;
    if (currentCountry) setupPaginationForCities(currentCountry);
    else setupPaginationForCountries(currentContinent);
  }
});
