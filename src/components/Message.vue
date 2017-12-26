<template>
  <div id="notify-message">
    <el-dialog
      title="所有申请消息"
      :visible="dialogVisible"
      @close="closeDialog"
      width="500px">
      <el-table
        :data="tableData"
        style="width: 100%"
        border>
        <el-table-column
          prop="userId"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <template v-if="!scope.row.msg">
              <el-button type="primary" size="mini" @click="handleApply(scope, '1')">同意</el-button>
              <el-button type="danger" size="mini" @click="handleApply(scope, '2')">拒绝</el-button>
            </template>
            <template v-else>
              <span>{{ scope.row.msg }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs';
import { GET_REQUESTS, HANDLE_REQUESTS } from '../config'
export default {
  props: ['dialogVisible'],
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal && !this.tableData.length) this.getMessages()
    }
  },
  methods: {
    handleApply(scope, type) {
      const { $index, row } = scope
      console.log(type)
      this.$http.post(HANDLE_REQUESTS, qs.stringify({ id: row.id, decide: type }))
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            const msg = type === '1' ? '已同意' : '已拒绝'
            this.$set(this.tableData[$index], 'msg', msg)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
    },
    getMessages() {
      this.$http.get(GET_REQUESTS)
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            const groupRequests = JSON.parse(data.groupRequests)
            this.tableData = groupRequests
            this.$message.success('获取成功！')
            console.log(data)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="stylus">
</style>
