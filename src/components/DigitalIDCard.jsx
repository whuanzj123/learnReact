import { useState } from 'react';
import './DigitalIDCard.css';

function DigitalIDCard({ userData }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Format the expiration date from JWT timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  // Calculate days until expiration
  const getDaysUntilExpiration = () => {
    const now = Math.floor(Date.now() / 1000);
    const secondsRemaining = userData.exp - now;
    return Math.max(0, Math.floor(secondsRemaining / 86400));
  };
  
  // Get initials for avatar
  const getInitials = () => {
    const name = userData.name || userData.preferred_username || '';
    return name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  return (
    <div className="id-card">
      <div className="id-card-header">
        <div className="id-logo">ID</div>
        <h2>Digital Identity Card</h2>
        <div className="id-number">#{userData.sub.substring(0, 8)}</div>
      </div>
      
      <div className="id-card-body">
        <div className="id-photo">
          <div className="avatar">{getInitials()}</div>
        </div>
        
        <div className="id-details">
          <h3>{userData.name}</h3>
          <p><span>Email:</span> {userData.email || userData.upn}</p>
          <p><span>User ID:</span> {userData.sub.substring(0, 12)}...</p>
          <p><span>Expires:</span> {formatDate(userData.exp)}</p>
          <p><span>Valid for:</span> {getDaysUntilExpiration()} days</p>
          
          {userData.roles && userData.roles.length > 0 && (
            <p><span>Roles:</span> {userData.roles.join(', ')}</p>
          )}
        </div>
      </div>
      
      <div className="id-card-footer">
        <button 
          className="details-toggle" 
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Token Details' : 'Show Token Details'}
        </button>
        
        {showDetails && (
          <div className="token-details">
            <h4>JWT Token Details</h4>
            <pre>{JSON.stringify(userData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default DigitalIDCard;