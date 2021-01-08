<template>
  <div class="callList">
    <div class="blockDrop">
      <div>
        <span>筛选学期：</span>
        <select :v-model="options[0].value" @change="indexSelect">
          <option
            v-for="(item,index) in options"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
      </div>

      <div class="addText" @click="dialogVisible = true" v-if="isShow === 2" >
        <i class="el-icon-plus"></i>
        <span class="text">添加</span>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination small layout="prev, pager, next" :total="count" @current-change="onChange"></el-pagination>
    </div>
    <el-dialog title="创建" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="xuanze">
        <el-date-picker v-model="year" class="yeaer" type="year" placeholder="选择年"></el-date-picker>
        <el-select v-model="value" placeholder="请选择上下学期" @change="handleCommand">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClass">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/index.js";
export default {
  data() {
    return {
      title: "已经有班级",
      tableData: [],
      dataList: [],
      skip: 0,
      count: 0,
      dialogVisible: false,
      year: null,
      value: null,
      isShow :localStorage.getItem('info') === '教师' ? 1 : 2,
      semester: null, //上学期 或者下学期
      options: [
        {
          value: "上学期",
          label: "上学期"
        },
        {
          value: "下学期",
          label: "下学期"
        }
      ]
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
    handleClose() {},
    //下拉参数 删选学期
    indexSelect(event) {
      let e = event.target.value;
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
    handleCommand(e) {
      if (e === "上学期") {
        this.semester = 0;
      }
      if (e === "下学期") {
        this.semester = 1;
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
    addClass() {
      console.log(this.year, this.semester);
      if (this.year === null || this.semester === null) {
        this.$message({
          message: "年份 或者 学期 未选  不能创建学期",
          type: "warning"
        });
        return;
      }
      let year = new Date(this.year).getFullYear();
      let semester = this.semester;
      api.setSemester(year, semester).then(res => {
        console.log(res);
        if (res.status === 200) {
          this.$message({
            message: "创建学期成功",
            type: "success"
          });
          this.obtainClss();
          this.dialogVisible = false;
        }
      });
    },
    //获取学期列表
    obtainClss(skip, semester) {
      //limit 一次拿多少  skip 是页面 0开始 所以我要 -1;
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
        // console.log(this.data);
      });
    },

    //查看学期
    handleEdit(index, row) {
      console.log(row, 183, index);
      let semester = row.semester === "上学期" ? 0 : 1;
      this.$router.push(
        `/content/alreadyClass/${row.years}/${semester}/${row._id}`
      );
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
        console.log(data.data.code);
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
  justify-content: space-between;
  margin: 10px 0px;
  text-align: left;
}

.blockDrop select {
  width: 139px;
  height: 26px;
  line-height: 26px;
}
.DropdownText {
  float: left;
}
.el-dropdown-link {
  display: inline-block;
  text-align: left;
  width: 139px;
  height: 26px;
  line-height: 26px;
}
.el-dropdown-link i {
  float: right;
  margin-top: 5px;
}
.addText {
  width: 80px;
  border: 1px solid;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px;
  background-color: rgb(15, 2);
  background: rgb(51, 153, 255);
  color: #fff;
  border-radius: 4px;
}
.text {
  color: #fff;
  font-weight: bolder;
}
.xuanze {
  display: flex;
  flex-direction: column;
}
.yeaer {
  width: 100%;
  margin: 10px 0px;
}
@import url("../../assets/less/existingSemesterList");
</style>
