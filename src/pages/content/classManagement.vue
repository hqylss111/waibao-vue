<template>
  <div class="wrapper">
    <div class="createClss">
      <!-- 创建班级 -->
      <div class="create" v-if="create">
        <div class="create-title">创建班级</div>
        <input type="text" v-model="name" placeholder="输入班级名称" />
        <el-upload
          class="upload-demo"
          action="url"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :limit="limitUpload"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">点击上传该班级学生</el-button>
        </el-upload>
        <button class="btn" @click="createdClass">创建班级</button>
      </div>
    </div>

    <!-- 如果是老师就不给显示了 -->
    <div class="botton-list" v-if="create">
      <div class="botton-title">已经有学期</div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'years', order: 'descending'}"
      >
        <el-table-column label="时间" width="250" prop="years" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10p序号">{{ scope.row.years }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学期" width="250">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.semester }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看班级</el-button>
            <el-button size="mini" @click="CreateClass(scope.$index, scope.row)">创建班级</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination layout="prev, pager, next" :total="count" @current-change="onchange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api/index.js";
export default {
  data() {
    return {
      name: "",
      tableData: [],
      year: "",
      fileTemp: "",
      name: "",
      upAndText: "",
      limitUpload: 1,
      dataList: [],
      info: null,
      create: false,
      count: 1, //总条数
      id: "",
      skip: 0, //用户创建班级判断
      title: "已经有班级"
    };
  },
  created() {
    //取已经创建好的学期、
    this.getSemesterList(this.skip);
  },
  mounted() {
    this.info = this.$store.state.status;
  },
  computed: {
    url() {
      return `https://www.jianshu.com/p/84b727a4b58a?year=${this.year}`;
    }
  },
  methods: {
    //分页
    onchange(e) {
      let skip = e - 1;
      this.getSemesterList(skip);
    },
    //创建班级
    CreateClass(index, row) {
      this.create = true;
      this.id = row._id;
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
            Number(item["年级"]);
            if (item["账号类型"] == 1) {
              console.log(typeof item["年级"]);
              arr.push(item);
            }
          });
          _this.dataList = arr;
          setTimeout(() => {
            alert("上传成功可以创建班级了");
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
    handleExceed(file) {
      this.$message({
        type: "warning",
        message: "超出最大上传文件数量的限制！"
      });
      return;
    },
    handleRemove() {
      this.fileTemp = null;
    },
    /**
     * 获得已经创建好的学期
     */
    getSemesterList(index) {
      let skip = index,
        semester = undefined;
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
        this.tableData = arr;
      });
    },
    /**
     * 创建班级
     */
    createdClass() {
      if (this.name == "") {
        this.$message({
          message: "有信息没有填写,请你填写好提交",
          type: "warning"
        });
        return;
      }

      // 发送 数据给后端
      let data = {
        id: this.id,
        student: this.dataList,
        name: this.name
      };
      // 发送给后端 参数按照data里面的传
      // 创建班级
      api.createdClassList(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: "添加成功,需要关闭上一个删除的文件在次上传",
            type: "success"
          });
        }
      });
      // this.$store.commit("createClassGrade", data);
    },
    handleEdit(index, row) {
      //查看班级

      this.$router.push({
        name: "alreadyClass",
        params: {
          years: row.years,
          id: row._id
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper{
  width: 100%;
  height: 80vh;
  font-size: 20px;
  text-align: center;
}
.create{
  width: 400px;
  border: 1px solid #ddd;
  padding: 15px;
  margin: 20px auto;
}
.create input{
  width: 200px;
  box-sizing: border-box;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin: 5px 0px;
}
.create button{
  width: 200px;
  border: none;
  outline: none;
  height: 40px;
  font-size: 14px;
  border-radius: 4px;
  margin: 5px 0px;
  color: #fff;
  border-color: #409EFF;
  background-color: #409EFF;

}
</style>
