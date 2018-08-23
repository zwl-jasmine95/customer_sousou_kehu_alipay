const app = getApp();

Page({
  data: {
    message: '',
    price: ''
  },

  onLoad() {
    this.init();
  },

  init() {
    var self = this;
    // 加载loding
    my.showLoading({ content: "加载中..." });

    // 支付
    my.httpRequest({
      url: app.get_request_url("ServiceBuyInit", "Resources"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.hideLoading();
        if (res.data.code == 0) {
          self.setData({
            message: res.data.data.service_buy_desc,
            price: res.data.data.service_price
          });
        } else {
          my.showToast({
            type: "fail",
            content: res.data.msg
          });
        }
      },
      fail: () => {
        my.hideLoading();
        my.showToast({
          type: "fail",
          content: "服务器请求出错"
        });
      }
    });
  },

  confirm_buy(e) {
    var user = app.GetUserInfo(this, "confirm_buy");
    if (user != false) {
      // 用户未绑定用户则转到登录页面
      if ((user.mobile || null) == null) {
        my.navigateTo({
          url: "/pages/login/login?event_callback=confirm_buy"
        });
        return false;
      } else {
        // 加载loding
        my.showLoading({ content: "加载中..." });

        // 支付
        my.httpRequest({
          url: app.get_request_url("Buy", "Service"),
          method: "POST",
          data: {},
          dataType: "json",
          success: res => {
            my.hideLoading();
            if (res.data.code == 0) {
              my.tradePay({
                orderStr: res.data.data,
                success: res => {
                  // 跳转支付页面
                  my.redirectTo({
                    url:
                      "/pages/paytips/paytips?code=" +
                      res.resultCode +
                      "&result=" +
                      res.result
                  });
                },
                fail: res => {
                  my.showToast({
                    type: "fail",
                    content: "唤起支付模块失败"
                  });
                }
              });
            } else {
              my.showToast({
                type: "fail",
                content: res.data.msg
              });
            }
          },
          fail: () => {
            my.hideLoading();
            my.showToast({
              type: "fail",
              content: "服务器请求出错"
            });
          }
        });
      }
    }
  }
});
