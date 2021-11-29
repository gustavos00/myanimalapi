import { Model, DataTypes } from "sequelize";
import { sequelize } from '../config/pg';

export interface AddressInstance extends Model {
    idAddress: number,

    doorNumber: string,
    postalCode: string,
    streetName: string, 

    parish_idParish: number
}

export const address = sequelize.define<AddressInstance>('address', {
    idAddress: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },

    doorName: {
      allowNull: false,
      type: DataTypes.STRING(10)
    },
    postalCode: {
      allowNull: false,
      type: DataTypes.STRING(12)
    },
    streetName: {
        allowNull: false,
        type: DataTypes.STRING(100)
    },

    parish_idParish: {
        type: DataTypes.INTEGER,
        references: {
            key: 'parish',
            model: 'idLocality',
        }
    }
}, {
    tableName: 'address',
    freezeTableName: true,
    timestamps: false, 
});