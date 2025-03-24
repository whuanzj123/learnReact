import { useState, useEffect } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import DigitalIDCard from './components/DigitalIDCard';
import LoginButton from './components/LoginButton';
import './App.css';

// Component that requires authentication
const AuthenticatedContent = () => {
  const { instance, accounts } = useMsal();
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // When component mounts, get token claims
  useEffect(() => {
    if (accounts.length > 0) {
      setLoading(true);
      
      try {
        // Get ID token claims directly - more reliable than parsing the token
        const idTokenClaims = accounts[0].idTokenClaims;
        
        if (idTokenClaims) {
          console.log('ID token claims retrieved:', idTokenClaims);
          setTokenData(idTokenClaims);
          setLoading(false);
        } else {
          // Fallback to manual token acquisition if needed
          instance.acquireTokenSilent({
            scopes: ['openid', 'profile', 'email'],
            account: accounts[0]
          }).then(response => {
            console.log('Token acquired:', response);
            
            // Try to parse the ID token (JWT)
            if (response.idToken) {
              try {
                const tokenParts = response.idToken.split('.');
                if (tokenParts.length === 3) {
                  // Base64 decode and parse the token payload (middle part)
                  const payload = JSON.parse(atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')));
                  setTokenData(payload);
                }
              } catch (parseError) {
                console.error('Error parsing token:', parseError);
                setError('Error parsing token: ' + parseError.message);
              }
            }
            
            setLoading(false);
          }).catch(error => {
            console.error('Token acquisition failed:', error);
            setError('Failed to acquire token: ' + error.message);
            setLoading(false);
          });
        }
      } catch (e) {
        console.error('Error retrieving token data:', e);
        setError('Error retrieving token data: ' + e.message);
        setLoading(false);
      }
    }
  }, [instance, accounts]);

  const handleLogout = () => {
    instance.logout();
  };

  // Display the ID card with the token data
  return (
    <div className="authenticated-content">
      <header>
        <div className="header-content">
          <h1>Digital ID Card System</h1>
          <button onClick={handleLogout} className="logout-button">Sign Out</button>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading your ID card...</div>
        ) : tokenData ? (
          <DigitalIDCard userData={tokenData} />
        ) : (
          <div className="no-data">Could not retrieve your information.</div>
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
          <p>Please sign in with your Bosch account to access your digital ID card.</p>
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