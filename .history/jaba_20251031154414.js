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
const backBtn = document.getElementById("backToCountries");

let cardsPerPage = 8;

// ====== Fetch data ======
fetch("data.json")
  .then(res => res.json())
  .then(data => values = data)
  .catch(err => console.error("Error loading JSON:", err));

// ====== Responsive cards per page ======
function updateCardsPerPage() {
  cardsPerPage = window.innerWidth < 580 ? 3 : 8;
}

// initial call
updateCardsPerPage();

// update on resize
window.addEventListener("resize", () => {
  const oldCardsPerPage = cardsPerPage;
  updateCardsPerPage();
  if (currentCountry && oldCardsPerPage !== cardsPerPage) {
    const cities = currentCountry.cities || currentCountry.places || [];
    setupCityPagination(cities);
    showCities(cities, 1, currentContinent.continent, currentCountry.country);
  }
});

// ====== Continent click ======
paths.forEach(path => {
  path.addEventListener("click", e => {
    const id = e.target.id;
    const continent = values.find(c => c.continent === id);
    if (!continent) return;
    displayContinent(continent);

    document.querySelector(".about-container").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
});

// ====== Display Continent ======
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
  showCountries(continent);
}

// ====== Show Countries ======
function showCountries(continent) {
  countryHolder.innerHTML = "";
  continent.countries.forEach(country => {
    const card = document.createElement("div");
    card.className = ""; 
    card.innerHTML = `
      <div class="card text-white bg-dark w-100 h-100 position-relative overflow-hidden">
        <img src="${country.image}" class="card-img img-fluid country-card-bg" alt="${country.country}">
        <div class="country-overlay d-flex flex-column justify-content-center align-items-start text-start">
          <h5 class="fw-bold country-title">${country.country}</h5>
          <p class="overlay-desc small">${country.description || "Explore this country!"}</p>
          <button class="btn btn-light btn-sm see-more-btn mt-2">See Cities</button>
        </div>
      </div>
    `;
    card.querySelector(".see-more-btn").addEventListener("click", () => {
      displayCities(country, continent);
    });
    countryHolder.appendChild(card);
  });
}

// ====== Show Cities ======
function displayCities(country, continent) {
  currentCountry = country;
  aboutSection.style.display = "none";
  countrySection.style.display = "none";
  citySection.style.display = "block";

  const cities = country.cities || country.places || [];
  if (!cities.length) {
    cityHolder.innerHTML = `<p class="text-center text-light w-100">No cities available for this country.</p>`;
    pagination.innerHTML = "";
    return;
  }

  setupCityPagination(cities);
  showCities(cities, 1, continent.continent, country.country);
}

function showCities(cities, page, continentName, countryName) {
  cityHolder.innerHTML = "";
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const pageCities = cities.slice(start, end);

  pageCities.forEach(city => {
    const card = document.createElement("div");
  card.className = "col-sm-6 col-md-4 col-lg-3";

    card.innerHTML = `
      <div class="card text-white bg-dark h-100 position-relative overflow-hidden">
        <img src="${city.image}" class="card-img img-fluid" alt="${city.name}">
        <div class="card-overlay d-flex flex-column justify-content-center align-items-center text-center">
          <h5 class="fw-bold">${city.name}</h5>
          <p class="overlay-desc small px-3">${city.description || "Discover this city!"}</p>
          <button class="btn btn-light btn-sm see-more-btn mt-2">See More</button>
        </div>
      </div>
    `;

    const seeMoreBtn = card.querySelector(".see-more-btn");
    seeMoreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = `destination.html?continent=${encodeURIComponent(continentName)}&country=${encodeURIComponent(countryName)}&place=${city.id}`;
    });

    cityHolder.appendChild(card);

    // Scroll the page so pagination is visible
  const paginationEl = document.getElementById("pagination");
  paginationEl.scrollIntoView({ behavior: "smooth", block: "center" });

  });
}

// ====== Pagination ======
function setupCityPagination(cities) {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(cities.length / cardsPerPage);
  if (pageCount <= 1) return;

  let currentPage = 1;

  function updateActivePage() {
    document.querySelectorAll("#pagination .page-item").forEach(el => el.classList.remove("active"));
    pagination.children[currentPage].classList.add("active"); // note: currentPage +1 because index 0 is prev
  }

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = "page-item";
  prevLi.innerHTML = `<a href="#" class="page-link">&lt;</a>`;
  prevLi.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      showCities(cities, currentPage, currentContinent.continent, currentCountry.country);
      updateActivePage();
    }
  });
  pagination.appendChild(prevLi);

  // Page numbers
  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a href="#" class="page-link">${i}</a>`;
    li.addEventListener("click", e => {
      e.preventDefault();
      currentPage = i;
      showCities(cities, currentPage, currentContinent.continent, currentCountry.country);
      updateActivePage();
    });
    pagination.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = "page-item";
  nextLi.innerHTML = `<a href="#" class="page-link">&gt;</a>`;
  nextLi.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage < pageCount) {
      currentPage++;
      showCities(cities, currentPage, currentContinent.continent, currentCountry.country);
      updateActivePage();
    }
  });
  pagination.appendChild(nextLi);

  showCities(cities, currentPage, currentContinent.continent, currentCountry.country);
  updateActivePage();
}


// ====== Back Button ======
backBtn.addEventListener("click", () => {
  citySection.style.display = "none";
  aboutSection.style.display = "block";
  countrySection.style.display = "block";
});
