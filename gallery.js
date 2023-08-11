setTimeout(() => {
  if (db) {
    // VIDEO RETRIEVAL
    let videoDbTransaction = db.transaction("video", "readonly");
    let videoStore = videoDbTransaction.objectStore("video");
    let videoRequest = videoStore.getAll();
    videoRequest.onsuccess = (e) => {
      let videoResults = videoRequest.result;
      let galleryContainer = document.querySelector(".gallery-container");

      videoResults.forEach((videoObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-container");
        mediaElem.setAttribute("id", videoObj.id);
        let url = URL.createObjectURL(videoObj.blobData);
        mediaElem.innerHTML = `
            <div class="media">
                <video controls autoplay loop src="${url}"></video>
            </div>
            <div class="delete action-btn">Delete</div>
            <div class="download action-btn">Download</div>
            `;

        galleryContainer.appendChild(mediaElem);
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteFunc);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadFunc);
      });
    };

    // IMAGE RETRIEVAL
    let imageDbTransaction = db.transaction("image", "readonly");
    let imageStore = imageDbTransaction.objectStore("image");
    let imageRequest = imageStore.getAll();
    imageRequest.onsuccess = (e) => {
      let imageResults = imageRequest.result;
      let galleryContainer = document.querySelector(".gallery-container");

      imageResults.forEach((imageObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-container");
        mediaElem.setAttribute("id", imageObj.id);
        let url = imageObj.url;
        mediaElem.innerHTML = `
            <div class="media">
                <img src="${url}" />
            </div>
            <div class="delete action-btn">Delete</div>
            <div class="download action-btn">Download</div>
            `;

        galleryContainer.appendChild(mediaElem);
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteFunc);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadFunc);
      });
    };
  }
}, 100);

// remove from UI and DB
function deleteFunc(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  // DB change
  if (type === "vid") {
    let videoDBTransaction = db.transaction("video", "readwrite");
    let videoStore = videoDBTransaction.objectStore("video");
    videoStore.delete(id);
  } else if (type === "img") {
    let imageDBTransaction = db.transaction("image", "readwrite");
    let imageStore = imageDBTransaction.objectStore("image");
    imageStore.delete(id);
  }

  // UI change
  e.target.parentElement.remove();
}

// download
function downloadFunc(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  if (type === "vid") {
    let videoDbTransaction = db.transaction("video", "readwrite");
    let videoStore = videoDbTransaction.objectStore("video");
    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      let videoUrl = window.URL.createObjectURL(videoResult.blobData);

      let a = document.createElement("a");
      a.href = videoUrl;
      a.download = "stream.mp4";
      a.click();
    };
  } else if (type === "img") {
    let imageDbTransaction = db.transaction("image", "readwrite");
    let imageStore = imageDbTransaction.objectStore("image");
    let imageRequest = imageStore.get(id);
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;

      let a = document.createElement("a");
      a.href = imageResult.url;
      a.download = "image.jpg";
      a.click();
    };
  }
}
