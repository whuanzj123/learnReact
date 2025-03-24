// Azure AD configuration for MSAL
export const msalConfig = {
    auth: {
      clientId: "b3ff27a7-58e9-4eda-81ed-55f0c4e833b6", // KongSSO App ID
      authority: "https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4", // Your tenant ID
      redirectUri: window.location.origin, // Defaults to the current app URL
    },
    cache: {
      cacheLocation: "sessionStorage", // "sessionStorage" or "localStorage"
      storeAuthStateInCookie: false, // Set to true for IE 11 support
    },
  };
  
  // Add scopes for token request
  export const loginRequest = {
    scopes: ["User.Read"], // Default Microsoft Graph scope for user profile
  };
  
  // Add any API scopes your backend requires
  export const apiRequest = {
    scopes: [`api://${msalConfig.auth.clientId}/access_as_user`], // Replace with your API scope if different
  };
  
  // Configure auth to use popup or redirect
  export const authMethod = {
    usePopup: true, // Set to false if you prefer redirect
  };