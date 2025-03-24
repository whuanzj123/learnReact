// Azure AD configuration for MSAL - Custom for Bosch organization
export const msalConfig = {
    auth: {
      clientId: "b3ff27a7-58e9-4eda-81ed-55f0c4e833b6", // KongSSO App ID
      authority: "https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4", // Your tenant ID
      redirectUri: window.location.origin, // Will adapt to current URL
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };
  
  // Use organization-approved scopes instead of User.Read
  export const loginRequest = {
    scopes: [
      "openid", 
      "profile", 
      "email", 
      "offline_access"
    ],
  };
  
  // API scopes if needed
  export const apiRequest = {
    scopes: [`api://${msalConfig.auth.clientId}/access_as_user`],
  };
  
  export const authMethod = {
    usePopup: true, // Set to false if you prefer redirect
  };