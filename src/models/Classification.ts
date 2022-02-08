import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/pg';

export interface ClassificationInstance extends Model {
  idClassification: number;
  avaliationNumber: number;
  observation: string
}

const classification = sequelize.define<ClassificationInstance>(
  'classification',
  {
    idClassification: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    avaliationNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    observation: DataTypes.STRING
  },
  {
    tableName: 'classification',
    freezeTableName: true,
    timestamps: true,
  }
);

classification.beforeUpdate((service) => {
  if (service.avaliationNumber < 0 || service.avaliationNumber > 5) {
    throw new Error('Avaliation number should be in [0, 5] range!');
  }
});

export default classification;
