"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const classification = pg_1.sequelize.define('classification', {
    idClassification: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    avaliationNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    observation: sequelize_1.DataTypes.STRING
}, {
    tableName: 'classification',
    freezeTableName: true,
    timestamps: true,
});
classification.beforeUpdate((service) => {
    if (service.avaliationNumber < 0 || service.avaliationNumber > 5) {
        throw new Error('Avaliation number should be in [0, 5] range!');
    }
});
exports.default = classification;
