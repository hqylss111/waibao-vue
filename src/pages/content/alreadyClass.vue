<template>
  <div class="wrapper">
    <el-breadcrumb separator="<<">
      <el-breadcrumb-item :to="{ path: '/content/classGuanli' }">班级管理</el-breadcrumb-item>
      <el-breadcrumb-item class="mcolor">班级列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="upLoad" v-show="isShow === 2">
      <el-button type="primary" @click="addClass">添加班级</el-button>
    </div>
    <div class="hintText" v-if="classList.length === 0">暂无班级</div>
    <div v-else>
      <div class="title">班级列表</div>
      <div class="subTitle">
        <span>{{years}}年班级</span> &nbsp;
        <span>{{semester}}</span>
      </div>
      <div class="content-list">
        <div class="list-title">
          <el-row class="listRow">
            <el-col :span="8">序号</el-col>
            <el-col :span="8">班级名称</el-col>
            <el-col :span="8" v-if="isShow === 1">教师</el-col>
            <el-col :span="8" v-else>操作</el-col>
          </el-row>
        </div>
        <el-row class="listRow cotentItem" v-for="(item,index) in classList" :key="index">
          <el-col :span="8">{{index}}</el-col>
          <el-col :span="8">{{item.name}}</el-col>
          <el-col :span="8" v-if="isShow === 1">{{item.tearchName}}</el-col>
          <el-col :span="8" v-else>
            <div>
              <span class="operation ck" @click="lookOverClass(item)">查看</span>
              <span class="operation bj" @click="redactClass(item)">编辑</span>
              <span class="operation de" @click="deleteclass(item)">删除</span>
            </div>
          </el-col>
        </el-row>
        <div class="pagintation">
          <el-pagination
            layout="prev, pager, next"
            :total="count"
            @current-change="handleSizeChange"
            @size-change="size"
          >`</el-pagination>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
          <div class="demo">
            <input type="text" placeholder="输入班级名称" v-model="text" class="inp" />
            <el-upload
              class="upload-demo"
              action="url"
              :on-change="handleChange"
              :auto-upload="false"
            >
              <el-button class="utp" size="small" type="primary">导入学生表格</el-button>
            </el-upload>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="ImportStudents">确 定</el-button>
          </span>
        </el-dialog>
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
      count: 0,
      dialogVisible: false,
      text: "",
      isShow: localStorage.getItem("info") === "管理员" ? 1 : 2, // 管理员 1
      semester: null
    };
  },
  created() {
    this.semester = this.$route.params.semester === "0" ? "上学期" : "下学期";
    this.id = this.$route.params.id;
    this.years = this.$route.params.years;
    this.getClssList(0, this.id);
  },
  methods: {
    redactClass(data) {
      this.$prompt("请输入班级名称", "修改", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        console.log(value, 96);
        let obj = {
          semesterId: this.id,
          classId: data._id,
          name: value
        };
        console.log(obj);
        api.amendClassName(obj).then(res => {
          console.log(res, 11111);
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: "修改班级成功"
            });
            this.getClssList(0, this.id);
          }
        });
      });
    },
    getClssList(skip, id) {
      if (this.isShow === 1) {
        api.getClassList(skip, id).then(res => {
          let dataList = [];
          if (res.data.code == 200) {
            this.count = res.data.data[0].total;
            res.data.data[0].class.forEach(item => {
              console.log(item,122)
              let data = {
                name: item.name,
                id: item._id,
                tearchName:item.teacher.name
              };
              dataList.push(data);
            });
          }
          this.classList = dataList;
        });
      } else {
        api.isTeacher(this.id).then(res => {
          console.log(res, 110);
          if (res.status === 200) {
            if (res.data.data.length > 0) {
              let list = res.data.data[0].class;
              this.classList = list;
            }
          } else {
            alert("查询班级未成功");
          }
        });
      }
    },
    ImportStudents(data) {
      api
        .createdClassList({
          id: this.$route.params.id,
          name: this.text,
          student: this.dataList
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "导入班级成功"
            });
            this.dialogVisible = false;
            this.requestClass(1, this.$route.params.id);
          }
        });
    },
    handleChange(file, fileList) {
      this.fileTemp = file.raw;
      if (this.fileTemp) {
        // 判断是不是 表格
        if (
          `application / vnd.openxmlformats -
            officedocument.spreadsheetml.sheet` ||
          this.fileTemp.type == "application/vnd.ms-excel"
        ) {
          // 解析表格
          this.importfxx(this.fileTemp);
        } else {
          this.$message({
            type: "warning",
            message: "附件格式错误，请删除后重新上传！"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请上传附件！"
        });
      }
    },
    //解析表格
    importfxx(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          //如果没有在main.js中引入，则此处需要引入，用于解析excel
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
          //此处可对数据进行处理
          let arr = [];
          outdata.filter((item, index) => {
            console.log(item);
            arr.push(item);
            if (item["账号类型"] == 2) {
              console.log(item);
              arr.push(item);
            }
          });

          _this.dataList = arr;
          setTimeout(() => {
            _this.$message({
              message: "上传成功,可以导入老师了",
              type: "success"
            });
          }, 1000);
          return arr;
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    ImportClassList(){
        
    },
    importClass() {
      console.log(1111111);
    },
    handleExceed() {
      console.log("11111111");
    },
    handleSizeChange(size) {
      this.getClssList(size - 1, this.id);
    },
    size() {
      console.log("size");
    },

    importClass() {
      this.dialogVisible = true;
    },
    addClass() {
      this.$prompt("请您输入班级名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        console.log(this.$route.params.id, 239);
        let id = this.$route.params.id;
        let name = value;
        let list = [name];
        api.isCreateClass(id, list).then(res => {
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: "添加班级成功"
            });
            this.getClssList(0, this.id);
          } else {
            this.$message({
              message: "没有添加班级成功"
            });
          }
        });
      });
    },
    deleteclass(id) {
      let classId = this.$route.params.id;
      console.log(id._id,'----');
      api.deleteBanji(id._id,classId).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "删除班级成功"
          });
          this.getClssList(0,this.id)
        }else{
          this.$message({
            message:"未删除班级成功"
          })
        }
      });
    },
    //校长获取列表
    // principalList(skip, semester) {
    // },
    // 查看班级
    lookOverClass(data) {
      let id = data._id
      console.log(this.$route,314);
      let semesterId = this.$route.params.id;
      this.$router.push({
        path: `/content/squad/${id}?semesterId=${semesterId}`
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

            arr.forEach(item => {
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
.mcolor {
  color: rgb(51, 153, 255) !important;
}
.without {
  text-align: center;
  margin-top: 30px;
}
.upLoad {
  text-align: right;
  margin-top: 10px;
  margin-right: 20px;
}
.pagintation {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.inp {
  margin-bottom: 10px;
  width: 80%;
  border-radius: 4px;
  outline: none;
  height: 30px;
  outline: none;
  /* border: none; */
  border: 1px solid;
  padding-left: 10px;
}
.utp {
  width: 200px;
}
.diauP {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.operation {
  border: 1px solid;
  padding: 5px 24px;
  margin-right: 10px;
  font-size: 12px;
  cursor: pointer;
}
.listRow {
  width: 100%;
}
.listRow > div {
  text-align: center;
}

.cotentItem {
  margin-bottom: 5px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  height: 40px;
  line-height: 40px;
}

.bj {
  background-color: rgb(51, 125, 255);
  color: #fff;
  border-radius: 2px;
}
.de {
  background-color: rgb(255, 0, 0);
  color: #fff;
  border-radius: 2px;
}
.hintText {
  text-align: center;
  font-weight: bolder;
  margin-top: 10px;
}
</style>
