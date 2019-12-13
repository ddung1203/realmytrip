var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
const uuidv4 = require('uuid/v4');

router.get('/s3', function(req, res, next) {
  const s3 = new aws.S3({region: 'ap-northeast-2'});
  const filename = req.query.filename;
  const type = req.query.type;
  const uuid = uuidv4();
  const params = {
    Bucket: S3_BUCKET,
    Key: uuid + '/' + filename,
    Expires: 900,
    ContentType: type,
    ACL: 'public-read'
  };
  console.log(params);
  s3.getSignedUrl('putObject', params, function(err, data) {
    if (err) {
      console.log(err);
      return res.json({err: err});
    }
    res.json({
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${uuid}/${filename}`
    });
  });
});


module.exports = router;
