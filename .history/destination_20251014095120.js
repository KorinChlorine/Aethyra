// GLOBAL VARIABLES
let certainPlace;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const continent = params.get("continent");
  const placeIndex = params.get("place");

  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const continentData = data.find(c => c.continent === continent);
      const place = continentData.places.find(p => p.id == placeIndex);
      certainPlace = place;

      console.log("Loaded place:", certainPlace);

      // ===== Create carousel dynamically =====
      const carouselInner = document.querySelector(".carousel-inner");
      carouselInner.innerHTML = ""; // clear old content

      if (certainPlace && certainPlace.carousel) {
        certainPlace.carousel.forEach((imageSrc, index) => {
          const div = document.createElement("div");
          div.classList.add("carousel-item");
          if (index === 0) div.classList.add("active");

          div.innerHTML = `
            <img src="${imageSrc}"  class="d-block w-100" alt="${certainPlace.name}">
          `;

          carouselInner.appendChild(div);
        });
      }
    })
    .catch(err => console.error("Error loading data:", err));


    document.querySelector(".card-title").innerHTML=`${certainPlace.name}`
});
