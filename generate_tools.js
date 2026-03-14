const fs = require('fs');
const articles = require('./kb-articles.json');
const allText = articles.map(a => a.content).join(' ');

const tools = [];
const seen = new Set();

function add(names, search) {
  const key = names[0];
  if (seen.has(key)) return;
  seen.add(key);
  tools.push({ names: names.filter(n => n.length >= 2), search });
}

// ═══════════════════════════════════════════════════════════════
// PART 1: HARDCODED TOOLS — tools with known Hebrew aliases
//         that appear in notebooks with transliteration variants
// ═══════════════════════════════════════════════════════════════

// -- Automation --
add(['make', 'מייק', 'meyk', 'מיק', 'מייקר'], 'make מייק אוטומציה סנריו סצנריו');
add(['make.com'], 'make.com מייק אוטומציה');
add(['manychat', 'מאניצאט', 'מאניצ׳אט', 'מניצאט', 'מניצ׳ט', 'מיניצאט', 'מניצ׳אט'], 'manychat מאניצאט צאטבוט בוט');
add(['zapier', 'זאפייר'], 'zapier זאפייר אוטומציה');
add(['n8n'], 'n8n אוטומציה');
add(['pabbly', 'פאבלי'], 'pabbly פאבלי אוטומציה');
add(['integromat', 'אינטגרומט'], 'integromat make אוטומציה');

// -- Make concepts --
add(['webhook', 'ובהוק', 'וובהוק', 'ווב הוק'], 'webhook ובהוק טריגר');
add(['scenario', 'סנריו', 'סצנריו'], 'סנריו סצנריו scenario תרחיש');
add(['trigger', 'טריגר'], 'טריגר trigger watch');
add(['module', 'מודול'], 'מודול module פעולה');
add(['filter', 'פילטר'], 'פילטר filter תנאי');
add(['router', 'ראוטר'], 'ראוטר router נתיב');
add(['iterator', 'איטרטור'], 'איטרטור iterator מערך');
add(['aggregator', 'אגרגטור'], 'אגרגטור aggregator איחוד');
add(['blueprint', 'בלופרינט'], 'בלופרינט blueprint ייצוא ייבוא');
add(['datastore', 'דאטאסטור', 'דטהסטור', 'דטא סטור'], 'דאטאסטור datastore מאגר נתונים');
add(['connection', 'קונקשן'], 'קונקשן connection חיבור');
add(['dashboard', 'דשבורד', 'דשבורדים'], 'דשבורד dashboard לוח בקרה');
add(['template', 'טמפלייט'], 'טמפלייט template תבנית');
add(['integration', 'אינטגרציה'], 'אינטגרציה integration חיבור');
add(['automation', 'אוטומציה', 'אוטומציות'], 'אוטומציה automation תהליך');
add(['error handler'], 'error handler שגיאה טיפול');
add(['run once'], 'run once הרצה בדיקה');
add(['execution', 'אקזקיושן'], 'execution הרצה');
add(['operations', 'אופרציות'], 'operations פעולות');
add(['scheduling', 'שדיולינג'], 'scheduling תזמון');

// -- CRM --
add(['monday', 'מאנדיי'], 'monday מאנדיי crm ניהול לקוחות');
add(['monday.com'], 'monday.com מאנדיי crm');
add(['airtable', 'אירטייבל', 'אייר טייבל'], 'airtable אירטייבל טבלה בסיס נתונים');
add(['fireberry', 'פיירברי'], 'fireberry פיירברי crm');
add(['hubspot', 'האבספוט'], 'hubspot האבספוט crm שיווק');
add(['pipedrive', 'פייפדרייב'], 'pipedrive crm מכירות');
add(['salesforce', 'סיילספורס'], 'salesforce crm');
add(['clickup', 'קליקאפ'], 'clickup קליקאפ ניהול פרויקטים');
add(['zoho', 'זוהו'], 'zoho crm');
add(['crm'], 'crm ניהול לקוחות מערכת');

// -- Proposals --
add(['prospero', 'פרוספרו', 'פרוספירו', 'לפוספרו'], 'prospero פרוספרו הצעת מחיר proposal');
add(['pandadoc', 'פנדהדוק'], 'pandadoc פנדהדוק חתימה דיגיטלית');

// -- Communication --
add(['whatsapp', 'ווטסאפ', 'וואטסאפ', 'ואטסאפ', 'ווצאפ', 'ווטס אפ'], 'whatsapp וואטסאפ ווטסאפ הודעה');
add(['gmail', 'גימייל', 'ג׳ימייל', 'ג׳מייל'], 'gmail גימייל מייל אימייל');
add(['telegram', 'טלגרם'], 'telegram טלגרם בוט הודעה');
add(['twilio', 'טוויליו'], 'twilio טוויליו sms הודעה');
add(['slack', 'סלאק'], 'slack סלאק הודעה ערוץ');
add(['secnum', 'סקנאם'], 'secnum סקנאם מספר טלפון');
add(['cellact', 'צלאקט'], 'cellact sms');
add(['messagebird'], 'messagebird sms');
add(['messenger', 'מסנג׳ר'], 'messenger מסנג׳ר פייסבוק');
add(['sms'], 'sms הודעה טקסט');

