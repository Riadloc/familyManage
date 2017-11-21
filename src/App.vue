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
  background: #84fab0
  background-image: -webkit-linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)
</style>
