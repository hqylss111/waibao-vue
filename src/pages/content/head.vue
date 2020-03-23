<template>
  <div class="anvHader">
    <div class="nav">
      <div class="left">后台管理系统</div>
      <div class="ringht">
        <span class="text">{{info}}</span>
         <span class="text-red" @click="clear">注销</span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      info: ""
    };
  },
  created() {
    //    获取唯一标识 和 标识 清除缓存
    let info = localStorage.getItem('info')
    this.info = info;

  },
  methods: {
    clear() {
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style scoped>
.anvHader {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: rgb(67, 142, 815);
  color: #fff;
}
.nav {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}
.left {
  width: 250px;
  font-size: 25px;

  font-family: "Courier New", Courier, monospace;
  text-align: center;
  line-height: 60px;
}
.ringht {
  flex: 1;
  text-align: right;
  margin-right: 70px;
  line-height: 60px;
}
.ringht span {
  margin-right: 15px;
}
.text-red {
     background: #fff;
    padding: 10px;
    color: #f40;
    border-radius: 4px;
}
.text {
  font-size: 14px;
}
</style>