// Justin Hatin
// Main Presenter Module -- handles all functionality of the application
"use strict";

var Main = (function () {
    // private vars
    var _map;
    var _startingCoords;
    var _selectedCoords;
    var _infoWindow;
    var _currentMarker;
    var _currentLocName = "";
    var _savedLocations = [];
    var SAVE_KEY = "favorites";
    var UNIT_TYPES = {
        fahrenheit: "imperial",
        celsius: "metric"
    };
    var _units = UNIT_TYPES.fahrenheit;

    // public function to start app -- Utilize geolocation API to get user's current location
    function getStartingLocation() { // attempt to get user's location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                _startingCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
                _initMap();
            }, _useDefaultLocation); // use default if there's an error
        }
        else {
            _useDefaultLocation(); // use default if geolocation not enabled
        }
    }

    // private vars
    function _useDefaultLocation() {
        _startingCoords = { lat: 43.083848, lng: -77.6799 };
        _initMap();
    }

    function _initMap() {
        _selectedCoords = _startingCoords;
        var mapOptions = {
            center: _startingCoords,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        _map = new google.maps.Map(document.getElementById('map'), mapOptions);
        _map.setTilt(45);

        google.maps.event.addListener(_map, 'click', function (event) {
            _selectedCoords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            _getWeatherDataByCoords(_selectedCoords.lat, _selectedCoords.lng);
        });

        _initButtons();

        // load favorites 
        _savedLocations = _getData(SAVE_KEY);

        var favTab = document.getElementById("favorites");
        if (!_savedLocations || _savedLocations.length < 1) {
            _savedLocations = []; // set to empty collection
            if (favTab) {
                favTab.classList.add("hide");
            }
        }
        else {
            if (favTab) { // populate favorites tab
                _populateFavorites();
            }
        }

        // make call for initial weather data
        _getWeatherDataByCoords(_startingCoords.lat, _startingCoords.lng);
    }

    function _addMarker(lat, long, title) {
        var position = { lat: lat, lng: long };
        var marker = new google.maps.Marker({ position: position, map: _map });
        if (_currentMarker) { // delete old marker
            _currentMarker.setMap(null);
        }
        _currentMarker = marker; // set this marker to current
        marker.setTitle(title);
        _map.panTo(marker.position); // re-center map on new marker
        _makeInfoWindow(marker.position, marker.title);
        google.maps.event.addListener(marker, 'click', function (e) { // recreate info window if closed
            _makeInfoWindow(this.position, this.title);
        });
    }

    function _makeInfoWindow(position, msg) {
        if (_infoWindow) {
            _infoWindow.close(); // close existing window
        }

        // create new window
        _infoWindow = new google.maps.InfoWindow({
            map: _map,
            position: position,
            content: "<b>" + msg + "</b>"
        })
    }

    function _initButtons() {
        // change unit type based on radio buttons
        var impRadioBtn = document.getElementById("impRadio");
        if (impRadioBtn) {
            impRadioBtn.onchange = function () {
                if (impRadioBtn.checked && _units != UNIT_TYPES.fahrenheit) {
                    _units = UNIT_TYPES.fahrenheit;

                    // rerun current search with new unit
                    _getWeatherDataByCoords(_currentMarker.position.lat(), _currentMarker.position.lng());
                }
            };
        }

        var metRadioBtn = document.getElementById("metRadio");
        if (metRadioBtn) {
            metRadioBtn.onchange = function () {
                if (metRadioBtn.checked && _units != UNIT_TYPES.celsius) {
                    _units = UNIT_TYPES.celsius;

                    // rerun current search with new unit
                    _getWeatherDataByCoords(_currentMarker.position.lat(), _currentMarker.position.lng());
                }
            };
        }

        // search bar and button
        var citySearchBar = document.getElementById("citySearchBar");
        var errorLabel = document.getElementById("error");
        if (citySearchBar) {
            citySearchBar.onkeypress = function (e) {
                if (e.keyCode == 13) { // search on enter
                    e.preventDefault();
                    _performSearch(citySearchBar, errorLabel);
                }
            };
        }

        // Save current marker location
        var saveBtn = document.getElementById("addFavorite");
        if (saveBtn) {
            saveBtn.onclick = function () {
                var favLoc = {
                    name: _currentLocName,
                    lat: _currentMarker.position.lat(),
                    lng: _currentMarker.position.lng()
                };

                _savedLocations.push(favLoc);
                _setData(_savedLocations, SAVE_KEY);

                // display and populate favorites tab
                var favTab = document.getElementById("favorites");
                if (favTab) {
                    if (favTab.classList.contains("hide")) {
                        favTab.classList.remove("hide");
                    }

                    // populate with entries
                    _populateFavorites();
                }
            };
        }
    }

    function _populateFavorites() {
        // set up entries in tab with template
        var favList = document.getElementById("favList");
        var favListHTML = favList.innerHTML;
        if (favListHTML != "") {
            favListHTML = "";
        }

        var template = document.getElementById("favTemplate");
        var i = 0;
        var l = _savedLocations.length;
        for (i; i < l; i++) {
            var loc = _savedLocations[i];
            var templateHTML = template.innerHTML;
            templateHTML = templateHTML.replace("{Location}", loc.name);
            templateHTML = templateHTML.replace("{num}", i);
            templateHTML = templateHTML.replace("{num}", i);
            favListHTML += templateHTML;
        }
        favList.innerHTML = favListHTML;

        // Add click events to each entry's button
        i = 0;
        for (i; i < l; i++) {
            var btn = document.getElementById("favBtn" + i);
            btn.loc = _savedLocations[i];
            btn.onclick = function (e) {
                _getWeatherDataByCoords(e.target.loc.lat, e.target.loc.lng);
            };

            var delBtn = document.getElementById("delBtn" + i);
            delBtn.loc = _savedLocations[i];
            delBtn.onclick = function (e) {
                var indexToRemove = _savedLocations.indexOf(e.target.loc);
                _savedLocations.splice(indexToRemove, 1);
                _setData(_savedLocations, SAVE_KEY);
                if (_savedLocations.length > 0) {
                    _populateFavorites();
                }
                else {
                    var favTab = document.getElementById("favorites");
                    if (favTab) {
                        favTab.classList.add("hide");
                    }
                }
            };
        }
    }

    function _performSearch(searchBar, errorMsg) {
        var cityToFind = searchBar.value; // grab value from search bar
        if (cityToFind != "") { // ensure a value is entered
            _showHideErrorMsg(errorMsg, false);
            _getWeatherDataByCity(cityToFind);
        }
        else {
            _showHideErrorMsg(errorMsg, true);
        }
    }

    function _showHideErrorMsg(msg, show) { // show error message if needed
        if (!show && msg.style.display != "none") {
            msg.style.display = "none";
        }
        else if (show && msg.style.display != "block") {
            msg.style.display = "block";
        }
    }

    function _showWeatherInfo(data) {
        var infoPanel = document.getElementById("locInfo");

        // get template and make modifications
        var template = document.getElementById("infoTemplate");
        var templateHTML = template.innerHTML;

        templateHTML = templateHTML.replace("{Name}", _currentLocName);
        templateHTML = templateHTML.replace("{Group}", data.weather[0].main);
        templateHTML = templateHTML.replace("{Hi}", data.main.temp_max + "\xB0");
        templateHTML = templateHTML.replace("{Lo}", data.main.temp_min + "\xB0");
        templateHTML = templateHTML.replace("{Humidity}", data.main.humidity + "%");
        templateHTML = templateHTML.replace("{Wind}", data.wind.speed + (_units == UNIT_TYPES.fahrenheit ? "mph" : "m/s"));
        templateHTML = templateHTML.replace("{Clouds}", data.clouds.all + "%");

        // place template in the DOM
        infoPanel.innerHTML = templateHTML;
    }

    // alert user to when application is loading
    function _showHideProcessing() {
        var body = document.body;
        var loading = document.getElementById("loading");
        if (body.classList.contains("dim") && !loading.classList.contains("hide")) {
            body.classList.remove("dim");
            loading.classList.add("hide");
        }
        else {
            body.classList.add("dim");
            loading.classList.remove("hide");
        }
    }

    function _getWeatherDataByCoords(lat, long) {
        _showHideProcessing(); // display loading
        var xhr = new XMLHttpRequest();

        var requestLink = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=" + _units + "&APPID=f286e2990fed460a17964af2d80b3c60";

        xhr.onload = function () {
            var response = xhr.responseText;
            _showHideProcessing(); // remove loading

            if (response) {
                response = JSON.parse(response);

                if (response.cod != "502") {
                    // get current location name
                    _currentLocName = response.name;

                    // add marker with response data
                    _addMarker(lat, long, "Current Temp: " + response.main.temp + "\xB0"); // hex value for degree symbol

                    // add panel with further details
                    _showWeatherInfo(response);
                }
                else {
                    var error = document.getElementById("error");
                    _showHideErrorMsg(error, true);
                }
            }
            else {
                // add marker with not available text
                _addMarker(lat, long, "Current Temp: Not Available");
            }
        }

        xhr.open('GET', requestLink, true);
        xhr.send();
    }

    function _getWeatherDataByCity(city) {
        _showHideProcessing(); // display loading
        var xhr = new XMLHttpRequest();

        var requestLink = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + _units + "&APPID=f286e2990fed460a17964af2d80b3c60";

        xhr.onload = function () {
            var response = xhr.responseText;
            _showHideProcessing(); // remove loading

            if (response) {
                response = JSON.parse(response);

                if (response.cod != "502") {
                    // get current location name
                    _currentLocName = response.name;

                    // add marker with response data
                    _addMarker(response.coord.lat, response.coord.lon, "Current Temp: " + response.main.temp + "\xB0"); // hex value for degree symbol

                    // add panel with further details
                    _showWeatherInfo(response);
                }
                else {
                    var error = document.getElementById("error");
                    _showHideErrorMsg(error, true);
                }
            }
            else {
                // add marker with not available text
                _addMarker(lat, long, "Current Temp: Not Available");
            }
        }

        xhr.open('GET', requestLink, true);
        xhr.send();
    }

    // Browser memory functions
    function _setData(obj, key) {
        localStorage.setItem(key, JSON.stringify(obj));
    }

    function _getData(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    return {
        getStartingLocation: getStartingLocation
    }
}());