<template>
  <div class="wrapper">
    <div class="squad-title">学生列表</div>
    <div class="seache">
      <div class="seache-btn">
          <div class="sasasa">添加学生</div>
          <div class="sasasa1">导入学生</div>
      </div>
      <div>
      </div>
    </div>
    <div class="squad-list">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="年级" >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.grade }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级" >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" >
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="成绩" >
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.score.total }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="性别" >
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.gender == 1 ? '男' : "女" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="学生登录权限" >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isLogin"
              active-text="开启"
              inactive-text="关闭"
              @change="authority(scope.$index,scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="modification(scope.$index, scope.row)">修改成绩</el-button>
            <el-button size="mini" class="el" @click="modification(scope.$index, scope.row)">删除学生</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "../../api/index";
export default {
  data() {
    return {
      islock: false,
      tableData: [],
      skip: "",
      id: "", //学生id
      listid: "", //列表id，
      index: 0,
      student: "" //搜索的学生
    };
  },
  created() {
    this.listid = this.$route.params.id;
    this.getData(this.listid);
  },
  methods: {
    showInput() {
       this.islock = !this.islock
    },
    //修改学生权限
    authority(index, row) {
      let i = index;
      let id = row._id;
      let isLogin = row.isLogin;
      console.log(i, id, isLogin);
      api.modificationJurisdiction(isLogin, id).then(res => {
        if (res.data.code == 200) {
          this.getData(this.listid);
        }
      });
    },
    //修改学生成绩
    async modification(index, row) {
      try {
        let value = await this.$prompt("输入修改学生成绩", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        });
        let id = row._id;
        let content = value.value;
        console.log(content);
        //修改成功   修改成功在获取一次 获取学生列表
        api.modificationGrade(content, id).then(res => {
          if (res.data.code == 200) {
            // 成功了在获取一次学生列表
            this.$message({
              type: "success",
              message: "修改成功"
            });

            this.getData(this.listid);
          } else {
            console.log("没有修改成功");
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    //获取学生列表
    getData(id) {
      api.getStudentList({ id }).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data[0].class.student;
        }
      });
    },
    onChange(e) {
      this.skip = e - 1;
      console.log(this.skip);
    },
    //请求参数
    handleEdit(index, row) {
      this.$router.push("/content/lookClass");
    }
  }
};
</script>
<style lang="less" scoped>
.seache {
  display: flex;
  width: 100%;
  margin: 0px 5px;
  flex-direction: row;
  justify-content: flex-end;
}
.seache-btn {
  display: flex;
  flex-direction: row;
  width: 200px;
  margin-right: 20px;
}

.sasasa{
  padding: 10px;
  border-radius: 4px;
  background-color: rgb(67, 142, 815);
  color: #ffffff;
  margin-bottom: 15px;
}
.delete{
 padding: 10px;
  border-radius: 4px;
  background-color: #f40;
  color: #ffffff;
  margin-bottom: 15px;
  margin-left: 5px;
}
.el{
  color: #f40;
}
.sasasa1{
  margin-left: 5px;
   padding: 10px;
  border-radius: 4px;
  background-color: rgb(67, 142, 815);
  color: #ffffff;
  margin-bottom: 15px;
}
@import url("../../assets/less/squad.less");
</style>
