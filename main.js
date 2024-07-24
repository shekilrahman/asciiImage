document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);

    img.onload = function() {
        const canvas = document.getElementById('asciiCanvas');
        const canvasResized = document.getElementById('asciiCanvasResized');
        const ctx = canvas.getContext('2d');
        const ctxResized = canvasResized.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        canvasResized.width = img.width * scalingFactor;
        canvasResized.height = img.height * scalingFactor;

        const newFontSize = 12; 
        const scalingFactor = 2; // to Download high quality image 

        const asciiArt = convertToASCII(img, img.width, img.height);
        drawASCIIArt(ctx, asciiArt, img.width, img.height); // for preview
        drawASCIIArtResized(ctxResized, asciiArt, img.width, img.height, newFontSize, scalingFactor); // for download
    }
});

document.getElementById('downloadButton').addEventListener('click', function() {
    const canvasResized = document.getElementById('asciiCanvasResized');
    const link = document.createElement('a');
    link.href = canvasResized.toDataURL('image/png');
    link.download = 'download.png';
    link.click();
});

function convertToASCII(img, width, height) {

    const chars= `.-+=zuneowVpOD#`; // ASCII charecter set

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let ascii = '';

    for (let y = 0; y < height; y += 6) {
        for (let x = 0; x < width; x += 3) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const avg = (r + g + b) / 3;
            const charIndex = Math.floor(((255 - avg) / 255) * (chars.length - 1)); 
            ascii += chars[charIndex];
        }
        ascii += '\n';
    }

    return ascii;
}

function drawASCIIArt(ctx, asciiArt, width, height) {
    ctx.font = '6px monospace';
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';

    const lines = asciiArt.split('\n');
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            ctx.fillText(char, x * 3, y * 6); 
        });
    });
}

function drawASCIIArtResized(ctx, asciiArt, width, height, fontSize, scalingFactor) {
    ctx.font = `${fontSize}px monospace`; 
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,width*scalingFactor,height*scalingFactor);
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';

    const lines = asciiArt.split('\n');
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            ctx.fillText(char, x * 3 * scalingFactor, y * 6 * scalingFactor); 
        });
    });
}
