// Open Weather API Key
var apiKey = "b8119369737e2989683deff7dc5c0290"

// Define Variables
var searchedCity = $("city-search");
var inputCity = $("input-city");
var currentDate = $("current-city-name");
var currentTemperature = $("#temperature");
var currentWindSpeed = $("#wind-speed");
var currentHumidity = $("humidity");
var fiveDayForecast = $("fiveDayForecast");
var city = "";

// Function to produce searched cities weather conditions
function currentConditions(city) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey).then(function (response) {
        return response.json().then(function (data) {
            var lon = data[0].lon;
            var lat = data[0].lat;
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric" + "&appid=" +apiKey).then (function (response) {
                return response.json().then(function (weatherConditions) {
                    currentTemperatureEl.textContent = "Temp: " + weatherConditions.current.temp + "°C";
                    currentWindSpeedEl.textContent = "Wind Speed: " + weatherConditions.current.wind-speed + "KM/H";
                    currentHumidityEl.textContent = "Humidity: " + weatherConditions.current.humidity + "%";

                    var date = moment.unix(weatherConditions.current.dt).format("DD / MM / YYYY");
                    currentDateEl.textContent = city + " " + date;
                    

                    // Five Day Weather Section
                    document.getElementById("#fiveDayWeather").textContent = "Five Day Forecast: ";
                    fiveDayForecastEl.innerHTML = " ";
                    for (var i = 0; i < 5; i++) {
                        var weather = document.createElement("div");
                        weather.setAttribute("class", "col");
                        var currentWeather = document.createElement("div");
                        currentWeather.setAttribute("class");
                        var currentWeatherContainer = document.createElement("div");
                        currentWeatherContainer.setAttribute("class");
                        var h4 = document.createElement("h4").textContent = moment.unix(weatherConditions.main[i].dt);
                        var fiveDayTemperature = document.createElement("ul").textContent = "Temperature: " + weatherConditions.main[i].temp.day + "°C";
                        var fiveDayWindSpeed = document.createElement("ul").textContent = "Wind: " + weatherConditions.main[i].wind-speed + "KM/H";
                        var fiveDayHumidity = document.createElement("ul").textContent = "Humidity: " + weatherConditions.main[i].humidity + "%";


                        // append onto the HTML
                        currentWeatherContainer.append(h4, fiveDayTemperature, fiveDayWindSpeed, fiveDayHumidity);
                        currentWeather.append(currentWeatherContainer);
                        weather.append(currentWeather);
                        fiveDayForecastEl.append(weather);
                    };
                });
            });
        });
    });
};

// Click Handlers
$("searched-city").on("click", currentConditions);
