const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/pics/as-2-icon.png');
const outputPath = path.join(__dirname, '../public/pics/favicon.png');

sharp(inputPath)
    .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toFile(outputPath)
    .then(info => {
        console.log('Favicon generated:', info);
    })
    .catch(err => {
        console.error('Error generating favicon:', err);
    });
