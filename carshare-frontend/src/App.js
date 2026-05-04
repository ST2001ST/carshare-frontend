import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import AddArticle from './pages/AddArticle';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProviderDashboard from './pages/ProviderDashboard';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/add" element={<AddArticle />} />
          <Route
            path="/dashboard"
            element={user?.role === 'fournisseur' ? <ProviderDashboard /> : <LoginPage />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
