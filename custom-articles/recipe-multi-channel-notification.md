# מתכון אוטומציה: התראה רב-ערוצית — WhatsApp + Email + Slack

## תיאור התהליך
אוטומציה שמקבלת אירוע (ליד חדש, הזמנה, או כל טריגר אחר) ושולחת התראה במקביל בשלושה ערוצים: הודעת WhatsApp, אימייל ב-Gmail, והודעה בערוץ Slack — כדי שאף עדכון לא יפספס.

## מודולים נדרשים ב-Make.com
- **Webhook — Custom Webhook** (או כל טריגר אחר): נקודת כניסה לאירוע
- **Router**: פיצול לשלושה נתיבים מקבילים
- **HTTP — Make a Request**: WhatsApp דרך GreenAPI
- **Gmail — Send an Email**: שליחת אימייל
- **Slack — Create a Message**: הודעה בערוץ Slack

## מבנה הסנריו
```
[Webhook/טריגר] → [Router]
                     ├── נתיב 1: [WhatsApp - GreenAPI]
                     ├── נתיב 2: [Gmail - Send Email]
                     └── נתיב 3: [Slack - Create Message]
```

## שלבים לבניית הסנריו

### שלב 1: טריגר — Webhook
1. צרו סנריו חדש ב-Make.com
2. הוסיפו מודול **Webhooks → Custom Webhook**
3. לחצו Create a webhook וקבלו URL ייחודי
4. ה-Webhook יקבל נתונים בפורמט JSON, לדוגמה:
   ```json
   {
     "name": "ישראל ישראלי",
     "phone": "972501234567",
     "email": "israel@example.com",
     "source": "דף נחיתה",
     "message": "מעוניין בייעוץ"
   }
   ```
5. תוכלו לחבר את ה-Webhook הזה לדף נחיתה, טופס, או כל מערכת חיצונית

### שלב 2: הוספת Router
1. הוסיפו מודול **Router** אחרי ה-Webhook
2. ה-Router יפצל את הזרימה לשלושה נתיבים מקבילים
3. כל הנתיבים ירוצו במקביל — אין צורך להמתין שאחד יסתיים

### שלב 3: נתיב 1 — WhatsApp
1. הוסיפו **HTTP → Make a request**
2. הגדירו:
   - URL: `https://api.green-api.com/waInstance{{InstanceID}}/sendMessage/{{APIToken}}`
   - Method: POST
   - Body:
     ```json
     {
       "chatId": "{{phone}}@c.us",
       "message": "🔔 ליד חדש!\n\nשם: {{name}}\nמקור: {{source}}\nהודעה: {{message}}"
     }
     ```

### שלב 4: נתיב 2 — Gmail
1. הוסיפו **Gmail → Send an Email**
2. הגדירו:
   - To: האימייל שלכם (או של הצוות)
   - Subject: `ליד חדש מ-{{source}}: {{name}}`
   - Content:
     ```
     שלום,

     התקבל ליד חדש:
     שם: {{name}}
     טלפון: {{phone}}
     אימייל: {{email}}
     מקור: {{source}}
     הודעה: {{message}}

     תאריך: {{now}}
     ```

### שלב 5: נתיב 3 — Slack
1. הוסיפו **Slack → Create a Message**
2. בחרו את הערוץ הרלוונטי (לדוגמה: #leads או #notifications)
3. כתבו את ההודעה:
   ```
   🆕 *ליד חדש מ-{{source}}*
   👤 {{name}}
   📱 {{phone}}
   📧 {{email}}
   💬 {{message}}
   ```

### שלב 6: הפעלה ובדיקה
1. שמרו את הסנריו
2. שלחו בקשת POST לכתובת ה-Webhook עם נתוני בדיקה (אפשר דרך Postman או curl)
3. ודאו שקיבלתם: WhatsApp + אימייל + הודעה ב-Slack
4. הפעילו את הסנריו

## וריאציות
- **הוספת פילטר לכל נתיב**: לדוגמה, WhatsApp רק בשעות עבודה, Slack תמיד
- **הוספת Google Sheets**: נתיב רביעי ששומר את הליד בטבלה
- **שימוש ב-Telegram במקום Slack**: מודול Telegram → Send Message
- **התאמת טריגר**: במקום Webhook, אפשר להשתמש ב-Facebook Lead Ads, Google Forms, או כל טריגר אחר

## טיפים חשובים
- Router ב-Make מריץ את כל הנתיבים במקביל — זה יעיל ומהיר
- הוסיפו Error Handler בכל נתיב בנפרד — אם Slack נפל, ה-WhatsApp והאימייל ימשיכו לעבוד
- כל נתיב צורך אופרציה אחת — שלושה ערוצים = 4 אופרציות (1 webhook + 3 פעולות)

## שגיאות נפוצות
- **Webhook לא מגיב**: ודאו שהסנריו מופעל (ON) ושכתובת ה-Webhook נכונה
- **Slack שגיאת הרשאות**: ודאו שלאפליקציה יש הרשאת כתיבה לערוץ הרלוונטי
- **Gmail חסום**: אם שולחים יותר מ-500 מיילים ביום, Gmail יחסום — שקלו SendGrid לנפחים גבוהים
