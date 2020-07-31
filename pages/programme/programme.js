// pages/programme/programme.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['背景资料', '市场快评', '规划方案', '规划建议'],
    currentTab: 0,
    paperDetail: [],
    realname: '',
    doPaperId: '',
    statusBarHeight: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
    navtitle: '财富规划方案',
    picList: [],
    close:'none',
    imglist:[],
    canvasShow:false,
    hidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // that.sys();
    
    that.setData({
      backgroundUrl:app.globalData.url+'/wxminapp/blackbg.png',
      keGuiHuaZiChan:app.globalData.userInfoDetail.keGuiHuaZiChan||'',
      caiFuGuiHuaMuBiao:app.globalData.userInfoDetail.caiFuGuiHuaMuBiao||'',
      caiFuGuiHuaNianXian:app.globalData.userInfoDetail.caiFuGuiHuaNianXian||'',
      jiaTingShouZhiZhuangKuang:app.globalData.userInfoDetail.jiaTingShouZhiZhuangKuang||'',
    })
    var sex
    if (app.globalData.userInfoDetail.sex == 1) {
      sex = '男'
    } else if (app.globalData.userInfoDetail.sex == 2) {
      sex = '女'
    } else {
      sex = ''
    }
    if (app.globalData.userInfoDetail.age != '' && app.globalData.userInfoDetail.age != null && app.globalData.userInfoDetail.age != undefined) {
      var age = app.globalData.userInfoDetail.age
    }
    if (app.globalData.userInfoDetail.realname != '' && app.globalData.userInfoDetail.realname != null && app.globalData.userInfoDetail.realname != undefined) {
      var realname = app.globalData.userInfoDetail.realname
    }
    that.setData({
      age: age,
      realname: realname,
      sex: sex,
    })
    console.log(123123)
    wx.request({
      url: app.globalData.url + '/get-questionnaire-result',
      method: 'get',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      success: function (res) {
        console.log(console.log(res))
        if (res.data.codeMsg) {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none',
          });
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
        } else if (res.data.code == 0) {
          if (res.data.data.score1 < 40) {
            res.data.data.resultName = '低风险承受能力'
          } else if (40 <= res.data.data.score1 < 60) {
            res.data.data.resultName = '中等风险承受能力'
          } else if (60 <= res.data.data.score1 <= 79) {
            res.data.data.resultName = '中高风险承受能力'
          } else {
            res.data.data.resultName = '高风险承受能力'
          }
          if (res.data.data.score2 < 40) {
            res.data.data.resultName1 = '保守型'
          } else if (40 <= res.data.data.score2 < 60) {
            res.data.data.resultName1 = '稳健型'
          } else if (60 <= res.data.data.score2 <= 79) {
            res.data.data.resultName1 = '积极型'
          } else {
            res.data.data.resultName1 = '冒险型'
          }
            if (res.data.data.resultPic1) {
              res.data.data.resultPic1 = app.cover(res.data.data.resultPic1)
            }
          if (res.data.data.resultPic2) {
            res.data.data.resultPic2 = app.cover(res.data.data.resultPic2)
          }
          if (res.data.data.resultPic3) {
            res.data.data.resultPic3 = app.cover(res.data.data.resultPic3)
          }

          console.log(res.data.data.questionnaireTime)
          console.log(res.data.data.questionnaireTime.split('-')[2])
          res.data.data.doPaperId=res.data.data.questionnaireTime.split('-')[0] + res.data.data.questionnaireTime.split('-')[1] + res.data.data.questionnaireTime.split('-')[2].split(' ')[0]+res.data.data.questionnaireTime.split('-')[2].split(' ')[1].split(':')[0]+res.data.data.questionnaireTime.split('-')[2].split(' ')[1].split(':')[1]+res.data.data.questionnaireTime.split('-')[2].split(' ')[1].split(':')[2].split('.')[0]
          res.data.data.questionnaireTime = res.data.data.questionnaireTime.split(' ')[0]

          that.data.picList.push(res.data.data.resultPic1)
          that.data.picList.push(res.data.data.resultPic2)
          that.data.picList.push(res.data.data.resultPic3)
          
          that.setData({
            doPaperId: res.data.data.doPaperId,
            // doPaperId:res.data.data.doPaperId.substring(0,15),
            paperDetail: res.data.data,
            list:res.data.data,
            // questionList:res.data.data.questionList,
          })
          // console.log(that.data.paperDetail)
        }
      }
    })
  },
  lookPic(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  lookPicAll(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.picList // 需要预览的图片http链接列表
    })
  },

  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
    })

  },
  
  backHistory(e) {
    wx.reLaunch({
      url: '../projectsE/projectsE',
    })
  },

  // 分享朋友圈的那些事
   // 方法
   share: function(e) {
    this.setData({
      close: 'block'
    })
  },
  close: function(e) {
    this.setData({
      close: 'none'
    })
  },

  sharepyq(e) {
    this.setData({
      close: 'none'
    })
    wx.navigateTo({
      url: '../canvas/canvas',
    })
    // var that = this
    // if(that.data.imglist){
    //   wx.showToast({
    //     title: '请稍等',
    //     icon:'none'
    //   })
    //   // wx.request({
    //   //   url: app.globalData.url +'/c2/share?articleId=' + that.data.id,
    //   //   method: 'get',
    //   //   header: {
    //   //     "Content-Type": "application/x-www-form-urlencoded",
    //   //     'cookie': app.globalData.cookie
    //   //   },
    //   //   success: function (res) {
    //   //   }
    //   // })
    //   // that.setData({
    //   //   pyqewm: app.globalData.url + '/wxminqrcode?path=pages/programmeShare/programmeShare?id=' + that.data.id + '&width=200'
    //   // })
    //   // if(!that.data.avatorShare){
    //     that.setData({
    //       canvasShow:true
    //     })
    //     that.lookCode()
    //   // }else{
    //   //   wx.previewImage({
    //   //     urls: [that.data.urls],
    //   //   })
    //   // }
    
    // }else{
    //   wx.showToast({
    //     title: '请稍等',
    //     icon:'none'
    //   })
    //   setTimeout(function(){
    //     if(that.data.imglist){
    //       // wx.request({
    //       //   url: app.globalData.url +'/c2/share?articleId=' + that.data.id,
    //       //   method: 'get',
    //       //   header: {
    //       //     "Content-Type": "application/x-www-form-urlencoded",
    //       //     'cookie': app.globalData.cookie
    //       //   },
    //       //   success: function (res) {
    //       //     wx.hideToast({})
    //       //   }
    //       // })
    //         that.setData({
    //           canvasShow:true
    //         })
    //         that.lookCode()
    //     }else{
    //       wx.showToast({
    //         title: '生成失败,请稍后重试',
    //         icon:'none'
    //       })
    //     }
    //   },1500)
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
    console.log(121321111)
    var path = '/pages/projectsE/projectsE?isShare=1&id='+app.globalData.userInfoDetail.userId;
    return {
      title: '欢迎使用嘉富财商小程序', 
      path: path, 
      // imageUrl:app.globalData.url+ '/wxminapp/VIPEve.png',
      success: function (res) {
      },
      fail: function (res) {
      },
    }
  }
})