import { Model, DataTypes } from 'sequelize';
import { userTypes } from './UserTypes';
import { sequelize } from '../config/pg';

import address from './Address';
import animal from './Animal';

export interface UsersInstance extends Model {
  idUser: number;

  givenName: string;
  familyName: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  imageName: string;
  token: string;
}

const users = sequelize.define<UsersInstance>(
  'users',
  {
    idUser: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    givenName: {
      allowNull: false,
      type: DataTypes.STRING(60),
    },
    familyName: {
      allowNull: false,
      type: DataTypes.STRING(60),
    },
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(255),
    },
    phoneNumber: DataTypes.STRING(15),
    imageUrl: DataTypes.STRING,
    imageName: DataTypes.STRING,
    token: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    tableName: 'users',
    freezeTableName: true,
    timestamps: false,
  }
);

users.hasMany(userTypes)
userTypes.belongsTo(users)

users.hasMany(address)
address.belongsTo(users)

users.hasMany(animal)
animal.belongsTo(users)

export default users