"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const reportsTypes = pg_1.sequelize.define('reportsTypes', {
    idReportsTypes: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    type: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(150),
    },
}, {
    tableName: 'reportsTypes',
    freezeTableName: true,
    timestamps: true,
});
exports.default = reportsTypes;
