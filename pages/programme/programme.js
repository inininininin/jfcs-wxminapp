// pages/programme/programme.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['背景资料', '市场快评', '规划方案','规划建议'],
    currentTab: 0,
    paperDetail:[],
    realname:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var sex
    if(app.globalData.userInfoDetail.sex==1){
      sex='男'
    }else if(app.globalData.userInfoDetail.sex==2){
      sex='女'
    }else{
      sex=''
    }
    if(app.globalData.userInfoDetail.age!=''&&app.globalData.userInfoDetail.age!=null&&app.globalData.userInfoDetail.age!=undefined){
      var age =app.globalData.userInfoDetail.age
    }
    if(app.globalData.userInfoDetail.realname!=''&&app.globalData.userInfoDetail.realname!=null&&app.globalData.userInfoDetail.realname!=undefined){
      var realname =app.globalData.userInfoDetail.realname
    }
    that.setData({
      age:age,
      realname:realname,
      sex:sex,
    })
    console.log(123123)
    wx.request({
      url:app.globalData.url+ '/get-last-done-do-paper',
      method:'get',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      success:function(res){
        if(res.data.codeMsg){
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none',
          });
        }else if(res.data.code==20){
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000,
            mask: true,
            complete: function complete(res) {
              setTimeout(function () {                          
                  wx.navigateTo({
                    url: '../login/login',
                  })
              }, 500);
            }
          });
        }else if(res.data.code==0){
          res.data.data.guiHuaFangAnImage=app.cover(res.data.data.guiHuaFangAnImage)
          res.data.data.guiHuaJianYiImage=app.cover(res.data.data.guiHuaJianYiImage)
          res.data.data.shiChangKuaiPingImage=app.cover(res.data.data.shiChangKuaiPingImage)
          res.data.data.doneTime=res.data.data.doneTime.split(' ')[0]
          that.setData({
            paperDetail:res.data.data
          })
          console.log(that.data.paperDetail)
        }  
      }
    })
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
    
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