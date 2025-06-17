import 'dotenv/config';
import express from 'express';
import cors from 'cors';

//ahbuhh
// השרת שלנו הוא אפליקציית Express, שמאפשרת לנו ליצור ראוטים ולנהל בקשות HTTP.
//גללג
// חיבור ל-MySQL דרך Sequelize
import sequelize from './db/connection.js';

//כאן אנחנו מייבאים לשרת את ההגדרות של כל טבלה ומה יש בה
import { User, Password, Game, Result, Streak } from './models/index.js';

// כל ראוט הוא קבוצה של פונקציות שמגיעות לשרת ומפעילות פעולות מסוימות
// למשל יוזר ראוטס הא קובץ של פעולות של משתמשים
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import streakRoutes from './routes/streakRoutes.js';

//משתנה שיש לו את היכולת של express כולל האזנה לראוטס
const app = express();

// הגדרת middleware
app.use(cors());
app.use(express.json());
app.use('/api/progress', progressRoutes);
//מאפשר לשרת להבין בקשות שמגיעות בפורמט JSON.
app.use(express.urlencoded({ extended: true }));
//הופך את תקיית public לתקייה סטטית – לדוגמה קבצים של תמונות או CSS יהיו זמינים דרך השרת.
app.use(express.static('public'));




// ראוט של עמוד הבית
app.get('/', (req, res) => res.send('🚀 BrainBoost API is up and running'));

console.log('Registering routes...');

// הרשמת ה-routes תחת /api
// אם מגיעה בקשה שמתחילה ב־/api, תשלח אותה לקובץ הזה כדי שיטפל בה.
// כל ראוט מתחיל ב־/api כדי שיהיה ברור שזה ראוט של שרת
//ולא ראוט של עמוד
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/streaks', streakRoutes);

console.log('Routes registered!');

// טיפול בשגיאות גלובלי
//אם קרתה שגיאה באחד הראוטים – זה יתפוס אותה ויחזיר ללקוח הודעת שגיאה כללית (500).
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// טיפול בבקשות שלא נמצאו
app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).json({ error: 'Route not found' });
});

//אם יש פורט בקובץ אי אן וי בפורט ניקח אותו אם לא ניקח 5000
const PORT = process.env.PORT || 5000;

// sequelize.sync() גורם לסנכרון בין המודלים לבין מסד הנתונים (יוצר טבלאות אם צריך).

// רק אחרי הסנכרון – השרת מתחיל להאזין לבקשות.
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
        console.log('✅ Tables synced');
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});
