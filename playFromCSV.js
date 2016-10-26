var timingVar_;
var isBusy_ = false;

//Timing function
function startFetching() {
    pauseFetching();
    console.log("Starting Server Data Fetch", "info");
    timingVar_ = setInterval(getFromPointsDataServer, 1000);
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
    document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
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

var frameTimingVar_;
var frameToFetch_ = 0;
var framesToIncrement_ = 5;

//Jump to a frame
function jumpToFrame(framenumber) {
    if (framenumber < 1440 && framenumber >= 0) {
        frameToFetch_ = parseInt(framenumber);
    }
}

function jumpToFrameGUI() {
    jumpToFrame(document.getElementById("jumpToFrameInput").value);
}

//set frame rate
function setFrameRate(framerate) {
    if (framerate < 1440) {
        framesToIncrement_ = parseInt(framerate);
    }
}

function setFrameRateGUI() {
    setFrameRate(document.getElementById("frameRateInput").value);
}

//Timing function
function startFrameFetching() {
    videoCanvas_.getContext("2d").clearRect(0, 0, borderCanvasLayer.canvas().width, borderCanvasLayer.canvas().height)
    frames_ = [];
    times_ = [];
    pauseFrameFetching();
    console.log("Starting Frame Data Fetch", "info");
    frameTimingVar_ = setInterval(getFromFrames, 2000);
}

//Timing function
function pauseFrameFetching() {
    //frameToFetch = 0;
    console.log("Pausing Frame Data Fetch", "warning");
    document.getElementById("playbackStatusPaused").innerHTML = "\t(PlayBack Paused)";
    clearInterval(frameTimingVar_);
    document.getElementById("videoTimeSlider").min = 0;
    document.getElementById("videoTimeSlider").max = times_.length - 1;
    document.getElementById("videoTimeSlider").value = 0;
    var hours = Math.floor((times_[0]) / 60);
    var timeStringToDisplay = FormatNumberLength(hours, 2) + ":" + FormatNumberLength((times_[0] - hours * 60), 2) + " Hrs";
    document.getElementById("videoTimeString").innerHTML = timeStringToDisplay;
}

var isFrameBusy_ = false;

//Timing function
function getFromFrames() {
    if (getIsFrameBusy()) {
        return;
    }
    setIsFrameBusy(true);
    //express frame fetch start
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    var frameData = timeFrames.frames[frameToFetch_];
    //MODIFY THE sources ARRAY from pointsArray
    for (var i = 0; i < frameData.length; i++) {
        if (frameData[i] == 0) {
            sources[i][2] = 1;
        } else {
            sources[i][2] = frameData[i] / sources[i][4];
        }
    }
    angular.element(document.getElementById('voltage-report')).scope().updateSources(sources);
    for (var i = 0; i < sources.length; i++) {
        var tempPu = sources[i][2];
        if (tempPu > hotPU_) {
            tempPu = hotPU_;
        } else if (tempPu < coolPU_) {
            tempPu = coolPU_;
        }
        sources[i][2] = tempPu;
    }
    //RUN the plotting algorithm
    borderCanvasLayer.redraw();
    setIsFrameBusy(false);
    //express server fetch stop / finish
    //document.getElementById("wrapper").style.border = "2px solid #999999";
    var hours = Math.floor((frameToFetch_) / 60);
    var timeStringToDisplay = FormatNumberLength(hours, 2) + ":" + FormatNumberLength((frameToFetch_ - hours * 60), 2) + " Hrs";
    document.getElementById("playbackStatus").innerHTML = timeStringToDisplay;
    document.getElementById("over_map").innerHTML = timeStringToDisplay;
    frames_.push(borderCanvasLayer.canvas().getContext("2d").getImageData(0, 0, borderCanvasLayer.canvas().width, borderCanvasLayer.canvas().height));
    times_.push(frameToFetch_);
    frameToFetch_ += framesToIncrement_;
    document.getElementById("playbackStatusPaused").innerHTML = "";
    if (frameToFetch_ >= 1440) {
        jumpToFrame(0);
        pauseFrameFetching();
    }
}
//isBusy getter
function getIsFrameBusy() {
    return isFrameBusy_;
}

//isBusy setter
function setIsFrameBusy(val) {
    isFrameBusy_ = val;
}

function FormatNumberLength(num, length) {
    var r = num.toString();
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
