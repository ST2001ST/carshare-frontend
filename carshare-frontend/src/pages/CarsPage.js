import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarsGrid from '../components/CarsGrid';
import { useLanguage } from '../context/LanguageContext';

function CarsPage() {
  const [voitures, setVoitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ ville: '', marque: '', prixMax: '' });
  const [allVoitures, setAllVoitures] = useState([]);
  const { t } = useLanguage();

  const fetchVoitures = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/voitures`)
      .then(response => {
        setAllVoitures(response.data);
        setVoitures(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchVoitures();
  }, []);

  const handleFilter = () => {
    let filtered = [...allVoitures];
    if (filters.ville.trim()) {
      filtered = filtered.filter(car =>
        car.ville.toLowerCase().includes(filters.ville.toLowerCase())
      );
    }
    if (filters.marque.trim()) {
      filtered = filtered.filter(car =>
        car.marque.toLowerCase().includes(filters.marque.toLowerCase())
      );
    }
    if (filters.prixMax) {
      filtered = filtered.filter(car => car.prix_par_jour <= parseInt(filters.prixMax));
    }
    setVoitures(filtered);
  };

  const resetFilters = () => {
    setFilters({ ville: '', marque: '', prixMax: '' });
    setVoitures(allVoitures);
  };

  if (loading) return <div className="loading-spinner">جاري التحميل...</div>;

  return (
    <div className="cars-page">
      <div className="container">
        <h1 className="page-title">{t('carsTitle')}</h1>

        <div className="filters-section">
          <input
            type="text"
            placeholder={t('filterCity')}
            value={filters.ville}
            onChange={(e) => setFilters({ ...filters, ville: e.target.value })}
          />
          <input
            type="text"
            placeholder={t('filterBrand')}
            value={filters.marque}
            onChange={(e) => setFilters({ ...filters, marque: e.target.value })}
          />
          <input
            type="number"
            placeholder={t('filterPrice')}
            value={filters.prixMax}
            onChange={(e) => setFilters({ ...filters, prixMax: e.target.value })}
          />
          <button className="btn-filter" onClick={handleFilter}>{t('search')}</button>
          <button className="btn-reset" onClick={resetFilters}>{t('reset')}</button>
        </div>

        {voitures.length === 0 ? (
          <div className="no-results">{t('noResults')}</div>
        ) : (
          <CarsGrid voitures={voitures} onRefresh={fetchVoitures} />
        )}
      </div>
    </div>
  );
}

export default CarsPage;
