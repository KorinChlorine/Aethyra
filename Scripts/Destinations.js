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
fetch("../Scripts/data.json")
  .then((res) => res.json())
  .then((data) => (values = data))
  .catch((err) => console.error("Error loading JSON:", err));

// Helper to fetch JSON with safer error handling
async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();

    if (!text) {
      console.error(`Empty response from ${url} (status ${res.status})`);
      return {
        status: "error",
        message: `Empty response (status ${res.status})`,
      };
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error(`Invalid JSON from ${url}:`, text);
      return { status: "error", message: "Invalid JSON from server" };
    }
  } catch (err) {
    console.error(`Network error fetching ${url}:`, err);
    return { status: "error", message: err.message };
  }
}

// FETCH SECTION: fetching data from backend

//fetch continent in database
async function getContinent(continent_id) {
  return await fetchJson(
    `../Backend/getContinents.php?continent_id=${continent_id}`
  );
}

//fetch countries in database
async function getCountries(continent_id) {
  return await fetchJson(
    `../Backend/getCountries.php?continent_id=${continent_id}`
  );
}

// fetch cities
async function fetchCities(country_id) {
  return await fetchJson(`../Backend/getCities.php?country_id=${country_id}`);
}

// fetch tourist spots
async function fetchSpots(city_id) {
  return await fetchJson(`../Backend/getTouristSpot.php?city_id=${city_id}`);
}

//fetch foods
async function fetchFoods(city_id) {
  return await fetchJson(`../Backend/getFoods.php?city_id=${city_id}`);
}

//fetch activities
async function fetchActivities(city_id) {
  return await fetchJson(`../Backend/getActivities.php?city_id=${city_id}`);
}
// end FETCH SECTION

