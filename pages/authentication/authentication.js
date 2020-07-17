// pages/authentication/authentication.js
import { multiArray, objectMultiArray } from '../../pickerLinkage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendCode: true,
    sendtext: '获取验证码',
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
    sex:'',
    age:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    this.setData({
      sex:e.detail.value,
      items
    })
  },
  // yzCode(e) {
  //   if (e.detail.value != '' && e.detail.value.length >= 4) {
  //     this.setData({
  //       sendCode: false
  //     })
  //   } else {
  //     this.setData({
  //       sendCode: true
  //     })
  //   }
  // },
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
    this.setData({ "multiIndex[0]": e.detail.value[0], "multiIndex[1]": e.detail.value[1] })
  },
  bindMultiPickerColumnChange: function (e) {
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
    }
  },
  nameSure(e){
    this.setData({
      name:e.detail.value
    })
  },
  ageSure(e){
    this.setData({
      age:e.detail.value
    })
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