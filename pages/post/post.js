const app = getApp();

Page({
  data: {
    province_list: [],
    city_list: [],
    county_list: [],
    // province_value: 0,
    // city_value: 0,
    // county_value: 0,

    goods_type: [],
    type_value: 0,
    post_time: app.get_date("yyyy-MM-dd h:m", app.get_timestamp() + 1800),
    merchant_id: 0,
  },

  onLoad(e) {
    this.setData({
      merchant_id: e.merchant_id
    });
  },

  onShow(e) {
    this.init(e);
  },

  init(e) {
    var self = this;
    // 是否注册
    var user = app.GetUserInfo(this, "init");
    if (user != false) {
      // 用户未绑定用户则转到登录页面
      if ((user.mobile || null) == null) {
        my.redirectTo({
          url: "/pages/login/login?event_callback=init"
        });
        return false;
      } else {
        // 是否选择站点
        if (self.data.merchant_id == 0)
        {
          my.confirm({
            title: "温馨提示",
            content: "您还未选择站点",
            confirmButtonText: "选择站点",
            cancelButtonText: "返回",
            success: res => {
              if (res.confirm) {
                my.redirectTo({
                  url: "/pages/merchant/merchant?is_submit=1"
                });
              } else {
                my.navigateBack();
              }
            }
          });
          return false;
        }

        // 获取数据
        self.get_user_address();
        self.get_province_list();
        self.get_goods_type();
      }
    } else {
      my.navigateBack();
    }
  },

  //   获取用户地址
  get_user_address() {
    var self = this;
    // 加载loding
    my.showLoading({ content: "加载中..." });

    my.httpRequest({
      url: app.get_request_url("GetUserAddress", "User"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.hideLoading();
        if (res.data.code == 0) {
          if (res.data.data.address) {
            var data = res.data.data.address;
            self.setData({
              post_name: data.name,
              post_address:
                data.province_text +
                data.city_text +
                data.county_text +
                data.address
            });
          } else {
            my.confirm({
              title: "温馨提示",
              content: "您还未绑定地址",
              confirmButtonText: "绑定地址",
              cancelButtonText: "返回",
              success: res => {
                if (res.confirm) {
                  my.navigateTo({
                    url: "/pages/address/address"
                  });
                } else {
                  my.navigateBack();
                }
              }
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
        my.showToast({
          type: "fail",
          content: "服务器请求出错"
        });
      }
    });
  },

  //   获取商品类型
  get_goods_type() {
    var self = this;
    // 加载loding
    my.showLoading({ content: "加载中..." });

    my.httpRequest({
      url: app.get_request_url("Goods", "Resources"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.hideLoading();
        if (res.data.code == 0) {
          var data = res.data.data;
          this.setData({
            goods_type: data
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

  // 获取选择的省市区
  get_province_list() {
    var self = this;
    // 加载loding
    my.showLoading({ content: "加载中..." });

    my.httpRequest({
      url: app.get_request_url("Index", "Region"),
      method: "POST",
      data: {},
      dataType: "json",
      success: res => {
        my.hideLoading();
        if (res.data.code == 0) {
          var data = res.data.data;
          self.setData({
            province_list: data
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

  get_city_list(parent) {
    var self = this;
    // 加载loding
    my.showLoading({ content: "加载中..." });

    my.httpRequest({
      url: app.get_request_url("Index", "Region"),
      method: "POST",
      data: {
        pid: parent.id
      },
      dataType: "json",
      success: res => {
        my.hideLoading();
        if (res.data.code == 0) {
          var data = res.data.data;
          self.setData({
            city_list: data
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
  get_county_list(parent) {
    var self = this;
    // 加载loding
    my.showLoading({ content: "加载中..." });

    my.httpRequest({
      url: app.get_request_url("Index", "Region"),
      method: "POST",
      data: {
        pid: parent.id
      },
      dataType: "json",
      success: res => {
        my.hideLoading();
        if (res.data.code == 0) {
          var data = res.data.data;
          self.setData({
            county_list: data
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

  select_province(e) {
    var value = e.detail.value,
      data = this.data.province_list[value];
    this.setData({
      province_value: value,
      city_value: null,
      county_value: null
    });
    this.get_city_list(data);
  },

  select_city(e) {
    var value = e.detail.value,
      data = this.data.city_list[value];
    this.setData({
      city_value: value,
      county_value: null
    });
    this.get_county_list(data);
  },

  select_county(e) {
    this.setData({
      county_value: e.detail.value
    });
  },

  // 选择物品类型
  select_type(e) {
    this.setData({
      type_value: e.detail.value
    });
  },

  // 选择时间
  select_time() {
    // 选择时间
    var start_date = app.get_date("yyyy-MM-dd h:m", app.get_timestamp() + 1800);
    var end_date = app.get_date(
      "yyyy-MM-dd h:m",
      app.get_timestamp() + 3600 * 24 * 3
    );

    // 选择日期
    my.datePicker({
      format: "yyyy-MM-dd HH:mm",
      currentDate: start_date,
      startDate: start_date,
      endDate: end_date,
      success: res => {
        this.setData({
          post_time: res.date
        });
      }
    });
  },

  // 预约寄件
  form_submit(e) {
    var self = this,
      data = self.data;
    // 表单数据
    var form_data = e.detail.value;
    // 数据校验
    var validation = [
      { fields: "receive_name", msg: "请填写收件人姓名" },
      { fields: "receive_tel", msg: "请填写收件人手机号" },
      { fields: "receive_province", msg: "请选择省份", is_can_zero: 1},
      { fields: "receive_city", msg: "请选择城市", is_can_zero: 1 },
      { fields: "receive_county", msg: "请选择区县", is_can_zero: 1 },
      { fields: "receive_address", msg: "请填写详细地址" }
    ];
    
    if (app.fields_check(form_data, validation)) {
      form_data["receive_province"] =
        data.province_list[data.province_value].id;
      form_data["receive_city"] = data.city_list[data.city_value].id;
      form_data["receive_county"] = data.county_list[data.county_value].id;

      form_data["goods_id"] = data.goods_type[data.type_value].id;
      form_data["booking_time"] = data.post_time;
      // 加载loding
      my.showLoading({ content: "提交中..." });

      my.httpRequest({
        url: app.get_request_url("Add", "SendOrder"),
        method: "POST",
        data: form_data,
        dataType: "json",
        success: res => {
          my.hideLoading();
          if (res.data.code == 0) {
            my.showToast({
              type: "success",
              content: "寄件成功"
            });
            setTimeout(function() {
              my.redirectTo({
                url: "/pages/post-list/post-list"
              });
            }, 2000);
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
});
