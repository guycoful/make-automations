const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Configuration ─────────────────────────────────────────────────────
const MAKE_ZIP = path.resolve(__dirname, '..', 'OneDrive', 'שולחן העבודה', 'פרויקט', 'מדריך מעשי Make_sources.zip');
const MANYCHAT_ZIP = path.resolve(__dirname, '..', 'OneDrive', 'שולחן העבודה', 'פרויקט', 'מדריך מעשי צ\'אטבוט ManyChat_sources.zip');
const OUT_DIR = __dirname;
const CHUNK_SIZE = 600;   // words per chunk
const CHUNK_OVERLAP = 100; // overlap words

// ─── Hebrew Stop Words ─────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'של', 'את', 'על', 'עם', 'כי', 'אם', 'גם', 'הוא', 'היא', 'זה', 'זו', 'זאת',
  'אלה', 'הם', 'הן', 'לא', 'כן', 'אני', 'אנחנו', 'אתה', 'אתם', 'שלי', 'שלך',
  'שלו', 'שלה', 'שלנו', 'שלהם', 'מה', 'למה', 'איך', 'מתי', 'איפה', 'כמה',
  'אז', 'פה', 'שם', 'בעצם', 'ממש', 'פשוט', 'בגדול', 'ככה', 'כזה', 'כזאת',
  'רגע', 'יש', 'אין', 'היה', 'היו', 'יהיה', 'להיות', 'עוד', 'כל', 'אחד',
  'אחת', 'הרבה', 'קצת', 'מאוד', 'טוב', 'רק', 'כבר', 'עכשיו', 'אותו', 'אותה',
  'אותם', 'שאני', 'שהוא', 'שהיא', 'שזה', 'בסדר', 'בוא', 'בואו', 'נראה',
  'the', 'is', 'a', 'an', 'to', 'in', 'and', 'or', 'for', 'it', 'of', 'on',
  'that', 'this', 'with', 'you', 'we', 'are', 'be', 'have', 'was', 'not'
]);

