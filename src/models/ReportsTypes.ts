
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';
import reports from './Reports';
import users from './User';

export interface ReportsTypesInstance extends Model {
  idReportsTypes: number;

  type: string;
}

const reportsTypes = sequelize.define<ReportsTypesInstance>(
  'reportsTypes',
  {
    idReportsTypes: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    type: {
      allowNull: false,
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: 'reportsTypes',
    freezeTableName: true,
    timestamps: true,
  }
);

reportsTypes.hasMany(reports)
reports.belongsTo(reportsTypes)
  
export default reportsTypes;


