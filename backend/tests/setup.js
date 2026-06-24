// Configuration de l'environnement de test
module.exports = async () => {
  process.env.NODE_ENV    = 'test';
  process.env.JWT_SECRET  = 'test_secret_key';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.DB_HOST     = process.env.DB_HOST     || 'mysql';
  process.env.DB_PORT     = process.env.DB_PORT     || '3306';
  process.env.DB_NAME     = process.env.DB_NAME     || 'fittrack';
  process.env.DB_USER     = process.env.DB_USER     || 'fittrack_user';
  process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'fittrack_pass';
};
