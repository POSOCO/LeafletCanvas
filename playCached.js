//http://stackoverflow.com/questions/29731191/how-to-cache-image-rasterized
// to demo the cached frames
var frames_ = [];
var times_ = [];
var videoTimingVar_;
var frameIterator_ = 0;
var videoCanvas_ = document.getElementById("videoCanvas");
var videoCanvasCtx_ = videoCanvas_.getContext("2d");
var videoCanvasWidth_ = videoCanvas_.width, videoCanvasHeight_ = videoCanvas_.height;
//Video Timing function
function startFramePlaying() {
    pauseFramePlaying();
    frameIterator_ = 0;
    console.log("Starting Frame Data Fetch", "info");
    videoTimingVar_ = setInterval(getFromVideoFrames, 33);
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
    if (frameIterator_ > frames_.length) {
        pauseFramePlaying();
        return;
    }
    videoCanvasCtx_.drawImage(frames[frameIterator_], 0, 0, videoCanvasWidth_, videoCanvasHeight_);
    document.getElementById("playbackStatus").innerHTML = times_[frameIterator_];
    document.getElementById("over_map").innerHTML = times_[frameIterator_];
    frameIterator_++;
}