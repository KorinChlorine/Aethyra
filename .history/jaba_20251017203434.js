// ====== Global Variables ======
let values = []; // full dataset
let currentContinent = null;
const paths = document.querySelectorAll(".path");
const cardHolder = document.querySelector(".card-holder");
const titleElement = document.querySelector(".card-title");
const pagination = document.getElementById("pagination");
const cardsPerPage = 8;
let previousContinent = null


// ====== Restore selected continent on page load ======
document.addEventListener("DOMContentLoaded", () => {
  const savedContinent = sessionStorage.getItem("Active");
  if (savedContinent) {
    const continent = JSON.parse(savedContinent);
    displayContinent(continent);
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
  path.classList.remove("active")
  path.addEventListener("click", e => {
    const id = e.target.id;
    const continent = values.find(c => c.continent === id);
    if (!continent) return;
    
    if (previousContinent) previousContinent.classList.remove("active")
    
    path.classList.add("active")
    previousContinent = path
    sessionStorage.setItem("Active", JSON.stringify(continent)); //sets up active continent upon user click
    displayContinent(continent); 

    document.querySelector(".Con").scrollIntoView({ behavior: "smooth" });
  });
});

// ====== Functions ======

//function for displaying info about the continent
function displayContinent(continent) {
  currentContinent = continent;
  titleElement.textContent = continent.continent;
  setupPagination(continent);
  showPage(continent, 1);
}

//function for dynamically create cards
function showPage(continent, page) {
  cardHolder.innerHTML = "";

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const pagePlaces = continent.places.slice(start, end);

  pagePlaces.forEach(place => {
    const card = document.createElement("div");
    card.className = "col-sm-6 col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card text-white bg-dark h-100 position-relative overflow-hidden">
        <img src="${place.image}" class="card-img img-fluid" alt="${place.name}">

        <!-- Overlay on hover -->
        <div class="card-overlay d-flex flex-column justify-content-center align-items-center text-center">
          <h5 class="fw-bold">${place.name}</h5>
          <p class="small px-3">${place.description || "Discover this amazing place!"}</p> 
          <button class="btn btn-light btn-sm see-more-btn">See More</button>
        </div>
      </div>
    `;

    // open destination when button clicked
    card.querySelector(".see-more-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = `destination.html?continent=${continent.continent}&place=${place.id}`;
    });

    cardHolder.appendChild(card);
  });
}


//set up pagination
function setupPagination(continent) {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(continent.places.length / cardsPerPage);

  if (pageCount <= 1) return; // only one page → no pagination

  let currentPage = 1;

  // === Create PREVIOUS button ===
  const prevLi = document.createElement("li");
  prevLi.className = "page-item";
  prevLi.innerHTML = `<a href="#" class="page-link">&lt;</a>`;
  prevLi.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      showPage(continent, currentPage);
      updateActivePage();
    }
  });
  pagination.appendChild(prevLi);

  // === Create NUMBERED buttons ===
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

  // === Create NEXT button ===
  const nextLi = document.createElement("li");
  nextLi.className = "page-item";
  nextLi.innerHTML = `<a href="#" class="page-link">&gt;</a>`;
  nextLi.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage < pageCount) {
      currentPage++;
      showPage(continent, currentPage);
      updateActivePage();
    }
  });
  pagination.appendChild(nextLi);

  // === Update active page ===
  function updateActivePage() {
    document.querySelectorAll(".page-item").forEach(el => el.classList.remove("active"));
    pagination.children[currentPage].classList.add("active"); // offset by 1 because prevLi is first
  }

  // === Initialize ===
  showPage(continent, currentPage);
  updateActivePage();
}
