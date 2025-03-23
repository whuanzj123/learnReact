import { useState } from 'react';
import TokenForm from './components/TokenForm';
import DigitalIDCard from './components/DigitalIDCard';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to request token from backend
  const requestToken = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate token');
      }

      const data = await response.json();
      setToken(data.access_token);
      
      // Now verify the token to get the decoded data
      await verifyToken(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to verify and decode the token
  const verifyToken = async (accessToken) => {
    try {
      const response = await fetch('http://localhost:8000/verify-token', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to verify token');
      }

      const data = await response.json();
      setTokenData(data.payload);
    } catch (err) {
      setError(err.message);
    }
  };

  // Reset state to request a new token
  const handleReset = () => {
    setToken(null);
    setTokenData(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Digital ID Card System</h1>
      </header>

      <main>
        {!token ? (
          <TokenForm onSubmit={requestToken} loading={loading} />
        ) : (
          <>
            {tokenData && <DigitalIDCard userData={tokenData} />}
            <button onClick={handleReset} className="reset-button">
              Request New ID Card
            </button>
          </>
        )}

        {error && <div className="error-message">{error}</div>}
      </main>
    </div>
  );
}

export default App;