<template>
  <div class="wrapper">
    <div class="login">
      <div class="title">后台管理系统</div>
      <input type="text" v-model="account" placeholder="请你输入账号" />
      <input v-model="psd" type="password" placeholder="请你输入密码" />
      <div class="text" v-if="islock">密码或者账号未填写请检查</div>
      <button @click="logIn">登录</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../api/index";
export default {
  data() {
    return {
      account: "",
      psd: "",
      islock: false,
      is:true,//防止多次点击
    };
  },
  methods: {
    // 登录
    async logIn() {
      this.islock = false;
      this.is = false
      //1.先判断
      let is = await this.dataDetermine(this.account, this.psd);
      if (is == false) {
        this.islock = true;
        return false;
      }
      if(this.is == true){
         return false;
      }
      this.is = true;
      api.login(this.account, this.psd).then(res => {
        // 要存到vuex 里面 校长 和把缓存存进token
        if (res.data.code == 200) {
          this.is = false;
          let data = {
            token: res.data.data.token,
            identifying: res.data.data.info.roles
          };
          this.$message({
            message: "登录成功",
            type: "success"
          });
          localStorage.setItem('info',res.data.data.info.roles)
          this.$store.dispatch("verdictTokenData", data); //存缓存和唯一标识
          this.$router.push("/content");
        }else{
           this.is = false;
        }
        if (res.data.errorCode == 500) {
           this.is = false;
          this.$message.error(`${res.data.message} 检查账号密码是否正确`);
        }
      });

      // //存缓存

      // //成功以后进去页面
    },
    //判断数据
    dataDetermine(account, psd) {
      if (account == "" || psd == "") {
        return false;
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import url("../assets/less/login");
</style>