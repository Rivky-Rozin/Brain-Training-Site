import multer from 'multer';
import path from 'path';
import fs from 'fs';

// הגדרת תיקיית יעד ושם קובץ
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // ודא שתיקיית uploads קיימת
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        let prefix = '';
        if (file.mimetype.startsWith('image/')) {
            prefix = 'img_';
        } else if (file.mimetype.startsWith('video/')) {
            prefix = 'vid_';
        }
        cb(null, `${prefix}${timestamp}${ext}`);
    }
});

// סינון קבצים - קבל רק תמונות ווידאו
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed!'), false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });



export default upload;
