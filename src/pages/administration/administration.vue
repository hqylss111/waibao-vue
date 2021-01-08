<template>
  <div class="administration">
    <!-- 要做删选 0是上学期 1是下学期 -->
    <div class="create">创建学期</div>
    <div class="cereateContent">
       <el-date-picker
      v-model="year"
      type="year"
      placeholder="选择年">
    </el-date-picker>
      <div class="menu">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{semesterText}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">上学期</el-dropdown-item>
            <el-dropdown-item command="1">下学期</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <button @click="establish">创建学期</button>
    </div>
  </div>
</template>
<script>
import api from "../../api/index";
export default {
  data() {
    return {
      value5: "",
      year: "", //年
      semester: "", //学期 1是上 2是下,
      semesterText: "请你选择学期",
      lock: false
    };
  },
  methods: {
    //创建班级
    establish() {
      // 1.拿到值发给后端
      let year = new Date(this.year).getFullYear();
      let semester = Number(this.semester);
      if (this.lock) {
        return;
      }
      this.lock = true;
      api.setSemester(year, semester).then(res => {
        if (res.data.code == 200) {
          this.lock = false;
          this.$message("创建成功");
          this.year = null;
          this.semester = null;
          this.$parent.handleClose();
          this.$emit('demo')
        }
        if (res.data.errorCode == 500) {
          this.$message(`${res.data.message}`);
          this.lock = false;
        }
      });
    },
    // 获取年
    getYear(e) {
      let str = `${e}`.split(" ");
      this.year = str[3];
    },
    //获得学期
    handleCommand(command) {
      this.semester = command;
      if (command == 1) {
        this.semesterText = "上学期";
      } else {
        this.semesterText = "下学期";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-dropdown-menu__item {
  font-size: 18px;
  width: 120px;
  padding: 0px 10px;
}
@import url("../../assets/less/administration");
</style>

