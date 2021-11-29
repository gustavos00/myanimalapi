import { Model, DataTypes } from "sequelize";
import { sequelize } from '../config/pg';

export interface LocalityInstance extends Model {
    idLocality: number,

    locationName: string,
}

export const Locality = sequelize.define<LocalityInstance>('Locality', {
    idLocality: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },

    locationName: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(100)
    },
}, {
    tableName: 'locality',
    freezeTableName: true,
    timestamps: false, 
});