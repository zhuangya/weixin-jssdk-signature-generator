'use strict';

var router = require('koa-router')();
var request = require('co-request');
var sprint = require('sprint').sprint;
var config = require('config');
var sha1 = require('sha1');
var Redis = require('ioredis');
var url = require('url');

// TODO: redis connection config
var redis = new Redis(config.get('redis'));

var wxKey = config.get('weixin.key');
var wxSecret = config.get('weixin.secret');

var WX_API = {
  token: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s',
  ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi'
};


function* wxGet(endpoint, key) {
  var response = yield request(endpoint);
  return JSON.parse(response.body)[key];
}

router
  .post('/signature', function* getAccessToken (next) {
    var signTimestamp = Math.floor(+new Date() / 1000);

    var parsedUrl = url.parse(this.request.body.url);
    delete parsedUrl.hash;

    var accessToken = yield redis.get('wx:accessToken');
    if (!accessToken) {
      accessToken = yield wxGet(
          sprint(WX_API.token, wxKey, wxSecret),
          'access_token'
        );
      redis.setex('wx:accessToken', 7200, accessToken);
    }

    var ticket = yield redis.get('wx:ticket');

    if (!ticket) {
      ticket = yield wxGet(
          sprint(WX_API.ticket, accessToken),
          'ticket'
        );
      redis.setex('wx:ticket', 7200, ticket);
    }

    var payload = {
      timestamp: signTimestamp,
      jsapi_ticket: ticket,
      noncestr: config.get('nonce'),// shit!
      url: url.format(parsedUrl)
    };

    var toSha1 = Object.keys(payload).sort().reduce(function (soFar, current) {
      soFar.push([current, payload[current]].join('='));
      return soFar;
    }, []).join('&');

    this.body = {
      appId: config.get('appId'),
      timestamp: signTimestamp,
      nonceStr: config.get('nonce'),
      jsApiList: [],
      signature: sha1(toSha1)
    };

    yield next;
  });

module.exports = router;
