// pages/authentication/authentication.js
import { multiArray, objectMultiArray } from '../../pickerLinkage.js'
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendCode: true,
    sendtext: '获取验证码',
    time: 60,
    supplyIf: true,
    items: [
      { value: '1', name: '男'},
      { value: '2', name: '女' },
    ],
    multiIndex: [0, 0],
    multiArray: multiArray,
    objectMultiArray: objectMultiArray,
    picker:true,
    name:'',
    phone:'',
    smsvcode:'',
    sex:'',
    age:'',
    area1Id:'',
    area1Name:'',
    area2Id:'',
    area2Name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  refuse(e){
    wx.navigateBack()
  },
  radioChange(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    this.setData({
      sex:e.detail.value,
      items
    })
    this.makeSureOk()
  },
  sendCodeNo(e) {
    if (this.data.sendCode) {
      if (e.currentTarget.dataset.text == '获取验证码') {
        wx.showToast({
          title: '请填写手机号',
          icon: 'none'
        })
      }
    }
  },
  supplyNo(e) {
    wx.showToast({
      title: '信息未填写完整',
      icon: 'none'
    })
  },

  bindMultiPickerChange: function (e) {
    console.log(e)
    this.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
     area1Id:e.detail.value[0],
     area1Name:multiArray[0][e.detail.value[0]],
     area2Id:e.detail.value[1],
     area2Name:multiArray[e.detail.value[1]],
     })
    console.log(multiArray[0][e.detail.value[0]],multiArray[1][e.detail.value[1]])
    this.makeSureOk()
  },
  bindMultiPickerColumnChange: function (e) {
    console.log(e)
    var that=this
    var list
    that.setData({
      picker:false
    })
    switch (e.detail.column) {
      case 0: list = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            list.push(that.data.objectMultiArray[i].regname)
          }
        }
        that.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value, "multiIndex[1]": 0
        })
        console.log(list)
    }
    console.log(e.detail.value)
    this.makeSureOk()
  },
  nameSure(e){
    this.setData({
      name:e.detail.value
    })
    this.makeSureOk()
  },
  ageSure(e){
    this.setData({
      age:e.detail.value
    })
    this.makeSureOk()
  },
  phoneSure(e){
    this.setData({
      phone:e.detail.value
    })
    if(e.detail.value.length>=11){
      this.setData({
        sendCode:false,
      })
    }else{
      this.setData({
        sendCode:true,
        sendtext:'获取验证码'
      })
    }
    this.makeSureOk()
  },
  yzCodeSure(e){
    this.setData({
      smsvcode:e.detail.value
    })
    this.makeSureOk()
  },
// 获取验证码
// 获取验证码
timeBack() {
  var that = this
  var timer = setInterval(function () {
    var time = that.data.time - 1;
    that.setData({
      sendtext: time + ' s',
      time: time
    })
    if (that.data.time == 0) {
      clearInterval(timer);
      that.setData({
        sendtext: '获取验证码',
        time: 60
      })
    }
  }, 1000);
},
sendCodeYes(e) {
  var that = this
  that.setData({
    sendCode:!that.data.sendCode
  })
   if (that.data.sendtext != '获取验证码') {
    return
  } else {
    that.setData({
      time: 60
    })
    wx.request({
      url: app.globalData.url + '/send-sms-vcode',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: 'post',
      data: {
        phone: that.data.phone,
      },
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          that.timeBack()
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'none'
          })
        }
      }
    })
  }
},

// 确认表格是否填写完整
makeSureOk(e){
  console.log(this.data.name,this.data.phone,this.data.smsvcode,this.data.sex,this.data.age,this.data.area1Id,this.data.area2Id,this.data.area1Name,this.data.area2Name)
  if(this.data.name!=''&&this.data.phone!=''&&this.data.phone.length>=11&&this.data.smsvcode!=''&&this.data.sex!=''&&this.data.age!=''&&this.data.area1Id!=''&&this.data.area1Name!=''&&this.data.area2Id!=''&&this.data.area2Name!=''){
      console.log(2)
      this.setData({
        supplyIf:false
      })
  }
},
  // 提交认证
  supplyYes(e){
    var that=this
    wx.request({
      url: app.globalData.url+'/update-my-realname-info',
      data:'realname='+that.data.name+'&phone='+that.data.phone+'&smsvcode='+that.data.smsvcode+'&sex='+that.data.sex+'&age='+that.data.age
      +'&area1Id='+that.data.area1Id+'&area1Name='+that.data.area1Name+'&area2Id='+that.data.area2Id+'&area2Name='+that.data.area2Name,
      method:'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      success:function(res){
        if(res.data.code==0){
          wx.showToast({
            title: '认证中,请稍等',
            icon:'none',
            duration:20000
          })
          that.getPaper()
          // wx.navigateTo({
          //   url: '../assessment/assessment',
          // })
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
        }
      }
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
                url: '../assessment/assessment',
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