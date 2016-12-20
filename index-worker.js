/* Created by Nagasudhir on 04-Nov-2016 */

// All the geoJSONs are copied from http://www.partners-popdev.org/wp-content/themes/original-child/vendor/Geojson/
//var sources = [[21.6, 71.21, 1.05, "WRLDCMP.SCADA1.A0048293", 400, "AMRELI 400kV SUBSTATION, Gujrat, SUBSTN.AMRL_JTG.BUS.4B1.MES1.KVRY", "OK"]];

window.setTimeout(function () {
    angular.element(document.getElementById('voltage-report')).scope().updateSources(sources);
}, 500);

// A single global render worker anf its working status
var renderWorker_;
var renderStatus_ = {"isWorking": false};

// creating the tile layers
var osmTileLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {id: 'map'});
var mapStackTileLayer = L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png", {id: 'map'});

// initialising the map and its global variable
var leafletMap = L.map('map').setView([21.14599216495789, 76.343994140625], 6);

// adding tile layer to the map
//mapStackTileLayer.addTo(leafletMap);

// create geoJSON svg border
//L.geoJson(statesData).addTo(leafletMap);

// Initialise the main plotting canvas
var borderCanvasLayer = L.canvasOverlay()
    .params({})
    .drawing(drawingOnCanvas)
    .addTo(leafletMap);

// Initialise the masking canvas
var maskCanvasLayer = L.canvasOverlay()
    .params({"stateShapes": [wrBorderGeo.features]})
    .drawing(drawingOnMask)
    .addTo(leafletMap);

// Initialising the videoPlayer Canvas
videoCanvasCtx_ = borderCanvasLayer.canvas().getContext("2d");

