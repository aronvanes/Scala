var args = require('minimist')(process.argv.slice(2));
var AWS = require('aws-sdk');
var path = require('path');
var fs = require('fs');
var async = require('async');
var Bucket = args.bucket;
var s3 = new AWS.S3();

function listFiles() {
  s3.listObjects({Bucket: Bucket}, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
      console.log(data);
      deleteFiles(data);
    }
  });
}

function deleteFiles(data) {
  var params = {
    Bucket: Bucket,
    Delete: {
      Objects: []
    }
  };
  for (var i = 0; i < data.Contents.length; i++) {
    var obj = {
      Key: data.Contents[i].Key
    };
    params.Delete.Objects.push(obj);
  }

  s3.deleteObjects(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
      console.log(data);
    }
  })
}

listFiles();