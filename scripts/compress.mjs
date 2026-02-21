import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function compressDirectory(directory) {
    const fullPath = path.join(__dirname, '..', 'public', directory);
    const files = await fs.readdir(fullPath);

    console.log(`Starting compression for ${directory}... found ${files.length} files.`);

    // Filter for JPGs that aren't already webp
    const targets = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

    const queue = targets.map(async file => {
        const inputPath = path.join(fullPath, file);
        const outputName = file.replace(/\.(jpg|jpeg)$/i, '.webp');
        const outputPath = path.join(fullPath, outputName);

        // Compress using 80 quality webp
        await sharp(inputPath)
            .resize({ width: 1920, withoutEnlargement: true }) // Ensure max 1920 width
            .webp({ quality: 75, effort: 6 })
            .toFile(outputPath);

        // Remove the original jpg to save space globally
        await fs.unlink(inputPath);
    });

    await Promise.all(queue);
    console.log(`✅ Finished ${directory}! Compressed ${targets.length} images to WebP.`);
}

async function run() {
    try {
        await compressDirectory('sequence-1/HEROANIMATION(jpg)');
        await compressDirectory('sequence-2/Animation2');
        console.log('All image sequences successfully compressed to WebP!');
    } catch (err) {
        console.error('Error compressing files:', err);
    }
}

run();
