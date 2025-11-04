const paths = document.querySelectorAll(".path")

const pathsValue = {
    africa:{about:'adsadasdasadsadasdasdsadsa',images: 'src', places: []}, 
}

let values = ''
// fetch data
fetch('data.json') 
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
     values =  response.json();
  })

  .catch(error => console.error('Error fetching JSON:', error));


paths.forEach(path =>{
    path.addEventListener("click", (e)=>{
        displayAbout(e.target.id)
    })
})


function displayAbout(id){
    console.log(values)
}