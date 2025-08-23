import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../Actions/dashboard';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { prof } = useSelector((state) => state.user);
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  return (
    <header className="header">
      <div className="header-container">
        {/* Left side - Logo/Brand */}
        <div className="header-brand">
          {/* <div className="brand-logo">📚</div> */}
          <div className="brand-text">
            <h1 className="brand-title">FACULTY PORTAL</h1>
            <span className="brand-subtitle">Dashboard</span>
          </div>
        </div>
        
        {/* Right side - User info and logout */}
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">
              {prof?.iid ? prof.iid.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="user-details">
              <span className="user-greeting">Hello,</span>
              <span className="user-id">{prof?.iid || 'Professor'}</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="logout-button"
            aria-label="Logout"
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;