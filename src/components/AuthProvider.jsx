import React from 'react';
import { MsalProvider, MsalAuthenticationTemplate } from '@azure/msal-react';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Loading component while authentication is processing
const Loading = () => <div className="auth-loading">Authenticating...</div>;

// Error component if authentication fails
const ErrorComponent = ({ error }) => (
  <div className="auth-error">
    <h2>Authentication Error</h2>
    <p>{error.errorMessage}</p>
  </div>
);

// Optional: Component to protect authenticated content
export const AuthenticatedTemplate = ({ children }) => {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      loadingComponent={Loading}
      errorComponent={ErrorComponent}
    >
      {children}
    </MsalAuthenticationTemplate>
  );
};

// Main Auth Provider component
export const AuthProvider = ({ children }) => {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export default AuthProvider;