// pages/project/project.js
var app=getApp()
// var area = require('../../area.js');
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
    this.setData({
      background:app.globalData.url+'wxminapp/topbg.png',
      
    })
  },
  onPageScroll(e){
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
  },

  startPaper(paperId){
    var that=this
    wx.request({
      url:app.globalData.url+ '/start-paper',
      method:'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'cookie': wx.getStorageSync('cookie')
        },
        data:'paperId='+paperId,
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
            app.globalData.doPaperId=res.data.data.doPaperId
              // that.doPaperId(res.data.data.doPaperId)
            }
        }
    })
  },
  doPaperId(paperId){
    var that=this
    wx.request({
      url:app.globalData.url+ '/paper-question-list',
      method:'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'cookie': wx.getStorageSync('cookie'),
        },
        data:'paperId='+paperId+"&order=asc&sort=orderNo",
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
              app.globalData.questionList=res.data.data.itemList
              app.globalData.questionListNum=0
              app.globalData.questionListLength=res.data.data.itemList.length
              that.setData({
                questionList:res.data.data.itemList
              })
              wx.setStorageSync('questionList', JSON.stringify(res.data.data.itemList))

              wx.navigateTo({
                url: '../assess/assess',
              })
            }
        }
    })
  },
  getPaper(){
    var that=this
    wx.request({
      url: app.globalData.url+'/get-paper',
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
          app.globalData.paperId=res.data.data.paperId
            that.startPaper(res.data.data.paperId)
            that.doPaperId(res.data.data.paperId)
        }  
      }
    })
  },
  onlyBg(e){
    var that=this
    wx.showToast({
      title: '请稍等',
      icon:'loading',
      duration:10000
    })
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
          if(res.data.data.doPaperId){
            wx.navigateTo({
              url: '../programme/programme',
            })
          }else{
            var timer = setInterval(function () {
              if(that.data.realnameCertificationIs==0){
                clearInterval(timer);
                wx.showToast({
                  title: '请先实名认证',
                  icon: 'none',
                  duration: 2000,
                  mask: true,
                  complete: function complete(res) {
                    setTimeout(function () {                          
                      wx.navigateTo({
                        url: '../authentication/authentication',
                      })
                    }, 500);
                  }
                });
              }else if(that.data.realnameCertificationIs==1){
                clearInterval(timer);
                that.getPaper()
                
              }
            }, 500);
          }
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
    var that=this
    wx.request({
      url: app.globalData.url + '/login-refresh',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
          if(res.data.code==20){
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
          }else{
            app.globalData.userInfoDetail = res.data.data
            that.setData({
              realnameCertificationIs:res.data.data.realnameCertificationIs
            })
          }
      }
    })
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