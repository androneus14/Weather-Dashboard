var apiKey = 'b8119369737e2989683deff7dc5c0290'; // Open Weather API Key

// Define Variables
var searchForm = document.querySelector('#search-form'); // User input search form
var inputCity = document.querySelector('#input-city'); // button to search
var getWeather = document.querySelector('#rendered-weather-conditions'); // render all weather conditions here.
var historyList = []; // array to hold all search history
var pastSearchButtons = document.querySelector('#history-buttons'); // buttons to render previous search data


// Call API to get city name with its longitude and latitude
var getCityData = function (city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
    fetch(queryURL)
        .then(function(response) {
            response.json()
                .then(function (data) {
                    var cityName = data.name;
                    var cityLat = data.coord.lat;
                    var cityLon = data.coord.lon;
                    renderCityWeatherConditions(
                        cityName,
                        cityLat,
                        cityLon
                    );
                    // Use this later with local storage in our previous searches list
                    pastSearch(cityName);
                })
        });
    
    // Call the API to render weather conditions based on the searched cities latitude and longitude
    var renderCityWeatherConditions = function (cityName, lat, long) {
        var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + long +"&exclude=minutely,hourly,alerts&appid=" + apiKey + "&units=metric";
        fetch(weatherURL)
            .then(function (response) {
                response.json().then(function (weatherData) {
                    // Getting current weather conditions 
                    var currentUnixTime = moment.unix(weatherData.current.dt);
                    var currentDate = moment(currentUnixTime).format('DD/MM/YYYY');
                    var currentWeatherIcon = weatherData.current.weather[0].icon;
                    var currentTemperature = weatherData.current.temp;
                    var currentHumidity = weatherData.current.humidity;
                    var currentWindSpeed = weatherData.current.wind_speed;

                    // Create a div to hold the current weather conditions
                    var currentCityConditions = document.createElement('div');
                    currentCityConditions.classList = 'currentCityConditions';

                    // Append city name, the current date and the current weather's icon to the html
                    currentCityConditions.innerHTML = 
                        `<h2>${cityName} ${currentDate}<img src="https://openweathermap.org/img/w/${currentWeatherIcon}.png"></h2> `
                    getWeather.append(currentCityConditions);

                    // Create <p> elements to post temp, humidity and wind speed data into the currentCityConditions <div>
                    var renderedWeatherConditions = document.createElement('p');
                    renderedWeatherConditions.classList = 'current-conditions-list';
                    renderedWeatherConditions.innerHTML = `
                    <p>Temp(°C): ${currentTemperature} °C </p>
                    <p>Humidity(%): ${currentHumidity} % </p>
                    <p>Wind Speed(KMPH): ${currentWindSpeed} KMPH </p>
                    `

                    // Append the data into the currentCityConditions <div>
                    currentCityConditions.append(renderedWeatherConditions);

                    // Display all the above data 
                    displayRenderedForecast(weatherData.daily)
                })
            });
    }
};

// Five Day Weather Forecast section
var displayRenderedForecast = function (weatherData2) {
    // Create <div> and Five-Day Forecast header element
    var fiveDayHeader = document.createElement('div');
    fiveDayHeader.classList = 'five-day-header';
    fiveDayHeader.innerHTML = `
    <h3>Five Day Weather Forecast: </h3>
    `;
    // Append Five Day Forecast Header element to the 'weather' variable
    getWeather.append(fiveDayHeader);

    // Create <div> container to hold the five day weather forecast with class name 'five-day-conditions-container'
    var fiveDayConditions = document.createElement('div');
    fiveDayConditions.classList = 'five-day-conditions-container';
    // Append to the weather variable
    getWeather.append(fiveDayConditions);


    // Create for loop to get future weather conditions
    for (var i = 1; i < 5; i++) {
        var fiveDayTime = moment.unix(weatherData2[i].dt);
        var fiveDayDate = weatherData2[i].temp.day;
        var fiveDayWeatherIcon = weatherData2[i].weather[0].icon;
        var fiveDayTemperature = Math.round(weatherData2[i].temp.max);
        var fiveDayWindSpeed = weatherData2[i].wind_speed;
        var fiveDayHumidity = weatherData2[i].humidity;
        var fiveDayDate = moment(fiveDayTime).format('DD/MM/YYYY');

        // Create <div> to hold the five day weather forecast items
        var fiveDayConditionsDiv = document.createElement('div');
        fiveDayConditionsDiv.classList = 'fiveDay-list';
        fiveDayConditionsDiv.innerHTML = `
        <h4>${fiveDayDate}</h4>
            <div>
                <p><img src="https://openweathermap.org/img/w/${fiveDayWeatherIcon}.png"> </p>
                <p>Temp(°C): ${fiveDayTemperature} °C </p>
                <p>Humidity(%): ${fiveDayHumidity} % </p>
                <p>Wind Speed(KMPH): ${fiveDayWindSpeed} KMPH </p>
            </div>
        `;

        // Append All five day weather data into fiveDayConditions
        fiveDayConditions.appendChild(fiveDayConditionsDiv);
    } 
};

// Past searches stored into local storage
function pastSearch (savedCity) {
    historyList = JSON.parse(localStorage.getItem('searchHistoryList'));
    
    if (historyList.indexOf(savedCity) == -1) {
        historyList.push(savedCity);
        searchHistoryButton(savedCity);
    }
    localStorage.setItem('searchHistoryList', JSON.stringify(historyList));
};

// Create buttons for past searches
function historyButtons () {
    pastSearchButtons.innerHTML = '';

        // Create for loop to create search history list. List is unlimited
        for (var i = 0; i < historyList.length; i++) {
            // Varible for name of the buttons
            var pastHistoryButtons = historyList[i];
            // Create the button elements
            var createHistoryButton = document.createElement('button');
            // TextContent the city names onto the buttons
            createHistoryButton.textContent = pastHistoryButtons;
            createHistoryButton.setAttribute('class', 'btn');
            createHistoryButton.setAttribute('city-history', pastHistoryButtons);

            pastSearchButtons.prepend(createHistoryButton);
        }
};

// User search form function
var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = inputCity.value.trim();

    if (cityName) {
        getCityData(cityName);
        getWeather.textContent = '';
        inputCity.value = '';
    } else {
        alert('Enter city name!')
    }
};

//
var historyBtnHandler = function (event) {
    var cityHistory = event.target.getAttribute('city-history');
    if (cityHistory) {
        getCityData(cityHistory);
        getWeather.textContent = '';
    }
};

function addButton (cityName) {
    var historyButtonTitle = cityName;
    var createButton = document.createElement('button');
    createButton.textContent = historyButtonTitle;
    createButton.setAttribute('class', 'btn');
    createButton.setAttribute('city-history', cityName);
    pastSearchButtons.prepend(createButton);
}

// Event Listeners
searchForm.addEventListener('submit', formSubmitHandler);
pastSearchButtons.addEventListener('click', historyBtnHandler);
