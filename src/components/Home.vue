<template>
  <el-container class="home">
    <el-header>
      <el-row>
        <el-col :span="8" class="logo">
          <img src="../assets/logo.jpg" alt="">
        </el-col>
        <el-col :span="8">
          <h1 class="title">后台管理系统</h1>
        </el-col>
        <el-col :span="8">
          <div class="welcome">
            <span>Welcome</span>
            <a href="javascript:;" @click.prevent="exit">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="/home/users"
          @open="handleOpen"
          @close="handleClose"
          text-color="#000"
          :router="true"
          active-text-color="#45E655">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/home/users">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/home">
            <i class="el-icon-location"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  /**
   * 0 利用ElementUi完成首页侧边导航的布局 （具体细节查看Element组件导航菜单文档）
   * 1 在Main中配置路由出口
   * 2 在路由配置Main中的路由子路径
   * 3 在el-menu菜单中启用vue-router 的模式 该模式会在激活导航时以index作为path进行路由跳转
   * 4 tips：在el-menu中的路由地址需要基于父路由的地址 例如：/home/users 不能直接写 /users
   * 5 完成 main中的布局 请求后台数据 展示数据
   *    tips：在配置子路由的时候 子路由路径可以加 /  也可以不加
   *    如果加/ 例如 /users   则访问路径会变成  ..../users
   *    如果不加/ 例如 /users  则访问路径会变成  ..../home/users
   *    根据具体匹配的路径 在el-menu配置的路由地址要符合路径
   */

  export default {
    name: 'Home',
    methods: {
      /* 退出登陆 */
      exit () {
        this.$confirm('是否退出系统', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!',
            duration:2000,
          });
          // 清除token
          localStorage.removeItem('token');
          // 跳转登录页
          this.$router.push('/login');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出',
            duration:2000,
          });
        });
      },
      /* 事件open的处理函数 指定展开的sub-menu */
      handleOpen (key, keyPath) {
        console.log(key, keyPath);
      },
      /* 事件open的处理函数 收起指定的sub-menu */
      handleClose (key, keyPath) {
        console.log(key, keyPath);
      },
    },
  };
</script>

<style scoped lang="less">
  .home {
    height: 100%;
    .el-header {
      padding: 0 10px;
      background-color: #b3c1cd;
      color: #333;
      text-align: center;
    }
    .logo {
      height: 60px;
      text-align: left;
      img {
        display: inline-block;
        width: 60px;
        height: 60px;
      }
    }
    .title {
      margin: 0;
      padding: 0;
      min-width: 200px;
      line-height: 60px;
      color: #fff;
      font-size: 24px;
    }
    .welcome {
      text-align: right;
      line-height: 60px;
      font-weight: bold;
      a {
        text-decoration: none;
        color: #409EFF;
      }
    }
    .el-aside {
      background-color: #fff;
      color: #999;
      line-height: 200px;
    }
    .el-main {
      background-color: #eaeef1;
      color: #333;
    }
    /* 层叠掉ElementUI 默认样式 */
    .el-menu {
      border-right: 0;
    }

  }
</style>
