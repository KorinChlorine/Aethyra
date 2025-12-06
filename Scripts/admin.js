let selectedContinentId = null;
/* DATA STORE ---------------------------------- */
const dataStore = {
    continents: {
        Africa: [
            { countryName: "Egypt", countryPhoto: "/Assets/Destinations/sample-country.jpg" }
        ],
        Asia: [],
        Europe: [],
        Australia: [],
        "North America": [],
        "South America": []
    },
    countriesDetail: {}
};

function getCountryKey(continent, country) {
    return continent + "__" + country;
}



//function to update dashboard
async function updateDashboard() {
    const res = await fetch(`../Backend/getCountries.php`);
    const countries = await res.json();

   const spots = await fetch(`../Backend/getTouristSpot.php`);
   const touristSpots = await spots.json()
   
    //updates country count
    document.getElementById("dashboard-country-count").innerHTML = `${countries.length}`
    document.getElementById("dashboard-spot-count").innerHTML = `${touristSpots.length}`
}

function ensureCountryDetail(continent, country) {
    const key = getCountryKey(continent, country);
    if (!dataStore.countriesDetail[key]) {
        dataStore.countriesDetail[key] = {
            continent,
            country,
            cities: [
                {
                    name: "City 1",
                    description: "",
                    spots: [],
                    foods: [],
                    activities: []
                }
            ]
        };
    }
    return dataStore.countriesDetail[key];
}

//Continents Table
let currentContinentForTable = null;

function highlightContinentCards() {
    const cards = document.querySelectorAll(".continent-box");
    cards.forEach((card) => {
        const name = card.getAttribute("data-continent");
        if (currentContinentForTable === name) {
            card.classList.add("continent-selected");
            card.classList.remove("continent-dimmed");
        } else if (currentContinentForTable) {
            card.classList.remove("continent-selected");
            card.classList.add("continent-dimmed");
        } else {
            card.classList.remove("continent-selected");
            card.classList.remove("continent-dimmed");
        }
    });
}

// FETCH SECTION: fetching data from backend

//fetch countries in database
async function getCountries(continent_id) {
    const res = await fetch(`../Backend/getCountries.php?continent_id=${continent_id}`);
    const countries = await res.json()
    return countries
}

// fetch cities
async function fetchCities(country_id) {
    const res = await fetch(`../Backend/getCities.php?country_id=${country_id}`)
    const cities = await res.json()
    return cities
}

// fetch tourist spots
async function fetchSpots(city_id) {
    const res = await fetch(`../Backend/getTouristSpot.php?city_id=${city_id}`)
    const spots = await res.json()
    return spots
}

//fetch foods
async function fetchFoods(city_id) {
    const res = await fetch(`../Backend/getFoods.php?city_id=${city_id}`)
    const foods = await res.json()
    return foods
}

//fetch activities
async function fetchActivities(city_id) {
    const res = await fetch(`../Backend/getActivities.php?city_id=${city_id}`)
    const activities = await res.json()
    return activities
}
// end FETCH SECTION


//function when user select a continent
async function selectContinent(name, continent_id) {
    currentContinentForTable = name;
    
    //fetch countries depending on continent selected
    const countries = await getCountries(continent_id)
    
    highlightContinentCards();
    document.getElementById("continent-table-title").textContent =
        "COUNTRIES IN " + name.toUpperCase();
    document.getElementById("continent-table-wrapper").style.display = "block";

    document.getElementById("continent-table-wrapper").scrollIntoView({ behavior: "smooth", block: "center" }); //smooth scroll to table

    renderContinentTable(countries, continent_id); //invoke render continent table
}

//clear continent selected
function clearContinentSelection() {
    currentContinentForTable = null;
    highlightContinentCards();
    document.getElementById("continent-table-wrapper").style.display = "none";
    document.getElementById("continent-country-form-wrapper").style.display = "none";
}


//render continent table
function renderContinentTable(countries, continent_id) {
    selectedContinentId = continent_id
    const tbody = document.getElementById("continent-table-body");
    tbody.innerHTML = "";
    if (!currentContinentForTable) return;

    //loop through each countries and create each card
    countries.forEach((country) => {
        const photo = country.image || "../Assets/Destinations/sample-country.jpg";
        const tr = document.createElement("tr"); 
        tr.innerHTML = `
                    <td>
                        <span class="continent-country-pill">${country.country_name}</span>
                    </td>
                    <td class="td-photo">
                        <div class="continent-photo-frame">
                            <div class="continent-photo-glow"></div>
                            <img src="${photo}" alt="${country.country_name}" class="continent-photo-img">
                        </div>
                    </td>
                    <td class="td-actions">
                        <button type="button" class="edit-button">Edit</button>
                        <button type="button" class="delete-button">Delete</button>
                    </td>
                `;
        tbody.appendChild(tr);
        const editButton = tr.querySelector(".edit-button");
        const removeButton = tr.querySelector(".delete-button")

        // edit country
        editButton.addEventListener("click", () => {
            document.getElementById("continent-country-form-title").textContent = "Edit Country";
            document.getElementById("continent-country-index").value = country.country_id;
            document.getElementById("continent-country-name").value = country.country_name;
            document.getElementById("continent-country-photo").value = "";
            document.getElementById("continent-country-form-wrapper").style.display = "block";
        });

        //remove country
        removeButton.addEventListener("click", () => {
            removeCountry(country)
        });
    });
    
}

// open add country form (CONTINENTS TAB)
function openContinentCountryForm(continentId) {
    if (!currentContinentForTable) return;
    document.getElementById("continent-country-form-title").textContent = "Add Country";
    document.getElementById("continent-country-index").value = "";
    document.getElementById("continent-id").value = selectedContinentId;


    document.getElementById("continent-country-name").value = "";
    document.getElementById("continent-country-photo").value = "";
    const wrapper =  document.getElementById("continent-country-form-wrapper")
    wrapper.style.display= "block"
    wrapper.scrollIntoView({ behavior: "smooth", block: "center" });

}

