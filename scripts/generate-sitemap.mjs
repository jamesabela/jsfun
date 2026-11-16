#!/usr/bin/env node
/**
 * Generates sitemap.xml for https://jamesabela.github.io/jsfun/
 * Includes root-level HTML pages (excluding search-engine verification files)
 * and HTML pages inside folders linked from index.html (including usefulresources.json)
 * or pythoncopy.html.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://jamesabela.github.io/jsfun';
const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const ENTRY_HTML_FILES = ['index.html', 'pythoncopy.html'];
const VERIFICATION_FILE_RE = /^google[a-f0-9]+\.html$/i;

function normalizeLocalRef(rawRef) {
  if (!rawRef || typeof rawRef !== 'string') return null;
  let ref = rawRef.trim();
  if (ref.startsWith(BASE_URL)) {
    ref = ref.slice(BASE_URL.length);
  } else if (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith('//')) {
    return null;
  }
  ref = ref.split('#')[0].split('?')[0].replace(/^\/+/, '');
  return ref || null;
}

function extractRefsFromHtml(html) {
  const refs = [];
  const attrRe = /\b(?:href|src|data-url)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrRe)) {
    refs.push(match[1]);
  }
  return refs;
}

function extractRefsFromResourcesJson(jsonPath) {
  if (!fs.existsSync(jsonPath)) return [];
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const refs = [];
  const walk = (node) => {
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
    } else if (node && typeof node === 'object') {
      if (typeof node.url === 'string') refs.push(node.url);
      for (const value of Object.values(node)) walk(value);
    }
  };
  walk(data);
  return refs;
}

function discoverLinkedFolders() {
  const rawRefs = [];
  for (const file of ENTRY_HTML_FILES) {
    const fullPath = path.join(ROOT_DIR, file);
    if (fs.existsSync(fullPath)) {
      rawRefs.push(...extractRefsFromHtml(fs.readFileSync(fullPath, 'utf8')));
    }
  }
  rawRefs.push(...extractRefsFromResourcesJson(path.join(ROOT_DIR, 'usefulresources.json')));

  const linkedFolders = new Set();
  for (const rawRef of rawRefs) {
    const localRef = normalizeLocalRef(rawRef);
    if (!localRef || !localRef.includes('/')) continue;
    const topFolder = decodeURIComponent(localRef.split('/')[0]);
    const folderPath = path.join(ROOT_DIR, topFolder);
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      linkedFolders.add(topFolder);
    }
  }
  return [...linkedFolders].sort();
}

function collectHtmlFiles(dirPath, relPrefix = '') {
  const results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const relPath = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(fullPath, relPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(relPath);
    }
  }
  return results;
}

function getLastMod(relPath) {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', relPath],
      { cwd: ROOT_DIR, encoding: 'utf8' }
    ).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    // Fall back to filesystem mtime if git history is unavailable.
  }
  const stat = fs.statSync(path.join(ROOT_DIR, relPath));
  return stat.mtime.toISOString().slice(0, 10);
}

function escapeXml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildSitemap() {
  const linkedFolders = discoverLinkedFolders();

  const rootHtmlFiles = fs
    .readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.html') &&
        !VERIFICATION_FILE_RE.test(entry.name)
    )
    .map((entry) => entry.name)
    .sort();

  const folderHtmlFiles = linkedFolders
    .flatMap((folder) => collectHtmlFiles(path.join(ROOT_DIR, folder), folder))
    .sort();

  const allFiles = [
    'index.html',
    ...rootHtmlFiles.filter((f) => f !== 'index.html'),
    ...folderHtmlFiles,
  ];

  const urlEntries = allFiles.map((relPath) => {
    const loc =
      relPath === 'index.html'
        ? `${BASE_URL}/`
        : `${BASE_URL}/${relPath.split('/').map(encodeURIComponent).join('/')}`;
    const lastmod = getLastMod(relPath);
    return [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '  </url>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlEntries,
    '</urlset>',
    '',
  ].join('\n');

  const outPath = path.join(ROOT_DIR, 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');

  console.log(`Generated sitemap.xml with ${allFiles.length} URLs.`);
  console.log(`Root pages: ${rootHtmlFiles.length}`);
  console.log(`Linked folders included (${linkedFolders.length}): ${linkedFolders.join(', ')}`);
}

buildSitemap();
