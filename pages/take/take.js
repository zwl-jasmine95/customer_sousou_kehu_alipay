const app = getApp();

Page({
  data: {
    data_list: [],
    data_page_total: 0,
    data_page: 1,
    data_list_loding_status: 1,
    data_bottom_line_status: false,

    data_selected_index: [],
    take_time: "预约时间",
    is_service: 0,
    merchant_id: 0,
  },

  onLoad(e) {
    this.setData({
      is_service: e.is_service,
      merchant_id: e.merchant_id
    });
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

        // 是否购买服务
        if (self.data.is_service == 0)
        {
          my.confirm({
            title: "温馨提示",
            content: "您还未购买服务",
            confirmButtonText: "购买服务",
            cancelButtonText: "返回",
            success: res => {
              if (res.confirm) {
                my.redirectTo({
                  url: "/pages/purchase/purchase"
                });
              } else {
                my.navigateBack();
              }
            }
          });
          return false;
        }

        // 获取数据
        self.get_data_list();
      }
    } else {
      my.navigateBack();
    }
  },

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
      url: app.get_request_url("Index", "TakeOrder"),
      method: "POST",
      data: {
        page: this.data.data_page,
        status: 0
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

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ data_page: 1 });
    this.get_data_list(1);
  },

  // 滚动加载
  scroll_lower(e) {
    this.get_data_list();
  },

  check_event(event) {
    var idx = event.target.dataset["idx"],
      self = this;
    //可配送
    var data_list = self.data.data_list;
    var arr = self.data.data_selected_index;

    if (arr.length == 0) {
      data_list[idx].checked = true;
      arr.push(idx);
    } else {
      var isSelected = false;

      arr.forEach((d, i) => {
        if (d == idx) {
          isSelected = true;
          arr.splice(i, 1);
          return false;
        }
      });

      if (isSelected) {
        //存在
        data_list[idx].checked = false;
      } else {
        data_list[idx].checked = true;
        arr.push(idx);
      }
    }

    self.setData({
      data_selected_index: arr,
      data_list: data_list
    });
  },

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
          take_time: res.date
        });
      }
    });
  },

  take_event() {
    var id_list = [],
      select_index = this.data.data_selected_index,
      data_list = this.data.data_list;

    //  是否选择取件内容
    if (select_index.length == 0) {
      my.showToast({
        type: "fail",
        content: "请选择配送内容"
      });
      return false;
    } else {
      select_index.forEach((d, i) => {
        id_list.push(data_list[d].id);
      });
    }

    // 是否选择配送时间
    if (this.data.take_time == "") {
      my.showToast({
        type: "fail",
        content: "请选择配送时间"
      });
      return false;
    }

    // 加载loding
    my.showLoading({ content: "提交中..." });

    my.httpRequest({
      url: app.get_request_url("Transport", "TakeOrder"),
      method: "POST",
      data: {
        booking_time: this.data.take_time,
        take_id: id_list
      },
      dataType: "json",
      success: res => {
        my.hideLoading();
        if (res.data.code == 0) {
          my.showToast({
            type: "success",
            content: res.data.msg
          });
          setTimeout(function() {
            my.redirectTo({
              url: "/pages/take-list/take-list"
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
});
