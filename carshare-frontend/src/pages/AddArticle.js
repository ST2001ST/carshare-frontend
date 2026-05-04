import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

function AddArticle() {
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [matricule, setMatricule] = useState('');
  const [prix, setPrix] = useState('');
  const [ville, setVille] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!marque || !modele || !prix || !ville) {
      setMessage('الرجاء ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/voitures`, {
        marque,
        modele,
        matricule: matricule || '',
        prix_par_jour: parseFloat(prix),
        ville,
        description,
        proprietaire_id: user?.id
      });

      setMessage('تم إضافة السيارة بنجاح!');
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err) {
      setMessage('خطأ: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-article">
      <h2>{t('addCar')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('brand')}</label>
          <input
            type="text"
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
            placeholder="مثال: Dacia, Renault, Mercedes"
            required
          />
        </div>
        <div className="form-group">
          <label>{t('model')}</label>
          <input
            type="text"
            value={modele}
            onChange={(e) => setModele(e.target.value)}
            placeholder="مثال: Logan, Clio, Class A"
            required
          />
        </div>
        <div className="form-group">
          <label>{t('matricule')}</label>
          <input
            type="text"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            placeholder="مثال: 1234-A-56"
          />
        </div>
        <div className="form-group">
          <label>{t('pricePerDay')}</label>
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="مثال: 250"
            required
          />
        </div>
        <div className="form-group">
          <label>{t('city')}</label>
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="مثال: الدار البيضاء، الرباط"
            required
          />
        </div>
        <div className="form-group">
          <label>{t('description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="مثال: سيارة بحالة جيدة، مكيفة، سنة 2022..."
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? t('adding') : t('addCar')}
        </button>
        {message && (
          <p className={`message ${message.includes('بنجاح') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddArticle;
