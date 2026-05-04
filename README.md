 CarShare - منصة كراء السيارات

كيفية تشغيل المشروع

1. إعداد قاعدة البيانات
افتح MySQL وشغل ملف `database.sql`:

mysql -u root -p < database.sql


2. تشغيل Backend (السيرفر)

```bash
cd carshare-api
npm install
node server.js
```
السيرفر يشتغل على: http://localhost:5000

3. تشغيل Frontend (الواجهة)

```bash
cd carshare-frontend
npm install
npm start
```
الموقع يفتح على: http://localhost:3000


 حسابات تجريبية للاختبار

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| مزود | ahmed@example.com | 1234 |
| مزود | sara@example.com | 1234 |
| زبون | youssef@example.com | 1234 |


