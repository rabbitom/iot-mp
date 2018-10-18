//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  
  onTapStart: function() {
    wx.openBluetoothAdapter({
      success: function(res) {
        console.log("open bt adapter success");
      },
      fail: function(res) {
        console.log(res.errMsg);
        wx.showModal({
          title: 'Bluetooth Unavailable',
          content: 'Please enable bluetooth first!',
          showCancel: false
        });
      }
    })
  },
  
  onLoad: function () {
  }
})