// close add country form 
function cancelContinentCountryForm() {
    document.getElementById("continent-country-form-wrapper").style.display = "none";
}

//close add/edit food form
function cancelFoodForm(){
    document.getElementById("food-form-wrapper").style.display = "none";
}

//close add/edit food form
function cancelActivityForm(){
    document.getElementById("activity-form-wrapper").style.display = "none";
}


//event listener for submitting editing country ( CONTINENTS TAB )
document.getElementById('continent-country-form').addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target); //gets the value of the form before sending to backend

    fetch('../Backend/manageCountry.php', { // connect to backend and pass form value
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then(msg => {
            window.location.reload()
            alert(msg);
        });
});

// function for removing country (CONTINENTS TAB)
function removeCountry(country) {

    if (!confirm(`Delete "${country.country_name}"?`)) return;

    fetch("../Backend/removeCountry.php", {   // connect to backend and pass country_id to delete
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "country_id=" + country.country_id
    })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            window.location.reload()
            
        });
}


/* COUNTRIES TAB CONTINENT STEP --------------- */
let currentCountriesContinent = null;

//back to continents tab
function backToCountryContinents() {
    currentCountriesContinent = null;
    document.getElementById("countries-detail-step").style.display = "none";
    document.getElementById("countries-continent-step").style.display = "block";
    document.getElementById("countries-detail-body").innerHTML = "";
    cancelCityForm();
    cancelItemForm();
}

//when a continent is selected in ( COUNTRIES TAB )
async function openCountriesForContinent(name, continent_id) {
    currentCountriesContinent = name;

    const countries = await getCountries(continent_id) //fetch countries base on selected continent

    document.getElementById("countries-welcome-main").textContent = name.toUpperCase();
    document.getElementById("countries-continent-step").style.display = "none";
    document.getElementById("countries-detail-step").style.display = "block";
    renderCountriesDetailList(countries); //invoke country details rendering and pass the country details
}



// Country and city details rendering
async function renderCountriesDetailList(countriesList) {
    const wrapper = document.getElementById("countries-detail-body");
    wrapper.innerHTML = "";
  
    if (!currentCountriesContinent) return;
  
    const countries = countriesList; // receives country details

    if (!countries.length) { // if there are no countries
        wrapper.innerHTML =
            '<p class="countries-empty">No countries for this continent yet. Add them from the Continents tab.</p>';
        return;
    }

    for (const country of countries) { // loop through countries and dynamically creates DOM
        const key = getCountryKey(currentCountriesContinent, country.country_name);

        const countryCard = document.createElement("article");
        countryCard.className = "country-card";

        const header = document.createElement("div");
        header.className = "country-card-header";
        header.innerHTML = `
                    <div class="country-title-block">
                        <h3 class="country-name">${country.country_name.toUpperCase()}</h3>
                    </div>
                    <div class="country-header-actions">
                        <button type="button" class="country-arrow-btn" onclick="toggleCountryBlock('${key}')">
                        <span id="country-arrow-icon-${key}">▼</span>
                        </button>
                    </div>
                `;
        countryCard.appendChild(header);

        //fetch cities for each country
        const cities = await fetchCities(country.country_id)

        const body = document.createElement("div");
        body.className = "country-body";
        body.style.display = "none"
        body.id = "country-body-" + key;

        const citiesContainer = document.createElement("div");
        citiesContainer.className = "country-cities-list";


        //type safey when theres no city in a country
        const citiesArray = Array.isArray(cities.data) ? cities.data : [];

        //displays message abt no city
        if (citiesArray.length === 0 ){
            const msg = document.createElement("h5")
             msg.style.textAlign = "center";
             msg.classList.add("msg")
            msg.innerHTML = "No cities available!"
            body.appendChild(msg)
        }

        //loop through each city to display each city's foods, activities, spots
        for (const [cityIndex, city] of citiesArray.entries()) {

            const cityCard = document.createElement("section");
            cityCard.className = "city-card";

            const cityBodyId = "city-body-" + key + "-" + city.city_id;

            const cityDescriptionHtml = city.description
                ? `
                        <div class="city-description-block">
                            <h5 class="city-description-title">CITY OVERVIEW</h5>
                            <p class="city-description-text">${city.description}</p>
                        </div>`
                : "";

            // Fetch spots in current city loop
            const spots = await fetchSpots(city.city_id);

            // Fetch food in current city loop
            const foods = await fetchFoods(city.city_id)

            // Fetch activities in current city loop
            const activities = await fetchActivities(city.city_id)

            // Initialize runtime for navigating carousel, temporary object to store city data
            window.cityRuntime = window.cityRuntime || {};
            window.cityRuntime[key] = window.cityRuntime[key] || {};
            window.cityRuntime[key][cityIndex] = {
                city_id: city.city_id,
                country_id: city.country_id,
                name: city.name,               
                description: city.description, 
                spots: spots && spots.length ? spots : [],
                foods: foods || [],
                activities: activities || []
            };

            cityCard.innerHTML = `
                        <header class="city-header">
                            <div class="city-left">
                                <button type="button" class="edit-button city-edit-btn" onclick="editCity('${key}', ${cityIndex}, ${city.city_id}, ${city.country_id})"> 
                                    Edit
                                </button>
                                <button type="button" class="deleteCity-button" onclick="removeCity(${city.city_id})"> 
                                    Delete
                                </button>
                                <h4 class="city-title">${city.name.toUpperCase()}</h4>
                            </div>
                            <button type="button" class="country-arrow-btn city-arrow-btn" onclick="toggleCityBlock('${key}', ${city.city_id})">
                            <span id="city-arrow-icon-${key}-${cityIndex}">▼</span>
                            </button>
                        </header>
                        <div class="city-body" id="${cityBodyId}" style="display:none">
                            ${cityDescriptionHtml}
                            <div class="city-sections">
                                ${buildCitySectionHtml(key, cityIndex, "spots", "TOURIST SPOTS", "Tourist Spot", spots)}
                                ${buildCitySectionHtml(key, cityIndex, "foods", "DELICACIES", "Food", foods)}
                                ${buildCitySectionHtml(key, cityIndex, "activities", "ACTIVITIES", "Activity", activities)}
                            </div>
                        </div>
                    `;
            citiesContainer.appendChild(cityCard);
        }

        const addCityRow = document.createElement("div");
        addCityRow.className = "add-city-row";
        addCityRow.innerHTML = `
                    <button type="button" class="add-city-button" onclick="addCity('${key}', ${country.country_id})"">
                        ADD CITY
                    </button>
                `;

        body.appendChild(citiesContainer);
        body.appendChild(addCityRow);
        countryCard.appendChild(body);
        wrapper.appendChild(countryCard);
    }
}

