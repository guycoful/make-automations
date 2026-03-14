/**
 * fetch-notebooklm-sources.js
 * Fetches source fulltexts from NotebookLM notebooks and saves as MD files.
 * Replaces the manual ZIP download process.
 *
 * Usage:
 *   node fetch-notebooklm-sources.js           # fetch all (incremental)
 *   node fetch-notebooklm-sources.js --force   # re-fetch everything
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────
const NB_CLI = 'C:/Users/guyco/AppData/Local/Python/pythoncore-3.14-64/Scripts/notebooklm.exe';
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'notebooklm-config.json'), 'utf8'));
const OUT_DIR = path.join(__dirname, '_notebooklm_sources');
const CACHE_FILE = path.join(OUT_DIR, '.cache.json');
const FORCE = process.argv.includes('--force');

// ─── Helpers ────────────────────────────────────────────────────────────
function nb(args) {
  const result = spawnSync(NB_CLI, args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'CLI error');
  }
  // CLI may print "Matched: ..." prefix before JSON — find first { or [
  const out = result.stdout;
  const jsonStart = Math.min(
    out.includes('{') ? out.indexOf('{') : Infinity,
    out.includes('[') ? out.indexOf('[') : Infinity
  );
  return jsonStart < Infinity ? out.slice(jsonStart) : out;
}

function safeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\.(mp4|m4a|audio\.mp4|pdf)$/i, '')
    .replace(/ - Made with Clipchamp/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 120);
}

function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); }
  catch { return {}; }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// ─── Main ────────────────────────────────────────────────────────────────
function main() {
  console.log('🔄 NotebookLM → Knowledge Base Sync\n');

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const cache = FORCE ? {} : loadCache();
  let totalFetched = 0, totalSkipped = 0, totalFailed = 0;

  for (const notebook of CONFIG.notebooks) {
    console.log(`📚 Notebook: ${notebook.name} [${notebook.platform}]`);

    const platformDir = path.join(OUT_DIR, notebook.platform);
    fs.mkdirSync(platformDir, { recursive: true });

    // List all sources
    let sources;
    try {
      const raw = nb(['source', 'list', '--notebook', notebook.id, '--json']);
      sources = JSON.parse(raw).sources;
      console.log(`   Found ${sources.length} sources\n`);
    } catch (e) {
      console.error(`   ❌ Failed to list sources: ${e.message.split('\n')[0]}`);
      continue;
    }

    // Fetch fulltext for each source
    for (const source of sources) {
      if (source.status !== 'ready') {
        console.log(`   ⏭️  Skip (${source.status}): ${source.title.substring(0, 50)}`);
        continue;
      }

      const cacheKey = `${notebook.id}::${source.id}`;
      if (cache[cacheKey] && !FORCE) {
        totalSkipped++;
        continue;
      }

      const filename = safeFilename(source.title) + '.md';
      const outPath = path.join(platformDir, filename);

      try {
        const raw = nb(['source', 'fulltext', source.id, '--notebook', notebook.id, '--json']);
        const data = JSON.parse(raw);

        if (!data.content || data.content.trim().length < 50) {
          console.log(`   ⏭️  Skip (empty): ${source.title.substring(0, 50)}`);
          continue;
        }

        // Save as markdown with title as H1
        const md = `# ${source.title}\n\n${data.content}`;
        fs.writeFileSync(outPath, md, 'utf8');

        cache[cacheKey] = {
          title: source.title,
          fetchedAt: new Date().toISOString(),
          chars: data.content.length
        };
        totalFetched++;
        console.log(`   ✅ ${filename.substring(0, 65)}`);
      } catch (e) {
        console.error(`   ❌ ${source.title.substring(0, 45)} — ${e.message.split('\n')[0]}`);
        totalFailed++;
      }
    }

    console.log('');
  }

  saveCache(cache);

  console.log('─'.repeat(50));
  console.log(`✅ Fetched:  ${totalFetched} new sources`);
  console.log(`⏭️  Skipped:  ${totalSkipped} (cached)`);
  if (totalFailed) console.log(`❌ Failed:   ${totalFailed} sources`);
  console.log(`\n📁 Saved to: ${OUT_DIR}`);
  console.log('▶️  Next step: node preprocess-kb.js');
}

main();
