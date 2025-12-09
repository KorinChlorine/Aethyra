const paths = document.querySelectorAll(".path")

const pathsValue = {
    africa:{about:'adsadasdasadsadasdasdsadsa',images: 'src', places: []}, 
}

paths.forEach(path =>{
    path.addEventListener("click", (e)=>{
        console.log(e.target.id)
    })
})