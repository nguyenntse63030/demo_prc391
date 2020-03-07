const fs = require('fs');
const AWS = require('aws-sdk');
const configs = require('../../configs.js')
var express = require('express');
const app = express();

const s3 = new AWS.S3({
    accessKeyId: configs.AWS.ACCESS_KEY_ID,
    secretAccessKey: configs.AWS.SECRETT_KEY
});

app.get('/generatepresignedurl', function(req, res) {
    var fileName = req.query.fileName;
    var type = req.query.type;
    var url = s3.getSignedUrl('putObject', {
        Bucket: 'prc391-bucket',
        Key: fileName,
        ACL: "public-read",
        ContentType: type
    });
    res.send(url);
});