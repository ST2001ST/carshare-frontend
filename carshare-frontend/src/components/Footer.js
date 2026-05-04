import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="footer-logo">
            <img src="/logo.png" alt="CarShare" className="footer-logo-img" />
          </div>
          <p>أول منصة مغربية لكراء السيارات بين الأفراد، تجمع بين أفضل المزودين وأدوات الحجز الذكية.</p>
        </div>

        <div className="footer-col">
          <h4>روابط سريعة</h4>
          <ul className="footer-links">
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/cars">السيارات</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>تواصل معنا</h4>
          <ul className="footer-contact">
            <li>المغرب</li>
            <li>+212 5 22 11 22 33</li>
            <li>contact@carshare.ma</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
