import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import './LoginButton.css';

const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .catch(error => {
        console.error('Login failed', error);
      });
  };

  return (
    <button className="azure-login-button bosch-style" onClick={handleLogin}>
      <svg className="azure-icon" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
        <path fill="#F25022" d="M1 1h10v10H1z"/>
        <path fill="#00A4EF" d="M1 12h10v10H1z"/>
        <path fill="#7FBA00" d="M12 1h10v10H12z"/>
        <path fill="#FFB900" d="M12 12h10v10H12z"/>
      </svg>
      Sign in with Bosch Account
    </button>
  );
};

export default LoginButton;