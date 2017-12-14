/* Created by Nagasudhir on 04-Nov-2016 */

// All the geoJSONs are copied from http://www.partners-popdev.org/wp-content/themes/original-child/vendor/Geojson/
//var sources = [[21.6, 71.21, 1.05, "WRLDCMP.SCADA1.A0048293", 400, "AMRELI 400kV SUBSTATION, Gujrat, SUBSTN.AMRL_JTG.BUS.4B1.MES1.KVRY", "OK"]];

window.setTimeout(function () {
    angular.element(document.getElementById('voltage-report')).scope().updateSources(sources);
}, 500);

// creating the tile layers
var osmTileLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {id: 'map'});
var mapStackTileLayer = L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png", {id: 'map'});

// initialising the map and its global variable
var leafletMap = L.map('map').setView([21.14599216495789, 76.343994140625], 6);

// adding tile layer to the map
// mapStackTileLayer.addTo(leafletMap);

// create geoJSON svg border todo try this
var geoBorder = L.geoJson(wrBorderGeo, {
    style: {
        "color": "#aaaaaa",
        "weight": 0,
        "opacity": 0.65
    }
}).addTo(leafletMap);

// Initialise the main plotting canvas
var borderCanvasLayer = L.canvasOverlay()
    .params({})
    .drawing(drawingOnCanvas)
    .addTo(leafletMap);

/*
 // Initialise the masking canvas
 var maskCanvasLayer = L.canvasOverlay()
 .params({"stateShapes": [wrBorderGeo.features]})
 .drawing(drawingOnMask)
 .addTo(leafletMap);
 */

var CircleCanvasLayer = L.CanvasLayer.extend({
    render: function () {
        var canvas = this.getCanvas();
        var ctx = canvas.getContext('2d');
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // get center from the map (projected)
        for (var i = 0; i < sources.length; i++) {
            var sourcePixelPnt = this._map.latLngToContainerPoint(new L.LatLng(sources[i][0], sources[i][1]));
            if (sources[i][6] == "OK" || sources[i][6] == "GOOD") {
                // The source is good
                // todo see acceptable voltage values while plotting the circles
                ctx.beginPath();
                //todo the radius will change according to the voltage and the fill style will change as the error +ve or -ve
                ctx.fillStyle = 'rgba(100,0,0,' + alpha_ + ')';
                ctx.arc(sourcePixelPnt.x, sourcePixelPnt.y, 30, 0, 2 * Math.PI);
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(200,0,0,0.7)';
                ctx.stroke();
            } else {
                // The source is not good
                ctx.beginPath();
                //todo the radius will change according to the voltage and the fill style will change as the error +ve or -ve
                ctx.fillStyle = 'rgba(100,100,0,' + alpha_ + ')';
                ctx.arc(sourcePixelPnt.x, sourcePixelPnt.y, 10, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

    }
});
var layer = new CircleCanvasLayer();
layer.addTo(leafletMap);

// Initialising the videoPlayer Canvas
videoCanvasCtx_ = layer.getCanvas().getContext("2d");

// draw markers for sources on a marker layer
var markers = [];
var myIcon = L.divIcon({
    iconSize: new L.Point(8, 8),
    html: ''
});
for (var i = 0; i < sources.length; i++) {
    markers.push(L.marker([sources[i][0], sources[i][1]], {icon: myIcon}).bindPopup((i + 1) + ". " + sources[i][5] + " " + sources[i][3] + ", " + (sources[i][4] * sources[i][2]).toFixed(2) + " kV"));
}
var sourceMarkersLayer = L.layerGroup(markers);
sourceMarkersLayer.addTo(leafletMap);

// Initialise the global variables for algorithm and UI
var hotPU_ = 1.05;
var coolPU_ = 0.95;
var alpha_ = (document.getElementById("alphaTextControl") != null) ? Number(document.getElementById("alphaTextControl").value) : 0.5;
var transparency_ = (document.getElementById("TransTextControl") != null) ? Number(document.getElementById("TransTextControl").value) : 0.4;

// Getting OpenWeatherMapOverlays
var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5});
var cloudsClassic = L.OWM.cloudsClassic();
var precipitation = L.OWM.precipitation();
var precipitationClassic = L.OWM.precipitationClassic();
var rain = L.OWM.rain();
var rainClassic = L.OWM.rainClassic();
var snow = L.OWM.snow();
var pressure = L.OWM.pressure();
var pressureContour = L.OWM.pressureContour();
var temperature = L.OWM.temperature();
var wind = L.OWM.wind();

// Creating base maps and overlay maps controls
var baseMaps = {
    "OpenStreetMaps": osmTileLayer,
    "MapStack": mapStackTileLayer
};
var overlayMaps = {
    "Borders": geoBorder,
    "Voltage Contour": layer,
    "Substations": sourceMarkersLayer,
    "Clouds": clouds,
    "Clouds Classic": cloudsClassic,
    "Precipitation": precipitation,
    "Precipitation Classic": precipitationClassic,
    "Rain": rain,
    "Rain Classic": rainClassic,
    "Snow": snow,
    "Pressure": pressure,
    "Pressure Contour": pressureContour,
    "Temperature": temperature,
    "Wind": wind
};
L.control.layers(baseMaps, overlayMaps).addTo(leafletMap);

// Start plotting the map
layer.redraw();

/**
 * Canvas Overlay Drawing function for main canvas
 * @param canvasOverlay - The canvas layer
 * @param params - params provided to the drawing function by the canvas layer.  Additional user params can be found at params.options
 */
function drawingOnCanvas(canvasOverlay, params) {

}

/**
 * Sets the global alpha variable from UI
 */
function setAlpha() {
    var temp = document.getElementById("alphaTextControl").value;
    if (!isNaN(temp)) {
        alpha_ = +temp;
    }
}

/**
 * Sets the global transparency variable from UI
 */
function setTransparency() {
    var temp = document.getElementById("TransTextControl").value;
    if (!isNaN(temp)) {
        transparency_ = +temp;
    }
}

/**
 * Resets the map viewport
 */
function resetMapView() {
    if (typeof leafletMap != 'undefined') {
        leafletMap.setView([21.14599216495789, 76.343994140625], 6);
    }
}