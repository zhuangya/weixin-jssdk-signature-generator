'use strict';
var Redis = require('ioredis');

var redis = new Redis();

redis.setex('ticket', 7200, '7200-ticket').then(function () {
  redis.get('ticket');
});
