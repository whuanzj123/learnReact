import { useState, useEffect } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
// import TokenForm from './components/TokenForm';
import DigitalIDCard from './components/DigitalIDCard';
import LoginButton from './components/LoginButton';
import './App.css';

// Component that requires authentication
const AuthenticatedContent = () => {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [azureToken, setAzureToken] = useState(null);

  // When component mounts, get Azure AD token
  useEffect(() => {
    if (accounts.length > 0) {
      // Get token silently
      instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account: accounts[0]
      }).then(response => {
        console.log('Azure AD token acquired:', response);
        setAzureToken(response.accessToken);
        
        // Decode the token to get user info
        const tokenParts = response.accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setTokenData(payload);
        }
      }).catch(error => {
        console.error('Token acquisition failed:', error);
        setError('Failed to acquire token: ' + error.message);
      });
    }
  }, [instance, accounts]);

  const handleLogout = () => {
    instance.logout();
  };

  // If we have Azure AD token and user data, display the ID card
  return (
    <div className="authenticated-content">
      <header>
        <div className="header-content">
          <h1>Digital ID Card System</h1>
          <button onClick={handleLogout} className="logout-button">Sign Out</button>
        </div>
      </header>

      <main>
        {tokenData ? (
          <DigitalIDCard userData={tokenData} />
        ) : loading ? (
          <div className="loading">Loading ID card...</div>
        ) : (
          <div className="no-data">Retrieving your information...</div>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </main>
    </div>
  );
};

// Main App component
function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <div className="login-container">
          <h1>Digital ID Card System</h1>
          <p>Please sign in with your Azure AD account to access your digital ID card.</p>
          <LoginButton />
        </div>
      ) : (
        <AuthenticatedContent />
      )}
    </div>
  );
}

// Wrapped App with Authentication Provider
const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;