<template>
  <div class="callList">
    <div class="title">{{title}}</div>
    <div class="hintContent">
      <div class="blockDrop">
        <div class="hint">筛选学期:</div>
        <el-dropdown @command="handleCommand" class="DropdownText">
          <span class="el-dropdown-link myDropDown">
            <span class="text">{{DropdownText}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="全学期">全学期</el-dropdown-item>
            <el-dropdown-item command="上学期">上学期</el-dropdown-item>
            <el-dropdown-item command="下学期">下学期</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="addContent" @click="onAdded">
        <span class="hintAdd">+</span>
        <span>新增</span>
      </div>
    </div>
    <el-table
      v-if="tableData.length > 0 ? true : false"
      :data="dataList"
      style="width: 100%"
      :default-sort="{prop: 'years', order: 'descending'}"
    >
      <el-table-column prop="years" label="日期" sortable width="400"></el-table-column>
      <el-table-column label="学期" width="400">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.semester }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="查看">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看学期</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination small layout="prev, pager, next" :total="count" @current-change="onChange"></el-pagination>
    </div>
    <!-- 弹框 -->
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" width="50%">
      <Administration id="11111" @demo='demo' />
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/index.js";
import Administration from "./administration";
export default {
  components: { Administration },
  data() {
    return {
      title: "已经有班级",
      tableData: [],
      dataList: [],
      skip: 0,
      count: 0,
      DropdownText: "全学期", //下拉菜单显示文字，
      dialogVisible: false
    };
  },
  created() {
    // 1.请求创建的班级列表
    this.isContent();
    // 获取学期列表
    this.obtainClss();
    this.tableData = this.$store.getters.classList;
  },
  methods: {
    handleClose(){
       this.dialogVisible = false;
    },
    demo(a,b){
       this.obtainClss()
    },
    onAdded() {
      this.dialogVisible = true;
    },
    //下拉参数 删选学期
    handleCommand(e) {
      this.DropdownText = e;
      if (e == "上学期") {
        let skip = this.skip;
        this.obtainClss(skip, 0);
      }
      if (e == "下学期") {
        let skip = this.skip;
        this.obtainClss(skip, 1);
      }
      if (e == "全学期") {
        let skip = this.skip;
        this.obtainClss(skip);
      }
    },
    //
    //监听页数
    onChange(e) {
      this.skip = e - 1;
      this.obtainClss(e - 1);
    },
    //判断有没有学期
    isContent() {
      if (this.tableData.length > 0) {
        this.title = "";
      } else {
        this.title = "学期列表";
      }
    },
    //获取学期列表
    obtainClss(skip, semester) {
      //接口
      //limit 一次拿多少  skip 页数;
      api.acquireSemester({ skip, semester }).then(res => {
        this.count = res.data.data.total;
        let arr = [];
        if (res.data.code == 200) {
          res.data.data.list.forEach((item, inxex) => {
            if (item.semester == 0) {
              item.semester = "上学期";
            } else {
              item.semester = "下学期";
            }
            arr.push(item);
          });
        }
        this.dataList = arr;
      });
    },
    //查看学期
    handleEdit(index, row) {
      let semester = row.semester ==="上学期" ? 0 : 1
      this.$router.push(`/content/alreadyClass/${row.years}/${semester}/${row._id}`);
    },
    async handleDelete(index, row) {
      let confim = await this.$confirm("你确认要删除学期？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(e => {
        //  用户取消了
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      if (confim == "confirm") {
        let id = row._id;
        // //请求我要删除的班级  成功以后再执行一次请求班级的接口 传删除的id给他
        let data = await api.deleteClss(id);
        if (data.data.code == 200) {
          this.obtainClss();
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-dropdown-link {
  border: 1px solid #ddd;
  padding: 0px 5px;
  background: #409eff;
  font-size: 16px;
  border-radius: 4px;
}
.block {
  width: 100%;
  text-align: center;
  margin: 20px 0px;
}
.blockDrop {
  width: 80%;
  font-size: 18px;
  display: flex;
  padding-left: 10px;
  margin-bottom: 10px;
  
}
.hintContent {
  display: flex;
}
.DropdownText {
  height: 40px;
  line-height: 40px;
  width: 200px;
}
.blockDrop .hint {
  font-size: 14px;
  margin-right: 10px;
  line-height: 40px;
}
.blockDrop .el-dropdown-link {
  background: none;
  width: 100%;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.hintAdd {
  font-size: 24px;
}
.addContent {
  width: 100px;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  background: rgb(51, 153, 255);
  color: #fff;
  display: flex;
  justify-content: space-around;
  border-radius: 4px;
  padding: 0px 13px;
  
}

@import url("../../assets/less/existingSemesterList");
</style>