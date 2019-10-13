let API_KEY = "pk.eyJ1IjoicmVoYXJyaXMyIiwiYSI6ImNrMTcybTdsOTFjNTQzcHRrY28yZXFnbTIifQ._O7e2CJiogksGHOxvysmvw";

//Store API inside url
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Create a map object
var myMap = L.map("map", {
    center: [40.7608, -111.8910],
    zoom: 4.5
  });
  
  
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 15,
		id: "mapbox.light",
        accessToken: API_KEY
    }).addTo(myMap);

//Perform a GET request to the url

d3.json(url, function(data) {
    console.log(data.features);
    createFeatures(data.features);

});


//Colors for the earthquake and legend
function getColor (d) {
    return d > 5 ? '#253494' :
	       d > 4 ? '#2c7fb8' :
	       d > 3 ? '#41b6c4' :
	       d > 2 ? '#7fcdbb' :
	       d > 1 ? '#c7e9b4' :
	               '#ffffcc';
}

//Adding the Legend to the Map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1,2,3,4,5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}

	return div;
};

legend.addTo(myMap);


// Using the pointToLayer option to create a CircleMarker


function createFeatures(earthquakeData) {
var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        var geojsonMarkerOptions = {
            radius: feature.properties.mag * 3,
            fillColor: getColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
           }
           
        //console.log(feature.properties.mag);
        return L.circleMarker(latlng, geojsonMarkerOptions)
        .bindPopup("<h1>" + feature.properties.place + "</h1>")}
    
}).addTo(myMap);

}

