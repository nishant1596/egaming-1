const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');


aws.config.update({
    secretAccessKey: "ZM9YtZECmK2BcVB/RbY3mAb2+OV3ibnGgBwBkY+C",
    accessKeyId: "AKIAJPRHOAXVADBY46LA",
    region: 'us-west-2' // region of your bucket
});
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'egaming-node',
    // acl: 'public-read',
    // metadata: function (req, file, cb) {
    //   cb(null, {fieldName: "TESTING_META_DATA"});
    // },
    key: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now().toString())
    }
  })
})
// const singleUpload = upload.single('image')
module.exports=upload;
