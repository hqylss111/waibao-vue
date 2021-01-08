import axios from './request.js'
import store from '../store'
// api 就是跨域的地址
const api = {
    //登录接口
    // api ==> 跨域设置的url
    login(account, password) {
        return axios({
            method: 'post',
            url: '/api/admin/login',
            data: {
                account: account,
                password: password
            },
        })
    },
    dmeo(){
        return axios({
            method: 'post',
            url: '/configuration/listForm',
            data: {
                projectId:3
            },
        })
    },
    // 创建班级
    createdClassList(data) {
        return axios({
            method: 'post',
            url: '/api/class/create',
            data: {
                id: data.id, //
                student: data.student, //学生数组
                name: data.name //老师名字
            },
        })
    },
    //心得的心
    Score(score, id) {
        return axios({
            method: "post",
            url: '/api/student/setExperienceScore',
            data: {
                score: score, // 得分
                id: id //学生id
            }
        })
    },
    //班级导入学生
    exClass(classId, id, list) {
        return axios({
            method: "post",
            url: '/api/student/create',
            data: {
                classId: classId,
                semesterId: id,
                student: list
            }
        })
    },
    //班级导入学生
    //创建学期
    setSemester(year, semester) {
        // year 年份 semester 上下学期
        return axios({
            method: 'post',
            url: '/api/semester/create',
            data: {
                years: Number(year),
                semester: Number(semester)
            },
        })
    },
    //设置心得
    isSetExperience(score,id){
        return axios({
            method:"post",
            url:"/api/class/student/setExperienceScore",
            data:{
                score:score,
                id:id
            }
        })
    },
    // 删除学生
    newDeleteStudent(id) {
        return axios({
            method: 'post',
            url: '/api/class/student/delete',
            data: {
                id: id
            }
        })
    },
    // 删除学期
    deleteClss(id) {
        return axios({
            method: 'post',
            url: '/api/semester/delete',
            data: {
                id: id //删除学期的id
            }
        })
    },
    //获取已有学期
    acquireSemester({
        skip = 0,
        semester = undefined
    }) {
        return axios({
            method: 'get',
            url: `/api/semester/list`,
            params: {
                limit: 10,
                skip: skip,
                semester: semester //获取 0上学期 1学期
            }
        })
    },
    //导入老师
    toLeadteacher(teacher) {
        return axios({
            method: 'post',
            url: '/api/teacher/create',
            data: {
                teacher: teacher //导入的老师列表
            }
        })
    },
    // 创建教师
    createTeacher(data) {
        console.log(data)
    },
    //获取创建的所有老师
    acquireTeacher(skip) {
        return axios({
            method: 'get',
            url: `/api/teacher/list`,
            params: {
                limit: 10, //数据
                skip: skip, //页数
            }
        })
    },

    //查询学生管理列表
    getStudentWrapper(skip) {
        return axios({
            url: '/api/admin/student/list',
            method: "get",
            params: {
                limit: 10,
                skip: skip
            }
        })
    },

    // 删除学习管理学生
    deleteStudent(id) {
        return axios({
            method: 'post',
            url: "/api/admin/student/delete",
            data: {
                id: id,//学生ID
            }
        })
    },
    //创建班级
    isCreateClass(id, list) {
        return axios({
            method: "post",
            url: "/api/class/create",
            data: {
                semesterId: id,
                list: list
            }
        })
    },

    //修改班级名称
    amendClassName(obj) {
        return axios({
            method: 'post',
            url: "/api/class/edit",
            data: {
                semesterId: obj.semesterId,
                classId: obj.classId,
                name: obj.name
            }
        })
    },
    // 老师查询班级列表
    isTeacher(id) {
        return axios({
            method: 'get',
            url: "/api/class/list",
            params: {
                semesterId: id
            }
        })
    },
    // 添加管理学生
    isAddStudent(arr) {
        return axios({
            method: "post",
            url: "/api/admin/student/create",
            data: {
                student: arr
            }
        })
    },
    // 新 添加学生
    isAddStudentNew(obj) {
        return axios({
            method: 'post',
            url: "/api/class/student/add",
            data: {
                semesterId: obj.semesterId,
                classId: obj.classId,
                student: obj.student
            }
        })
    },
    //修改学生信息
    isAmendMessage(obj) {
        return axios({
            method: "post",
            url: "/api/admin/student/edit",
            data: {
                id: obj.id,
                name: obj.name,
                department: obj.department,
                profession: obj.profession,
                grade: obj.grade
            }
        })
    },
    //修改老师姓名
    amendTeacherName(id, name) {
        return axios({
            method: 'post',
            url: "/api/teacher/edit",
            data: {
                id: id,
                name: name
            }
        })
    },

    deleteTeacher(id) {
        return axios({
            method: 'post',
            url: '/api/teacher/delete',
            data: {
                id: id //删除的老师id
            }
        })
    },

    getClassdetails(semesterId, classId) {
        return axios({
            method: 'get',
            url: "/api/class/details",
            params: {
                semesterId,
                classId
            }
        })
    },
    // 查询老师所有的班级
    inquireClassList(limit, skip, id, semester) {
        if (id == '') {
            id = null
        }
        return axios({
            method: 'get',
            url: `/api/teacher/getClass`,
            params: {
                limit: limit, //数据
                skip: skip, //页数
                id: id,
                semesterId: semester
            }
        })

    },
    // 获取学生列表
    getStudentList(semesterId, classId) {
        return axios({
            method: 'get',
            url: '/api/class/getStudent',
            params: {
                semesterId: limit,
                classId: skip,
            }
        })
    },
    // 修改学生成绩
    modificationGrade(value, id) {
        return axios({
            method: 'post',
            url: '/api/student/setGradeTotal',
            data: {
                score: Number(value),
                id: id //修改同学成绩的id
            }
        })
    },
    //导出班级学生
    ex(semesterId,classId) {
        return axios({
            method: 'get',
            url: '/api/class/student/exportExcel',
            responseType: 'arraybuffer',
            params: {
                semesterId,
                classId
            }
        })
    },
    //修改学生的登录权限
    modificationJurisdiction(isLogin, id) {
        return axios({
            method: 'post',
            url: '/api/student/isLogin',
            data: {
                isLogin: isLogin, //开关 boolean
                id: id
            }
        })
    },
    //根据学期获取班级列表
    getClassList(skip, id) {
        return axios({
            method: 'get',
            url: '/api/semester/getClass',
            params: {
                limit: 10,
                skip: skip,
                id: id
            }
        })
    },
    // 修改密码
    changePassword(password) {
        return axios({
            method: 'post',
            url: '/api/admin/setPassword',
            data: {
                password: password
            }
        })
    },
    deleteBanji(classId, semesterId) {
        return axios({
            method: 'post',
            url: '/api/class/delete',
            data: {
                classId: classId,
                semesterId: semesterId
            }
        })
    }

}
export default api;