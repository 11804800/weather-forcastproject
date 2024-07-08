// https://api.openweathermap.org/data/2.5/weather?q=Shahdol&appid=1a6d3c613d33e8dd6db82e6a3f2be60c&units=metric
//Using Open Weather Api 
// q is to search city
//appid is private key for the use it is inbuilt
//units metric to show data is celcius degrees

//Api Key
const API_KEY="1a6d3c613d33e8dd6db82e6a3f2be60c";

//Fetching thr form bt id selector 
const SearchForm=document.querySelector("#Search_form");

//Pattern for text only
const Text_pattern=/^[a-zA-Z]/;

//fetching:The City data from local storage and storing it
const cities=localStorage.getItem("cities") ? localStorage.getItem("cities") : [];

//Adding Event Listener to handle form submission to fire an fetch event to fetch city weather data from Api
SearchForm.addEventListener("submit",(event)=>{
    //to stop the event from refreshing the page
    event.preventDefault();

    const cityname=event.target.city_name.value;
    if(Text_pattern.test(cityname)){
        // cities.push(cityname);
        // localStorage.setItem("cities",cities);
        console.log(cities);
    }
    else
    {
        console.log("Write good city name")
    }
});


var Recent_search_div_active=false;
const Recent_search_btn=document.getElementById("recent-search-btn");

Recent_search_btn.addEventListener("click",()=>{
   if(Recent_search_div_active)
    {
        document.querySelector("#recent-searches").style.display="none";
        document.querySelector("#down-caret").style.display="flex";
        document.querySelector("#up-caret").style.display="none";
        Recent_search_div_active=false;
    }
    else
    {
        document.querySelector("#recent-searches").style.display="flex";
        document.querySelector("#down-caret").style.display="none";
        document.querySelector("#up-caret").style.display="flex";
        Recent_search_div_active=true;
    }
});


cities.map((city)=>{
    
});