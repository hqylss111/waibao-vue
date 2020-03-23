<template>
  <div class="wrapper">
    <el-breadcrumb separator="<<">
      <el-breadcrumb-item :to="{ path: '/content/classGuanli' }">班级管理</el-breadcrumb-item>
      <el-breadcrumb-item class="mcolor">班级列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title">{{years}}年班级</div>
    <div class="content-list">
      <div class="list-title">
        <span>序号</span>
        <span>班级名称</span>
        <span>操作</span>
      </div>
      <div class="list-title" v-for="(item,index) in classList" :key="index">
        <span>{{index}}</span>
        <span class="text">{{item.name}}</span>
        <span class="lookOver" @click="lookOverClass(item.id)">查看班级</span>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../api/index";
export default {
  data() {
    return {
      years: "",
      id: "", //学期id
      classList: [],
      skip: 0,
      count: 0
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.years = this.$route.params.years;
    if (localStorage.getItem("info") == "校长") {
      api.getClassList(this.skip, this.id).then(res => {
        let dataList = [];
        if (res.data.code == 200) {
          this.count = res.data.data[0].total;
          res.data.data[0].class.forEach(item => {
            let data = {
              name: item.name,
              id: item._id
            };
            dataList.push(data);
          });
        }
        this.classList = dataList
      });
    } else {
      this.requestClass(this.skip, this.id);
    }
  },
  methods: {
    //校长获取列表
    // principalList(skip, semester) {
    // },
    // 查看班级
    lookOverClass(id) {
      this.$router.push({
        path: `/content/squad/${id}`
      });
    },
    requestClass(skip, semester) {
      //  拿years id 获取 该学期的班级
      //请求 当前学期的班级
      api.inquireClassList(10, skip, "", semester).then(res => {
          let dataList = [];
          if (res.data.code == 200) {
            this.count = res.data.data.total;
            res.data.data.list.forEach(element => {
              let arr = [];
              arr.push(element.class);

              arr.forEach((item) => {
                let data = {
                  name: item.name,
                  id: item._id
                };
                dataList.push(data);
              });
            });
          }
          this.classList = dataList;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/less/alreadyClass");
.mcolor{
  color: #409eff!important;
}
</style>
