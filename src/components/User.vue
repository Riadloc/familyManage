<template>
  <div id="user-wrapper">
    <div class="user-info">
      <div class="ui-avatar">
        <img :src="user.photo" />
      </div>
      <div class="ui-text">
        <div class="ui-text-head clearfix">
          <h2 class="ui-text-nickname">{{ user.userName }}</h2>
          <el-button  class="ui-text-edit" type="info" plain>
            <a>编辑个人资料</a>
          </el-button>
        </div>
        <ul class="ui-text-content">
          <li><label>ID：</label>{{ user.userId }}</li>
          <li><label>账号：</label></li>
          <li><label>性别：</label>{{ user.sex }}</li>
          <li><label>手机：</label>{{ user.mobile }}</li>
        </ul>
      </div>
    </div>
    <div class="divider"></div>
    <div class="bill-info clearfix">
      <div style="float: left">
        <h2>总收益</h2>
        <ul class="bi-list clearfix">
          <li>
            <strong>{{ user.allIncome }}</strong>
            <span>总支出</span>
          </li>
          <li>
            <strong>{{ user.allSpending }}</strong>
            <span>总收入</span>
          </li>
        </ul>
      </div>
      <div style="float: left">
        <h2>总资产</h2>
        <ul class="bi-list clearfix">
          <li>
            <strong>{{ user.balance }}</strong>
            <span>总资产</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'user',
  data() {
    return {
      user: {
        userId: '',
        userName: '',
        sex: '',
        mobile: ''
      }
    }
  },
  mounted() {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    if (!user) this.$router.push('/')
    this.user = user
  }
}
</script>
<style lang="stylus">
#user-wrapper
  background-color #F8F8F8
  padding 20px 10px
  box-shadow 0 0 8px 2px #999
  .divider
    margin 20px 0
    &:after
      content: ''
      display block
      border-bottom 1px solid #d5d5d5
  .user-info
    display flex
    .ui-avatar
      vertical-align top
      flex 0 0 188px
      margin-right 20px
      border 4px solid #d5d5d5
      img
        width 188px
        height 188px
        border-radius 4px
        vertical-align top
    .ui-text
      line-height 2
      flex 1
      padding  0 20px
      .ui-text-head
        border-bottom 1px solid #ddd
        margin-bottom 10px
        .ui-text-nickname
          float left
          font-size 22px
        .ui-text-edit
          float right
      .ui-text-content
        font-size 16px
        li>label
          display inline-block
          width 60px
          text-align right
</style>
