<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="stylus">
#app
  font-size 12px
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  width 100vw
  height 100vh
  background-image url("./assets/design-tools.jpg")
  overflow hidden
.clearfix:after
  content: ""
  display: table
  clear: both
</style>
