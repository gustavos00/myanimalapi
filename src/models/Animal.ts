import { Model, DataTypes } from "sequelize";
import { sequelize } from '../config/pg';

export interface AnimalInstance extends Model {
    idAnimal: number,

    name: string,
    age: string,
    breed: string, 
    trackNumber: string,
    imageName: string, 
    imageUrl: string,

    user_idUser: number
}

export const animal = sequelize.define<AnimalInstance>('animal', {
    idUser: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },

    name: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },

    age: DataTypes.STRING(5),
    breed: DataTypes.STRING(250),
    trackNumber: {
        type: DataTypes.STRING(15),
        unique: true 
    },
    imageName: DataTypes.STRING,
    imageUrl: DataTypes.STRING,

    user_idUser: {
        type: DataTypes.INTEGER,
        references: {
            key: 'user',
            model: 'idUser',
        }
    }
}, {
    tableName: 'animal',
    freezeTableName: true,
    timestamps: false, 
});