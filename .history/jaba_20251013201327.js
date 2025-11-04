// ====== Global Variables ======
let values = []; // full dataset
let currentContinent = null;
const paths = document.querySelectorAll(".path");
const cardHolder = document.querySelector(".card-holder");
const titleElement = document.querySelector(".card-title");
const pagination = document.getElementById("pagination");
const cardsPerPage = 6;

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
  path.addEventListener("click", e => {
    const id = e.target.id;
    const continent = values.find(c => c.continent === id);
    if (!continent) return;

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

//function for displaying the different places
function showPage(continent, page) {
  cardHolder.innerHTML = "";

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const pagePlaces = continent.places.slice(start, end);

  //dynamically create cards
  pagePlaces.forEach(place => {
    const card = document.createElement("div");
    card.className = "col-sm-6 col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card card-animation text-white bg-dark h-100">
        <img src="${place.image}" class="card-img img-fluid" alt="${place.name}">
        <div class="card-img-overlay d-flex align-items-end p-0">
          <h2 class="card-title bg-dark bg-opacity-50 w-100 m-0 p-2 text-center">
            ${place.name}
          </h2>
        </div>
      </div>
    `;
    //attach event listener for each card
    card.addEventListener("click", () => {
      window.location.href = `destination.html?continent=${continent.continent}&place=${continent.places.id}`;
    });
    cardHolder.appendChild(card);
  });
}

function setupPagination(continent) {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(continent.places.length / cardsPerPage);

  if (pageCount <= 1) return; // only one page → no pagination

  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a href="#" class="page-link">${i}</a>`;

    li.addEventListener("click", e => {
      e.preventDefault();
      showPage(continent, i);
      document.querySelectorAll(".page-item").forEach(el => el.classList.remove("active"));
      li.classList.add("active");
    });

    pagination.appendChild(li);
  }

  pagination.firstChild.classList.add("active");
}
