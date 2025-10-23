// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    // Set auth header for axios from localStorage token
    const token = localStorage.getItem('token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchProduct = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products/' + productId);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const handleAddToCart = async (variantId) => {
    try {
      const response = await axios.post('http://localhost:5000/cart/add', { variant_id: variantId, quantity: 1 });
      if (response.data.success) {
        alert('Added to cart!');
      } else {
        setError(response.data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');
      } else {
        setError(err.response?.data?.message || 'Failed to add to cart');
      }
    }
  };

  if (!product) return <div className="App-header">{error || 'Loading...'}</div>;

  return (
    <div className="App-header product-detail">
      <h2>{product.product_name}</h2>
      <p>{product.description}</p>
      <h3>Category: {product.category_name}</h3>
      <p>SKU: {product.SKU}</p>
      <h3>Variants</h3>
      {error && <p className="error">{error}</p>}
      <ul>
        {product.variants.map((variant) => (
          <li key={variant.variant_id}>
            <p>Variant: {variant.variant_name}</p>
            <p>Price: ${variant.price.toFixed(2)}</p>
            <p>Stock: {variant.stock_quantity} units</p>
            <button onClick={() => handleAddToCart(variant.variant_id)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetail;