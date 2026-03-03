# מתכון אוטומציה: פרסום אוטומטי ברשתות חברתיות מ-AI

## תיאור התהליך
אוטומציה שלוקחת תוכן גולמי (ריל, סרטון, או רעיון), מייצרת פוסט מותאם לכל רשת חברתית בעזרת AI, ומפרסמת אוטומטית בפייסבוק, אינסטגרם ולינקדאין.

## מודולים נדרשים ב-Make.com
- **RSS / Watch Folder / Webhook**: טריגר לתוכן חדש
- **OpenAI (ChatGPT) — Create a Completion**: יצירת טקסט מותאם לכל פלטפורמה
- **Facebook Pages — Create a Post**: פרסום בפייסבוק
- **Instagram Business — Create a Photo/Video Post**: פרסום באינסטגרם
- **HTTP — Make a Request**: פרסום בלינקדאין דרך API

## מבנה הסנריו
```
[טריגר] → [ChatGPT - יצירת 3 גרסאות] → [Router]
                                            ├── [Facebook - Create Post]
                                            ├── [Instagram - Create Post]
                                            └── [LinkedIn - HTTP Post]
```

## שלבים לבניית הסנריו

### שלב 1: טריגר — מקור התוכן
מספר אפשרויות:
- **Google Sheets — Watch Rows**: טבלה עם עמודות: נושא, תמונה, קהל יעד
- **RSS — Watch Feed**: פוסט חדש בבלוג
- **Webhook**: שליחה ידנית מכל מקום
- **Instagram — Watch Media**: ריל חדש שפורסם → יצירת גרסאות לפלטפורמות אחרות

### שלב 2: יצירת תוכן עם ChatGPT
1. הוסיפו **OpenAI → Create a Completion**
2. System prompt:
   ```
   אתה קופירייטר מומחה לרשתות חברתיות בעברית.
   קבל נושא וצור 3 גרסאות פוסט:
   1. פייסבוק: 2-3 פסקאות, אמוג'ים מעטים, CTA בסוף
   2. אינסטגרם: קצר וקליט, 5-10 האשטגים רלוונטיים
   3. לינקדאין: מקצועי, תובנה ערכית, בלי אמוג'ים מיותרים

   החזר JSON בפורמט:
   {"facebook": "...", "instagram": "...", "linkedin": "..."}
   ```
3. הגדירו response_format: JSON

### שלב 3: פירסור התשובה
1. הוסיפו **JSON → Parse JSON** לפענוח התשובה
2. עכשיו יש לכם 3 משתנים: `facebook`, `instagram`, `linkedin`

### שלב 4: Router ופרסום
1. הוסיפו **Router** עם 3 נתיבים

**נתיב 1 — פייסבוק:**
- מודול: **Facebook Pages → Create a Post**
- Message: `{{facebook}}`
- Link / Photo: אם יש תמונה

**נתיב 2 — אינסטגרם:**
- מודול: **Instagram Business → Create a Photo Post**
- Caption: `{{instagram}}`
- Image URL: כתובת התמונה (חובה באינסטגרם)

**נתיב 3 — לינקדאין:**
- מודול: **HTTP → Make a Request**
- URL: `https://api.linkedin.com/v2/ugcPosts`
- Method: POST
- Headers: `Authorization: Bearer {{linkedinToken}}`
- Body: UGC Post format עם `{{linkedin}}`

## טיפים חשובים
- תזמנו את הסנריו לשעות פרסום אופטימליות (8:00, 12:00, 18:00)
- אינסטגרם דורש תמונה או סרטון — אי אפשר פוסט טקסט בלבד
- לינקדאין API דורש אפליקציה רשומה ב-LinkedIn Developer Portal
- מומלץ להוסיף שלב ביקורת: שמירה ב-Sheets לפני פרסום, עם עמודת "אושר"
- אם רוצים לתזמן פרסום — השתמשו ב-Tools → Sleep או Scheduling של Make

## שגיאות נפוצות
- **שגיאת 190 בפייסבוק**: Token פג תוקף — חדשו את החיבור
- **אינסטגרם לא מפרסם**: ודאו שהחשבון Business מחובר לדף פייסבוק
- **לינקדאין 403**: ודאו שלאפליקציה יש הרשאת w_member_social
- **ChatGPT מחזיר JSON שבור**: הוסיפו Try/Catch עם Error Handler
