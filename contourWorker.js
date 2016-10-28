function drawApproxVoltageContour(canvasOverlay, params) {
    var timeStart = new Date();
    var hotPU = hotPU_;
    var coolPU = coolPU_;
    var ctx = params.canvas.getContext('2d');
    var imageData = params.canvas.getContext('2d').getImageData(0, 0, params.canvas.width, params.canvas.height).data;
    var width = params.canvas.width;
    var height = params.canvas.height;
    var alpha = alpha_;
    var transparency = transparency_;
    //npx = latSpan/canvasWidth; npy = lngSpan/canvasHeight; npxRatioSquare = npy*npy/(npx*npx);
    var southEast = canvasOverlay._map.getBounds().getSouthEast();
    var northWest = canvasOverlay._map.getBounds().getNorthWest();
    var npx = (southEast.lng - northWest.lng) / width;
    npx = Math.abs(npx);
    var npy = (northWest.lat - southEast.lat) / height;
    npy = Math.abs(npy);
    var npxRatioSquare = (npy * npy) / (npx * npx);

    //calculate source pixel locations
    var sourcePixelLocations = [];
    for (var i = 0; i < sources.length; i++) {
        if (sources[i][6] != "OK") {
            sources[i][2] = 1;
        }
        sourcePixelLocations.push(canvasOverlay._map.latLngToContainerPoint([sources[i][0], sources[i][1]]));
    }
    var sourcePU;
    var sourcePUError;
    var sourcePtLat;
    var sourcePtLng;
    var errorContributions;
    //for each pixel on the canvas filter...
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var index = 4 * (x + y * width);
            if (imageData[index] > 0) {
                //calculate the error contribution from each source and store in an array
                errorContributions = [];
                for (var k = 0; k < sources.length; k++) {
                    sourcePU = sources[k][2];
                    sourcePUError = sourcePU - 1;
                    sourcePtLat = sources[k][0];
                    sourcePtLng = sources[k][1];
                    /*
                     calculate error contribution from this source
                     error(x,y)= SourcePUError * e^(- damping factor * distance of the source from (x,y) position)
                     error(x,y) = SourcePUError * e^((-?)*sqrt(x^2+y^2));
                     */
                    errorContributions[k] = sourcePUError * Math.exp(-alpha * npx * Math.sqrt(Math.pow(sourcePixelLocations[k].x - x, 2) + Math.pow(sourcePixelLocations[k].y - y, 2)));
                }
                //calculate the resultant error from all contributions by considering the contribution that has the highest absolute value
                var resultantError = errorContributions[0];
                for (var p = 0; p < errorContributions.length; p++) {
                    if (Math.abs(errorContributions[p]) > Math.abs(resultantError)) {
                        resultantError = errorContributions[p];
                    }
                }
                if (resultantError + 1 > hotPU) {
                    resultantError = hotPU - 1;
                } else if (resultantError + 1 < coolPU) {
                    resultantError = coolPU - 1;
                }
                //Now paint according to this error value
                var resultantHue = 240 * ((1 + resultantError - coolPU) / (hotPU - coolPU));
                var resultColor = hsvToRgb(240 - resultantHue, 1, 1);
                imageData[index] = resultColor[0];
                imageData[index + 1] = resultColor[1];
                imageData[index + 2] = resultColor[2];
                imageData[index + 3] = transparency;
            }
        }
    }
    document.getElementById("refresh-time").innerHTML = (new Date() - timeStart);
}