import { msalConfig, loginRequest, apiRequest, authMethod } from '../authConfig';
import { PublicClientApplication } from '@azure/msal-browser';

class AuthService {
  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  // Initialize authentication
  init() {
    // Handle redirect promise on page load
    return this.msalInstance.handleRedirectPromise()
      .then(this.handleResponse)
      .catch(error => {
        console.error('MSAL Redirect Error:', error);
      });
  }

  // Handle authentication response
  handleResponse(response) {
    if (response) {
      console.log('Authentication response:', response);
    }
  }

  // Get active account
  getAccount() {
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      return null;
    }
    return accounts[0];
  }

  // Login - using organization-approved scopes
  login() {
    // Ensure we're requesting the approved scopes
    const request = {
      ...loginRequest,
      prompt: 'select_account' // Force account selection each time
    };

    if (authMethod.usePopup) {
      return this.msalInstance.loginPopup(request)
        .then(response => {
          console.log('Login successful', response);
          return response;
        })
        .catch(error => {
          console.error('Login failed', error);
          throw error;
        });
    } else {
      this.msalInstance.loginRedirect(request);
      // Redirect methods don't return promises
      return Promise.resolve();
    }
  }

  // Logout
  logout() {
    const logoutRequest = {
      account: this.getAccount(),
      postLogoutRedirectUri: window.location.origin
    };

    if (authMethod.usePopup) {
      return this.msalInstance.logoutPopup(logoutRequest);
    } else {
      return this.msalInstance.logoutRedirect(logoutRequest);
    }
  }

  // Acquire token silently - using organization-approved scopes
  getToken() {
    const account = this.getAccount();
    if (!account) {
      return Promise.reject('No active account found');
    }

    // For API access
    const request = {
      ...apiRequest,
      account: account
    };

    return this.msalInstance.acquireTokenSilent(request)
      .then(response => {
        return response.accessToken;
      })
      .catch(error => {
        console.error('Silent token acquisition failed', error);
        
        // If silent acquisition fails, try interactive method
        if (authMethod.usePopup) {
          return this.msalInstance.acquireTokenPopup(request)
            .then(response => {
              return response.accessToken;
            });
        } else {
          this.msalInstance.acquireTokenRedirect(request);
          return Promise.reject('Redirecting for token acquisition');
        }
      });
  }
  
  // Get ID token for user profile data
  getIdTokenClaims() {
    const account = this.getAccount();
    if (!account) {
      return null;
    }
    
    return this.msalInstance.getActiveAccount().idTokenClaims;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAccount();
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;