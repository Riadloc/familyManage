<template>
  <div id="config">
    <el-button icon="el-icon-plus" type="text" @click="addConfig">新增配置</el-button>
    <el-table
      :data="configTable"
      border>
      <el-table-column prop="moneyType" label="类型"></el-table-column>
      <el-table-column prop="typeName" label="类别"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editConfig(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="removeConfig(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增配置"
      :visible.sync="configModal"
      @close="configModal = false"
      width="500px">
      <el-form :model="configForm" label-width="80px" ref="configForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="configForm.name"></el-input>
        </el-form-item>
        <el-form-item label="属于分类" prop="type">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="configForm.type">
          </el-cascader>
        </el-form-item>
        <el-form-item label="时间类型" prop="configName">
          <el-select v-model="configForm.timeType" placeholder="请选择">
            <el-option
              v-for="item in timeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="isSpending">
          <el-radio-group v-model="configForm.isSpending">
            <el-radio label="0">收入</el-radio>
            <el-radio label="1">支出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input type="number" v-model="configForm.money"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="configForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateConfig">提交</el-button>
          <el-button @click="configModal = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs'
import { ACCOUNT_TYPE, GET_CONFIG, CREATE_CONFIG, UPDATE_CONFIG, DELETE_CONFIG } from '../config'
export default {
  name: 'config_page',
  data() {
    return {
      configModal: false,
      configTable: [],
      editStatus: false,
      options: [],
      allNodeOptions: [],
      configForm: {},
      timeTypeList: [
        { value: 1, label: '每天' },
        { value: 2, label: '工作日' },
        { value: 3, label: '周末' },
        { value: 4, label: '每周' },
        { value: 5, label: '每月' }
      ]
    }
  },
  mounted() {
    this.getAllConfigs()
    this.getAllOptions()
  },
  methods: {
    addConfig() {
      this.configForm = {}
      this.configModal = true
    },
    editConfig(row) {
      const { id, name, type, time: timeType, money, isSpending, description } = row
      const newType = [this.allNodeOptions.find(item => item.id === type).topLeve-0, type-0]
      this.configForm = { id, name, type: newType, timeType: timeType-0, money, isSpending: Number(isSpending)+'', description }
      console.log(this.configForm)
      this.editStatus = true
      this.configModal = true
    },
    getAllOptions() {
      this.$http.get(ACCOUNT_TYPE)
        .then((res) => {
          const data = JSON.parse(res.data.types)
          const toltalTypes = data.types
          const types = data.topTypes
          this.allNodeOptions = toltalTypes
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
    getAllConfigs() {
      this.$http.get(GET_CONFIG)
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            const config = JSON.parse(data.config)
            this.configTable = config.map(item => {
              const moneyType = item.isSpending ? '支出' : '收入'
              return Object.assign(item, { moneyType })
            })
            console.log(this.configTable)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
    },
    updateConfig() {
      if (this.editStatus) {
        let { type } = this.configForm
        type = type[1]
        const data = Object.assign({}, this.configForm, { type })
        this.$http.post(UPDATE_CONFIG, qs.stringify(data))
          .then((res) => {
            const data = res.data
            if (data.code === '200') {
              this.$message.success('修改成功!')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((e) => {
            console.error(e)
            this.$message.error('出错！')
          })
      } else {
        let { type } = this.configForm
        type = type[1]
        const data = Object.assign({}, this.configForm, { type })
        this.$http.post(CREATE_CONFIG, qs.stringify(data))
          .then((res) => {
            const data = res.data
            if (data.code === '200') {
              this.$message.success('新增成功!')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((e) => {
            console.error(e)
            this.$message.error('出错！')
          })
      }
      this.configModal = false
    },
    removeConfig(scope) {
      const { row, $index } = scope
      this.$http.post(DELETE_CONFIG, qs.stringify({ id: row.id }))
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.configTable.splice($index, 1)
            this.$message.success('删除成功!')
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
#config
  background #fff
  input
    width 370px
</style>
