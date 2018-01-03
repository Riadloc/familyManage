<template>
  <div id="family">
    <div class="family-shortinfo">
      <div class="fs-head">
        <div class="fs-ctrl-btns" ref="btns">
          <el-button type="primary" @click="create_status = true" v-show="!family.userInfoForms.length">创建</el-button>
          <el-button type="primary" @click="search_status = true" v-show="!family.userInfoForms.length">加入</el-button>
          <el-button type="primary" @click="updateFa" v-show="family.userInfoForms.length">修改</el-button>
          <el-button type="primary" @click="quitFa" v-show="family.userInfoForms.length">退出</el-button>
        </div>
      </div>
      <div class="fs-content">
        <template v-if="family.userInfoForms.length">
          <label>
            <span class="fs-head-name">成员：{{ family.groupId }}</span>
            <span class="fs-head-member">家庭：{{ family.groupName }}</span>
          </label>
          <el-table :data="family.userInfoForms" border stripe highlight-current-row style="width: 100%">
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="mobile" label="电话号码"></el-table-column>
            <el-table-column prop="userId" label="用户名"></el-table-column>
            <el-table-column prop="allIncome" label="收入"></el-table-column>
            <el-table-column prop="allSpending" label="支出"></el-table-column>
            <el-table-column prop="balance" label="状态"></el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button @click="handleMemSel(scope.row)" type="primary" size="small" v-if="scope.row.id !== userId">查看</el-button>
                <template v-if="!scope.row.isManager&&userId === family.managerId">
                  <el-button @click="kikMember(scope)" type="primary" size="small">移除</el-button>
                </template>
                <span v-if="scope.row.isManager">管理员</span>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            title="成员信息"
            :visible="memberVisible"
            width="700px"
            @close="memberVisible = false"
            >
            <div class="member-detail">
              <ul class="md-info">
                <li>姓名：{{memberDetail.userName}}</li>
                <li>性别：{{memberDetail.sex | getGender}}</li>
                <li>总收入：{{memberDetail.allIncome}}</li>
                <li>总支出：{{memberDetail.allSpending}}</li>
              </ul>
              <ul class="md-year-ctrl">
                <li @click="year--"><i class="el-icon-caret-left"></i></li>
                <li class="current-year">{{ year }}</li>
                <li @click="year++"><i class="el-icon-caret-right"></i></li>
              </ul>
              <el-table
                :data="memberData"
                v-if="memberDetail.allowType1"
                stripe
                style="width: 100%">
                <el-table-column prop="month" label="月份"></el-table-column>
                <el-table-column prop="spend" label="支出"></el-table-column>
                <el-table-column prop="income" label="收入"></el-table-column>
                <el-table-column prop="balance" label="资产"></el-table-column>
                <el-table-column fixed="right" label="操作" width="140" v-if="memberDetail.allowType2">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="memberAccountDetail(scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <p v-else>用户已隐藏账单查看！</p>
              <el-dialog
                title="月账单详情"
                :visible="accountModal"
                width="800px"
                @close="accountModal = false"
                append-to-body
                >
                <div class="month-account-detail">
                  <el-table
                    :data="accountDetail"
                    stripe
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column prop="fatherName" label="类型"></el-table-column>
                    <el-table-column prop="typeName" label="分类"></el-table-column>
                    <el-table-column prop="accountNum" label="金额"></el-table-column>
                    <el-table-column prop="description" label="备注"></el-table-column>
                  </el-table>
                </div>
              </el-dialog>
            </div>
          </el-dialog>
        </template>
        <template v-else>
          <span>你还未加入家庭组！</span>
        </template>
      </div>
      <el-dialog
        title="提示"
        :visible="dialogVisible"
        width="800px"
        @close="closeModal"
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
          <div class="fs-update" v-show="update_status">
            <el-input v-model="familyName" placeholder="请输入创建家庭名字">
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeModal">取 消</el-button>
          <el-button type="primary" @click="confirmInput">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import moment from 'moment'
