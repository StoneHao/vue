<template>
  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column prop="username" label="姓名" width="180">
    </el-table-column>
    <el-table-column prop="email" label="邮箱" width="180">
    </el-table-column>
    <el-table-column prop="mobile" label="电话">
    </el-table-column>
    <el-table-column prop="mg_state" label="用户状态">
    </el-table-column>
    <el-table-column prop="address" label="操作">
    </el-table-column>
  </el-table>
</template>

<script>

  export default {
    name: 'Users',
    data () {
      return {
        tableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
          }],
      };
    },
    created () {
      this.getUsersListData();
    },
    methods: {
      /* 发送请求获取用户数据 */
      getUsersListData () {
        this.$http.get('/users', {
          params: {
            pagenum: 1,
            pagesize: 5,
          },
        }).then(result => {
          const {data, meta} = result.data;
          if (meta.status === 200) {
            this.tableData = data.users;
          }
        });
      },
    },
  };
</script>

<style scoped>

</style>
