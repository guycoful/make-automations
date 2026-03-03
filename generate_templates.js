const fs = require('fs');

// ─── NEW TEMPLATES TO ADD TO EXISTING CATEGORIES ────────────────────────
const addToExisting = {
  productivity: [
    { name: 'סנכרון Google Calendar ל-Notion', description: 'אירוע חדש ביומן → דף חדש ב-Notion עם כל הפרטים', app_slugs: ['google-calendar','notion'], trigger: {app:'Google Calendar',name:'Watch Events'}, action: {app:'Notion',name:'Create a Database Item'}, accountReq: 'Google + Notion חינמי', triggerScope: 'personal' },
    { name: 'שמירת כוכביות Gmail ב-Notion', description: 'מייל עם כוכבית → דף ב-Notion לטיפול', app_slugs: ['gmail','notion'], trigger: {app:'Gmail',name:'Watch Emails'}, action: {app:'Notion',name:'Create a Database Item'}, accountReq: 'Gmail + Notion חינמי', triggerScope: 'personal' },
    { name: 'יצירת משימה ב-Trello מ-Gmail', description: 'מייל עם תגית מסוימת → כרטיס חדש ב-Trello', app_slugs: ['gmail','trello'], trigger: {app:'Gmail',name:'Watch Emails'}, action: {app:'Trello',name:'Create a Card'}, accountReq: 'Gmail + Trello חינמי', triggerScope: 'personal' },
    { name: 'סנכרון Notion ל-Google Sheets', description: 'רשומה חדשה ב-Notion → שורה חדשה ב-Sheets', app_slugs: ['notion','google-sheets'], trigger: {app:'Notion',name:'Watch Database Items'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Notion + Google חינמי', triggerScope: 'personal' },
    { name: 'העברת קבצים מ-Gmail ל-Dropbox', description: 'קובץ מצורף במייל → נשמר בתיקייה ב-Dropbox', app_slugs: ['gmail','dropbox'], trigger: {app:'Gmail',name:'Watch Emails'}, action: {app:'Dropbox',name:'Upload a File'}, accountReq: 'Gmail + Dropbox חינמי', triggerScope: 'personal' },
    { name: 'יצירת אירוע מ-Trello', description: 'כרטיס עם תאריך יעד → אירוע ב-Google Calendar', app_slugs: ['trello','google-calendar'], trigger: {app:'Trello',name:'Watch Cards'}, action: {app:'Google Calendar',name:'Create an Event'}, accountReq: 'Trello + Google חינמי', triggerScope: 'personal' },
    { name: 'גיבוי Google Sheets ל-OneDrive', description: 'כל יום ב-23:00 → יצוא Sheets כ-Excel ושמירה ב-OneDrive', app_slugs: ['google-sheets','onedrive'], trigger: {app:'Google Sheets',name:'Search Rows'}, action: {app:'OneDrive',name:'Upload a File'}, accountReq: 'Google + Microsoft חינמי', triggerScope: 'personal' },
    { name: 'שמירת הערות Slack ב-Google Sheets', description: 'הודעה עם אימוג\'י מסוים ב-Slack → שורה ב-Sheets', app_slugs: ['slack','google-sheets'], trigger: {app:'Slack',name:'Watch Messages'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Slack + Google חינמי', triggerScope: 'personal' },
  ],
  social: [
    { name: 'פרסום RSS ל-Facebook Page', description: 'מאמר חדש בבלוג → פוסט אוטומטי בדף הפייסבוק', app_slugs: ['rss','facebook-pages'], trigger: {app:'RSS',name:'Watch RSS Feed Items'}, action: {app:'Facebook Pages',name:'Create a Post'}, accountReq: 'דף Facebook + RSS feed', triggerScope: 'business_page' },
    { name: 'שמירת ציוצים ב-Google Sheets', description: 'כל ציוץ חדש שלך → שורה ב-Sheets לניתוח', app_slugs: ['twitter','google-sheets'], trigger: {app:'Twitter',name:'Watch Tweets'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Twitter + Google Sheets', triggerScope: 'developer' },
    { name: 'פרסום Instagram ל-Pinterest', description: 'פוסט חדש באינסטגרם → Pin חדש בפינטרסט', app_slugs: ['instagram-for-business','pinterest'], trigger: {app:'Instagram',name:'Watch Media'}, action: {app:'Pinterest',name:'Create a Pin'}, accountReq: 'Instagram Business + Pinterest Business', triggerScope: 'business_page' },
    { name: 'התראת Telegram על פוסט חדש בבלוג', description: 'פוסט חדש ב-WordPress → הודעה בערוץ Telegram', app_slugs: ['wordpress','telegram-bot'], trigger: {app:'WordPress',name:'Watch Posts'}, action: {app:'Telegram Bot',name:'Send a Text Message'}, accountReq: 'WordPress + בוט Telegram', triggerScope: 'admin' },
    { name: 'סנכרון TikTok ל-Google Sheets', description: 'סרטון חדש ב-TikTok → מעקב בטבלה', app_slugs: ['tiktok','google-sheets'], trigger: {app:'TikTok',name:'Watch Videos'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'TikTok Business + Google', triggerScope: 'business_page' },
  ],
  communication: [
    { name: 'העברת Telegram ל-Slack', description: 'הודעה בערוץ Telegram → הודעה ב-Slack', app_slugs: ['telegram-bot','slack'], trigger: {app:'Telegram Bot',name:'Watch Updates'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'בוט Telegram + Slack', triggerScope: 'personal' },
    { name: 'התראת WhatsApp על מייל מלקוח', description: 'מייל מכתובת ספציפית → WhatsApp מיידי', app_slugs: ['gmail','green-api'], trigger: {app:'Gmail',name:'Watch Emails'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, accountReq: 'Gmail + Green API', triggerScope: 'personal' },
    { name: 'סיכום Slack יומי ב-Gmail', description: 'כל ערב → סיכום הודעות Slack ליום נשלח למייל', app_slugs: ['slack','gmail'], trigger: {app:'Slack',name:'Search Messages'}, action: {app:'Gmail',name:'Send an Email'}, accountReq: 'Slack + Gmail', triggerScope: 'personal' },
    { name: 'שליחת הודעות Teams מ-Airtable', description: 'רשומה חדשה ב-Airtable → הודעה ב-Microsoft Teams', app_slugs: ['airtable','microsoft-teams'], trigger: {app:'Airtable',name:'Watch Records'}, action: {app:'Microsoft Teams',name:'Create a Message'}, accountReq: 'Airtable + Microsoft 365', triggerScope: 'personal' },
    { name: 'העברת WhatsApp ל-Google Sheets', description: 'כל הודעה נכנסת ב-WhatsApp → שורה ב-Sheets לתיעוד', app_slugs: ['green-api','google-sheets'], trigger: {app:'GREEN-API for WhatsApp',name:'Watch Incoming Messages'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Green API + Google Sheets', triggerScope: 'personal' },
  ],
  crm: [
    { name: 'ליד מ-Facebook ל-HubSpot', description: 'ליד חדש מ-Facebook Lead Ads → איש קשר חדש ב-HubSpot', app_slugs: ['facebook-lead-ads','hubspot'], trigger: {app:'Facebook Lead Ads',name:'Watch Leads'}, action: {app:'HubSpot',name:'Create a Contact'}, accountReq: 'Facebook Business + HubSpot חינמי', triggerScope: 'business_page' },
    { name: 'סנכרון HubSpot ל-Google Sheets', description: 'איש קשר חדש ב-HubSpot → שורה ב-Sheets', app_slugs: ['hubspot','google-sheets'], trigger: {app:'HubSpot',name:'Watch Contacts'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'HubSpot חינמי + Google', triggerScope: 'personal' },
    { name: 'ליד מטופס ל-Pipedrive', description: 'מילוי טופס Google → דיל חדש ב-Pipedrive', app_slugs: ['google-forms','pipedrive'], trigger: {app:'Google Forms',name:'Watch Responses'}, action: {app:'Pipedrive',name:'Create a Deal'}, accountReq: 'Google Forms + Pipedrive', triggerScope: 'personal' },
    { name: 'התראת Slack על עסקה ב-HubSpot', description: 'עסקה שינתה שלב → התראה ב-Slack', app_slugs: ['hubspot','slack'], trigger: {app:'HubSpot',name:'Watch Deals'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'HubSpot + Slack', triggerScope: 'personal' },
    { name: 'יצירת ליד ב-Airtable מ-Calendly', description: 'פגישה נקבעה ב-Calendly → ליד חדש ב-Airtable CRM', app_slugs: ['calendly','airtable'], trigger: {app:'Calendly',name:'Watch Events'}, action: {app:'Airtable',name:'Create a Record'}, accountReq: 'Calendly חינמי + Airtable', triggerScope: 'personal' },
    { name: 'ליד מ-Typeform ל-Mailchimp', description: 'מילוי טופס → מנוי חדש ב-Mailchimp', app_slugs: ['typeform','mailchimp'], trigger: {app:'Typeform',name:'Watch Responses'}, action: {app:'Mailchimp',name:'Add a Subscriber'}, accountReq: 'Typeform + Mailchimp חינמי', triggerScope: 'personal' },
  ],
  ecommerce: [
    { name: 'הזמנה ב-Shopify ל-Google Sheets', description: 'הזמנה חדשה → שורה ב-Sheets למעקב', app_slugs: ['shopify','google-sheets'], trigger: {app:'Shopify',name:'Watch Orders'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Shopify + Google', triggerScope: 'admin' },
    { name: 'הזמנה ב-WooCommerce ל-Slack', description: 'הזמנה חדשה → התראה ב-Slack', app_slugs: ['woocommerce','slack'], trigger: {app:'WooCommerce',name:'Watch Orders'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'WooCommerce + Slack', triggerScope: 'admin' },
    { name: 'תשלום Stripe ל-Airtable', description: 'תשלום חדש → רשומה ב-Airtable', app_slugs: ['stripe','airtable'], trigger: {app:'Stripe',name:'Watch Events'}, action: {app:'Airtable',name:'Create a Record'}, accountReq: 'Stripe + Airtable', triggerScope: 'admin' },
    { name: 'לקוח Shopify ל-Mailchimp', description: 'לקוח חדש → מנוי ב-Mailchimp', app_slugs: ['shopify','mailchimp'], trigger: {app:'Shopify',name:'Watch Customers'}, action: {app:'Mailchimp',name:'Add a Subscriber'}, accountReq: 'Shopify + Mailchimp חינמי', triggerScope: 'admin' },
    { name: 'מוצר חדש ב-Shopify ל-Facebook', description: 'מוצר חדש → פוסט בדף Facebook', app_slugs: ['shopify','facebook-pages'], trigger: {app:'Shopify',name:'Watch Products'}, action: {app:'Facebook Pages',name:'Create a Post'}, accountReq: 'Shopify + דף Facebook', triggerScope: 'business_page' },
    { name: 'החזר Stripe ל-Gmail', description: 'החזר כספי → מייל ללקוח עם אישור', app_slugs: ['stripe','gmail'], trigger: {app:'Stripe',name:'Watch Events'}, action: {app:'Gmail',name:'Send an Email'}, accountReq: 'Stripe + Gmail', triggerScope: 'admin' },
  ],
  ai: [
    { name: 'תרגום מיילים עם Claude', description: 'מייל באנגלית → Claude מתרגם → נשלח כטיוטה בעברית', app_slugs: ['gmail','anthropic-claude'], trigger: {app:'Gmail',name:'Watch Emails'}, action: {app:'Anthropic Claude',name:'Create a Message'}, accountReq: 'Gmail + Anthropic API', triggerScope: 'personal' },
    { name: 'סיכום ישיבות עם Whisper + ChatGPT', description: 'קובץ אודיו חדש ב-Drive → תמלול Whisper → סיכום GPT → Notion', app_slugs: ['google-drive','openai-gpt-3'], trigger: {app:'Google Drive',name:'Watch Files'}, action: {app:'OpenAI',name:'Create a Transcription + Completion'}, scenarioFlow: 'Google Drive (קובץ חדש) → OpenAI Whisper (תמלול) → OpenAI GPT (סיכום) → Notion (שמירה)', accountReq: 'Google Drive + OpenAI API + Notion', triggerScope: 'personal' },
    { name: 'יצירת תמונות AI מ-Airtable', description: 'בקשה חדשה ב-Airtable → DALL-E מייצר תמונה → נשמרת ב-Drive', app_slugs: ['airtable','openai-gpt-3'], trigger: {app:'Airtable',name:'Watch Records'}, action: {app:'OpenAI',name:'Generate an Image'}, accountReq: 'Airtable + OpenAI API', triggerScope: 'personal' },
    { name: 'ניתוח סנטימנט לביקורות', description: 'ביקורת חדשה ב-Google Forms → AI מנתח סנטימנט → Google Sheets', app_slugs: ['google-forms','openai-gpt-3'], trigger: {app:'Google Forms',name:'Watch Responses'}, action: {app:'OpenAI',name:'Create a Completion'}, accountReq: 'Google Forms + OpenAI API', triggerScope: 'personal' },
    { name: 'בוט FAQ אוטומטי ב-WhatsApp', description: 'שאלה נכנסת ב-WhatsApp → Claude מוצא תשובה מה-FAQ → משיב', app_slugs: ['green-api','anthropic-claude'], trigger: {app:'GREEN-API for WhatsApp',name:'Watch Incoming Messages'}, action: {app:'Anthropic Claude',name:'Create a Message'}, accountReq: 'Green API + Anthropic API', triggerScope: 'personal' },
    { name: 'יצירת פוסט AI מ-RSS', description: 'מאמר חדש ב-RSS → AI מייצר פוסט בעברית → LinkedIn', app_slugs: ['rss','openai-gpt-3'], trigger: {app:'RSS',name:'Watch RSS Feed Items'}, action: {app:'OpenAI',name:'Create a Completion'}, scenarioFlow: 'RSS (מאמר חדש) → OpenAI (מייצר פוסט) → LinkedIn (מפרסם)', accountReq: 'RSS + OpenAI API + LinkedIn', triggerScope: 'personal' },
    { name: 'מענה AI לטפסים', description: 'טופס Google → AI מנתח ומשיב אוטומטית ב-Gmail', app_slugs: ['google-forms','openai-gpt-3'], trigger: {app:'Google Forms',name:'Watch Responses'}, action: {app:'OpenAI → Gmail',name:'Generate Response → Send Email'}, scenarioFlow: 'Google Forms (תשובה חדשה) → OpenAI (מייצר תשובה מותאמת) → Gmail (שולח)', accountReq: 'Google Forms + OpenAI API + Gmail', triggerScope: 'personal' },
  ],
  data: [
    { name: 'סנכרון Airtable ל-Google Sheets דו-כיווני', description: 'שינוי ב-Airtable → עדכון ב-Sheets וגם להפך', app_slugs: ['airtable','google-sheets'], trigger: {app:'Airtable',name:'Watch Records'}, action: {app:'Google Sheets',name:'Update a Row'}, accountReq: 'Airtable + Google חינמי', triggerScope: 'personal' },
    { name: 'יצוא Notion ל-CSV יומי', description: 'כל ערב → כל הרשומות ב-Notion → קובץ CSV ב-Google Drive', app_slugs: ['notion','google-drive'], trigger: {app:'Notion',name:'Search Objects'}, action: {app:'Google Drive',name:'Upload a File'}, accountReq: 'Notion + Google Drive חינמי', triggerScope: 'personal' },
    { name: 'מעקב מחירים מאתרים', description: 'כל שעה → HTTP module מושך מחיר → אם השתנה → WhatsApp', app_slugs: ['http','green-api'], trigger: {app:'HTTP',name:'Make a Request'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, scenarioFlow: 'Schedule (כל שעה) → HTTP (בודק מחיר) → Filter (השתנה?) → GREEN-API (התראה)', accountReq: 'Green API', triggerScope: 'personal' },
    { name: 'גיבוי Airtable ל-Google Drive', description: 'כל שבוע → כל הרשומות ב-Airtable → JSON ב-Drive', app_slugs: ['airtable','google-drive'], trigger: {app:'Airtable',name:'Search Records'}, action: {app:'Google Drive',name:'Upload a File'}, accountReq: 'Airtable + Google Drive חינמי', triggerScope: 'personal' },
    { name: 'איסוף נתונים מ-API ל-Sheets', description: 'כל יום → קריאת API חיצוני → שורות חדשות ב-Sheets', app_slugs: ['http','google-sheets'], trigger: {app:'HTTP',name:'Make a Request'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Google Sheets', triggerScope: 'personal' },
  ],
  schedule: [
    { name: 'דוח יומי מ-Google Analytics', description: 'כל בוקר → סטטיסטיקות מהאתר → Slack/Gmail', app_slugs: ['google-analytics','slack'], trigger: {app:'Google Analytics',name:'Get Report'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Google Analytics + Slack', triggerScope: 'personal' },
    { name: 'תזכורת שבועית על משימות פתוחות', description: 'כל ראשון → סריקת משימות ב-Trello → סיכום ב-Gmail', app_slugs: ['trello','gmail'], trigger: {app:'Trello',name:'Search Cards'}, action: {app:'Gmail',name:'Send an Email'}, accountReq: 'Trello + Gmail חינמי', triggerScope: 'personal' },
    { name: 'ניקוי Google Sheets אוטומטי', description: 'כל חודש → מחיקת שורות ישנות מעל 90 יום', app_slugs: ['google-sheets'], trigger: {app:'Google Sheets',name:'Search Rows'}, action: {app:'Google Sheets',name:'Delete a Row'}, accountReq: 'Google Sheets', triggerScope: 'personal' },
    { name: 'סיכום שבועי של מכירות', description: 'כל ראשון → סכום הזמנות מ-Shopify → דוח ב-Slack', app_slugs: ['shopify','slack'], trigger: {app:'Shopify',name:'Search Orders'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Shopify + Slack', triggerScope: 'admin' },
    { name: 'בדיקת זמינות אתר', description: 'כל 5 דקות → HTTP HEAD לאתר → אם נפל → WhatsApp', app_slugs: ['http','green-api'], trigger: {app:'HTTP',name:'Make a Request'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, scenarioFlow: 'Schedule (כל 5 דקות) → HTTP (בודק אתר) → Filter (HTTP != 200?) → GREEN-API (התראה)', accountReq: 'Green API', triggerScope: 'personal' },
  ],
  content: [
    { name: 'פרסום WordPress ל-LinkedIn', description: 'פוסט חדש ב-WordPress → שיתוף אוטומטי ב-LinkedIn', app_slugs: ['wordpress','linkedin'], trigger: {app:'WordPress',name:'Watch Posts'}, action: {app:'LinkedIn',name:'Create a Share Update'}, accountReq: 'WordPress + LinkedIn', triggerScope: 'personal' },
    { name: 'סיכום מאמר AI + פרסום', description: 'מאמר חדש ב-RSS → GPT מסכם → פוסט Facebook', app_slugs: ['rss','openai-gpt-3'], trigger: {app:'RSS',name:'Watch RSS Feed Items'}, action: {app:'OpenAI → Facebook Pages',name:'Summarize → Post'}, scenarioFlow: 'RSS (מאמר) → OpenAI (סיכום) → Facebook Pages (פרסום)', accountReq: 'RSS + OpenAI API + Facebook Page', triggerScope: 'business_page' },
    { name: 'יצירת newsletter מ-Notion', description: 'מאמרים מסומנים ב-Notion → newsletter אוטומטי ב-Mailchimp', app_slugs: ['notion','mailchimp'], trigger: {app:'Notion',name:'Watch Database Items'}, action: {app:'Mailchimp',name:'Create a Campaign'}, accountReq: 'Notion + Mailchimp חינמי', triggerScope: 'personal' },
    { name: 'פרסום אוטומטי ב-Buffer', description: 'שורה חדשה ב-Google Sheets → פוסט מתוזמן ב-Buffer', app_slugs: ['google-sheets','buffer'], trigger: {app:'Google Sheets',name:'Watch New Rows'}, action: {app:'Buffer',name:'Create a Post'}, accountReq: 'Google Sheets + Buffer חינמי', triggerScope: 'personal' },
    { name: 'תמלול פודקאסט אוטומטי', description: 'קובץ אודיו ב-Drive → Whisper מתמלל → Notion', app_slugs: ['google-drive','openai-gpt-3'], trigger: {app:'Google Drive',name:'Watch Files'}, action: {app:'OpenAI Whisper',name:'Create a Transcription'}, scenarioFlow: 'Google Drive (קובץ חדש) → OpenAI Whisper (תמלול) → Notion (שמירה)', accountReq: 'Google Drive + OpenAI API + Notion', triggerScope: 'personal' },
  ],
  forms: [
    { name: 'טופס רישום ל-Airtable + Gmail', description: 'מילוי טופס → רשומה ב-Airtable + מייל אישור', app_slugs: ['google-forms','airtable'], trigger: {app:'Google Forms',name:'Watch Responses'}, action: {app:'Airtable → Gmail',name:'Create Record → Send Email'}, scenarioFlow: 'Google Forms → Airtable (רשומה) → Gmail (מייל אישור)', accountReq: 'Google Forms + Airtable + Gmail', triggerScope: 'personal' },
    { name: 'טופס Typeform ל-Notion', description: 'תשובה ב-Typeform → דף ב-Notion', app_slugs: ['typeform','notion'], trigger: {app:'Typeform',name:'Watch Responses'}, action: {app:'Notion',name:'Create a Database Item'}, accountReq: 'Typeform חינמי + Notion', triggerScope: 'personal' },
    { name: 'טופס Jotform ל-Google Sheets', description: 'תשובה ב-Jotform → שורה ב-Sheets', app_slugs: ['jotform','google-sheets'], trigger: {app:'JotForm',name:'Watch Submissions'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'JotForm חינמי + Google', triggerScope: 'personal' },
    { name: 'סקר ל-Slack', description: 'תשובה חדשה ל-Google Forms → הודעה ב-Slack', app_slugs: ['google-forms','slack'], trigger: {app:'Google Forms',name:'Watch Responses'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Google Forms + Slack', triggerScope: 'personal' },
    { name: 'טופס Tally ל-HubSpot', description: 'טופס Tally → ליד חדש ב-HubSpot CRM', app_slugs: ['webhooks','hubspot'], trigger: {app:'Webhooks',name:'Custom Webhook'}, action: {app:'HubSpot',name:'Create a Contact'}, accountReq: 'Tally חינמי + HubSpot חינמי', triggerScope: 'personal' },
  ],
  ads: [
    { name: 'ליד Facebook ל-Google Sheets + WhatsApp', description: 'ליד חדש → שורה ב-Sheets + הודעת WhatsApp מיידית', app_slugs: ['facebook-lead-ads','google-sheets'], trigger: {app:'Facebook Lead Ads',name:'Watch Leads'}, action: {app:'Google Sheets → GREEN-API',name:'Add Row → Send WhatsApp'}, scenarioFlow: 'Facebook Lead Ads → Google Sheets (שמירה) → GREEN-API (WhatsApp ללקוח)', accountReq: 'Facebook Business + Google + Green API', triggerScope: 'business_page' },
    { name: 'דוח Google Ads יומי', description: 'כל בוקר → נתוני קמפיין → סיכום ב-Slack', app_slugs: ['google-ads','slack'], trigger: {app:'Google Ads',name:'Get Campaign Stats'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Google Ads + Slack', triggerScope: 'admin' },
    { name: 'ליד Facebook ל-Mailchimp', description: 'ליד חדש → מנוי אוטומטי ב-Mailchimp', app_slugs: ['facebook-lead-ads','mailchimp'], trigger: {app:'Facebook Lead Ads',name:'Watch Leads'}, action: {app:'Mailchimp',name:'Add a Subscriber'}, accountReq: 'Facebook Business + Mailchimp', triggerScope: 'business_page' },
    { name: 'סנכרון לידים לCRM', description: 'ליד מ-Facebook/Google → Airtable CRM + מייל', app_slugs: ['facebook-lead-ads','airtable'], trigger: {app:'Facebook Lead Ads',name:'Watch Leads'}, action: {app:'Airtable',name:'Create a Record'}, accountReq: 'Facebook Business + Airtable', triggerScope: 'business_page' },
  ],
};

// ─── BRAND NEW CATEGORIES ───────────────────────────────────────────────
const newCategories = [
  {
    id: 'project-management',
    name: '📋 ניהול פרויקטים',
    color: 'orange',
    templates: [
      { name: 'Trello ל-Slack — התראת כרטיס', description: 'כרטיס חדש ב-Trello → הודעה ב-Slack', app_slugs: ['trello','slack'], trigger: {app:'Trello',name:'Watch Cards'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Trello + Slack חינמי', triggerScope: 'personal' },
      { name: 'Asana ל-Google Calendar', description: 'משימה עם תאריך → אירוע ביומן', app_slugs: ['asana','google-calendar'], trigger: {app:'Asana',name:'Watch Tasks'}, action: {app:'Google Calendar',name:'Create an Event'}, accountReq: 'Asana + Google חינמי', triggerScope: 'personal' },
      { name: 'Jira ל-Slack — עדכון סטטוס', description: 'Issue שינה סטטוס → הודעה ב-Slack', app_slugs: ['jira-software','slack'], trigger: {app:'Jira',name:'Watch Issues'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Jira + Slack', triggerScope: 'admin' },
      { name: 'Monday.com ל-Gmail', description: 'פריט חדש ב-Monday → מייל למנהל', app_slugs: ['monday','gmail'], trigger: {app:'Monday.com',name:'Watch Items'}, action: {app:'Gmail',name:'Send an Email'}, accountReq: 'Monday.com + Gmail', triggerScope: 'personal' },
      { name: 'ClickUp ל-Google Sheets', description: 'משימה שהושלמה → שורה ב-Sheets למעקב', app_slugs: ['clickup','google-sheets'], trigger: {app:'ClickUp',name:'Watch Tasks'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'ClickUp + Google חינמי', triggerScope: 'personal' },
      { name: 'Gmail ל-Asana — משימה ממייל', description: 'מייל עם כוכבית → משימה חדשה ב-Asana', app_slugs: ['gmail','asana'], trigger: {app:'Gmail',name:'Watch Emails'}, action: {app:'Asana',name:'Create a Task'}, accountReq: 'Gmail + Asana חינמי', triggerScope: 'personal' },
      { name: 'Trello ל-Google Sheets — דוח שבועי', description: 'כל ראשון → כל כרטיסי Trello → Sheets', app_slugs: ['trello','google-sheets'], trigger: {app:'Trello',name:'Search Cards'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Trello + Google חינמי', triggerScope: 'personal' },
      { name: 'Notion ל-Trello — סנכרון משימות', description: 'משימה חדשה ב-Notion → כרטיס ב-Trello', app_slugs: ['notion','trello'], trigger: {app:'Notion',name:'Watch Database Items'}, action: {app:'Trello',name:'Create a Card'}, accountReq: 'Notion + Trello חינמי', triggerScope: 'personal' },
    ]
  },
  {
    id: 'email-marketing',
    name: '📧 אימייל מרקטינג',
    color: 'rose',
    templates: [
      { name: 'מנוי Mailchimp ל-Google Sheets', description: 'מנוי חדש → שורה ב-Sheets למעקב', app_slugs: ['mailchimp','google-sheets'], trigger: {app:'Mailchimp',name:'Watch Subscribers'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Mailchimp חינמי + Google', triggerScope: 'personal' },
      { name: 'מנוי Mailchimp ל-Slack', description: 'מנוי חדש/הסיר מנוי → הודעה ב-Slack', app_slugs: ['mailchimp','slack'], trigger: {app:'Mailchimp',name:'Watch Subscribers'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Mailchimp + Slack', triggerScope: 'personal' },
      { name: 'ConvertKit ל-Google Sheets', description: 'מנוי חדש ב-ConvertKit → שורה ב-Sheets', app_slugs: ['convertkit','google-sheets'], trigger: {app:'ConvertKit',name:'Watch Subscribers'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'ConvertKit + Google', triggerScope: 'personal' },
      { name: 'Mailerlite ל-Airtable', description: 'מנוי חדש ב-Mailerlite → רשומה ב-Airtable', app_slugs: ['mailerlite','airtable'], trigger: {app:'Mailerlite',name:'Watch Subscribers'}, action: {app:'Airtable',name:'Create a Record'}, accountReq: 'Mailerlite + Airtable', triggerScope: 'personal' },
      { name: 'Google Sheets ל-Mailchimp קמפיין', description: 'רשימת נמענים ב-Sheets → קמפיין חדש ב-Mailchimp', app_slugs: ['google-sheets','mailchimp'], trigger: {app:'Google Sheets',name:'Watch New Rows'}, action: {app:'Mailchimp',name:'Add a Subscriber'}, accountReq: 'Google Sheets + Mailchimp חינמי', triggerScope: 'personal' },
      { name: 'Webhook ל-ActiveCampaign', description: 'טופס חיצוני → ליד ב-ActiveCampaign', app_slugs: ['webhooks','activecampaign'], trigger: {app:'Webhooks',name:'Custom Webhook'}, action: {app:'ActiveCampaign',name:'Create a Contact'}, accountReq: 'ActiveCampaign', triggerScope: 'personal' },
    ]
  },
  {
    id: 'payments',
    name: '💳 תשלומים וחשבוניות',
    color: 'emerald',
    templates: [
      { name: 'Stripe → Google Sheets מעקב תשלומים', description: 'כל תשלום מוצלח → שורה ב-Sheets', app_slugs: ['stripe','google-sheets'], trigger: {app:'Stripe',name:'Watch Events'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Stripe + Google', triggerScope: 'admin' },
      { name: 'Stripe → Slack התראת תשלום', description: 'תשלום חדש → הודעה ב-Slack', app_slugs: ['stripe','slack'], trigger: {app:'Stripe',name:'Watch Events'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Stripe + Slack', triggerScope: 'admin' },
      { name: 'PayPal → Google Sheets', description: 'תשלום PayPal → שורה ב-Sheets', app_slugs: ['paypal','google-sheets'], trigger: {app:'PayPal',name:'Watch Payments'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'PayPal Business + Google', triggerScope: 'admin' },
      { name: 'Stripe → WhatsApp תודה', description: 'תשלום מוצלח → הודעת תודה ב-WhatsApp', app_slugs: ['stripe','green-api'], trigger: {app:'Stripe',name:'Watch Events'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, accountReq: 'Stripe + Green API', triggerScope: 'admin' },
      { name: 'Stripe מנוי בוטל → Gmail', description: 'ביטול מנוי → מייל שימור אוטומטי', app_slugs: ['stripe','gmail'], trigger: {app:'Stripe',name:'Watch Events'}, action: {app:'Gmail',name:'Send an Email'}, accountReq: 'Stripe + Gmail', triggerScope: 'admin' },
      { name: 'דוח הכנסות חודשי', description: 'כל 1 לחודש → סיכום הכנסות מ-Stripe → Slack', app_slugs: ['stripe','slack'], trigger: {app:'Stripe',name:'List Charges'}, action: {app:'Slack',name:'Create a Message'}, scenarioFlow: 'Schedule (1 לחודש) → Stripe (סכום חודשי) → Slack (דוח)', accountReq: 'Stripe + Slack', triggerScope: 'admin' },
    ]
  },
  {
    id: 'cloud-storage',
    name: '☁️ אחסון וקבצים',
    color: 'sky',
    templates: [
      { name: 'סנכרון Google Drive ל-OneDrive', description: 'קובץ חדש ב-Drive → מועתק ל-OneDrive', app_slugs: ['google-drive','onedrive'], trigger: {app:'Google Drive',name:'Watch Files'}, action: {app:'OneDrive',name:'Upload a File'}, accountReq: 'Google + Microsoft חינמי', triggerScope: 'personal' },
      { name: 'סנכרון Dropbox ל-Google Drive', description: 'קובץ חדש ב-Dropbox → מועתק ל-Drive', app_slugs: ['dropbox','google-drive'], trigger: {app:'Dropbox',name:'Watch Files'}, action: {app:'Google Drive',name:'Upload a File'}, accountReq: 'Dropbox + Google חינמי', triggerScope: 'personal' },
      { name: 'שמירת קבצי Slack ב-Drive', description: 'קובץ חדש שהועלה ל-Slack → נשמר ב-Drive', app_slugs: ['slack','google-drive'], trigger: {app:'Slack',name:'Watch Files'}, action: {app:'Google Drive',name:'Upload a File'}, accountReq: 'Slack + Google Drive', triggerScope: 'personal' },
      { name: 'התראה על קובץ חדש בתיקייה', description: 'קובץ חדש ב-Drive → WhatsApp', app_slugs: ['google-drive','green-api'], trigger: {app:'Google Drive',name:'Watch Files'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, accountReq: 'Google Drive + Green API', triggerScope: 'personal' },
      { name: 'המרת קבצים אוטומטית', description: 'קובץ PDF חדש ב-Drive → המרה ל-DOCX → Dropbox', app_slugs: ['google-drive','cloudconvert'], trigger: {app:'Google Drive',name:'Watch Files'}, action: {app:'CloudConvert',name:'Convert a File'}, accountReq: 'Google Drive + CloudConvert', triggerScope: 'personal' },
      { name: 'ארגון תמונות אוטומטי', description: 'תמונה חדשה ב-Drive → מועברת לתיקייה לפי חודש', app_slugs: ['google-drive'], trigger: {app:'Google Drive',name:'Watch Files'}, action: {app:'Google Drive',name:'Move a File'}, accountReq: 'Google Drive', triggerScope: 'personal' },
    ]
  },
  {
    id: 'hr-team',
    name: '👥 HR וצוות',
    color: 'amber',
    templates: [
      { name: 'מועמד חדש מ-Typeform ל-Airtable', description: 'טופס מועמדות → רשומה ב-Airtable HR', app_slugs: ['typeform','airtable'], trigger: {app:'Typeform',name:'Watch Responses'}, action: {app:'Airtable',name:'Create a Record'}, accountReq: 'Typeform + Airtable חינמי', triggerScope: 'personal' },
      { name: 'Onboarding אוטומטי — Slack + Gmail', description: 'עובד חדש ב-Airtable → הודעת ברוך הבא Slack + Gmail', app_slugs: ['airtable','slack'], trigger: {app:'Airtable',name:'Watch Records'}, action: {app:'Slack → Gmail',name:'Welcome + Email'}, scenarioFlow: 'Airtable (עובד חדש) → Slack (הודעה בערוץ) → Gmail (מייל onboarding)', accountReq: 'Airtable + Slack + Gmail', triggerScope: 'personal' },
      { name: 'תזכורת ימי הולדת צוות', description: 'כל יום בודק → יום הולדת? → Slack + WhatsApp', app_slugs: ['google-sheets','slack'], trigger: {app:'Google Sheets',name:'Search Rows'}, action: {app:'Slack',name:'Create a Message'}, scenarioFlow: 'Schedule (כל בוקר) → Google Sheets (בודק תאריכים) → Slack (ברכה) → GREEN-API (WhatsApp)', accountReq: 'Google Sheets + Slack', triggerScope: 'personal' },
      { name: 'דוח שעות עבודה שבועי', description: 'כל ראשון → סיכום שעות מ-Toggl → Google Sheets', app_slugs: ['toggl','google-sheets'], trigger: {app:'Toggl',name:'Get Time Entries'}, action: {app:'Google Sheets',name:'Add a Row'}, accountReq: 'Toggl + Google Sheets', triggerScope: 'personal' },
      { name: 'בקשת חופשה → אישור Slack', description: 'טופס חופשה → הודעה למנהל ב-Slack + יומן', app_slugs: ['google-forms','slack'], trigger: {app:'Google Forms',name:'Watch Responses'}, action: {app:'Slack → Google Calendar',name:'Notify → Block Calendar'}, scenarioFlow: 'Google Forms (בקשת חופשה) → Slack (הודעה למנהל) → Google Calendar (חסימת תאריך)', accountReq: 'Google Forms + Slack + Calendar', triggerScope: 'personal' },
    ]
  },
  {
    id: 'notifications',
    name: '🔔 התראות חכמות',
    color: 'red',
    templates: [
      { name: 'התראת מזג אוויר יומית', description: 'כל בוקר → מזג אוויר → WhatsApp', app_slugs: ['weather','green-api'], trigger: {app:'Weather',name:'Get Forecast'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, accountReq: 'Green API (חינמי: OpenWeatherMap API)', triggerScope: 'personal' },
      { name: 'מעקב אזכורים ברשת', description: 'כל שעה → חיפוש Google עם שם המותג → התראה', app_slugs: ['http','slack'], trigger: {app:'HTTP',name:'Make a Request'}, action: {app:'Slack',name:'Create a Message'}, accountReq: 'Slack', triggerScope: 'personal' },
      { name: 'התראת שגיאות באתר', description: 'שגיאת 500 באתר → WhatsApp + Slack מיידי', app_slugs: ['http','green-api'], trigger: {app:'HTTP',name:'Make a Request'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, scenarioFlow: 'Schedule (כל 5 דקות) → HTTP (בודק אתר) → Filter (שגיאה?) → GREEN-API + Slack', accountReq: 'Green API + Slack', triggerScope: 'personal' },
      { name: 'חדשות RSS ל-Telegram', description: 'מאמר חדש ב-RSS → הודעה בערוץ Telegram', app_slugs: ['rss','telegram-bot'], trigger: {app:'RSS',name:'Watch RSS Feed Items'}, action: {app:'Telegram Bot',name:'Send a Text Message'}, accountReq: 'RSS + בוט Telegram', triggerScope: 'personal' },
      { name: 'התראת GitHub — Issue חדש', description: 'Issue חדש ב-GitHub → WhatsApp', app_slugs: ['github','green-api'], trigger: {app:'GitHub',name:'Watch Issues'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, accountReq: 'GitHub + Green API', triggerScope: 'personal' },
      { name: 'שינוי בטבלה → WhatsApp', description: 'שורה חדשה/עודכנה ב-Google Sheets → WhatsApp', app_slugs: ['google-sheets','green-api'], trigger: {app:'Google Sheets',name:'Watch Changes'}, action: {app:'GREEN-API for WhatsApp',name:'Send a Message'}, accountReq: 'Google Sheets + Green API', triggerScope: 'personal' },
    ]
  },
];

// ─── SPLICE INTO HTML FILE ──────────────────────────────────────────────
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add templates to existing categories
for (const [catId, templates] of Object.entries(addToExisting)) {
  for (const tmpl of templates) {
    const tmplStr = JSON.stringify(tmpl).replace(/"/g, "'").replace(/'([^']+)':/g, '$1:');
    // Actually, let's just build proper JS object strings
  }
}

// Better approach: find each category's templates array and append
for (const [catId, newTemplates] of Object.entries(addToExisting)) {
  const catPattern = new RegExp(`id: '${catId}',[\\s\\S]*?templates: \\[([\\s\\S]*?)\\n        \\]`, 'm');
  const match = html.match(catPattern);
  if (match) {
    const existingTemplates = match[1].trimEnd();
    const newTemplateStrs = newTemplates.map(t => {
      let s = `          { name: '${t.name}', description: '${t.description}', app_slugs: ${JSON.stringify(t.app_slugs)}, trigger: {app:'${t.trigger.app}',name:'${t.trigger.name}'}, action: {app:'${t.action.app}',name:'${t.action.name}'}`;
      if (t.scenarioFlow) s += `, scenarioFlow: '${t.scenarioFlow}'`;
      s += `, accountReq: '${t.accountReq}', triggerScope: '${t.triggerScope}' }`;
      return s;
    }).join(',\n');

    const replacement = existingTemplates + ',\n' + newTemplateStrs;
    html = html.replace(existingTemplates, replacement);
    console.log(`+ ${newTemplates.length} templates added to ${catId}`);
  } else {
    console.log(`WARNING: Category '${catId}' not found`);
  }
}

// 2. Add new categories before the closing ];
const closingBracket = '\n    ];';
const newCatStrs = newCategories.map(cat => {
  const templatesStr = cat.templates.map(t => {
    let s = `          { name: '${t.name}', description: '${t.description}', app_slugs: ${JSON.stringify(t.app_slugs)}, trigger: {app:'${t.trigger.app}',name:'${t.trigger.name}'}, action: {app:'${t.action.app}',name:'${t.action.name}'}`;
    if (t.scenarioFlow) s += `, scenarioFlow: '${t.scenarioFlow}'`;
    s += `, accountReq: '${t.accountReq}', triggerScope: '${t.triggerScope}' }`;
    return s;
  }).join(',\n');

  return `      {
        id: '${cat.id}',
        name: '${cat.name}',
        color: '${cat.color}',
        templates: [
${templatesStr}
        ]
      }`;
}).join(',\n');

html = html.replace(closingBracket, ',\n' + newCatStrs + closingBracket);
console.log(`\n+ ${newCategories.length} new categories added`);

fs.writeFileSync('index.html', html);
console.log('\nDone! File saved.');
