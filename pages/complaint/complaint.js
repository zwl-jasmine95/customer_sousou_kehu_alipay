const app = getApp();
var system_info = app.get_system_info();

Page({
  data: {
    upload_list: [],
    upload_list_data: [],
    desc: "",
    merchant: {
      name: "站点选择",
      id: -1
    }
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
        this.setData({
          upload_list: [],
          upload_list_data: [],
        });
      }
    }
  },

  textarea_event(e) {
    this.setData({
      desc: e.detail.value
    });
  },

  upload_event() {
    var self = this,
      temp_upload_list = self.data.upload_list,
      temp_upload_list_data = self.data.upload_list_data;
    my.chooseImage({
      count: 1,
      success: res => {
        for (var i in res.apFilePaths) {
          my.uploadFile({
            url: app.get_request_url("Images", "Upload"),
            fileType: "image",
            fileName: "file",
            filePath: res.apFilePaths[i],
            success: res => {
              var data =
                typeof res.data == "object" ? res.data : JSON.parse(res.data);
              if (data.code == 0) {
                temp_upload_list.push(data.data.url);
                temp_upload_list_data.push(data.data.path);
                self.setData({
                  upload_list: temp_upload_list,
                  upload_list_data: temp_upload_list_data
                });
              } else {
                my.showToast({
                  type: "fail",
                  content: data.msg
                });
              }
            },
            fail: res => {
              my.showToast({
                type: "fail",
                content: "图片上传失败"
              });
            }
          });
        }
      }
    });
  },

  complaint_event() {
    var self = this,
      data = self.data;
    if (data.desc.length == 0 || data.merchant.id == -1) {
      my.showToast({
        type: "fail",
        content: "信息不完整"
      });
      return false;
    } else {
      // 加载loding
      my.showLoading({ content: "提交中..." });

      my.httpRequest({
        url: app.get_request_url("Add", "Complaint"),
        method: "POST",
        data: {
          merchant_id: data.merchant.id,
          content: data.desc,
          images: data.upload_list_data.join(',')
        },
        dataType: "json",
        success: res => {
          my.hideLoading();
          if (res.data.code == 0) {
            my.showToast({
              type: "success",
              content: "投诉成功"
            });
            setTimeout(function() {
              my.redirectTo({
                url: "/pages/complaint-list/complaint-list"
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
