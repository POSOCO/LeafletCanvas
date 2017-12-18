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
    makeBRsZero();
    // fill the bus reactors array using the sources array
    for (var i = 0; i < br_sources_g.length; i++) {
        var src_iter = getSrcIndexByPntId(br_sources_g[i][7]);
        br_sources_g[i][8] = src_iter;
    }

    // initialize all timeFrames status array also with all values as OK
    timeFrames.frames_status = [];
    for (var i = 0; i < 1440; i++) {
        timeFrames.frames_status[i] = [];
        for (var k = 0; k < sources.length; k++) {
            timeFrames.frames_status[i].push("OK");
        }
    }
    // initialize the dateString of timeFrames
    timeFrames.dateString_ = "dd-mm-yyyy";
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

function getSrcIndexByPntId(pntId) {
    var src_iter = null;
    for (var i = 0; i < sources.length; i++) {
        if (sources[i][3] == pntId) {
            src_iter = i;
            break;
        }
    }
    return src_iter;
}