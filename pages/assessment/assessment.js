// pages/assessment/assessment.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperQuestionId:'',
    questionList:[],
    ifShowEnd:false,
    ansname:'',
    ansNum:'',
    answer:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      ansLength:app.globalData.questionListLength
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
          paperQuestionId:app.globalData.questionList[i].paperQuestionId,
          ansname:app.globalData.questionList[i].name,
          answer:app.globalData.questionList[i].answer,
          ansNum:app.globalData.questionListNum+1,
          // ifShowEnd:false
        })
        return
      }
    }
  },
  
  changeAns(e){
    var that=this
    var id=e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    for(var i in that.data.answer){
      if(that.data.answer[i].paperQuestionAnswerId==id){
        that.data.answer[i].active='active'
      }else{
        that.data.answer[i].active=''
      }
    }
    that.setData({
      answer:that.data.answer
    })
    wx.request({
      url:app.globalData.url+ '/do-paper-question',
      method:'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:'paperQuestionId='+that.data.paperQuestionId+"&paperQuestionAnswerId="+id+'&doPaperId='+app.globalData.doPaperId,
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
          }else{
            app.globalData.questionListNum=that.data.ansNum
            wx.navigateTo({
              url: '../assessment/assessment',
            })
            // wx.showToast({
            //   title: '下一题',
            //   icon: 'none',
            //   duration: 2000,
            //   mask: true,
            //   complete: function complete(res) {
            //     setTimeout(function () {                          
            //       wx.navigateTo({
            //         url: '../assessment/assessment',
            //       })
            //     }, 1000);
            //   }
            // });
          }
        }  
      }
    })
    
    
    
    // this.setData({
    //   answer: this.data.answer
    // })
  },
  btnSupply(e){
    wx.request({
    url:app.globalData.url+ '/done-paper',
    method:'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'cookie': wx.getStorageSync('cookie')
    },
    data:'doPaperId='+app.globalData.doPaperId+"&paperId="+app.globalData.paperId,
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
        wx.navigateTo({
          url: '../programme/programme',
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