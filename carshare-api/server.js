const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = 'public/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null,'public/images/'),
  filename:(req,file,cb) => cb(null, Date.now()+'-'+file.originalname)
});

const fileFilter = (req,file,cb) => {
  const allowed = /jpeg|jpg|png|gif|jfif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  (mime && ext) ? cb(null,true) : cb(new Error('نوع الملف غير مدعوم'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize:5*1024*1024 } });
app.use('/images', express.static('public/images'));

app.post('/api/upload', upload.single('image'), (req,res) => {
  if (!req.file) return res.status(400).json({ error:'ما ترفعتش صورة' });
  res.json({ filename: req.file.filename });
});

app.get('/api/voitures', (req,res) => {
  db.query('SELECT * FROM voitures', (err,results) => {
    if (err) return res.status(500).json({ error:err.message });
    res.json(results);
  });
});

app.post('/api/voitures', (req,res) => {
  const { marque, modele, matricule, prix_par_jour, ville, description, image, proprietaire_id } = req.body;
  if (!marque || !modele || !prix_par_jour || !ville)
    return res.status(400).json({ error:'البيانات ناقصة' });
  const sql = `INSERT INTO voitures (marque,modele,matricule,prix_par_jour,ville,description,image,proprietaire_id)
               VALUES (?,?,?,?,?,?,?,?)`;
  db.query(sql, [marque,modele,matricule||'',prix_par_jour,ville,description||'', image||'https://placehold.co/600x400', proprietaire_id], (err,result) => {
    if (err) return res.status(500).json({ error:err.message });
    res.json({ id:result.insertId, message:'تمت الإضافة بنجاح' });
  });
});

app.delete('/api/voitures/:id', (req,res) => {
  const { id } = req.params;
  const { proprietaire_id } = req.body;
  db.query('SELECT * FROM voitures WHERE id=?', [id], (err,results) => {
    if (err) return res.status(500).json({ error:err.message });
    if (results.length===0) return res.status(404).json({ error:'السيارة غير موجودة' });
    const voiture = results[0];
    if (parseInt(voiture.proprietaire_id) !== parseInt(proprietaire_id))
      return res.status(403).json({ error:'ليس لديك صلاحية لحذف هذه السيارة' });
    db.query('DELETE FROM voitures WHERE id=?', [id], (err2) => {
      if (err2) return res.status(500).json({ error:err2.message });
      res.json({ message:'تم حذف السيارة بنجاح' });
    });
  });
});

app.post('/api/auth/signup', (req,res) => {
  const { name,email,password,role,telephone } = req.body;
  if (!name||!email||!password) return res.status(400).json({ error:'جميع الحقول مطلوبة' });
  db.query('SELECT * FROM proprietaire WHERE email=?', [email], (err,results) => {
    if (err) return res.status(500).json({ error:err.message });
    if (results.length>0) return res.status(400).json({ error:'البريد الإلكتروني مسجل بالفعل' });
    const sql = 'INSERT INTO proprietaire (nom,email,mot_de_passe,role,telephone) VALUES (?,?,?,?,?)';
    db.query(sql, [name,email,password,role||'client', telephone||null], (err,result) => {
      if (err) return res.status(500).json({ error:err.message });
      res.json({ user: { id:result.insertId, name, email, role:role||'client', telephone:telephone||null } });
    });
  });
});

app.post('/api/auth/login', (req,res) => {
  const { email,password } = req.body;
  if (!email||!password) return res.status(400).json({ error:'البريد وكلمة المرور مطلوبان' });
  db.query('SELECT * FROM proprietaire WHERE email=? AND mot_de_passe=?', [email,password], (err,results) => {
    if (err) return res.status(500).json({ error:err.message });
    if (results.length===0) return res.status(401).json({ error:'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    const u = results[0];
    res.json({ user: { id:u.id, name:u.nom, email:u.email, role:u.role||'client', telephone:u.telephone||null } });
  });
});

app.post('/api/reservations', (req,res) => {
  const { car_id, client_id, start_date, end_date, total_price } = req.body;
  if (!car_id||!client_id) return res.status(400).json({ error:'بيانات الحجز ناقصة' });
  const sql = `INSERT INTO reservations (car_id,client_id,start_date,end_date,total_price,status)
               VALUES (?,?,?,?,?,'pending')`;
  db.query(sql, [car_id,client_id,start_date,end_date,total_price], (err,result) => {
    if (err) return res.status(500).json({ error:err.message });
    res.json({ id:result.insertId, message:'تم الحجز بنجاح' });
  });
});


app.get('/api/reservations/client/:clientId/count', (req, res) => {
  const { clientId } = req.params;
  db.query('SELECT COUNT(*) AS count FROM reservations WHERE client_id = ?', [clientId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});


app.get('/api/reservations/client/:clientId', (req, res) => {
  const { clientId } = req.params;
  const sql = `
    SELECT r.*, v.marque, v.modele, v.prix_par_jour
    FROM reservations r
    JOIN voitures v ON r.car_id = v.id
    WHERE r.client_id = ?
    ORDER BY r.created_at DESC
  `;
  db.query(sql, [clientId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(port, () => console.log(`السيرفر شغال على http://localhost:${port}`));
