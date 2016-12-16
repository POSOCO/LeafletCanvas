var timingVar_;
var isBusy_ = false;

//Timing function
function startFetching() {
    pauseFetching();
    console.log("Starting Server Data Fetch", "info");
    timingVar_ = setInterval(getFromPointsDataServer, 2500);
}

//Timing function
function pauseFetching() {
    console.log("Pausing Server Data Fetch", "warning");
    clearInterval(timingVar_);
}


//Timing function
function getFromPointsDataServer() {
    if (getIsBusy()) {
        return;
    }
    setIsBusy(true);
    //express server fetch start
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    for (var i = 0; i < sources.length; i++) {
        $.get("//localhost:62448/api/values/real?pnt=" + sources[i][3], (function () {
            return function (data, status) {
                if (status == "success") {
                    //express server fetch stop / finish
                    document.getElementById("wrapper").style.border = "2px solid #999999";
                    //console.log(JSON.parse(data));
                    //We get point data
                    var pointData = JSON.parse(data);

                    //MODIFY THE sources ARRAY from pointData
                    sources[i][2] = (pointData["dval"] * 1.73205080757) / sources[i][4];
                    sources[i][6] = pointData["status"];
                    //For now we are just logging the data fetched from server
                    //console.log(pointData);
                    console.log(JSON.stringify(pointData, null, '\t'));
                }
                if (i == sources.length - 1) {
                    //RUN the plotting algorithm
                    maskCanvasLayer.redraw();
                }
            }
        })());
    }
    setIsBusy(false);
}

//Timing function
function getFromPointsDataServerOld() {
    if (getIsBusy()) {
        return;
    }
    setIsBusy(true);
    //express server fetch start
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    $.get("http://localhost:4542/values?dnapoints=" + "all", function (data, status) {
        if (status == "success") {
            //express server fetch stop / finish
            document.getElementById("wrapper").style.border = "2px solid #999999";
            //console.log(JSON.parse(data));
            //We get pointsArray in the order of sources Array
            var pointsArray = JSON.parse(data);
            //MODIFY THE sources ARRAY from pointsArray
            for (var i = 0; i < pointsArray.result.length; i++) {
                sources[i][2] = (pointsArray.result[i].value * 1.73205080757) / sources[i][4];
                sources[i][6] = pointsArray.result[i]["status"];
            }
            //For now we are just logging the data fetched from server
            //console.log(pointsArray);
            console.log(JSON.stringify(pointsArray, null, '\t'));
            //RUN the plotting algorithm
            borderCanvasLayer.redraw();
            setIsBusy(false);
        }
    });
}

//isBusy getter
function getIsBusy() {
    return isBusy_;
}

//isBusy setter
function setIsBusy(val) {
    isBusy_ = val;
}