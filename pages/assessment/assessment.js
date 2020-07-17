// pages/assessment/assessment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer:[{detail:'无固定职业',active:'active',id:1},{detail:'自由职业者',active:'',id:2},{detail:'离退休人员',active:'',id:3},{detail:'一般企业员工',active:'',id:4},{detail:'党政机关/事业单位员工',active:'',id:5}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeAns(e){
    var id=e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    for(var i in this.data.answer){
      if(this.data.answer[i].id==id){
        this.data.answer[i].active='active'
      }else{
        this.data.answer[i].active=''
      }
    }
    this.setData({
      answer: this.data.answer
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