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

function touristSpot(){
  
}
