// pages/devices/devices.js
var myDevices = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isScanning: false,
    scanProgress: 0,
    devices: [
      // {
      //   deviceId: '1',
      //   name: 'name',
      //   RSSI: -10
      // },
      // {
      //   deviceId: '2',
      //   name: 'name2',
      //   RSSI: -20
      // }
    ]
  },

  onTapScan() {
    var page = this;
    var progressInterval;
    wx.startBluetoothDevicesDiscovery({
      success: function(res) {
        page.setData({
          isScanning: true,
          scanProgress: 0
        })
        progressInterval = setInterval(function(){
          if(page.data.scanProgress == 100) {
            clearInterval(progressInterval);
            page.setData({
              isScanning: false,
              scanProgress: 0
            });
            wx.stopBluetoothDevicesDiscovery({
              success: function (res) {
                console.log("scan stopped");
              },
            })
          }
          else {
            page.setData({
              scanProgress: page.data.scanProgress + 1
            })
          }
        }, 50);
      },
      fail: function(res) {
        wx.showModal({
          title: "Scan Failed",
          content: res.errMsg,
          showCancel: false
        });
      }
    })
  },

  onTapDeviceItem(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/sensortag/sensortag?deviceId=' + e.currentTarget.dataset.deviceId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.onBluetoothDeviceFound(function (res){
      console.log(res);
      for(var index in res.devices) {
        let device = res.devices[index];
        if(device.name === "")
          device.name = "Unnamed"
        myDevices.push(device);
        myDevices.sort(function(a,b){
          return b.RSSI - a.RSSI;
        });
        page.setData({
          devices: myDevices
        });
      }
    })
  }
})