// Declare the map variable
var map;
var minValue;

// Create the map
function createMap() {

    map = L.map('map').setView([32, -81], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    getData();
}

// Calculate minimum value for proportional symbols
function calculateMinValue(data){

    var allValues = [];

    for(var city of data.features){
        for(var year = 2016; year <= 2024; year++){   // fixed loop
            var value = Number(city.properties["Pop_" + year]);
            if (!isNaN(value)){
                allValues.push(value);
            }
        }
    }

    return Math.min(...allValues);
}

// Calculate proportional symbol radius
function calcPropRadius(attValue) {

    var minRadius = 5;

    var radius = 1.0083 * Math.pow(attValue/minValue, 0.5715) * minRadius;

    return radius;
}

// NEW: Named pointToLayer function (from tutorial)
function pointToLayer(feature, latlng){

    var attribute = "Pop_2016";

    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var attValue = Number(feature.properties[attribute]);

    options.radius = calcPropRadius(attValue);

    var layer = L.circleMarker(latlng, options);

    // Popup content
    var popupContent =
        "<p><b>City:</b> " + feature.properties.City + "</p>" +
        "<p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";

    layer.bindPopup(popupContent, {
        offset: new L.Point(1,-options.radius)
    });

    return layer;
}

// Add proportional symbols to map
function createPropSymbols(data){

    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
}

// Retrieve GeoJSON data
function getData(){

    fetch("data/Chatham_municipalities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){

            minValue = calculateMinValue(json);

            createPropSymbols(json);
        });
}

// Initialize map when DOM loads
document.addEventListener('DOMContentLoaded', createMap);
