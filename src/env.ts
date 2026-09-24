export const env = {
  apiUrl: import.meta.env.PROD
    ? 'https://inventario-backend-xqi2.onrender.com'
    : 'http://localhost:8082',
}