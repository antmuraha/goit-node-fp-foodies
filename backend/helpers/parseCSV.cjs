"use strict";

const { readFileSync } = require("node:fs");
const { join } = require("node:path");

/**
 * Reads a CSV file from backend/data/ and returns an array of objects
 * keyed by the header row. Handles quoted fields with embedded commas,
 * newlines, and escaped double-quotes ("").
 */
function loadCSV(filename) {
  const filePath = join(__dirname, "..", "data", filename);
  const content = readFileSync(filePath, "utf8");
  return parseCSV(content);
}

function parseCSV(content) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];

    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          // escaped quote
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (ch === "\r") {
        // skip CR in CRLF
      } else {
        field += ch;
      }
    }
  }

  // last row / trailing field
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((f) => f !== "")) rows.push(row);
  }

  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] !== undefined ? r[i] : "";
    });
    return obj;
  });
}

module.exports = { loadCSV };
