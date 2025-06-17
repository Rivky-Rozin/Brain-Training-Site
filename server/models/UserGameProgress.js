// server/models/UserGameProgress.js
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const UserGameProgress = sequelize.define('UserGameProgress', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:       { type: DataTypes.INTEGER, allowNull: false },
  gameId:       { type: DataTypes.INTEGER, allowNull: false },
  difficulty:  { type: DataTypes.TINYINT, allowNull: false },
  timeSpent:    { type: DataTypes.INTEGER, allowNull: false },
  attempts:     { type: DataTypes.INTEGER, allowNull: false },
  score:        { type: DataTypes.FLOAT, allowNull: false },
  completedAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  indexes: [{ unique: true, fields: ['userId','gameId','difficulty'] }]
});

export default UserGameProgress;
