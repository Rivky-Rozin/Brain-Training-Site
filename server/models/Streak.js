import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import User from './User.js';
import Game from './Game.js';

const Streak = sequelize.define('Streak', {
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
    currentStreak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    bestStreak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    lastPlayedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// הגדרת הקשרים
User.hasMany(Streak, { foreignKey: 'userId' });
Streak.belongsTo(User, { foreignKey: 'userId' });

Game.hasMany(Streak, { foreignKey: 'gameId' });
Streak.belongsTo(Game, { foreignKey: 'gameId' });

export default Streak; 