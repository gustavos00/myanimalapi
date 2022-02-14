"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const reports = pg_1.sequelize.define('reports', {
    idReports: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    observation: sequelize_1.DataTypes.STRING
}, {
    tableName: 'reports',
    freezeTableName: true,
    timestamps: true,
});
exports.default = reports;
