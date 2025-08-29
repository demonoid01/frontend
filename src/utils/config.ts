export const baseUrl = "https://demonoid.in:3542";

export const apiConfig = {
  baseUrl,
  endpoints: {
    categories: '/categories/',
    hero: '/hero',
    products: '/products',
    orders: '/orders',
    users: '/users',
    auth: '/auth',
  },
  timeout: 30000, // 30 seconds
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
