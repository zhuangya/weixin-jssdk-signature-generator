# weixin jssdk signature generator

其实严格来说生成的不是 signature ，而是生成是页面上的 wx.config 需要的参数。

只有一个接口：

`POST /signature`

发送给它  `{ url: location.href }` 就可以了， url 在 api 中有对应的处理。

返回的结果是形式如同 `wx.config()` 所需要的内容，可以根据具体需要来修改——比如 api 列表——然后给 `wx.config()`


在 examples 中有一个示例的页面。

任何问题请提 issue ，也欢迎各种 pull-request :)
