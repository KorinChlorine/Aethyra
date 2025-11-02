let values = [];
const paths = document.querySelectorAll(".path")

// fetch data
fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json(); // return the parsed JSON
  })
  .then(data => {
    values = data; // assign the actual JSON to values
    console.log("Data loaded:", values);
  })
  .catch(error => console.error('Error fetching JSON:', error));

// paths event listener, calls display continent
paths.forEach(path => {
  path.addEventListener("click", (e) => {
    
    displayAbout(e.target.id);
    document.querySelector(".Con").scrollIntoView({ behavior: "smooth" })
  });
});

//function for displaying abt the continent
function displayAbout(id) {
  if (values.length === 0) {
    console.log("Data not loaded yet!");
    return;
  }
  
  const place = values
  const continents = place.find(place => place.continent === id);
  localStorage.setItem("places", JSON.stringify(continents))

 
  const title = document.querySelector(".card-title")
  title.innerHTML=`${continents.continent}`
  createCards(continents)
}

//function for dynamically creating containers/each place
function createCards(continents){
  const cardHolder = document.querySelector(".card-holder")
  cardHolder.innerHTML=""
  continents.places.forEach(place =>{
    
    const card = document.createElement("div")
    card.dataset.id = place.name
    card.className='card-container col-lg-3 col-md-4 col-sm-6'
    card.innerHTML=`
                    <div class="card h-100"> 
                        <img src=${place.image} alt="image photo" class="card-img-top h-50">
                        <div class="card-body">
                            <h5 class="card-title">${place.name}</h5>
                            <p class="card-text"> ${place.description}
                               </p>
                        </div>
                    </div>
                 </div>
    
    `
    cardHolder.appendChild(card)
    
  })
}


//event listener for each card (opens new html)

const parentCard = document.querySelector(".card-holder")

parentCard.addEventListener("click", (e)=>{
  const card = e.target.closest(".card-container")
  const places = JSON.parse(localStorage.getItem("places"))
  const specificPlace = places.find(place => place.places.name === card.dataset.id)
  console.log(specificPlace)
})



