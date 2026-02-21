const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const seq1Dir = path.join(publicDir, 'sequence-1');
const seq2Dir = path.join(publicDir, 'sequence-2');

// Ensure directories exist
if (!fs.existsSync(seq1Dir)) fs.mkdirSync(seq1Dir, { recursive: true });
if (!fs.existsSync(seq2Dir)) fs.mkdirSync(seq2Dir, { recursive: true });

// Minimal 1x1 black JPEG base64
const blackPixelBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
const buffer = Buffer.from(blackPixelBase64, 'base64');

// Create 120 frames for sequence-1
for (let i = 1; i <= 120; i++) {
    const fileName = i.toString().padStart(3, '0') + '.jpg';
    fs.writeFileSync(path.join(seq1Dir, fileName), buffer);
}

// Create 90 frames for sequence-2
for (let i = 1; i <= 90; i++) {
    const fileName = i.toString().padStart(3, '0') + '.jpg';
    fs.writeFileSync(path.join(seq2Dir, fileName), buffer);
}

// Create a dummy video file
fs.writeFileSync(path.join(publicDir, 'globe-loop.mp4'), buffer);

console.log('Placeholders created successfully.');
