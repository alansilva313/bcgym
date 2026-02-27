import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Measurement extends Model {
    public id!: number;
    public userId!: number;
    public date!: string;
    public weight!: number;
    public chest!: number;
    public waist!: number;
    public hips!: number;
    public leftArm!: number;
    public rightArm!: number;
    public leftThigh!: number;
    public rightThigh!: number;
    public leftCalf!: number;
    public rightCalf!: number;
    public shoulders!: number;
}

Measurement.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    weight: { type: DataTypes.FLOAT, allowNull: true },
    chest: { type: DataTypes.FLOAT, allowNull: true },
    waist: { type: DataTypes.FLOAT, allowNull: true },
    hips: { type: DataTypes.FLOAT, allowNull: true },
    leftArm: { type: DataTypes.FLOAT, allowNull: true },
    rightArm: { type: DataTypes.FLOAT, allowNull: true },
    leftThigh: { type: DataTypes.FLOAT, allowNull: true },
    rightThigh: { type: DataTypes.FLOAT, allowNull: true },
    leftCalf: { type: DataTypes.FLOAT, allowNull: true },
    rightCalf: { type: DataTypes.FLOAT, allowNull: true },
    shoulders: { type: DataTypes.FLOAT, allowNull: true },
}, {
    sequelize,
    modelName: 'Measurement',
    tableName: 'measurements',
});