//function for removing city
function removeCity(city_id) {
    console.log(city_id)
    if (!confirm("Are you sure you want to delete this city?")) return;

    
    const formData = new FormData();
    formData.append("city_id", city_id);

    fetch("../Backend/removeCity.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        alert(data); // shows "City deleted successfully" or error
       window.location.reload()
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Failed to delete city.");
    });
}


//function for dynamically creating DOM for spots, food and activities
function buildCitySectionHtml(countryKey, cityIndex, sectionType, sectionTitle, placeholderLabel, items) {
    const idxObj = getSectionIndexObject(countryKey, cityIndex);

    const displayIndex = idxObj[sectionType] || 0;
    let item;
    if (!items || !items.length || !items[displayIndex]) {
        item = {
            name: placeholderLabel.toUpperCase() + " NAME",
            image: "../Assets/Destinations/sample-country.jpg",
            extra1: "",
            extra2: ""
        };
    } else {
        let extra1Value = ""; // description for each section (SPOT, FOOD, ACTIVITY)
        let extra2Value = ""; // description for each section (SPOT, FOOD, ACTIVITY)
        if (sectionType === "spots") { 
            extra1Value = items[displayIndex].history || "";
            extra2Value = items[displayIndex].details || "";
        } else if (sectionType === "foods") {
            extra1Value = items[displayIndex].about || "";
            extra2Value = items[displayIndex].location || "";
        } else if (sectionType === "activities") {
            extra1Value = items[displayIndex].description || "";
            extra2Value = items[displayIndex].location || "";
        }

        item = {
            extra1: extra1Value,
            extra2: extra2Value,
            ...items[displayIndex]
        };
    }


    const labelId = "city-section-name-" + countryKey + "-" + cityIndex + "-" + sectionType;
    const photoId = "city-section-photo-" + countryKey + "-" + cityIndex + "-" + sectionType;
    const dotsId = "city-section-dots-" + countryKey + "-" + cityIndex + "-" + sectionType;
    const extraBlockId = "city-section-extra-" + countryKey + "-" + cityIndex + "-" + sectionType;
    const total = (items && items.length) || 1;

    let dotsHtml = "";
    for (let i = 0; i < total; i++) {
        dotsHtml += '<span class="dot ' + (i === displayIndex ? "dot-active" : "") + '">•</span>';
    }

    // Labels for viewer below
    let extra1Label = "";
    let extra2Label = "";
    if (sectionType === "spots") {
        extra1Label = "History";
        extra2Label = "Details";
    } else if (sectionType === "foods") {
        extra1Label = "About";
        extra2Label = "Location";
    } else if (sectionType === "activities") {
        extra1Label = "Description";
        extra2Label = "Location";
    }

    const extraHtml =
        item.extra1 || item.extra2
            ? `
                <div class="city-item-extra" id="${extraBlockId}">
                    ${item.extra1
                ? `<div class="city-item-extra-line"><span class="city-item-extra-label">${extra1Label}:</span><span class="city-item-extra-text">${item.extra1}</span></div>`
                : ""
            }
                    ${item.extra2
                ? `<div class="city-item-extra-line"><span class="city-item-extra-label">${extra2Label}:</span><span class="city-item-extra-text">${item.extra2}</span></div>`
                : ""
            }
                </div>`
            : `<div class="city-item-extra" id="${extraBlockId}"></div>`;

    return `
                <section class="city-section-block" data-section-type="${sectionType}">
                    <header class="city-section-header">
                        <h5>${sectionTitle}</h5>
                    </header>
                    <div class="city-section-body">
                        <button type="button" class="circle-arrow-btn" onclick="stepCityItem('${countryKey}', ${cityIndex}, '${sectionType}', -1)">
                         &lt;
                        </button>
                        <div class="city-photo-wrapper">
                            <img id="${photoId}" src="${item.image}" alt="${item.name}">
                        </div>
                        <button type="button" class="circle-arrow-btn" onclick="stepCityItem('${countryKey}', ${cityIndex}, '${sectionType}', 1)">
                            &gt;
                        </button>
                    </div>
                    <div class="city-dots-row" id="${dotsId}">${dotsHtml}</div>
                    <div class="city-item-name" id="${labelId}">${item.name.toUpperCase()}</div>
                    ${extraHtml}
                    <footer class="city-section-footer">
                        <button type="button" class="add-button" onclick="
                             ${sectionType === 'spots' ? `openSpotsForm('add', '${countryKey}', ${cityIndex}, '${sectionType}')` : //opens spots form
            sectionType === 'foods' ? `openFoodForm('add', '${countryKey}', ${cityIndex}, '${sectionType}')` :  //opens food form
                sectionType === 'activities' ? `openActivityForm('add', '${countryKey}', ${cityIndex}, '${sectionType}')` : '' //opens activities form
        }
                        ">
                            ADD
                        </button>
                        <button type="button" class="edit-button" onclick="
                            ${sectionType === 'spots' ? `openSpotsForm('edit', '${countryKey}', ${cityIndex}, '${sectionType}')` :
            sectionType === 'foods' ? `openFoodForm('edit', '${countryKey}', ${cityIndex}, '${sectionType}')` :
                sectionType === 'activities' ? `openActivityForm('edit', '${countryKey}', ${cityIndex}, '${sectionType}')` : ''
        }
                        ">
                            EDIT
                        </button>
                        <button type="button" class="delete-button" onclick="deleteCurrentCityItem('${countryKey}', ${cityIndex}, '${sectionType}')">
                            DELETE
                        </button>
                    </footer>
                </section>
                                `;
}

