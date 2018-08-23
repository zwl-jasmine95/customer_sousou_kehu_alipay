const app = getApp();
Page({
  data: {
    avatar: app.data.default_user_head_src,
    name: "用户名",
    merchant: "未绑定站点",
    integral: 0,
    is_service: 0,
    deadline: 0,
    agreement_url:'',
    customer_service_tel:null,
    
    lists: [
      {
        url: "address",
        icon: "address",
        name: "我的收货地址"
      },
      {
        url: "coupon",
        icon: "coupon",
        name: "优惠券"
      },
      {
        url: "take-list",
        icon: "service-take",
        name: "取件记录"
      },
      {
        url: "post-list",
        icon: "service-post",
        name: "寄件记录"
      },
      {
        url: "complaint-list",
        icon: "complaint",
        name: "投诉记录"
      },
      {
        url: "share",
        icon: "share-icon",
        name: "分享有礼"
      }
    ]
  },

  onShow(e) {
    this.init(e);
  },

  init(e) {
    var user = app.GetUserInfo(this, "init"),
      self = this;
    if (user != false) {
      // 用户未绑定用户则转到登录页面
      if ((user.mobile || null) == null) {
        my.redirectTo({
          url: "/pages/login/login?event_callback=init"
        });
        return false;
      } else {
        self.get_message();
      }
    }
  },

  get_message() {
    // 加载loding
    my.httpRequest({
      url: app.get_request_url("Center", "User"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.stopPullDownRefresh();
        if (res.data.code == 0) {
          var data = res.data.data;
          this.setData({
            avatar: data.avatar,
            name: data.username,
            merchant: data.merchant_name,
            integral: data.integral,
            is_service: data.is_service,
            deadline: data.service_date,
            agreement_url: data.agreement_url,
            customer_service_tel: data.customer_service_tel
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

  clear_storage(e) {
    my.clearStorage()
    my.showToast({
      type: "success",
      content: "清除缓存成功"
    });
  },

  call_event() {
    if(this.data.customer_service_tel == null)
    {
      my.showToast({
        type: "fail",
        content: "客服电话有误"
      });
    } else {
      my.makePhoneCall({ number: this.data.customer_service_tel });
    }
  },
  // 下拉刷新
  onPullDownRefresh(e) {
    this.init(e);
  },

  preview_event() {
    if(app.data.default_user_head_src != this.data.avatar)
    {
      my.previewImage({
        current: 0,
        urls: [this.data.avatar]
      });
    }
  }
});
