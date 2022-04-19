import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';

import events from './Events';

export interface FilesInstance extends Model {
  idEventsTypes: number;

  label: string;
  value: string;
}

const files = sequelize.define<FilesInstance>(
  'files',
  {
    idFiles: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    file: {
      allowNull: false,
      type: DataTypes.STRING(),
    },

    name: {
      allowNull: false,
      type: DataTypes.STRING(),
    },

    label: {
      allowNull: false,
      type: DataTypes.STRING(150),
    },

    function: {
      allowNull: false,
      type: DataTypes.STRING(),
    },
  },
  {
    tableName: 'files',
    freezeTableName: true,
    timestamps: true,
  }
);

files.hasMany(events);
events.belongsTo(files);


export default files;
