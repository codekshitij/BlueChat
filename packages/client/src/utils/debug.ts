// Debug utility to decode JWT tokens
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return null;
  }
}

// Log current user token info
export function debugCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found in localStorage');
    return;
  }
  
  const decoded = decodeJWT(token);
  console.log('=== JWT Token Debug ===');
  console.log('Token:', token.substring(0, 20) + '...');
  console.log('Decoded payload:', decoded);
  console.log('UserID:', decoded?.userId);
  console.log('Username:', decoded?.username);
  console.log('Expiry:', decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : 'N/A');
  console.log('=====================');
  return decoded;
}
