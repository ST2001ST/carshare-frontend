import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';

function ProviderDashboard() {
  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.role !== 'fournisseur') {
      navigate('/');
      return;
    }
    fetchMyCars();
  }, [user]);

  const fetchMyCars = () => {
    axios.get('http://localhost:5000/api/voitures')
      .then(response => {
        // نفلتر السيارات ديال المزود الحالي فقط
        const userCars = response.data.filter(car => car.proprietaire_id === user?.id);
        setMyCars(userCars);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) return;

    try {
      await axios.delete(`http://localhost:5000/api/voitures/${id}`, {
        data: { proprietaire_id: user?.id }
      });
      alert('تم حذف السيارة بنجاح');
      fetchMyCars();
    } catch (err) {
      alert('خطأ: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>مرحباً {user?.name}</h1>
        <p>هذه هي سياراتك المسجلة</p>
        <Link to="/add" className="btn-add-car">
          إضافة سيارة جديدة
        </Link>
      </div>

      {myCars.length === 0 ? (
        <div className="no-cars">
          <p>لم تقم بإضافة أي سيارة بعد</p>
          <Link to="/add" className="btn-add-first">
            أضف سيارتك الأولى
          </Link>
        </div>
      ) : (
        <div className="dashboard-cars-grid">
          {myCars.map(car => (
            <div key={car.id} className="dashboard-car-card">
              <div className="dashboard-car-info">
                <h3>{car.marque} {car.modele}</h3>
                <p className="matricule">{car.matricule}</p>
                <p className="price">{car.prix_par_jour} {t('priceDay')}</p>
                <p className="location">{car.ville}</p>
                {car.description && <p className="description">{car.description}</p>}
                <button onClick={() => handleDelete(car.id)} className="btn-delete-dash">
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProviderDashboard;
