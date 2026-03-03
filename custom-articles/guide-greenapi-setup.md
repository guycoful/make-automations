# מדריך: הגדרת GreenAPI לשליחת WhatsApp מ-Make.com

## מה זה GreenAPI?

GreenAPI הוא שירות שמאפשר לשלוח ולקבל הודעות WhatsApp דרך API. הוא מתחבר ל-WhatsApp שלכם (כמו WhatsApp Web) ומאפשר לכלים כמו Make.com לשלוח הודעות אוטומטיות.

## שלב 1: יצירת חשבון

1. כנסו ל-**green-api.com** והירשמו
2. בחרו תוכנית (יש תוכנית חינמית לבדיקות)
3. לאחר ההרשמה, תגיעו לדשבורד

## שלב 2: יצירת Instance

1. לחצו **"Create Instance"**
2. קבלתם שני ערכים חשובים — **שמרו אותם!**
   - **Instance ID** — מזהה ייחודי (מספר)
   - **API Token** — מפתח האימות (מחרוזת ארוכה)
3. הערכים האלה נדרשים בכל קריאת API

## שלב 3: חיבור WhatsApp

1. בדשבורד, לחצו **"Link WhatsApp"** או **"Get QR Code"**
2. יופיע QR Code על המסך
3. בטלפון: פתחו WhatsApp → **⋮** (שלוש נקודות) → **מכשירים מקושרים** → **קשר מכשיר**
4. סרקו את ה-QR Code
5. המתינו — הסטטוס ישתנה ל-**"authorized"**

## שלב 4: בדיקת החיבור

### כתובת ה-API
כל קריאה ל-GreenAPI נראית כך:
```
https://api.green-api.com/waInstance{{InstanceID}}/{{method}}/{{APIToken}}
```

### שליחת הודעה:
```json
{
  "chatId": "972501234567@c.us",
  "message": "שלום! זו הודעת בדיקה 🎉"
}
```

### שליחה לקבוצה:
```json
{
  "chatId": "972501234567-1234567890@g.us",
  "message": "הודעה לקבוצה!"
}
```

## שלב 5: חיבור ל-Make.com

1. הוסיפו מודול **HTTP → Make a Request**
2. הגדירו:
   - **URL**: `https://api.green-api.com/waInstance{{InstanceID}}/sendMessage/{{APIToken}}`
   - **Method**: POST
   - **Body type**: Raw → JSON
   - **Content Type**: application/json
3. ב-Body הזינו את ה-JSON עם chatId ו-message
4. מפו את השדות מהמודולים הקודמים (שם, טלפון וכו')

## פעולות נוספות ב-GreenAPI

### קבלת הודעות נכנסות
- הגדירו **Webhook URL** בהגדרות ה-Instance
- GreenAPI ישלח POST לכתובת שלכם עם כל הודעה נכנסת
- ב-Make.com: השתמשו ב-**Webhooks → Custom Webhook** לקבלה

### שליחת תמונה
```json
{
  "chatId": "972501234567@c.us",
  "urlFile": "https://example.com/image.jpg",
  "caption": "תמונה עם כיתוב 📸"
}
```
שימו לב: ה-URL של השליחה משתנה ל-`sendFileByUrl`

### שליחת קובץ
```json
{
  "chatId": "972501234567@c.us",
  "urlFile": "https://example.com/document.pdf",
  "fileName": "מסמך.pdf"
}
```

### בדיקה אם מספר קיים ב-WhatsApp
```json
{
  "phoneNumber": 972501234567
}
```
שימו לב: ה-URL משתנה ל-`checkWhatsapp`

## טיפים חשובים
- **שמרו את ה-Instance ID וה-Token** במקום בטוח — בלעדיהם אי אפשר לשלוח
- **הטלפון חייב להישאר מחובר לאינטרנט** — אם הטלפון כבוי, ההודעות לא יישלחו
- **אל תפתחו WhatsApp Web במקביל** — זה עלול לנתק את GreenAPI
- **חדשו את ה-QR Code כל כמה שבועות** — החיבור עלול להתנתק
- **השתמשו במספר WhatsApp Business** — עדיף מספר ייעודי לעסק, לא המספר הפרטי

## שגיאות נפוצות
- **"Instance not authorized"** — ה-WhatsApp התנתק. כנסו לדשבורד וסרקו QR מחדש
- **"Phone number not registered in WhatsApp"** — המספר שניסיתם לשלוח אליו לא רשום ב-WhatsApp
- **"API Token is invalid"** — בדקו שהעתקתם נכון את ה-Token (בלי רווחים)
- **"Rate limit"** — המתינו דקה ונסו שוב. אל תשלחו יותר מ-50 הודעות בדקה
- **"chatId format is wrong"** — ודאו שהפורמט הוא `972XXXXXXXXX@c.us` (בלי +, בלי מקפים)
