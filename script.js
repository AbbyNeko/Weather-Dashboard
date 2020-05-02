
var lastSearchedCitiesArr = [];
var apiKey = "3ef140f248af9099eb6c4c8305dc72fb";
var todaysDate = moment().format('MMMM Do YYYY');

//Event listener for Search City button

$("#search-city").on("click", function(evt) {

    evt.preventDefault();

    var cityValue = $("#city").val();
    console.log("city value - "+cityValue);

    //sends request to weather API and displays data on web page
    searchWeatherAPI(cityValue);

    //If city has not entered before, add new button for City
    if(!isDuplicate(cityValue)) {
        lastSearchedCitiesArr.push(cityValue);
        localStorage.setItem("lastSearchCities", JSON.stringify(lastSearchedCitiesArr));
        updateCityBtns(lastSearchedCitiesArr);
    }
           
});

//Makes request to weather API to search for current weather conditions and 5 day forecast

function searchWeatherAPI(cityValue) {

    //Get current weather data
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q="+ cityValue +"&appid="+apiKey,
        method: "GET"
    }).then(function(response){

        console.log("response - "+JSON.stringify(response));

        //show current weather conditions
        $("#city-header").append(cityValue);
        $("#date").append(todaysDate);

        $("#current-weather").css({"border": "1px black solid", "border-radius": "25px"});
        $("#current-weather-data").append("<p>Weather: "+response.weather[0].main+"</p>");
        $("#current-weather-data").append("<p>Temperature: "+ convertToFahrenheit(response.main.temp) +"&deg;F</p>");
        $("#current-weather-data").append("<p>Humidity: "+response.main.humidity+"%</p>");

    });

    //Get 5 day weather forecast
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q="+ cityValue +"&appid="+apiKey,
        method:"GET"
    }).then(function(response) {

            console.log("5 day forecast result - "+JSON.stringify(response));

            //show 5 day future forecast

            /*
                USING CARD GROUPS FOR #future-forecast section

                <div class="card">
                    <img class="card-img-top" src="..." alt="Card image cap">
                    <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                </div>

            

            $("#future-forecast").append("<h2>5-Day Forecast:</h2>");
            $(".card-group").append("<h2>5-Day Forecast:</h2>");

            for(var i = 0; i < 5; i++) {

                var cardDiv = $("<div>");
                cardDiv.addClass("card");

            }
        */

    });


}

//convert Kelvin to Fahrenheit
function convertToFahrenheit(kelvinTemp) {

    var temp = parseFloat(kelvinTemp);
    
    var fTemp = temp-273.15
    fTemp = fTemp * 1.80 + 32;
    fTemp = fTemp.toFixed(2);

    return fTemp;

}


//Updates UI to have the newly added city buttons 
function updateCityBtns(cityValue) {

 /*
how the last searched city buttons will look like

<ul class="list-group">
  <li class="list-group-item active">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
*/


}


//Checks if City value is already added to last searched cities array. If yes, return false. If city is new, return true.
function isDuplicate(cityValue) {

    var check = lastSearchedCitiesArr.filter(function(n) {
        return n == cityValue;
    });

    if(check != null && check.length > 0) {
        return true;
    }else {
        return false;
    }
    
}