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
              <el-dropdown @command="handleCommand">
                <el-button icon="el-icon-edit"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add" style="color: #409EFF">增加</el-dropdown-item>
                  <el-dropdown-item command="update" style="color: #E6A23C">修改</el-dropdown-item>
                  <el-dropdown-item command="drop" style="color: #F56C6C">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
              <el-button icon="el-icon-edit" @click="typeModal = true"></el-button>
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
      <el-dialog
        title="新增类型"
        :visible.sync="typeModal"
        @close="typeModal = false"
        width="400px"
        append-to-body>
        <el-form :model="typeForm" label-width="80px">
          <el-form-item label="收入项目">
            <el-select v-model="typeForm.toplevel" placeholder="请选择">
              <el-option
                v-for="item in topOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型名称">
            <el-input v-model="typeForm.typeName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addType">提交</el-button>
            <el-button @click="typeModal = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addAccount">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs'
import { DELETE_TYPE } from '../config'
export default {
  name: 'fund-notes',
  props: ['dialogVisible'],
  data() {
    return {
      options: [],
      topOptions: [],
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
      typeModal: false,
      activeTab: 'expense',
      typeForm: {}
    }
  },
  mounted() {
    this.getIncomeType();
  },
  methods: {
    getIncomeType() {
      this.$http.get('/api/accountType/getAccountType')
        .then((res) => {
          const data = JSON.parse(res.data.types)
          const toltalTypes = data.types
          const topTypes = data.topTypes
          this.options = topTypes.map((item, index) => {
            return {
              value: item.toplevel,
              label: item.topname,
              children: toltalTypes.filter((it) => it.topName === item.topname).map(({id, typeName}) => {
                return { value: id, label: typeName }
              })
            }
          })
          this.topOptions = topTypes.map((item, index) => {
            return {
              value: item.toplevel,
              label: item.topname
            }
          })
        })
        .catch((e) => {
          console.error(e);
        })
    },
    handleCommand(command) {
      if (command === 'add') {
        this.typeModal = true
      } else if (command === 'update') {
        const type = this.activeTab === 'expense' ? this.expenseForm.type : this.incomeForm.type        
        if (type.length) {
          const item = this.options.find(item => item.value === type[0])
          this.typeForm = {
            toplevel: type[0],
            typeName: item.children.find(item => item.value === type[1]).label
          }
          this.typeModal = true
        } else {
          this.$message.error('请先选择修改分类')
        }
      } else {
        this.$confirm('确认删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(DELETE_TYPE, qs.stringify({ id: row.id }))
            .then((res) => {
              const data = res.data
              if (data.code === '200') {
                this.$message.success('删除成功！')
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
    },
    addType() {
    },
    addAccount() {
      let formdata = this.activeTab === 'expense' ? this.expenseForm : this.incomeForm
      const date = new Date(formdata.gmtCreate);
      const gmtCreate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
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
          this.$message.error('新增账单出错！')
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
  .el-cascader
    input
      width 280px
</style>
