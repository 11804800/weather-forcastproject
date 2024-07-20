//Using Visual crossing web srvice for weather info

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
//clearing the recent search history data;
Clear_Recent_Search_btn.addEventListener("click", function () {
  Recent_search_div_active =false;
  cities = [];
  localStorage.clear();
  RenderRecentCities();
  document.querySelector("#recent-searches-div").style.display = "none";

});


//Function: For Showing the loading icon while the user is searching for the city info
function Loading(isLoading)
{
  //Condition: True then it will show loading and if error message is show it will hide that message;
  if(isLoading)
  {
    Error(false,"");
    document.querySelector("#extended-days-weather-info-container").innerHTML="";
    document.querySelector("#present-day-weather-info").innerHTML="";
    document.querySelector("#loading").style.display = "flex";
  }
  //conditon :False then it will hide the loading div
  else
  {
    document.querySelector("#loading").style.display = "none";
  }
}


//function :Erorr Message will be shown if the User type any thing wrong 
function Error(isError,code)
{
  //condtion :True then it will show the error message
  if(isError)
  {
    document.querySelector("#error").style.display="flex";

    if(code ===404)
    {
      document.querySelector("#error").innerHTML=`<h3>City Not Found ${code}</h3>`;
    }
    else if(code ===400)
    {
      document.querySelector("#error").innerHTML=`<h3>Bad Request Please Try again ${code}</h3>`;
    }
    else
    {
      document.querySelector("#error").innerHTML="Something Went Wrong"
    }
  }
  //condition :False Then it will hide that message
  else
  {
    document.querySelector("#error").style.display="none";
    document.querySelector("#error").innerHTML="";
  }
}


//Function to fetch the data
function GetWeatherData(cityname)
{
  Loading(true);
  fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityname}?unitGroup=metric&key=XZFNNWD26NQVG7TGQ7G9WQTGD&contentType=json`)
  .then((response) => response.json())
  .then((response)=>{
    RenderWeatherData(response);
  },(err)=>{
    Loading(false);
    Error(true,err.statusCode);
  })
  .catch((err)=>console.log(err));
}

//Function: For displaying the search city data
function RenderRecentCities() {
  let Recent_City_div = document.querySelector("#recent-searches");
  //if no recent search data then it will hide 
  if (cities.length == 0) {
    document.querySelector("#recent-search-btn").style.display = "none";
  } 
  //else it will show the recent search button
  else {
    document.querySelector("#recent-search-btn").style.display = "flex";
    Recent_City_div.innerHTML = "";
    //this will only render the unique ones;
    const city=[...new Set(cities.map((item)=>item))];
    city.map((city) => {
      Recent_City_div.innerHTML += `<div class="w-full min-h-fit shadow py-3 px-4 font-medium ">
            <button class="w-full min-h-fit px-4 hover:bg-slate-600 hover:text-white" onclick="GetWeatherData('${city}')">${city}</button></div>`;
    });
  }
}





//Adding Event Listener to handle form submission to fire an fetch event to fetch city weather data from Api
SearchForm.addEventListener("submit", (event) => {
  //to stop the event from refreshing the page
  event.preventDefault();

  //Validating the city name will it a valid text then it will 
  //then showing loading indicator
  //then fetching the data from the Api
  //then rendering it to the dom
  const cityname = event.target.city_name.value;
  if (Text_pattern.test(cityname)) {
    cities.unshift(cityname);
    localStorage.setItem("cities", JSON.stringify(cities));
    GetWeatherData(cityname);
    RenderRecentCities();
    
  } 
  //conditon false it will show message
  else {
    alert("Write a valid city name");
  }
});

//showing the caret up and down boolean
var Recent_search_div_active = false;
const Recent_search_btn = document.getElementById("recent-search-btn");

//if it will be true then it show the data else will hide the data;
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

//rendering the recent search data;
RenderRecentCities();

//getting the recent date 
const date = new Date();
//creating and format ti show the present data and day
const dateformat = new Intl.DateTimeFormat("en-In", {
  dateStyle: "full",
});

//function:Rendering the 14 days extra forecast data
function RenderExtendedWeatherData(data) {
  var extended_weather_info_container = document.querySelector(
    "#extended-days-weather-info-container"
  );


  //splice the first data becasue it is the present day
  data.splice(1, data.length).map((item) => {
    extended_weather_info_container.innerHTML += `<div class="flex text-center flex-col gap-1 p-2 rounded shadow" style="min-width:160px;background:rgb(226, 230, 234)" key=${item.datetime}>
    <h1 class="font-medium">${item?.datetime}</h1>
    <h2 class="font-medium" style="font-size:26px"> ${item?.temp}&#176;C</h2>
    <div class="flex gap-1 justify-center items-center">
        <img src=${`../images/${item?.icon}.png`} width="30" height="30" alt=${item?.icon}/>
        <p class="font-medium">${item?.conditions}</p>
    </div>
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

//rendering the data of present day
function RenderWeatherData(data) {
  const present_weather_info_container = document.querySelector(
    "#present-day-weather-info"
  );

  //calling the function that will set the loading to false when the data will be loading
  Loading(false);

  present_weather_info_container.innerHTML = `
  <div class="w-[100%] flex flex-col justify-between h-[100%] " style="background:rgba(255,255,255,0.1)">
    <div class="w-[96%] flex flex-col md:flex-row gap-2 p-2 justify-between items-center">
      <div class="flex gap-4 items-center">
         <div class="p-1">
           <h1 style="font-size:50px">${data?.days[0]?.temp}&#176;C</h1>
         </div>
         <div>
            <h1 style="font-size:18px;" >${data?.address}</h1>
            <h1>${data?.timezone}</h1>
            <div class="flex gap-2 w-[100%] text-sm">
              <p>${dateformat.format(date)}</p>
            </div>
          </div>
      </div>
       <div class="flex flex-col justify-center items-center">
        <img src=${`../images/${data.days[0].icon}.png`} width="80" height="50" alt=${data.days[0].icon}/>
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

  
  //calling the function to render the extra days forecast info;
  const extra_days_forecast=document.querySelector("#extra-days-forecast");
  extra_days_forecast.innerHTML = `${data.days.length-1} Days of Forecast`;
  RenderExtendedWeatherData(data.days);
}



//Geting the user coordinates
//function: to get the wearther info by using th user loaction;
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

//calling the function initially to get the weather data;
GetLocation();


