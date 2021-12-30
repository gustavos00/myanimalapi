"use strict";
const multer = require('multer');
const path = require('path');
const cryptoLib = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');
const storageTypes = {
    local: multer.diskStorage({
        destination: tmpFolder,
        filename: (req, file, cb) => {
            cryptoLib.randomBytes(8, (err, hash) => {
                if (err)
                    cb(err);
                file.key = `${hash.toString('hex')}-${file.originalname}`;
                return cb(null, file.key);
            });
        },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'myanimal',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            cryptoLib.randomBytes(4, (err, hash) => {
                if (err)
                    cb(err);
                const { email, chipnumber } = req.body;
                const key = email ? email : hash.toString('hex');
                const filename = chipnumber
                    ? `${key}-${file.originalname}-${chipnumber}`
                    : `${key}-${file.originalname}`;
                return cb(null, filename);
            });
        },
    }),
};
module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes.s3,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/jpg',
            'image/png',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    },
};
