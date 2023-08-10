let video = document.querySelector("video");
let recordBtnContainer = document.querySelector(".record-btn-container");
let captureBtnContainer = document.querySelector(".capture-btn-container");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");

let transparentColor = "transparent";
let recorder;
let chunks = []; //media data in chunks
let recordFlag = false;
let constraints = {
  video: true,
  audio: true,
};

//navigator => global, browser info
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    // conversion of media chunks data to video
    let blob = new Blob(chunks, { type: "video/mp4" });

    if (db) {
      let videoId = new ShortUniqueId();
      let dbTransaction = db.transaction(["video"], "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: `video-${videoId()}`,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }
    // let videoUrl = window.URL.createObjectURL(blob);
    // let a = document.createElement("a");
    // a.href = videoUrl;
    // a.download = "stream.mp4";
    // a.click();
  });
});

recordBtnContainer.addEventListener("click", (e) => {
  if (!recorder) return;
  recordFlag = !recordFlag;

  if (recordFlag) {
    // start
    recorder.start();
    recordBtn.classList.add("scale-record");
    startTimer();
  } else {
    // stop
    recorder.stop();
    recordBtn.classList.remove("scale-record");
    stopTimer();
  }
});

captureBtnContainer.addEventListener("click", (e) => {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Filtering
  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  let imageUrl = canvas.toDataURL();

  if (db) {
    let imageId = new ShortUniqueId();
    let dbTransaction = db.transaction("image", "readwrite");
    let imageStore = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img-${imageId()}`,
      blobData: imageUrl,
    };
    imageStore.add(imageEntry);
  }

  // let a = document.createElement("a");
  // a.href = imageUrl;
  // a.download = "image.jpg";
  // a.click();
});

let timerId;
let counter = 0; //represents total seconds
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalSeconds = counter;
    let hours = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;
    let mins = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    let secs = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    mins = mins < 10 ? `0${mins}` : mins;
    secs = secs < 10 ? `0${secs}` : secs;

    timer.innerText = `${hours}:${mins}:${secs}`;
    counter++;
  }
  timerId = setInterval(displayTimer, 1000);
}
function stopTimer() {
  clearInterval(timerId);
  timer.style.display = "none";
  timer.innerText = "00:00:00";
}

// filtering logic
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
  filterElem.addEventListener("click", (e) => {
    // Get style property
    transparentColor =
      getComputedStyle(filterElem).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = transparentColor;
  });
});
