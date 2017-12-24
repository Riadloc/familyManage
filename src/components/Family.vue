<template>
  <div id="family">
    <div class="family-shortinfo">
      <div class="fs-head">
        <div class="fs-ctrl-btns">
          <el-button type="primary" @click="createFa">创建家庭</el-button>
          <el-button type="primary" @click="joinFa">加入家庭</el-button>
          <el-button type="primary" @click="quitFa">退出家庭</el-button>
        </div>
      </div>
      <div class="fs-content">
        <template v-if="family.userInfoForms.length">
          <label>
            <span class="fs-head-name">家庭：{{ family.groupId }}</span>
            <span class="fs-head-member">成员：{{ family.groupName }}</span>
          </label>
          <el-table :data="family.userInfoForms" border stripe style="width: 100%">
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="mobile" label="电话号码"></el-table-column>
            <el-table-column prop="userName" label="性别"></el-table-column>
            <el-table-column prop="allIncome" label="收入"></el-table-column>
            <el-table-column prop="allSpending" label="支出"></el-table-column>
            <el-table-column prop="balance" label="状态"></el-table-column>
          </el-table>
        </template>
        <template v-else>
          <span>你还未加入家庭组！</span>
        </template>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="800px"
        >
        <div class="function-area">
          <div class="fs-join" v-show="search_status">
            <div class="fsj-search-input">
              <el-input v-model="groupInfo" placeholder="请输入搜索内容"></el-input>
              <el-button type="primary" @click="searchGroup">搜索</el-button>
            </div>
            <div class="fsj-search-res" v-show="searchRes.length">
              <el-table :data="searchRes" border stripe style="width: 100%">
                <el-table-column prop="groupId" label="ID"></el-table-column>
                <el-table-column prop="groupName" label="名字"></el-table-column>
                <el-table-column prop="groupManager" label="创建者"></el-table-column>
                <el-table-column prop="groupMembers" label="人数"></el-table-column>
                <el-table-column prop="allIncome" label="总收入"></el-table-column>
                <el-table-column prop="allSpending" label="总支出"></el-table-column>
                <el-table-column prop="balance" label="状态"></el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="joinGroup(scope.row)">加入</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="fs-create" v-show="create_status">
            <el-input v-model="familyName" placeholder="请输入创建家庭名字">
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmInput">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  name: 'family',
  data() {
    return {
      groupInfo: '',
      familyName: '',
      searchRes: [],
      dialogVisible: false,
      search_status: false,
      create_status: false,
      family: {
        groupId: '',
        groupName: '',
        userInfoForms: []
      }
    }
  },
  mounted() {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    if (!user) this.$router.push('/')
    if (user.groupId === 0) {
    } else {
      this.loadMembers();
    }
  },
  methods: {
    loadMembers() {
      this.$http.get('/api/group/getGroupInfo',
      {params: qs.stringify({groupName: this.familyName})})
        .then((res) => {
          const data = res.data;
          if (data.code === '200') {
            const { groupInfoForm } = data;
            this.family = JSON.parse(groupInfoForm);
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('网络连接失败')
        })
    },
    joinFa() {
      this.dialogVisible = true;
      this.create_status = false;
      this.search_status = true;
    },
    joinGroup(row) {
      console.log(row)
    },
    createFa() {
      this.dialogVisible = true;
      this.search_status = false;
      this.create_status = true;
    },
    quitFa() {
      this.$confirm('此操作将永久解散该家庭组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/api/group/quitGroup')
            .then((res) => {
              const data = res.data
              if (data.code === '200') {
                this.$message.success('解散成功！')
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
    },
    searchGroup() {
      this.$http.get('/api/group/findGroup', {params: {groupInfo: this.groupInfo}})
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            console.log(data)
            this.searchRes = JSON.parse(data.group)
            this.$message.success('搜索成功！')
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
    },
    confirmInput() {
      this.dialogVisible = false
      if (this.create_status) {
        this.$http.post('/api/group/createGroup', qs.stringify({groupName: this.familyName}))
          .then((res) => {
            const data = res.data;
            if (data.code === '200') {
              console.log(data.msg)
              this.$message.success('创建家庭组成功！')
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch((e) => {
            console.error(e)
            this.$message.error('创建家庭组失败！')
          })
      }
    }
  }
}
</script>
<style lang="stylus">
#family
  background-color #F8F8F8
  padding 20px 10px
  box-shadow 0 0 8px 2px #999
  min-height 90%
  .family-shortinfo
    .fs-head
      margin-bottom 20px
      &>div
        margin 10px 0
    .fs-content
      label
        line-height 30px
        height 30px
        font-size 12px
        color #666
  .function-area
    text-align center
    .el-input
      width 600px
    .fs-join
      .fsj-search-res
        margin-top 10px
</style>
