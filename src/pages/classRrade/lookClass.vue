<template>
  <div class="wrapper">
    <div class="list">
      <div class="title">修改密码</div>
      <div class="content">
        <button @click="showPassword">修改密码</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api/index";
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    //修改密码
    showPassword() {
      this.$prompt("请你输入修改密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          api.changePassword(value).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功,下次登录使用修改的密码"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    }
  }
};
</script>
<style  scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
.list {
  margin: 0 auto;
  text-align: center;
  width: 30%;
  border: 1px solid #eee;
  padding: 20px;
}
.title {
  font-size: 30px;
}
.content button {
  border: none;
  margin: 20px 0px;
  width: 100px;
  height: 50px;
  font-size: 15px;
  border-radius: 8px;
  border-color: #409eff;
  background-color: #409eff;
  color: #fff;
}
</style>