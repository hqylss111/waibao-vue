<template>
  <div class="createTeacher">
    <div class="title">创建教师</div>
    <div class="create" v-if="data">
      <input
        type="text"
        v-model="name"
        placeholder="请你输入教师名字"
        style="margin-top:10px;width:230px;margin-left:1px;"
      />
      <input
        type="text"
        v-model="jobNum"
        placeholder="输入老师工号"
        style="margin-top:10px;width:230px;margin-left:1px;"
      />
      <input
        type="text"
        v-model="psd"
        placeholder="输入年级"
        style="margin-top:10px;width:230px;margin-left:1px;"
      />
      <input
        type="text"
        v-model="classGrade"
        placeholder="输入班级名称"
        style="margin-top:10px;width:230px;margin-left:1px;"
      />
      <el-button
        type="primary"
        @click="handIn"
        style="margin-top:10px;width:250px;margin-left:1px;"
      >创建教师</el-button>
      <el-button
        type="primary"
        @click="cut"
        style="margin-top:10px;width:250px;margin-left:1px;background-color:blue"
      >切换导入老师</el-button>
    </div>
    <div class="create" v-else>
      <el-upload
        class="upload-demo"
        action="url"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :limit="limitUpload"
        :auto-upload="false"
      >
        <el-button size="small" type="primary">点击导入老师表格</el-button>
      </el-upload>
      <el-button
        type="primary"
        class="chuangjian"
        @click="toLeadTeacher"
      >创建老师</el-button>
      <el-button
        type="primary"
        @click="cut"
        style="margin-top:10px;width:250px;margin-left:1px;background-color:blue"
      >切换单个注册</el-button>
    </div>
  </div>
</template>

<script>
import api from "../../api/index";

export default {
  data() {
    return {
      name: "",
      jobNum: "",
      psd: "",
      // is: true,
      dataList: [],
      limitUpload: 1,
      classGrade: ""
    };
  },
  props: ['data'],
  create(){
    console.log(this.props,9999)
  },
  methods: {
    //超出上传范围
    handleExceed(file) {
      this.$message({
        type: "warning",
        message: "超出最大上传文件数量的限制！"
      });
      return;
    },
    //移除上传
    handleRemove() {
      this.fileTemp = null;
    },
    //切换创建
    cut() {
      this.is = !this.is;
    },
    //文件改变的时候触发
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
          console.log(wb);
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

          //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
          //此处可对数据进行处理
          let arr = [];
          outdata.filter((item, index) => {
            console.log(item);
            if (item["账号类型"] == 2) {
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
    //导入老师
    toLeadTeacher() {
      if (this.dataList.length > 0) {
        // fail 就是已经重复的老师 提示他
        api.toLeadteacher(this.dataList).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: `导入成功,需要删除上个导入在重新导入`,
              type: "warning"
            });
          } else {
            this.$message({
              message: "没有导入成功,删除重新在导入",
              type: "warning"
            });
          }
        });
      } else {
        this.$message({
          message: "没有导入成功,删除重新在导入",
          type: "warning"
        });
      }
    },
    handIn() {
      //  [{账号类型: 2, 姓名: "张三", 性别: 1, 账号: "S001", 年级: 2018, 班级名称: "计算机", 分数: 100}]

      if (
        this.name == "" ||
        this.jobNum == "" ||
        this.psd == "" ||
        this.classGrade == ""
      ) {
        this.$message({
          message: "检查下信息,有信息没有填写",
          type: "warning"
        });
        return;
      }
      let data = [
        {
          账号类型: 2,
          姓名: this.name,
          性别: "0",
          账号: this.jobNum,
          年级: Number(this.psd),
          班级名称: this.classGrade,
          分数: 100
        }
      ];
      api.toLeadteacher(data).then(res => {
        if (res.data.code == 200) {
          if (res.data.data.fail != 0) {
            this.$message({
              message: "已经有该老师了没有添加成功",
              type: "warning"
            });
          } else {
            this.$message({
              message: "成功添加老师",
              type: "success"
            });
          }
        } else {
          this.$message({
            message: "没有添加成功,可能参数不对",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-button--small {
  width: 250px;
}
.chuangjian{
  text-align: center
}
@import url("../../assets/less/teacher");
</style>