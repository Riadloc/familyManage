<template>
  <div id="tips-detail">
    <div class="title">
      <h1>{{ article.title }}</h1>
    </div>
    <div class="content" v-html="article.content"></div>
  </div>
</template>
<script>
import { ARTICLE_DETAIL } from '../config'
export default {
  data() {
    return {
      article: {}
    }
  },
  mounted() {
    const { id } = this.$route.params
    this.getArticleDetail(id)
  },
  methods: {
    getArticleDetail(id) {
      this.$http.get(ARTICLE_DETAIL, { params: { id } })
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.article = JSON.parse(data.article)
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
#tips-detail
  background #fff
  padding 30px
  .content
    line-height 1.5
    font-size 18px
</style>
