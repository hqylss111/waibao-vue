 <template>
  <div class="techer">
    <div class="title">
      <div class="titleAadd" @click="show">
        <i class="el-icon-plus"></i>
        <span>新增</span>
      </div>
      <div class="titleDelete" @click="daochu">
        <i class="el-icon-plus"></i>
        <span>导入</span>
      </div>
      <div class="titleDelete Mb" @click="xiazai">
        <i class="el-icon-download"></i>
        <span>下载模板</span>
      </div>
    </div>
    <el-table :data="teacherList" style="width: 100%">
      <el-table-column label="序号" width="180" type="index"></el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteInfo(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        class="pageInation"
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="total"
        :current-page="currentPage"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" width="50%" center title="添加老师">
      <div v-if="is">
        <el-form label-width="100px" :model="formLabelAlign">
          <el-form-item label="姓名">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="工号">
            <el-input type="number" v-model="formLabelAlign.jobNum"></el-input>
          </el-form-item>
          <el-form-item class="tianjia">
            <el-button type="primary" @click="onSubmit">创建教师</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="addLs" v-else>
        <el-upload class="upload-demo" action="url" :on-change="handleChange" :auto-upload="false">
          <el-button type="primary">点击导入老师表格</el-button>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "../../api/index";
import Teacher from "./teacher";
export default {
  components: {
    Teacher
  },
  data() {
    return {
      teacherList: [],
      centerDialogVisible: false,
      is: true,
      total: 0,
      data: true,
      skip: 0,
      currentPage: 1,
      formLabelAlign: {
        name: "",
        jobNum: ""
      },
      dataList: ""
    };
  },
  created() {
    this.getTeacher(this.skip);
  },
  methods: {
    xiazai() {
      const a = document.createElement("a");
      a.href = `http://139.9.240.106/admin/xlsx/教师信息模板.xlsx`;
      a.download = "教师老师模板.xlsx";
      // a.target='_self'
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    currentChange(page) {
      this.currentPage = page;
      this.getTeacher(page - 1);
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
            arr.push(item);
          });
          _this.dataList = arr;
          api.toLeadteacher(arr).then(res => {
            console.log(res);
            if (res.data.code === 200) {
              _this.getTeacher();
              _this.$message({
                message: "创建老师成功 密码默认为888888",
                type: "success"
              });
              _this.centerDialogVisible = false;
              _this.currentPage = 1;
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
    onSubmit() {
      let data = [
        {
          姓名: this.formLabelAlign.name,
          工号:this.formLabelAlign.jobNum
        }
      ];
      api.toLeadteacher(data).then(res => {
        if (res.data.code == 200) {
          if (res.data.data.fail !== 0) {
            this.getTeacher();
            this.$message({
              message: "添加老师失败 如果疑问联系管理员"
            });
            this.formLabelAlign.name = "";
            this.formLabelAlign.jobNum = "";
            this.centerDialogVisible = false;
          } else {
            this.getTeacher();
            this.$message({
              message: "创建老师成功 密码默认为888888",
              type: "success"
            });
            this.formLabelAlign.name = "";
            this.formLabelAlign.jobNum = "";
            this.centerDialogVisible = false;
          }
        }
      });
    },
    //调到老师的班级
    show() {
      this.is = true;
      this.centerDialogVisible = true;
    },
    daochu() {
      this.is = false;
      this.centerDialogVisible = true;
    },
    handleEdit(item, data) {
      let id = data._id;
      let _this = this;
      this.$prompt("修改老师姓名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        api.amendTeacherName(id, value).then(res => {
          if (res.status === 200) {
            _this.getTeacher(0);
          }
        });
      });
    },
    //获取所有老师的列表
    getTeacher(skip) {
      api.acquireTeacher(skip).then(res => {
        if (res.data.code == 200) {
          this.total = res.data.data.total;
          this.teacherList = res.data.data.list;
        } else {
          alert("没有获取成功");
        }
      });
    },
    //删除某个老师
    deleteInfo(item, data) {
      api.deleteTeacher(data._id).then(res => {
        if (res.data.code == 200) {
          this.currentPage = 1;
          this.getTeacher(0);
          this.$message({
            message: "删除老师成功",
            type: "success"
          });
        } else {
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.addLs {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pageInation {
  text-align: center;
  margin-top: 10px;
}
.tianjia {
  text-align: center;
}
.upData {
  margin: 20px;
  width: 200px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eee;
  padding: 5px;
  border-radius: 4px;
  font-weight: bolder;
}
.Mb {
  margin-left: 20px;
}
@import url("../../assets/less/techerList");
</style>