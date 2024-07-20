//https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/shahdol?unitGroup=metric&include=days%2Ccurrent&key=XZFNNWD26NQVG7TGQ7G9WQTGD&contentType=json
//Using Open Weather Api
// q is to search city
//appid is private key for the use it is inbuilt
//units metric to show data is celcius degrees

//Api Key
const API_KEY = "1a6d3c613d33e8dd6db82e6a3f2be60c";

//Fetching thr form bt id selector
const SearchForm = document.querySelector("#Search_form");

//Fetching the clear search history btn
const Clear_Recent_Search_btn = document.querySelector("#clear-recent-search");

//Pattern for text only
const Text_pattern = /^[a-zA-Z]/;

//fetching:The City data from local storage and storing it
var cities = localStorage.getItem("cities")
  ? JSON.parse(localStorage.getItem("cities"))
  : [];

//Adding Event Listener to clear search history btn
Clear_Recent_Search_btn.addEventListener("click", function () {
  cities = [];
  localStorage.clear();
  RenderRecentCities();
  document.querySelector("#recent-searches-div").style.display = "none";

});


function Loading(isLoading)
{
  if(isLoading)
  {
    Error(false,"");
    document.querySelector("#extended-days-weather-info-container").innerHTML="";
    document.querySelector("#present-day-weather-info").innerHTML="";
    document.querySelector("#loading").style.display = "flex";
  }
  else
  {
    document.querySelector("#loading").style.display = "none";
  }
}

function Error(isError,message)
{
  if(isError)
  {
    document.querySelector("#error").style.display="flex";
    document.querySelector("#error").innerHTML=`<h3>${message}</h3>`;
  }
  else
  {
    document.querySelector("#error").style.display="flex";
    document.querySelector("#error").innerHTML="";
  }
}

//Function :TO set the input of form the city clicked from recent cities list
function SetCity(city) {
  document.querySelector("#city_name").value = city;
}

