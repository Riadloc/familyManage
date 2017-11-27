<template>
  <div id="Management">
    <el-container style="height: 100%">
      <el-header>
        <div class="logo"></div>
        <ul class="user-area">
          <li class="user-messge-notify">
            <el-badge :value="200" is-dot :max="99" class="item">消息</el-badge>
          </li>
          <li class="user-ctrl">
            <el-dropdown>
              <span class="el-dropdown-link">
                孙悟空<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </el-header>
        <el-container>
          <el-aside>
            <el-menu
              default-active="User"
              class="el-menu-vertical-demo"
              @select="handleSelect"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-menu-item index="User">
                <i class="el-icon-menu"></i>
                <span slot="title">个人信息</span>
              </el-menu-item>
              <el-menu-item index="Bill">
                <i class="el-icon-goods"></i>
                <span slot="title">账单模块</span>
              </el-menu-item>
              <el-menu-item index="Family">
                <i class="el-icon-setting"></i>
                <span slot="title">家庭模块</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
            <!-- <div class="divider"></div> -->
            <!-- <div class="bill-info">
              <h2>总资产</h2>
              <ul class="bi-list clearfix">
                <li>
                  <strong>10,000</strong>
                  <span>总资产</span>
                </li>
              </ul>
            </div> -->
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'management',
  mounted() {
    this.$router.push({name: 'User'});
  },
  methods: {
    handleSelect(val) {
      this.$router.push({name: val});
    }
  }
}
</script>
<style lang="stylus">
#Management
  height 100%
  .el-header
    background #262626
    line-height 60px
    border-bottom 1px solid #353535 
    .logo
      width 200px
      height 60%
      margin-top 10px
      display inline-block
      background-image url('/static/logo.png')
      background-size cover
    .user-area
      float right
      li
        display inline-block
        line-height 1
        margin-right 10px
        font-size 14px
        color #5a5e66
  .el-main
    background #eee
    padding 40px
    .bill-info
      .bi-list
        line-height 2
        li
          float left
          padding: 0 20px
          text-align center
          &:nth-child(1)
            border-left 0
          border-left 1px solid #999
          strong
            display block
            font-size 24px
          span
            display block
            font-size 14px
  .el-aside
    width 160px!important
    background-color rgb(84, 92, 100)
</style>
