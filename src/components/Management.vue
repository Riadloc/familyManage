<template>
  <div id="Management">
    <el-container style="height: 100%">
      <el-header>
        <div class="logo"></div>
        <ul class="user-area">
          <li class="user-messge-notify">
            <el-badge :value="200" is-dot :max="99" class="item">消息</el-badge>
            <el-dialog
              title="消息"
              :visible="messageModal"
              width="800px"
              @close="messageModal = false"
              >
            </el-dialog>
          </li>
          <li class="user-ctrl">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ user.userName }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
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
              background-color="#2D2F33"
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
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>
<script>
import { LOGIN_OUT, GET_REQUESTS } from '../config'
export default {
  name: 'management',
  data() {
    return {
      user: {},
      messageModal: false
    }
  },
  mounted() {
    this.$router.push({name: 'User'});
    this.user = JSON.parse(window.sessionStorage.getItem('user'))
    this.getMessages()
  },
  methods: {
    handleSelect(val) {
      this.$router.push({name: val});
    },
    handleCommand(command) {
      if (command === 'loginOut') {
        this.$http.get(LOGIN_OUT)
          .then((res) => {
            const data = res.data
            if (data.code === '200') {
              this.$message.success('登出成功！')
              this.$router.push({name: 'Login'})
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((e) => {
            console.error(e)
            this.$message.error('出错！')
          })
      }
    },
    getMessages() {
      this.$http.get(GET_REQUESTS)
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.$message.success('获取成功！')
            console.log(data)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
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
  .el-aside
    width 160px!important
    background-color #2D2F33
    .el-menu
      border none
</style>
