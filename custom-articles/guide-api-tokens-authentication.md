# מדריך: אימות, Tokens ומפתחות API — כל מה שצריך לדעת

## מה זה API Token?

API Token (אסימון) הוא כמו **סיסמה** שמאפשרת ל-Make.com (או כל כלי אחר) להתחבר לשירות חיצוני בשמכם. כל שירות — פייסבוק, Google, Monday.com, GreenAPI — דורש Token כדי לאפשר גישה.

## סוגי אימות נפוצים

### 1. OAuth 2.0 (פייסבוק, Google, Instagram)
- **איך זה עובד**: Make.com פותח חלון התחברות, אתם מאשרים, ו-Token נוצר אוטומטית
- **יתרון**: פשוט — רק לחיצה על "Connect" ואישור
- **חיסרון**: Token פג תוקף ודורש חידוש
- **שירותים**: Facebook Pages, Google Sheets, Gmail, Instagram

### 2. API Key / Token (Monday.com, GreenAPI, OpenAI)
- **איך זה עובד**: מעתיקים מפתח מהגדרות השירות ומדביקים ב-Make.com
- **יתרון**: לא פג תוקף (בדרך כלל)
- **חיסרון**: אם נחשף — צריך ליצור חדש
- **שירותים**: Monday.com, GreenAPI, OpenAI/ChatGPT, Airtable

### 3. Webhook URL (ללא אימות)
- **איך זה עובד**: Make.com יוצר URL ייחודי, שירותים שולחים נתונים אליו
- **יתרון**: אין צורך באימות — כל מי שיש לו את ה-URL יכול לשלוח
- **חיסרון**: פחות מאובטח — מומלץ להגביל עם IP whitelist
- **שירותים**: Webhooks, Wix, Elementor, טפסים

## איפה מוצאים את ה-Token?

### Facebook / Instagram
1. Make.com → Connections → Facebook Pages → Connect
2. התחברו עם הפרופיל שלכם
3. בחרו את הדפים שרוצים לחבר
4. ה-Token נוצר אוטומטית ונשמר ב-Make

### Google (Sheets, Gmail, Calendar)
1. Make.com → Connections → Google Sheets → Connect
2. בחרו חשבון Google
3. אשרו את ההרשאות
4. ה-Token נוצר אוטומטית

### Monday.com
1. כנסו ל-Monday.com → הפרופיל שלכם → Admin
2. API → Personal API Token
3. העתיקו את ה-Token
4. ב-Make.com: Connections → Monday.com → הדביקו את ה-Token

### GreenAPI
1. כנסו לדשבורד GreenAPI
2. ה-Instance ID וה-API Token מוצגים בעמוד הראשי
3. העתיקו אותם ל-Make.com (בתוך ה-URL של HTTP module)

### OpenAI (ChatGPT)
1. כנסו ל-platform.openai.com → API Keys
2. לחצו "Create new secret key"
3. **העתיקו מיד** — לא תוכלו לראות אותו שוב
4. ב-Make.com: Connections → OpenAI → הדביקו את ה-Key

## מה לעשות כשה-Token פג תוקף?

### סימנים שה-Token פג:
- שגיאת **401 Unauthorized** או **403 Forbidden**
- הודעה: **"Invalid access token"** או **"Token expired"**
- הסנריו שעבד פתאום הפסיק

### איך לחדש:
1. ב-Make.com: כנסו ל-**Connections** (בתפריט השמאלי)
2. מצאו את החיבור הבעייתי
3. לחצו **Reauthorize** או **Reconnect**
4. אשרו מחדש את ההרשאות
5. שמרו והפעילו מחדש את הסנריו

## אבטחת Tokens — כללים חשובים

- **לעולם אל תשתפו Token** בפומבי (GitHub, WhatsApp, מייל)
- **אל תכתבו Tokens בקוד** — השתמשו במשתני סביבה
- **חדשו Tokens** באופן קבוע (כל 3-6 חודשים)
- **השתמשו ב-Tokens עם הרשאות מינימליות** — אל תיתנו גישה מלאה כשצריך רק קריאה
- **אם Token נחשף** — בטלו אותו מיד וצרו חדש

## טיפים חשובים
- ב-Make.com אפשר לראות את כל החיבורים ב-Connections — בדקו מדי פעם שהכל תקין
- שמרו את ה-API Keys בקובץ מוגן או במנהל סיסמאות
- אם אתם עובדים בצוות — צרו חיבורים עם חשבון ייעודי לאוטומציות (לא האישי)
- שימו לב להרשאות: לדוגמה, Facebook דורש manage_pages + pages_messaging + leads_retrieval

## שגיאות נפוצות
- **"401 Unauthorized"** — Token שגוי או פג תוקף. חדשו את החיבור
- **"403 Forbidden"** — אין הרשאות מספיקות. בדקו שנתתם את כל ההרשאות הנדרשות
- **"Invalid API Key"** — העתקתם לא נכון. בדקו שאין רווחים בהתחלה/סוף
- **"Connection failed"** — ייתכן שהשירות החיצוני חסום ב-firewall. נסו מחשב אחר
- **"Scope insufficient"** — צריך לתת הרשאות נוספות. חברו מחדש ואשרו את כל ההרשאות
