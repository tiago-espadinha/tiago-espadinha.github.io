#!/usr/bin/env node
/**
 * Checks that every language has its text, so new content can't ship in
 * English only.
 *
 *   npm run locales
 *
 * It fails when:
 *   - a { en, pt } entry is missing a language, or one is empty
 *   - the languages of an entry use different {placeholders}
 *   - a field that must be translated (FIELDS below) is a plain string
 *   - index.html (data-i18n) or a script (ui.x.y) uses a UI key that
 *     content/ui.js does not have
 *   - a CV path in content/contact.js points at a file that doesn't exist
 *
 * Each problem is printed with its path, e.g. projects[2].detail: missing "pt".
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { cv } from "../content/cv.js";
import * as contentModule from "../content/index.js";
import { LOCALES, lookup } from "../js/lib/i18n.js";

// A plain object, so sections can be looked up by name. The CV-only content
// is checked too, though the site doesn't load it.
const content = { ...contentModule, cv };
const ROOT = new URL("..", import.meta.url).pathname;

// Fields that hold prose and so must be { en, pt }. `*` matches any array
// index or object key; a trailing `?` marks a field that may be left out.
const FIELDS = {
  projects: ["*.summary", "*.detail", "*.liveLabel", "*.images.*.alt", "*.cv?"],
  work: ["*.title", "*.description", "*.cv?"],
  education: ["*.title", "*.description?", "*.cv?"],
  toolkit: ["*.label"],
  contact: ["note"],
  cv: ["city", "headings.*", "dates.*", "skills.*.label", "workshops.*"],
};

const problems = [];

const isLocalized = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).some((key) => LOCALES.includes(key));

const placeholders = (text) =>
  [...text.matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .toSorted()
    .join(",");

/** Every { en, pt } entry anywhere in the content must be complete. */
function checkEntries(value, path) {
  if (isLocalized(value)) {
    const present = LOCALES.filter(
      (tag) => typeof value[tag] === "string" && value[tag].trim(),
    );
    LOCALES.filter((tag) => !present.includes(tag)).forEach((tag) =>
      problems.push(`${path}: missing "${tag}"`),
    );
    const sets = new Set(present.map((tag) => placeholders(value[tag])));
    if (sets.size > 1)
      problems.push(`${path}: languages use different {placeholders}`);
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) =>
      checkEntries(
        child,
        Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`,
      ),
    );
  }
}

/** Values at a FIELDS pattern, with their printable paths. */
function select(value, parts, path) {
  if (!parts.length) return [[path, value]];
  const [part, ...rest] = parts;
  if (part === "*") {
    return Object.entries(value ?? {}).flatMap(([key, child]) =>
      select(
        child,
        rest,
        Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`,
      ),
    );
  }
  return select(value?.[part], rest, `${path}.${part}`);
}

function checkFields() {
  Object.entries(FIELDS).forEach(([name, patterns]) => {
    patterns.forEach((pattern) => {
      const optional = pattern.endsWith("?");
      const parts = pattern.replace(/\?$/, "").split(".");
      select(content[name], parts, name).forEach(([path, value]) => {
        if (optional && value === undefined) return;
        if (!isLocalized(value))
          problems.push(`${path}: needs { ${LOCALES.join(", ")} }`);
      });
    });
  });
  // Everything in ui.js is interface text.
  (function walk(value, path) {
    if (isLocalized(value)) return;
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, child]) =>
        walk(child, `${path}.${key}`),
      );
    } else {
      problems.push(`${path}: needs { ${LOCALES.join(", ")} }`);
    }
  })(content.ui, "ui");
}

/** UI keys used by index.html and the scripts must exist in ui.js. */
function checkUiKeys() {
  const html = readFileSync(join(ROOT, "index.html"), "utf8");
  const keys = [
    ...[...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => [
      "index.html",
      m[1],
    ]),
    ...[...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((m) =>
      m[1].split(";").map((pair) => ["index.html", pair.split(":")[1]?.trim()]),
    ),
  ];
  readdirSync(join(ROOT, "js"), {
    recursive: true,
  })
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      const source = readFileSync(join(ROOT, "js", file), "utf8");
      // `ui.form.send`, but not the `content/ui.js` import path.
      [...source.matchAll(/(?<![\w./$])ui((?:\.\w+)+)/g)].forEach((m) =>
        keys.push([`js/${file}`, m[1].slice(1)]),
      );
    });
  keys.forEach(([file, key]) => {
    if (!isLocalized(lookup(content.ui, key ?? ""))) {
      problems.push(
        `${file}: UI key "${key}" is not a { ${LOCALES.join(", ")} } entry in content/ui.js`,
      );
    }
  });
}

function checkCvFiles() {
  const pdf = content.contact.cv;
  if (!pdf) return;
  LOCALES.forEach((tag) => {
    const file = typeof pdf === "string" ? pdf : pdf[tag];
    if (file && !existsSync(join(ROOT, file)))
      problems.push(`contact.cv.${tag}: ${file} does not exist`);
  });
}

Object.entries(content).forEach(([name, value]) => checkEntries(value, name));
checkFields();
checkUiKeys();
checkCvFiles();

if (problems.length) {
  console.error(`Locales: ${problems.length} problem(s)\n`);
  problems.forEach((problem) => console.error(`  ${problem}`));
  console.error(
    "\nAdd the missing text next to the English (see docs/CONTENT.md).",
  );
  process.exit(1);
}
console.log(`Locales: ${LOCALES.join(", ")} complete.`);
