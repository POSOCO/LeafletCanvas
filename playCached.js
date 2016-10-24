//http://stackoverflow.com/questions/29731191/how-to-cache-image-rasterized
// to demo the cached frames
var frames_ = [];
var times_ = [];
var videoTimingVar_;
var frameIterator_ = 0;
var videoCanvas_ = document.getElementById("videoCanvas");
var videoCanvasCtx_;
var videoPlayInterval_ = 500;
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
    document.getElementById("playbackStatus").innerHTML += "\n(PlayBack Paused)";
    clearInterval(videoTimingVar_);
}

//Video Timing function
function getFromVideoFrames() {
    if (frameIterator_ >= frames_.length) {
        frameIterator_ = 0;
        pauseFramePlaying();
        return;
    }
    videoCanvasCtx_.putImageData(frames_[frameIterator_], 0, 0);
    document.getElementById("playbackStatus").innerHTML = times_[frameIterator_];
    document.getElementById("over_map").innerHTML = times_[frameIterator_];
    frameIterator_++;
}

//Video Timing function
function setCachePlayInterval() {
    videoPlayInterval_ = document.getElementById("cachePlayIntervalInput").value;
}

function updateVideoTime(){
    var sliderVal = document.getElementById("videoTimeSlider").value;
    document.getElementById("videoTimeSlider").innerHTML = times_[sliderVal];
}
