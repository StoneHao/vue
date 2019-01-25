<!--登录界面的组件-->
<template>
  <div class="login">
    <el-form label-position="top" label-width="80px" :model="login" :rules="rules" ref="ruleForm">
      <el-form-item label="名称" prop="username">
        <el-input v-model="login.username"></el-input>
      </el-form-item>
      <el-form-item label="活动区域" prop="password">
        <el-input v-model="login.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">登录</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  /**
   * el-form
   * label-position="top" 设置label的位置
   * :model 用来给表单设置数据模型（对象）
   * :rules 用来设置表单验证规则的
   * ref 用来引用当前的表单组件
   * el-form-item  label 当前表单项的名称
   * el-input   v-model 实现双向数据绑定
   */
  export default {
    name: 'Login',
    data() {
      return {
        login: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'},
          ],
        },
      }
    },
    methods: {
      submitForm(ruleForm) {
        console.log(this.login.username)
      },
      resetForm() {
        console.log(this.login.password)
      }
    },
  }
</script>

<style scoped>
  .login {
    width: 50%;
    margin: 0 auto;
  }
</style>
