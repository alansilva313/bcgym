import { User } from './User';
import { Exercise } from './Exercise';
import { Workout } from './Workout';
import { WorkoutExercise } from './WorkoutExercise';
import { Hydration } from './Hydration';
import { WorkoutSession } from './WorkoutSession';
import { Measurement } from './Measurement';

// Relationships
User.hasMany(Hydration, { foreignKey: 'userId' });
Hydration.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Measurement, { foreignKey: 'userId' });
Measurement.belongsTo(User, { foreignKey: 'userId' });

export {
    User,
    Exercise,
    Workout,
    WorkoutExercise,
    Hydration,
    WorkoutSession,
    Measurement
};
