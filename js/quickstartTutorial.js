// Add all scripts to the JS folder
//map variable defined with the .setView method defining center via lat/long and zoom level.
var map = L.map('map').setView([51.505, -0.09], 13);

//L.tileLayer specifies the URL for the OSM tiles complete with maximum zoom level and attribution for credit.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//added to map via the addTo method.
}).addTo(map);

// marker variable defined and marker defined with lat/long coordinates and added to the map. 
var marker = L.marker([51.5, -0.09]).addTo(map);


var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//bindPopup method is used for the marker, circle and polygon features to create a pop up with the resultant text via string and/or HTML element.
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//popup varible defined with lat/long, content and invoked with the openOn method which, according to documentation, will close a previously opened popup.
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

//map.on method used for the onMapClick function to display lat/long for pop up window.
map.on('click', onMapClick);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);