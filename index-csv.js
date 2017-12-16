var csvReader_ = new CSVReader();
window.onload = function () {
    var fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function (e) {
        csvReader_.resetAndCreateArrays();
        for (var b = 0; b < fileInput.files.length; b++) {
            csvReader_.pushFiles(fileInput.files[b]);
        }
        fileInput.value = "";
        // initialize all timeFrames status array also with all values as OK since we do not get status from csv
        for (var i = 0; i < 1440; i++) {
            for (var k = 0; k < sources.length; k++) {
                timeFrames.frames_status[i][k] = "OK";
            }
        }
        csvReader_.afterEachRead();
    });
    // initialize all timeFrames status array also with all values as OK
    timeFrames.frames_status = [];
    for (var i = 0; i < 1440; i++) {
        timeFrames.frames_status[i] = [];
        for (var k = 0; k < sources.length; k++) {
            timeFrames.frames_status[i].push("OK");
        }
    }
	startFetching();
};

function readFramesFromCSV(pmuSourcesArray) {
    var arr = (pmuSourcesArray.slice(3, 1443)).map(function (insideArray) {
        return insideArray.slice(1, insideArray.length);
    });
    return arr;
}

function modifyDateString(str) {
    document.getElementById("over_map_date").innerHTML = "Voltage contour for " + str.split(" ")[0];
}