// TOGGLES

//toggle button for country
function toggleCountryBlock(key) {
    const body = document.getElementById("country-body-" + key);
    const icon = document.getElementById("country-arrow-icon-" + key);
    if (!body || !icon) return;

    const isVisible = body.style.display === "block";
    body.style.display = isVisible ? "none" : "block";

    // ▼ when closed, ▲ when open
    icon.textContent = isVisible ? "▼" : "▲";
}

//toggle button for city
function toggleCityBlock(key, cityIndex) {
    const bodyId = "city-body-" + key + "-" + cityIndex;
    const body = document.getElementById(bodyId);
    const icon = document.getElementById("city-arrow-icon-" + key + "-" + cityIndex);
    
    const isVisible = body.style.display === "block";
    body.style.display = isVisible ? "none" : "block";
    icon.textContent = isVisible ? "▼" : "▲";
}


// CITY FORMS

// Open City Form DOM (Add / Edit)
function openCityForm(countryKey, cityIndex, city_id, country_id) {
    console.log("Country Key:", countryKey);
    console.log("City Index:", cityIndex);
    console.log("City ID:", city_id);
    console.log("City ID:", country_id);

    // Get city data if editing
    const cityData = (cityIndex !== null && window.cityRuntime?.[countryKey])
        ? window.cityRuntime[countryKey][cityIndex]
        : null;

    console.log("City Data:", cityData);

    // Hidden values
    document.getElementById("city-country-key").value = countryKey;
    document.getElementById("city-index").value = city_id ?? "";
    document.getElementById("city-country-id").value = country_id;


    // Fill form for editing / clear for adding
    document.getElementById("city-name-input").value = cityData?.name || "";
    document.getElementById("city-description-input").value = cityData?.description || "";

    // Reset file input
    const imageInput = document.getElementById("city-image-input");
    if (imageInput) imageInput.value = "";

    // Title
    document.getElementById("city-form-title").textContent =
        cityData ? "Edit City" : "Add City";

    // Open form
    const forms = document.getElementById("city-form-wrapper")
    forms.style.display = "block";
    forms.scrollIntoView({ behavior: "smooth", block: "center" }); //smooth scroll to forms
}

function addCity(countryKey, country_id) {
    setTimeout(() => {
        const form = document.getElementById("city-form");
        if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, 100);
    openCityForm(countryKey, null, 0, country_id);
}

function editCity(countryKey, cityIndex, city_id, country_id) {
    openCityForm(countryKey, cityIndex, city_id, country_id);
}

function cancelCityForm() {
    document.getElementById("city-form-wrapper").style.display = "none";
}

// When Add/Edit City form is submitted 
document.getElementById("city-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetch('../Backend/manageCity.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then(msg => {
            console.log(msg);
            window.location.reload()
          

        })
        .catch(err => console.error("Error saving city:", err));
});
// end of CITY FORMS


/* ITEM CAROUSELS ---------------------------- */
window.citySectionIndex = window.citySectionIndex || {};

function getSectionIndexObject(key, cityIndex) {
    if (!window.citySectionIndex[key]) window.citySectionIndex[key] = {};
    if (!window.citySectionIndex[key][cityIndex]) {
        window.citySectionIndex[key][cityIndex] = {
            spots: 0,
            foods: 0,
            activities: 0
        };
    }
    return window.citySectionIndex[key][cityIndex];
}

function updateDots(key, cityIndex, sectionType, total, currentIndex) {
    const dotsId = "city-section-dots-" + key + "-" + cityIndex + "-" + sectionType;
    const row = document.getElementById(dotsId);
    if (!row) return;
    let html = "";
    for (let i = 0; i < total; i++) {
        html += '<span class="dot ' + (i === currentIndex ? "dot-active" : "") + '">•</span>';
    }
    row.innerHTML = html;
}

//function for carousell; navigating < and >
function stepCityItem(key, cityIndex, sectionType, delta) {

    const arr = window.cityRuntime?.[key]?.[cityIndex]?.[sectionType];
    if (!arr || !arr.length) return;

    const obj = getSectionIndexObject(key, cityIndex); // still tracks which index is active
    const current = obj[sectionType] || 0;
    const next = ((current + delta) % arr.length + arr.length) % arr.length;
    obj[sectionType] = next;

    const item = arr[next];

    const labelId = `city-section-name-${key}-${cityIndex}-${sectionType}`;
    const photoId = `city-section-photo-${key}-${cityIndex}-${sectionType}`; //updates image id
    const extraBlockId = `city-section-extra-${key}-${cityIndex}-${sectionType}`;

    document.getElementById(labelId).textContent = (item.name || "").toUpperCase();
    document.getElementById(photoId).src = item.image || "../Assets/Destinations/sample-country.jpg";

    // update extra info
    const extraEl = document.getElementById(extraBlockId);
    if (extraEl) {
        let extra1Label = "", extra2Label = "";
        if (sectionType === "spots") { extra1Label = "History"; extra2Label = "Details"; }
        else if (sectionType === "foods") { extra1Label = "About"; extra2Label = "Location"; }
        else if (sectionType === "activities") { extra1Label = "Description"; extra2Label = "Location"; }

        //dynamically change the value to be output in DOM
        let e1 = "", e2 = "";
        if (sectionType === "spots") {
            e1 = item.history || item.extra1 || "";
            e2 = item.details || item.extra2 || "";
        } else if (sectionType === "foods") {
            e1 = item.about || item.extra1 || "";       // description of food
            e2 = item.location || item.extra2 || "";    // where to find it
        } else if (sectionType === "activities") {
            e1 = item.description || item.extra1 || ""; // description of activites
            e2 = item.location || item.extra2 || "";   // location of activities
        }

        //UPDATES THE DOM 
        extraEl.innerHTML = e1 || e2
            ? `<div class="city-item-extra">
                    ${e1 ? `<div class="city-item-extra-line"><span class="city-item-extra-label">${extra1Label}:</span> <span class="city-item-extra-text">${e1}</span></div>` : ""}
                    ${e2 ? `<div class="city-item-extra-line"><span class="city-item-extra-label">${extra2Label}:</span> <span class="city-item-extra-text">${e2}</span></div>` : ""}
               </div>`
            : "";
    }

    updateDots(key, cityIndex, sectionType, arr.length, next);
}


