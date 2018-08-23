const app = getApp();

Page({
  data: {
    post: {
      name: "",
      num: "",
      address: ""
    },
    take: {
      name: "",
      num: "",
      address: ""
    },
    message: [
      {
        label: "订单状态",
        detail: ""
      },
      {
        label: "订单时间",
        detail: ""
      },
      {
        label: "预约时间",
        detail: ""
      },
      {
        label: "预达时间",
        detail: ""
      },
      {
        label: "收件时间",
        detail: ""
      },
      {
        label: "完成时间",
        detail: ""
      },
      {
        label: "订单金额",
        detail: ""
      }
    ],

    company: [
      {
        label: "快递公司",
        detail: ""
      },
      {
        label: "快递单号",
        detail: ""
      }
    ]
  },

  onLoad(e) {
    this.init(e.id);
  },

  init(id) {
    var self = this;
    my.showLoading({ content: "加载中..." });
    my.httpRequest({
      url: app.get_request_url("Detail", "SendOrder"),
      method: "POST",
      data: {
        id: id
      },
      dataType: "json",
      success: res => {
        my.hideLoading();
        if (res.data.code == 0) {
          var data = res.data.data;
          self.setData({
            post: {
              name: data.sender_name,
              num: data.sender_tel,
              address: data.sender_address
            },
            take: {
              name: data.receive_name,
              num: data.receive_tel,
              address: data.receive_address
            },

            message: [
              {
                label: "订单状态",
                detail: data.status_text
              },
              {
                label: "订单时间",
                detail: data.add_time
              },
              {
                label: "预约时间",
                detail: data.booking_time
              },
              {
                label: "预达时间",
                detail: data.budget_time
              },
              {
                label: "收件时间",
                detail: data.collection_time
              },
              {
                label: "完成时间",
                detail: data.success_time
              },
              {
                label: "订单金额",
                detail: data.price
              }
            ],

            company: [
              {
                label: "快递公司",
                detail: data.express_name
              },
              {
                label: "快递单号",
                detail: data.express_number
              }
            ]
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
});
