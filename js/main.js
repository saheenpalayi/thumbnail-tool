// main.js

import * as StackBlur from './stackblur.js';

const outputCanvas = document.getElementById('outputCanvas');
const ctx = outputCanvas.getContext('2d');

const imageInput = document.getElementById('imageInput');
const blurSlider = document.getElementById('blurSlider');
const imageLinkInput = document.getElementById('imageLink');
const loadImageButton = document.getElementById('loadImageFromLink');
const downloadButton = document.getElementById('downloadButton'); // Get the download button
const image = new Image();
let blurAmount = parseInt(blurSlider.value, 10);
let cachedImage;

function isAspectRatio1to1(image) {
    return image.width === image.height;
}

function applyBlur() {
    const imageUrl = imageLinkInput.value.trim();
    const file = imageInput.files[0];
    // if (imageUrl) {
    //     // const image = new Image();
    //     image.src = imageUrl;

    // }
    if (imageUrl) {
        image.crossOrigin = "anonymous";
        image.src = imageUrl;
        convertBlured();
    }
    else if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            // const image = new Image();
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
        convertBlured();
    }
}


function convertBlured() {
    image.onload = () => {
        if (!isAspectRatio1to1(image)) {
            alert('Please select a 1:1 aspect ratio image.');
            return;
        }

        const outputWidth = image.width * 16 / 9;
        const outputHeight = image.width;

        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;

        const centerX = (outputWidth - image.width) / 2;
        const centerY = (outputHeight - image.height) / 2;

        ctx.clearRect(0, 0, outputWidth, outputHeight);
        ctx.drawImage(image, centerX - image.width / 2.5, centerY);
        ctx.drawImage(image, centerX + image.width / 2.5, centerY);

        StackBlur.canvasRGB(outputCanvas, 0, 0, outputWidth / 4, outputHeight, blurAmount);
        StackBlur.canvasRGB(outputCanvas, (3 * outputWidth) / 4, 0, outputWidth / 4, outputHeight, blurAmount);

        ctx.drawImage(image, centerX, centerY);

        // Enable the download button
        downloadButton.disabled = false;
    };
}




// Listen for changes to the slider value
blurSlider.addEventListener('input', () => {
    blurAmount = parseInt(blurSlider.value, 10);
    applyBlur();
});

// Listen for changes to the file input
imageInput.addEventListener('change', () => {
    applyBlur();
});


loadImageButton.addEventListener('click', () => {

    applyBlur();
});

// Add click event listener for the download button
downloadButton.addEventListener('click', () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = outputCanvas.toDataURL('image/jpeg'); // Change to 'image/png' for PNG format
    downloadLink.download = 'thumbnail.jpg'; // Change the filename as needed
    downloadLink.click();
});



