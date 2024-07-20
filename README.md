
# Weather Forecast using Html Tailwindss and Javascript

It is an html website for weather forecast information the user can get weather information of any city and by their location also this enhances the user experience and give 14 days extra info about the upcoming days.




## Acknowledgements

 - [Visual Crosse web services Api ] https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline
## Tech Stack

**Client:** Html, TailWindcss, Javascript


## API Reference

#### Get Weather info by city name

```http
  https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityname}?unitGroup=metric&key=${key}&contentType=json
```

| City Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `cityname` | `string` | **Required**.Api key |

#### Get weather info using latitude and longitude

```http
   https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=${key}&contentType=json
```

| latitude,longitude | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `lat`,`long`      | `string` | **Required**. Api Key |

#### 

Gives Info about the weather




## Authors

- [Nikhil-Pathak https://github.com/11804800]


## Run Locally

Clone the project

```bash
  git clone https://github.com/11804800/weather-forcastproject
```

Go to the project directory

```bash
  cd weather-forcastproject

Open the index.html file now you can use the website

