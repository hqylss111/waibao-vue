<template>
  <el-container>
    <el-header>
        <navHead></navHead>
    </el-header>
    <el-container>
      <el-aside>
        <sideList/>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import navHead from "./content/head";
import sideList from './content/sideList'
export default {
  components: {
    navHead,
    sideList
  }
};
</script>
<style scoped>
.el-container{
    height: 100vh;
}
header{
 height: 60px;
 box-sizing: border-box;
}
.el-header{
 padding: 0px;
 
}
</style>