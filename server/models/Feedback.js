import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import User from './User.js';

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { // הוספה כאן
      model: User, // מתייחס למודל User
      key: 'id'    // לעמודה 'id' במודל User
    },
  },
  content: { type: DataTypes.STRING(1000), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
  {
    tableName: 'FEEDBACK',
    timestamps: false
  });

// Association: כל פידבק שייך למשתמש
Feedback.belongsTo(User, { foreignKey: 'userId' });

export default Feedback;