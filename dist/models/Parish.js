"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parish = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
exports.parish = pg_1.sequelize.define('parish', {
    idParish: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    parishName: {
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING(100),
    },
    location_idLocation: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            key: 'locality',
            model: 'type',
        },
    },
}, {
    tableName: 'parish',
    freezeTableName: true,
    timestamps: false,
});
