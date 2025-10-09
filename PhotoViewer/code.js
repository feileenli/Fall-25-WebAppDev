"use strict";

let photos = [];
let index = 0;
let slideshowInterval = null;

function main() {
    document.querySelector("#photoName").value = "InitialImage.jpg";
    document.querySelector("#loadPhotos").addEventListener("click", loadPhotos);
    document.querySelector("#loadJSON").addEventListener("click", loadJSON);
    document.querySelector("#photos").addEventListener("click", loadNextPhoto);
    document.querySelector("#firstPhoto").addEventListener("click", loadFirstPhoto);
    document.querySelector("#lastPhoto").addEventListener("click", loadLastPhoto);
    document.querySelector("#nextPhoto").addEventListener("click", loadNextPhoto);
    document.querySelector("#prevPhoto").addEventListener("click", loadPrevPhoto);
    document.querySelector("#slideShow").addEventListener("click", startSlideShow);
    document.querySelector("#randomSlideShow").addEventListener("click", startRandomSlideShow);
    document.querySelector("#stopSlideShow").addEventListener("click", stopSlideShow);
    document.querySelector("#reset").addEventListener("click", resetForm);
}

window.onload = main;

function setStatusMsg(message) {
    document.querySelector("#statusMessage").innerText = message;
}

function changePhoto() {
    if (photos.length === 0) {
        return;
    }
    document.querySelector("#photos").src = photos[index];
    document.querySelector("#photoName").value = photos[index];
}

function loadPhotos() {
    const folder = document.querySelector("#folder").value.trim();
    const name = document.querySelector("#name").value.trim();
    const start = parseInt(document.querySelector("#start").value);
    const end = parseInt(document.querySelector("#end").value);

    if (end < start) {
        setStatusMsg("Error: Invalid Range");
        return;
    }

    photos = [];
    for (let i = start; i <= end; i++) {
        photos.push(`${folder}${name}${i}.jpg`);
    }

    index = 0;
    setStatusMsg("Photo Viewer System");
    changePhoto();
}

function loadJSON() {
    const jsonURL = document.querySelector("#jsonURL").value.trim();
    /* LAMBDA */
    fetch(jsonURL)
        .then(response => response.json())
        .then(data => {
            photos = data.images.map(img => img.imageURL); 
            index = 0;
            setStatusMsg("Photo Viewer System");
            changePhoto();
        });
}

function isLoaded() {
    if (photos.length === 0) {
        setStatusMsg("Error: you must load data first");
        return false;
    }
    return true;
}

function loadFirstPhoto() {
    if (!isLoaded()) {
        return;
    }
    index = 0;
    changePhoto();
}

function loadLastPhoto() {
    if (!isLoaded()) {
        return;
    }
    index = photos.length - 1;
    changePhoto();
}

function loadNextPhoto() {
    if (!isLoaded()) {
        return;
    }

    if (index == photos.length - 1) {
        index = 0;
    } else {
        index = index + 1
    }

    changePhoto();
}

function loadPrevPhoto() {
    if (!isLoaded()) {
        return;
    }

    if (index == 0) {
        index = photos.length - 1;
    } else {
        index = index - 1;
    }

    changePhoto();
}

function startSlideShow() {
    if (!isLoaded()) {
        return;
    }
    stopSlideShow();
    slideshowInterval = setInterval(loadNextPhoto, 1000);
}

function startRandomSlideShow() {
    if (!isLoaded()) {
        return;
    }
    stopSlideShow();
    slideshowInterval = setInterval(() => { 
        index = Math.floor(Math.random() * photos.length);
        changePhoto();
    }, 1000);
}

function stopSlideShow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

function resetForm() {
    stopSlideShow();
    document.querySelector("#folder").value = "";
    document.querySelector("#name").value = "";
    document.querySelector("#start").value = "";
    document.querySelector("#end").value = "";
    document.querySelector("#photos").src = "InitialImage.jpg";
    document.querySelector("#photoName").value = "InitialImage.jpg";
    setStatusMsg("");
    photos = [];
    index = 0;
}


