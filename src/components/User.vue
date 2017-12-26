<template>
  <div id="user-wrapper">
    <div class="user-info-content">
      <div class="user-info">
        <div class="ui-avatar">
          <img :src="user.photo" />
        </div>
        <div class="ui-text">
          <div class="ui-text-head clearfix">
            <h2 class="ui-text-nickname">{{ user.userName }}</h2>
            <el-button class="ui-text-edit" type="info" @click="dialogVisible = true" plain>编辑个人资料</el-button>
          </div>
          <ul class="ui-text-content">
            <li><label>&nbsp;I&nbsp;&nbsp;D&nbsp;：</label>{{ user.id }}</li>
            <li><label>账号：</label>{{ user.userId }}</li>
            <li><label>性别：</label>{{ user.sex | getGender }}</li>
            <li><label>手机：</label>{{ user.mobile }}</li>
          </ul>
        </div>
      </div>
      <div class="divider"></div>
      <div class="bill-info clearfix">
        <div style="float: left">
          <h2>总收益</h2>
          <ul class="bi-list clearfix">
            <li class="spend">
              <strong>{{ user.allIncome }}</strong>
              <span>总支出</span>
            </li>
            <li class="income">
              <strong>{{ user.allSpending }}</strong>
              <span>总收入</span>
            </li>
          </ul>
        </div>
        <div style="float: left">
          <h2>总资产</h2>
          <ul class="bi-list clearfix">
            <li class="balance">
              <strong>{{ user.balance }}</strong>
              <span>总资产</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改资料"
      :visible="dialogVisible"
      @close="dialogVisible = false"
      width="500px">
      <div class="user-info-update">
        <el-form :model="updateForm" label-width="80px">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeAvatarUpload">
              <img v-if="updateForm.filePhoto" :src="updateForm.filePhoto" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="updateForm.userName" placeholder="请输入用户名">
            </el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="updateForm.password" type="password" placeholder="请输入密码">
            </el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="updateForm.sex" >
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="updateForm.mobile" placeholder="请输入手机号" name="mobile">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUser">提交</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { UPDATE_USER } from '../config'
export default {
  name: 'user',
  data() {
    return {
      user: {
        userId: '',
        userName: '',
        sex: '',
        mobile: ''
      },
      updateForm: {
        userName: '',
        sex: 0,
        mobile: '',
        password: '',
        filePhoto: ''
      },
      dialogVisible: false
    }
  },
  mounted() {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    if (!user) this.$router.push('/')
    const {userName, sex, mobile, password, photo} = user
    console.log(typeof sex)
    this.user = user
    this.imageUrl = photo
    this.updateForm = Object.assign(this.updateForm, {userName, sex, mobile, password, filePhoto: photo})
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      if (isJPG && isLt2M) {
        const reader = new FileReader()
        const _this = this
        reader.readAsDataURL(file)
        reader.onload = function () {
          _this.updateForm.filePhoto = this.result
        }
      }
      return false
    },
    updateUser() {
      const formdata = new FormData()
      for (const key in this.updateForm) {
        if (this.updateForm.hasOwnProperty(key)) {
          const element = this.updateForm[key]
          formdata.append(key, element)
        }
      }
      this.$http.post(UPDATE_USER, formdata)
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
    }
  },
  filters: {
    getGender(val) {
      return val === 0 ? '男' : '女'
    }
  }
}
</script>
<style lang="stylus">
#user-wrapper
  background-color #fff
  padding 20px 10px
  .divider
    margin 20px 0
    &:after
      content: ''
      display block
      border-bottom 1px solid #d5d5d5
  .user-info-content
    .user-info
      display flex
      .ui-avatar
        vertical-align top
        flex 0 0 188px
        margin-right 20px
        border 4px solid #d5d5d5
        img
          width 188px
          height 188px
          border-radius 4px
          vertical-align top
      .ui-text
        line-height 2
        flex 1
        padding  0 20px
        .ui-text-head
          border-bottom 1px solid #ddd
          margin-bottom 10px
          .ui-text-nickname
            float left
            font-size 22px
          .ui-text-edit
            float right
        .ui-text-content
          font-size 16px
          li>label
            display inline-block
            width 60px
            text-align right
    .bill-info
      .bi-list
        line-height 2
        .income
          &>strong
            color #819539
        .spend
          &>strong
            color #cb3535
        .balance
          &>strong
            color #156EC2
        li
          float left
          padding: 0 20px
          text-align center
          &:nth-child(1)
            border-left 0
          border-left 1px solid #999
          strong
            display block
            font-size 24px
          span
            display block
            font-size 14px
  .user-info-update
    padding 0 20px
    .avatar
      width 120px
      height 120px
      display block
    .avatar-uploader-icon 
      font-size: 28px
      color: #8c939d
      width: 120px
      height: 120px
      line-height: 120px
      text-align: center
    .el-upload
      border: 1px dashed #d9d9d9
      border-radius: 6px
      cursor: pointer
      position: relative
      overflow: hidden
</style>
