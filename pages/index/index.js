// pages/projects/projects.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerList: [],
    bigIntroBoxTopBg: '',
    showThisBg: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // var that=this
    if (options.isShare && options.isShare == 1) {
      wx.navigateTo({
        url: '../programmeShare/programmeShare?id=' + options.id,
      })
      return
    }
    this.getAns()

    this.setData({
      bigIntroBoxTopBg: app.globalData.url + '/wxminapp/VIPEve.png'
    })
  },
  sendMsg(e) {
    this.setData({
      sendMsg: e.detail.value
    })
  },
  sendMsgAll(e) {
    var that = this
    if(that.data.sendMsg==''||that.data.sendMsg==null||that.data.sendMsg==undefined){
      wx.showToast({
        title: '请写下想说的话',
        icon: 'none',
        duration: 2000,
      });
    }else{
      wx.request({
        url: app.globalData.url + '/chat/send',
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'cookie': wx.getStorageSync('cookie')
        },
        data: 'content=' + that.data.sendMsg,
        success: function (res) {
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
            if( res.data.data.replyContent==null|| res.data.data.replyContent==undefined|| res.data.data.replyContent==''){
              that.setData({
                replyContent: '请转人工客服'
              })
              that.data.answerList.push({ 'answer': '请转人工客服', 'question': that.data.sendMsg })
              that.setData({
                answerList: that.data.answerList,
                sendMsg: '',
              })
            }else{
              that.setData({
                replyContent: res.data.data.replyContent
              })
              that.data.answerList.push({ 'answer': res.data.data.replyContent, 'question': that.data.sendMsg })
              that.setData({
                answerList: that.data.answerList,
                sendMsg: '',
              })
            }
            
            var query = wx.createSelectorQuery();
            //选择id
            query.select('#scrollHeight').boundingClientRect()
            query.exec(function (res) {
              //res就是 所有标签为myText的元素的信息 的数组
              //取高度
              wx.pageScrollTo({
                scrollTop: res[0].height,
                duration: 300,
              })
            })
          }
        }
      })
    }
    

  },
  reply(e) {
    var that = this
    var answer = e.currentTarget.dataset.reply
    var question = e.currentTarget.dataset.question
    that.data.answerList.push({ 'answer': answer, 'question': question })
    that.setData({
      answerList: that.data.answerList
    })

    var query = wx.createSelectorQuery();
    //选择id
    query.select('#scrollHeight').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为myText的元素的信息 的数组
      //取高度
      wx.pageScrollTo({
        scrollTop: res[0].height,
        duration: 300,
      })
    })

  },
  // 微信登录
  loginWx: function () {
    var that = this
    that.setData({
      showIs: true
    })
  },

  startPaper(paperId) {
    var that = this
    wx.request({
      url: app.globalData.url + '/start-paper',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: 'paperId=' + paperId,
      success: function (res) {
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
          app.globalData.doPaperId = res.data.data.doPaperId
          // that.doPaperId(res.data.data.doPaperId)
        }
      }
    })
  },
  doPaperId(paperId) {
    var that = this
    wx.request({
      url: app.globalData.url + '/paper-question-list',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie'),
      },
      data: 'paperId=' + paperId + "&order=asc&sort=orderNo",
      success: function (res) {
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
          // app.globalData.questionList=res.data.data.itemList
          // app.globalData.questionListNum=0
          // app.globalData.questionListLength=res.data.data.itemList.length
          that.setData({
            questionList: res.data.data.itemList
          })
          wx.setStorageSync('questionList', JSON.stringify(res.data.data.itemList))

          wx.navigateTo({
            url: '../assess/assess',
          })
        }
      }
    })
  },
  getPaper() {
    var that = this
    wx.request({
      url: app.globalData.url + '/get-paper',
      method: 'get',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      success: function (res) {
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
          app.globalData.paperId = res.data.data.paperId
          that.startPaper(res.data.data.paperId)
          that.doPaperId(res.data.data.paperId)
        }
      }
    })
  },
  onlyBg(e) {
    console.log(12312)
    var that = this
    // that.setData({
    //   showThisBg: false
    // })
    app.globalData.questionListNum = 0
    wx.showToast({
      title: '请稍等',
      icon: 'loading',
      duration: 10000,
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
        console.log(11)
        if (res.data.code == 0) {
          app.globalData.userInfoDetail = res.data.data
          if (app.globalData.userInfoDetail.realnameCertificationIs == 1) {
            if (app.globalData.userInfoDetail.beiJingZiLiaoIs == 0) {
              // clearInterval(timer);
              wx.showToast({
                title: '请稍等',
                icon: 'none',
                duration: 2000,
                mask: true,
                complete: function complete(res) {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../information/information',
                    })
                  }, 500);
                }
              });
            } else if (app.globalData.userInfoDetail.questionnaireIs == 0) {
              // clearInterval(timer);
              wx.showToast({
                title: '请稍等',
                icon: 'none',
                duration: 2000,
                mask: true,
                complete: function complete(res) {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../assess/assess',
                    })
                  }, 500);
                }
              });
            } else {
              // clearInterval(timer);
              wx.navigateTo({
                url: '../programme/programme',
              })
            }
          } else if (app.globalData.userInfoDetail.realnameCertificationIs == 0) {
            // clearInterval(timer);
            wx.showToast({
              title: '请先实名认证',
              icon: 'none',
              duration: 2000,
              mask: true,
              complete: function complete(res) {
                console.log(123123)
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../authentication/authentication',
                  })
                }, 500);
              }
            });
          }
        } else {
          console.log(22)
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })
    // app.globalData.userInfoDetail
    // var timer = setInterval(function () {
   

    // }, 500)


    // 备份留着
    // wx.showToast({
    //   title: '请稍等',
    //   icon:'loading',
    //   duration:10000
    // })
    // wx.request({
    //   url:app.globalData.url+ '/get-last-done-do-paper',
    //   method:'get',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     'cookie': wx.getStorageSync('cookie')
    //   },
    //   success:function(res){
    //     if(res.data.codeMsg){
    //       wx.showToast({
    //         title: res.data.codeMsg,
    //         icon: 'none',
    //       });
    //     }else if(res.data.code==20){
    //       wx.showToast({
    //         title: '请先登录',
    //         icon: 'none',
    //         duration: 2000,
    //         mask: true,
    //         complete: function complete(res) {
    //           setTimeout(function () {                          
    //               wx.navigateTo({
    //                 url: '../login/login',
    //               })
    //           }, 500);
    //         }
    //       });
    //     }else if(res.data.code==0){
    //       if(res.data.data.doPaperId){
    //         wx.navigateTo({
    //           url: '../programme/programme',
    //         })
    //       }else{
    //         var timer = setInterval(function () {
    //           if(that.data.realnameCertificationIs==0){
    //             clearInterval(timer);
    //             wx.showToast({
    //               title: '请先实名认证',
    //               icon: 'none',
    //               duration: 2000,
    //               mask: true,
    //               complete: function complete(res) {
    //                 setTimeout(function () {                          
    //                   wx.navigateTo({
    //                     url: '../authentication/authentication',
    //                   })
    //                 }, 500);
    //               }
    //             });
    //           }else if(that.data.realnameCertificationIs==1){
    //             clearInterval(timer);
    //             that.getPaper()

    //           }
    //         }, 500);
    //       }
    //     }  
    //   }
    // })
    // 到这都留
  },
  getAns() {
    var that = this
    wx.request({
      url: app.globalData.url + '/ke-fu-preset-question-list',
      data: 'order=asc&sort=orderNo',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      success: function (res) {
        if (res.data.code == 0) {
          for (var i in res.data.data.itemList) {
            res.data.data.itemList[i].number = (parseInt(i) + 1)
          }
          that.setData({
            question: res.data.data.itemList
          })
        } else if (res.data.code == 20) {
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000,
            mask: true,
            complete: function complete(res) {
              // setTimeout(function () {                          
              //     wx.navigateTo({
              //       url: '../login/login',
              //     })
              // }, 500);
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
    var that = this
    // if (!that.data.question) {
    //   this.getAns()
    // }
    that.setData({
      showThisBg: true,
    })
    app.globalData.questionList = [{
      "name": "您的年龄是？",
      "answer": [{
        "content": "25岁以下",
        "score": 10
      }, {
        "content": "25-35岁",
        "score": 8
      }, {
        "content": "36-45岁",
        "score": 6
      }, {
        "content": "46-60岁",
        "score": 4
      }, {
        "content": "60岁以上",
        "score": 2
      }]
    }, {
      "name": "您的就业情况是？",
      "answer": [{
        "content": "公务员或教师",
        "score": 10
      }, {
        "content": "上班族",
        "score": 8
      }, {
        "content": "自由职业者",
        "score": 6
      }, {
        "content": "自营事业",
        "score": 4
      }, {
        "content": "无业",
        "score": 2
      }]
    }, {
      "name": "您的家庭负担是？",
      "answer": [{
        "content": "未婚",
        "score": 10
      }, {
        "content": "双薪无子女",
        "score": 8
      }, {
        "content": "双薪有子女",
        "score": 6
      }, {
        "content": "单薪有子女",
        "score": 4
      }, {
        "content": "单薪养3代",
        "score": 2
      }]
    }, {
      "name": "您的置业情况是？",
      "answer": [{
        "content": "有投资房产",
        "score": 10
      }, {
        "content": "自住无房贷",
        "score": 8
      }, {
        "content": "房贷低于50%",
        "score": 6
      }, {
        "content": "房贷高于50%",
        "score": 4
      }, {
        "content": "无房",
        "score": 2
      }]
    }, {
      "name": "您的投资经验是？",
      "answer": [{
        "content": "10年以上",
        "score": 10
      }, {
        "content": "6-10年",
        "score": 8
      }, {
        "content": "2-5年",
        "score": 6
      }, {
        "content": "1年以内",
        "score": 4
      }, {
        "content": "无",
        "score": 2
      }]
    }, {
      "name": "您的投资知识是？",
      "answer": [{
        "content": "持有专业执照",
        "score": 10
      }, {
        "content": "财经院校毕业",
        "score": 8
      }, {
        "content": "自修有心得",
        "score": 6
      }, {
        "content": "懂一些",
        "score": 4
      }, {
        "content": "全无",
        "score": 2
      }]
    }, {
      "name": "您能够忍受的亏损为 %？",
      "answer": [{
        "content": "不能忍受任何亏损",
        "score": 0
      }, {
        "content": "5-10%",
        "score": 20
      }, {
        "content": "10-20%",
        "score": 30
      }, {
        "content": "20%以上",
        "score": 40
      }]
    }, {
      "name": "您理财的首要考虑因素是？",
      "answer": [{
        "content": "赚差价",
        "score": 10
      }, {
        "content": "长期获取收益",
        "score": 8
      }, {
        "content": "每年分红",
        "score": 6
      }, {
        "content": "避通货膨胀",
        "score": 4
      }, {
        "content": "保本保息",
        "score": 2
      }]
    }, {
      "name": "如果亏损，您的认赔动作是？",
      "answer": [{
        "content": "立刻止损",
        "score": 10
      }, {
        "content": "事后止损",
        "score": 8
      }, {
        "content": "部分认赔",
        "score": 6
      }, {
        "content": "持有待回升",
        "score": 4
      }, {
        "content": "继续加码",
        "score": 2
      }]
    }, {
      "name": "如果赔钱了，您的心理是？",
      "answer": [{
        "content": "学习经验",
        "score": 10
      }, {
        "content": "照常过日子",
        "score": 8
      }, {
        "content": "影响情绪小",
        "score": 6
      }, {
        "content": "影响情绪大",
        "score": 4
      }, {
        "content": "夜不能眠",
        "score": 2
      }]
    }, {
      "name": "您希望持有的理财产品最重要的特点是？",
      "answer": [{
        "content": "赚钱获利",
        "score": 10
      }, {
        "content": "收益兼成长",
        "score": 8
      }, {
        "content": "收益性",
        "score": 6
      }, {
        "content": "流动性",
        "score": 4
      }, {
        "content": "安全性",
        "score": 2
      }]
    }, {
      "name": "你理财避免的工具是？",
      "answer": [{
        "content": "无",
        "score": 10
      }, {
        "content": "期货",
        "score": 8
      }, {
        "content": "股票",
        "score": 6
      }, {
        "content": "外汇",
        "score": 4
      }, {
        "content": "不动产",
        "score": 2
      }]
    }]

    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: '../login/login',
        })

      }
    })

    // wx.request({
    //   url: app.globalData.url + '/login-refresh',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     'cookie': wx.getStorageSync('cookie')
    //   },
    //   method: 'post',
    //   success: function (res) {
    //     wx.hideToast()
    //     if (res.data.code == 0) {
    //       app.globalData.userInfoDetail = res.data.data
    //     } else {
    //       wx.navigateTo({
    //         url: '../login/login',
    //       })
    //     }
    //   }
    // })


    // wx.request({
    //   url: app.globalData.url + '/login-refresh',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     'cookie': wx.getStorageSync('cookie')
    //   },
    //   method: 'post',
    //   success: function (res) {
    //     if (res.data.code == 20) {
    //       wx.showToast({
    //         title: '请先登录',
    //         icon: 'none',
    //         duration: 2000,
    //         mask: true,
    //         complete: function complete(res) {
    //           setTimeout(function () {
    //             wx.navigateTo({
    //               url: '../login/login',
    //             })
    //           }, 500);
    //         }
    //       });
    //     } else {
    //       app.globalData.userInfoDetail = res.data.data
    //       that.setData({
    //         realnameCertificationIs: res.data.data.realnameCertificationIs
    //       })
    //     }
    //   }
    // })

  },
  lookFg(e) {
    if (app.globalData.example == '' || app.globalData.example == null || app.globalData.example == undefined) {
      wx.showToast({
        title: '当前暂无范稿',
        icon: 'none',
        duration: 2000,
      });
    } else {
      wx.previewImage({
        current: app.globalData.example, // 当前显示图片的http链接
        urls: [app.globalData.example] // 需要预览的图片http链接列表
      })
    }

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