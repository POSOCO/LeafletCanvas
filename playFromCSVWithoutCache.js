var frameTimingVar_;
var frameToFetch_ = 0;
var framesToIncrement_ = 5;
var videoPlayInterval_ = 200;

//Jump to a frame
function jumpToFrame(framenumber) {
    if (framenumber < 1440 && framenumber >= 0) {
        frameToFetch_ = parseInt(framenumber);
    }
}

function jumpToFrameGUI() {
    jumpToFrame(document.getElementById("jumpToFrameInput").value);
    getFromFrames();
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
    // stop real time fetching also
    pauseFetching();
    //videoCanvas_.getContext("2d").clearRect(0, 0, borderCanvasLayer.getgetCanvas().width, borderCanvasLayer.getgetCanvas().height);
    pauseFrameFetching();
    console.log("Starting Frame Data Fetch", "info");
    frameTimingVar_ = setInterval(getFromFrames, videoPlayInterval_);
}

//Timing function
function pauseFrameFetching() {
    //frameToFetch = 0;
    console.log("Pausing Frame Data Fetch", "warning");
    document.getElementById("playbackStatusPaused").innerHTML = "\t(PlayBack Paused)";
    clearInterval(frameTimingVar_);
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
    document.getElementById('videoTimeSlider').value = frameToFetch_;
    //MODIFY THE sources ARRAY from pointsArray
    for (var i = 0; i < Math.min(frameData.length, sources.length); i++) {
        sources[i][2] = frameData[i] / sources[i][4];
        sources[i][6] = timeFrames.frames_status[frameToFetch_][i];
    }
    angular.element(document.getElementById('voltage-report')).scope().updateSources(sources);
    /*
     // Not needed since it is handled at drawing function itself
     for (var i = 0; i < sources.length; i++) {
     var tempPu = sources[i][2];
     if (tempPu > hotPU_) {
     tempPu = hotPU_;
     } else if (tempPu < coolPU_) {
     tempPu = coolPU_;
     }
     sources[i][2] = tempPu;
     }
     */
    //RUN the plotting algorithm
    layer.redraw();
    var hours = Math.floor((frameToFetch_) / 60);
    var timeStringToDisplay = FormatNumberLength(hours, 2) + ":" + FormatNumberLength((frameToFetch_ - hours * 60), 2) + " Hrs";
    document.getElementById("playbackStatus").innerHTML = timeStringToDisplay;
    document.getElementById("over_map").innerHTML = timeStringToDisplay;
    // update the date string
    modifyDateString(timeFrames.dateString_);
    frameToFetch_ += framesToIncrement_;
    document.getElementById("playbackStatusPaused").innerHTML = "";
    if (frameToFetch_ >= 1440) {
        jumpToFrame(0);
        pauseFrameFetching();
    }
    setIsFrameBusy(false);
    //express server fetch stop / finish
    //document.getElementById("wrapper").style.border = "2px solid #999999";
}
//isBusy getter
function getIsFrameBusy() {
    return isFrameBusy_;
}

//isBusy setter
function setIsFrameBusy(val) {
    isFrameBusy_ = val;
}

function updateVideoTime() {
    var sliderVal = document.getElementById("videoTimeSlider").value;
    jumpToFrame(sliderVal);
    getFromFrames();
}

function FormatNumberLength(num, length) {
    var r = num.toString();
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}