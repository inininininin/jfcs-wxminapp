// pages/project/project.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:app.globalData.statusBarHeight,
    titleBarHeight:app.globalData.titleBarHeight,
    background:'',
    topcolor:'#ffe3ab',
    zIndex:1,
    showIs:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onPageScroll(e){
    console.log(e.scrollTop)
    if(e.scrollTop>5){
      this.setData({
        zIndex:4,
        // background:'#0F0F0D',
        // topcolor:'#0F0F0D',
      })
    }else{
      this.setData({
        zIndex:1,
        // background:'',
        // topcolor:'#ffe3ab',
      })
    }
  },
  // 微信登录
  loginWx: function () {
    var that = this
    that.setData({
      showIs: true
    })
    // if (!that.data.selectAgree) {
    //   wx.showToast({
    //     title: '请勾选登录协议',
    //     icon: 'none',
    //     duration: 1000
    //   })
    // } else if (wx.getStorageSync('loginHospitalId') == '' || wx.getStorageSync('loginHospitalId') == null || wx.getStorageSync('loginHospitalId') == undefined) {
    //   wx.showToast({
    //     title: '选择登录医院',
    //     icon: 'none',
    //     duration: 2000,
    //     mask: true,
    //     complete: function complete(res) {
    //       setTimeout(function () {
    //         wx.navigateTo({
    //           url: '../hosList/hosList',
    //         })
    //       }, 100);
    //     }
    //   });
    // } else {
    //   that.setData({
    //     showIs: true
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})