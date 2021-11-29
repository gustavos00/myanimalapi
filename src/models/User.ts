import { Model, DataTypes } from "sequelize";
import { sequelize } from '../config/pg';

export interface UserInstance extends Model {
    idUser: number,

    givenName: string,
    familyName: string,
    email: string, 
    phoneNumber: string,
    imageUrl: string, 
    imageName: string,
    token: string

    type_idUsertype: number
    address_idAddress: number
}

export const user = sequelize.define<UserInstance>('user', {
    idUser: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },

    givenName: {
      allowNull: false,
      type: DataTypes.STRING(60)
    },
    familyName: {
      allowNull: false,
      type: DataTypes.STRING(60)
    },
    email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(255)
    },
    phoneNumber: DataTypes.STRING(15),
    imageUrl: DataTypes.STRING,
    imageName: DataTypes.STRING,
    token: {
        type: DataTypes.STRING,
        unique: true,
    },

    type_idUsertype: {
        type: DataTypes.INTEGER,
        references: {
            key: 'userTypes',
            model: 'idUsertype',
        }
    },

    address_idAddress: {
        type: DataTypes.INTEGER,
        references: {
            key: 'address',
            model: 'idAddress',
        }
    }
}, {
    tableName: 'user',
    freezeTableName: true,
    timestamps: false, 
});