import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 0  // 0 = משתמש רגיל, 1 = מנהל
    }
}, {
    tableName: 'users',
    timestamps: true
});

export default User; 