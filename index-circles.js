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
        "fillColor": "#111111",
        color: "#aaaaaa",
        "weight": 1,
        "fillOpacity": 0.5
    }
}).addTo(leafletMap);

// Initialise the main plotting canvas
var layer = L.canvasOverlay()
    .params({})
    .drawing(drawingOnCanvas);
layer.addTo(leafletMap);


/**
 * Canvas Overlay Drawing function for main canvas
 * @param canvasOverlay - The canvas layer
 * @param params - params provided to the drawing function by the canvas layer.  Additional user params can be found at params.options
 */
function drawingOnCanvas(canvasOverlay, params) {
    var renderBeginTime = new Date();
    var canvas = this.canvas();
    var ctx = canvas.getContext('2d');
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var mapZoomScaling = Math.pow(2, this._map.getZoom());
    var scalingFactor = mapZoomScaling * alpha_;
    var strategyFunction = null;
    if (renderStrategy_ == "power6") {
        strategyFunction = function (x) {
            return x * x * x * x * x * x;
        }
    } else if (renderStrategy_ == "power5") {
        strategyFunction = function (x) {
            return x * x * x * x * x;
        }
    } else if (renderStrategy_ == "power4") {
        strategyFunction = function (x) {
            return x * x * x * x;
        }
    } else if (renderStrategy_ == "cubic") {
        strategyFunction = function (x) {
            return Math.abs(x * x * x);
        }
    } else if (renderStrategy_ == "quadrilateral") {
        strategyFunction = function (x) {
            return x * x;
        }
    } else {
        strategyFunction = function (x) {
            return Math.abs(x);
        }
    }
    var hideBandVoltages = document.getElementById("hideBandVoltagesChkBox").checked;
    for (var i = 0; i < sources.length; i++) {
        var sourcePixelPnt = this._map.latLngToContainerPoint(new L.LatLng(sources[i][0], sources[i][1]));
        if (sources[i][6] == "OK" || sources[i][6] == "GOOD") {
            var sourceVoltagePUError = sources[i][2] - 1;
            if (Math.abs(sourceVoltagePUError) > 0.1) {
                // The source value is abnormal
                ctx.beginPath();
                ctx.fillStyle = 'rgba(120,0,0,' + alpha_ + ')';
                ctx.arc(sourcePixelPnt.x, sourcePixelPnt.y, mapZoomScaling * 0.04, 0, 2 * Math.PI);
                ctx.fill();
                continue;
            }
            // The source is good
            if (hideBandVoltages && (sourceVoltagePUError + 1) < hotPU_ && (sourceVoltagePUError + 1) > coolPU_) {
                // No need to plot this source
                continue;
            }
            // Limit the sourceVoltagePUError to +-0.06 for plotting
            if (sourceVoltagePUError > 0.06) {
                sourceVoltagePUError = 0.06;
            }
            if (sourceVoltagePUError < -0.06) {
                sourceVoltagePUError = -0.06;
            }

            var circleColor = 'rgba(24,145,228,' + transparency_ + ')';
            if (sourceVoltagePUError > 0) {
                circleColor = 'rgba(200,100,0,' + transparency_ + ')';
            }
            ctx.beginPath();
            ctx.fillStyle = circleColor;
            var circleRadius = 0;
            ctx.arc(sourcePixelPnt.x, sourcePixelPnt.y, scalingFactor * strategyFunction(sourceVoltagePUError), 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = circleColor;
            ctx.stroke();
        } else {
            // The source is not good
            ctx.beginPath();
            ctx.fillStyle = 'rgba(120,120,0,' + alpha_ + ')';
            ctx.arc(sourcePixelPnt.x, sourcePixelPnt.y, mapZoomScaling * 0.04, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    document.getElementById("refresh-time").innerHTML = (new Date() - renderBeginTime);
}

// draw markers for sources on a marker layer
var markers = [];
var myIcon = L.divIcon({
    iconSize: new L.Point(6, 6),
    html: ''
});
for (var i = 0; i < sources.length; i++) {
    markers.push(L.marker([sources[i][0], sources[i][1]], {icon: myIcon}).bindPopup((i + 1) + ". " + sources[i][5] + " " + sources[i][3] + ", " + (sources[i][4] * sources[i][2]).toFixed(2) + " kV"));
    markers[i]._iterId = i;
}
leafletMap.on('popupopen', function (e) {
    var marker = e.popup._source;
    var i = marker._iterId;
    marker._popup.setContent((i + 1) + ". " + sources[i][5] + " " + sources[i][3] + ", " + (sources[i][4] * sources[i][2]).toFixed(2) + " kV");
});

var sourceMarkersLayer = L.layerGroup(markers);
sourceMarkersLayer.addTo(leafletMap);

// Initialise the global variables for algorithm and UI
var hotPU_ = (document.getElementById("highPuInput") != null) ? Number(document.getElementById("highPuInput").value) : 1.05;
var coolPU_ = (document.getElementById("lowPuInput") != null) ? Number(document.getElementById("lowPuInput").value) : 0.95;
var alpha_ = (document.getElementById("alphaTextControl") != null) ? Number(document.getElementById("alphaTextControl").value) : 0.5;
var transparency_ = (document.getElementById("TransTextControl") != null) ? Number(document.getElementById("TransTextControl").value) : 0.4;
var renderStrategy_ = (document.getElementById("renderStrategySelect") != null) ? document.getElementById("renderStrategySelect").value : "quadrilateral";

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
 * Sets the global alpha variable from UI
 */
function setAlpha() {
    var temp = document.getElementById("alphaTextControl").value;
    if (!isNaN(temp)) {
        alpha_ = +temp;
        layer.redraw();
    }
}

/**
 * Sets the global render Strategy variable from UI
 */
function setRenderStrategy() {
    renderStrategy_ = document.getElementById("renderStrategySelect").value;
    layer.redraw();
}

/**
 * Sets the global transparency variable from UI
 */
function setTransparency() {
    var temp = document.getElementById("TransTextControl").value;
    if (!isNaN(temp)) {
        transparency_ = +temp;
        layer.redraw();
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

function toggleBandVoltages() {
    layer.redraw();
}

function setHighLowPU() {
    var temp = document.getElementById("highPuInput").value;
    var changesMade = false;
    if (!isNaN(temp)) {
        hotPU_ = +temp;
        changesMade = true;
    }
    temp = document.getElementById("lowPuInput").value;
    if (!isNaN(temp)) {
        coolPU_ = +temp;
        changesMade = true;
    }
    if (changesMade) {
        layer.redraw();
    }
}