import React from 'react';

const controller = (props) => {
    return(
        <div>
            <div className="p20">
                Handtrack.js allows you prototype handtracking interactions in the browser in 3 lines of code.
            </div>
            <div className="mb10">
                <button  id="trackbutton" className="bx--btn bx--btn--secondary" type="button" disabled>
                Toggle Video
                </button>
                <button id="windowbutton" className="bx--btn bx--btn--secondary" type="button">
                Open Window
                </button>
                <div id="updatenote" className="updatenote mt10"> loading model ..</div>
            </div>
            <video className="videobox canvasbox" autoPlay="autoplay" id="myvideo"></video>
            <canvas id="canvas" className="border canvasbox"></canvas>
            <div className="mt10">
                <img src="images/1.jpg" className="canvasbox  hidden" id="handimage" alt=""/>
            </div>

            <script src="https://unpkg.com/carbon-components@latest/scripts/carbon-components.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/handtrackjs@latest/dist/handtrack.min.js"> </script>
            <script src="./code_guts.js"></script>
        </div>
    );
};
const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let windowButton = document.getElementById("windowbutton")
let updateNote = document.getElementById("updatenote");

let imgindex = 1
let isVideo = false;
let model = null;

// video.width = 500
// video.height = 400

var myWindow;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



trackButton.addEventListener("click", function(){
    toggleVideo();
});

function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        if (predictions.length > 0) { 
            moveWin((predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)) , (predictions[0].bbox[1] + (predictions[0].bbox[3] / 2)) )
        }
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

function runDetectionImage(img) {
    model.detect(img).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, img);
    });
}

function openWin() {
  console.log('Tried to open a window')
  myWindow=window.open("", "myWindow", "width=200, height=100");
  myWindow.document.write("<p>This is a window.</p>");
}

function moveWin(p1, p2) {
  myWindow.moveTo(p1, p2);
}

windowButton.addEventListener("click", function(){
    openWin();
})

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    runDetectionImage(handimg)
    trackButton.disabled = false
});

export default controller;