// -- Social --
add(['linkedin', 'לינקדאין', 'לינקדין'], 'linkedin לינקדאין רשת חברתית פרופיל');
add(['instagram', 'אינסטגרם', 'אינסטגראם', 'אינסטה'], 'instagram אינסטגרם רשת חברתית פוסט');
add(['facebook', 'פייסבוק', 'פיסבוק'], 'facebook פייסבוק דף עסקי פוסט מודעה');
add(['tiktok', 'טיקטוק'], 'tiktok טיקטוק סרטון');
add(['twitter', 'טוויטר'], 'twitter טוויטר ציוץ');
add(['youtube', 'יוטיוב'], 'youtube יוטיוב סרטון');
add(['meta', 'מטא'], 'meta מטא פייסבוק אינסטגרם business');

// -- AI --
add(['openai', 'אופנאיי'], 'openai GPT בינה מלאכותית AI');
add(['chatgpt', 'צאטגיפיטי', 'צאטג׳יפיטי', 'צ׳אטגיפיטי'], 'chatgpt GPT בינה מלאכותית סוכן');
add(['gpt'], 'gpt GPT בינה מלאכותית');
add(['claude', 'קלוד'], 'claude AI בינה מלאכותית');
add(['gemini', 'גמיני', 'ג׳מיני'], 'gemini google AI בינה מלאכותית');
add(['fastbots', 'פסטבוטס', 'פאסטבוטס'], 'fastbots פסטבוטס צאטבוט AI');
add(['prompt', 'פרומפט', 'פרומפטים'], 'פרומפט prompt הנחיה AI');
add(['ai', 'בינה מלאכותית'], 'ai בינה מלאכותית artificial intelligence');

// -- Google --
add(['google', 'גוגל'], 'google גוגל');
add(['google sheets', 'גוגל שיטס', 'שיטס'], 'google sheets גיליון טבלה שיטס');
add(['google drive', 'גוגל דרייב', 'דרייב'], 'google drive קובץ תיקייה דרייב');
add(['google calendar', 'גוגל קלנדר'], 'google calendar יומן אירוע');
add(['google forms', 'גוגל פורמס'], 'google forms טופס תשובה');

// -- Scheduling --
add(['calendly', 'קלנדלי'], 'calendly קלנדלי פגישה יומן');
add(['fillout', 'פילאאוט', 'פילאוט'], 'fillout פילאאוט טופס שאלון');
add(['jotform', 'ג׳וטפורם', 'ג׳ט פורם'], 'jotform טופס שאלון');
add(['typeform', 'טייפפורם'], 'typeform טופס שאלון');
add(['zoom', 'זום'], 'zoom זום פגישה וידאו');

// -- WhatsApp --
add(['greenapi', 'גרין', 'green api', 'גרין אייפיאי'], 'greenapi גרין whatsapp וואטסאפ לא רשמי');

// -- Web --
add(['wordpress', 'וורדפרס'], 'wordpress וורדפרס אתר בלוג');
add(['shopify', 'שופיפיי'], 'shopify שופיפיי חנות מכירות');
add(['wix', 'וויקס'], 'wix וויקס אתר דף נחיתה');
add(['elementor', 'אלמנטור'], 'elementor אלמנטור דף נחיתה');

// -- Productivity --
add(['notion', 'נושן'], 'notion נושן דף בסיס נתונים');
add(['trello', 'טרלו'], 'trello טרלו כרטיס לוח');
add(['miro', 'מירו'], 'miro מירו לוח אפיון שרטוט');
add(['canva', 'קנבה'], 'canva קנבה עיצוב');
add(['loom', 'לום'], 'loom לום סרטון הסבר');
add(['todoist', 'טודואיסט'], 'todoist משימה');
add(['dropbox', 'דרופבוקס'], 'dropbox דרופבוקס קובץ');
add(['onedrive'], 'onedrive קובץ');
add(['asana', 'אסנה'], 'asana אסנה ניהול פרויקטים');

// -- Payments --
add(['stripe', 'סטרייפ'], 'stripe סטרייפ תשלום');
add(['paypal', 'פייפל'], 'paypal פייפל תשלום');
add(['mailchimp', 'מיילצימפ'], 'mailchimp מיילצימפ דיוור אימייל');

// -- Other tools mentioned in courses --
add(['timeless'], 'timeless תמלול פגישה');
add(['timeos'], 'timeos תמלול');
add(['clipchamp'], 'clipchamp עריכת וידאו');

// ═══════════════════════════════════════════════════════════════
// PART 2: AUTO-EXTRACTED — scan KB for all unique terms
// ═══════════════════════════════════════════════════════════════

