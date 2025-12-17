const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PICS_DIR = path.join(__dirname, '../public/pics');

async function optimizeImages() {
    console.log('Starting image optimization...');

    try {
        const files = fs.readdirSync(PICS_DIR);

        for (const file of files) {
            if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
                const inputPath = path.join(PICS_DIR, file);
                const filename = path.parse(file).name;
                const outputPath = path.join(PICS_DIR, `${filename}.webp`);

                console.log(`Processing: ${file}`);

                // Get metadata to log dimensions
                const metadata = await sharp(inputPath).metadata();
                console.log(`  Original: ${metadata.width}x${metadata.height}, ${metadata.size} bytes`);

                // Convert to WebP
                const info = await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                console.log(`  Optimized: ${info.width}x${info.height}, ${info.size} bytes`);
                console.log(`  Saved to: ${outputPath}`);
            }
        }

        console.log('Image optimization complete!');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages();
