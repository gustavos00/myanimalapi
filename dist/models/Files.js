"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg_1 = require("../config/pg");
const Events_1 = __importDefault(require("./Events"));
const files = pg_1.sequelize.define('files', {
    idFiles: {
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    file: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(),
    },
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(),
    },
    label: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(150),
    },
    function: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(),
    },
}, {
    tableName: 'files',
    freezeTableName: true,
    timestamps: true,
});
Events_1.default.hasMany(files);
files.belongsTo(Events_1.default);
exports.default = files;
