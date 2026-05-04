import React, { createContext, useContext } from 'react';

const translations = {
  home: 'الرئيسية',
  cars: 'السيارات',
  carsTitle: 'السيارات المتاحة',
  addCar: 'إضافة سيارة',
  dashboard: 'لوحة التحكم',
  dashboardTitle: 'لوحة التحكم',
  dashboardSubtitle: 'السيارات التي قمت بإضافتها',
  heroTitle: 'تأجير السيارات بكل ثقة',
  heroSubtitle: 'أفضل السيارات بأفضل الأسعار. اختر سيارتك المثالية اليوم',
  heroBtn: 'استكشف السيارات',
  becomeProvider: 'كن مزوداً',
  featuresTitle: 'لماذا تختار CarShare؟',
  featuresSubtitle: 'خدمات مميزة لتجربة فريدة',
  feature1Title: 'سيارات متنوعة',
  feature1Desc: 'تشكيلة واسعة من السيارات تناسب جميع الاحتياجات',
  feature2Title: 'أسعار تنافسية',
  feature2Desc: 'أفضل الأسعار مع ضمان الجودة والخدمة',
  feature3Title: 'حجز سهل وسريع',
  feature3Desc: 'عملية حجز مبسطة في خطوات قليلة',
  login: 'تسجيل الدخول',
  signup: 'إنشاء حساب',
  logout: 'تسجيل خروج',
  welcome: 'مرحباً',
  priceDay: 'درهم/اليوم',
  reserve: 'حجز',
  delete: 'حذف',
  edit: 'تعديل',
  noCarsYet: 'لم تقم بإضافة أي سيارة بعد',
  addFirstCar: 'أضف سيارتك الأولى',
  filterCity: 'المدينة',
  filterBrand: 'الماركة',
  filterPrice: 'السعر الأقصى',
  search: 'بحث',
  reset: 'إعادة تعيين',
  noResults: 'لا توجد سيارات مطابقة',
  brand: 'العلامة (ماركة)',
  model: 'الموديل',
  matricule: 'رقم الماتريكول',
  pricePerDay: 'السعر لليوم (درهم)',
  city: 'المدينة',
  description: 'وصف السيارة',
  adding: 'جاري الإضافة...'
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const t = (key) => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
