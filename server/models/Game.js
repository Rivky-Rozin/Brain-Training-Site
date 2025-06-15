import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    difficulty: {
        type: DataTypes.INTEGER,
        defaultValue: 1  // 1 = קל, 2 = בינוני, 3 = קשה
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1 = זיכרון, 2 = זריזות ידיים, 3 = מחשבה, 4 = תפיסה מרחבית, 5 = תגובה מהירה'
    }
});

export default Game; 