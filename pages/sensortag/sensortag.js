// pages/sensortag/sensortag.js
const luminanceService = 'f000aa70-0451-4000-b000-000000000000';
const luminanceConfig = 'f000aa72-0451-4000-b000-000000000000';
const luminanceData = 'f000aa71-0451-4000-b000-000000000000';
const startCommand = new Uint8Array([1]);

var deviceId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    luminance: '-'
  },

  onTapDisconnect() {
    wx.closeBLEConnection({
      deviceId: deviceId,
      success: function(res) {
        wx.navigateBack({});
      },
      fail: function(res) {
        wx.showModal({
          title: 'Disconnect Failed',
          content: res.errMsg
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    deviceId = options.deviceId;
    if(deviceId == null)
      return;
    new Promise((resolve, reject)=>{
      wx.createBLEConnection({
        deviceId: deviceId,
        success: resolve,
        fail: reject
      })
    }).then(res=>{
      console.log("connected to device");
      return new Promise((resolve, reject)=>{
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success: resolve,
          fail: reject
        })
      })
    }).then(res=>{
      console.log("discovered services", res);
      return new Promise((resolve, reject)=>{
        wx.getBLEDeviceCharacteristics({
          deviceId: deviceId,
          serviceId: luminanceService,
          success: resolve
        })
      })
    }).then(res=>{
      console.log("discovered characteristics", res);
      wx.showToast({
        title: 'Device is ready!',
      });
      return new Promise((resolve,reject)=>{
        wx.notifyBLECharacteristicValueChange({
          deviceId: deviceId,
          serviceId: luminanceService,
          characteristicId: luminanceData,
          state: true,
          success: resolve,
          fail: reject
        })
      })
    }).then(res => {
      console.log("enabled notification", res);
      return new Promise((resolve, reject) => {
        wx.writeBLECharacteristicValue({
          deviceId: deviceId,
          serviceId: luminanceService,
          characteristicId: luminanceConfig,
          value: startCommand.buffer,
          success: resolve,
          fail: reject
        })
      })
    }).then(res=>{
      console.log("start sensor success");
    }, res => {
      console.log(res);
      wx.showModal({
        title: 'Connection Failed',
        content: res.errMsg || res,
        showCancel: false
      })
    });
    var page = this;
    wx.onBLECharacteristicValueChange(function(res){
      var value = new Uint16Array(res.value);
      var rawData = value[0];
      var m = rawData & 0x0FFF;
      var e = rawData >> 12;
      var l = m * Math.pow(2, e) / 100;
      page.setData({
        luminance: l
      });
    })
  }
  
})