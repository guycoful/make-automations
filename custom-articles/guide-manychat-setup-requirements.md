# מדריך: הגדרת ManyChat — דרישות וחיבורים

## מה זה ManyChat?

ManyChat הוא פלטפורמה ליצירת בוטים (צ'אטבוטים) עבור:
- **Facebook Messenger** — בוט שעונה להודעות בדף העסקי
- **Instagram DM** — בוט שעונה להודעות ישירות
- **WhatsApp** — בוט (דרך WhatsApp Business API)
- **Telegram** — בוט לערוצים וקבוצות
- **SMS** — הודעות טקסט (בארה"ב בעיקר)

## דרישות מוקדמות

### 1. דף עסקי בפייסבוק (חובה!)
- ManyChat **לא עובד עם פרופיל פרטי**
- צריך דף עסקי (Facebook Page) מפורסם
- אתם צריכים להיות **מנהלים** של הדף

### 2. חשבון אינסטגרם עסקי (לבוט אינסטגרם)
- חשבון Business (לא Personal ולא Creator)
- מחובר לדף הפייסבוק העסקי
- לפחות 1,000 עוקבים (דרישה של Meta)

### 3. חשבון WhatsApp Business (לבוט WhatsApp)
- WhatsApp Business API (לא WhatsApp רגיל)
- Meta Business Manager מאומת
- מספר טלפון ייעודי

## שלב 1: הרשמה ל-ManyChat

1. כנסו ל-**manychat.com** ולחצו Sign Up
2. התחברו עם **חשבון הפייסבוק** שלכם
3. בחרו את **הדף העסקי** שרוצים לחבר
4. אשרו את כל ההרשאות שManyChat מבקש

## שלב 2: הגדרת בוט Messenger

### חיבור
1. ב-ManyChat: **Settings → Facebook**
2. ודאו שהדף מחובר ושהסטטוס "Connected"
3. הפעילו את ה-Bot: **Settings → General → Bot Status → ON**

### יצירת Flow ראשון
1. **Automation → Flows → New Flow**
2. בחרו טריגר:
   - **Keyword** — כשמישהו כותב מילה מסוימת
   - **Default Reply** — לכל הודעה שאין לה מענה
   - **Welcome Message** — כשמישהו פותח צ'אט לראשונה
3. הוסיפו פעולות: שלח הודעה, שאל שאלה, שמור תשובה

### חיבור ל-Make.com
1. ב-ManyChat Flow, הוסיפו **Action → External Request**
2. או: השתמשו במודול **ManyChat → Watch Event** ב-Make.com
3. אפשר גם: ManyChat שולח ל-Webhook של Make.com

## שלב 3: הגדרת בוט אינסטגרם

### דרישות
- חשבון אינסטגרם **עסקי** (Business)
- מחובר לדף פייסבוק
- **לפחות 1,000 עוקבים** (דרישת Meta)

### חיבור
1. ב-ManyChat: **Settings → Instagram**
2. לחצו **Connect Instagram**
3. התחברו עם Facebook ובחרו את הדף המקושר
4. ManyChat יאמת שהחשבון עומד בדרישות

### טריגרים זמינים באינסטגרם
- **DM** — כשמישהו שולח הודעה
- **Story Reply** — כשמישהו מגיב לסטורי
- **Story Mention** — כשמישהו מתייג אתכם בסטורי
- **Comment** — כשמישהו מגיב לפוסט/ריל (Comment Automation)
- **Keyword** — כשמישהו כותב מילה ספציפית ב-DM

## שלב 4: Comment Automation (האוטומציה הכי פופולרית!)

### מה זה?
כשמישהו מגיב לפוסט/ריל באינסטגרם, ManyChat שולח לו DM אוטומטי.

### איך להגדיר
1. **Automation → Instagram Comment Automation**
2. בחרו פוסט ספציפי (או כל הפוסטים)
3. הגדירו **Keyword Trigger** — למשל: כשמישהו כותב "מעוניין"
4. צרו **Flow** שנשלח ב-DM:
   - הודעת תודה
   - שאלה (למשל: "מה השם שלך?")
   - שמירת פרטים
   - שליחה ל-Make.com (Webhook)

### דוגמה
- פוסט: "רוצים מדריך חינמי? כתבו 'כן' בתגובות!"
- תגובת ManyChat: DM עם "היי! שולח לך את המדריך 📚 מה האימייל שלך?"
- הלקוח עונה → ManyChat שומר → שולח ל-Make.com → Make שומר ב-Sheets ושולח מייל

## חיבור ManyChat ל-Make.com

### אפשרות 1: Webhook (מומלץ)
1. ב-Make.com: צרו **Webhooks → Custom Webhook**
2. העתיקו את ה-URL
3. ב-ManyChat Flow: הוסיפו **Action → External Request**
4. Method: POST, URL: כתובת ה-Webhook
5. Body: שלחו את הנתונים (שם, טלפון, אימייל)

### אפשרות 2: מודול ManyChat ב-Make.com
1. ב-Make.com: חפשו את מודול **ManyChat**
2. התחברו עם ManyChat API Key
3. השתמשו בטריגרים ואקשנים ישירות

## טיפים חשובים
- **אל תשלחו ספאם ב-Messenger** — Meta חוסמת בוטים שמציקים
- **עקבו אחרי 24 Hour Rule** — אחרי 24 שעות מהאינטראקציה האחרונה, אתם מוגבלים בסוגי ההודעות
- **השתמשו ב-Tags** — תייגו subscribers לפי עניין, מקור, שלב
- **בדקו את הבוט בעצמכם** — שלחו הודעה לדף מפרופיל אחר
- **אל תשכחו Default Reply** — כדי שכל מי שכותב יקבל מענה

## שגיאות נפוצות
- **"Page not connected"** — חברו את הדף ב-ManyChat Settings
- **"Instagram account doesn't meet requirements"** — צריך חשבון עסקי + 1,000 עוקבים + דף פייסבוק מקושר
- **"Bot is paused"** — הפעילו את הבוט ב-Settings → General
- **"24-hour window expired"** — אי אפשר לשלוח הודעה פרומו אחרי 24 שעות
- **"Comment automation not triggering"** — ודאו שה-Keyword תואם (case sensitive!) ושהאוטומציה מופעלת
