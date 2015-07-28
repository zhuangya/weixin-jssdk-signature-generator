'use strict';

var signer = require('../lib/signer');
var assert = require('assert');

describe('weixin signature signer', function () {
  it('should generate correct signature', function () {
    var signature = signer({ timestamp: 1438069188,
  jsapi_ticket: 'bxLdikRXVbTPdHSM05e5uz_PLifeyTOt9G8aI2yC2mxHebFyBYUZKJ1C4RxRxtiEkHsdYPwz43xzvo6PqNb3pg',
  noncestr: 'thereisnospoon!',
  url: 'http://nuh.gotokeep.com/index.html' });
    assert.equal(signature, 'c606ea065649993b6dab2c92c98a04f4d8d4a6fa');
  });
});
