var cities = [];

var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#five-day-forecast-container");
var pastSearchButtonEl = document.querySelector("#past-search-btn");

var formSumbitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCityWeather (city);
        get5Day (city);
        cities.unshift ({city});
        cityInputEl.value = "";
    } else {
        alert ("Enter a City");
    }
    saveSearch();
    pastSearch (city);
}

var saveSearch = function() {
    localStorage.setItem ("cities", JSON.stringify(cities));
};

var getCityWeather = function(city) {
    var apiKey = "b8119369737e2989683deff7dc5c0290"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
    weatherContainerEl.textContent= "";  
    citySearchInputEl.textContent=searchCity;

    var currentDate = document.createElement("span")
    currentDate.textContent=" (" + moment(weather.dt.value).format("DD/MM/YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);
 
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);
 
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °C";
    temperatureEl.classList = "list-group-item"
   
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"
 
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " KMPH";
    windSpeedEl.classList = "list-group-item"
 
    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);
 
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUVIndex(lat,lon)
 }
 
var getUVIndex = function(lat,lon){
    var apiKey = "b8119369737e2989683deff7dc5c0290"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
}
  
var displayUVIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"
 
    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };
 
    uvIndexEl.appendChild(uvIndexValue);
    weatherContainerEl.appendChild(uvIndexEl);
}

var get5Day = function(city) {
    var apiKey = "b8119369737e2989683deff7dc5c0290"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            display5Day(data);
        });
    });
};

var display5Day = function(weather) {
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "Five-Day Forecast";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8) {
        var dailyForecast = forecast[i];
        
        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2";

        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("DD/MM/YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);

        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °C";

        var forecastHumidityEl = document.createElement("span");
        forecastHumidityEl.classList = "card-body text-center";
        forecastHumidityEl.textContent = dailyForecast.main.humidity + " %";

        var forecastWindSpeedEl = document.createElement("span");
        forecastWindSpeedEl.classList = "card-body text-center";
        forecastWindSpeedEl.textContent = dailyForecast.wind.speed + " KMPH";

        forecastEl.appendChild(weatherIcon);
        forecastEl.appendChild(forecastTempEl);
        forecastEl.appendChild(forecastHumidityEl);
        forecastEl.appendChild(forecastWindSpeedEl);
        forecastContainerEl.appendChild(forecastEl);
        };
};

var pastSearch = function(pastSearch){

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}

var pastSearchHandler = function(event) {
    var city = event.target.getAttribute("data-city");
    if (city) {
        getCityWeather (city);
        get5Day (city);
    };
};

cityFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);