//app.js
App({
  version:'20.0722.1433',
  versionNote:'修复了一些BUG , 优化了用户体验 .',
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    const vm = this
    wx.getSystemInfo({
      success: function (res) {
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        vm.globalData.statusBarHeight = res.statusBarHeight
        vm.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      },
      failure() {
        vm.globalData.statusBarHeight = 0
        vm.globalData.titleBarHeight = 0
      }
    })
    
    wx.request({
      url: vm.globalData.url + '/config-info?name=userProtocol',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      success: function (res) {
        vm.globalData.userProtocol='https://test.inininininin.com'+res.data.data.userProtocol
      }
    })
    wx.request({
      url: vm.globalData.url + '/config-info?name=example',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      success: function (res) {
        if(res.data.data.example!=''&&res.data.data.example!=null&&res.data.data.example!=undefined){
          vm.globalData.example='https://test.inininininin.com'+res.data.data.example
        }
      }
    })
    // wx.request({
    //   url: vm.globalData.url + '/wxminapp/area.json',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     'cookie': wx.getStorageSync('cookie')
    //   },
    //   method: 'get',
    //   success: function (res) {
    //     vm.globalData.areaJson=res.data
    //   }
    // })
  },
  cover(_cover){
    var that=this
    if(_cover&&_cover.slice(0,1)!='h'){
      _cover='https://test.inininininin.com'+_cover
    }
    return _cover
  },
  globalData: {
    userInfo: null,
    userInfoDetail:[],
    statusBarHeight:'',
    titleBarHeight:'',
    domain:'https://test.inininininin.com',
    url:'https://test.inininininin.com/jfcs',
    version:'2020.0717.1718',
    areaJson:'',
    example:'',
    userProtocol:'',
    paperId:'',
    doPaperId:'',
    questionList:[{
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
    },{
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
    },{
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
    },{
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
    },{
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
    },{
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
    },{
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
    },{
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
    },{
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
    },{
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
    },{
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
    }],
    questionListNum:'0',
    questionListLength:'12',
  }
})