import { JOIN_GROUP, GROUP_INFO, UPDATE_GROUP, REMOVE_MEMBER, MEMBER_CONFIG, MEMBER_MONTH_ACCOUNT, MEMBER_ACCOUNT_DETAIL } from '../config'
export default {
  name: 'family',
  data() {
    return {
      userId: null,
      groupInfo: '',
      familyName: '',
      memberVisible: false,
      accountModal: false,
      loading: false,
      searchRes: [],
      search_status: false,
      create_status: false,
      update_status: false,
      memberDetail: {
        allowType1: false,
        allowType2: false
      },
      year: 2018,
      memberData: [],
      accountDetail: [],
      family: {
        groupId: '',
        groupName: '',
        userInfoForms: []
      }
    }
  },
  computed: {
    dialogVisible() {
      return (this.search_status || this.create_status || this.update_status)
    }
  },
  watch: {
    memberVisible(newVal) {
      if (!newVal) {
        this.memberData.splice(0)
      }
    },
    year(newVal) {
      this.handleMemSel(this.memberDetail)
    }
  },
  mounted() {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    if (!user) this.$router.push('/')
    this.userId = user.id
    console.log(user.id)
    if (user.groupId === 0) {
      this.$message.info('未加入家庭组')
      this.$refs.btns.style.display = 'block'
    } else {
      this.loadMembers(user.groupId)
    }
  },
  methods: {
    loadMembers(id) {
      this.$http.get(GROUP_INFO,
      {params: qs.stringify({groupInfo: id})})
        .then((res) => {
          const data = res.data;
          if (data.code === '200') {
            const { groupInfoForm } = data
            this.family = JSON.parse(groupInfoForm)
            console.log(this.family)
            this.$refs.btns.style.display = 'block'
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('网络连接失败')
        })
    },
    closeModal() {
      this.familyName = ''
      this.create_status = false
      this.search_status = false
      this.update_status = false
    },
    updateFa() {
      this.familyName = this.family.groupName
      this.update_status = true
    },
    joinGroup(row) {
      const { groupId } = row
      this.$http.post(JOIN_GROUP, qs.stringify({ groupId }))
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.$message.success('已发送申请信息！')
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
      this.closeModal()
    },
    kikMember(scope) {
      const { row, $index } = scope
      this.$confirm('此操作将永久解散该家庭组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(REMOVE_MEMBER, qs.stringify({ removeId: row.id }))
          .then((res) => {
            const data = res.data
            if (data.code === '200') {
              this.family.userInfoForms.splice($index, 1)
              this.$message.success('移除成功！')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((e) => {
            console.error(e)
            this.$message.error('出错！')
          })
        }).catch(() => {
          console.log('已取消')
        })
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
                this.family.userInfoForms.splice(0)
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
    handleMemSel(row) {
      const { id: userId } = row
      this.memberDetail = row
      let userConfig = {}
      this.$http.get(MEMBER_CONFIG, { params: {userId} })
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.memberVisible = true
            userConfig = JSON.parse(data.userConfig)
            if (userConfig.allowType1 === 1) {
              this.$set(this.memberDetail, 'allowType1', !!userConfig.allowType1)
              this.$http.get(MEMBER_MONTH_ACCOUNT, {params: { userId, year: this.year }})
                .then((res) => {
                  const data = res.data
                  if (data.code === '200') {
                    const accounts = JSON.parse(data.accounts)
                    this.$set(this.memberDetail, 'allowType2', !!userConfig.allowType2)
                    if (accounts.length) {
                      this.memberData = accounts.filter((item) => item.balance - 0)
                    }
                  } else {
                    this.$message.error(data.msg)
                  }
                })
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('出错！')
        })
    },
    memberAccountDetail(row) {
      const { userId, month } = row
      this.accountDetail.splice(0)
      this.accountModal = true
      this.loading = true
      const fromDate = String(month).slice(0, 4) + '-' + String(month).slice(4) + '-01'
      const toDate = moment(fromDate).add(1, 'M').format('YYYY-MM-DD')
      this.$http.get(MEMBER_ACCOUNT_DETAIL, {params: {userId, fromDate, toDate}})
        .then((res) => {
          const data = res.data
          if (data.code === '200') {
            this.accountDetail = JSON.parse(data.accounts)
          } else {
            this.$message.error(data.msg);
          }
          this.loading = false
        })
        .catch((e) => {
          console.error(e)
          this.$message.error('创建家庭组失败！')
          this.loading = false
        })
    },
    confirmInput() {
      if (this.create_status) {
        this.$http.post('/api/group/createGroup', qs.stringify({groupName: this.familyName}))
          .then((res) => {
            const data = res.data;
            if (data.code === '200') {
              console.log(data.msg)
              const user = JSON.parse(window.sessionStorage.getItem('user'))
              user.groupId = data.groupId
              window.sessionStorage.setItem('user', JSON.stringify(user))
              this.loadMembers(data.groupId)
              this.$message.success('创建家庭组成功！')
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch((e) => {
            console.error(e)
            this.$message.error('创建家庭组失败！')
          })
      } else if (this.update_status) {
        const groupName = this.familyName
        this.$http.post(UPDATE_GROUP, qs.stringify({groupName}))
          .then((res) => {
            const data = res.data;
            if (data.code === '200') {
              this.$set(this.family, 'groupName', groupName)
              this.$message.success('修改家庭组成功！')
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch((e) => {
            console.error(e)
            this.$message.error('创建家庭组失败！')
          })
      }
      this.closeModal()
    }
  },
  filters: {
    getGender(val) {
      return val ? '女' : '男'
    }
  }
}
</script>
<style lang="stylus">
#family
  padding 20px 10px
  .family-shortinfo
    .fs-head
      margin-bottom 20px
      &>div
        margin 10px 0
        display none
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
  .member-detail
    .md-info
      display flex
      justify-content space-between
      &>li
        flex 1 0
        font-weight bold
  .md-year-ctrl
    display inline-flex
    width 100px
    color #444
    margin 20px 0 0 0
    &>li
      flex 1 0
      text-align center
      cursor pointer
      &>i
        font-size 18px
        vertical-align text-bottom
    .current-year
      color #555
      cursor text
</style>
