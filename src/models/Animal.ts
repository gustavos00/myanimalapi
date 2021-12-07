import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';
import users from './User';

import user from './User';

export interface AnimalInstance extends Model {
  idAnimal: number;

  name: string;
  age: string;
  breed: string;
  trackNumber: string;
  imageName: string;
  imageUrl: string;

  user_idUser: number;
}

const animal = sequelize.define<AnimalInstance>(
  'animal',
  {
    idAnimal: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    name: {
      allowNull: false,
      type: DataTypes.STRING(250),
    },

    age: DataTypes.STRING(5),
    breed: DataTypes.STRING(250),
    trackNumber: {
      type: DataTypes.STRING(15),
      unique: true,
    },
    imageName: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    birthday: DataTypes.STRING(2),
    birthdayMonth: DataTypes.STRING(2),
  },
  {
    tableName: 'animal',
    freezeTableName: true,
    timestamps: false,
  }
);

export default animal