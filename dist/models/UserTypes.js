"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypes = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
exports.userTypes = pg_1.sequelize.define('userTypes', {
    idUsertype: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    type: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(50),
    },
}, {
    tableName: 'userTypes',
    freezeTableName: true,
    timestamps: false,
});
