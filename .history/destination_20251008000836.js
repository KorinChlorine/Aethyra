document.addEventListener("DOMContentLoaded", () =>{
    const params = new URLSearchParams(window.location.search)
    const continent = params.get("continent")
    const placeIndex = params.get("place")
    fetch('data.json')
    .then(res => res.json())
    .then(data =>{
        const continentData = data.find(c => c.continent === continent)
        const place = continentData.places.find(id => id.id === placeIndex)
        const p = document.querySelector("p").innerHTML=`${place.name}`
    })
})