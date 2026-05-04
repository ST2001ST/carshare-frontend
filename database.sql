-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS gestion_produits;
USE gestion_produits;

-- جدول المستخدمين (مزودين + زبائن)
-- تم إضافة عمود mot_de_passe و role اللي كانوا ناقصين
CREATE TABLE IF NOT EXISTS proprietaire (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('client', 'fournisseur') DEFAULT 'client',
    telephone VARCHAR(20)
);

-- جدول السيارات
CREATE TABLE IF NOT EXISTS voitures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    matricule VARCHAR(20),
    annee INT,
    prix_par_jour DECIMAL(10,2) NOT NULL,
    ville VARCHAR(50) NOT NULL,
    image VARCHAR(500),
    description TEXT,
    proprietaire_id INT,
    FOREIGN KEY (proprietaire_id) REFERENCES proprietaire(id)
);

-- بيانات تجريبية: مزودين
INSERT INTO proprietaire (nom, email, mot_de_passe, role, telephone) VALUES 
('أحمد العلوي', 'ahmed@example.com', '1234', 'fournisseur', '0612345678'),
('سارة بناني', 'sara@example.com', '1234', 'fournisseur', '0623456789');

-- بيانات تجريبية: زبون
INSERT INTO proprietaire (nom, email, mot_de_passe, role) VALUES 
('يوسف الزبون', 'youssef@example.com', '1234', 'client');

-- بيانات تجريبية: سيارات
INSERT INTO voitures (marque, modele, matricule, annee, prix_par_jour, ville, image, description, proprietaire_id) VALUES 
('Dacia', 'Logan', '1234-A-56', 2022, 250, 'الدار البيضاء', 'https://placehold.co/600x400', 'سيارة اقتصادية بحالة جيدة', 1),
('Renault', 'Clio', '5678-B-12', 2023, 300, 'الرباط', 'https://placehold.co/600x400', 'سيارة حديثة ومكيفة', 1),
('Mercedes', 'Class A', '9999-C-01', 2021, 600, 'مراكش', 'https://placehold.co/600x400', 'سيارة فاخرة', 2);
