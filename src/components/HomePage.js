// src/components/HomePage.js (Updated: Added token check, View Cart button, logout clears storage)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <div className="App-header">
      <h2>Our Products</h2>
      <div className="button-group">
        <button onClick={() => navigate('/chatbot')}>AI Chatbot</button> {/* New button */}
        <button onClick={() => navigate('/cart')}>View Cart</button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.product_id} className="product-card" onClick={() => handleProductClick(product.product_id)}>
            <h3>{product.product_name}</h3>
            <p>{product.description}</p>
            <p>Starting at: ${Math.min(...product.variants.map(v => v.price)).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;