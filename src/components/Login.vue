<template>
  <div class='login-field'>
    <h1>Login</h1>
    <form>
        <input type='text' id='username' placeholder='Username'>
        <input type='password' id='password' placeholder='Password'>
    </form>
    <button class='login'>登录</button>
</div>
</template>
<script>
export default {
  name: 'login-field'
}
</script>
<style lang="stylus" scoped>
@import url(https://fonts.googleapis.com/css?family=Karla)
@import url(https://fonts.googleapis.com/css?family=Ubuntu:300)

.login-field
  padding:120px 0
  color:#888
  width:400px
  font-family:'Karla'
  margin:0 auto
  text-align:center
  form
    input
      font-family:'Ubuntu'
      font-weight:300
      border:0
      border-bottom:1px solid #ff5407
      width:100%
      height:36px
      font-size:26px
      margin-bottom 20px
      &:focus
        outline:none
        box-shadow:none
        background:#ffeae2
  button
    font-size 16px
    border:0
    background:transparent
    padding:5px
    margin-top:50px
    position:relative
    outline:0
    &.login
      background:#a0a0a0
      color:#fff
  
</style>
