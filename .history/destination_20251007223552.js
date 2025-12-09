document.addEventListener("DOMContentLoaded", () =>{
    const value = JSON.parse(sessionStorage.getItem("currentPlace"))
    const p = document.querySelector("p").innerHTML=`${value.name}`
})