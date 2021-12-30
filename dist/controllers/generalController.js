"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ping = (req, res) => {
    res.status(200).send({ message: 'pong' });
};
exports.default = ping;
