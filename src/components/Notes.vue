<template>
  <div id="fund-notes">
    <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
      <el-tab-pane label="收入" name="income">
        <el-input name="amount" placeholder="" type="number">
          <label slot="prepend"><span>*</span>金额：</label>
        </el-input>
        <el-cascader
          expand-trigger="hover"
          :options="options"
          v-model="selectedOption"
          @change="handleChange">
        </el-cascader>
      </el-tab-pane>
      <el-tab-pane label="支出" name="expense">支出</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'fund-notes',
  data() {
    return {
      activeTab: 'income',
      options: [],
      selectedOption: []
    }
  },
  mounted() {
    this.getIncomeType();
  },
  methods: {
    getIncomeType() {
      this.$http.get('/api/accountType/getAccountType')
        .then((res) => {
          console.log(JSON.parse(res.data.types));
        })
    },
    handleClick() {},
    handleChange() {}
  }
}
</script>
<style lang="stylus">

</style>