/* ITEM FORM --------------------------------- */
function configureItemExtraFields(sectionType) {
    const extra1Label = document.getElementById("item-extra-1-label");
    const extra2Label = document.getElementById("item-extra-2-label");
    const extra1 = document.getElementById("item-extra-1");
    const extra2 = document.getElementById("item-extra-2");

    if (sectionType === "spots") {
        extra1Label.textContent = "History";
        extra1.placeholder = "Brief historical background of this tourist spot";
        extra2Label.textContent = "Details";
        extra2.placeholder = "Practical details (best time to visit, entrance info, tips)";
    } else if (sectionType === "foods") {
        extra1Label.textContent = "About";
        extra1.placeholder = "Short description of this delicacy (taste, ingredients, significance)";
        extra2Label.textContent = "Location";
        extra2.placeholder = "Where to find it (markets, streets, recommended shops)";
    } else if (sectionType === "activities") {
        extra1Label.textContent = "Description";
        extra1.placeholder = "What visitors can expect from this activity";
        extra2Label.textContent = "Location";
        extra2.placeholder = "Exact location or meeting point for the activity";
    } else {
        extra1Label.textContent = "Details";
        extra2Label.textContent = "More Info";
        extra1.placeholder = "";
        extra2.placeholder = "";
    }
}

// TOURIST SPOTS FORMS

//function for spots form
function openSpotsForm(mode, key, cityIndex, sectionType) {
    
    const cityData = window.cityRuntime?.[key]?.[cityIndex];
    if (!cityData) return;

    const arr = cityData[sectionType] || [];

    document.getElementById("item-country-key").value = key;
    document.getElementById("item-city-index").value = String(cityIndex);
    document.getElementById("item-section-type").value = sectionType;

    configureItemExtraFields(sectionType);

    const idxObj = getSectionIndexObject(key, cityIndex);
    const currentIndex = arr.length && mode === "edit" ? idxObj[sectionType] || 0 : -1;

    document.getElementById("item-index").value =
        mode === "edit" && arr.length ? currentIndex : "";

    // Show modal
    const forms = document.getElementById("spot-form-wrapper")
    forms.style.display = "block";
    forms.scrollIntoView({ behavior: "smooth", block: "center" }); //smooth scroll to forms
    

    if (mode === "edit" && arr.length) {
        const item = arr[currentIndex];
        document.getElementById("item-name-input").value = item.name || "";
        document.getElementById("item-city-id").value = item.city_id;  //city_id to pass to db
        document.getElementById("item-spot-id").value = item.spot_id; //spot_id to pass to db
        document.getElementById("item-photo-input").value = "";
        document.getElementById("item-extra-1").value = item.history || item.extra1 || "";
        document.getElementById("item-extra-2").value = item.details || item.extra2 || "";

        document.getElementById("item-form-title").innerHTML = "Edit Tourist Spots"
    } else {
        // ADD MODE
        document.getElementById("item-name-input").value = "";
        document.getElementById("item-city-id").value = cityData.city_id;  //city_id to pass to db
        document.getElementById("item-spot-id").value = 0; //spot_id to pass to db, 0 = means add new
        document.getElementById("item-photo-input").value = "";
        document.getElementById("item-extra-1").value = "";
        document.getElementById("item-extra-2").value = "";

        document.getElementById("item-form-title").innerHTML = "Add Tourist Spots"
    }
}

// end of TOURIST SPOTS FORMS


// FOOD FORMS

//function for opening foods form
function openFoodForm(mode, key, cityIndex, sectionType) {
    const cityData = window.cityRuntime?.[key]?.[cityIndex];
    if (!cityData) return;

    const arr = cityData[sectionType] || [];
    const idxObj = getSectionIndexObject(key, cityIndex);
    const currentIndex = arr.length && mode === "edit" ? idxObj[sectionType] || 0 : -1;

    // Show the form
    const forms = document.getElementById("food-form-wrapper")
    forms.style.display = "block";
    forms.scrollIntoView({ behavior: "smooth", block: "center" }); //smooth scroll to table

    if (mode === "edit" && arr.length && arr[currentIndex]) {
        // EDIT mode
        const item = arr[currentIndex];
        document.getElementById("food-name-input").value = item.name || "";
        document.getElementById("food-city-id").value = item.city_id || cityData.city_id; //city_id to pass to db
        document.getElementById("food-id").value = item.food_id || 0; //food_id to pass to db
        document.getElementById("food-photo-input").value = ""; 
        document.getElementById("food-about-input").value = item.about || "";
        document.getElementById("food-location-input").value = item.location || "";

        document.getElementById("food-form-title").innerHTML = "Edit Delicacy"
    } else {
        // ADD mode
        document.getElementById("food-name-input").value = "";
        document.getElementById("food-city-id").value = cityData.city_id; //city_id to pass to db
        document.getElementById("food-id").value = 0;        //food_id to pass to db, 0 = means add new
        document.getElementById("food-photo-input").value = "";
        document.getElementById("food-about-input").value = "";
        document.getElementById("food-location-input").value = "";

        document.getElementById("food-form-title").innerHTML = "Add Delicacy"
    }
}

// end of FOOD FORMS


//ACTIVITIES FORMS

