const paths = document.querySelectorAll(".path")

const pathsValue = {
    africa:{about:'adsadasdasadsadasdasdsadsa',images: 'src', places: []}, 
}

fetch(data.json) // path to your JSON file
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    console.log(data); // this is your JSON as a JS object
    // call a function to render your places here
  })
  .catch(error => console.error('Error fetching JSON:', error));


paths.forEach(path =>{
    path.addEventListener("click", (e)=>{
        displayAbout(e.target.id)
    })
})


function displayAbout(id){

}