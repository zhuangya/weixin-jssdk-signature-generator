'use strict';

var sha1 = require('sha1');
var debug = require('debug')('KEEP-weixin');

module.exports = function (payload) {
  debug('signer payload', payload);

  var toSha1 = Object.keys(payload).sort().reduce(function (soFar, current) {
    soFar.push([current, payload[current]].join('='));
    return soFar;
  }, []).join('&');

  var signature = sha1(toSha1);

  debug('signature', signature);

  return signature;
};
