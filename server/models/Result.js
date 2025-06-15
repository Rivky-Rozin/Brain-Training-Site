import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import User from './User.js';
import Game from './Game.js';

const Result = sequelize.define('Result', {
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
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Game,
            key: 'id'
        }
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    timeSpent: {
        type: DataTypes.INTEGER,  // זמן בשניות
        allowNull: false,
        defaultValue: 0
    },
    completedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// הגדרת הקשרים
User.hasMany(Result, { foreignKey: 'userId' });
Result.belongsTo(User, { foreignKey: 'userId' });

Game.hasMany(Result, { foreignKey: 'gameId' });
Result.belongsTo(Game, { foreignKey: 'gameId' });

export default Result; 