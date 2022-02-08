import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/pg'
import reportsTypes from './ReportsTypes'

export interface ReportsInstance extends Model {
  idReports: number

  type: string
}

const reports = sequelize.define<ReportsInstance>(
  'reports',
  {
    idReports: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    observation: DataTypes.STRING
  },
  {
    tableName: 'reports',
    freezeTableName: true,
    timestamps: true,
  }
)

export default reports