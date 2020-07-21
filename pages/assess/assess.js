// pages/assess/assess.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],
    // array: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,],
    paperQuestionId:'',
    questionList:[],
    ifShowEnd:false,
    ansname:'',
    ansNum:'',
    answer:[],
    bigIntroBoxTopBg:'',
    index: 0,
  },
  bindPickerChange: function (e) {
    wx.showToast({
      title: '请稍等',
      icon: 'none',
      duration:10000
    });
    this.setData({
      index: e.detail.value
    })
    var param='age='+(parseInt(e.detail.value)+18)
    this.answerQue(param)
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(app.globalData.userProtocol)
    that.setData({
      userProtocol:app.globalData.userProtocol,
      ansLength:app.globalData.questionListLength,
      bigIntroBoxTopBg:app.globalData.url+'/wxminapp/whitebg.png'
    })
      console.log(app.globalData.questionList, app.globalData.questionListNum,app.globalData.questionListLength)
    for(var i in  app.globalData.questionList){
      if(i==app.globalData.questionListNum){
        console.log(app.globalData.questionListNum)
        
        if(app.globalData.questionListNum==app.globalData.questionListLength-1){
          console.log(app.globalData.questionListNum)
          that.setData({
            // ifShowEnd:true
          })
        }
        that.setData({
          // paperQuestionId:app.globalData.questionList[i].paperQuestionId,
          ansname:app.globalData.questionList[i].name,
          answer:app.globalData.questionList[i].answer,
          ansNum:parseInt(app.globalData.questionListNum)+1,
          // ifShowEnd:false
        })
        return
      }
    }
  },
  
  changeAns(e){
    var that=this
    wx.showToast({
      title: '请稍等',
      icon: 'none',
      duration:5000,
    });
    var content=encodeURIComponent(e.currentTarget.dataset.content)
    var score=e.currentTarget.dataset.score
    for(var i in that.data.answer){
      if(that.data.answer[i].content==e.currentTarget.dataset.content){
        that.data.answer[i].active='active'
      }else{
        that.data.answer[i].active=''
      }
    }
    that.setData({
      answer:that.data.answer
    })
    if(that.data.ansNum==2){
      var param='jobScore='+score+"&jobText="+content
    }else if(that.data.ansNum==3){
      var param='jiaTingFuDanScore='+score+"&jiaTingFuDanText="+content
    }else if(that.data.ansNum==4){
      var param='zhiYeQingKuangScore='+score+"&zhiYeQingKuangText="+content
    }else if(that.data.ansNum==5){
      var param='touZiJingYanScore='+score+"&touZiJingYanText="+content
    }else if(that.data.ansNum==6){
      var param='touZiZhiShiScore='+score+"&touZiZhiShiText="+content
    }else if(that.data.ansNum==7){
      var param='renShouKuiSuiScore='+score+"&renShouKuiSuiText="+content
    }else if(that.data.ansNum==8){
      var param='shouYaoKaoLvScore='+score+"&shouYaoKaoLvText="+content
    }else if(that.data.ansNum==9){
      var param='renPeiDongZuoScore='+score+"&renPeiDongZuoText="+content
    }else if(that.data.ansNum==10){
      var param='peiQianXinLiScore='+score+"&peiQianXinLiText="+content
    }else if(that.data.ansNum==11){
      var param='xiWangChanPinScore='+score+"&xiWangChanPinText="+content
    }else if(that.data.ansNum==12){
      var param='liCaiBiMianGongJuScore='+score+"&liCaiBiMianGongJuText="+content
    }
   
    that.answerQue(param)
    
    
    
    // this.setData({
    //   answer: this.data.answer
    // })
  },

  answerQue(param){
     var that=this
    wx.request({
      url:app.globalData.url+ '/do-questionnaire',
      method:'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:param,
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
          if(that.data.ansNum==that.data.ansLength){
            that.setData({
              ifShowEnd:true
            })
            wx.hideToast({
              complete: (res) => {},
            })
          }else{
            app.globalData.questionListNum=that.data.ansNum
            wx.showToast({
              title: '下一题',
              icon: 'none',
              duration: 2000,
              mask: true,
              complete: function complete(res) {
                setTimeout(function () {                          
                  wx.redirectTo({
                    url: '../assess/assess',
                  })
                }, 1000);
              }
            });
          }
        }  
      }
    })
  },
  btnSupply(e){
    var that=this
    wx.showToast({
      title: '请稍等',
      icon: 'none',
      duration:5000
    });
    wx.request({
    url:app.globalData.url+ '/done-questionnaire',
    method:'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'cookie': wx.getStorageSync('cookie')
    },
    // data:'doPaperId='+app.globalData.doPaperId+"&paperId="+app.globalData.paperId,
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

        wx.request({
          url: app.globalData.url + '/login-refresh',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'cookie': wx.getStorageSync('cookie')
          },
          method: 'post',
          success: function (res) {
            if (res.data.code == 20) {
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
            } else {
              app.globalData.userInfoDetail = res.data.data
              that.setData({
                realnameCertificationIs: res.data.data.realnameCertificationIs
              })
              wx.navigateTo({
                url: '../programme/programme',
              })
            }
          }
        })
       
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