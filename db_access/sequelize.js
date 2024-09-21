const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_VERCEL_URL, {
  dialect: 'postgres',
  logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;