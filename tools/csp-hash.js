// Recompute the CSP hashes for the inline <style> and <script> in index.html.
// Usage: node tools/csp-hash.js   (run after every edit to either block)
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const file = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(file, "utf8");
const hash = (s) => "sha256-" + crypto.createHash("sha256").update(s, "utf8").digest("base64");

const style = html.match(/<style>([\s\S]*?)<\/style>/);
const script = html.match(/<script>([\s\S]*?)<\/script>/);
if (!style || !script) throw new Error("Could not find the <style> or <script> block");

html = html
  .replace(/style-src '[^']*'/, "style-src '" + hash(style[1]) + "'")
  .replace(/script-src '[^']*'/, "script-src '" + hash(script[1]) + "'");
fs.writeFileSync(file, html);
console.log("style-src  " + hash(style[1]) + "\nscript-src " + hash(script[1]));
