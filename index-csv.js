var csvReader_ = new CSVReader();
window.onload = function () {
    var fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function (e) {
        csvReader_.resetAndCreateArrays();
        for (var b = 0; b < fileInput.files.length; b++) {
            csvReader_.pushFiles(fileInput.files[b]);
        }
        fileInput.value = "";
        csvReader_.afterEachRead();
    });
};

function readFramesFromCSV(pmuSourcesArray){
    var arr = (pmuSourcesArray.slice(3,1443)).map(function(insideArray){
        return insideArray.slice(1,insideArray.length);
    });
    return arr;
}

function modifyDateString(str){
    document.getElementById("over_map_date").innerHTML = "PMU Voltage contour for " + str.split(" ")[0];
}