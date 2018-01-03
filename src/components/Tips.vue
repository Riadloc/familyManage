<template>
  <div id="tips" v-loading="loading">
    <ul class="tips-list">
      <li v-for="(item,index) in articles" :key="index">
        <router-link :to="{ name: 'TipsDetail', params: { id: item.id }}"><h2>{{ item.title }}</h2></router-link>
      </li>
    </ul>
    <div class="page-ctrl">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="20"
        :total="totalPage*20"
        @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { GET_PAGENUM, TIPS_LIST } from '../config'
export default {
  name: 'tips',
  data() {
    return {
      totalPage: 1,
      currentPage: 1,
      articles: [],
      loading: false
    }
  },
  mounted() {
    this.getPageNum()
    this.getArticleList()
  },
  methods: {
    getPageNum() {
      this.$http.get(GET_PAGENUM)
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.totalPage = data.page
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
    },
    getArticleList() {
      this.loading = true
      this.$http.get(TIPS_LIST, { params: { pageNum: this.currentPage } })
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.articles = JSON.parse(data.articles)
          } else {
            this.$message.error(data.msg)
          }
          this.loading = false
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
          this.loading = false
        })
    },
    pageChange(page) {
      this.currentPage = page
      this.getArticleList()
    }
  }
}
</script>
<style lang="stylus">
#tips
  background #fff
  .tips-list
    min-height 80vh
    &>li
      padding 18px 24px
      a
        color #333
        text-decoration none
        &>h2
          cursor pointer
          &:hover
            color #2d8cf0
            text-decoration underline
      &:not(:last-child)
        border-bottom 1px solid rgba(178,186,194,.15)
  .page-ctrl
    text-align right
</style>
