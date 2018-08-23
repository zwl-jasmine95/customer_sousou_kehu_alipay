const app = getApp();
Page({
  data: {
    takeNum: 0,
    postNum: 0
  },
  onShow() {
    this.init();
  },
  init() {
    // 加载loding
    my.httpRequest({
      url: app.get_request_url("ServiceInit", "Index"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.stopPullDownRefresh();
        if (res.data.code == 0) {
          var data = res.data.data;
          this.setData({
            takeNum: data.take_count,
            postNum: data.send_count
          });
        } else {
          my.showToast({
            type: "fail",
            content: res.data.msg
          });
        }
      },
      fail: () => {
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
    this.init();
  }
});
