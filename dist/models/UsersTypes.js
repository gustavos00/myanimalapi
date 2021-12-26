"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const User_1 = __importDefault(require("./User"));
const usersTypes = pg_1.sequelize.define('usersTypes', {
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
    tableName: 'usersTypes',
    freezeTableName: true,
    timestamps: false,
});
usersTypes.hasMany(User_1.default);
User_1.default.belongsTo(usersTypes);
exports.default = usersTypes;
