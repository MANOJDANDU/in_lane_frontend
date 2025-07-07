import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-background">
      <div className="home-content">
        <h1>Welcome to InLane Portal</h1>
        <div>
          <button onClick={() => navigate('/user/register')}>User Register</button>
          <button onClick={() => navigate('/admin/login')}>Admin Login</button>
        </div>
      </div>
    </div>
  );
}

export default Home;