// ====== Responsive cards per page ======
function updateCardsPerPage() {
  if (window.innerWidth < 575) {
    cardsPerPage = 3; // small screens
  } else if (window.innerWidth < 900) {
    cardsPerPage = 6; // medium screens
  } else {
    cardsPerPage = 8; // large screens
  }
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
let activePath = null; // Track the clicked continent

paths.forEach((path) => {
  // When hovering
  path.addEventListener("mouseenter", () => {
    paths.forEach((p) => {
      if (p !== path && p !== activePath) p.classList.add("dimmed");
    });
  });

  // When leaving hover
  path.addEventListener("mouseleave", () => {
    if (!activePath) {
      // No active → reset all
      paths.forEach((p) => p.classList.remove("dimmed"));
    } else {
      // Keep others dimmed except the active one
      paths.forEach((p) => {
        if (p !== activePath) p.classList.add("dimmed");
      });
      activePath.classList.remove("dimmed");
    }
  });

  // When continent is click
  path.addEventListener("click", async (e) => {
    // Remove active from others
    paths.forEach((p) => p.classList.remove("active", "dimmed"));

    // Set new active
    path.classList.add("active");
    activePath = path;

    // Dim all others
    paths.forEach((p) => {
      if (p !== path) p.classList.add("dimmed");
    });

    const id = e.target.id;
    const conti = await getContinent(id); //fetch continent by id

    if (!conti) return;
    displayContinent(conti.data);

    document.querySelector(".about-container").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
});

// display continents
function displayContinent(continent) {
  aboutSection.style.display = "block";
  countrySection.style.display = "block";
  citySection.style.display = "none";

  const title = document.querySelector(".card-title");
  const desc = document.querySelector(".continent-description");
  const img = document.querySelector(".continent-image");

  title.textContent = continent.name;
  desc.textContent = continent.description;
  img.src = continent.image;

  currentContinent = continent;
  showCountries(continent.continent_id);
}

// display countries
async function showCountries(continent_id) {
  const countries = await getCountries(continent_id); //fetch countries based on continent_id

  console.log(countries);
  countryHolder.innerHTML = "";
  countries.forEach((country) => {
    const card = document.createElement("div");
    card.className = "";
    card.innerHTML = `
      <div class="country-card card text-white bg-dark w-100 h-100 position-relative overflow-hidden">
        <img src="${country.image}" class="card-img img-fluid country-card-bg" alt="${country.country_name}">
        <div class="country-overlay d-flex flex-column justify-content-center align-items-start text-start">
          <h5 class="fw-bold country-title">${country.country_name}</h5>
          <p class="overlay-desc">"Explore this country!"</p>
          <button class="btn btn-light btn-sm see-more-btn mt-2">See Cities</button>
        </div>
      </div>
    `;
    // triggers the cities section /
    card.querySelectorAll(".see-more-btn, .country-overlay").forEach((btn) => {
      btn.addEventListener("click", () => {
        //invoke display cities
        displayCities(country.country_id, country.country_name);
        const section = document.querySelector(".place-container");
        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    });

    countryHolder.appendChild(card);
  });
}

// ====== Show Cities ======
async function displayCities(country_id, countryName) {
  currentCountry = countryName;
  aboutSection.style.display = "none";
  countrySection.style.display = "none";
  citySection.style.display = "block";
  const cities = await fetchCities(country_id); //fetch cities

  if (!cities.data.length) {
    cityHolder.innerHTML = `<p class="text-center text-light w-100">No cities available for this country.</p>`;
    pagination.innerHTML = "";
    return;
  }

  setupCityPagination(cities.data);
  showCities(cities.data, 1, countryName);
}

async function fetchCityImages(city_id) {
  const res = await fetch(`../Backend/getCityImages.php?city_id=${city_id}`);
  const data = await res.json();
  if (data.status === "error" || data.status === "empty") {
    return []; // fallback: no images
  }
  return data.city; // array of images
}

//function for updating visit_count in city
function incrementCityVisit(city_id) {
  const formData = new FormData();
  formData.append("city_id", city_id);

  fetch("../Backend/updateVisitCount.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Visit count updated:", data);
    })
    .catch((err) => console.error("Error:", err));
}

async function showCities(cities, page, countryName) {
  cityHolder.innerHTML = "";
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const pageCities = cities.slice(start, end);

  for (const city of pageCities) {
    // Fetch images for this city
    const images = await fetchCityImages(city.city_id);
    const firstImage = images.length ? images[0].image_path : "default.jpg";

    const card = document.createElement("div");
    card.className = "col-sm-6 col-md-4 col-lg-3";

    card.innerHTML = `
          <div class="card city-card text-white bg-dark h-100 position-relative overflow-hidden">
            <img src="${firstImage}" class="card-img img-fluid" alt="${
      city.name
    }">
            <div class="card-overlay d-flex flex-column justify-content-center align-items-center text-center">
              <h5 class="fw-bold">${city.name}</h5>
              <p class="overlay-desc small px-3">${
                city.description || "Discover this city!"
              }</p>
              <button class="btn btn-light btn-sm see-more-btn mt-2">See More</button>
            </div>
          </div>
        `;

    const seeMoreBtns = card.querySelectorAll(".see-more-btn, .card-overlay");
    seeMoreBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        incrementCityVisit(city.city_id);
        e.stopPropagation();
        window.location.href = `../Pages/DestinationPage.html?country=${encodeURIComponent(
          countryName
        )}&place=${city.city_id}`;
      });
    });

    cityHolder.appendChild(card);
  }

  // Scroll pagination into view
  const paginationEl = document.getElementById("pagination");
  paginationEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ====== Pagination ======
function setupCityPagination(cities) {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(cities.length / cardsPerPage);
  if (pageCount <= 1) return;

  let currentPage = 1;

  function updateActivePage() {
    document
      .querySelectorAll("#pagination .page-item")
      .forEach((el) => el.classList.remove("active"));
    pagination.children[currentPage].classList.add("active"); // note: currentPage +1 because index 0 is prev
  }

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = "page-item";
  prevLi.innerHTML = `<a href="#" class="page-link">&lt;</a>`;
  prevLi.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      showCities(
        cities,
        currentPage,
        currentContinent.continent,
        currentCountry.country
      );
      updateActivePage();
    }
  });
  pagination.appendChild(prevLi);

  // Page numbers
  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a href="#" class="page-link">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      showCities(
        cities,
        currentPage,
        currentContinent.continent,
        currentCountry.country
      );
      updateActivePage();
    });
    pagination.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = "page-item";
  nextLi.innerHTML = `<a href="#" class="page-link">&gt;</a>`;
  nextLi.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < pageCount) {
      currentPage++;
      showCities(
        cities,
        currentPage,
        currentContinent.continent,
        currentCountry.country
      );
      updateActivePage();
    }
  });
  pagination.appendChild(nextLi);

  showCities(
    cities,
    currentPage,
    currentContinent.continent,
    currentCountry.country
  );
  updateActivePage();
}

