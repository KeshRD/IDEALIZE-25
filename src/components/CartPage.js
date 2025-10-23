// src/components/CartPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cart');
        console.log('Cart items response:', response.data); // Debug log
        setCartItems(response.data);
      } catch (err) {
        console.error('Fetch cart error:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          navigate('/');
        } else {
          setError('Failed to load cart');
        }
      }
    };
    fetchCart();
  }, [navigate]);

  // Ensure price is a number before calculations
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return isNaN(price) ? sum : sum + item.quantity * price;
  }, 0);

  return (
    <div className="App-header">
      <h2>Your Cart</h2>
      {error && <p className="error">{error}</p>}
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map((item) => (
            <li key={item.cart_item_id}>
              <h3>{item.product_name} - {item.variant_name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${parseFloat(item.price).toFixed(2)}</p>
              <p>Subtotal: ${(item.quantity * parseFloat(item.price)).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
};

export default CartPage;