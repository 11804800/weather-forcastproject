

//Fetching thr form bt id selector
const SearchForm = document.querySelector("#Search_form");

//Fetching the clear search history btn
const Clear_Recent_Search_btn=document.querySelector("#clear-recent-search");


//Pattern for text only
const Text_pattern = /^[a-zA-Z]/;

//fetching:The City data from local storage and storing it
var cities = localStorage.getItem("cities")
  ? JSON.parse(localStorage.getItem("cities"))
  : [];

//Adding Event Listener to clear search history btn
Clear_Recent_Search_btn.addEventListener("click",function()
{
  cities=[];
  localStorage.clear();
  RenderRecentCities();
});

//Function :TO set the input of form the city clicked from recent cities list
function SetCity(city) {
  document.querySelector("#city_name").value=city;
}

//Function: For displaying the search city data
function RenderRecentCities() {
  let Recent_City_div = document.querySelector("#recent-searches");
  if (cities.length == 0 && document.querySelector("#no-recent-search-data")) {
    document.querySelector("#no-recent-search-data").style.display = "flex";
  } else {
    Recent_City_div.innerHTML = "";
    cities.map((city) => {
      Recent_City_div.innerHTML += `<div class="w-full min-h-fit shadow py-3 px-4 font-medium ">
            <button class="w-full min-h-fit px-4 hover:bg-slate-600 hover:text-white" onclick="SetCity('${city}')">${city}</button></div>`;
    });
  }
}

//Adding Event Listener to handle form submission to fire an fetch event to fetch city weather data from Api
SearchForm.addEventListener("submit", (event) => {
  //to stop the event from refreshing the page
  event.preventDefault();

  const cityname = event.target.city_name.value;
  if (Text_pattern.test(cityname)) {
    cities.unshift(cityname);
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(cities);
    RenderRecentCities();
  } else {
    console.log("Write good city name");
  }
});

var Recent_search_div_active = false;
const Recent_search_btn = document.getElementById("recent-search-btn");

Recent_search_btn.addEventListener("click", () => {
  if (Recent_search_div_active) {
    document.querySelector("#recent-searches-div").style.display = "none";
    document.querySelector("#down-caret").style.display = "flex";
    document.querySelector("#up-caret").style.display = "none";
    Recent_search_div_active = false;
  } else {
    document.querySelector("#recent-searches-div").style.display = "flex";
    document.querySelector("#down-caret").style.display = "none";
    document.querySelector("#up-caret").style.display = "flex";
    Recent_search_div_active = true;
  }
});

RenderRecentCities();
