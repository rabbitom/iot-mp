//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  
  onTapStart: function() {
    wx.openBluetoothAdapter({
      success: function(res) {
        wx.navigateTo({
          url: '/pages/devices/devices',
        })
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
  
  /**
   * when user share the app
   */
  onShareAppMessage: function () {
    return {
      title: 'My First IoT Mini Program'
    }
  }
})
