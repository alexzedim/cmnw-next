import { createHash } from "crypto";

const ELDER_FUTHARK = [
  "ᚠ",
  "ᚢ",
  "ᚦ",
  "ᚨ",
  "ᚱ",
  "ᚲ",
  "ᚷ",
  "ᚹ",
  "ᚺ",
  "ᚾ",
  "ᛁ",
  "ᛃ",
  "ᛇ",
  "ᛈ",
  "ᛉ",
  "ᛊ",
  "ᛏ",
  "ᛒ",
  "ᛖ",
  "ᛗ",
  "ᛚ",
  "ᛜ",
  "ᛞ",
  "ᛟ",
];

function generateRandom(count: number) {
  const results: { runes: string[]; key: string; hash: string }[] = [];

  for (let i = 0; i < count; i++) {
    const runes = Array.from({ length: 6 }, () =>
      ELDER_FUTHARK[Math.floor(Math.random() * ELDER_FUTHARK.length)]
    );
    const key = runes.join("");
    const hash = createHash("sha256").update(key, "utf8").digest("hex");
    results.push({ runes, key, hash });
  }

  console.log(`Generated ${count} rune keys:\n`);

  for (const { runes, key, hash } of results) {
    console.log(`  ${runes.join(" ")}  ->  ${hash}`);
  }

  console.log("\nKEY_HASHES set:\n");
  console.log("const KEY_HASHES = new Set([");
  for (const { hash } of results) {
    console.log(`  "${hash}",`);
  }
  console.log("]);");
}

function hashSingle(input: string) {
  const chars = [...input];
  const invalid = chars.filter((c) => !ELDER_FUTHARK.includes(c));

  if (invalid.length > 0) {
    console.error(`Invalid runes found: ${invalid.join(" ")}`);
    console.error("Use only Elder Futhark runes from the pool above.");
    process.exit(1);
  }

  if (chars.length !== 6) {
    console.error(`Expected exactly 6 runes, got ${chars.length}`);
    process.exit(1);
  }

  const key = chars.join("");
  const hash = createHash("sha256").update(key, "utf8").digest("hex");

  console.log(`Runes:   ${chars.join(" ")}`);
  console.log(`Key:     ${key}`);
  console.log(`SHA-256: ${hash}`);
}

function printUsage() {
  console.log("Usage:");
  console.log("  npx tsx scripts/generate-rune-key.ts <6 runes>     Hash a specific key");
  console.log("  npx tsx scripts/generate-rune-key.ts --gen <n>     Generate n random keys");
  console.log("");
  console.log("Elder Futhark rune pool:");
  ELDER_FUTHARK.forEach((rune, i) => {
    process.stdout.write(`  ${i.toString().padStart(2, "0")}: ${rune}`);
    if ((i + 1) % 6 === 0) process.stdout.write("\n");
  });
  if (ELDER_FUTHARK.length % 6 !== 0) process.stdout.write("\n");
}

const input = process.argv[2];

if (!input) {
  printUsage();
  process.exit(1);
}

if (input === "--gen") {
  const count = parseInt(process.argv[3] || "10", 10);
  generateRandom(count);
} else {
  hashSingle(input);
}