//function for opening activities form
function openActivityForm(mode, key, cityIndex, sectionType) {
    const cityData = window.cityRuntime?.[key]?.[cityIndex];
    if (!cityData) return;

    const arr = cityData[sectionType] || [];
    const idxObj = getSectionIndexObject(key, cityIndex);
    const currentIndex = arr.length && mode === "edit" ? idxObj[sectionType] || 0 : -1;

    // Show the form
    const forms = document.getElementById("activity-form-wrapper")
    forms.style.display = "block";
    forms.scrollIntoView({ behavior: "smooth", block: "center" }); //smooth scroll to forms

    if (mode === "edit" && arr.length && arr[currentIndex]) {
        // EDIT mode
        const item = arr[currentIndex];
        document.getElementById("activity-name-input").value = item.name || "";
        document.getElementById("activity-city-id").value = item.city_id || cityData.city_id;
        document.getElementById("activity-id").value = item.activity_id || 0; //sets to activity id, to access and modify it
        document.getElementById("activity-photo-input").value = "";
        document.getElementById("activity-schedule-input").value = item.description || ""; //description
        document.getElementById("activity-details-input").value = item.location || ""; //location
    } else {
        // ADD mode
        document.getElementById("activity-name-input").value = "";
        document.getElementById("activity-city-id").value = cityData.city_id;
        document.getElementById("activity-id").value = 0; //sets to zero to create a new value
        document.getElementById("activity-photo-input").value = "";
        document.getElementById("activity-schedule-input").value = "";
        document.getElementById("activity-details-input").value = "";
    }
}

//end of ACTIVITIES FORMS


//EVENT LISTENER FOR SUBMITTING FORMS (PASSING TO DATABASE)

//when add or Edit spots form is submmited
document.getElementById("item-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log(formData)

    fetch('../Backend/manageSpots.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then(msg => {
            console.log(msg)
            window.location.reload()

        });
});

//when add or Edit foods  is submitted
document.getElementById("food-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetch('../Backend/manageFoods.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then(msg => {
            console.log(msg)
            window.location.reload()
        });
});

//when add or Edit activities form is submmited
document.getElementById("activity-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("activity")
    const formData = new FormData(e.target);

    fetch('../Backend/manageActivities.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then(msg => {
            console.log(msg)
            window.location.reload()
        });
});


function cancelItemForm() {
    document.getElementById("spot-form-wrapper").style.display = "none";
}



function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


//delete item in a city (SPOT, FOOD, ACTIVITIES)
function deleteCurrentCityItem(key, cityIndex, sectionType) {
    if (!confirm("Delete this item?")) return;

    //get data from local storage
    const cityData = window.cityRuntime?.[key]?.[cityIndex];
    if (!cityData) {
        console.error("No city data found for key:", key, "index:", cityIndex);
        return;
    }

    const arr = cityData[sectionType] || [];
    if (!arr.length) {
        console.error("No items to delete in section:", sectionType);
        return;
    }

    // Current index using section index object
    const idxObj = getSectionIndexObject(key, cityIndex);
    const currentIndex = idxObj[sectionType] || 0;

    const item = arr[currentIndex];
    if (!item) {
        console.error("No item found at current index:", currentIndex);
        return;
    }

    // Dynamically select backend URL and ID field
    let backendUrl = "";
    let idField = "";
    if (sectionType === "spots") {
        backendUrl = "../Backend/removeSpots.php";
        idField = "spot_id";
    } else if (sectionType === "foods") {
        backendUrl = "../Backend/removeFood.php";
        idField = "food_id";
    } else if (sectionType === "activities") {
        backendUrl = "../Backend/removeActivity.php";
        idField = "activity_id";
    }

    const id = item[idField];
    if (!id) {
        console.error("Item has no ID for deletion:", item);
        return;
    }

    // Call backend
    fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `${idField}=${id}`
    })
        .then(res => res.text())
        .then(msg => {
            alert(msg);

            // Remove from local runtime
            arr.splice(currentIndex, 1);
            idxObj[sectionType] = arr.length === 0 ? 0 : Math.min(currentIndex, arr.length - 1);

            // Re-render UI
            window.location.reload()

        })
        .catch(err => console.error("Delete failed:", err));
}



// Static data to replace deleted dataStore
const countriesDetail = [
    {
        country: "Japan",
        cities: [
            { 
                name: "Tokyo",
                spots: ["Shibuya Crossing", "Tokyo Tower", "Senso-ji Temple"] 
            },
            { 
                name: "Kyoto",
                spots: ["Fushimi Inari Shrine", "Kinkaku-ji"] 
            }
        ]
    },
    {
        country: "France",
        cities: [
            { 
                name: "Paris",
                spots: ["Eiffel Tower", "Louvre Museum", "Notre Dame"] 
            }
        ]
    },
    {
        country: "USA",
        cities: [
            { 
                name: "New York",
                spots: ["Statue of Liberty", "Central Park"] 
            },
            { 
                name: "Los Angeles",
                spots: ["Hollywood Sign"] 
            }
        ]
    },
    {
        country: "South Korea",
        cities: [
            { 
                name: "Seoul",
                spots: ["N Seoul Tower", "Gyeongbokgung Palace", "Myeongdong"] 
            }
        ]
    },
    {
        country: "Philippines",
        cities: [
            { 
                name: "Cebu",
                spots: ["Kawasan Falls"] 
            },
            { 
                name: "Bohol",
                spots: ["Chocolate Hills", "Tarsier Sanctuary"] 
            }
        ]
    }
];

async function fetchTopDestinations() {
  const res = await fetch("../Backend/getTopCities.php");
  const data = await res.json();
  return data; 
}


async function renderTopDestinations() {
  const listEl = document.getElementById("top-destinations-list");
  if (!listEl) return;

  const top = await fetchTopDestinations();
  console.log(top)

  listEl.innerHTML = "";

  if (!top.length) {
    listEl.innerHTML =
      '<p class="top-empty">No visit records yet.</p>';
    return;
  }

  top.forEach((item, index) => {
    const percent = Math.min(100, item.visit_count * 5); // scale bar
    const row = document.createElement("div");

    row.className = "leaderboard-item";
    row.innerHTML = `
      <span class="rank">${index + 1}</span>
      <span class="destination-name">${item.name}</span>
      <div class="bar-container">
          <div class="bar" style="width: ${percent}%;"></div>
      </div>
      <span class="visits">${item.visit_count}</span>
    `;

    listEl.appendChild(row);
  });
}



