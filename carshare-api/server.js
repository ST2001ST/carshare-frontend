const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const port = 5000;

// Middlewares
app.use(cors({
  origin: ['https://carshare-project-dcgx.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إعداد مجلد الصور
const uploadDir = 'public/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// إعداد Multer لرفع الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|jfif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم. فقط الصور (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// خدمة الصور الثابتة
app.use('/images', express.static('public/images'));

// ========== Routes السيارات ==========

// رفع صورة
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'ما ترفعتش صورة' });
  }
  res.json({ filename: req.file.filename });
});

// جلب جميع السيارات
app.get('/api/voitures', (req, res) => {
  const sql = 'SELECT * FROM voitures';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('خطأ:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// إضافة سيارة جديدة
app.post('/api/voitures', (req, res) => {
  const { marque, modele, matricule, prix_par_jour, ville, description, image, proprietaire_id } = req.body;

  if (!marque || !modele || !prix_par_jour || !ville) {
    return res.status(400).json({ error: 'البيانات ناقصة' });
  }

  const sql = `INSERT INTO voitures (marque, modele, matricule, prix_par_jour, ville, description, image, proprietaire_id) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [marque, modele, matricule || '', prix_par_jour, ville, description || '', image || 'https://placehold.co/600x400', proprietaire_id], (err, result) => {
    if (err) {
      console.error('خطأ في الإضافة:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, message: 'تمت الإضافة بنجاح' });
  });
});

// حذف سيارة
// إصلاح: parseInt() لأن proprietaire_id كان يجي كـ string فيحدث خطأ مقارنة مع int
app.delete('/api/voitures/:id', (req, res) => {
  const { id } = req.params;
  const { proprietaire_id } = req.body;

  const checkSql = 'SELECT * FROM voitures WHERE id = ?';
  db.query(checkSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'السيارة غير موجودة' });

    const voiture = results[0];

    if (parseInt(voiture.proprietaire_id) !== parseInt(proprietaire_id)) {
      return res.status(403).json({ error: 'ليس لديك صلاحية لحذف هذه السيارة' });
    }

    db.query('DELETE FROM voitures WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'تم حذف السيارة بنجاح' });
    });
  });
});

// ========== Routes المصادقة ==========

// إنشاء حساب جديد
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
  }

  const checkSql = 'SELECT * FROM proprietaire WHERE email = ?';
  db.query(checkSql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل' });
    }

    const sql = 'INSERT INTO proprietaire (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, role || 'client'], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        user: {
          id: result.insertId,
          name: name,
          email: email,
          role: role || 'client'
        }
      });
    });
  });
});

// تسجيل الدخول
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'البريد وكلمة المرور مطلوبان' });
  }

  const sql = 'SELECT * FROM proprietaire WHERE email = ? AND mot_de_passe = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const user = results[0];
    res.json({
      user: {
        id: user.id,
        name: user.nom,
        email: user.email,
        role: user.role || 'client'
      }
    });
  });
});

// ========== تشغيل السيرفر ==========
app.listen(port, () => {
  console.log(`السيرفر شغال على http://localhost:${port}`);
});
