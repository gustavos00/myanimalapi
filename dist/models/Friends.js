"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const friends = pg_1.sequelize.define('friends', {
    idfriends: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    status: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(100),
        defaultValue: 'Pending'
    },
}, {
    tableName: 'friends',
    freezeTableName: true,
    timestamps: true,
});
exports.default = friends;
