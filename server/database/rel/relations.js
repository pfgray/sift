
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const User = sequelize.define('users', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    role: { type: Sequelize.STRING, allowNull: false, defaultValue: 'user' },
    username: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
  });
  const Bucket = sequelize.define('buckets', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id'
      }
    },
    apiKey: { type: Sequelize.STRING, allowNull: false, field: 'api_key' },
    name: { type: Sequelize.STRING, allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
  });

  return {
    User,
    Bucket
  };
}
