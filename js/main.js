// Declare the map variable with setView method defining map center (Denver approx.) and zoom level.
var map;

// Create the map function
function createMap() {
    // Create the map
    map = L.map('map').setView([32, -81], 9);

    // Add the Alidade Smooth Dark base tilelayer to the map
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(map);

    // Call the function to load GeoJSON data
    getData();
}

// Function to retrieve the GeoJSON data and add it to the map
function getData() {
    fetch("data/Chatham_municipalities.geojson")
        .then(function(response) {
            return response.json();  // Parse the JSON data
        })
        .then(function(json) {
            // Create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json).addTo(map);
        });
}

// Call createMap() when the DOM content is loaded
document.addEventListener('DOMContentLoaded', createMap);
