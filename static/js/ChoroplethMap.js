
// var mapboxAccessToken = {your access token here};
var map = L.map('map').setView([37.8, -96], 5);
map.invalidateSize();
//here is where we call to our data points to fill in the map.
var extension = "/api";


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + API_KEY, {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
}).addTo(map);

// Gets rid of DC and Puerto Rico
statesData.features.splice(51,1)
statesData.features.splice(8,1);

// Maps the states dependent on the stores in each state
L.geoJson(statesData, {style: style}).addTo(map);


// Creates a color scheme to separate how much store each state has
function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 600  ? '#BD0026' :
         d > 500  ? '#E31A1C' :
         d > 400  ? '#FC4E2A' :
         d > 300   ? '#FD8D3C' :
         d > 200   ? '#FEB24C' :
         d > 100   ? '#FED976' :
                    '#FFEDA0';
}


function style(feature) {
  return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

d3.json(extension, function(data) {
  
  // Add LaborForce and starbucks count in geojson
  for(i=0; i<50; i++){

    statesData.features[i].properties.Labor_Force = data[states[i]]["Labor Force"];
    statesData.features[i].properties.Personal_Income_Capita = data[states[i]]["Personal Income Capital"];
    statesData.features[i].properties.Store_Count = data[states[i]]["Store Count"];

  }

});


function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
  });
  info.update(layer.feature.properties);
}
function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}
function zoomToFeature(e, layer) {
  map.fitBounds(e.target.getBounds());
  // layer.bindPopup("State: " + feature.properties.name);

}

geojson = L.geoJson(statesData, {
  style: style,
  // onEachFeature: onEachFeature,
  onEachFeature: function(feature,layer){
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    })

  }
  
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  console.log(this);
    this._div.innerHTML = '<h4>Starbucks Store Count:</h4>' +  (props ?
        '<b>' + props.name + '</b><br/>' + props.Store_Count + ' Stores'
        : 'Hover over a state') + '<h4>State Labor Force:</h4>' + (props ?
          '<b>'  + props.Labor_Force + ' people'
          : 'Hover over a state') + '<h4>Average Personal Income per Capita:</h4>' + (props ?
            '<b>' + '</b>$' + props.Personal_Income_Capita
            : 'Hover over a state');
};

info.addTo(map);


// d3.selectAll("path").on("mouseover", function(d) {console.log(statesData.features)});