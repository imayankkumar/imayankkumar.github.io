import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const svgPath = join(root, "public/favicon/favicon.svg")
const outDir = join(root, "public/favicon")

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
]

const svg = sharp(svgPath)

for (const { name, size } of sizes) {
  await svg
    .clone()
    .resize(size, size)
    .png()
    .toFile(join(outDir, name))
  console.log(`wrote ${name}`)
}

// Multi-resolution ICO (16 + 32)
const ico16 = await sharp(svgPath).resize(16, 16).png().toBuffer()
const ico32 = await sharp(svgPath).resize(32, 32).png().toBuffer()

// Prefer sharp ICO if available; otherwise write 32px PNG renamed fallback via png-to-ico style
try {
  await sharp(svgPath).resize(32, 32).toFormat("ico").toFile(join(outDir, "favicon.ico"))
  console.log("wrote favicon.ico (sharp)")
} catch {
  // Manual ICO: simple single-image ICO header + PNG (modern browsers accept PNG-in-ICO)
  const png = ico32
  const ico = Buffer.concat([
    // ICONDIR
    Buffer.from([0, 0, 1, 0, 1, 0]),
    // ICONDIRENTRY
    Buffer.from([
      32, // width
      32, // height
      0, // colors
      0, // reserved
      1,
      0, // planes
      32,
      0, // bit count
    ]),
    (() => {
      const size = Buffer.alloc(4)
      size.writeUInt32LE(png.length, 0)
      return size
    })(),
    (() => {
      const offset = Buffer.alloc(4)
      offset.writeUInt32LE(22, 0)
      return offset
    })(),
    png,
  ])
  // Also embed 16px as primary small icon using sharp's png for browsers that request /favicon.ico
  writeFileSync(join(outDir, "favicon.ico"), ico)
  console.log("wrote favicon.ico (png-in-ico)")
  void ico16
}

console.log("favicon generation complete")
