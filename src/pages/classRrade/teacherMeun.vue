<template>
  <div class="wrapper">
    <div class="title">{{name}}</div>
    <div class="teacher-list">
      <div class="list">
        <el-table :data="dataList" style="width: 100%">
          <el-table-column label="班级名称" width="600">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看班级</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="Pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="count"
          @current-change="onchang"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../api/index";
export default {
  data() {
    return {
      id: "",
      name: "",
      dataList: [],
      skip: 0,
      count:0
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.name = this.$route.params.name + "老师的班级";
    this.teacherMeunList(this.skip);
  },
  methods: {
    //跳转班级列表
    handleEdit(index,row) {
      let id = row.id;
     
    
      this.$router.push({
        path: `/content/squad/${id}`
      });
    },
    //   分页
    onchang(e) {
      let id = this.id;
      let skip = e - 1;
      this.teacherMeunList(skip);
    },
    //查询所有的班级
    teacherMeunList(skip) {
      let teacheList = [];
      let id = this.id;
      api.inquireClassList(10, skip, id, "全部").then(res => {
        if (res.data.code == 200) {
          this.count = res.data.data.total;
          res.data.data.list.forEach(element => {
            let dataList = [];
            dataList.push(element.class);

            dataList.forEach(item => {
              console.log(item._id);
              let l = {
                name: item.name,
                id: item._id
              };

              teacheList.push(l);
            });
          });
        }

        this.dataList = teacheList;
      });
    }
  },
  onchang() {}
};
</script>
<style  scoped>
.wrapper {
  width: 100%;
    height:100%;
    font-size: 14px;
}

.title {
  text-align: center;
  font-size: 20px;
  margin: 5px 0px;
}
.Pagination {
  text-align: center;
}
</style>