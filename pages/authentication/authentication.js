// pages/authentication/authentication.js
// import { multiArray, objectMultiArray } from '../../pickerLinkage.js'
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendCode: true,
    phoneIf:false,
    sendtext: '获取验证码',
    time: 60,
    supplyIf: true,
    items: [
      { value: '1', name: '男'},
      { value: '2', name: '女' },
    ],
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
    region: ['北京省', '北京市', '东城区'],
    customItem: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.areaJson)
    this.setData({
      multiArray:app.globalData.areaJson
    })
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: vm.globalData.url + '/refresh-wx-session-key',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'cookie': wx.getStorageSync('cookie')
          },
          method: 'post',
          data: {
            jscode: res.code,
          },
          success: function (res) {
            wx.hideToast()
            if (res.data.code == 0) {
              // wx.setStorageSync('cookie', res.header['Set-Cookie'])
            
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
              })
            }else{
              wx.showToast({
                title: res.data.codeMsg,
                icon: 'none',
                duration: 2000,
               
              })
            }
          }
        })
      }
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      picker:false
    })
   
    this.setData({
      region: e.detail.value,
      area1Id:e.detail.code[2].substring(0,2),
      area2Id:e.detail.code[2].substring(0,4),
      area3Id:e.detail.code[2],
      area1Name:e.detail.value[0],
      area2Name:e.detail.value[1],
      area3Name:e.detail.value[2],
    })
    this.makeSureOk()
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
  if(this.data.name!=''&&this.data.phone!=''&&this.data.sex!=''&&this.data.age!=''&&this.data.area1Id!=''&&this.data.area1Name!=''&&this.data.area2Id!=''&&this.data.area2Name!=''&&this.data.area3Id!=''&&this.data.area3Name!=''){
      console.log(2)
      this.setData({
        supplyIf:false
      })
  }
},
  // 提交认证
  supplyYes(e){
   
    var that=this
    if(that.data.area1Id==''){
      wx.showToast({
        title: '请选择地区',
        icon:'none',
      })
      return
    }
    wx.showToast({
      title: '请稍等',
      icon:'none',
      duration:5000
    })
    wx.login({
      success(res) {
        var jscode = res.code
        wx.request({
          url: app.globalData.url+'/update-my-realname-info',
          data:'realname='+that.data.name+'&age='+that.data.age+'&sex='+that.data.sex
          +'&area1Id='+that.data.area1Id+'&area1Name='+that.data.area1Name+'&area2Id='+that.data.area2Id+'&area2Name='+that.data.area2Name+'&area3Id='+that.data.area3Id+'&area3Name='+that.data.area3Name+'&wxMinappIv='+that.data.iv+'&wxMinAppEncryptedDataOfPhoneNumber='+that.data.encryptedData+'&jscode='+jscode,
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
      }
    })
    
  },


  getPhoneNumber(e) {
 
    var that=this
    console.log(e.detail)
    console.log(e.detail.iv)
    wx.showToast({
      title: '授权中，请稍后',
      icon:'none',
      duration:1000
    })
    that.setData({
      encryptedData:encodeURIComponent(e.detail.encryptedData),
      iv:encodeURIComponent(e.detail.iv)
    })

    
    wx.login({
        success(res) {
          var jscode = res.code
          if(e.detail.encryptedData!=null&&e.detail.encryptedData!=''&&e.detail.encryptedData!=undefined){
            wx.request({
              url: app.globalData.url + '/get-wx-minapp-phone',
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                'cookie': wx.getStorageSync('cookie')
              },
              data:'wxMinAppEncryptedDataOfPhoneNumber='+encodeURIComponent(e.detail.encryptedData)+'&wxMinappIv='+encodeURIComponent(e.detail.iv)+'&jscode='+jscode,
              method: 'post',
              success: function (res) {
                wx.hideToast()
                if (res.data.code == 0) {
                  that.setData({
                    phone:res.data.data.phone
                  })
                  that.makeSureOk()
                } else {
                  wx.showToast({
                    title: res.data.codeMsg,
                    icon: 'none'
                  })
                }
              }
            })
          }else{
            wx.showToast({
              title: '获取失败请重试',
              icon:'none',
              duration:1000
            })
          }
        }
      })
   
    // wx.login({
    //   success(res) {
    //     var code = res.code
    //     wx.request({
    //       url: app.globalData.url + '/user/login-by-wxminapp',
    //       header: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //       method: 'post',
    //       data: {
    //         wsJsCode: code,
    //         loginHospitalId: wx.getStorageSync('loginHospitalId'),
    //         wxMinappencryptedDataOfPhoneNumber: e.detail.encryptedData || '',
    //         wxMinappIv: e.detail.iv || '',
    //       },
    //       success: function (res) {
    //         wx.hideToast()
    //         if (res.data.code == 0) {

    //           wx.setStorageSync('cookie', res.header['Set-Cookie'])
    //           wx.request({
    //             url: app.globalData.url + '/user/login-refresh',
    //             header: {
    //               "Content-Type": "application/x-www-form-urlencoded",
    //               'cookie': wx.getStorageSync('cookie')
    //             },
    //             method: 'post',
    //             success: function (res) {
    //               wx.hideToast()
    //               if (res.data.code == 0) {
    //                 app.globalData.userInfoDetail = res.data.data
    //                 wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
    //                 wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)
    //                 wx.setStorageSync('codeType', that.data.type)
    //                 wx.setStorageSync('withoutLogin', false)
    //                 wx.showToast({
    //                   title: '登录成功',
    //                   icon: 'none',
    //                   duration: 2000,
    //                   mask: true,
    //                   complete: function complete(res) {
    //                     setTimeout(function () {                          
    //                       if (that.data.fromType == 1) {
    //                         wx.setStorageSync('fromTab', 1)
    //                         wx.switchTab({
    //                           url: '../index/index',
    //                         })
    //                         wx.setStorageSync('historyUrl', that.data.backUrl)
    //                       } else {
    //                         wx.switchTab({
    //                           url: '../index/index',
    //                         })
    //                       }
    //                     }, 500);
    //                   }
    //                 });

    //               } else {
    //                 wx.showToast({
    //                   title: res.data.codeMsg,
    //                   icon: 'none'
    //                 })
    //               }
    //             }
    //           })


    //         } else {
    //           wx.showToast({
    //             title: res.data.codeMsg,
    //             icon: 'none'
    //           })
    //         }
    //       }
    //     })
    //   }
    // })
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