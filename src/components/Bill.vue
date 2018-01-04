<template>
  <div id="bill">
    <div class="bill-topnav">
      <el-button type="primary" size="medium" @click="dialogVisible = true">记一笔</el-button>
      <i class="el-icon-menu menu-icon" @click="updatePageVisible"></i>
    </div>
    <div class="bi-content" v-show="pageVisble">
      <div class="bill-row">
        <div class="bill-list-wrapper">
          <h2>收支表</h2>
          <ul class="bill-list">
            <li>
              <div class="item-left"><strong>今天</strong><p>{{ time.day}}</p>
              </div>
              <div class="item-right"><span>{{ list.day.income }}</span><br/><span>{{ list.day.spend }}</span>
              </div>
            </li>
            <li>
              <div class="item-left"><strong>本周</strong><p>{{ time.currWeek }}</p>
              </div>
              <div class="item-right"><span>{{ list.week.income }}</span><br/><span>{{ list.week.spend }}</span>
              </div>
            </li>
            <li>
              <div class="item-left"><strong>本月</strong><p>{{ time.currMonth }}</p>
              </div>
              <div class="item-right"><span>{{ list.month.income }}</span><br/><span>{{ list.month.spend }}</span>
              </div>
            </li>
            <li>
              <div class="item-left"><strong>今年</strong><p>{{ time.year}}</p>
              </div>
              <div class="item-right"><span>{{ list.year.income }}</span><br/><span>{{ list.year.spend }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="bill-statistic">
          <div class="bs-head">
            <label>{{ time.currMonth.slice(0,-3) | getCNTime }}收支统计图</label>
            <el-radio-group v-model="bsTab" size="small" class="bs-tab">
              <el-radio-button label="收入"></el-radio-button>
              <el-radio-button label="支出"></el-radio-button>
            </el-radio-group>
          </div>
          <chart :options="pie" ref="pie"></chart>
        </div>
      </div>
      <div class="bill-row">
        <div class="bill-comparison">
          <div class="bc-head">
            <label>{{ barYear | getCNTime }}收支月分布图</label>
            <ul class="bc-year-ctrl">
              <li @click="barYear--"><i class="el-icon-caret-left"></i></li>
              <li class="current-year">{{ barYear }}</li>
              <li @click="barYear++"><i class="el-icon-caret-right"></i></li>
            </ul>
          </div>
          <chart :options="bar" ref="bar" @click="clickBar"></chart>
        </div>
      </div>
    </div>
    <BillList v-show="!pageVisble"></BillList>
    <FundNotes :dialogVisible="dialogVisible" @update:visible="updateNotesVisible"></FundNotes>
  </div>
</template>
<script>
import moment from 'moment'
import Notes from './Notes'
import BillList from './BillList'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import { BASIC_ACCOUNT, MONTH_ACCOUNT, RANGE_ACCOUNT } from '../config'
export default {
  name: 'bill',
  components: { 'chart': ECharts, FundNotes: Notes, BillList },
  data() {
    return {
      bsTab: '收入',
      dialogVisible: false,
      pageVisble: true,
      barYear: 2018,
      list: {
        day: {income: 0, spend: 0},
        week: {income: 0, spend: 0},
        month: {income: 0, spend: 0},
        year: {income: 0, spend: 0}
      },
      pie: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['无']
        },
        series: [
          {
            name: '来源',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [0],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      bar: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
          }
        },
        legend: {
            data: ['收入', '支出']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额',
            min: 0,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '收入',
            type: 'bar',
            data: []
          },
          {
            name: '支出',
            type: 'bar',
            data: []
          }
        ]
      },
      time: {
        day: '', currWeek: '', nextWeek: '', currMonth: '', nextMonth: '', year: ''
      }
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    bsTab(newVal) {
      this.loadPie(newVal)
    },
    barYear(newVal) {
      this.loadBar(newVal)
    }
  },
  methods: {
    init() {
      this.getAllTime()
      this.loadPie('收入')
      this.loadBar(this.barYear)
      this.loadList()
    },
    loadList() {
      Promise.all([this.getAccountsByDay(), this.getAccountsByWeek(), this.getAccountsByMonth(), this.getAccountsByYear()])
        .then((res) => {
          const data = res.map(item => JSON.parse(item.data.accounts))
          const list = data.map(item => {
            if (!item.length) return { income: 0, spend: 0 }
            return {
              income: item.reduce((a, b) => a + parseInt(b.income), 0),
              spend: item.reduce((a, b) => a + parseInt(b.spending), 0)
            }
          })
          this.list = {
            day: list[0], week: list[1], month: list[2], year: list[3]
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('请检查网络')
        })
    },
    loadBar(val) {
      const bar = this.$refs.bar
      bar.showLoading({
        text: '正在加载',
        color: '#4ea397',
        maskColor: 'rgba(255, 255, 255, 0.4)'
      })
      this.$http.get(MONTH_ACCOUNT, { params: {year: val} })
        .then((res) => {
          const data = res.data;
          if (data.code === '200') {
            const accounts = JSON.parse(data.accounts)
            console.log(accounts)
            const income = accounts.map((item) => item.income)
            const spend = accounts.map((item) => item.spend)
            bar.hideLoading()
            bar.mergeOptions({
              series: [{
                data: income
              }, {
                data: spend
              }]
            })
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('请检查网络')
        })
    },
    loadPie(val) {
      const pie = this.$refs.pie
      pie.showLoading({
        text: '正在加载',
        color: '#4ea397',
        maskColor: 'rgba(255, 255, 255, 0.4)'
      })
      const key = val === '收入' ? 'income' : 'spending'
      const { currMonth, nextMonth } = this.time
      this.$http.get(BASIC_ACCOUNT, {params: {fromDate: currMonth, toDate: nextMonth}})
        .then((res) => {
          const data = res.data;
          if (data.code === '200') {
            const accounts = JSON.parse(data.accounts)
            if (accounts.length) {
              const series = accounts.filter((item) => item[key] > 0).map((item) => {
              return {
                value: item[key],
                name: item['typeName']
              }
              })
              const legend = series.map((item) => item.name)
              pie.mergeOptions({
                legend: {data: legend},
                series: {data: series}
              })
            }
            pie.hideLoading()
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('请检查网络')
        })
    },
    clickBar(params) {
      const { dataIndex: month } = params
      const currMonth = this.barYear + '-' + ('0' + (month + 1)).slice(-2) + '-01'
      const nextMonth = moment(currMonth).add(1, 'M').format('YYYY-MM') + '-01'
      this.time.currMonth = currMonth
      this.time.nextMonth = nextMonth
      this.loadPie(this.bsTab)
    },
    getAccountsByDay() {
      const { day } = this.time
      return this.getAccounts({fromDate: day, toDate: day})
    },
    getAccountsByWeek() {
      const { currWeek, nextWeek } = this.time
      return this.getAccounts({fromDate: currWeek, toDate: nextWeek})
    },
    getAccountsByMonth() {
      const { currMonth, nextMonth } = this.time
      return this.getAccounts({fromDate: currMonth, toDate: nextMonth})
    },
    getAccountsByYear() {
      const { year } = this.time
      return this.getAccounts({fromDate: year+'-01-01', toDate: (year+1)+'-01-01'})
    },
    getAccounts(date) {
      return this.$http.get(RANGE_ACCOUNT, { params: date })
    },
    getAllTime() {
      let date = moment().locale('zh-CN')
      const day = date.format('YYYY-MM-DD')
      const currWeek = date.weekday(0).format('YYYY-MM-DD')
      const nextWeek = date.weekday(6).format('YYYY-MM-DD')
      const currMonth = date.format('YYYY-MM') + '-01'
      const nextMonth = date.add(1, 'M').format('YYYY-MM') + '-01'
      date = moment().locale('zh-CN')
      const year = date.format('YYYY')
      this.time = {
        day, currWeek, nextWeek, currMonth, nextMonth, year
      }
      this.barYear = year - 0
    },
    updateNotesVisible(val) {
      this.dialogVisible = val
      this.init()
    },
    updatePageVisible() {
      this.pageVisble = !this.pageVisble
    }
  },
  filters: {
    getCNTime(val) {
      if (!val) return
      const arr = String(val).split('-')
      switch (arr.length) {
        case 1: return arr[0] + '年';
        case 2: return arr[0] + '年' + arr[1] + '月';
        case 3: return arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
      }
    }
  }
}
</script>
<style lang="stylus">
#bill
  background inherit!important
  .bill-topnav
    margin 0 0 10px 0
    text-align right
    .menu-icon
      font-size: 20px
      color #424242
      cursor pointer
  .bi-content
    .bill-row:nth-child(1)
      display flex
      margin 0 0 20px 0
    .bill-list-wrapper
      display inline-block
      border 1px solid #ededed
      padding 0 4px
      background-color #fff
      vertical-align top
      box-shadow 0 0 8px 2px #999
      h2
        height 40px
        line-height 40px
        font-size 15px
        padding 0 5px
        color #FF5C0C
      .bill-list
        li
          width 250px
          display flex
          height: 50px;
          border-top: 1px dashed #E3E3E3;
          padding: 8px 5px 0 5px;
          line-height 20px
          .item-left
            flex 1
          .item-right
            span
              &:nth-of-type(1)
                color #cb3535
              &:nth-of-type(2)
                color #819539
    .bill-statistic
      display inline-block
      background-color #fff
      box-shadow 0 0 8px 2px #999
      flex 1
      padding 0 4px
      margin 0 0 0 20px
      .bs-head
        height 40px
        line-height 40px
        color #FF5C0C
        font-size 15px
        border-bottom 1px dashed #E3E3E3
        padding: 0 5px
        label
          font-weight bold
        .bs-tab
          float right
          margin 4px 0 0 0
      .echarts
        width 100%
        height 240px
    .bill-comparison
      background-color #fff
      box-shadow 0 0 8px 2px #999
      padding 0 4px
      .bc-head
        height 40px
        line-height 40px
        color #FF5C0C
        font-size 15px
        border-bottom 1px dashed #E3E3E3
        padding: 0 5px
        label
          font-weight bold
        .bc-year-ctrl
          display inline-flex
          width 100px
          color #888
          &>li
            flex 1 0
            text-align center
            vertical-align middle
            cursor pointer
            &>i
              font-size 18px
          .current-year
            color #555
            cursor text
      .echarts
        width 100%
        height 400px

</style>
