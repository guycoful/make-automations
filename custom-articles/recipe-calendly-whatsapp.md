# מתכון אוטומציה: הזמנת פגישה ב-Calendly → אישור WhatsApp

## תיאור התהליך
אוטומציה שמזהה הזמנת פגישה חדשה דרך Calendly ושולחת הודעת WhatsApp אוטומטית ללקוח עם אישור הפגישה, פרטים ותזכורת.

## מודולים נדרשים ב-Make.com
- **Calendly — Watch Events**: טריגר שמזהה הזמנות חדשות
- **HTTP — Make a Request**: שליחת WhatsApp דרך GreenAPI
- **Tools — Sleep** (אופציונלי): להוספת תזכורת מתוזמנת

## חיבורים מוקדמים
1. חיבור Calendly: הגדרות → Connections → Calendly → Personal Access Token מהגדרות Calendly
2. חיבור GreenAPI: Instance ID + API Token

## שלבים לבניית הסנריו

### שלב 1: טריגר — Calendly
1. צרו סנריו חדש ב-Make.com
2. הוסיפו מודול **Calendly → Watch Events**
3. הזינו את ה-Personal Access Token
4. בחרו scope: invitee.created (הזמנה חדשה)

### שלב 2: חילוץ מידע
Calendly מחזיר את הפרטים הבאים שתשתמשו בהם:
- `invitee_name` — שם הלקוח
- `invitee_email` — אימייל
- `event_start_time` — תאריך ושעת הפגישה
- `event_type_name` — סוג הפגישה
- `questions_and_answers` — תשובות לשאלות מותאמות (כולל טלפון אם הוספתם)

### שלב 3: שליחת WhatsApp — אישור הזמנה
1. הוסיפו מודול **HTTP → Make a request**
2. Body:
   ```json
   {
     "chatId": "{{phone}}@c.us",
     "message": "שלום {{invitee_name}}! 📅\n\nהפגישה שלך אושרה:\n📌 {{event_type_name}}\n🕐 {{formatDate(event_start_time; 'DD/MM/YYYY HH:mm')}}\n\nנתראה! 🙌"
   }
   ```

### שלב 4 (אופציונלי): תזכורת לפני הפגישה
ליצירת תזכורת אוטומטית:
1. צרו סנריו נפרד עם **Calendly → Watch Events**
2. הוסיפו **Tools → Sleep** עם חישוב: `event_start_time` פחות שעה
3. הוסיפו שליחת WhatsApp עם הודעת תזכורת: "תזכורת: הפגישה שלך בעוד שעה! 🔔"

חלופה: השתמשו ב-Scheduling של Make.com — צרו סנריו שרץ כל שעה, בודק פגישות בשעה הקרובה, ושולח תזכורות.

## טיפים חשובים
- הוסיפו שאלה מותאמת ב-Calendly לאיסוף מספר טלפון (כברירת מחדל Calendly אוסף רק אימייל)
- השתמשו בפונקציית `formatDate` של Make להצגת תאריך בפורמט ישראלי
- מומלץ לטפל גם בביטולים: הוסיפו סנריו נוסף עם טריגר `invitee.canceled`

## שגיאות נפוצות
- **אין מספר טלפון**: ודאו שהוספתם שאלה מותאמת ב-Calendly לטלפון (ושהיא חובה)
- **שעה לא נכונה**: Calendly מחזיר UTC — השתמשו ב-`formatDate` עם timezone `Asia/Jerusalem`
- **טריגר לא מגיב**: ודאו שה-Personal Access Token תקף ולא פג תוקף
