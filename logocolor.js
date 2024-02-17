document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('logoCanvas');
    const ctx = canvas.getContext('2d');
    loadAndRecolorLogo();

    image.onload = () => {
        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Recolor the image
        recolorImage(ctx, canvas.width, canvas.height);
    };
});

document.addEventListener('colorUpdated', function() {
    const canvas = document.getElementById('logoCanvas');
    const ctx = canvas.getContext('2d');
    recolorImage(ctx, canvas.width, canvas.height);
});

document.addEventListener('logoUpdated', function() {
    loadAndRecolorLogo();
});

function loadAndRecolorLogo() {
    const canvas = document.getElementById('logoCanvas');
    if (!canvas) return; // Guard clause if canvas is not found
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = currentLogoPath; // Use the global variable

    image.onload = () => {
        // Clear the canvas before drawing the new image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        recolorImage(ctx, canvas.width, canvas.height);
    };
}


function recolorImage(ctx, width, height) {
    // Use the global `currentColor` variable
    const newColor = currentColor; // Now this uses the color from script.js

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Use the original alpha value directly
        const originalAlpha = data[i + 3];

        // Apply the new color
        data[i] = currentColor.r;     // Red
        data[i + 1] = currentColor.g; // Green
        data[i + 2] = currentColor.b; // Blue
        data[i + 3] = originalAlpha;  // Preserve original alpha channel
    }

    ctx.putImageData(imageData, 0, 0);
}

