import { Model, DataTypes } from "sequelize";
import { sequelize } from '../config/pg';

export interface UserTypesInstance extends Model {
    idUsertype: number,

    type: string
}

export const userTypes = sequelize.define<UserTypesInstance>('userTypes', {
    idUsertype: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },

    type: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
}, {
    tableName: 'userTypes',
    freezeTableName: true,
    timestamps: false, 
});