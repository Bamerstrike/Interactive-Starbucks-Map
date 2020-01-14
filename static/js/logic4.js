
// var mapboxAccessToken = {your access token here};
var map = L.map('map').setView([37.8, -96], 5);

//here is where we call to our data points to fill in the map.
var link = "http://127.0.0.1:5000/api";


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
}).addTo(map);

// console.log(statesData.features);
statesData.features.splice(51,1)
statesData.features.splice(8,1);
console.log(statesData.features);
L.geoJson(statesData).addTo(map);


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
      fillColor: getColor(feature.properties.Store_Count),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}
// L.geoJson(link, {style: style}).addTo(map);

d3.json(link, function(data) {

  
  // Add LaborForce and starbucks count in geojson
  for(i=0; i<50; i++){
    //Labor Force: 358859, Personal Income Capital: 57527, Store Count: 49
    statesData.features[i].properties.Labor_Force = data[states[i]]["Labor Force"];
    statesData.features[i].properties.Personal_Income_Capita = data[states[i]]["Personal Income Capital"];
    statesData.features[i].properties.Store_Count = data[states[i]]["Store Count"];

  }

});

// console.log(statesData);


function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
  });
  layer.on("mouseover", function(d) {
    console.log(d)
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
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
// function onEachFeature(feature, layer) {
//   console.log(feature.properties);



//   layer.on({
//       mouseover: highlightFeature,
//       mouseout: resetHighlight,
//       click: zoomToFeature,
//       // click: layer.bindPopup(`hi`)
//   }).bindPopup(`${feature.properties.Labor_Force}`);

// }
geojson = L.geoJson(statesData, {
  style: style,
  // onEachFeature: onEachFeature,
  onEachFeature: function(feature,layer){
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    })
    // .bindPopup(`${feature.properties.Labor_Force}`);

  }
  
}).addTo(map);


// layer.on("mouseover", function(d) {
//   console.log(feature.properties.name)
// });



// var a;

// axios.get(link)
//   .then(function (response) {
//     // handle success
//     console.log(response.data);
//     // a = response.data;
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   });

// console.log(a);

// d3.json(link).then((data) => {
//   console.log(data);
  
//   var newMarker = L.marker()

//   geoJson = L.choropleth(data, {
//     onEachFeature: function(feature, layer) {
//       newMarker.bindPopup("State: " + feature[0])
//     }
//   }).addTo(map);

// });


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Starbucks Store Count:</h4>' +  (props ?
        '<b>' + props.name + '</b><br/>' + props.Store_Count + ' Stores'
        : 'Hover over a state') + '<h4>State Labor Force:</h4>' + (props ?
          '<b>' + '</b><br/>' + props.Labor_Force + ' people'
          : 'Hover over a state') + '<h4>Average Personal Income per Capita:</h4>' + (props ?
            '<b>' + '</b>$' + props.Personal_Income_Capita
            : 'Hover over a state');
};

info.addTo(map);


d3.selectAll("path").on("mouseover", function(d) {console.log(statesData.features)});


// // Grabbing our GeoJSON data..
// d3.json(link, function(data) {
//   // Creating a geoJSON layer with the retrieved data
//   L.geoJson(data, {
//     // Style each feature (in this case a neighborhood)
//     style: function(feature) {
//       return {
//         color: "white",
//         // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
//         fillColor: chooseColor(),
//         fillOpacity: 0.5,
//         weight: 1.5
//       };
//     },
//     // Called on each feature
//     onEachFeature: function(, layer) {
//       // Set mouse events to change map styling
//       layer.on({
//         // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
//         mouseover: function(event) {
//           layer = event.target;
//           layer.setStyle({
//             fillOpacity: 0.9
//           });
//         },
//         // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
//         mouseout: function(event) {
//           layer = event.target;
//           layer.setStyle({
//             fillOpacity: 0.5
//           });
//         },
//         // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
//         click: function(event) {
//           map.fitBounds(event.target.getBounds());
//         }
//       });
//       // Giving each feature a pop-up with information pertinent to it
//       layer.bindPopup("<h1>" +  + "</h1> <hr> <h2>" +  + "</h2>");

//     }
//   }).addTo(map);
// });
