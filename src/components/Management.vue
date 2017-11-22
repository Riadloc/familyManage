<template>
  <div id="Management">
    <el-container style="height: 100%">
      <el-header>
        <div class="logo"></div>
      </el-header>
        <el-container>
          <el-aside>
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              @select="handleSelect"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-menu-item index="1">
                <i class="el-icon-menu"></i>
                <span slot="title">个人信息</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-goods"></i>
                <span slot="title">账单模块</span>
              </el-menu-item>
              <el-menu-item index="3">
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
  data() {
    return {
      user: {
        id: '10081',
        username: 'Champion',
        nickname: '邓江胡习',
        gender: '男',
        phone: '13700000000'
      }
    }
  },
  methods: {
    handleSelect(index) {
      console.log('ddd')
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
  .el-main
    background #eee
    padding 40px 300px
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
