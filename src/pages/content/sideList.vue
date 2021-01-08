<template>
  <el-row>
    <el-col :span="24">
      <el-menu default-active="1" class="el-menu-vertical-demo">
        <div v-if="info ===  1 ? false: true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>教师管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title"></template>
              <el-menu-item index="1-1">
                <router-link :to="{name:'classGuanli'}" tag="li">班级管理</router-link>
                <!-- 动态班级 -->
                <router-link :to="{name:'alreadyClass'}" tag="li"></router-link>
              </el-menu-item>
              <!--<el-menu-item index="1-2">-->
                <!--<router-link :to="{name:'examineClass'}" tag="li">所有班级</router-link>-->
              <!--</el-menu-item>-->
            </el-menu-item-group>
          </el-submenu>
        </div>
        <el-col :span="24" v-if="info ===  1 ? true: false">
          <el-menu default-active="2" class="el-menu-vertical-demo">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>管理员管理</span>
              </template>
              <el-menu-item-group>
                <!-- 管理员管理导航 -->
                <el-menu-item index="1-2">
                  <router-link :to="{name:'existingSemesterList'}" tag="li">学期管理</router-link>
                </el-menu-item>
                <el-menu-item index="1-4">
                  <router-link :to="{name:'teacherList'}" tag="li">教师管理</router-link>
                </el-menu-item>
                <el-menu-item index="1-5">
                  <router-link :to="{name:'studentAdministration'}" tag="li">学生管理</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-menu>
       <el-col :span="24" >
          <el-menu default-active="2" class="el-menu-vertical-demo">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>我的</span>
              </template>
              <el-menu-item-group>
                <!-- 管理员管理导航 -->
                <el-menu-item index="1-1">
                  <router-link :to="{name:'lookClass'}" tag="li">修改密码</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      info: null
    };
  },
  mounted() {
     let isInfo = localStorage.getItem('info');
    if(isInfo == '管理员'){
      this.info = 1;
    }
  }
};
</script>
<style scoped>
</style>
