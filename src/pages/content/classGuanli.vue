<template>
    <div class="callList">
        <div class="blockDrop">
            <!--<el-dropdown @command="handleCommand" class="DropdownText">-->
                <!--<span>筛选学期：</span>-->
                <!--<span class="el-dropdown-link">-->
                    <!--<span class="text">{{DropdownText}}</span>-->
                    <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                <!--</span>-->
                <!--<el-dropdown-menu slot="dropdown">-->
                    <!--<el-dropdown-item command="全学期">全学期</el-dropdown-item>-->
                    <!--<el-dropdown-item command="上学期">上学期</el-dropdown-item>-->
                    <!--<el-dropdown-item command="下学期">下学期</el-dropdown-item>-->
                <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <div>
                <span>筛选学期：</span>
                <select :v-model="options[0].value" @change="indexSelect">
                    <option v-for="(item,index) in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></option>
                </select>
            </div>
        </div>
        <el-table
                v-if="tableData.length > 0 ? true : false"
                :data="dataList"
                style="width: 100%"
                :default-sort="{prop: 'years', order: 'descending'}"
        >
            <el-table-column prop="years" label="日期" sortable width="400"></el-table-column>
            <el-table-column label="学期" width="400">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.semester }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                    <!--<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    small
                    layout="prev, pager, next"
                    :total="count"
                    @current-change="onChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import api from "@/api/index.js";
    export default {
        data() {
            return {
                title: "已经有班级",
                tableData: [],
                dataList: [],
                skip: 0,
                count:0,
                DropdownText: "全学期"  ,//下拉菜单显示文字
                options: [{
                    value: '全学期',
                    label: '全学期'
                }, {
                    value: '上学期',
                    label: '上学期'
                }, {
                    value: '下学期',
                    label: '下学期'
                }]
            }
        },
        created() {
            // 1.请求创建的班级列表
            this.isContent();
            // 获取学期列表
            this.obtainClss();
            this.tableData = this.$store.getters.classList;
        },
        methods: {
            //下拉参数 删选学期
            indexSelect(event){
                let e = event.target.value;
                this.DropdownText = e;
                if (e == "上学期") {
                    let skip = this.skip;
                    this.obtainClss(skip, 0);
                }
                if (e == "下学期") {
                    let skip = this.skip;
                    this.obtainClss(skip, 1);
                }
                if (e == "全学期") {
                    let skip = this.skip;
                    this.obtainClss(skip);
                }
            },
            handleCommand(e) {
                console.log(e);
                this.DropdownText = e;
                if (e == "上学期") {
                    let skip = this.skip;
                    this.obtainClss(skip, 0);
                }
                if (e == "下学期") {
                    let skip = this.skip;
                    this.obtainClss(skip, 1);
                }
                if (e == "全学期") {
                    let skip = this.skip;
                    this.obtainClss(skip);
                }
            },
            //
            //监听页数
            onChange(e) {
                this.skip = e - 1;
                this.obtainClss(e - 1);
            },
            //判断有没有学期
            isContent() {
                if (this.tableData.length > 0) {
                    this.title = "";
                } else {
                    this.title = "学期列表";
                }
            },
            //获取学期列表
            obtainClss(skip, semester) {
                //接口
                //limit 一次拿多少  skip 是页面 0开始 所以我要 -1;
                api.acquireSemester({ skip, semester }).then(res => {
                    console.log(res)
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
                    this.dataList = arr;
                    // console.log(this.data);
                });
            },
            //查看学期
            handleEdit(index, row) {
                this.$router.push(`/content/alreadyClass/${row.years}/${row._id}`);
            },
            async handleDelete(index, row) {
                let confim = await this.$confirm("你确认要删除学期？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).catch(e => {
                    //  用户取消了
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
                if (confim == "confirm") {
                    let id = row._id;
                    // //请求我要删除的班级  成功以后再执行一次请求班级的接口 传删除的id给他
                    let data = await api.deleteClss(id);
                    console.log(data.data.code);
                    if (data.data.code == 200) {
                        this.obtainClss();
                    }
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .el-dropdown-link{
        border: 1px solid #ddd;
        padding: 0px 5px;
        font-size: 16px;
        border-radius: 4px;
    }
    .block {
        width: 100%;
        text-align: center;
        margin: 20px 0px;
    }
    .blockDrop {
        width: 80%;
        font-size: 18px;

        text-align: left;
    }
    .blockDrop span {
        color: #000000;
        font-size: 16px;
    }
    .blockDrop select{
        width: 139px;
        height: 26px;
        line-height: 26px;
    }
    .DropdownText{
        float: left;
    }
    .el-dropdown-link{
        display: inline-block;
        text-align: left;
        width: 139px;
        height: 26px;
        line-height: 26px;
    }
    .el-dropdown-link i{
        float: right;
        margin-top: 5px;
    }
    @import url("../../assets/less/existingSemesterList");
</style>