//Function: For displaying the search city data
function RenderRecentCities() {
  let Recent_City_div = document.querySelector("#recent-searches");
  if (cities.length == 0) {
    document.querySelector("#recent-search-btn").style.display = "none";
  } else {
    document.querySelector("#recent-search-btn").style.display = "flex";
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
    Loading(true);
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityname}?unitGroup=metric&key=XZFNNWD26NQVG7TGQ7G9WQTGD&contentType=json`)
    .then((response) => response.json())
    .then((response)=>{
      Loading(false);
      RenderWeatherData(response);
    },(err)=>{
      Loading(false);
      Error(true,err.message);
    })
    .catch((err)=>console.log(err));
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

const date = new Date();
const dateformat = new Intl.DateTimeFormat("en-In", {
  dateStyle: "full",
});


function RenderExtendedWeatherData(data) {
  var extended_weather_info_container = document.querySelector(
    "#extended-days-weather-info-container"
  );


  data.splice(1, data.length).map((item) => {
    extended_weather_info_container.innerHTML += `<div class="flex text-center flex-col gap-1 p-2 rounded shadow" style="min-width:160px;background:rgb(226, 230, 234)" key=${item.datetime}>
    <h1 class="font-medium">${item?.datetime}</h1>
    <h2 class="font-medium" style="font-size:26px"> ${item?.temp}&#176;C</h2>
    <p class="font-medium">${item?.conditions}</p>
    <ul class="flex flex-col w-[100%] font-medium" style="font-size:13px">
      <li class="flex justify-between p-1 w-[100%]">
         <p>Feelslike:</p>
         <p>${item?.feelslike}&#176;C</p>
      </li>
      <li class="flex justify-between p-1 w-[100%]">
         <p>Wind:</p>
         <p>${item?.windspeed} m/s</p>
      </li>
      <li class="flex justify-between p-1 w-[100%]">
         <p>Humidity:</p>
         <p>${item?.humidity}%</p>
      </li>
    <ul>
    </div>`;
  });
}

function RenderWeatherData(data) {
  const present_weather_info_container = document.querySelector(
    "#present-day-weather-info"
  );

  present_weather_info_container.innerHTML = `
  <div class="w-[100%] flex flex-col justify-between h-[100%] " style="background:rgba(255,255,255,0.1)">
    <div class="w-[96%] flex flex-col md:flex-row gap-2 p-2 justify-between items-center">
      <div class="flex gap-4 items-center">
         <div class="p-1">
           <h1 style="font-size:50px">${data?.days[0]?.temp}&#176;C</h1>
         </div>
         <div>
            <h1 style="font-size:18px;" >${data?.address}</h1>
            <div class="flex gap-2 w-[100%] text-sm">
              <p>${dateformat.format(date)}</p>
            </div>
          </div>
      </div>
       <div>
         <p style="font-size:18px">${data?.days[0]?.conditions}</p>
       </div>
    </div>
    <div class="flex gap-2 p-2 overflow-x-auto">
      <div class="shadow rounded  p-2 " style="min-width:160px; background:rgb(226, 232, 231);" >
        <h1 class="w-[100%] py-2">Tempreture : &nbsp;${
          data?.days[0]?.temp
        }&#176;C</h1>
        <ul class="text-sm w-[100%] flex flex-col gap-2">
          <li class="w-[100%] flex justify-between">
            <p>Min:</p>
            <p>${data?.days[0]?.tempmin}&#176;C</p>
          </li>
          <li class="w-[100%] flex justify-between">
            <p>Max:</p>
            <p>${data?.days[0]?.tempmax}&#176;C</p>
          </li>
          <li class="w-[100%] flex justify-between">
            <p>FeelsLike:</p>
            <p>${data?.days[0]?.feelslike}&#176;C</p>
          </li>
        </ul>
      </div>
      <div class="shadow rounded p-2" style="min-width:140px; background:rgb(226, 232, 231);">
      <h1 class="w-[100%] py-2 text-center">Wind</h1>
        <ul class="text-sm w-[100%] flex flex-col gap-2">
          <li class="w-[100%] flex justify-between">
             <p>Speed</p>
             <p>${data?.days[0]?.windspeed}m/s</p>
          </li>
          <li class="w-[100%] flex justify-between">
            <p>Direction</p>
            <p>${data?.days[0]?.winddir}m/s</p>
          </li>
          <li class="w-[100%] flex justify-between">
            <p>Gust</p>
            <p>${data?.days[0]?.windgust}m/s</p>
          </li>
        </ul>
      </div>
      <div class="shadow rounded p-2" style="min-width:140px; background:rgb(226, 232, 231);">
        <ul class="text-sm w-[100%] flex flex-col gap-2 py-5">
          <li class="w-[100%] flex justify-between">
           <p>Humidity:</p>
           <p>${data?.days[0]?.humidity}%</p>
          </li>
          <li class="w-[100%] flex justify-between">
            <p>Pressure:</p>
            <p>${data?.days[0]?.pressure} Pa</p>
          </li>
         </ul>
      </div>
      <div class="shadow rounded p-2" style="min-width:160px; background:rgb(226, 232, 231);">
        <ul class="text-sm w-[100%] flex flex-col gap-2 py-5">
          <li class="w-[100%] flex justify-between">
            <p>SunRise:</p>
            <p>${data?.days[0]?.sunrise} AM</p>
          </li>
          <li class="w-[100%] flex justify-between">
            <p>SunSet:</p>
            <p>${data?.days[0]?.sunset} PM</p>
          </li>
        </ul>
      </div>
      <div class="shadow rounded p-2" style="min-width:160px; background:rgb(226, 232, 231);">
        <ul class="text-sm w-[100%] flex flex-col gap-2 py-5">
          <li class="w-[100%] flex justify-between">
            <p>UVindex:</p>
            <p>${data?.days[0]?.uvindex}</p>
          </li>
          <li class="w-[100%] flex justify-between">
            <p>Solar Radiation:</p>
            <p>${data?.days[0]?.solarradiation}</p>
          </li>
        </ul>
      </div>
      <div class="shadow rounded p-2" style="min-width:160px; background:rgb(226, 232, 231);">
        <ul class="text-sm w-[100%] flex flex-col gap-2 py-5">
          <li class="w-[100%] flex justify-between">
             <p>Cloud Cover:</p>
             <p>${data?.days[0]?.cloudcover}</p>
          </li>
          <li class="w-[100%] flex justify-between">
             <p> Visibility:</p>
             <p>${data?.days[0]?.visibility}</p>
          </li>
          <li class="w-[100%] flex justify-between">
            <p> Solar-Energy:</p>
            <p>${data?.days[0]?.solarenergy}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>`;

  
  const extra_days_forecast=document.querySelector("#extra-days-forecast");
  extra_days_forecast.innerHTML = `${data.days.length-1} Days of Forecast`;
  RenderExtendedWeatherData(data.days);
}



//Geting the user coordinates
function GetLocation()
{
  navigator.geolocation.getCurrentPosition((position)=>{
    const {latitude,longitude}=position.coords;
    if(latitude && longitude) {
      Loading(true);
      fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=XZFNNWD26NQVG7TGQ7G9WQTGD&contentType=json`)
    .then((response) => response.json())
    .then((response)=>{
      Loading(false);
      RenderWeatherData(response);
    },(err)=>{
      Loading(false);
      Error(true,err.message);
    })
    .catch((err)=>console.log(err));
    }
  });
}

GetLocation();


