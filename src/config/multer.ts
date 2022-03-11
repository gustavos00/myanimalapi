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
    key: (req: Request, file: any, cb: Function) => {
      cryptoLib.randomBytes(4, (err: any, hash: any) => {
        if (err) cb(err);

        const { email, chipnumber }: any = req.body;
        const filename = chipnumber
          ? `${email}-${chipnumber}`
          : `${email}-${hash.toString('hex')}`;

        return cb(null, filename);
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
  fileFilter: (req: Request, file: any, cb: Function) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/jpg',
      'image/png',
      'text/html'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
};
