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
    document.getElementById("over_map").innerHTML = present_Time.getHours() + ":" + present_Time.getMinutes() + ":" + present_Time.getSeconds() + " Hrs";
    // keep slider value to minutes
    document.getElementById('videoTimeSlider').value = present_Time.getHours() * 60 + present_Time.getMinutes();
    // set the date string to today
    modifyDateString(present_Time.getDate() + "-" + (present_Time.getMonth() + 1) + "-" + present_Time.getFullYear());
    setIsBusy(true);
    //express server fetch start
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    for (var i = 0; i < sources.length; i++) {
        $.get("http://localhost:62448/api/values/real?pnt=" + sources[i][3], (function (iterInput) {
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
                    //console.log(pointData);
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

//Timing function
function getFromPointsDataServerForDate(dateString) {
    if (getIsBusy()) {
        return;
    }
    angular.element(document.getElementById('voltage-report')).scope().updateSources(sources);
    var present_Time = new Date();
    document.getElementById("over_map").innerHTML = present_Time.getHours() + ":" + present_Time.getMinutes() + ":" + present_Time.getSeconds() + " Hrs";
    // keep slider value to minutes
    document.getElementById('videoTimeSlider').value = present_Time.getHours() * 60 + present_Time.getMinutes();
    setIsBusy(true);
    //express server fetch start
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    for (var i = 0; i < sources.length; i++) {
        $.get("http://localhost:62448/api/values/real?pnt=" + sources[i][3], (function (iterInput) {
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
                    //console.log(pointData);
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

//isBusy getter
function getIsBusy() {
    return isBusy_;
}

//isBusy setter
function setIsBusy(val) {
    isBusy_ = val;
}