var args = require('minimist')(process.argv.slice(2));
var AWS = require('aws-sdk');
var path = require('path');
var fs = require('fs');
var async = require('async');
var Distribution = args.distribution;
var cloudfront = new AWS.CloudFront();

function invalidation() {
  var invalidationParams = {
    DistributionId: Distribution,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  };
  cloudfront.createInvalidation(invalidationParams, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}

invalidation();