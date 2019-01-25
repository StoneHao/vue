<!--登录界面的组件-->
<template>
  <div class="login">
    <el-form label-position="top" label-width="80px" :model="login" :rules="rules" ref="loginForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="login.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="login.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // 导入 axios
  import axios from 'axios';

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
    data () {
      return {
        login: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'},
          ],
        },
      };
    },
    methods: {
      /* 1 校验用户名和密码
       * 2 校验成功 => 向后台发送请求
       * 3 校验失败 => 提示用户
       * 4 后台返回数据 判断是否成功
       * 5 成功=> 跳转首页  失败=> 提示信息 tip 使用element中错误提示组件
       * 6 跳转主页后 修改主页的样式
       * 7 在登陆请求返回的数据中有一个token 这是判断是否登陆成功的重要标志
       *    如果有表示登陆成功 在获取返回数据的同时 将token存入到localStorage中
       *    方便路由中的全局守卫可以获取到
       * */
      submitForm () {
        // 对整个表单进行校验的方法，参数为一个回调函数。
        // 参数 valid  是否校验成功
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            axios.post('http://localhost:8888/api/private/v1/login', this.login).then(result => {
              const {data, meta} = result.data;
              if (meta.msg === '登录成功') {
                // 登陆成功 存储token 跳转首页
                localStorage.setItem('token', data.token);
                this.$router.push('/home');
              }
              else {
                // 登陆失败 给出提示
                this.$message({
                  message: '用户名或者密码错误',
                  type: 'error',
                  duration: 2000,
                });
              }
            });
          }

        });
      },
      resetForm () {
        this.$refs.loginForm.resetFields();
      },
    },
  };
</script>

<style scoped>
  .login {
    width: 50%;
    margin: 0 auto;
  }
</style>