// draw markers for sources on a marker layer
var markers = [];
var myIcon = L.divIcon({
    iconSize: new L.Point(8, 8),
    html: ''
});
for (var i = 0; i < sources.length; i++) {
    markers.push(L.marker([sources[i][0], sources[i][1]], {icon: myIcon}).bindPopup(i + ". " + sources[i][5] + " " + sources[i][3]));
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
    "Voltage Contour": borderCanvasLayer,
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
maskCanvasLayer.redraw();

/**
 * Canvas Overlay Drawing function for main canvas
 * @param canvasOverlay - The canvas layer
 * @param params - params provided to the drawing function by the canvas layer.  Additional user params can be found at params.options
 */
function drawingOnCanvas(canvasOverlay, params) {

}

/**
 * Canvas Overlay Drawing function for masking canvas
 * @param canvasOverlay - The canvas layer
 * @param params - params provided to the drawing function by the canvas layer.  Additional user params can be found at params.options
 */
function drawingOnMask(canvasOverlay, params) {
    //get the context of the mask canvas
    var ctx = canvasOverlay.canvas().getContext("2d");

    //clear the mask canvas
    ctx.clearRect(0, 0, canvasOverlay.canvas().width, canvasOverlay.canvas().height);

    //canvas context color settings for drawing the mask border of the states
    ctx.fillStyle = "rgba(255,255,255, 0.1)";
    ctx.strokeStyle = "rgba(255,116,0, 0.1)";

    //plotting the state shapes from geoJSONs passed in params.options.stateShapes
    for (var p = 0; p < params.options.stateShapes.length; p++) {
        //for each state
        for (var i = 0; i < params.options.stateShapes[p].length; i++) {
            //for each shape in state
            if (params.options.stateShapes[p][i].geometry.type == "Polygon") {
                //If the shape is a Polygon
                var pathPoints = params.options.stateShapes[p][i].geometry.coordinates[0];
                ctx.beginPath();
                var pt = canvasOverlay._map.latLngToContainerPoint([pathPoints[0][1], pathPoints[0][0]]);
                ctx.moveTo(pt.x, pt.y);
                for (var k = 1; k < pathPoints.length; k++) {
                    pt = canvasOverlay._map.latLngToContainerPoint([pathPoints[k][1], pathPoints[k][0]]);
                    ctx.lineTo(pt.x, pt.y);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else if (params.options.stateShapes[p][i].geometry.type == "MultiPolygon") {
                //If the shape is a MultiPolygon
                var polygonSet = params.options.stateShapes[p][i].geometry.coordinates;
                for (var l = 1; l < polygonSet.length; l++) {
                    var pathPoints = polygonSet[l][0];
                    ctx.beginPath();
                    var pt = canvasOverlay._map.latLngToContainerPoint([pathPoints[0][1], pathPoints[0][0]]);
                    ctx.moveTo(pt.x, pt.y);
                    for (var k = 1; k < pathPoints.length; k++) {
                        pt = canvasOverlay._map.latLngToContainerPoint([pathPoints[k][1], pathPoints[k][0]]);
                        ctx.lineTo(pt.x, pt.y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
            //for each shape in state -- end
        }
        //for each state -- end
    }

    //get the mask image data in borderImageData variable
    var borderImageData = ctx.getImageData(0, 0, params.canvas.width, params.canvas.height);

    //clear the mask canvas
    ctx.clearRect(0, 0, canvasOverlay.canvas().width, canvasOverlay.canvas().height);

    //send the this mask canvas data to the main canvas rendering function
    drawWorkerApproxVoltageContour(borderImageData);
}

/**
 * Main canvas contour rendering function
 * @param imageData - The mask layer image data that is used to mask the rendering to the state borders
 */
function drawWorkerApproxVoltageContour(imageData) {
    // record the rendering start time
    var timeStart = new Date();

    // get the canvas Layer of the main canvas
    var canvasOverlay = borderCanvasLayer;

    // get the main canvas map plotting variables
    var width = borderCanvasLayer.canvas().width;
    var height = borderCanvasLayer.canvas().height;
    //npx = latSpan/canvasWidth; npy = lngSpan/canvasHeight; npxRatioSquare = npy*npy/(npx*npx);
    var southEast = canvasOverlay._map.getBounds().getSouthEast();
    var northWest = canvasOverlay._map.getBounds().getNorthWest();
    var npx = (southEast.lng - northWest.lng) / width;
    npx = Math.abs(npx);
    var npy = (northWest.lat - southEast.lat) / height;
    npy = Math.abs(npy);
    var npxRatioSquare = (npy * npy) / (npx * npx);

    // get the global algorithm variables
    var hotPU = hotPU_;
    var coolPU = coolPU_;
    var alpha = alpha_;
    var transparency = transparency_;

    // calculate source pixel locations
    var sourcePixelLocations = [];
    for (var i = 0; i < sources.length; i++) {
        if (sources[i][6] != "OK" && sources[i][6] != "GOOD") {
            sources[i][2] = 1;
        }
        sourcePixelLocations.push(canvasOverlay._map.latLngToContainerPoint([sources[i][0], sources[i][1]]));
    }

    //create the worker from script tag code
    var blob = new Blob([
        document.querySelector('#worker1').textContent
    ], {type: "text/javascript"});

    //terminate the renderer if still running
    if (typeof renderWorker_ != 'undefined' && renderStatus_.isWorking == true) {
        renderWorker_.terminate();
    }

    // start the render worker
    // Note: window.webkitURL.createObjectURL() in Chrome 10+.
    renderWorker_ = new Worker(window.URL.createObjectURL(blob));

    // set the render complete handler function
    renderWorker_.addEventListener('message', function (e) {
        // get the map top left pixel location and move the mask canvas and main canvas to this location
        var topLeft = canvasOverlay._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(canvasOverlay.canvas(), topLeft);
        L.DomUtil.setPosition(maskCanvasLayer.canvas(), topLeft);

        console.log("Data received from worker");
        //console.log(e.data);

        // paste the image date obtained by algorithm from worker on to the canvas
        borderCanvasLayer.canvas().getContext('2d').putImageData(e.data.imageData, 0, 0);

        // update elapsed time since last render start
        document.getElementById("refresh-time").innerHTML = (new Date() - timeStart);

        //set the working status to be completed
        renderStatus_.isWorking = false;

        // create an event that broadcasts the render completed status to the DOM  so that events like render data caching can be done
        if (window.CustomEvent) {
            var event = new CustomEvent("newFrameRendered", {
                detail: {
                    message: "rendering is completed",
                    time: new Date()
                },
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }

    }, false);

    //set the render worker payload
    var payload = {
        'cmd': 'render',
        'width': width,
        'height': height,
        'imageData': imageData,
        'sources': sources,
        'sourcePixelLocations': sourcePixelLocations,
        'npx': npx,
        'npxRatioSquare': npxRatioSquare,
        'hotPU': hotPU,
        'coolPU': coolPU,
        'transparency': transparency,
        'alpha': alpha
    };

    //start the render worker
    renderWorker_.postMessage(payload);

    //set the render status to be true
    renderStatus_.isWorking = true;
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