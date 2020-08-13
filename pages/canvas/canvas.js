// pages/canvas/canvas.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList: [],
    close: 'none',
    imglist: [],
    canvasShow: false,
    hidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showToast({
      title: '请稍等',
      icon: 'none',
      duration: 10000
    })
    that.setData({
      backgroundUrl: app.globalData.url + '/wxminapp/blackbg.png',
    })
    wx.request({
      url: app.globalData.url + '/get-user-questionnaire-result',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // 'cookie': wx.getStorageSync('cookie')
      },
      data: 'userId=' + app.globalData.userInfoDetail.userId,
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
          } else if (40 <= res.data.data.score1 && res.data.data.score1 < 60) {
            res.data.data.resultName = '中等风险承受能力'
          } else if (60 <= res.data.data.score1 && res.data.data.score1 <= 79) {
            res.data.data.resultName = '中高风险承受能力'
          } else {
            res.data.data.resultName = '高风险承受能力'
          }
          debugger
          if (res.data.data.score2 < 40) {
            res.data.data.resultName1 = '保守型'
          } else if (40 <= res.data.data.score2 && res.data.data.score2 < 60) {
            res.data.data.resultName1 = '稳健型'
          } else if (60 <= res.data.data.score2 && res.data.data.score2 <= 79) {
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
          res.data.data.doPaperId = res.data.data.questionnaireTime.split('-')[0] + res.data.data.questionnaireTime.split('-')[1] + res.data.data.questionnaireTime.split('-')[2].split(' ')[0] + res.data.data.questionnaireTime.split('-')[2].split(' ')[1].split(':')[0] + res.data.data.questionnaireTime.split('-')[2].split(' ')[1].split(':')[1] + res.data.data.questionnaireTime.split('-')[2].split(' ')[1].split(':')[2].split('.')[0]
          res.data.data.questionnaireTime = res.data.data.questionnaireTime.split(' ')[0]
          // if(res.data.data.sex==1){
          //   res.data.data.sex='男'
          // }else{
          //   res.data.data.sex='女'
          // }
          res.data.data.sex = res.data.data.sex == 1 ? '男' : '女'
          that.data.picList.push(res.data.data.resultPic1)
          that.data.picList.push(res.data.data.resultPic2)
          that.data.picList.push(res.data.data.resultPic3)

          that.setData({
            doPaperId: res.data.data.doPaperId,
            // doPaperId:res.data.data.doPaperId.substring(0,15),
            paperDetail: res.data.data,
            // questionList:res.data.data.questionList,
          })
          that.sys();
          // var imglist = []
          // imglist.push(app.globalData.url+'/wxminapp/blackbg.png')
          that.setData({
            tcode: app.globalData.url + '/wxminapp/blackbg.png',
            // imglist: imglist,
          })

          var param = encodeURIComponent('pages/programmeShare/programmeShare?id=' + app.globalData.userInfoDetail.userId)
          wx.getImageInfo({
            src: app.globalData.url + '/wxminqrcode?path=' + param + '&width=200',
            method: 'get',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success: function (res) {
              var imglist = []
              console.log(res.path)
              imglist.push(res.path)
              that.setData({
                tcode: app.globalData.url + '/wxminapp/blackbg.png',
                imglist: imglist,
              })
              that.lookCode()
            },
            fail(res) {
              console.log(res)
            }
          })

          // console.log(that.data.paperDetail)
        }
      }
    })

  },
  shareIs: function () {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 705,
      height: 639,
      fileType: 'jpg',
      quality: 1,
      backgroundColor: '#fff',
      destWidth: 705,
      destHeight: 639,
      canvasId: 'canvas',
      success: function (res) {
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 保存到相册
   */
  saveIs: function () {
    console.log(123123123)
    var that = this
    console.log(that.data.urls)
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log(12)
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res)
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问

            },
            fail(res) {
              console.log(res)
              console.log(res)
              wx.showModal({
                content: '检测到您没打开下载图片功能权限，是否去设置打开？',
                confirmText: "确认",
                cancelText: "取消",
                success: function (res) {
                  console.log(res);
                  //点击“确认”时打开设置页面
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => { }
                    })
                  } else {
                    console.log('用户点击取消')
                  }
                }
              });
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.urls,
            success(res) {
              console.log(res)
              wx.showToast({
                title: '图片已保存相册',
                icon: 'none',
                duration: 2000,
                mask: true,
                complete: function complete(res) {
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 0,
                    })
                  }, 1000);
                }
              });
            },
            error: function (res) {
              console.log(res)
            },
            fail(res) {

            }
          })
        }
      }
    })

  },
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, lineHeight, lineMax) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += lineHeight; //lineHeight为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 50;
      }
      if (i == str.length - 2) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  dealWords: function (options) {
    options.ctx.setFontSize(options.fontSize); //设置字体大小
    var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth); //实际总共能分多少行
    var count = allRow >= options.maxLine ? options.maxLine : allRow; //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数

    var endPos = 0; //当前字符串的截断点
    for (var j = 0; j < count; j++) {
      var nowStr = options.word.slice(endPos); //当前剩余的字符串
      var rowWid = 0; //每一行当前宽度    
      if (options.ctx.measureText(nowStr).width > options.maxWidth) { //如果当前的字符串宽度大于最大宽度，然后开始截取
        for (var m = 0; m < nowStr.length; m++) {
          rowWid += options.ctx.measureText(nowStr[m]).width; //当前字符串总宽度
          if (rowWid > options.maxWidth) {
            if (j === options.maxLine - 1) { //如果是最后一行
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * options.lineHeight); //(j+1)*18这是每一行的高度        
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 18);
            }
            endPos += m; //下次截断点
            break;
          }
        }
      } else { //如果当前的字符串宽度小于最大宽度就直接输出
        options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 18);
      }
    }
  },


  // canvas绘图部分
  sys: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight,
          windowTop: (res.windowHeight - res.windowWidth) / 2
        })
      },
    })
  },
  getImageInfo() {
    var that = this
    wx.getImageInfo({
      src: this.data.avatorShare,
      complete: (res) => {
        console.log(res)
        var windowW = that.data.windowW;
        var nbei = res.width / windowW
        var avatorShareHeight = parseInt(res.height / nbei)
        that.setData({
          avatorShareHeight: avatorShareHeight,
          avatorShareWidth: windowW
        })
        console.log(that.data.avatorShareHeight)
      }
    })
  },
  canvasdraw: function (canvas) {
    var that = this;

    // console.log(that.data.testImg)
    that.setData({
      canvasShow: true
    })
    console.log(1212)
    wx.downloadFile({
      url: that.data.tcode,//注意公众平台是否配置相应的域名
      success: function (res) {
        console.log(res.tempFilePath)
        that.setData({
          avatorShare: res.tempFilePath
        })
        var leftW = (that.data.windowW - 140)
        var windowW = that.data.windowW;
        var windowH = that.data.windowH;
        console.log(windowW, windowH)
        // that.getImageInfo()
        wx.getImageInfo({
          src: that.data.avatorShare,
          complete: (res) => {
            console.log(res)
            var windowW = that.data.windowW;
            var nbei = res.height / 176
            var avatorShareHeight = parseInt(windowW / nbei)

            that.setData({
              avatorShareHeight: res.height,
              avatorShareWidth: res.width
            })
            console.log(that.data.avatorShareHeight)
            console.log(windowW, that.data.avatorShareHeight)
            canvas.drawImage('../icon/fang.png', 0, 0, windowW, windowW);
            canvas.drawImage(that.data.avatorShare, 0, 0, that.data.avatorShareWidth, that.data.avatorShareHeight, 0, 0, windowW, 200);

            canvas.font = "20px Georgia";
            canvas.fillStyle = '#fff';
            canvas.width = windowW - 100
            canvas.fillText(app.globalData.userInfoDetail.realname, 27, 27, 200)
            canvas.font = "15px Georgia";
            canvas.fillText(app.globalData.userInfoDetail.age, 27, 51, 200)
            canvas.fillText(app.globalData.userInfoDetail.sex == 1 ? '男' : '女', 72, 51, 200)
            canvas.fillText(that.data.paperDetail.resultName1 + "-" + that.data.paperDetail.resultName, 115, 51, 200)
            canvas.font = "12px Georgia";
            canvas.fillText(that.data.doPaperId, 40, 111, 200)
            canvas.fillText(that.data.paperDetail.questionnaireTime, 185, 111, 200)
            canvas.fillText('报告版本', 55, 135, 200)
            canvas.fillText('报告时间', 195, 135, 200)
            // canvas.fillStyle='#F5F5F5';
            canvas.fillStyle = '#fff';
            canvas.fillRect(0, 154, windowW, windowW - 154);
            canvas.fillStyle = '#333333';
            canvas.font = "16px Georgia";
            canvas.fillText('背景资料', 34, 190, 200)
            canvas.fillStyle = '#333333';
            canvas.font = "12px Georgia";
            canvas.fillText('可规划资产：' + that.data.paperDetail.keGuiHuaZiChan, 24, 220, 200)
            canvas.fillText('财富规划目标：' + that.data.paperDetail.caiFuGuiHuaMuBiao, 24, 240, 200)
            canvas.fillText('财富规划年限：' + that.data.paperDetail.caiFuGuiHuaNianXian, 24, 260, 200)
            canvas.fillText('家庭收支状况：' + that.data.paperDetail.jiaTingShouZhiZhuangKuang, 24, 280, 200)
            canvas.drawImage(that.data.imglist[0], leftW, 190, 120, 120);
            canvas.draw(true, setTimeout(function () {

              that.saveCanvas()

              // setTimeout(function(){

              // },200)
            }, 100));

          }
        })



      }
    })

    console.log(that.data.avatorShare, that.data.imglist[0])



    // canvas.draw();
  },
  saveCanvas: function () {

    var that = this;

    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    console.log(windowW, windowH);
    that.setData({
      canvasShow: true
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowW,
      destWidth: windowW,
      destHeight: windowW,
      canvasId: 'canvas',
      success: function (res) {
        wx.hideToast({})
        console.log(res.tempFilePath)
        that.setData({
          // canvasShow:false
        })
        that.setData({
          urls: res.tempFilePath
        })
      },
      error: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  lookCode: function () {
    var that = this;
    var canvas = wx.createCanvasContext('canvas');
    that.canvasdraw(canvas);
    // that.setData({
    //   canvasShow:true
    // })
  },
  // lookCodeShow(){
  //   var that=this
  //   console.log(that.data.urls)
  //   wx.previewImage({
  //     urls: [that.data.urls],
  //   })
  //   // that.saveCanvas()
  // },
  closeCanvas: function () {
    var that = this;
    that.setData({
      canvasShow: false
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