"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const friendRequest = pg_1.sequelize.define('friendRequest', {
    idFriendRequest: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    fromWho: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(10),
    },
    toWhom: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(10),
    },
}, {
    tableName: 'friendRequest',
    freezeTableName: true,
    timestamps: true,
});
exports.default = friendRequest;
