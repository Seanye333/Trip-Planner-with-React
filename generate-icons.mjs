import sharp from 'sharp'
import { writeFileSync } from 'fs'

const svgBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#g)"/>
  <text x="256" y="340" font-size="260" text-anchor="middle" fill="white" font-family="serif">✈</text>
</svg>`)

await sharp(svgBuffer).resize(192, 192).png().toFile('./public/icons/icon-192.png')
await sharp(svgBuffer).resize(512, 512).png().toFile('./public/icons/icon-512.png')

console.log('Icons generated: icon-192.png, icon-512.png')