// ─── Category Rules ────────────────────────────────────────────────────
const CATEGORY_RULES = [
  { id: 'make-connections', name: '🔌 חיבורים ב-Make', platform: 'make', match: f => /חיבור make ל|חיבור והגדרה|חיבורים/.test(f) },
  { id: 'make-functions', name: '⚙️ פונקציות Make', platform: 'make', match: f => /פונקציות/.test(f) },
  { id: 'make-errors', name: '⚠️ ניהול שגיאות', platform: 'make', match: f => /שגיאות|Error|ניהול שגיאות/.test(f) },
  { id: 'make-modules', name: '🧩 מודולים מובנים', platform: 'make', match: f => /מודולים מובנים/.test(f) },
  { id: 'make-data', name: '📦 מבני נתונים', platform: 'make', match: f => /מבני נתונים|מאגרי נתונים|Data Store|JSON|API|Webhook|Mailhook|HTTP|פרסור/.test(f) },
  { id: 'make-routing', name: '🔀 נתיבים ולוגיקה', platform: 'make', match: f => /נתיבים|ראוטר|פילטר|איטרטור|אגרגטור|אופרטורים|לוגיקה/.test(f) },
  { id: 'make-course', name: '🎓 קורס מקיף Make', platform: 'make', match: f => /קורס מקיף MAKE/.test(f) },
  { id: 'make-live', name: '🎬 מפגשי לייב Make', platform: 'make', match: f => /מפגש \d+ מייק|בלייב|הדרכה.*make|הדרכה אוטומציה|הדרכה צ'אטבוט.*make|הדרכה בניית בוט/.test(f) },
  { id: 'make-advanced', name: '🚀 Make מתקדם', platform: 'make', match: f => /Blueprint|שכפול|קליטת לידים|GPT assistant|CRM לניהול|טסט על|תרגול/.test(f) },
  { id: 'make-basics', name: '🔰 יסודות Make', platform: 'make', match: f => /הסבר ופתיחת|ממשק העבודה|סנריו|מבוא ל|מה זה אפיון|צ׳קליסט לבניית|דוגמה לסנריו/.test(f) },
  { id: 'manychat-connections', name: '🔌 חיבורי ManyChat', platform: 'manychat', match: f => /מחברים בין/.test(f) },
  { id: 'manychat-bots', name: '🤖 בניית בוטים', platform: 'manychat', match: f => /צ׳אטבוט|צ'אטבוט|דוגמה ל/.test(f) },
  { id: 'manychat-course', name: '🎓 קורס ManyChat', platform: 'manychat', match: f => /קורס manychat|בוט וואטסאפ manychat/.test(f) },
  { id: 'manychat-advanced', name: '🚀 ManyChat מתקדם', platform: 'manychat', match: f => /שליחת רצף|תפוצות|אינטגרציות|חוק הספאם|WhatsApp|Official|צ'קליסט/.test(f) },
  { id: 'manychat-basics', name: '🔰 יסודות ManyChat', platform: 'manychat', match: f => /מאניצ׳אט|מאניצ'אט|פותחים חשבון|מושגי מערכת|סוגי חוליות|מוצר וחבילות|חודש ראשון|טקסט/.test(f) },
];

// ─── Helpers ────────────────────────────────────────────────────────────
function extractFromZip(zipPath) {
  const listCmd = `unzip -l "${zipPath}"`;
  const listOutput = execSync(listCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const files = [];
  for (const line of listOutput.split('\n')) {
    const match = line.match(/^\s*(\d+)\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}\s+(.+\.md)$/);
    if (match) files.push({ size: parseInt(match[1]), name: match[2] });
  }

  const results = [];
  for (const file of files) {
    try {
      const content = execSync(`unzip -p "${zipPath}" "${file.name}"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
      results.push({ name: file.name, content, size: file.size });
    } catch (e) {
      console.error(`  ⚠️ Failed to extract: ${file.name}`);
    }
  }
  return results;
}

function cleanContent(raw) {
  let text = raw;
  // Remove YAML frontmatter
  text = text.replace(/^---[\s\S]*?---\s*/m, '');
  // Remove UUID lines
  text = text.replace(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\s*$/gm, '');
  // Remove H1 title (first line starting with #)
  text = text.replace(/^#\s+.+$/m, '');
  // Remove image URLs
  text = text.replace(/https?:\/\/lh\d+\.googleusercontent\.com\/[^\s]+/g, '');
  // Clean up multiple newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

function cleanTitle(filename) {
  return filename
    .replace(/-audio\.mp4\.md$/i, '')
    .replace(/\.mp4\.md$/i, '')
    .replace(/\.m4a\.md$/i, '')
    .replace(/\.md$/i, '')
    .replace(/\.pdf$/i, '')
    .replace(/ \(\d+\)$/, '')
    .replace(/ - Made with Clipchamp/i, '')
    .trim();
}

function categorize(filename, platform) {
  for (const rule of CATEGORY_RULES) {
    if (rule.platform === platform && rule.match(filename)) {
      return rule.id;
    }
  }
  return platform === 'make' ? 'make-basics' : 'manychat-basics';
}

function splitIntoParagraphs(text) {
  // Split on sentence endings followed by topic shifts
  const topicMarkers = /(?<=\.)\s+(?=עכשיו |הדבר הבא|בואו |אז בגדול|הדבר |בנוגע |נעבור |ניכנס |בשיעור |הדף |כאן |מכאן |יש לנו |אפשר )/g;
  let result = text.replace(topicMarkers, '\n\n');

  // Also split very long paragraphs (>500 chars) at sentence boundaries
  const paragraphs = result.split('\n\n');
  const finalParagraphs = [];
  for (const p of paragraphs) {
    if (p.length > 800) {
      const sentences = p.split(/(?<=[.!?])\s+/);
      let current = '';
      for (const s of sentences) {
        if (current.length + s.length > 500 && current.length > 100) {
          finalParagraphs.push(current.trim());
          current = s;
        } else {
          current += (current ? ' ' : '') + s;
        }
      }
      if (current.trim()) finalParagraphs.push(current.trim());
    } else if (p.trim()) {
      finalParagraphs.push(p.trim());
    }
  }
  return finalParagraphs.join('\n\n');
}

function generateSummary(content, title) {
  const words = content.split(/\s+/).slice(0, 100).join(' ');
  // Simple extractive summary: first ~100 words, cleaned up
  const firstSentences = words.match(/[^.!?]+[.!?]/g);
  if (firstSentences && firstSentences.length >= 2) {
    return firstSentences.slice(0, 2).join(' ').trim();
  }
  return words.substring(0, 200).trim() + '...';
}

function generateTakeaways(content, title) {
  const takeaways = [];
  // Extract key phrases that look like instructions or definitions
  const patterns = [
    /(?:צריך|חשוב|חובה|דורש|צריכים)\s+[^.!?]{10,60}[.!?]/g,
    /(?:אפשר|ניתן|יכול)\s+[^.!?]{10,60}[.!?]/g,
    /(?:זאת אומרת|מה שזה אומר|בעצם)\s+[^.!?]{10,60}[.!?]/g,
  ];
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const m of matches.slice(0, 2)) {
        takeaways.push(m.trim());
      }
    }
    if (takeaways.length >= 4) break;
  }
  if (takeaways.length === 0) {
    takeaways.push(`מדריך על ${title}`);
  }
  return takeaways.slice(0, 5);
}

function tokenize(text) {
  const hebrewPrefixes = /^[בלמכהושו]{1,2}/;
  return text.toLowerCase()
    .replace(/[^\u0590-\u05FEa-z0-9\s\-]/g, ' ')
    .split(/\s+/)
    .map(t => {
      // Strip common Hebrew prefixes for better matching
      if (t.length > 3 && /[\u0590-\u05FE]/.test(t)) {
        const stripped = t.replace(hebrewPrefixes, '');
        if (stripped.length >= 2) return stripped;
      }
      return t;
    })
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

function chunkText(text, articleId, category, title) {
  const words = text.split(/\s+/);
  const chunks = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < words.length) {
    const end = Math.min(start + CHUNK_SIZE, words.length);
    const chunkText = words.slice(start, end).join(' ');
    const tokens = tokenize(chunkText);
    const keywords = [...new Set(tokens)].slice(0, 30);

    chunks.push({
      id: `${articleId}-${chunkIndex}`,
      articleId,
      category,
      title,
      chunkIndex,
      text: chunkText,
      keywords
    });

    chunkIndex++;
    start = end - CHUNK_OVERLAP;
    if (end >= words.length) break;
  }

  return chunks;
}

function buildBM25Index(allChunks) {
  const terms = {};
  let totalLength = 0;

  // Use numeric indices instead of string IDs to save space
  for (let ci = 0; ci < allChunks.length; ci++) {
    const tokens = tokenize(allChunks[ci].text);
    totalLength += tokens.length;
    const termFreq = {};
    for (const t of tokens) {
      termFreq[t] = (termFreq[t] || 0) + 1;
    }
    for (const [term, tf] of Object.entries(termFreq)) {
      if (!terms[term]) terms[term] = { df: 0, postings: [] };
      terms[term].df++;
      terms[term].postings.push([ci, tf]); // [chunkIndex, termFrequency]
    }
  }

  // Prune: keep terms in 2+ docs, 3+ chars, not in >50% of docs
  const prunedTerms = {};
  for (const [term, data] of Object.entries(terms)) {
    if (data.df >= 2 && term.length >= 3 && data.df < allChunks.length * 0.5) {
      // Compact: [docFreq, [chunkIdx, tf], [chunkIdx, tf], ...]
      prunedTerms[term] = [data.df, ...data.postings.flat()];
    }
  }

  return {
    avgDocLength: Math.round(totalLength / allChunks.length),
    totalDocs: allChunks.length,
    terms: prunedTerms
  };
}

function findRelatedTemplateApps(content, title) {
  const appNames = [
    'Gmail', 'Google Sheets', 'Google Drive', 'Google Calendar', 'Google Forms',
    'Airtable', 'Slack', 'Notion', 'Telegram', 'WhatsApp', 'Discord',
    'OpenAI', 'ChatGPT', 'Claude', 'Facebook', 'Instagram', 'LinkedIn',
    'Monday', 'Trello', 'HubSpot', 'Mailchimp', 'Shopify', 'Stripe',
    'Webhook', 'HTTP', 'RSS', 'Calendly', 'Zoom', 'WordPress',
    'ManyChat', 'Twilio', 'TikTok', 'Fireberry', 'Prospero', 'Gemini'
  ];
  const found = [];
  const searchText = (title + ' ' + content).toLowerCase();
  for (const app of appNames) {
    if (searchText.includes(app.toLowerCase())) {
      found.push(app);
    }
  }
  return found;
}

// ─── Main Pipeline ──────────────────────────────────────────────────────
function main() {
  console.log('🚀 Starting Knowledge Base preprocessing...\n');

  // Extract files
  console.log('📦 Extracting Make.com sources...');
  const makeFiles = extractFromZip(MAKE_ZIP);
  console.log(`   ✅ ${makeFiles.length} files extracted`);

  console.log('📦 Extracting ManyChat sources...');
  const manychatFiles = extractFromZip(MANYCHAT_ZIP);
  console.log(`   ✅ ${manychatFiles.length} files extracted\n`);

  const allArticles = [];
  const allChunks = [];
  const categoryMap = {};

  // Initialize category counts
  for (const rule of CATEGORY_RULES) {
    categoryMap[rule.id] = { ...rule, count: 0 };
  }

  // Process all files
  const allFiles = [
    ...makeFiles.map(f => ({ ...f, platform: 'make' })),
    ...manychatFiles.map(f => ({ ...f, platform: 'manychat' }))
  ];

  console.log(`📝 Processing ${allFiles.length} files...`);

  for (const file of allFiles) {
    const cleaned = cleanContent(file.content);
    if (cleaned.length < 50) {
      console.log(`   ⏭️  Skipping (too short): ${file.name}`);
      continue;
    }

    const title = cleanTitle(file.name);
    const category = categorize(file.name, file.platform);
    const articleId = category + '-' + allArticles.length;
    const formatted = splitIntoParagraphs(cleaned);
    const wordCount = formatted.split(/\s+/).length;
    const summary = generateSummary(formatted, title);
    const takeaways = generateTakeaways(formatted, title);
    const relatedApps = findRelatedTemplateApps(formatted, title);

    const article = {
      id: articleId,
      title,
      category,
      platform: file.platform,
      summary,
      takeaways,
      wordCount,
      content: formatted,
      relatedApps
    };

    allArticles.push(article);
    if (categoryMap[category]) categoryMap[category].count++;

    // Chunk for RAG
    const chunks = chunkText(formatted, articleId, category, title);
    allChunks.push(...chunks);
  }

  console.log(`   ✅ ${allArticles.length} articles processed`);
  console.log(`   ✅ ${allChunks.length} chunks created\n`);

  // Category summary
  console.log('📊 Categories:');
  for (const [id, cat] of Object.entries(categoryMap)) {
    if (cat.count > 0) console.log(`   ${cat.name}: ${cat.count} articles`);
  }
  console.log('');

  // Build BM25 index
  console.log('🔍 Building BM25 search index...');
  const index = buildBM25Index(allChunks);
  console.log(`   ✅ ${Object.keys(index.terms).length} terms indexed\n`);

  // Generate metadata (lightweight)
  const meta = allArticles.map(a => ({
    id: a.id,
    title: a.title,
    category: a.category,
    platform: a.platform,
    summary: a.summary,
    wordCount: a.wordCount,
    relatedApps: a.relatedApps
  }));

  // Write output files
  console.log('💾 Writing output files...');

  const articlesJson = JSON.stringify(allArticles, null, 0);
  fs.writeFileSync(path.join(OUT_DIR, 'kb-articles.json'), articlesJson);
  console.log(`   ✅ kb-articles.json (${(articlesJson.length / 1024).toFixed(0)}KB)`);

  const chunksJson = JSON.stringify(allChunks, null, 0);
  fs.writeFileSync(path.join(OUT_DIR, 'kb-chunks.json'), chunksJson);
  console.log(`   ✅ kb-chunks.json (${(chunksJson.length / 1024).toFixed(0)}KB)`);

  const indexJson = JSON.stringify(index, null, 0);
  fs.writeFileSync(path.join(OUT_DIR, 'kb-index.json'), indexJson);
  console.log(`   ✅ kb-index.json (${(indexJson.length / 1024).toFixed(0)}KB)`);

  const metaJson = JSON.stringify(meta, null, 0);
  fs.writeFileSync(path.join(OUT_DIR, 'kb-meta.json'), metaJson);
  console.log(`   ✅ kb-meta.json (${(metaJson.length / 1024).toFixed(0)}KB)`);

  console.log('\n🎉 Done! All files generated successfully.');
}

main();
