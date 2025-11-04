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

// Example paths event listener
paths.forEach(path => {
  path.addEventListener("click", (e) => {
    displayAbout(e.target.id);
  });
});

function displayAbout(id) {
    console.log(id)
  if (values.length === 0) {
    console.log("Data not loaded yet!");
    return;
  }
  
  const place = values
  place.find(place => place.continent === id);

  console.log(place);
}
