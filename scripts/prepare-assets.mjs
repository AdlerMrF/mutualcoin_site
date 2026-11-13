import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('public/img', { recursive: true });
await sharp('src/assets/img/background.png').resize({ width: 1440 }).webp({ quality: 76 }).toFile('public/img/hero-earth.webp');
await sharp('public/img/bg-bento.jpg').webp({ quality: 78 }).toFile('public/img/bg-bento.webp');
await copyFile('src/assets/img/iconeMutual.svg', 'public/img/mutual-symbol.svg');
await sharp('public/img/mutucoin-social.svg').webp({ quality: 92 }).toFile('public/img/mutucoin-social.webp');
console.log('Imagens WebP e cartão social Mutucoin gerados localmente.');
