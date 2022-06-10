"use strict";
const multer = require('multer');
const path = require('path');
const cryptoLib = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');
const storageTypes = {
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'myanimal',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            cryptoLib.randomBytes(4, (err, hash) => {
                if (err)
                    cb(err);
                if (file.originalname) {
                    const filename = `${file.originalname}-${hash.toString('hex')}`;
                    return cb(null, filename);
                }
                else {
                    const { email, chipnumber } = req.body;
                    const filename = chipnumber
                        ? `${email}-${chipnumber}`
                        : `${email}-${hash.toString('hex')}`;
                    return cb(null, filename);
                }
            });
        },
    }),
};
module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes.s3,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/jpg',
            'image/png',
            'text/html',
            'application/pdf',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    },
};
