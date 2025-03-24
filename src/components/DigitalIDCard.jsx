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
  
  // Get initials for avatar - using available claims
  const getInitials = () => {
    // Try all possible name claims for your organization
    if (userData.given_name && userData.family_name) {
      return (userData.given_name[0] + userData.family_name[0]).toUpperCase();
    }
    
    const username = userData.preferred_username || userData.email || '';
    
    // If it's an email, use the first part
    if (username.includes('@')) {
      return username.split('@')[0].substring(0, 2).toUpperCase();
    }
    
    return username.substring(0, 2).toUpperCase() || 'ID';
  };

  // Get user's display name from available claims
  const getDisplayName = () => {
    if (userData.given_name && userData.family_name) {
      return `${userData.given_name} ${userData.family_name}`;
    }
    
    if (userData.preferred_username) {
      if (userData.preferred_username.includes('@')) {
        return userData.preferred_username.split('@')[0];
      }
      return userData.preferred_username;
    }
    
    return userData.email ? userData.email.split('@')[0] : 'User';
  };

  // Get user email from various possible claims
  const getUserEmail = () => {
    return userData.email || userData.preferred_username || 'No email available';
  };

  // Get user ID from various possible claims
  const getUserId = () => {
    return (userData.oid || userData.sub || userData.tid || 'Unknown').substring(0, 12) + '...';
  };

  // Get role information - handle app roles from your organization
  const getUserRoles = () => {
    // Check for custom app roles
    if (userData.roles && userData.roles.length > 0) {
      return userData.roles.join(', ');
    }
    
    // Your app has API.Admin and API.User roles
    // We need to check if any claims indicate these roles
    if (Object.prototype.hasOwnProperty.call(userData, 'API.Admin') || 
    Object.prototype.hasOwnProperty.call(userData, 'API.User'))  {
      const roles = [];
      if (userData['API.Admin']) roles.push('API Admin');
      if (userData['API.User']) roles.push('API User');
      return roles.join(', ');
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
          <h3>{getDisplayName()}</h3>
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
          
          {userData.in_corp !== undefined && (
            <p><span>Corporate User:</span> {userData.in_corp ? 'Yes' : 'No'}</p>
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