//End of DESTINATIONS PART IN ADMIN

/* USERS ------------------------------------- */
const usersData = [
    { username: "tia", email: "christiana@gmail.com", age: 22, gender: "Female", contact: "+63 9221200136" },
    { username: "tio", email: "christiano@gmail.com", age: 25, gender: "Male", contact: "+63 454096976" },
    { username: "rafa", email: "rafaeljohnson@gmail.com", age: 39, gender: "Male", contact: "+63 9191610455" }
];

function renderUsersTable() {
    const tbody = document.getElementById("users-table-body");
    tbody.innerHTML = "";
    usersData.forEach((u, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td>${u.age}</td>
                    <td>${u.gender}</td>
                    <td>${u.contact}</td>
                    <td class="td-actions">
                        <button type="button" class="edit-button" onclick="editUser(${index})">Edit</button>
                        <button type="button" class="delete-button" onclick="deleteUser(${index})">Delete</button>
                    </td>
                `;
        tbody.appendChild(tr);
    });
}

function editUser(index) {
    const u = usersData[index];
    if (!u) return;
    document.getElementById("user-form-title").textContent = "Edit User";
    document.getElementById("user-index").value = index;
    document.getElementById("user-username").value = u.username;
    document.getElementById("user-email").value = u.email;
    document.getElementById("user-age").value = u.age;
    document.getElementById("user-gender").value = u.gender;
    document.getElementById("user-contact").value = u.contact;
    document.getElementById("accounts-table-view").style.display = "none";
    document.getElementById("user-form-view").style.display = "block";
}

function backToAccountsTable() {
    document.getElementById("user-form-view").style.display = "none";
    document.getElementById("accounts-table-view").style.display = "block";
}

function saveUser(e) {
    e.preventDefault();
    const idx = document.getElementById("user-index").value;
    const username = document.getElementById("user-username").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const age = Number(document.getElementById("user-age").value);
    const gender = document.getElementById("user-gender").value;
    const contact = document.getElementById("user-contact").value.trim();

    if (!username || !email || !age || !gender || !contact) {
        alert("Please fill in all fields.");
        return;
    }

    const userObj = { username, email, age, gender, contact };
    if (idx === "") {
        usersData.push(userObj);
    } else {
        usersData[Number(idx)] = userObj;
    }

    alert("User information saved.");
    backToAccountsTable();
    renderUsersTable();
}

function deleteUser(index) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    usersData.splice(index, 1);
    renderUsersTable();
    alert("User information has been deleted.");
}

/* REVIEWS DATA AND SUMMARY ------------------ */
// const pendingReviews = [
//     {
//         name: "Guest User",
//         date: "November 10, 2025",
//         destination: "Eiffel Tower, France",
//         text: "Amazing place! Would love to visit again.",
//         rating: 5
//     },
//     {
//         name: "New Traveler",
//         date: "November 12, 2025",
//         destination: "Grand Canyon, USA",
//         text: "Stunning views, but the trails were crowded.",
//         rating: 4
//     }
// ];

// const approvedReviews = [
//     {
//         name: "Anna Lee",
//         date: "October 22, 2025",
//         destination: "Tokyo Tower, Japan",
//         text: "Beautiful city view, especially at night.",
//         rating: 5
//     },
//     {
//         name: "Michael Cruz",
//         date: "October 25, 2025",
//         destination: "Machu Picchu, Peru",
//         text: "A breathtaking experience with lots of history.",
//         rating: 5
//     },
//     {
//         name: "Sara Kim",
//         date: "October 30, 2025",
//         destination: "Grand Canyon, USA",
//         text: "Great hikes and views.",
//         rating: 4
//     }
// ];

//fetch pending reviews
async function fetchPendingReviews() {
    const res = await fetch("../Backend/getReviews.php");
    const reviews = await res.json();
    
    const pending = reviews
        .filter(r => r.status === "pending")
        .map(r => ({
            name: r.name || "Anonymous",
            destination: r.city_id,
            text: r.review,
            rating: Number(r.rating),
            review_id: r.review_id
        }));
    return pending;
}

//fetch approved reviews
async function fetchApprovedReviews() {
    const res = await fetch("../Backend/getReviews.php");
    const reviews = await res.json();

    const approved = reviews
        .filter(r => r.status === "approved")
        .map(r => ({
            name: r.name || "anonymous",
            destination: r.city_id,
            text: r.review,
            rating: Number(r.rating),
            review_id: r.review_id
        }));

    console.log("Approved Reviews:", approved);
    return approved;
}

let pendingReviews = []; //locally store pending reviews
let approvedReviews = []; //locally store approved reviews

let pendingIndex = 0;
let approvedIndex = 0;

// Fetch reviews once and store in arrays
async function loadReviewsData() {
    pendingReviews = await fetchPendingReviews(); //set value store pending reviews
    approvedReviews = await fetchApprovedReviews(); //set value store approved reviews
    pendingIndex = 0;
    approvedIndex = 0;
    renderPendingReviews();
    renderApprovedReviews();

    updateDots(); //pagination
}

// Render pending review based on pendingIndex
function renderPendingReviews() {
    const list = document.getElementById("pending-reviews-list");
    list.innerHTML = "";

    if (!pendingReviews.length) {
        list.innerHTML = '<p class="reviews-empty">No pending reviews.</p>';
        return;
    }

    const review = pendingReviews[pendingIndex];
    const item = document.createElement("div");
    item.className = "review-item review-item-pending";

    const filled = "★".repeat(review.rating);
    const empty = "☆".repeat(5 - review.rating);

    item.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <h4>${review.name}</h4>
                <div class="review-stars">${filled}${empty}</div>
            </div>
            <div class="review-actions">
                <button type="button" class="add-button" onclick="approveReview(${review.review_id})">
                    <span>Approve</span>
                </button>
                <button type="button" class="delete-button" onclick="rejectReview(${review.review_id})">
                    <span>Reject</span>
                </button>
            </div>
        </div>
        <div class="review-destination">${review.destination}</div>
        <p class="review-text">${review.text}</p>
    `;
    list.appendChild(item);
}

// Render approved review based on approvedIndex
function renderApprovedReviews() {
    const list = document.getElementById("reviews-list");
    list.innerHTML = "";

    if (!approvedReviews.length) {
        list.innerHTML = '<p class="reviews-empty">No published reviews yet.</p>';
        updateRatingsSummary();
        return;
    }

    const review = approvedReviews[approvedIndex];
    const item = document.createElement("div");
    item.className = "review-item";

    const filled = "★".repeat(review.rating);
    const empty = "☆".repeat(5 - review.rating);

    item.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <h4>${review.name}</h4>
                <div class="review-stars">${filled}${empty}</div>
            </div>
            <div class="review-actions">
                <button type="button" class="delete-button" onclick="removeApprovedReview(${review.review_id})">
                    Remove
                </button>
            </div>
        </div>
        <p class="review-text">${review.text}</p>
    `;
    list.appendChild(item);
    updateRatingsSummary();
}

function updateDots() {
    // Pending reviews dots
    const pendingDots = document.getElementById("pending-dots");
    console.log(pendingReviews.length)
    if (pendingDots) {
        pendingDots.innerHTML = "·".repeat(pendingReviews.length); // middle dot
    }

    // Approved reviews dots
    const approvedDots = document.getElementById("approved-dots");
    if (approvedDots) {
        approvedDots.innerHTML = "·".repeat(approvedReviews.length);
    }
}


//initialize reviews
loadReviewsData()

// Pagination buttons
document.getElementById("pending-prev-btn").addEventListener("click", () => {
    if (!pendingReviews.length) return;
    pendingIndex = (pendingIndex - 1 + pendingReviews.length) % pendingReviews.length;
    renderPendingReviews();
});

document.getElementById("pending-next-btn").addEventListener("click", () => {
    if (!pendingReviews.length) return;
    pendingIndex = (pendingIndex + 1) % pendingReviews.length;
    renderPendingReviews();
});

document.getElementById("approved-prev-btn").addEventListener("click", () => {
    if (!approvedReviews.length) return;
    approvedIndex = (approvedIndex - 1 + approvedReviews.length) % approvedReviews.length;
    renderApprovedReviews();
});

document.getElementById("approved-next-btn").addEventListener("click", () => {
    if (!approvedReviews.length) return;
    approvedIndex = (approvedIndex + 1) % approvedReviews.length;
    renderApprovedReviews();
});


//Approve/reject actions for reviews

//function for approving review (PENDING REVIEWS)
async function approveReview(review_id) {
    await fetch("../Backend/manageReview.php", {
        method: "POST",
        body: new URLSearchParams({ review_id, action: "approve" })
    });
    alert("Review Approved!")
    await loadReviewsData(); // refresh lists
}

//function for rejecting review (PENDING REVIEWS)
async function rejectReview(review_id) {
    await fetch("../Backend/manageReview.php", {
        method: "POST",
        body: new URLSearchParams({ review_id, action: "reject" })
    });
    alert("Review Rejected!")
    await loadReviewsData(); // refresh lists
}

//function for removing reviews (PUBLISHED REVIEWS)
async function removeApprovedReview(review_id) {
    console.log(review_id)
    await fetch("../Backend/manageReview.php", {
        method: "POST",
        body: new URLSearchParams({ review_id, action: "reject" })
    });
    alert("Review Successfully Deleted!")
    await loadReviewsData(); // refresh lists
}

// Initial load
loadReviewsData();



// function removeApprovedReview(index) {
//     if (!confirm("Remove this published review?")) return;
//     approvedReviews.splice(index, 1);
//     if (approvedIndex >= approvedReviews.length) {
//         approvedIndex = Math.max(0, approvedReviews.length - 1);
//     }
//     renderApprovedReviews();
// }




function updateRatingsSummary() {
    const total = approvedReviews.length;
    const avgText = document.getElementById("rating-average-text");
    const countText = document.getElementById("rating-count-text");

    if (!total) {
        avgText.textContent = "0.0 out of 5";
        countText.textContent = "0 total customer ratings";
        for (let s = 1; s <= 5; s++) {
            document.getElementById("rating-bar-" + s).style.width = "0%";
            document.getElementById("rating-percent-" + s).textContent = "0%";
        }
        document.getElementById("summary-stars").textContent = "";
        return;
    }

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    approvedReviews.forEach((r) => {
        counts[r.rating] = (counts[r.rating] || 0) + 1;
        sum += r.rating;
    });

    const avg = sum / total;
    avgText.textContent = avg.toFixed(1) + " out of 5";
    countText.textContent = total + " total customer ratings";

    for (let s = 1; s <= 5; s++) {
        const pct = Math.round((counts[s] / total) * 100);
        document.getElementById("rating-bar-" + s).style.width = pct + "%";
        document.getElementById("rating-percent-" + s).textContent = pct + "%";
    }

    const rounded = Math.round(avg);
    const starsFilled = "★".repeat(rounded);
    const starsEmpty = "☆".repeat(5 - rounded);
    document.getElementById("summary-stars").textContent = starsFilled + starsEmpty;
}

/* PROFILE helpers --------------------------- */
function changeAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    document.getElementById("profile-avatar-img").src = url;
}

function saveProfile(e) {
    e.preventDefault();
    alert("Profile saved.");
}

function updatePassword(e) {
    e.preventDefault();
    alert("Password updated.");
}

// Initialize 
window.addEventListener("DOMContentLoaded", () => {
    renderUsersTable();
    renderPendingReviews();
    renderApprovedReviews();

    Object.keys(dataStore.continents).forEach((cont) => {
        dataStore.continents[cont].forEach((c) => {
            ensureCountryDetail(cont, c.countryName);
        });
    });

    updateDashboard()
    renderTopDestinations();
});



