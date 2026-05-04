const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@2026',
    database: 'gestion_produits'
});

connection.connect((err) => {
    if (err) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err);
        return;
    }
    console.log('تم الاتصال بقاعدة البيانات بنجاح');
});

module.exports = connection;
