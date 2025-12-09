//GLOBAL VARIABLES
let place;

document.addEventListener("DOMContentLoaded", () =>{
    const params = new URLSearchParams(window.location.search)
    const continent = params.get("continent")
    const placeIndex = params.get("place")
    fetch('data.json')
    .then(res => res.json())
    .then(data =>{
        const continentData = data.find(c => c.continent === continent)
         place = continentData.places.find(id => id.id == placeIndex)
         
        
    })

    const carouselInner = document.getElementById("carousel-inner");

  // example: get the selected place (from your data)
  if (place && place.carousel) {
    place.carousel.forEach((imageSrc, index) => {
      const div = document.createElement("div");
      div.classList.add("carousel-item");
      if (index === 0) div.classList.add("active"); // first image active
        console.log(place)
      div.innerHTML = `
        <img src="${imageSrc}" class="d-block w-100" alt="${selectedPlace.name}">
      `;

      carouselInner.appendChild(div);
    });
  }




})


