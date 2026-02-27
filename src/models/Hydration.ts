import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Hydration extends Model {
    public id!: number;
    public userId!: number;
    public amount!: number;
    public date!: string;
}

Hydration.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Hydration',
});
