// src/components/AuthPage.js (Updated: Handle token and user storage, auto-redirect if logged in)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Registered Customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login
      try {
        const response = await axios.post('http://localhost:5000/login', { email, password });
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          navigate('/home');
        } else {
          setError('Please enter valid credentials');
        }
      } catch (err) {
        setError('Login failed');
      }
    } else {
      // Signup
      if (!name || !email || !password || !phone || !role) {
        setError('Please fill all fields');
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/signup', { name, email, password, phone, role });
        if (response.data.success) {
          setIsLogin(true);
          setError('Signup successful! Please login.');
        } else {
          setError('Signup failed');
        }
      } catch (err) {
        setError('Signup failed');
      }
    }
  };

  return (
    <div className="App-header">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Registered Customer">Registered Customer</option>
              <option value="Admin">Admin</option>
              <option value="Delivery Driver">Delivery Driver</option>
            </select>
          </>
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AuthPage;