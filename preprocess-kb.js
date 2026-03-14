const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Configuration ─────────────────────────────────────────────────────
const MAKE_ZIP = path.resolve(__dirname, '..', 'OneDrive', 'שולחן העבודה', 'פרויקט', 'מדריך מעשי Make_sources.zip');
const MANYCHAT_ZIP = path.resolve(__dirname, '..', 'OneDrive', 'שולחן העבודה', 'פרויקט', 'מדריך מעשי צ\'אטבוט ManyChat_sources.zip');
const CUSTOM_DIR = path.resolve(__dirname, 'custom-articles');
const NOTEBOOKLM_DIR = path.resolve(__dirname, '_notebooklm_sources');
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
  { id: 'make-guides', name: '📖 מדריכים מעשיים', platform: 'make', match: f => /guide-/.test(f) },
  { id: 'make-recipes', name: '🍳 מתכוני אוטומציה', platform: 'make', match: f => /recipe|מתכון/.test(f) },
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
function readFromDirectory(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const mdFiles = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const file of mdFiles) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    if (content.trim().length > 50) {
      results.push({ name: file, content, size: content.length });
    }
  }
  return results;
}

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

function cleanContent(raw, filename) {
  let text = raw;
  // Remove YAML frontmatter
  text = text.replace(/^---[\s\S]*?---\s*/m, '');
  // Remove UUID lines
  text = text.replace(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\s*$/gm, '');
  // Remove H1 title (first line starting with #)
  text = text.replace(/^#\s+.+$/m, '');
  // Remove filename repeated as first line (common in transcripts)
  if (filename) {
    const baseName = filename.replace(/\.(mp4|m4a|md|pdf)$/gi, '').trim();
    if (baseName.length > 5) {
      text = text.replace(new RegExp('^' + baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'm'), '');
    }
  }
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
    .replace(/\.mp4$/i, '')
    .replace(/\.m4a$/i, '')
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

// Add markdown headers to unstructured transcript content
function addTranscriptStructure(content) {
  // Skip if already has markdown headers
  if (/^##\s/m.test(content)) return content;

  const paragraphs = content.split('\n\n').filter(p => p.trim());
  if (paragraphs.length < 4) return content;

  // Topic detection: keyword → emoji + header
  const TOPIC_RULES = [
    { rx: /חיבור|connection|חשבון|התחבר|מתחבר|הרשאות|credentials|oauth|api.?key|token/i, icon: '🔌', label: 'חיבור והגדרות' },
    { rx: /מודול|module|טריגר|trigger|watch|webhook/i, icon: '🧩', label: 'הגדרת המודולים' },
    { rx: /שגיאה|error|בעיה|נפל|קרס|debug|תקלה|fix/i, icon: '⚠️', label: 'פתרון בעיות' },
    { rx: /פילטר|filter|תנאי|router|נתיב|if.*then/i, icon: '🔀', label: 'לוגיקה ותנאים' },
    { rx: /בדיקה|test|run.?once|הרצ|בודק|נבדוק/i, icon: '✅', label: 'הרצה ובדיקה' },
    { rx: /טיפ|חשוב|שימו לב|זכרו|מומלץ|best.?practice/i, icon: '💡', label: 'טיפים חשובים' },
    { rx: /json|קוד|script|function|פונקצי|נוסחה|formula/i, icon: '💻', label: 'קוד והגדרות' },
    { rx: /GPT|AI|בינה מלאכותית|סוכן|agent|assistant|prompt/i, icon: '🤖', label: 'הגדרת AI' },
    { rx: /whatsapp|ווטסאפ|הודעה|שליחת|greenapi/i, icon: '📱', label: 'שליחת הודעות' },
    { rx: /פייסבוק|facebook|אינסטגרם|instagram|לינקדאין|linkedin|רשת חברתית/i, icon: '📢', label: 'רשתות חברתיות' },
  ];

  function detectTopic(text) {
    for (const rule of TOPIC_RULES) {
      if (rule.rx.test(text)) return rule;
    }
    return null;
  }

  const result = [];
  let lastTopic = null;
  const recentHeaders = []; // track last 3 headers to avoid repetition
  let parasSinceHeader = 0;
  let sectionNum = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const topic = detectTopic(para);

    if (i === 0) {
      result.push('## 📝 סקירה כללית');
      recentHeaders.push('סקירה כללית');
      sectionNum++;
    } else if (topic && topic.label !== (lastTopic && lastTopic.label) && !recentHeaders.includes(topic.label)) {
      // New topic not seen recently
      result.push(`\n## ${topic.icon} ${topic.label}`);
      lastTopic = topic;
      recentHeaders.push(topic.label);
      if (recentHeaders.length > 4) recentHeaders.shift();
      parasSinceHeader = 0;
      sectionNum++;
    } else if (parasSinceHeader >= 5) {
      // Long section without header — add generic continuation
      sectionNum++;
      result.push(`\n## 📋 חלק ${sectionNum}`);
      parasSinceHeader = 0;
    }

    result.push(para);
    parasSinceHeader++;
  }

  return result.join('\n\n');
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

  // Extract files — prefer NotebookLM directory, fall back to ZIP
  let makeFiles, manychatFiles;
  const nbMakeDir = path.join(NOTEBOOKLM_DIR, 'make');
  const nbManychatDir = path.join(NOTEBOOKLM_DIR, 'manychat');

  if (fs.existsSync(nbMakeDir) && fs.readdirSync(nbMakeDir).some(f => f.endsWith('.md'))) {
    console.log('📚 Loading Make.com sources from NotebookLM...');
    makeFiles = readFromDirectory(nbMakeDir);
    console.log(`   ✅ ${makeFiles.length} files loaded`);
  } else {
    console.log('📦 Extracting Make.com sources from ZIP...');
    makeFiles = extractFromZip(MAKE_ZIP);
    console.log(`   ✅ ${makeFiles.length} files extracted`);
  }

  if (fs.existsSync(nbManychatDir) && fs.readdirSync(nbManychatDir).some(f => f.endsWith('.md'))) {
    console.log('📚 Loading ManyChat sources from NotebookLM...');
    manychatFiles = readFromDirectory(nbManychatDir);
    console.log(`   ✅ ${manychatFiles.length} files loaded`);
  } else {
    console.log('📦 Extracting ManyChat sources from ZIP...');
    manychatFiles = extractFromZip(MANYCHAT_ZIP);
    console.log(`   ✅ ${manychatFiles.length} files extracted`);
  }

  // Load custom articles from custom-articles/ directory
  const customFiles = [];
  if (fs.existsSync(CUSTOM_DIR)) {
    const mdFiles = fs.readdirSync(CUSTOM_DIR).filter(f => f.endsWith('.md'));
    for (const file of mdFiles) {
      const content = fs.readFileSync(path.join(CUSTOM_DIR, file), 'utf8');
      customFiles.push({ name: file, content, size: content.length });
    }
    console.log(`📦 Loading custom articles...`);
    console.log(`   ✅ ${customFiles.length} custom articles loaded\n`);
  } else {
    console.log('   ℹ️  No custom-articles/ directory found\n');
  }

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
    ...manychatFiles.map(f => ({ ...f, platform: 'manychat' })),
    ...customFiles.map(f => ({ ...f, platform: 'make' }))
  ];

  console.log(`📝 Processing ${allFiles.length} files...`);

  for (const file of allFiles) {
    const cleaned = cleanContent(file.content, file.name);
    if (cleaned.length < 50) {
      console.log(`   ⏭️  Skipping (too short): ${file.name}`);
      continue;
    }

    // Extract H1 title from content if available, otherwise use filename
    const h1Match = file.content.match(/^#\s+(.+)$/m);
    const rawTitle = h1Match ? h1Match[1].trim() : cleanTitle(file.name);
    // Clean media extensions from title regardless of source
    const title = rawTitle.replace(/[-.](mp4|m4a|audio\.mp4|pdf)$/i, '').trim();
    const category = categorize(file.name, file.platform);
    const articleId = category + '-' + allArticles.length;
    const split = splitIntoParagraphs(cleaned);
    const formatted = addTranscriptStructure(split);
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
