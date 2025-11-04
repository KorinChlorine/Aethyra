document.addEventListener("DOMContentLoaded", () =>{
    const value = sessionStorage.getItem("currentPlace")
    const p = document.querySelector("p").innerHTML=`${value.name}`
})