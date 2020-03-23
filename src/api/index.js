import axios from './request.js'
import store from '../store'
// api 就是跨域的地址
const api = {
    //登录接口
    // api ==> 跨域设置的url
    login(account, password) {
        return axios({
            method: 'post',
            url: '/api/user/login',
            data: {
                account: account,
                password: password
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
                limit: 10000, //数据
                skip: skip, //页数
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
    // 查询老师所有的班级
    inquireClassList(limit, skip, id, semester) {
        console.log(skip,semester)
   
        if (id == '' ) {
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
    getStudentList({
        limit = 10,
        skip = 0,
        id
    }) {
        return axios({
            method: 'get',
            url: '/api/class/getStudent',
            params: {
                limit: limit,
                skip: skip,
                id: id
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
    exportStudent(id) {
        return axios({
            method: 'get',
            url: '/api/student/exportExcel',
            responseType: 'arraybuffer',
            params: {
                id: id //导出班级的id
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
            url: '/api/user/setPassword',
            data: {
                password: password
            }
        })
    }

}
export default api;