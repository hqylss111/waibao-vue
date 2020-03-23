import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: '1',
    "X-Token": '',
    tableData: [{
        id: "11111",
        date: "2016",
        name: "上学期",

      },
      {
        id: "222",
        date: "2017",
        name: "下学期",
      }
    ],
    teacherList: [],
    classGrade: [],
    identifying: '', //身份唯一标识
    status: null //1是校长 2是老师
  },
  getters: {
    classList(state) {
      return state.tableData;
    },
    returnUnique(state) {
      return {
        identifying: state.identifying
      }
    }
  },
  mutations: {
    //创建班级
    createClassGrade(state, data) {
      state.classGrade.push(data)
    },
    // 拿到值 往 state  每次 请求要带上  还有缓存中存
    setTokenData(state, data) {
      //  设置token缓存
      localStorage.setItem('unknown', data.token);
      state['X-Token'] = data.token;
      state.identifying = data.identifying;
      if (data.identifying == '教师') {
        state.status = 2; //教师
      }
      if (data.identifying == '校长') {
        state.status = 1;
      }
    },
    getLocalStorge(state) {
      return localStorage.getItem('unknown');
    },
    addTeacherList(state, data) {
      state.teacherList.push(data)
    }

  },
  actions: {
    /**
     * 登录
     */
    verdictTokenData({
      commit
    }, data) {
      this.commit('setTokenData', data);
    },
    getToken({
      commit
    }) {
      let token = commit('getLocalStorge');
      return token;
    },
    // 添加老师
    addTeacher({
      commit
    }, data) {
      this.commit('addTeacherList', data)
    }



  }
})