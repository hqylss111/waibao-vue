<template>
  <div class="wrapper">
    <div class="title">班级列表</div>
    <div class="list">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="班级名称" width="600">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看班级</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">导出学生</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="el-fenye"
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="onchange"
    ></el-pagination>
  </div>
</template>
<script>
import api from "../../api/index";
export default {
  data() {
    return {
      tableData: [],
      skip: 0,
      totalCount: 1
    };
  },
  created() {
    this.getData(this.skip);
  },
  methods: {
    //分页获取数据
    onchange(e) {
      let skip = e - 1;
      this.getData(skip);
    },
    //获取列表
    getData(skip) {
      let limit = 10;
      let semester = "全部";
      api.inquireClassList(limit, skip, "", semester).then(res => {
        if (res.data.code == 200) {
          let arr = [];
          let teacherList = [];
          this.totalCount = res.data.data.total;
          res.data.data.list.forEach((item, index) => {
            arr.push(item);
          });
          arr.forEach((item, idnex) => {
            console.log(item);
            let id = item.class._id;
            let name = item.class.name;
            let student = item.class.teacher;
            teacherList.push({
              id: id,
              name: name,
              student: student
            });
          });
          this.tableData = teacherList;
        } else {
          console.log("没有获取到老师列表");
        }
      });
    },
    //分页
    onchang(e) {
      let skip = e - 1;

      this.getData(e, 10, "", "全部");
    },
    //导出学生
    handleDelete(index, row) {
      let id = row.id;
      // api.exportStudent(id).then(res => {
      //     return res.data
      // }).then(res =>{

      // });
      const a = document.createElement("a");
      a.href = `http://139.9.240.106/api/student/exportExcel?id=${id}`;
      a.download = "学生列表菜单.xlsx";
      // a.target='_self'
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    download(blobUrl) {},
    //跳转路由到学生列表
    handleEdit(index, row) {
      this.$router.push({
        path: `/content/squad/${row.id}`
      });
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 80vh;
  margin-right: -15px;
  margin-bottom: -15px;

  box-sizing: border-box;
  font-family: "Courier New", Courier, monospace;
}

.title {
  text-align: center;
  font-size: 20px;
  margin: 10px 0px;
}
.el-fenye {
  text-align: center;
  margin: 5px 0px;
}
.list {
  width: 98%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0px;
}

.list-btn span {
  margin: 0px 10px;
}
.Pagination {
  text-align: center;
  margin: 10px 0px;
  font-size: 14px;
}
</style>