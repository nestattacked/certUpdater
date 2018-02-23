var process = require('process');
var request = require('request');
var fs      = require('fs');
var crypto  = require('crypto');
var config  = require('./config.js');

validateArgv();
var domain   = process.argv[2];
var certPath = process.argv[3];
checkDomain();
updateCert();

function validateArgv() {
    if (process.argv.length !== 4) {
        console.log('error: require 2 arguments');
        process.exit(-1);
    }
}

function checkDomain() {
    if (config.domains.indexOf(domain) === -1) {
        process.exit();
    }
}

function updateCert() {
    var url = buildUrl();
    request(url, function(error, response, body){
        if (error) {
            console.log('error: http request error');
            process.exit(-1);
        }
        console.log('update for: ' + domain);
        console.log('time: ' + Date());
        console.log('response: ' + body);
        console.log('');
    });
}

function buildUrl() {
    var url = 'https://cdn.aliyuncs.com/?';
    var params = {};
    params.Format = 'JSON';
    params.Version = '2014-11-11';
    params.AccessKeyId = config.accessKeyId;
    params.SignatureMethod = 'HMAC-SHA1';
    params.Timestamp = getTimestamp();
    params.SignatureVersion = '1.0';
    params.SignatureNonce = getRandomInt();
    params.Action = 'SetDomainServerCertificate';
    params.DomainName = domain;
    params.CertName = getCertName();
    params.ServerCertificateStatus = 'on';
    params.ServerCertificate = fs.readFileSync(certPath + '/fullchain.pem', 'utf8');
    params.PrivateKey = fs.readFileSync(certPath + '/privkey.pem', 'utf8');
    params.Signature = getSignature(params);
    url += stringfyParams(params);
    return url;
}

function getTimestamp() {
    return new Date().toISOString().replace(/\.\d{3}/,'');
}

function getCertName() {
    var certName = domain + '-' + Date.now();
    return certName;
}

function getRandomInt() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
}

function percentEncode(str) {
    str = encodeURIComponent(str);
    return str.replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
}

function stringfyParams(params) {
    return Object.keys(params).map(function(key){
        return percentEncode(key) + '=' + percentEncode(params[key]);
    }).join('&');
}

function getSignature(params) {
    var canonicalizedQueryString = Object.keys(params).sort().map(function(key){
        return percentEncode(key) + '=' + percentEncode(params[key]);
    }).join('&');
    var stringToSign = 'GET&%2F&' + percentEncode(canonicalizedQueryString);
    var hmac = crypto.createHmac('sha1', config.secretAccessKey + '&');
    hmac.update(stringToSign);
    return hmac.digest('base64');
}
