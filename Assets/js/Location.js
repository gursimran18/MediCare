// Map initialization 
var map = L.map('map').setView([22.43, 77.69], 13);
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
//osm.addTo(map);
// water color 
var watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
});
// watercolor.addTo(map)

// dark map 
var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
// dark.addTo(map)

// google street 
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 11,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
 googleStreets.addTo(map);

//google satellite
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
// googleSat.addTo(map)

var wms = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: 'geoapp:admin',
    format: 'image/png',
    transparent: true,
    attribution: "wms test"
});



/*==============================================
                    MARKER
================================================*/
var myIcon = L.icon({
    iconUrl: 'img/red_marker.png',
    iconSize: [40, 40],
});
var singleMarker = L.marker([28.3949, 84.1240], { icon: myIcon, draggable: true });
var popup = singleMarker.bindPopup('This is the Nepal. ' + singleMarker.getLatLng()).openPopup()
popup.addTo(map);

var secondMarker = L.marker([29.3949, 83.1240], { icon: myIcon, draggable: true });

console.log(singleMarker.toGeoJSON())


/*==============================================
            GEOJSON
================================================*/
var pointData = L.geoJSON(pointJson).addTo(map)
var lineData = L.geoJSON(lineJson).addTo(map)
var polygonData = L.geoJSON(polygonJson, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(`<b>Name: </b>` + feature.properties.name)
    },
    style: {
        fillColor: 'red',
        fillOpacity: 1,
        color: '#c0c0c0',
    }
}).addTo(map);
