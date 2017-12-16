var timingVar_;
var isBusy_ = false;
var isPlayingReal_ = false;

//Timing function
function startFetching() {
    // stop Frames playing also
    pauseFrameFetching();
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
    setIsBusy(true);
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    var fetchScadaValue = function (iter, callback) {
        // todo check if source is an array and has at least 4 elements
        $.ajax({
            url: document.getElementById("serverBaseAddressInput").value + "/api/values/real?pnt=" + sources[iter][3],
            type: 'GET',
            success: function (data) {
                var pointData = data;
                //todo check if pointData['dval'] is a number
                //MODIFY THE sources ARRAY from pointData
                sources[iter][2] = (+pointData["dval"]) / sources[iter][4];
                sources[iter][6] = pointData["status"];
                // console.log(pointData);
                //console.log(JSON.stringify(pointData, null, '\t'));
                callback(null, pointData);
            },
            error: function (textStatus, errorThrown) {
                //console.log(textStatus);
                //console.log(errorThrown);
                callback(textStatus);
            }
        });
    };

    /* Get the all scada values from API start */
    var sourceIterators = [];
    for (var i = 0; i < sources.length; i++) {
        sourceIterators.push(i);
    }
    var fetchBeginTime = new Date();
    async.mapSeries(sourceIterators, fetchScadaValue, function (err, results) {
        if (err) {
            // handle error
            console.log("All values not fetched via API due to error: " + JSON.stringify(err));
        } else {
            document.getElementById("over_map").innerHTML = makeTwoDigits(present_Time.getHours()) + ":" + makeTwoDigits(present_Time.getMinutes()) + ":" + makeTwoDigits(present_Time.getSeconds()) + " Hrs";
            // keep slider value to minutes
            document.getElementById('videoTimeSlider').value = present_Time.getHours() * 60 + present_Time.getMinutes();
            // set the date string to today
            modifyDateString(makeTwoDigits(present_Time.getDate()) + "-" + makeTwoDigits(present_Time.getMonth() + 1) + "-" + present_Time.getFullYear());
            // Render the Voltage Visualization
            layer.redraw();
        }
        document.getElementById("fetch-time").innerHTML = (new Date() - fetchBeginTime);
        //All the values are available in the results Array
        setIsBusy(false);

    });
    /* Get the all scada values from API end */
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
    var fromDateStr = dateString.trim();
    if (fromDateStr == "") {
        var tempTime = new Date();
        fromDateStr = makeTwoDigits(tempTime.getFullYear()) + "-" + makeTwoDigits(tempTime.getMonth() + 1) + "-" + makeTwoDigits(tempTime.getDate());
    }
    var fromTime = new Date(fromDateStr + "T00:00:00");
    var fromTimeStr = makeTwoDigits(fromTime.getDate()) + "/" + makeTwoDigits(fromTime.getMonth() + 1) + "/" + fromTime.getFullYear() + "/" + makeTwoDigits(fromTime.getHours()) + ":" + makeTwoDigits(fromTime.getMinutes()) + ":00";
    var toTime = new Date(fromTime.getTime() + 86400000);
    var toTimeStr = makeTwoDigits(toTime.getDate()) + "/" + makeTwoDigits(toTime.getMonth() + 1) + "/" + toTime.getFullYear() + "/" + makeTwoDigits(toTime.getHours()) + ":" + makeTwoDigits(fromTime.getMinutes()) + ":00";
    setIsBusy(true);
    var fetchScadaValue = function (iter, callback) {
        // todo check if source is an array and has at least 4 elements
        $.ajax({
            url: createUrl(document.getElementById("serverBaseAddressInput").value, sources[iter][3], 'history', fromTimeStr, toTimeStr, 60, 'average'),
            type: 'GET',
            success: function (data) {
                var pointData = data;
                //todo check if pointData is a array of objects
                //MODIFY THE timeFrames Data
                for (var k = 0; k < Math.min(timeFrames.frames.length, pointData.length); k++) {
                    timeFrames.frames[k][iter] = +pointData[k]["dval"];
                    timeFrames.frames_status[k][iter] = pointData[k]["status"];
                }
                // console.log(pointData);
                //console.log(JSON.stringify(pointData, null, '\t'));
                callback(null, "");
            },
            error: function (textStatus, errorThrown) {
                //console.log(textStatus);
                //console.log(errorThrown);
                callback(textStatus);
            }
        });
    };
    /* Get the all scada values from API start */
    var sourceIterators = [];
    for (var i = 0; i < sources.length; i++) {
        sourceIterators.push(i);
    }
    var fetchBeginTime = new Date();
    async.mapSeries(sourceIterators, fetchScadaValue, function (err, results) {
        if (err) {
            // handle error
            console.log("All values not fetched via API due to error: " + JSON.stringify(err));
        } else {
            // set the date string to fetch data
            timeFrames.dateString_ = makeTwoDigits(fromTime.getDate()) + "-" + makeTwoDigits(fromTime.getMonth() + 1) + "-" + fromTime.getFullYear();
            // Render the Voltage Visualization
            layer.redraw();
        }
        document.getElementById("fetch-time").innerHTML = (new Date() - fetchBeginTime);
        //All the values are available in the results Array
        setIsBusy(false);
    });
    /* Get the all scada values from API end */
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