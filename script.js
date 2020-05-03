
var lastSearchedCitiesArr = [];
var todaysDate = moment().format('MMMM D, YYYY');
var savedLastSearched = localStorage.getItem("lastSearchCities");

if(savedLastSearched) {
    lastSearchedCitiesArr = JSON.parse(savedLastSearched);
    updateCityBtns(lastSearchedCitiesArr);
}

//Event listener for Search City button
$("#search-city").on("click", function(evt) {

    evt.preventDefault();

    var cityValue = $("#city").val();
    //console.log("city value - "+cityValue);

    //sends request to weather API and displays data on web page
    searchWeatherAPI(cityValue);

    //If city has not entered before, add new button for City
    if(!isDuplicate(cityValue)) {
        lastSearchedCitiesArr.push(cityValue);
        localStorage.setItem("lastSearchCities", JSON.stringify(lastSearchedCitiesArr));
    }

    updateCityBtns(lastSearchedCitiesArr);

           
});


//event listener for last city buttons
$(".last-city").on("click", function() {

    var cityAttr = $(this).attr("city");
    //console.log("city attribute - "+cityAttr);
    searchWeatherAPI(cityAttr);

});



//Makes request to weather API to search for current weather conditions and 5 day forecast

function searchWeatherAPI(cityValue) {

    //Get current weather data
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q="+ cityValue +"&appid=3ef140f248af9099eb6c4c8305dc72fb",
        method: "GET"
    }).then(function(response){

        //console.log("response - "+JSON.stringify(response));

        //show current weather conditions
        $("#city-header").text(cityValue);
        $("#date").text(todaysDate);

        //empty div and then add in new data
        $("#current-weather-data").empty();
        $("#current-weather").css({"border": "1px black solid", "border-radius": "25px"});
        $("#current-weather-data").append("<img src='https://openweathermap.org/img/w/"+response.weather[0].icon+".png' alt='weather icon'/>");
        $("#current-weather-data").append("<p><strong>Weather:</strong> "+response.weather[0].main+"</p>");
        $("#current-weather-data").append("<p><strong>Temperature:</strong> "+ convertToFahrenheit(response.main.temp) +"&deg;F</p>");
        $("#current-weather-data").append("<p><strong>Wind Speed:</strong> "+response.wind.speed+" MPH</p>");
        $("#current-weather-data").append("<p><strong>Humidity:</strong> "+response.main.humidity+"%</p>");

            //gets UV index and displays it. block is color code based on how favorable conditions are
             getUVIndex(response.coord.lat, response.coord.lon);


    });


    //Get 5 day weather forecast
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q="+ cityValue +"&appid=3ef140f248af9099eb6c4c8305dc72fb",
        method:"GET"
    }).then(function(response) {

            //console.log("5 day forecast result - "+JSON.stringify(response));
            //console.log("5 day forecast result list - "+JSON.stringify(response.list));


            //show 5 day future forecast
            $(".forecast-label").text("5-Day Forecast:");
            $(".card-group").empty();

            var daysPassed = 1;
            var currentDay = '';

            for(var i = 0; i < 5; i++) {

                //display date of next day, date after and so forth
                currentDay = moment().add(daysPassed, "days");
                var cardDiv = $("<div>");
                cardDiv.addClass("card");

                var cardBody = $("<div>");
                cardBody.addClass("card-body text-center");
                cardBody.append("<p><strong>"+ currentDay.format('MM/DD/YYYY') +"</strong></p>");

                var forecastData = searchForecastData(currentDay, response);
                cardBody.append("<img src='https://openweathermap.org/img/w/"+forecastData.weather[0].icon+".png' alt='weather icon'/>");
                cardBody.append("<p><strong>Temp:</strong> "+ convertToFahrenheit(forecastData.main.temp) +"&deg;F</p>");
                cardBody.append("<p><strong>Humidity:</strong> "+ forecastData.main.humidity +"%</p>");

                cardDiv.append(cardBody);
                $(".card-group").append(cardDiv);

                daysPassed++;

            }
        

    });


}

//Does AJAX request to get UV index. chooses color based on how favorable conditions are
function getUVIndex(lat, lon) {

    //console.log("date filter - "+moment().format("X"));

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi/history?appid=3ef140f248af9099eb6c4c8305dc72fb&lat="+lat+"&lon="+lon+"&start="+moment().format("X")+"&end="+ moment().format("X") +"&cnt=1",
        method: "GET"
    }).then(function(uvResponse){
        
        console.log("UV index response - "+JSON.stringify(uvResponse));
        var colorBasedOnIndex = '';
        var textColor = "white";

        if(uvResponse[0].value >= 0 && uvResponse[0].value < 3) {
            colorBasedOnIndex = "green";
        } else if(uvResponse[0].value >= 3 && uvResponse[0].value < 6) {
            colorBasedOnIndex = "yellow"; 
            //making text black to help with contrast
            textColor = "black";
        } else if(uvResponse[0].value >= 6 && uvResponse[0].value < 8) {
            colorBasedOnIndex = "orange";
        } else if(uvResponse[0].value >= 8 && uvResponse[0].value < 11) {
            colorBasedOnIndex = "red";
        } else if(uvResponse[0].value >= 11) {
            colorBasedOnIndex = "purple";
        }

        //console.log("color based on index - "+colorBasedOnIndex);

        $("#current-weather-data").append("<p><strong>UV Index: </strong><span style='border-radius:10px; padding:5px; width:20px; color:"+textColor+"; background-color:"+colorBasedOnIndex+";'>"+uvResponse[0].value+"</span></p>");

    });

}

//Search Forecast data response by date. Returns weather object data
function searchForecastData(date, response) {

    var currentDate = date.format('YYYY-MM-DD');
    currentDate += " 03:00:00";
    //console.log("current date - "+currentDate);

    //jquery version of array.filter
    var check = $.grep(response.list, function(element, index) {
        return element.dt_txt == currentDate;
    });

   //console.log("check forecast data - "+JSON.stringify(check));
    
    if(check != null && check.length > 0) {
        return check[0];
    } else {
        return '';
    }

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
function updateCityBtns(lastSearchedCitiesArr) {

 /*
how the last searched city buttons will look like

  <li class="list-group-item active">Cras justo odio</li>

*/

$(".btn-group-vertical").empty();

     for(var n = 0; n < lastSearchedCitiesArr.length; n++) {

        var listItem = $("<button>");
        listItem.addClass("btn btn-light last-city");
        listItem.attr("city", lastSearchedCitiesArr[n]);
        listItem.text(lastSearchedCitiesArr[n]);
        $(".btn-group-vertical").append(listItem);

     }

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