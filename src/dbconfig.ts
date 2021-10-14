export const db = {
  servername: process.env.API_DB_HOST || 'localhost',
  serverport: parseInt(process.env.API_DB_PORT) || 3306,
  dbname: process.env.API_DB_NAME || 'shop',
  username: process.env.API_DB_USER || 'root',
  password: process.env.API_DB_PASS || '',
};
