// pages/authentication/authentication.js
// import { multiArray, objectMultiArray } from '../../pickerLinkage.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplyIf: true,
    array: ['请选择', '5万以内', '5-10万', '10-50万', '50万以上'],
    array1: ['请选择', '赚取收益', '资金增值', '抗通货膨胀'],
    array2: ['请选择', '1年以内', '1-3年', '3年以上'],
    array3: ['请选择', '10万以内', '10-30万', '30万-100万','100万以上'],
    index: 0,
    index1: 0,
    index2: 0,
    index3: 0,
    keGuiHuaZiChan: '',
    caiFuGuiHuaMuBiao: '',
    caiFuGuiHuaNianXian: '',
    jiaTingShouZhiZhuangKuang: '',
  },
  keGuiHuaZiChan: function (e) {
    if (e.detail.value == 0) {
      wx.showToast({
        title: '您当前尚未选择',
      })
      this.setData({
        index: e.detail.value,
        keGuiHuaZiChan: ''
      })
    } else {
      this.setData({
        index: e.detail.value,
        keGuiHuaZiChan: this.data.array[e.detail.value]
      })
      this.makeSureOk()
    }


  },
  caiFuGuiHuaMuBiao: function (e) {
    if (e.detail.value == 0) {
      wx.showToast({
        title: '您当前尚未选择',
      })
      this.setData({
        index1: e.detail.value,
        caiFuGuiHuaMuBiao: ''
      })
      this.makeSureOk()
    } else {
      this.setData({
        index1: e.detail.value,
        caiFuGuiHuaMuBiao: this.data.array1[e.detail.value]
      })
      this.makeSureOk()
    }
  },
  caiFuGuiHuaNianXian: function (e) {
    if (e.detail.value == 0) {
      wx.showToast({
        title: '您当前尚未选择',
      })
      this.setData({
        index2: e.detail.value,
        caiFuGuiHuaNianXian: ''
      })
      this.makeSureOk()
    } else {
      this.setData({
        index2: e.detail.value,
        caiFuGuiHuaNianXian: this.data.array2[e.detail.value]
      })
      this.makeSureOk()
    }
  },
  jiaTingShouZhiZhuangKuang: function (e) {
    if (e.detail.value == 0) {
      wx.showToast({
        title: '您当前尚未选择',
      })
      this.setData({
        index3: e.detail.value,
        jiaTingShouZhiZhuangKuang: ''
      })
      this.makeSureOk()
    } else {
      this.setData({
        index3: e.detail.value,
        jiaTingShouZhiZhuangKuang: this.data.array3[e.detail.value]
      })
      this.makeSureOk()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

refuse(e){
  wx.showToast({
    title: '请稍等',
          icon: 'none',
          duration:5000
  })
  wx.request({
    url: app.globalData.url + '/login-refresh',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'cookie': wx.getStorageSync('cookie')
    },
    method: 'post',
    success: function (res) {
      wx.hideToast()
      if (res.data.code == 0) {
          app.globalData.userInfoDetail = res.data.data
          // that.getPaper()
          // if(res.data.data.beiJingZiLiaoIs==0){
          //   wx.reLaunch({
          //     url: '../information/information',
          //   })
          // }else
           if(res.data.data.questionnaireIs==0){
            wx.reLaunch({
              url: '../assess/assess',
            })
          }else{
            wx.reLaunch({
              url: '../programme/programme',
            })
          }
      } else {
        wx.showToast({
          title: res.data.codeMsg,
          icon: 'none'
        })
      }
    }
  })
  
},
  // 确认表格是否填写完整
  makeSureOk(e) {
    if (this.data.keGuiHuaZiChan != '' && this.data.caiFuGuiHuaMuBiao != '' && this.data.caiFuGuiHuaNianXian != '' && this.data.jiaTingShouZhiZhuangKuang != '') {
      this.setData({
        supplyIf: false
      })
    }
  },
  // 提交认证
  supplyYes(e) {

    var that = this
    wx.showToast({
      title: '请稍等',
            icon: 'none',
            duration:5000
    })
    wx.request({
      url: app.globalData.url + '/update-bei-jing-zi-liao',
      data: 'keGuiHuaZiChan=' + that.data.keGuiHuaZiChan + '&caiFuGuiHuaMuBiao=' + that.data.caiFuGuiHuaMuBiao + '&caiFuGuiHuaNianXian=' + that.data.caiFuGuiHuaNianXian + '&jiaTingShouZhiZhuangKuang=' + that.data.jiaTingShouZhiZhuangKuang,
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '请稍等',
            icon: 'none',
            duration: 10000
          })
          wx.request({
            url: app.globalData.url + '/login-refresh',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              'cookie': wx.getStorageSync('cookie')
            },
            method: 'post',
            success: function (res) {
              wx.hideToast()
              if (res.data.code == 0) {
                  app.globalData.userInfoDetail = res.data.data
                  // that.getPaper()
                  if(res.data.data.beiJingZiLiaoIs==0){
                    wx.reLaunch({
                      url: '../information/information',
                    })
                  }else if(res.data.data.questionnaireIs==0){
                    wx.reLaunch({
                      url: '../assess/assess',
                    })
                  }else{
                    wx.reLaunch({
                      url: '../programme/programme',
                    })
                  }
              } else {
                wx.showToast({
                  title: res.data.codeMsg,
                  icon: 'none'
                })
              }
            }
          })
        } else if (res.data.code == 20) {
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
        }
      }
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