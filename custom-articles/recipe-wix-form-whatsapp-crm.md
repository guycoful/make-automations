# מתכון אוטומציה: טופס מדף נחיתה (Wix/Elementor) → WhatsApp + CRM

## תיאור התהליך
אוטומציה שתופסת ליד מטופס בדף נחיתה (Wix, WordPress/Elementor, או כל דף אחר), שולחת הודעת WhatsApp מיידית, ושומרת את הליד ב-Google Sheets או Monday.com כ-CRM.

## מודולים נדרשים ב-Make.com
- **Webhooks — Custom Webhook**: קבלת נתוני הטופס
- **HTTP — Make a Request**: שליחת WhatsApp דרך GreenAPI
- **Google Sheets — Add a Row** או **Monday.com — Create Item**: שמירת הליד

## שלבים לבניית הסנריו

### שלב 1: יצירת Webhook ב-Make
1. צרו סנריו חדש ב-Make.com
2. הוסיפו מודול **Webhooks → Custom Webhook**
3. לחצו Create a webhook ותנו שם (למשל: "לידים מדף נחיתה")
4. העתיקו את כתובת ה-Webhook שנוצרה

### שלב 2: חיבור דף הנחיתה ל-Webhook

**ב-Wix:**
1. היכנסו לעורך Wix → טופס → הגדרות
2. הוסיפו Automation: "כשנשלח טופס" → "שלח Webhook"
3. הדביקו את כתובת ה-Webhook מ-Make
4. או: השתמשו ב-Wix Automations → HTTP Request

**ב-WordPress/Elementor:**
1. הוסיפו Action אחרי שליחת הטופס
2. בחרו Webhook ← הדביקו את הכתובת
3. או: השתמשו בתוסף WPWebhooks

**בכל דף נחיתה אחר (Smoove, Leadpages, וכו'):**
1. חפשו "Webhook" או "Integration" בהגדרות הטופס
2. הדביקו את כתובת ה-Make Webhook

### שלב 3: מבנה הנתונים
אחרי ששלחתם טופס לבדיקה, Make יזהה את המבנה:
```json
{
  "name": "שם מלא",
  "phone": "0501234567",
  "email": "test@email.com",
  "interest": "ייעוץ עסקי"
}
```

### שלב 4: ניקוי מספר טלפון + שליחת WhatsApp
1. הוסיפו **Tools → Set Variable** לניקוי הטלפון:
   - `replace(replace(replace(phone; "-"; ""); " "; ""); "+"; "")`
   - אם מתחיל ב-0: `if(substring(cleanPhone; 0; 1) = "0"; "972" + substring(cleanPhone; 1); cleanPhone)`
2. הוסיפו **HTTP → Make a request** לשליחת WhatsApp:
   ```json
   {
     "chatId": "{{cleanPhone}}@c.us",
     "message": "היי {{name}}! 👋\n\nתודה שהשארת פרטים באתר.\nנחזור אליך בהקדם!\n\n{{interest}}"
   }
   ```

### שלב 5: שמירה ב-CRM
**אפשרות א — Google Sheets:**
1. הוסיפו **Google Sheets → Add a Row**
2. מפו: שם, טלפון, אימייל, עניין, תאריך, מקור

**אפשרות ב — Monday.com:**
1. הוסיפו **Monday.com → Create an Item**
2. בחרו בורד לידים
3. מפו את העמודות המתאימות

### שלב 6: התראה למנהל (אופציונלי)
הוסיפו Router ונתיב נוסף:
- WhatsApp למנהל: "ליד חדש! {{name}} - {{phone}} - {{interest}}"
- או Gmail לצוות המכירות

## טיפים חשובים
- בדקו שה-Webhook מקבל את כל השדות — שלחו טופס בדיקה ובדקו ב-Make מה הגיע
- Wix שולח את שמות השדות באנגלית (field_1, field_2) — תצטרכו למפות ידנית
- Elementor שולח את שמות השדות כפי שהגדרתם בטופס
- מומלץ להוסיף מייל אישור גם ללקוח (Gmail → Send Email)
- הגבילו את ה-Webhook עם IP whitelist אם אפשר

## שגיאות נפוצות
- **Webhook לא מקבל נתונים**: ודאו שדף הנחיתה מוגדר לשלוח POST (לא GET)
- **שדות ריקים**: Wix/Elementor לפעמים שולחים שדות ריקים — הוסיפו פילטר: phone is not empty
- **מספר טלפון בפורמט לא נכון**: תמיד נקו לפני שליחה ל-GreenAPI
- **Webhook מפסיק לעבוד**: ודאו שהסנריו ב-Make מופעל (ON) — אם הוא כבוי, ה-Webhook לא קולט
