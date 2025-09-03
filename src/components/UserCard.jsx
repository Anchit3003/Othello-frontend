import React from 'react';
import './UserCard.css'; // You'll need to create this CSS file

const UserCard = ({ user, onLogout }) => {
  return (
    <div className="user-card">
      <div className="user-info">
        <div className="user-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-details">
          <h4 className="user-name">{user.name || 'User'}</h4>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserCard;