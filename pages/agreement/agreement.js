const app = getApp();

Page({
  data: {
    
  },
  onLoad(option) {
    console.log(option.agreement_url);
    this.setData({
      agreement_url: option.agreement_url
    })
  }

  
});
