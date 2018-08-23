const app = getApp();

Page({
  data: {
    data_list: [],
    data_list_loding_status: 1
  },

  onLoad() {
    this.init();
  },

  init() {
    var user = app.GetUserInfo(this, "init");
    if (user != false) {
      // 用户未绑定用户则转到登录页面
      if ((user.mobile || null) == null) {
        my.redirectTo({
          url: "/pages/login/login?event_callback=init"
        });
        return false;
      } else {
        // 获取数据
        this.get_data_list();
      }
    }
  },

  get_data_list() {
    // 加载loding
    my.showLoading({ content: "加载中..." });
    this.setData({
      data_list_loding_status: 1
    });

    my.httpRequest({
      url: app.get_request_url("Index", "Coupon"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.hideLoading();
        my.stopPullDownRefresh();

        if (res.data.code == 0) {
          var data = res.data.data;
          if (data.length > 0) {
            this.setData({
              data_list: data,
              data_list_loding_status: 3
            });
          } else {
            this.setData({
              data_list_loding_status: 0
            });
          }
        } else {
          my.showToast({
            type: "fail",
            content: res.data.msg
          });
        }
      },
      fail: () => {
        my.hideLoading();
        my.stopPullDownRefresh();
        my.showToast({
          type: "fail",
          content: "服务器请求出错"
        });
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data_list();
  }
});
