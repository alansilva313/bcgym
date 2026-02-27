"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutExercise = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Workout_1 = require("./Workout");
const Exercise_1 = require("./Exercise");
class WorkoutExercise extends sequelize_1.Model {
}
exports.WorkoutExercise = WorkoutExercise;
WorkoutExercise.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    workoutId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Workout_1.Workout,
            key: 'id'
        }
    },
    exerciseId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Exercise_1.Exercise,
            key: 'id'
        }
    },
    sets: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 3,
    },
    reps: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 10,
    },
    rest_time: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '60s',
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'WorkoutExercise',
    tableName: 'workout_exercises',
});
// Relationships
Workout_1.Workout.belongsToMany(Exercise_1.Exercise, { through: WorkoutExercise, as: 'exercises', foreignKey: 'workoutId' });
Exercise_1.Exercise.belongsToMany(Workout_1.Workout, { through: WorkoutExercise, as: 'workouts', foreignKey: 'exerciseId' });
Workout_1.Workout.hasMany(WorkoutExercise, { foreignKey: 'workoutId', as: 'workoutExercises' });
WorkoutExercise.belongsTo(Workout_1.Workout, { foreignKey: 'workoutId' });
WorkoutExercise.belongsTo(Exercise_1.Exercise, { foreignKey: 'exerciseId', as: 'exercise' });
