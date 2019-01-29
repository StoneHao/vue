<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20" class="search">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="queryContent" class="input-with-select">
          <el-button slot="append" @click="getQueryContent" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click="showAddUsersDialog">添加用户</el-button>
      </el-col>
    </el-row>

    <el-table :data="usersList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="160"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="160">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserState(scope.row.id, scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="deleteUserData(scope.row.id)"
          >删除</el-button>
          <el-button size="mini" type="success" plain icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
    在搜索之后再刷新 此时搜索的内容是第一页的内容 而分页元素的页码还是保持在上一次选中的页面
    例子： 上一次选中是第3页 刷新后展示第1页的数据 但是此时第3页还是选中状态 需要同步分页器的页码到数据中就需要给 current-page 属性添加 .sync 修饰符后, 相当于形成双向数据绑定 就可以设置当前页-->
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="curPage"
      @current-change="changePage"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="userAddDialog" @close="closeUserAddDialog">
      <el-form :model="userAddForm" :rules="userAddRules" ref="userAddForm">
        <el-form-item prop="username" label="用户名" label-width="120px">
          <el-input v-model="userAddForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="120px">
          <el-input v-model="userAddForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userAddForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userAddForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  /**
   * 3种解决element 分页问题的方法
   *  1 current-page 属性添加 .sync 修饰符 形成数据同步
   *
   *  2 每次请求数据完毕后需要将返回的页码数据设置给data中的页码数据
   *     2.1 this.curPage = data.pagenum;  (通过当前返回数据的真实页码值赋值给data中的curPage)
   *         形成el-pagination中 internalCurrentPage这个值和this.curPage同步
   *         data.pagenum ===  internalCurrentPage (实际页码值)
   *   这种方式适用于增加数据和删除数据 都会显示当前页码
   *
   *  3 在@current-change 方法中设置当前页码的值给curPage 形成同步
   *     3.1 this.curPage = curPage; this.curPage指向了回调函数中的当前页码
   *         this.curPage = curPage;  （应该是element的内部做了方法处理 同步了父子组件的数据）
   *         curPage 应该指向  internalCurrentPage
   *         随着 internalCurrentPage 而变化
   *         所以直接跳过了修改props只读属性中 currentPage 这个值
   *         直接让internalCurrentPage的值和Users组件中data的cutPage值相等
   *         在通过单向数据流赋值更新
   *         this.curPage = curPage = internalCurrentPage => props['currentPage']
   *         tips:只有在这个current-change方法里给curPage赋值才会最后生效，
   *         其余地方的赋值最后都会被这个方法给覆盖掉，如果这个方法里没有对page赋值就一直默认是1
   *         所以在data中怎么设置curPage的值 分页器中一直是1
   *
   *   原理  通过观察 el-pagination 组件  下面还一个 ELPager的子组件
   *   Users组件中data的cutPage的变化流向el-pagination组件中
   *   继续流向ELPager子组件 props 中  currentPage 属性中 这个值应该是只读的
   *   所以ELPager子组件修改中这个值应该是同步不到el-pagination组建中 currentPager的值的
   *   实际上真正同步当前页码值的数据应该是el-pagination组件中的internalCurrentPage属性值
   *   internalCurrentPage这个值应该是el-pagination组件中的获取的全局的值不受只读的影响
   *   由于ELPager子组件 props 中  currentPage 属性 是只读的 避免vue内部报错
   *   internalCurrentPage = currentPage  这个方法另外设置了一个变量 来控制页面
   *   该变量改变currentPage变量执行也发生改变
   *   所以初始化改变页码是可以达到数据页码同步的
   *   但是再次发送请求获取数据（默认currentPager=1）
   *   此时 Users el-pagination中currentPager和ELPager子组件 props中currentPage属性已经不同步了
   *   直接导致数据和页码选中错乱
   *
   *   解决该问题就需要将ELPager子组件 props 中  currentPage 属性 时时同步到父组件中
   *   即 internalCurrentPage => ELPager的currentPage => el-pagination => Users
   *   然后根据单项数据流 从父组件一级一级的往下覆盖
   *
   *
   **/
  name: 'Users',
  data () {
    return {
      usersList: [],
      totalLength: 0,
      queryContent: '', // 搜索的内容
      total: 0, // 总条数
      curPage: 1, // 当前页码(初始设置有效 再次设置需要sync修饰符才有效)
      pageSize: 3, // 每页大小
      flag: false, // 判断有没有点击过搜索且是有内容的搜索
      // 控制用户添加对话框的展示和隐藏
      userAddDialog: false,
      // 用户添加对话框表格数据
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户添加对话框表格验证规则
      userAddRules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '用户名长度在 3 到 6 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '密码长度在 3 到 6 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUsersListData()
  },
  methods: {
    // 发送请求获取用户数据
    getUsersListData (curPage = 1, queryContent = '', pageSize = this.pageSize) {
      this.$http
        .get('/users', {
          params: {
            pagenum: curPage,
            pagesize: pageSize,
            query: queryContent.trim() // 查询内容
          }
        })
        .then(result => {
          const { data, meta } = result.data
          if (meta.status === 200) {
            console.log(data)
            this.total = data.total
            this.usersList = data.users
            // 保证每次获取数据的页码和当前页码一致 为下次逻辑提供数据（默认页码为 1）
            // （在删除数据和增加数据中需要保持显示当前页面 而不是默认跳转首页 就需要传入当前页码）
            this.curPage = data.pagenum
            this.totalLength = data.total
          }
        })
    },
    // 页码改变的回调函数  curPage 当前页码的值
    changePage (curPage) {
      if (this.flag) {
        this.getUsersListData(curPage, this.queryContent)
      } else {
        this.getUsersListData(curPage)
        this.queryContent = ''
      }
    },
    // 根据搜索内容查新数据的方法回调
    getQueryContent () {
      if (this.queryContent) {
        this.curPage = 1
        this.flag = true // 表示点击过搜索且有内容
        this.getUsersListData(this.curPage, this.queryContent)
      } else {
        this.$message({
          message: '请输入搜索内容',
          type: 'warning',
          duration: 2000
        })
        this.getUsersListData()
        this.flag = false // 重置标志 这是一次无效搜索
      }
    },
    // 启用或禁用用户
    changeUserState (id, state) {
      this.$http.put(`/users/${id}/state/${state}`).then(result => {
        const { data, meta } = result.data
        if (meta.status === 200) {
          // 修改成功
          this.$message({
            type: 'success',
            message: data.mg_state === 0 ? '禁用成功' : '启用成功',
            duration: 2000
          })
        } else {
          // 修改失败
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 2000
          })
        }
      })
    },
    // 根据ID删除用户数据
    deleteUserData (id) {
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${id}`).then(result => {
          const { meta } = result.data
          if (meta.status === 200) {
            this.$message({
              type: 'success',
              message: meta.msg
            })
            const index = this.usersList.findIndex(item => item.id === id)
            //  两种情况 不发生页面改变的时候只是在当前页数组中删除了一条数据
            this.usersList.splice(index, 1)
            const totalPage = Math.ceil(--this.totalLength / this.pageSize)
            // 发生页面改变 请求新的数据重新渲染
            if (this.curPage > totalPage) {
              this.getUsersListData(--this.curPage)
            }
          }
        })
      })
    },
    // 添加新的用户
    addUser () {
      this.$refs.userAddForm.validate(valid => {
        if (valid) {
          // 成功
          this.$http.post('/users', this.userAddForm).then(res => {
            const { meta } = res.data
            if (meta.status === 201) {
              // 1 关闭对话框
              // 2 重置表单(只要关闭对话框，就会自动触发对话框的关闭事件来重置表单)
              this.userAddDialog = false
              // 3 重新获取列表数据(需要显示当前页 如果涉及到页面增加需要判断)
              // 计算总页面 总是跳转最后一页展示添加的数据
              let totalPage = Math.ceil(++this.totalLength / this.pageSize)
              this.getUsersListData(totalPage)
            }
          })
        } else {
          return false
        }
      })
    },
    // 显示添加用户对话框
    showAddUsersDialog () {
      this.userAddDialog = true
    },
    // 关闭对话框重置表单
    closeUserAddDialog () {
      this.$refs.userAddForm.resetFields()
      console.log('closed')
    }
  }
}
</script>

<style scoped lang="less">
.users {
  .search {
    margin-bottom: 20px;
  }
  .el-breadcrumb {
    padding-left: 10px;
    background-color: #d4dae0;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .pagination {
    position: absolute;
    right: 30px;
    bottom: 30px;
  }
}
</style>
