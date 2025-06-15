import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import User from './User.js';

const Password = sequelize.define('Password', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// הגדרת הקשר בין המשתמש לסיסמה
User.hasOne(Password, { foreignKey: 'userId' });
Password.belongsTo(User, { foreignKey: 'userId' });

export default Password; 