'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var cors = require('koa-cors');
var config = require('config');
var requestId = require('koa-request-id');
var bodyParser = require('koa-bodyparser');

var router = require('./routes');

var app = koa();

app.use(bodyParser());
app.use(requestId());
app.use(logger());
app.use(cors());

app.use(function* timeAndId (next) {
  this.set('Request-Id', this.id);

  var start = +new Date();
  yield next;
  this.set('X-Response-Time', (+new Date() - start) + ' ms');
});

app.use(function* errorHandling (next) {
  try {
    yield next;
  } catch (error) {
    this.status = 500;
    this.message = 'internal error';
    this.app.emit('error', error, this);
  }
});

app.use(router.routes());

var port = config.get('port');
app.listen(port, '0.0.0.0', function () {
  console.log('listen on port %s', port);
});
