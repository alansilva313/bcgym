"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
class Workout extends sequelize_1.Model {
}
exports.Workout = Workout;
Workout.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    goal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    daysOfWeek: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'Workout',
    tableName: 'workouts',
});
// Relationships
User_1.User.hasMany(Workout, { foreignKey: 'userId', as: 'workouts' });
Workout.belongsTo(User_1.User, { foreignKey: 'userId', as: 'user' });
