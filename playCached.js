//http://stackoverflow.com/questions/29731191/how-to-cache-image-rasterized
// to demo the cached frames
var cachedFrames_ = [];
var cachedTimes_ = [];
var cachedSources_ = [];
var videoTimingVar_;
var frameIterator_ = 0;
var videoCanvas_ = document.getElementById("videoCanvas");
var videoCanvasCtx_;
var videoPlayInterval_ = 200;
//Video Timing function
function startFramePlaying() {
    //clear the canvas
    borderCanvasLayer.canvas().getContext("2d").clearRect(0, 0, borderCanvasLayer.canvas().width, borderCanvasLayer.canvas().height);
    pauseFramePlaying();
    //frameIterator_ = 0;
    console.log("Starting Frame Data Fetch", "info");
    videoTimingVar_ = setInterval(getFromVideoFrames, videoPlayInterval_);
}

//Video Timing function
function pauseFramePlaying() {
    //frameToFetch = 0;
    console.log("Pausing Frame Data Fetch", "warning");
    document.getElementById("playbackStatusPaused").innerHTML = "\t(PlayBack Paused)";
    clearInterval(videoTimingVar_);
}

//Video Timing function
function getFromVideoFrames() {
    frameIterator_ = document.getElementById("videoTimeSlider").value;
    videoCanvasCtx_.putImageData(cachedFrames_[frameIterator_], 0, 0);
    var hours = Math.floor((cachedTimes_[frameIterator_]) / 60);
    var timeStringToDisplay = FormatNumberLength(hours, 2) + ":" + FormatNumberLength((cachedTimes_[frameIterator_] - hours * 60), 2) + " Hrs";
    document.getElementById("playbackStatus").innerHTML = timeStringToDisplay;
    document.getElementById("over_map").innerHTML = timeStringToDisplay;
    document.getElementById("playbackStatusPaused").innerHTML = "";
    angular.element(document.getElementById('voltage-report')).scope().updateSources(cachedSources_[frameIterator_]);
    frameIterator_++;
    if (frameIterator_ >= cachedFrames_.length) {
        pauseFramePlaying();
        frameIterator_ = 0;
    }
    document.getElementById("videoTimeSlider").value = frameIterator_;
    var hours = Math.floor((cachedTimes_[frameIterator_]) / 60);
    var timeStringToDisplay = FormatNumberLength(hours, 2) + ":" + FormatNumberLength((cachedTimes_[frameIterator_] - hours * 60), 2) + " Hrs";
    document.getElementById("videoTimeString").innerHTML = timeStringToDisplay;
}

//Video Timing function
function setCachePlayInterval() {
    videoPlayInterval_ = document.getElementById("cachePlayIntervalInput").value;
}

function updateVideoTime() {
    var sliderVal = document.getElementById("videoTimeSlider").value;
    var hours = Math.floor((cachedTimes_[sliderVal]) / 60);
    var timeStringToDisplay = FormatNumberLength(hours, 2) + ":" + FormatNumberLength((cachedTimes_[sliderVal] - hours * 60), 2) + " Hrs";
    document.getElementById("videoTimeString").innerHTML = timeStringToDisplay;
    if (document.getElementById("autoRefresh").checked == true) {
        document.getElementById("drawSnapshotButton").onclick();
    }
}

function paintCachedFrame() {
    borderCanvasLayer.canvas().getContext("2d").clearRect(0, 0, borderCanvasLayer.canvas().width, borderCanvasLayer.canvas().height);
    getFromVideoFrames();
}