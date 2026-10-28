// Builds static/nbs/durations.json (file name -> runtime in seconds) for the Note Block Songs util.
// The nbs-songs repo only lists file names, so this downloads the repo once as a zip and measures each song
// with the same parser the player uses.
// Run with: npm run nbs-durations
import {writeFile} from "node:fs/promises"
import {unzipSync} from "fflate"
import {fromArrayBuffer} from "@nbsjs/core"

const zipUrl = "https://api.github.com/repos/flytegg/nbs-songs/zipball/master"
const outputPath = new URL("../static/nbs/durations.json", import.meta.url)

// GitHub puts everything inside a "<owner>-<repo>-<commit>/" folder; only the songs at its top level are listed on the site
const songName = path => {
    const fileName = path.split("/").slice(1).join("/")
    return fileName.toLowerCase().endsWith(".nbs") && !fileName.includes("/") ? fileName : null
}

const response = await fetch(zipUrl)
if (!response.ok) throw new Error(`Failed to download songs: HTTP ${response.status}`)
const zip = new Uint8Array(await response.arrayBuffer())

const files = unzipSync(zip, {filter: file => songName(file.name) !== null})
const durations = {}
const failed = []

for (const [path, data] of Object.entries(files)) {
    const fileName = songName(path)

    try {
        const song = fromArrayBuffer(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength))
        durations[fileName] = Math.round(song.getLength() / song.getTempo() * 10) / 10
    } catch (error) {
        failed.push(`${fileName}: ${error.message}`)
    }
}

const sorted = Object.fromEntries(Object.entries(durations).sort(([a], [b]) => a.localeCompare(b)))
await writeFile(outputPath, JSON.stringify(sorted, null, 2) + "\n")

console.log(`Wrote ${Object.keys(sorted).length} durations from a ${Math.round(zip.length / 1024)} KB zip`)
if (failed.length) console.log(`Failed:\n${failed.join("\n")}`)
