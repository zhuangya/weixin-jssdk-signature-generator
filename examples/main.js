$(function () {
  $.post('http://gotokeep.com:7676/signature', {
    url: location.href
  }).done(function (resp) {

    resp.debug = false;
    resp.jsApiList.push('onMenuShareTimeline');

    wx.config(resp);

    log(JSON.stringify(resp));

    wx.ready(function () {

      log('wx ready');

      wx.onMenuShareTimeline({
        title: 'Keep',
        link: 'https://www.gotokeep.com/',
        imgUrl: 'http://sf4c.gotokeep.com/qq_default.png'
      });
    });

    wx.error(function (err) {
      log('Err: [' + JSON.stringify(err) + ']');
    });

  });
});

function log (msg) {
  $('#log').append(msg + '<br/>');
}
