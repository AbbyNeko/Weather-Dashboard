
var lastSearchedCitiesArr = [];


//Event listener for Search City button

$("#search-city").on("click", function(evt) {

    evt.preventDefault();

    var cityValue = $(this).val();
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

function searchWeatherAPI() {


    /*
        USING CARD GROUPS FOR #future-forecast section

            <div class="card-group">
        <div class="card">
            <img class="card-img-top" src="..." alt="Card image cap">
            <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            </div>
        </div>
        <div class="card">
            <img class="card-img-top" src="..." alt="Card image cap">
            <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            </div>
        </div>
        <div class="card">
            <img class="card-img-top" src="..." alt="Card image cap">
            <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            </div>
        </div>
        </div>

    */


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