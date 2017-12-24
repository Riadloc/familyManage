<template>
  <div id="bill-list">
    <div class="bl-datectrl">
      <el-date-picker
        v-model="date"
        type="month"
        placeholder="选择月">
      </el-date-picker>
    </div>
    <div class="bl-content">
      <div class="blc-total">
        <div class="month">{{ totalData.month }}</div>
        <div class="amount">
          <span class="amount_income">收入：{{totalData.income}}</span>
          <span class="amount_spend">支出：{{totalData.spend}}</span>
        </div>
      </div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="category"
          label="分类">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="备注">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'bill-list',
  data() {
    return {
      date: '',
      tableData: [],
      totalData: {
        month: '',
        income: '',
        spend: ''
      }
    }
  },
  watch: {
    date(newVal) {
      this.getAccounts()
    }
  },
  mounted() {
    this.date = new Date()
    this.getAccounts()
  },
  methods: {
    getAccounts() {
      const date = moment(this.date)
      this.$set(this.totalData, 'month', date.format('MM月'))
      const currMonth = date.format('YYYY-MM') + '-01'
      const nextMonth = date.add(1, 'M').format('YYYY-MM') + '-01'
      this.$http.get('/api/account/getByConditions', {params: {fromDate: currMonth, toDate: nextMonth}})
        .then((res) => {
          const data = res.data;
          if (data.code === '200') {
            const accounts = JSON.parse(data.accounts)
            // console.log(data)
            const totalIncome = accounts.reduce((a, b) => a + parseInt(b.income), 0)
            const totalSpend = accounts.reduce((a, b) => a + parseInt(b.spending), 0)
            this.$set(this.totalData, 'income', totalIncome)
            this.$set(this.totalData, 'spend', totalSpend)
            this.tableData = accounts.map(item => {
              const bool = parseInt(item.income) > parseInt(item.spending)
              return {
                type: bool ? '收入' : '支出',
                category: item.typeName,
                amount: bool ? item.income : item.spending,
                desc: item.description
              }
            })
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('请检查网络')
        })
    }
  }
}
</script>
<style lang="stylus">
#bill-list
  background #fff
  padding 10px
  .bl-datectrl
    height: 44px
    background-color: #F8F8F8
    border-bottom: 1px solid #DADADA
    padding: 8px 15px
  .bl-content
    .blc-total
      padding: 20px 15px 12px 15px
      height: 40px
      .month
        display inline-block
        font-size 40px
        height 46px
        color #156EC2
        padding 0 18px
        border-right: 1px solid #EDEDED;
      .amount
        vertical-align bottom
        padding 10px 18px
        display inline-flex
        justify-content space-between
        height 30px
        flex-direction column
        .amount_income
          color #819539
        .amount_spend
          color #cb3535
</style>
