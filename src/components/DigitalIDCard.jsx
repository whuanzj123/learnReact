import { useState } from 'react';
import './DigitalIDCard.css';

function DigitalIDCard({ userData }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Format the expiration date from JWT timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  // Calculate days until expiration
  const getDaysUntilExpiration = () => {
    if (!userData.exp) return 'N/A';
    const now = Math.floor(Date.now() / 1000);
    const secondsRemaining = userData.exp - now;
    return Math.max(0, Math.floor(secondsRemaining / 86400));
  };
  
  // Get initials for avatar
  const getInitials = () => {
    // For Azure AD tokens, check various name claims
    const name = userData.name || 
                 userData.given_name || 
                 userData.preferred_username || 
                 '';
                 
    return name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  // Get user email from various possible claims
  const getUserEmail = () => {
    return userData.preferred_username || 
           userData.email || 
           userData.upn || 
           'No email available';
  };

  // Get user ID from various possible claims
  const getUserId = () => {
    return (userData.oid || userData.sub || 'Unknown').substring(0, 12) + '...';
  };

  // Get role information
  const getUserRoles = () => {
    if (userData.roles && userData.roles.length > 0) {
      return userData.roles.join(', ');
    }
    
    // For Azure AD role claims format
    if (userData.wids && userData.wids.length > 0) {
      return userData.wids.join(', ');
    }
    
    return 'No roles assigned';
  };

  return (
    <div className="id-card">
      <div className="id-card-header">
        <div className="id-logo">ID</div>
        <h2>Digital Identity Card</h2>
        <div className="id-number">#{getUserId()}</div>
      </div>
      
      <div className="id-card-body">
        <div className="id-photo">
          <div className="avatar">{getInitials()}</div>
        </div>
        
        <div className="id-details">
          <h3>{userData.name || userData.preferred_username || 'User'}</h3>
          <p><span>Email:</span> {getUserEmail()}</p>
          <p><span>User ID:</span> {getUserId()}</p>
          
          {userData.exp && (
            <>
              <p><span>Expires:</span> {formatDate(userData.exp)}</p>
              <p><span>Valid for:</span> {getDaysUntilExpiration()} days</p>
            </>
          )}
          
          <p><span>Roles:</span> {getUserRoles()}</p>
          
          {userData.tid && (
            <p><span>Tenant:</span> {userData.tid}</p>
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