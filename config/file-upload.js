
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: "SECRET_ACCESS_KEY",
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "ACCESS_KEY_ID",

    region: 'us-east-2' // region of your bucket
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'egaming-1',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      // console.log(file);
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      console.log(file);
      var extension=file.originalname.split('.')[1]
      cb(null, Date.now().toString()+extension);
    }
  })
})

module.exports = upload;
