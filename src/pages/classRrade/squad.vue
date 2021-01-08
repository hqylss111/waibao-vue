<template>
  <div class="wrapper">
    <div class="squad-title">学生列表</div>
    <div class="seache">
      <div class="seache-btn">
        <div class="sasasa1" @click="isaddition = true">添加学生</div>
        <div class="sasasa1" @click="upData">导入学生</div>
        <div class="sasasa1" @click="importClass">导出学生</div>
        <div class="sasasa1" @click="studentTemplate">下载学生 模板</div>
      
      </div>
      <div></div>
    </div>
    <div class="squad-list">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.$index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学号">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="院系">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="专业">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.profession }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="年级">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.grade }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="实训成绩">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.score.total}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="实训心得">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.experienceScore }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" class="1dadad">
            <el-button
              size="mini"
              class="el ddadada"
              @click="deleteStudent(scope.$index, scope.row)"
            >删除学生</el-button>
            <el-button size="mini" class="da" @click="check(scope.$index, scope.row)">查看/评分</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="导入学生" :visible.sync="dialogVisible" width="20%">
        <div class="demo">
          <el-upload
            class="upload-demo"
            action="url"
            :on-change="handleChange"
            :auto-upload="false"
          >
            <el-button class="utp" size="small" type="primary">导入学生表格</el-button>
          </el-upload>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="添加学生" :visible.sync="isaddition">
      <el-form :model="form">
        <el-form-item label="姓名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.studentNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isaddition = false">取 消</el-button>
        <el-button type="primary" @click="addStudent">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <div class="text">
        <span class="Experience">心得: {{Experience}}</span>
        <el-input
          placeholder="请你输入心得评价得分"
          type="number"
          v-model="text"
          maxlength="3"
          show-word-limit
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addScore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/index";
export default {
  data() {
    return {
      islock: false,
      tableData: [],
      skip: "",
      id: "", //学生id
      listid: "", //列表id，
      index: 0,
      student: "", //搜索的学生
      dialogVisible: false,
      isaddition: false,
      centerDialogVisible: false,
      Experience: "",
      squadId: null,
      text: null,
      dataList: null,
      form: {
        name: "",
        studentNum: ""
      },
      classId: "",
      semesterId: "",
      banjiId: "",
      studentId: ""
    };
  },
  created() {
    let classId = this.$route.query.classId; //班级列表id
    this.semesterId = this.$route.query.semesterId; //学期
    this.banjiId = this.$route.params.id; //班级详情id
    this.getAllClssStudent(this.semesterId, this.banjiId);
  },
  methods: {
    studentTemplate() {
      const a = document.createElement("a");
      a.href = 'http://139.9.240.106/admin/xlsx/学生信息模板 - 教师导入.xlsx';
      a.download = "学生信息模板 - 教师导入.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    getAllClssStudent(semesterId, banjiId) {
      api.getClassdetails(semesterId, banjiId).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.data.student;
          console.log(res.data.data.student);
        }
      });
    },
    check(idnex, row) {
      this.studentId = row._id;
      this.centerDialogVisible = true;
      this.Experience = row.experience;
    },
    // 添加学生
    addStudent() {
      let obj = {
        semesterId: this.semesterId,
        classId: this.banjiId,
        student: [
          {
            account: this.form.studentNum,
            name: this.form.name
          }
        ]
      };
      api
        .isAddStudentNew(obj)
        .then(res => {
          if (res.status === 200) {
             this.$message({
                  message: `添加学生  ${res.data.data.success}条  --   失败  ${res.data.data.fail} 条  --  导入总  ${res.data.data.total}条  如有疑问请联系管理员  默认学生密码888888`,
                  type: "warning",
                  duration: 7000
                });
            this.isaddition = false;
            this.form.name = "";
            this.form.studentNum = "";
            this.getAllClssStudent(this.semesterId, this.banjiId);
          }
        })
        .catch(err => {
          this.$message({
            message: "管理员未导入该学生"
          });
          this.isaddition = false;
        });
    },
    importClass() {
      const a = document.createElement("a");
      a.href = `http://139.9.240.106/api/class/student/exportExcel?semesterId=${this.semesterId}&classId=${this.banjiId}`;
      a.download = "学生列表菜单.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    ImportStudents() {
      api.exClass(this.listid, this.classId, this.dataList).then(res => {
        if (res.data.code == 200) {
          this.getData(this.listid);
          this.dialogVisible = false;
        }
      });
    },
    upData() {
      this.dialogVisible = true;
    },
    showInput() {
      this.islock = !this.islock;
    },

    addScore() {
      let defen = Number(this.text);
      let id = this.studentId;
      api.isSetExperience(defen, id).then(res => {
        if (res.status === 200) {
          this.$message({
            type: "success",
            message: "评价得分成功"
          });
          this.getAllClssStudent(this.semesterId, this.banjiId);
          this.centerDialogVisible = false;
        } else {
          this.$message({
            message: "评价失败"
          });
          this.centerDialogVisible = false;
        }
      });
    },
    handleChange(file, fileList) {
      this.fileTemp = file.raw;
      if (this.fileTemp) {
        if (
          `application / vnd.openxmlformats -
            officedocument.spreadsheetml.sheet` ||
          this.fileTemp.type == "application/vnd.ms-excel"
        ) {
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
          let list = [];
          let newArr = arr.map(it => {
            let obj = {};
            for (const key in it) {
              if (key === "学号") {
                obj.account = String(it[key]);
              }
              if (key === "姓名") {
                obj.name = it[key];
              }
            }
            list.push(obj);
          });
          let obj = {
            semesterId: _this.semesterId,
            classId: _this.banjiId,
            student: list
          };
          api
            .isAddStudentNew(obj)
            .then(res => {
              if (res.status === 200) {
                _this.getAllClssStudent(_this.semesterId, _this.banjiId);
                _this.dialogVisible = false;
                _this.$message({
                  message: `导入成功  ${res.data.data.success}条  --   失败  ${res.data.data.fail} 条  --  导入总  ${res.data.data.total}条  如有疑问请联系管理员  默认学生密码888888`,
                  type: "warning",
                  duration: 7000
                });
              }
            })
            .catch(err => {
              _this.$message({
                  message: `导入失败  如有疑问请联系管理员  `,
                  type: "warning",
                  duration: 7000
                });
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
    deleteStudent(index, row) {
      let id = row._id;
      let obj = {
        semesterId: this.semesterId, //学期ID
        classId: this.banjiId, //班级ID
        id: id //学生ID
      };
      api.deleteStudent(obj).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: "删除学生成功",
            type: "warning"
          });
          this.getAllClssStudent(this.semesterId, this.banjiId);
        }
      });
    },
    //修改学生权限
    authority(index, row) {
      let i = index;
      let id = row._id;
      let isLogin = row.isLogin;
      console.log(i, id, isLogin);
      api.modificationJurisdiction(isLogin, id).then(res => {
        if (res.data.code == 200) {
          this.getData(this.listid);
        }
      });
    },
    //修改学生成绩
    async modification(index, row) {
      try {
        let value = await this.$prompt("输入修改学生成绩", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        });
        let id = row._id;
        let content = value.value;
        console.log(content);
        //修改成功   修改成功在获取一次 获取学生列表
        api.modificationGrade(content, id).then(res => {
          if (res.data.code == 200) {
            // 成功了在获取一次学生列表
            this.$message({
              type: "success",
              message: "修改成功"
            });

            this.getData(this.listid);
          } else {
            console.log("没有修改成功");
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    //获取学生列表
    getData(id) {
      api.getStudentList({ id }).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data[0].class.student;
          console.log(this.tableData, 361);
        }
      });
    },
    onChange(e) {
      this.skip = e - 1;
      console.log(this.skip);
    }
  }
};
</script>
<style lang="less" scoped>
.seache {
  display: flex;
  width: 100%;
  margin: 0px 5px;
  flex-direction: row;
  justify-content: flex-end;
}
.seache-btn {
  display: flex;
  flex-direction: row;
  margin-right: 20px;
}

.sasasa {
  padding: 10px;
  border-radius: 4px;
  background-color: rgb(67, 142, 815);
  color: #ffffff;
  margin-bottom: 15px;
}
.delete {
  padding: 10px;
  border-radius: 4px;
  background-color: #f40;
  color: #ffffff;
  margin-bottom: 15px;
  margin-left: 5px;
}
.el {
  color: #f40;
}
.sasasa1 {
  margin-left: 5px;
  padding: 10px;
  border-radius: 4px;
  background-color: rgb(67, 142, 815);
  color: #ffffff;
  margin-bottom: 15px;
}
.demo {
  display: flex;
  justify-content: center;
}
.ddadada {
  margin-left: 8px;
  margin-bottom: 10px;
}
.da {
  margin-top: 5px;
}
.text {
  text-align: center;
}
.Experience {
  margin-bottom: 10px;
  display: inline-block;
}
@import url("../../assets/less/squad.less");
</style>
