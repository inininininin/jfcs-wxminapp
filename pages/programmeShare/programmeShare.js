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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      backgroundUrl:app.globalData.url+'/wxminapp/blackbg.png',
    })
    wx.request({
      url: app.globalData.url + '/get-user-questionnaire-result',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // 'cookie': wx.getStorageSync('cookie')
      },
      data:'userId='+options.id,
      success: function (res) {
        console.log(res)
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
          } else if (40 <= res.data.data.score1 &&res.data.data.score1< 60) {
            res.data.data.resultName = '中等风险承受能力'
          } else if (60 <= res.data.data.score1&&res.data.data.score1 <= 79) {
            res.data.data.resultName = '中高风险承受能力'
          } else {
            res.data.data.resultName = '高风险承受能力'
          }
          if (res.data.data.score2 < 40) {
            res.data.data.resultName1 = '保守型'
          } else if (40 <= res.data.data.score2&&res.data.data.score2 < 60) {
            res.data.data.resultName1 = '稳健型'
          } else if (60 <= res.data.data.score2&&res.data.data.score2 <= 79) {
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
          // if(res.data.data.sex==1){
          //   res.data.data.sex='男'
          // }else{
          //   res.data.data.sex='女'
          // }
          res.data.data.sex=res.data.data.sex==1?'男':'女'
          that.data.picList.push(res.data.data.resultPic1)
          that.data.picList.push(res.data.data.resultPic2)
          that.data.picList.push(res.data.data.resultPic3)
          
          that.setData({
            doPaperId: res.data.data.doPaperId,
            // doPaperId:res.data.data.doPaperId.substring(0,15),
            paperDetail: res.data.data,
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
      url: '../index/index',
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