// Extract ALL English proper nouns / tool names from KB
const enWords = {};
for (const m of allText.match(/[A-Z][a-zA-Z]{2,}/g) || []) {
  const l = m.toLowerCase();
  enWords[l] = (enWords[l] || 0) + 1;
}
for (const m of allText.match(/\b[A-Z]{2,8}\b/g) || []) {
  const l = m.toLowerCase();
  enWords[l] = (enWords[l] || 0) + 1;
}

const skipEn = new Set('the and for with that this from have not are was been will can has all but you your one our out new get set add use how now let run put may too two any own way try see say did got per via yet had old big low top end day key lot ago yes app url pdf api css html json true false null data type name text content value role system user status error click page link button form list item input send time step next test save edit delete create update read write open close search filter sort group view show hide start stop watch check select choose enter submit upload download copy move file folder table field column row cell image video audio email phone date number string array object function module action trigger scenario connection route flow body header method request response result output message notification alert model token prompt assistant chat query index chunk score term count size length width height color font border margin padding round icon label title description summary category platform version note comment setting option config param event hook callback handler warning info debug log code script style class element component state effect ref prop render return export import const async await then catch finally throw promise fetch timeout interval map reduce find some every include join split replace match trim push pop shift splice slice sort reverse keys values entries assign freeze parse stringify encode decode format floor ceil random abs min max sqrt pow math here what when where would could should about their there which these those them into more than also been each other first last only very like just over such after before between same back down still well tell take came come look want give most another know think hand made part long great right call world mean help target source options disable enable custom ignore standard limit rate generate convert access instance personal records record account admin tools domain base template board history navigate authentication people connected pipeline sales boards leads single invalid creator keyword comments items numbers multiple answers default handling executions many final confirm templates agency columns assignee notes formula'.split(' '));

// Add English terms with 3+ occurrences that we don't already have
for (const [term, count] of Object.entries(enWords)) {
  if (count >= 3 && term.length >= 3 && !skipEn.has(term) && !seen.has(term)) {
    add([term], term);
  }
}

// Extract Hebrew technical/domain terms (transliterations and concepts)
const heWords = {};
for (const m of allText.match(/[\u0590-\u05FF]{4,15}/g) || []) {
  heWords[m] = (heWords[m] || 0) + 1;
}

const skipHe = new Set('שלנו שלכם שלהן ישנו ישנם ישנה לנו לעשות ואז יותר לכם אוקיי יכולים שיש משהו רוצים כאילו חלק ואני איזשהו לראות דברים אומרת איזה שוב נעשה שימו באמת האם מיני לזה צריכים אחר שאתם חשוב הבא הכל פעם שלא הדברים להשתמש במקרה להוסיף ואנחנו בדיוק הדבר מספר הכי קורה לשלוח ליצור חדש שנקרא קודם בצורה ויש ברגע סתם לבנות לפי מייל תמיד הזאתי לתת דוגמה שאלה שבעצם והגדרות לעבוד לקבל מעולה לשים האלה בתוך לדוגמה הלקוח כמובן נכון שיהיה אותי התהליך להבין בשביל הראשון בשיעור אולי בסוף הגדרת להגיד להגדיר שאתה המערכת אנשים ללקוח איזשהיא לקחת מידע אעשה לחבר שנייה תודה ובעצם חשובים שאלות שלכם כרגע תהליך ההודעה הייתי נלחץ משתמש נקרא לבחור לדבר איתו שצריך לדעת יופי בדרך ארצה פעמים קובץ נתונים אלחץ המון חברים העניין באופן מתוך אפילו פחות המידע שואל ועכשיו אראה עצמו קיים מסוים לוחץ לשאול אחרת לעבור תראו במערכת לצורך סבבה סליחה בהמשך יודעים מישהו בכלל אוכל אוהב נתחיל כנראה נוסף נניח כמות וזהו לפעמים אחלה עדיין מבחינת להעביר ללחוץ פרטים לכתוב במקום שליחת כללית נכנס ממנו נרצה איזשהי ללכת וכולי לבצע למשל שעות משתנה להתחיל הזאת לקוחות המספר מערכת חיבור הודעה הודעות גוגל שלהם בשיעורים אנחנו אתם'.split(' '));

// Add Hebrew terms with 10+ occurrences, 4+ chars, not stopwords
for (const [term, count] of Object.entries(heWords)) {
  if (count >= 10 && term.length >= 4 && !skipHe.has(term) && !seen.has(term)) {
    add([term], term);
  }
}

console.log('Total tools/concepts:', tools.length);
fs.writeFileSync('known-tools.json', JSON.stringify(tools, null, 2));
console.log('Saved to known-tools.json');

// Stats
const hardcoded = tools.filter(t => t.search.includes(' ')).length;
const autoEn = tools.filter(t => t.names.length === 1 && /^[a-z]/.test(t.names[0])).length;
const autoHe = tools.filter(t => t.names.length === 1 && /[\u0590-\u05FF]/.test(t.names[0])).length;
console.log(`  Hardcoded (with aliases): ~${hardcoded}`);
console.log(`  Auto English: ${autoEn}`);
console.log(`  Auto Hebrew: ${autoHe}`);
