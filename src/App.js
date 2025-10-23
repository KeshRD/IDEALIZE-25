// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import ChatbotPage from './components/ChatbotPage'; // Correct import
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} /> {/* Correct PascalCase */}
      </Routes>
    </div>
  );
}

export default App;