//http://stackoverflow.com/questions/29731191/how-to-cache-image-rasterized
// to demo the cached frames
var frames_ = [];
var times_ = [];
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
    videoCanvasCtx_.putImageData(frames_[frameIterator_], 0, 0);
    var hours = Math.floor((times_[frameIterator_]) / 60);
    var timeStringToDisplay = FormatNumberLength(hours, 2) + ":" + FormatNumberLength((times_[frameIterator_] - hours * 60), 2) + " Hrs";
    document.getElementById("playbackStatus").innerHTML = timeStringToDisplay;
    document.getElementById("over_map").innerHTML = timeStringToDisplay;
    document.getElementById("playbackStatusPaused").innerHTML = "";
    frameIterator_++;
    if (frameIterator_ >= frames_.length) {
        pauseFramePlaying();
        frameIterator_ = 0;
    }
    document.getElementById("videoTimeSlider").value = frameIterator_;
    document.getElementById("videoTimeSlider").onchange();
}

//Video Timing function
function setCachePlayInterval() {
    videoPlayInterval_ = document.getElementById("cachePlayIntervalInput").value;
}

function updateVideoTime() {
    var sliderVal = document.getElementById("videoTimeSlider").value;
    var hours = Math.floor((times_[sliderVal]) / 60);
    var timeStringToDisplay = FormatNumberLength(hours, 2) + ":" + FormatNumberLength((times_[sliderVal] - hours * 60), 2) + " Hrs";
    document.getElementById("videoTimeString").innerHTML = timeStringToDisplay;
}

function paintCachedFrame(){
    borderCanvasLayer.canvas().getContext("2d").clearRect(0, 0, borderCanvasLayer.canvas().width, borderCanvasLayer.canvas().height);
    getFromVideoFrames();
}