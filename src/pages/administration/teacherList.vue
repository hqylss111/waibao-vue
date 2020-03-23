 <template>
  <div class="techer">
    <div class="title">
      <div class="titleAadd" @click="show">
        <i class="el-icon-plus"></i>
        <span>新增</span>
      </div>
      <div class="titleDelete"  @click="show">
        <i class="el-icon-plus"></i>
        <span>导入</span>
      </div>
    </div>
    <el-table :data="teacherList" style="width: 100%">
      <el-table-column label="序号" width="180" type="index"></el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="deleteInfo(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="centerDialogVisible" width="50%" center>
      <Teacher ></Teacher>
    </el-dialog>
  </div>
</template>
<script>
import api from "../../api/index";
import Teacher from "./teacher";
export default {
  components: {
    Teacher
  },
  data() {
    return {
      teacherList: [],
      centerDialogVisible: false,
      is: true
    };
  },
  created() {
    // this.teacherList = this.$store.state.teacherList;
    //取缓存

    this.getTeacher();
  },
  methods: {
    //调到老师的班级
    show() {
      this.centerDialogVisible = true;
    },
    handleEdit(item, data) {
      let id = data._id;
      let name = data.name;
      this.$router.push(`/content/teacherMeun/${name}/${id}`); //调到老师页面
    },
    //获取所有老师的列表
    getTeacher() {
      api.acquireTeacher(0).then(res => {
        if (res.data.code == 200) {
          this.teacherList = res.data.data.list;
        } else {
          alert("没有获取成功");
        }
      });
    },
    //删除某个老师
    deleteInfo(item, data) {
      api.deleteTeacher(data._id).then(res => {
        if (res.data.code == 200) {
          this.getTeacher();
        } else {
          alert("----");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/less/techerList");
</style>