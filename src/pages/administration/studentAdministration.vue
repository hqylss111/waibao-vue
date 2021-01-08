<template>
  <div class="studentList">
    <div class="studentTilte">
      <div class="newly" @click="addhandleEdit">
        <i class="el-icon-plus"></i>
        <span>新增</span>
      </div>
      <div class="newly class" @click="centerDialogVisible = true">
        <i class="el-icon-upload2"></i>
        <span>导入</span>
      </div>
      <div class="newly" @click="template">
        <i class="el-icon-download"></i>
        <span>下载学生模板</span>
      </div>
    </div>
    <div>
      <el-table :data="list" style="width: 100%">
        <el-table-column label="序号" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.$index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学号" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="院系" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.profession }}</span>
          </template>
        </el-table-column>
        <el-table-column label="专业" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年级" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.grade }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          class="page"
          layout="prev, pager, next"
          :total="count"
          :current-page="currentPage"
          @current-change="onchange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="添加学生" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="学生姓名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.studentNum" type="number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="院系">
          <el-input v-model="form.department" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.specialty" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.class" type="number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClass">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改学生" :visible.sync="isAmend">
      <el-form :model="amendStuent">
        <el-form-item label="学生姓名">
          <el-input v-model="amendStuent.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="院系">
          <el-input v-model="amendStuent.department" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="amendStuent.specialty" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="amendStuent.class" type="number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAmend = false">取 消</el-button>
        <el-button type="primary" @click="amend">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入学生" :visible.sync="centerDialogVisible" width="30%" center>
      <div>
        <el-upload
          class="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          multiple
          :limit="1"
        >
          <el-button size="small" type="primary">导入学生</el-button>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/index.js";
export default {
  data() {
    return {
      centerDialogVisible: false,
      list: [],
      count: 0,
      dataList: [],
      currentPage: 1,
      form: {
        name: "",
        studentNum: "",
        department: "",
        specialty: "",
        class: ""
      },
      amendStuent: {
        name: "",
        department: "",
        specialty: "",
        class: ""
      },
      dialogFormVisible: false,
      isAmend: false,
      amendId: null
    };
  },
  created() {
    this.getStudent(0);
  },
  methods: {
    template() {
      const a = document.createElement("a");
      a.href = `http://139.9.240.106/admin/xlsx/学生信息模板- 管理员导入.xlsx`;
      a.download = "学生信息模板- 管理员导入.xlsx"; // a.target='_self'
      document.body.appendChild(a);
      a.click();
      a.remove();
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
          console.log(wb);
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
          //此处可对数据进行处理
          let arr = [];
          outdata.filter((item, index) => {
            arr.push(item);
          });
          _this.dataList = arr;
          api.isAddStudent(arr).then(res => {
            console.log(res, 220);
            if (res.status === 200) {
              console.log(res, 233333);
              _this.$message({
                message: "导入学生成功 默认密码为 888888",
                type: "success"
              });
              _this.getStudent(0);
              _this.centerDialogVisible = false;
            } else {
              _this.$message({
                message: "未导入学生成功"
              });
              _this.centerDialogVisible = false;
            }
          });
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
    onchange(page) {
      this.currentPage = Number(page);
      this.getStudent(page - 1);
    },
    handleEdit(index, data) {
      this.isAmend = true;
      this.amendId = data._id;
    },
    amend() {
      let obj = {
        id: this.amendId,
        name: this.amendStuent.name,
        department: this.amendStuent.department,
        profession: this.amendStuent.specialty,
        grade: Number(this.amendStuent.class)
      };
      api.isAmendMessage(obj).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "修改学生成功",
            type: "success"
          });
          this.amendId = null;
          this.amendStuent.name = "";
          this.amendStuent.department = "";
          this.amendStuent.specialty = "";
          this.amendStuent.class = "";
          this.getStudent(0);
          this.currentPage = 1;
          this.isAmend = false;
        }
      });
    },
    addClass() {
      let student = [];
      let obj = {
        姓名: this.form.name, //姓名
        院系: this.form.department, //账号
        年级: Number(this.form.class), //年级  数字类型
        专业: this.form.specialty, //专业
        学号: this.form.studentNum //学号
      };
      student.push(obj);

      api.isAddStudent(student).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "添加学生成功 默认密码为 8888888",
            type: "success"
          });
          this.getStudent(0);
          this.dialogFormVisible = false;
          this.form.name = "";
          this.form.department = "";
          this.form.class = "";
          this.form.specialty = "";
          this.form.studentNum = "";
        }
      });
    },
    addhandleEdit(index, data) {
      this.dialogFormVisible = true;
    },
    handleDelete(index, data) {
      let id = data._id;
      api.deleteStudent(id).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: "删除学生成功"
          });
          this.getStudent(0);
          this.currentPage = 1;
        }
      });
    },
    getStudent(skip) {
      api.getStudentWrapper(skip).then(result => {
        if (result.status === 200) {
          this.list = result.data.data.list;
          this.count = result.data.data.total;
          console.log(this.list);
        }
      });
    }
  }
};
</script>
<style scoped>
.studentTilte {
  display: flex;
  width: 90%;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.newly {
  border: 1px solid;
  padding: 8px 18px;
  display: flex;
  width: 120px;
  justify-content: space-between;
  background: rgb(51, 153, 255);
  border-radius: 4px;
  color: #fff;
  margin-right: 10px;
  align-content: center;
}
.class {
  background: rgb(255, 153, 51);
}
.page {
  text-align: center;
  margin-top: 10px;
}
.upload {
  text-align: center;
}
</style>
