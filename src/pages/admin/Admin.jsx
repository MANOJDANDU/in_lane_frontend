import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8001/api/admin/login', {
        username,
        password
      });
      if (res.data?.success && res.data.message) {
        toast.error(res.data.message);
      }
      if (res.data.success) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('authToken', res.data.data.authToken);
        localStorage.setItem('_id', res.data.data._id);
        toast.success(res.data.message || 'Login Success');
        // setTimeout(() => {
          navigate('/admin/dashboard');
        // }, 1000); // short delay to ensure localStorage is updated
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Invalid credentials or server error');
    }
  };

  return (
    <div className="admin-login-bg">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default AdminLogin;
