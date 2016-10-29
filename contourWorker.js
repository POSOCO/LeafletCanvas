self.addEventListener('message', function(e) {
  var data = e.data;
  var cmd = data.cmd;
  if(cmd != "render"){
	  self.postMessage({'error': "unknown command..."});
  }
  var width = data.width;
  var height = data.height;
  var imageData = data.imageData;
  var sources = data.sources;
  var sourcePixelLocations = data.sourcePixelLocations;
  var alpha = data.alpha;
  var npx = data.npx;
  var npxRatioSquare = data.npxRatioSquare;
  var hotPU = data.hotPU;
  var coolPU = data.coolPU;
  
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
                     error(x,y) = SourcePUError * e^((-alpha)*sqrt(x^2+y^2));
                     */
                    errorContributions[k] = sourcePUError * Math.exp(-alpha * npx * Math.sqrt(Math.pow(sourcePixelLocations[k].x - x, 2) + Math.pow(npxRatioSquare * sourcePixelLocations[k].y - y, 2)));
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
	self.postMessage({'imageData': imageData});
	
}, false);

/*
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 1
 *
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 */
function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    ////s = Math.max(0, Math.min(1, s));
    ////v = Math.max(0, Math.min(1, v));
    /****if(s == 0) {
			// Achromatic (grey)
			r = g = b = v;
			return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
			}****/
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}