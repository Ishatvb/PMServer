const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
  },
  user_type: {
    type: DataTypes.CHAR(1),
    allowNull: false,
  },
  phone_no: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  pwd_hash: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'user_auth',
  timestamps: false, // Assuming there are no createdAt and updatedAt columns
});

module.exports = User;