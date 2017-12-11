<template>
  <div id="family">
    <div class="family-shortinfo">
      <div class="fs-head">
        <div class="fs-ctrl-btns">
          <el-button type="primary" @click="createFa">创建家庭</el-button>
          <el-button type="primary" @click="joinFa">加入家庭</el-button>
          <el-button type="primary" >退出家庭</el-button>
        </div>
        <div class="function-area" v-if="search_status || create_status">
          <div class="fs-join" v-show="search_status">
            <div class="fsj-search-input">
              <el-input v-model="groupId" placeholder="请输入加入家庭组号">
              </el-input>
              <el-button type="primary" >搜索</el-button>
            </div>
            <div class="fsj-search-res" v-show="searchRes.length">
              <el-table border stripe style="width: 100%">
                <el-table-column prop="groupId" label="ID"></el-table-column>
                <el-table-column prop="groupName" label="名字"></el-table-column>
                <el-table-column prop="groupManager" label="创建者"></el-table-column>
                <el-table-column prop="groupMembers" label="人数"></el-table-column>
                <el-table-column prop="allIncome" label="总收入"></el-table-column>
                <el-table-column prop="allSpending" label="总支出"></el-table-column>
                <el-table-column prop="balance" label="状态"></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="fs-create" v-show="create_status">
            <el-input v-model="familyName" placeholder="请输入创建家庭名字">
            </el-input>
            <el-button type="primary">创建</el-button>
          </div>
        </div>
      </div>
      <div class="fs-content" v-if="family.members.length">
        <label>
          <span class="fs-head-name">家庭：{{ family.name }}</span>
          <span class="fs-head-member">成员：{{ family.members_amount }}</span>
        </label>
        <el-table :data="family.members" border stripe style="width: 100%">
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="income" label="收入"></el-table-column>
          <el-table-column prop="expenses" label="支出"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'family',
  data() {
    return {
      groupId: '',
      familyName: '',
      searchRes: [],
      search_status: false,
      create_status: false,
      family: {
        name: '红绿蓝',
        members_amount: 8,
        members: [
          {
            name: '张三',
            income: 8000,
            expenses: 8000,
            status: 0
          },
          {
            name: '李四',
            income: 8000,
            expenses: 8000,
            status: 0
          },
          {
            name: '王二',
            income: 8000,
            expenses: 8000,
            status: 0
          }
        ]
      }
    }
  },
  methods: {
    joinFa() {
      this.create_status = false;
      this.search_status = !this.search_status;
    },
    createFa() {
      this.search_status = false;
      this.create_status = !this.create_status;
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
      .function-area
        .el-input
          width 200px
        .fs-join
          .fsj-search-res
            margin-top 10px
    .fs-content
      label
        line-height 30px
        height 30px
        font-size 12px
        color #666
</style>
