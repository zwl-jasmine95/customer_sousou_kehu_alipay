const app = getApp();

Page({
  data:{
    params: null,
  },

  onLoad(e) {
    this.setData({
      params: e
    });
  },

  // 获取位置事件
  location_event(e){
    var status = e.status || -1;
    if (status == -1) {
      app.use_location(this, "location_event");
      return false;
    }

    // 授权成功
    if(status == 1000)
    {
      // 触发回调函数
      var pages_callback = this.data.params.pages_callback || null;
      if(pages_callback != null)
      {
        my.redirectTo({
          url: "/pages/"+pages_callback+"/"+pages_callback+"?status="+status+"&lng="+e.lng+"&lat="+e.lat
        });
      }
    }
  }
})
