// ====== Variables ======
let values = []; // full dataset
const paths = document.querySelectorAll(".path");
const cardHolder = document.querySelector(".card-holder");
const titleElement = document.querySelector(".card-title");

// ====== Restore selected continent on page load ======
document.addEventListener("DOMContentLoaded", () => {
  const savedContinent = sessionStorage.getItem("Active");
  
  if (savedContinent) {
    const continent = JSON.parse(savedContinent);
    displayContinent(continent);
  }
});

// ====== Fetch data once ======
fetch('data.json')
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch JSON');
    return res.json();
  })
  .then(data => values = data)
  .catch(err => console.error(err));

// ====== Path click listeners ======
paths.forEach(path => {
  path.addEventListener("click", (e) => {
    const id = e.target.id;
    const continent = values.find(c => c.continent === id);
    if (!continent) return;

    sessionStorage.setItem("Active", JSON.stringify(continent));
    displayContinent(continent);

    document.querySelector(".Con").scrollIntoView({ behavior: "smooth" });
  });
});

// ====== Functions ======
function displayContinent(continent) {
  // Update title
  titleElement.textContent = continent.continent;

  // Create place cards
  createCards(continent);
}

function createCards(continent) {
  cardHolder.innerHTML = ""; // clear previous cards

  continent.places.forEach(place => {
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

    // Click to navigate to place page
    card.addEventListener("click", () => {
      // Save selected continent before navigation
      window.location.href = `destination.html?continent=${continent.continent}&place=${place.id}`;
    });

    cardHolder.appendChild(card);
  });
}




