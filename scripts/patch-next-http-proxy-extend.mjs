import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const targetFile = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "compiled",
  "http-proxy",
  "index.js"
)

try {
  if (!fs.existsSync(targetFile)) {
    process.exit(0)
  }

  const original = fs.readFileSync(targetFile, "utf8")
  const patched = original.replaceAll("=r(837)._extend", "=Object.assign")

  if (patched !== original) {
    fs.writeFileSync(targetFile, patched, "utf8")
    console.log(
      "[postinstall] Patched Next bundled http-proxy to avoid util._extend deprecation."
    )
  }
} catch (error) {
  console.warn("[postinstall] Unable to patch Next bundled http-proxy:", error)
  process.exit(0)
}

