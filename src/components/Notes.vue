<template>
  <div id="fund-notes">
    <el-dialog
      :visible="dialogVisible"
      @close="closeDialog"
      width="500px">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="支出" name="expense">
          <el-form :model="expenseForm" label-width="80px">
            <el-form-item label="金额">
              <el-input name="amount" placeholder="" type="number" v-model="expenseForm.spending">
              </el-input>
            </el-form-item>
            <el-form-item label="支出项目">
              <el-cascader
                expand-trigger="hover"
                :options="options"
                v-model="expenseForm.type">
              </el-cascader>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-model="expenseForm.gmtCreate"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="expenseForm.description"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="收入" name="income">
          <el-form :model="incomeForm" label-width="80px">
            <el-form-item label="金额">
              <el-input name="amount" placeholder="" type="number" v-model="incomeForm.income">
              </el-input>
            </el-form-item>
            <el-form-item label="收入项目">
              <el-cascader
                expand-trigger="hover"
                :options="options"
                v-model="incomeForm.type">
              </el-cascader>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-model="incomeForm.gmtCreate"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="incomeForm.description"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addAccount">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  name: 'fund-notes',
  props: ['dialogVisible'],
  data() {
    return {
      options: [],
      incomeForm: {
        income: null,
        type: [],
        gmtCreate: '',
        description: ''
      },
      expenseForm: {
        spending: null,
        type: [],
        gmtCreate: '',
        description: ''
      },
      activeTab: 'expense'
    }
  },
  mounted() {
    this.getIncomeType();
  },
  methods: {
    getIncomeType() {
      this.$http.get('/api/accountType/getAccountType')
        .then((res) => {
          const toltalTypes = JSON.parse(res.data.types)
          const types = Array.from(new Set(toltalTypes.map((item) => item.topName)))
          this.options = types.map((type, index) => {
            return {
              value: `top_${index}`,
              label: type,
              children: toltalTypes.filter((it) => it.topName === type).map(({id, typeName}) => {
                return { value: id, label: typeName }
              })
            }
          })
        })
        .catch((e) => {
          console.error(e);
        })
    },
    addAccount() {
      let formdata = this.activeTab === 'expense' ? this.expenseForm : this.incomeForm
      const date = new Date(formdata.gmtCreate);
      const gmtCreate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      formdata = Object.assign({}, formdata, {type: formdata.type.slice(-1)[0], gmtCreate})
      console.log(formdata)
      this.$http.post('/api/account/addAccount', qs.stringify(formdata))
        .then((res) => {
          const data = res.data;
          this.closeDialog()
          if (data.code === '200') {
            console.log(data.msg)
            this.$message.success('新增账单成功！')
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('新增账单鼠标！')
        })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="stylus">
#fund-notes
  input
    width 340px
</style>
