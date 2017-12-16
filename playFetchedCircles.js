var timingVar_;
var isBusy_ = false;
var isPlayingReal_ = false;

//Timing function
function startFetching() {
    pauseFetching();
    console.log("Starting Server Data Fetch", "info");
    isPlayingReal_ = true;
    timingVar_ = setInterval(getFromPointsDataServer, 2000);
}

//Timing function
function pauseFetching() {
    isPlayingReal_ = false;
    console.log("Pausing Server Data Fetch", "warning");
    clearInterval(timingVar_);
}

//Timing function
function getFromPointsDataServer() {
    if (getIsBusy()) {
        return;
    }
    angular.element(document.getElementById('voltage-report')).scope().updateSources(sources);
    var present_Time = new Date();
    document.getElementById("over_map").innerHTML = makeTwoDigits(present_Time.getHours()) + ":" + makeTwoDigits(present_Time.getMinutes()) + ":" + makeTwoDigits(present_Time.getSeconds()) + " Hrs";
    // keep slider value to minutes
    document.getElementById('videoTimeSlider').value = present_Time.getHours() * 60 + present_Time.getMinutes();
    // set the date string to today
    modifyDateString(makeTwoDigits(present_Time.getDate()) + "-" + makeTwoDigits(present_Time.getMonth() + 1) + "-" + present_Time.getFullYear());
    setIsBusy(true);
    //express server fetch start
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    for (var i = 0; i < sources.length; i++) {
        $.get(document.getElementById("serverBaseAddressInput").value + "/api/values/real?pnt=" + sources[i][3], (function (iterInput) {
            var iter = iterInput;
            return function (data, status) {

                if (status == "success") {
                    //document.getElementById("wrapper").style.border = "2px solid #999999";
                    //console.log(JSON.parse(data));
                    //We get point data
                    //console.log("The iterator is "+iter);
                    var pointData = data;

                    //MODIFY THE sources ARRAY from pointData
                    sources[iter][2] = (+pointData["dval"]) / sources[iter][4];
                    sources[iter][6] = pointData["status"];
                    //For now we are just logging the data fetched from server
                    // console.log(pointData);
                    //console.log(JSON.stringify(pointData, null, '\t'));
                }
                if (iter == sources.length - 1) {
                    //RUN the plotting algorithm
                    layer.redraw();
                }
            }
        })(i));
    }
    setIsBusy(false);
}


function fetchDataForDate() {
    getFromPointsDataServerForDate(document.getElementById("fetchDateInput").value);
}

//Timing function
function getFromPointsDataServerForDate(dateString) {
    if (getIsBusy()) {
        return;
    }
    angular.element(document.getElementById('voltage-report')).scope().updateSources(sources);
    
    if (dateString == "") {
        var tempTime = new Date();
        var fromTime = new Date(makeTwoDigits(tempTime.getFullYear()) + "-" + makeTwoDigits(tempTime.getMonth() + 1) + "-" + makeTwoDigits(tempTime.getDate())+"T00:00:00");
    } else{
		fromTime = new Date(dateString+"T00:00:00");
	}
    var fromTimeStr = makeTwoDigits(fromTime.getDate()) + "/" + makeTwoDigits(fromTime.getMonth() + 1) + "/" + fromTime.getFullYear() + "/" + makeTwoDigits(fromTime.getHours()) + ":" + makeTwoDigits(fromTime.getMinutes()) + ":00";
    var toTime = new Date(fromTime.getTime() + 86400000);
    var toTimeStr = makeTwoDigits(toTime.getDate()) + "/" + makeTwoDigits(toTime.getMonth() + 1) + "/" + toTime.getFullYear() + "/" + makeTwoDigits(toTime.getHours()) + ":" + makeTwoDigits(fromTime.getMinutes()) + ":00";
    setIsBusy(true);
    //express server fetch start
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    for (var i = 0; i < sources.length; i++) {
        var fetchUrl = createUrl(document.getElementById("serverBaseAddressInput").value, sources[i][3], 'history', fromTimeStr, toTimeStr, 60, 'average');
        $.get(fetchUrl, (function (iterInput) {
            var iter = iterInput;
            return function (data, status) {

                if (status == "success") {
                    //console.log(JSON.parse(data));
                    //We got point data of 1440 minutes of a day
                    //console.log("The iterator is "+iter);
                    var pointData = data;

                    //MODIFY THE timeFrames Data
                    //stub
                    for (var k = 0; k < Math.min(timeFrames.frames.length, pointData.length); k++) {
                        timeFrames.frames[k][iter] = +pointData[k]["dval"];
                        timeFrames.frames_status[k][iter] = pointData[k]["status"];
                    }
                    //todo maintain status frames also
                    //For now we are just logging the data fetched from server
                    //console.log(pointData);
                    //console.log(JSON.stringify(pointData, null, '\t'));
                }
                if (iter == sources.length - 1) {
                    // update fetch date
                    modifyDateString(makeTwoDigits(fromTime.getDate()) + "-" + makeTwoDigits(fromTime.getMonth() + 1) + "-" + fromTime.getFullYear());
                }
            }
        })(i));
    }
    setIsBusy(false);
}

//isBusy getter
function getIsBusy() {
    return isBusy_;
}

//isBusy setter
function setIsBusy(val) {
    isBusy_ = val;
}

function createUrl(serverBaseAddress, pnt, historyType, strtime, endtime, secs, type) {
    var url = "";
    if (historyType == "real") {
        url = serverBaseAddress + "/api/values/" + historyType + "?pnt=" + pnt;
    } else if (historyType == "history") {
        url = serverBaseAddress + "/api/values/" + historyType + "?pnt=" + pnt + "&strtime=" + strtime + "&endtime=" + endtime + "&secs=" + secs + "&type=" + type;
    }
    //WriteLineConsole(url);
    return url;
}

function makeTwoDigits(x) {
    if (x < 10) {
        return "0" + x;
    }
    else {
        return x;
    }
}