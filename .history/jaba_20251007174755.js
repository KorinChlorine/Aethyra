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

 
  const title = document.querySelector(".card-title")
  title.innerHTML=`${continents.continent}`
  createCards(continents)
}

//function for dynamically creating containers/each place
function createCards(continents){
  continents.places.forEach(place =>{
    const cardHolder = document.querySelector(".card-holder")


    const card = document.createElement("div")
    card.classList.add("card" , "card-container")

    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")

    const title = document.createElement("h3")
    title.classList.add("card-title")
    title.innerHTML =`${place.name}`

    card.style.backgroundImage = `url(${place.image})`

    //append to parent
    cardBody.appendChild(title)
    card.appendChild(cardBody)
    cardHolder.appendChild(card)


    
  })
}
