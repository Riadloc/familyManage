<template>
  <div class='login-field'>
    <div id="form-field">
      <ul class="tab-group">
        <li class="tab active"><a href="#signin">登录</a></li>
        <li class="tab"><a href="#signup">注册</a></li>
      </ul>
      <form id="signin" ref="signin">
        <h1>登录月球</h1>
        <el-input v-model="signin.username" name="userId" placeholder="请输入用户名">
          <label slot="prepend"><span>*</span>用户名：</label>
        </el-input>
        <el-input v-model="signin.psw" name="password" type="password" placeholder="请输入密码">
          <label slot="prepend"><span>*</span>密码：</label>
        </el-input>
        <el-button type="primary" @click="signIn" :loading="signin.loading">登录</el-button>
      </form>
      <form id="signup" style="display: none" ref="signup">
        <h1>户籍登记</h1>
        <el-input v-model="signup.username" name="userId" placeholder="请输入用户名">
          <label slot="prepend"><span>*</span>用户名：</label>
        </el-input>
        <el-input v-model="signup.nickname" name="userName" placeholder="请输入昵称">
          <label slot="prepend"><span>*</span>昵称：</label>
        </el-input>
        <el-input v-model="signup.psw" type="password" name="password" placeholder="请输入密码">
          <label slot="prepend"><span>*</span>密码：</label>
        </el-input>
        <el-input v-model="signup.repsw" type="password" placeholder="请再次输入密码">
          <label slot="prepend"><span>*</span>确认密码：</label>
        </el-input>
        <el-radio-group v-model="signup.gender" name="sex">
          <el-radio label="privacy">保密</el-radio>
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
        </el-radio-group>
        <el-input v-model="signup.phone" placeholder="请输入手机号" name="mobile">
          <label slot="prepend"><span>*</span>手机号码：</label>
        </el-input>
        <el-button type="primary" @click="signUp" :loading="signup.loading">注册</el-button>
      </form>
    </div>
</div>
</template>
<script>
import $ from 'jquery';
export default {
  name: 'login-field',
  data() {
    return {
      signin: {
        username: '',
        psw: '',
        loading: false
      },
      signup: {
        username: '',
        nickname: '',
        psw: '',
        repsw: '',
        gender: 'privacy',
        phone: '',
        loading: false
      }
    }
  },
  mounted() {
    $('.tab a').on('click', function (e) {
      e.preventDefault()
      $(this).parent().addClass('active')
      $(this).parent().siblings().removeClass('active')
      const target = $(this).attr('href')
      $('form').not(target).hide()
      $(target).fadeIn(600)
    });
  },
  methods: {
    signIn() {
      if (!this.formCheck('IN')) return false
      this.$set(this.signin, 'loading', true)
      const formdata = new FormData(this.$refs.signin)
      this.$http.post('api/user/login', formdata)
        .then((res) => {
          this.$set(this.signin, 'loading', false)
          if (parseInt(res.data.code) === 200) {
            this.$message.success('登录成功！')
            window.sessionStorage.setItem('user', res.data.user)
            this.$router.push({name: 'Management'})
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$set(this.signin, 'loading', false)
          this.$message.error('登录失败')
        })
    },
    signUp() {
      if (!this.formCheck('UP')) return false
      this.$set(this.signup, 'loading', true)
      const formdata = new FormData(this.$refs.signup)
      formdata.append('sex', this.signup.gender)
      this.$http.post('api/user/register', formdata)
        .then((res) => {
          this.$set(this.signup, 'loading', false)
          if (parseInt(res.data.code) === 200) {
            this.$message.success('注册成功！')
            window.sessionStorage.setItem('user', res.data.user)
            this.$router.push({name: 'Management'})
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((e) => {
          console.log('error!')
          this.$set(this.signup, 'loading', false)
          this.$message.error(e.data.msg)
        })
    },
    formCheck(type) {
      if (type === 'IN') {
        if (this.signin.username === '') {
          this.$message.error('请输入用户名！')
          return false
        } else if (this.signin.psw === '') {
          this.$message.error('请输入密码！')
          return false
        }
      } else if (type === 'UP') {
        if (this.signup.username === '') {
          this.$message.error('请输入用户名！')
          return false
        } else if (this.signup.psw === '' || this.signup.repsw === '') {
          this.$message.error('请输入密码！')
          return false
        } else if (this.signup.psw !== this.signup.repsw) {
          this.$message.error('两次输入密码不一致！')
          return false
        } else if (this.signup.phone === '') {
          this.$message.error('请输入手机号码！')
          return false
        }
      }
      return true
    }
  }
}
</script>
<style lang="stylus">
@import '../assets/const'

.login-field
  text-align center
  height 100%
  background-image url('../assets/asteroids.jpg')
  #form-field
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 400px
    padding 40px 60px
    box-sizing border-box
    background #fff
    border-radius 4px
    .tab-group 
      list-style:none
      padding:0
      margin:0 0 20px 0
      &:after
        content: ""
        display: table
        clear: both
      .tab>a
        display:block
        text-decoration:none
        padding:10px 0
        background:rgba($gray-light,.25)
        color:$gray-light
        font-size:16px
        float:left
        width:50%
        text-align:center
        cursor:pointer
        transition:.5s ease
        &:hover
          background:$main-dark
          color:$white
      .active>a
        background:$main
        color:$white
    #signin, #signup
      h1
        font-size 20px
        color #333
        margin 0 0 10px 0
      .el-input, .el-radio-group
        margin-bottom 15px
      .el-button
        width 100%
      .el-input-group__prepend
        padding: 0
        width: 80px
        text-align: right
        label
          span
            color #f00
</style>
