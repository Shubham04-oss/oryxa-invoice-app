const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

const fontPath = path.join(__dirname, 'assets', 'Poppins-Bold.ttf');

if (!fs.existsSync(fontPath)) {
  throw new Error(
    `Poppins font not found at ${fontPath}. Run the setup step to download it before rendering.`
  );
}
registerFont(fontPath, { family: 'Poppins', weight: '700' });

const WIDTH = 720;
const HEIGHT = 240;
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, WIDTH, HEIGHT);
ctx.globalCompositeOperation = 'source-over';

// Transparent background with a soft glow behind the word
const glowGradient = ctx.createRadialGradient(
  WIDTH * 0.4,
  HEIGHT * 0.5,
  10,
  WIDTH * 0.4,
  HEIGHT * 0.5,
  WIDTH * 0.6
);
glowGradient.addColorStop(0, 'rgba(96, 165, 250, 0.35)');
glowGradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
ctx.fillStyle = glowGradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

ctx.fillStyle = 'rgba(2, 6, 23, 0.55)';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

ctx.textAlign = 'left';
ctx.textBaseline = 'middle';
ctx.font = '700 130px "Poppins"';

const gradient = ctx.createLinearGradient(WIDTH * 0.15, 0, WIDTH * 0.75, 0);
gradient.addColorStop(0, '#5EEAD4');
gradient.addColorStop(1, '#60A5FA');
ctx.fillStyle = gradient;

const text = 'Oryxa';
const textMetrics = ctx.measureText(text);
const textWidth = textMetrics.width;
const startX = (WIDTH - textWidth) / 2;
const startY = HEIGHT / 2;
ctx.fillText(text, startX, startY);

// Add subtle highlight stroke
ctx.lineWidth = 2;
ctx.strokeStyle = 'rgba(248, 250, 252, 0.08)';
ctx.strokeText(text, startX, startY);

const outputDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const pngPath = path.join(outputDir, 'oryxa-brand.png');
const jpgPath = path.join(outputDir, 'oryxa-brand.jpg');

fs.writeFileSync(pngPath, canvas.toBuffer('image/png'));
fs.writeFileSync(
  jpgPath,
  canvas.toBuffer('image/jpeg', {
    quality: 0.95,
    chromaSubsampling: false,
  })
);

console.log(`Generated brand mark at ${pngPath}`);
console.log(`Generated brand mark at ${jpgPath}`);
