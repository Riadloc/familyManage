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
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="category" label="分类"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="desc" label="备注"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="beforeUpdateAccount(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="removeAccount(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :visible="updateModal"
        @close="updateModal = false"
        width="500px">
        <el-form :model="accountForm" label-width="80px">
          <el-form-item label="金额">
            <el-input name="amount" placeholder="" type="number" v-model="accountForm.amount">
            </el-input>
          </el-form-item>
          <el-form-item label="修改项目">
            <el-cascader
              expand-trigger="hover"
              :options="options"
              v-model="accountForm.type">
            </el-cascader>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="accountForm.gmtCreate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="accountForm.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateAccount">提交</el-button>
            <el-button @click="updateModal = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import qs from 'qs'
import { UPDATE_ACCOUNT, ACCOUNT_TYPE, DELETE_ACCOUNT } from '../config'
export default {
  name: 'bill-list',
  data() {
    return {
      date: '',
      updateModal: false,
      options: [],
      accountForm: {
        type: []
      },
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
    this.getTypes()
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
            const totalIncome = accounts.reduce((a, b) => a + parseInt(b.income), 0)
            const totalSpend = accounts.reduce((a, b) => a + parseInt(b.spending), 0)
            this.$set(this.totalData, 'income', totalIncome)
            this.$set(this.totalData, 'spend', totalSpend)
            this.tableData = accounts.map(item => {
              const bool = parseInt(item.income) > parseInt(item.spending)
              return {
                id: item.id,
                typeId: parseInt(item.type),
                gmtCreate: item.gmtCreate,
                income: item.income,
                spending: item.spending,
                type: bool ? '收入' : '支出',
                category: item.typeName,
                toplevel: parseInt(item.topLevelId),
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
    },
    getTypes() {
      this.$http.get(ACCOUNT_TYPE)
        .then((res) => {
          const data = JSON.parse(res.data.types)
          const toltalTypes = data.types
          const types = data.topTypes
          this.options = types.map((item, index) => {
            return {
              value: item.toplevel,
              label: item.topname,
              children: toltalTypes.filter((it) => it.topName === item.topname).map(({id, typeName}) => {
                return { value: id, label: typeName }
              })
            }
          })
        })
        .catch((e) => {
          console.error(e);
        })
    },
    beforeUpdateAccount(row) {
      const {id, type, typeId, toplevel, gmtCreate, income, spending, desc, amount} = row
      this.accountForm = {
        id, type: [toplevel, typeId], gmtCreate, income, spending, description: desc, amount, moneyType: type
      }
      this.updateModal = true
    },
    updateAccount() {
      const { id, type, gmtCreate, income, spending, description, amount, moneyType } = this.accountForm
      const data = { id, type: type[1], gmtCreate, income, spending, description }
      const key = moneyType === '支出' ? 'spending' : 'income'
      data[key] = parseFloat(data[key]) + parseFloat(amount)
      const date = new Date(data.gmtCreate)
      data.gmtCreate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.$http.post(UPDATE_ACCOUNT, qs.stringify(data))
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
      this.updateModal = false
    },
    removeAccount(row, index) {
      this.$confirm('确认删除该账单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(DELETE_ACCOUNT, qs.stringify({ id: row.id }))
            .then((res) => {
              const data = res.data
              if (data.code === '200') {
                this.$message.success('删除成功！')
                this.tableData.splice(index, 1)
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch((e) => {
              console.error(e)
              this.$message.error('出错！')
            })
        }).catch(() => {
          this.$message.info('已取消')
        });
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
