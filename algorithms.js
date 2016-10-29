function visualizeOnCanvas(canvasOverlay, params) {
    var ctx = params.canvas.getContext('2d');
    ctx.fillStyle = "rgba(255,116,116, 0.5)";
    var imageData = params.canvas.getContext('2d').getImageData(0, 0, params.canvas.width, params.canvas.height).data;
    ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
    var width = params.canvas.width;
    var height = params.canvas.height;
    //saving memory
    params.canvas = null;
    for (var x = 0; x < width / 2; x++) {
        for (var y = 0; y < height; y++) {
            var index = 4 * (x + y * width);
            if (imageData[index] > 0) {
                ctx.fillRect(x, y, 1, 1);
            }
        }

    }
}

function drawVoltageCircles(canvasOverlay, params) {
    var ctx = params.canvas.getContext('2d');
    var imageData = params.canvas.getContext('2d').getImageData(0, 0, params.canvas.width, params.canvas.height).data;
    var width = params.canvas.width;
    var height = params.canvas.height;
    for (var k = 0; k < sources.length; k++) {
        var intensity = sources[k][2];
        if (intensity > 1.05) {
            intensity = 1.05;
        } else if (intensity < 0.95) {
            intensity = 0.95;
        }
        if (intensity >= 1) {
            ctx.fillStyle = "rgba(" + Math.floor(((intensity - 1) * 255) / 0.05) + ",0,0, 0.5)";
        } else {
            ctx.fillStyle = "rgba(0,0," + Math.floor(((1 - intensity) * 255) / 0.05) + ", 0.5)";
        }
        //get the pixel location and draw a circle
        var pt = canvasOverlay._map.latLngToContainerPoint([sources[k][0], sources[k][1]]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 0.5 * Math.pow(2, params.zoom), 0, 2 * Math.PI);
        ctx.fill();
    }
    //now apply filter via the filter array
    ctx.fillStyle = "rgba(255,255,255, 0.1)";
    var logicData = params.canvas.getContext('2d').getImageData(0, 0, params.canvas.width, params.canvas.height);
    for (var index = 0; index < imageData.length; index++) {
        if (imageData[index] <= 0) {
            logicData.data[index + 3] = 0;
        }
    }
    //saving memory
    imageData = null;

    ctx.putImageData(logicData, 0, 0);
}

