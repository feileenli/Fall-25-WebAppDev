"use strict";

let photos = [];
let currentIndex = 0;
let slideshowInterval = null;

function main() {
    document.querySelector("#loadPhotos").addEventListener("click", loadPhotos);
    document.querySelector("#loadJSON").addEventListener("click", loadJSON);
    document.querySelector("#firstPhoto").addEventListener("click", showFirstPhoto);
    document.querySelector("#lastPhoto").addEventListener("click", showLastPhoto);
    document.querySelector("#nextPhoto").addEventListener("click", showNextPhoto);
    document.querySelector("#prevPhoto").addEventListener("click", showPrevPhoto);
    document.querySelector("#slideShow").addEventListener("click", startSlideShow);
    document.querySelector("#randomSlideShow").addEventListener("click", startRandomSlideShow);
    document.querySelector("#stopSlideShow").addEventListener("click", stopSlideShow);
    document.querySelector("#resetForm").addEventListener("click", resetForm);
    document.querySelector("#photoDisplay").addEventListener("click", showNextPhoto);

    document.querySelector("#photoName").value = "InitialImage.jpg";
}

window.onload = main;

function setStatus(message) {
    document.querySelector("#statusMessage").innerText = message;
}

function updatePhotoDisplay() {
    if (photos.length === 0) return;
    document.querySelector("#photoDisplay").src = photos[currentIndex];
    document.querySelector("#photoName").value = photos[currentIndex];
}

function loadPhotos() {
    const folder = document.querySelector("#folderName").value.trim();
    const common = document.querySelector("#commonName").value.trim();
    const start = parseInt(document.querySelector("#startNumber").value);
    const end = parseInt(document.querySelector("#endNumber").value);

    if (isNaN(start) || isNaN(end) || end < start) {
        setStatus("Error: Invalid Range");
        return;
    }

    photos = [];
    for (let i = start; i <= end; i++) {
        photos.push(`${folder}${common}${i}.jpg`);
    }

    currentIndex = 0;
    setStatus("Photo Viewer System");
    updatePhotoDisplay();
}

function loadJSON() {
    const jsonURL = document.querySelector("#jsonURL").value.trim();
    if (!jsonURL) {
        setStatus("Error: JSON URL is required");
        return;
    }

    fetch(jsonURL)
        .then(response => response.json())
        .then(data => {
            photos = data.images.map(img => img.imageURL); /* LAMBDA */
            currentIndex = 0;
            setStatus("Photo Viewer System");
            updatePhotoDisplay();
        })
        .catch(err => setStatus("Error loading JSON"));
}

function showFirstPhoto() {
    if (!checkLoaded()) return;
    currentIndex = 0;
    updatePhotoDisplay();
}

function showLastPhoto() {
    if (!checkLoaded()) return;
    currentIndex = photos.length - 1;
    updatePhotoDisplay();
}

function showNextPhoto() {
    if (!checkLoaded()) return;
    currentIndex = (currentIndex + 1) % photos.length;
    updatePhotoDisplay();
}

function showPrevPhoto() {
    if (!checkLoaded()) return;
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updatePhotoDisplay();
}

function startSlideShow() {
    if (!checkLoaded()) return;
    stopSlideShow();
    slideshowInterval = setInterval(showNextPhoto, 1000);
}

function startRandomSlideShow() {
    if (!checkLoaded()) return;
    stopSlideShow();
    slideshowInterval = setInterval(() => { /* LAMBDA */
        currentIndex = Math.floor(Math.random() * photos.length);
        updatePhotoDisplay();
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
    document.querySelector("#folderName").value = "";
    document.querySelector("#commonName").value = "";
    document.querySelector("#startNumber").value = "";
    document.querySelector("#endNumber").value = "";
    setStatus("");
    photos = [];
    currentIndex = 0;
    document.querySelector("#photoDisplay").src = "InitialImage.jpg";
    document.querySelector("#photoName").value = "InitialImage.jpg";
}

function checkLoaded() {
    if (photos.length === 0) {
        setStatus("Error: you must load data first");
        return false;
    }
    return true;
}
