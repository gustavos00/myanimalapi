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
  photoName: string;
  photoUrl: string;

  userIdUser: number;
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
    photoName: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    birthday: DataTypes.STRING(2),
    birthdayMonth: DataTypes.STRING(2),
  },
  {
    tableName: 'animal',
    freezeTableName: true,
    timestamps: true,
  }
);

export default animal