// ====== Back Button ======
backBtn.addEventListener("click", () => {
  citySection.style.display = "none";
  aboutSection.style.display = "block";
  countrySection.style.display = "block";

  // Scroll the page so pagination is visible
  const paginationEl = document.querySelector(".country-container");
  paginationEl.scrollIntoView({ behavior: "smooth", block: "center" });
});

// function for allowing scroll/zoom in mobile
if (window.innerWidth < 600) {
  const _SVG = document.querySelector("#map"),
    VB = _SVG
      .getAttribute("viewBox")
      .split(" ")
      .map((c) => +c),
    _MSG = document.querySelector(".msg");

  let rID = null,
    f = 0,
    nav = {},
    tg = Array(4);
  let touches = [],
    startTap = null;
  let start = {},
    pinchStartDist = 0,
    pinchStartVB = [];

  // ---- Animation ----
  function stopAni() {
    cancelAnimationFrame(rID);
    rID = null;
  }

  function update() {
    let k = ++f / 16,
      j = 1 - k,
      cvb = VB.slice();

    if (nav.act === "zoom") {
      for (let i = 0; i < 4; i++) cvb[i] = j * VB[i] + k * tg[i];
    }

    if (nav.act === "move") {
      cvb[0] = j * VB[0] + k * tg[0];
      cvb[1] = j * VB[1] + k * tg[1];
    }

    _SVG.setAttribute("viewBox", cvb.join(" "));

    if (!(f % 16)) {
      f = 0;
      VB.splice(0, 4, ...cvb);
      nav = {};
      tg = Array(4);
      stopAni();
      return;
    }

    rID = requestAnimationFrame(update);
  }

  // ---- Touch Events ----
  _SVG.addEventListener("touchstart", (e) => {
    touches = [...e.touches];

    if (touches.length === 1) {
      startTap = {
        x: touches[0].clientX,
        y: touches[0].clientY,
        time: Date.now(),
      };
      start = {
        x: touches[0].clientX,
        y: touches[0].clientY,
        vbX: VB[0],
        vbY: VB[1],
      };
      nav = { act: "move" };
    } else if (touches.length === 2) {
      e.preventDefault(); // pinch zoom only
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      pinchStartDist = Math.hypot(dx, dy);
      pinchStartVB = VB.slice();
    }
  });

  _SVG.addEventListener("touchmove", (e) => {
    touches = [...e.touches];

    if (touches.length === 1) {
      const dx = Math.abs(touches[0].clientX - startTap.x);
      const dy = Math.abs(touches[0].clientY - startTap.y);
      if (dx > 5 || dy > 5) e.preventDefault(); // prevent scrolling

      const moveX = ((start.x - touches[0].clientX) / _SVG.clientWidth) * VB[2];
      const moveY =
        ((start.y - touches[0].clientY) / _SVG.clientHeight) * VB[3];
      tg[0] = start.vbX + moveX;
      tg[1] = start.vbY + moveY;
      nav = { act: "move" };
      if (!rID) update();
    }

    if (touches.length === 2) {
      e.preventDefault();
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = pinchStartDist / dist;

      tg[2] = pinchStartVB[2] * scale;
      tg[3] = pinchStartVB[3] * scale;

      tg[0] = pinchStartVB[0] + 0.5 * (VB[2] - tg[2]);
      tg[1] = pinchStartVB[1] + 0.5 * (VB[3] - tg[3]);
      nav = { act: "zoom" };
      if (!rID) update();
    }
  });

  _SVG.addEventListener("touchend", (e) => {
    touches = [...e.touches];
    nav = {};

    // Detect tap
    if (startTap && e.changedTouches.length === 1) {
      const dx = Math.abs(e.changedTouches[0].clientX - startTap.x);
      const dy = Math.abs(e.changedTouches[0].clientY - startTap.y);
      const dt = Date.now() - startTap.time;

      if (dx < 5 && dy < 5 && dt < 300) {
        const target = document.elementFromPoint(startTap.x, startTap.y);
        if (target && target.tagName === "path") {
          target.dispatchEvent(new MouseEvent("click"));
        }
      }
    }

    startTap = null;
  });
}
