const app = getApp();
var system_info = app.get_system_info();

Page({
  data: {
    id: -1,
    name: "",
    btn_state: true,
    address: "当前位置",
    lng: 0,
    lat: 0,
    data_list: [],
    data_page_total: 0,
    data_page: 1,
    data_list_loding_status: 1,
    data_bottom_line_status: false,
    is_submit: 0,
  },

  onLoad(e) {
    this.setData({
      is_submit: e.is_submit || 0,
    });

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
        // 获取位置权限
        this.get_loaction();
      }
    }
  },

  get_loaction(e) {
    // 获取授权
    var status = ((e || null) == null) ? -1 : (e.status || -1);
    if (status == -1) {
      app.use_location(this, "get_loaction");
      return false;
    } else {
      // 授权失败
      if(status == 400)
      {
        my.redirectTo({
          url: "/pages/locaion/locaion?pages_callback=merchant"
        });
      } else {
        // 授权成功
        this.setData({
          lng: e.lng,
          lat: e.lat
        });

        // 获取数据
        this.get_data_list();
      }
    }
  },

  // 地址切换
  select_address_event() {
    var user = app.GetUserInfo(this, "select_address_event");
    if (user != false) {
      // 用户未绑定用户则转到登录页面
      if ((user.mobile || null) == null) {
        my.redirectTo({
          url: "/pages/login/login?event_callback=select_address_event"
        });
        return false;
      } else {
        // 获取位置权限
        my.chooseLocation({
          success: res => {
            this.setData({
              lng: res.longitude,
              lat: res.latitude,
              address: res.name,
              data_page: 1
            });

            // 获取数据
            this.get_data_list(1);
          }
        });
      }
    }
  },

  // 获取数据
  get_data_list(is_mandatory) {
    // 分页是否还有数据
    if ((is_mandatory || 0) == 0) {
      if (this.data.data_bottom_line_status == true) {
        return false;
      }
    } else {
      this.setData({ data_bottom_line_status: false });
    }

    // 加载loding
    my.showLoading({ content: "加载中..." });
    this.setData({
      data_list_loding_status: 1
    });

    // 获取数据
    my.httpRequest({
      url: app.get_request_url("Index", "UserNearbyMerchant"),
      method: "POST",
      data: {
        page: this.data.data_page,
        lng: this.data.lng,
        lat: this.data.lat
      },
      dataType: "json",
      success: res => {
        my.hideLoading();
        my.stopPullDownRefresh();
        if (res.data.code == 0) {
          if (res.data.data.data.length > 0) {
            if (this.data.data_page <= 1) {
              var temp_data_list = res.data.data.data;
            } else {
              var temp_data_list = this.data.data_list;
              var temp_data = res.data.data.data;
              for (var i in temp_data) {
                temp_data_list.push(temp_data[i]);
              }
            }
            this.setData({
              data_list: temp_data_list,
              data_total: res.data.data.total,
              data_page_total: res.data.data.page_total,
              data_list_loding_status: 3,
              data_page: this.data.data_page + 1
            });

            // 是否还有数据
            if (
              this.data.data_page > 1 &&
              this.data.data_page > this.data.data_page_total
            ) {
              this.setData({ data_bottom_line_status: true });
            }
          } else {
            this.setData({
              data_list_loding_status: 0
            });
          }
        } else {
          this.setData({
            data_list_loding_status: 0
          });

          my.showToast({
            type: "fail",
            content: res.data.msg
          });
        }
      },
      fail: () => {
        my.hideLoading();
        my.stopPullDownRefresh();

        this.setData({
          data_list_loding_status: 2
        });
        my.showToast({
          type: "fail",
          content: "服务器请求出错"
        });
      }
    });
  },

  select_item(event) {
    var id = event.target.dataset.id,
      name = event.target.dataset.name,
      state = this.data.btn_state;
    if (id == this.data.id) {
      id = -1;
      name = "";
      state = true;
    } else {
      state = false;
    }
    this.setData({
      id: id,
      name: name,
      btn_state: state
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ data_page: 1 });
    this.get_data_list(1);
  },

  // 滚动加载
  scroll_lower(e) {
    this.get_data_list();
  },

  // 提交选择的站点
  choose_merchant(e) {
    var self = this,
      id = self.data.id;

    if (!self.data.btn_state) {
      //没禁用
      if (self.data.is_submit == 1) {
        // 加载loding
        my.showLoading({ content: "加载中..." });

        my.httpRequest({
          url: app.get_request_url("MerchantChoose", "User"),
          method: "POST",
          data: {
            merchant_id: id
          },
          dataType: "json",
          success: res => {
            my.hideLoading();
            if (res.data.code == 0) {
              var data = res.data.data;
              my.setStorage({
                key: app.data.cache_user_merchant_key,
                data: {
                  name: self.data.name,
                  id: id
                }
              });
              setTimeout(function() {
                my.navigateBack();
              }, 1000);
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
      } else {
        var pre = getCurrentPages()[getCurrentPages().length - 2];
        pre.setData({
          merchant: {
            name: self.data.name,
            id: id
          }
        });
        my.navigateBack();
      }
    }
  }
});
