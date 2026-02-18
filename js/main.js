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
        for(var year = 2016; year <= 2024; year++){
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

// Named pointToLayer function
function pointToLayer(feature, latlng, attributes){

    var attribute = attributes[0]; // initial attribute

    console.log(attribute); // check

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

    var popupContent =
        "<p><b>City:</b> " + feature.properties.City + "</p>" +
        "<p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";

    layer.bindPopup(popupContent, {
        offset: new L.Point(1, -options.radius)
    });

    return layer;
}

// Add proportional symbols to map
function createPropSymbols(data, attributes){

    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
}

// Sequence controls
function createSequenceControls(attributes){

    // Slider creation
    var slider = "<input class='range-slider' type='range'>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);

    // set slider attributes
    var rangeSlider = document.querySelector(".range-slider");
    rangeSlider.max = attributes.length - 1;
    rangeSlider.min = 0;
    rangeSlider.value = 0;
    rangeSlider.step = 1;

    // Buttons
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse">Reverse</button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward">Forward</button>');

    // Symbol update
    function updateMap(index){
        var attribute = attributes[index];
        updatePropSymbols(attribute);
    }

    // initial display
    updateMap(0);

    // Slider input listener
    rangeSlider.addEventListener('input', function(){
        var index = this.value;
        updateMap(index);
    });

    // Button click listeners
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            var index = Number(rangeSlider.value);
            //adjusted for population field values.
            if (step.id == 'forward'){
                index++;
                index = index > 9 ? 0 : index; 
            } else if (step.id == 'reverse'){
                index--;
                index = index < 0 ? 9 : index;
            }

            rangeSlider.value = index;
            updateMap(index);
        });
    });
}

// Symbol update for geoJSON variables.
function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        if(layer.feature && layer.feature.properties[attribute]){
            var props = layer.feature.properties;

            // update radius
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            // update popup content
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Population in " + year + ":</b> " + props[attribute] + "</p>";

            if (layer.getPopup()){
                layer.getPopup().setContent(popupContent);
            }
        }
    });
}

// Retrieve geoJSON attribute values
function getData(map){
    fetch("data/Chatham_municipalities.geojson")
        .then(function(response){ return response.json(); })
        .then(function(json){
            var attributes = processData(json);
            minValue = calculateMinValue(json);
            createPropSymbols(json, attributes);
            createSequenceControls(attributes);
        });
}

// Process attributes from GeoJSON
function processData(data){
    var attributes = [];
    var properties = data.features[0].properties;

    for (var attribute in properties){
        if (attribute.indexOf("Pop_") > -1){
            attributes.push(attribute);
        }
    }

    console.log(attributes);
    return attributes;
}

// Initialize map
document.addEventListener('DOMContentLoaded', createMap);
