const app = getApp();

Page({
  data: {
    img: app.data.default_user_head_src,
    name: "",
    service_date: "",
    take_count: "",
    post_count: "",
    news_count: 0,
    is_service: 0,
    merchant_id: 0,
    banner_list: []
  },
  
  onShow() {
    this.init();
  },
  init() {
    var self = this;
    my.getStorage({
      key: app.data.cache_user_info_key,
      success: function(res) {
        if (res && res.data) {
          var data = res.data;
          self.setData({
            img: data.avatar
          });
        }
      },
      fail: function(res) {
        my.alert({ content: res.errorMessage });
      }
    });
    this.get_message();
  },

  get_message() {
    var self = this;
    // 加载loding
    my.httpRequest({
      url: app.get_request_url("Index", "Index"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.stopPullDownRefresh();
        if (res.data.code == 0) {
          var banner = [],
            data = res.data.data;
          if (data.banner && data.banner.length > 0) {
            data.banner.forEach(d => {
              banner.push(d);
            });
          }
          self.setData({
            banner_list: banner,
            take_count: data.take_count,
            is_service: data.is_service,
            merchant_id: data.merchant_id,
            service_date: data.service_date,
            name: data.username,
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
  img_nav(e) {
    var jump_url = e.target.dataset.jump_url || null;
    if (jump_url) {
      //不为空
      my.navigateTo({
        url: jump_url
      });
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  }
});