function drawVoltageContour(canvasOverlay, params) {
    var timeStart = new Date();
    var alpha = 1.5;
    var transparency = 0.3;
    var hotPU = 1.05;
    var coolPU = 0.95;
    var ctx = params.canvas.getContext('2d');
    var imageData = params.canvas.getContext('2d').getImageData(0, 0, params.canvas.width, params.canvas.height).data;
    var width = params.canvas.width;
    var height = params.canvas.height;
    //for each pixel on the canvas filter...
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var index = 4 * (x + y * width);
            if (imageData[index] > 0) {
                var canvasLatLng = canvasOverlay._map.containerPointToLatLng([x, y]);
                //calculate the error contribution from each source and store in an array
                var errorContributions = [];
                for (var k = 0; k < sources.length; k++) {
                    var sourcePU = sources[k][2];
                    var sourcePUError = sourcePU - 1;
                    var sourcePtLat = sources[k][0];
                    var sourcePtLng = sources[k][1];
                    /*
                     calculate error contribution from this source
                     error(x,y)= SourcePUError * e^(- damping factor * distance of the source from (x,y) position)
                     error(x,y) = SourcePUError * e^((-?)*sqrt(x^2+y^2));
                     */
                    errorContributions[k] = sourcePUError * Math.exp(-alpha * Math.sqrt(Math.pow(sourcePtLat - canvasLatLng.lat, 2) + Math.pow(sourcePtLng - canvasLatLng.lng, 2)));
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
                ctx.fillStyle = "rgba(" + resultColor[0] + "," + resultColor[1] + "," + resultColor[2] + ", " + transparency + ")";
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
    document.getElementById("refresh-time").innerHTML = (new Date() - timeStart);
}

function drawFastVoltageContour(canvasOverlay, params) {
    var sources = [[21.6, 71.21, 1.05, "WRLDCMP.SCADA1.A0048293", 400, "AMRELI 400kV SUBSTATION, Gujrat, SUBSTN.AMRL_JTG.BUS.4B1.MES1.KVRY", "OK"]];
    //var source = [sources[0], sources[1]];
    var alpha = 0.8;
    var transparency = 0.3;
    var hotPU = 1.05;
    var coolPU = 0.95;
    var ctx = params.canvas.getContext('2d');
    var width = params.canvas.width;
    var height = params.canvas.height;
    var imageData = params.canvas.getContext('2d').getImageData(0, 0, params.canvas.width, params.canvas.height).data;
    ctx.clearRect(0, 0, width, height);
    var contourData = [];
    for (var iter = 0; iter < width * height; iter++) {
        contourData[iter] = 1;
    }
    //npx = latSpan/canvasWidth; npy = lngSpan/canvasHeight; npxRatioSquare = npy*npy/(npx*npx);
    var southEast = leafletMap.getBounds().getSouthEast();
    var northWest = leafletMap.getBounds().getNorthWest();
    var npx = (southEast.lng - northWest.lng) / width;
    npx = Math.abs(npx);
    var npy = (northWest.lat - southEast.lat) / height;
    npy = Math.abs(npy);
    var npxRatioSquare = (npy * npy) / (npx * npx);
    for (var i = 0; i < sources.length; i++) {
        //skip from the for loop if sources status is not "OK"
        if (sources[i][6] != "OK" || sources[i][2] < 0.8) {
            continue;
        }
        var vsource = sources[i][2];
        var vsourceError = vsource - 1;
        //calculate the source pixel point
        var sourcePt = canvasOverlay._map.latLngToContainerPoint([sources[i][0], sources[i][1]]);
        var xpsource = sourcePt.x;
        var ypsource = sourcePt.y;
        var stopYIteration = false;
        //x should go from sourcex to sourcex+width-sourcex
        for (var xpdest = xpsource; xpdest <= width; xpdest++) {
            stopYIteration = false;
            for (var ypdest = ypsource; stopYIteration == false; ypdest++) {
                var xpx = xpdest - xpsource;
                var ypx = ypdest - ypsource;
                if ((ypx > xpx) || (ypdest > height)) {
                    stopYIteration = true;
                    continue;
                }
                //i = source iterator; xpdest = x axis iterator; ypdest = y axis iterator
                var xCoordinates = [xpdest, xpsource - xpx, xpdest, xpsource - xpx, xpsource + ypx, xpsource - ypx, xpsource + ypx, xpsource - ypx];
                var yCoordinates = [ypdest, ypdest, ypsource - ypx, ypsource - ypx, ypsource + xpx, ypsource + xpx, ypsource - xpx, ypsource - xpx];
                var isValToAddCalculated = false;
                var valToAdd = 0;
                //First find if value needs to be calculated by checking if filter exists in any of the 8 quadrants
                for (var coordIter = 0; coordIter < 8; coordIter++) {
                    var xCoord = xCoordinates[coordIter];
                    var yCoord = yCoordinates[coordIter];
                    if (ypx == 0 && (coordIter == 1 || coordIter == 2 || coordIter == 5 || coordIter == 7)) {
                        continue;
                    } else if (ypx == xpx && coordIter < 4) {
                        continue;
                    }
                    if (imageData[(yCoord * width + xCoord) * 4] == 255 && xCoord >= 0 && yCoord >= 0 && xCoord <= width && yCoord <= height) {
                        if (!isValToAddCalculated) {
                            valToAdd = vsourceError * Math.exp(-alpha * npx * Math.sqrt(xpx * xpx + npxRatioSquare * ypx * ypx));
                            valToAdd += 1;
                            isValToAddCalculated = true;
                        }
                        /**implementing overriding contour**/
                        var canvasPixelPU = contourData[(xCoord + yCoord * width)];
                        if (Math.abs(valToAdd - 1) > Math.abs(canvasPixelPU - 1)) {
                            canvasPixelPU = valToAdd;
                        }
                        contourData[(xCoord + yCoord * width)] = canvasPixelPU;
                    } else {
                        contourData[(xCoord + yCoord * width)] = null;
                    }
                }
            }
        }
    }
    //now all pixel values found; bug in for loop iteration limits of xpdest

    //saving memory;
    imageData = null;

    //paint the pixels
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var index = x + y * width;
            var resultantPU = contourData[index];
            if (resultantPU == null) {
                continue;
            }
            if (resultantPU > hotPU) {
                resultantPU = hotPU;
            } else if (resultantPU < coolPU) {
                resultantPU = coolPU;
            }
            //Now paint according to this error value
            var resultantHue = 240 * ((resultantPU - coolPU) / (hotPU - coolPU));
            var resultColor = hsvToRgb(240 - resultantHue, 1, 1);
            ctx.fillStyle = "rgba(" + resultColor[0] + "," + resultColor[1] + "," + resultColor[2] + ", " + transparency + ")";
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function drawNewFastVoltageContour(canvasOverlay, params) {
    var timeStart = new Date;
    //var sources = [[21.6, 71.21, 1.15, "WRLDCMP.SCADA1.A0048293", 400, "AMRELI 400kV SUBSTATION, Gujrat, SUBSTN.AMRL_JTG.BUS.4B1.MES1.KVRY", "OK"]];
    //var source = [sources[0], sources[1]];
    var alpha = 0.8;
    var transparency = 0.3;
    var hotPU = 1.05;
    var coolPU = 0.95;
    var ctx = params.canvas.getContext('2d');
    var width = params.canvas.width;
    var height = params.canvas.height;
    var imageData = params.canvas.getContext('2d').getImageData(0, 0, params.canvas.width, params.canvas.height).data;
    ctx.clearRect(0, 0, width, height);
    var contourData = [];
    for (var iter = 0; iter < width * height; iter++) {
        contourData[iter] = 1;
    }
    //npx = latSpan/canvasWidth; npy = lngSpan/canvasHeight; npxRatioSquare = npy*npy/(npx*npx);
    var southEast = leafletMap.getBounds().getSouthEast();
    var northWest = leafletMap.getBounds().getNorthWest();
    var npx = (southEast.lng - northWest.lng) / width;
    npx = Math.abs(npx);
    var npy = (northWest.lat - southEast.lat) / height;
    npy = Math.abs(npy);
    var npxRatioSquare = (npy * npy) / (npx * npx);
    for (var i = 0; i < sources.length; i++) {
        //skip from the for loop if sources status is not "OK"
        if (sources[i][6] != "OK" || sources[i][2] < 0.8) {
            continue;
        }
        var vsource = sources[i][2];
        var vsourceError = vsource - 1;
        //find the distance till the error propagation needs to be considered
        if (sources[i][4] * vsourceError >= 1) {
            var distDegrees = Math.log(sources[i][4] * vsourceError) / alpha;
        } else {
            var distDegrees = 0;
        }

        //calculate the source pixel point
        var sourcePt = canvasOverlay._map.latLngToContainerPoint([sources[i][0], sources[i][1]]);
        var xpsource = sourcePt.x;
        var ypsource = sourcePt.y;
        //calculate the source boundary of influence
        var xpDestStartDegrees = sources[i][0] - distDegrees;
        var xpDestEndDegrees = sources[i][0] + distDegrees;
        var ypDestStartDegrees = sources[i][1] - distDegrees;
        var ypDestEndDegrees = sources[i][1] + distDegrees;
        xpDestStartDegrees = correctDegrees(xpDestStartDegrees);
        xpDestEndDegrees = correctDegrees(xpDestEndDegrees);
        ypDestStartDegrees = correctDegrees(ypDestStartDegrees);
        ypDestEndDegrees = correctDegrees(ypDestEndDegrees);
        var sourceStartPixelPoint = canvasOverlay._map.latLngToContainerPoint([xpDestStartDegrees, ypDestStartDegrees]);
        var sourceEndPixelPoint = canvasOverlay._map.latLngToContainerPoint([xpDestEndDegrees, ypDestEndDegrees]);
        for (var xpdest = Math.min(sourceStartPixelPoint.x, sourceEndPixelPoint.x); xpdest <= Math.max(sourceStartPixelPoint.x, sourceEndPixelPoint.x); xpdest++) {
            var stopYIteration = false;
            for (var ypdest = Math.min(sourceStartPixelPoint.y, sourceEndPixelPoint.y); (ypdest <= Math.max(sourceStartPixelPoint.y, sourceEndPixelPoint.y)) || (stopYIteration == false); ypdest++) {
                var xpx = xpdest - xpsource;
                var ypx = ypdest - ypsource;
                if (ypx > xpx) {
                    stopYIteration = true;
                    continue;
                }
                //i = source iterator; xpdest = x axis iterator; ypdest = y axis iterator
                var xCoordinates = [xpdest, xpsource - xpx, xpdest, xpsource - xpx, xpsource + ypx, xpsource - ypx, xpsource + ypx, xpsource - ypx];
                var yCoordinates = [ypdest, ypdest, ypsource - ypx, ypsource - ypx, ypsource + xpx, ypsource + xpx, ypsource - xpx, ypsource - xpx];
                var isValToAddCalculated = false;
                var valToAdd = 0;
                //First find if value needs to be calculated by checking if filter exists in any of the 8 quadrants
                for (var coordIter = 0; coordIter < 8; coordIter++) {
                    var xCoord = xCoordinates[coordIter];
                    var yCoord = yCoordinates[coordIter];
                    if (ypx == 0 && (coordIter == 1 || coordIter == 2 || coordIter == 5 || coordIter == 7)) {
                        continue;
                    } else if (ypx == xpx && coordIter < 4) {
                        continue;
                    }
                    if (imageData[(yCoord * width + xCoord) * 4] == 255 && xCoord >= 0 && yCoord >= 0 && xCoord <= width && yCoord <= height) {
                        if (!isValToAddCalculated) {
                            valToAdd = vsourceError * Math.exp(-alpha * npx * Math.sqrt(xpx * xpx + npxRatioSquare * ypx * ypx));
                            valToAdd += 1;
                            isValToAddCalculated = true;
                        }
                        /**implementing overriding contour**/
                        var canvasPixelPU = contourData[(xCoord + yCoord * width)];
                        if (Math.abs(valToAdd - 1) > Math.abs(canvasPixelPU - 1)) {
                            canvasPixelPU = valToAdd;
                        }
                        contourData[(xCoord + yCoord * width)] = canvasPixelPU;
                    }
                }
            }
        }
    }
    //now all pixel values found;

    //mask the filtered area
    for (xCoord = 0; xCoord < width; xCoord++) {
        for (yCoord = 0; yCoord < height; yCoord++) {
            if (imageData[(yCoord * width + xCoord) * 4] != 255) {
                contourData[(xCoord + yCoord * width)] = null;
            }
        }
    }
    //saving memory;
    imageData = null;

    //paint the pixels
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var index = x + y * width;
            var resultantPU = contourData[index];
            if (resultantPU == null) {
                continue;
            }
            if (resultantPU > hotPU) {
                resultantPU = hotPU;
            } else if (resultantPU < coolPU) {
                resultantPU = coolPU;
            }
            //Now paint according to this error value
            var resultantHue = 240 * ((resultantPU - coolPU) / (hotPU - coolPU));
            var resultColor = hsvToRgb(240 - resultantHue, 1, 1);
            ctx.fillStyle = "rgba(" + resultColor[0] + "," + resultColor[1] + "," + resultColor[2] + ", " + transparency + ")";
            ctx.fillRect(x, y, 1, 1);
        }
    }
    document.getElementById("refresh-time").value = (new Date() - timeStart);
}

function correctDegrees(degrees) {
        if (degrees > 180 && degrees > 0) {
            return degrees - Math.floor(degrees / 180) * 180;
        } else if (degrees < 180 && degrees < 0) {
            return degrees - Math.ceil(degrees / 180) * 180;
        }
        return degrees;
    }