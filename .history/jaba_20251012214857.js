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
    console.log(place )
    card.dataset.id = place.name
    card.className='card-container col-lg-3 col-md-4 col-sm-6'
    card.innerHTML=`
                    <div class="col-sm-6 col-md-4 col-lg-3">
                    <div class="card text-white bg-dark h-100">
                        <div class="card-img-overlay d-flex align-items-end p-0">
                            <h2 class="card-title bg-dark bg-opacity-50 w-100 m-0 p-2 text-center">
                                Card Title
                            </h2>
                        </div>
                        <img src=${place.image} class="card-img" alt="...">
                    </div>
                </div>
    
    `
    // assign event listner to each card/ alongside navigating to new html file
    card.addEventListener("click", ()=>{
      window.location.href=`destination.html?continent=${continents.continent}&place=${place.id} `
    })
    cardHolder.appendChild(card)
    
  })
}


//event listener for each card (opens new html)

const parentCard = document.querySelector(".card-holder")

// parentCard.addEventListener("click", (e)=>{
//   // const card = e.target.closest(".card-container")
//   // const placese = JSON.parse(localStorage.getItem("places"))
//   // console.log(placese)
//   // const specificPlace = placese.places.find(place => place.name === card.dataset.id)
//   // sessionStorage.setItem("currentPlace", JSON.stringify(specificPlace))
//   window.location.href=`destination.html?`
// })



