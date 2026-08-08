import fs from "node:fs";
import path from "node:path";

const tsBinDir = path.join(process.cwd(), "node_modules", "typescript", "bin");
const tsc6Path = path.join(tsBinDir, "tsc6");
const tscPath = path.join(tsBinDir, "tsc");
const pkgJsonPath = path.join(process.cwd(), "node_modules", "typescript", "package.json");

if (!fs.existsSync(pkgJsonPath)) {
  process.exit(0);
}

if (fs.existsSync(tsc6Path) && !fs.existsSync(tscPath)) {
  fs.copyFileSync(tsc6Path, tscPath);
  try {
    fs.chmodSync(tscPath, 0o755);
  } catch {}
  console.log("[shim] created node_modules/typescript/bin/tsc (copy of bin/tsc6)");
}

const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
const bin = pkg.bin;
const hasTsc = typeof bin === "string" ? bin.endsWith("tsc") || bin === "tsc" : Boolean(bin && bin.tsc);

if (!hasTsc) {
  const newBin = typeof bin === "string" ? { tsc: bin, tsc6: bin } : { ...(bin ?? {}), tsc: "./bin/tsc" };
  pkg.bin = newBin;
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("[shim] added tsc bin to node_modules/typescript/package.json");
}
