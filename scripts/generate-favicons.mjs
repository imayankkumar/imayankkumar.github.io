import { copyFileSync, writeFileSync } from "node:fs"
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

for (const { name, size } of sizes) {
  await sharp(svgPath).resize(size, size).png().toFile(join(outDir, name))
  console.log(`wrote ${name}`)
}

const png16 = await sharp(svgPath).resize(16, 16).png().toBuffer()
const png32 = await sharp(svgPath).resize(32, 32).png().toBuffer()

function pngIco(images) {
  const count = images.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)

  const entries = []
  const bodies = []
  let offset = 6 + count * 16

  for (const img of images) {
    const entry = Buffer.alloc(16)
    entry[0] = img.size >= 256 ? 0 : img.size
    entry[1] = img.size >= 256 ? 0 : img.size
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(img.data.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    bodies.push(img.data)
    offset += img.data.length
  }

  return Buffer.concat([header, ...entries, ...bodies])
}

const ico = pngIco([
  { size: 16, data: png16 },
  { size: 32, data: png32 },
])

const icoPath = join(outDir, "favicon.ico")
writeFileSync(icoPath, ico)
copyFileSync(icoPath, join(root, "public/favicon.ico"))
copyFileSync(join(outDir, "favicon.svg"), join(root, "public/favicon.svg"))
console.log("wrote favicon.ico + synced public root copies")
console.log("favicon generation complete")
