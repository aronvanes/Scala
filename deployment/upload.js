var args = require('minimist')(process.argv.slice(2));
var AWS = require('aws-sdk');
var path = require('path');
var fs = require('fs');
var async = require('async');
var Bucket = args.bucket;
var s3 = new AWS.S3();
var environment = args.environment;

var uploadDir = function (s3Path, bucketName) {

  function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
      var filePath = path.join(currentDirPath, name);
      var stat = fs.statSync(filePath);
      if (stat.isFile()) {
        callback(filePath, stat);
      } else if (stat.isDirectory()) {
        walkSync(filePath, callback);
      }
    });
  }

  walkSync(s3Path, function (filePath, stat) {
    var bucketPath = filePath.substring(s3Path.length + 1);
    var params = {
      Bucket: bucketName,
      Key: bucketPath,
      Body: fs.readFileSync(filePath),
      ACL: "public-read",
      ContentType: "text/html"
    };

    if (bucketPath === 'build.js') {
      params['CacheControl'] = 'max-age=604800';
    } 
    
    var regexp = new RegExp("main..*.css");
    if (typeof bucketPath === "string") { 
        var result = bucketPath.match(regexp);
        if (result && result.length === 1) {
            params['ContentType'] = "text/css";
        }
    }

    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log('Successfully uploaded ' + bucketPath + ' to ' + bucketName);
      }
    });

  });
};

uploadDir(path.resolve(__dirname + "/../dist"), Bucket);

if (environment === 'staging') {
  uploadDir(path.resolve(__dirname + '/copy'), Bucket);
}