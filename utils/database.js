const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'node-complete', 
  'root', 
  'wrpnst1492', 
  {
    dialect: 'mysql', 
    host: 'localhost'
  }
);

module.exports = sequelize;
