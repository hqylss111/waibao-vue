import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./pages/login.vue')
    },

    {
      path: '/content',
      name: 'content',
      component: () => import('./pages/content.vue'),
      // redirect: {
      //   name: 'classManagement'
      // },
      children: [{
          path: 'lookClass',
          name: 'lookClass',
          component: () => import('./pages/classRrade/lookClass.vue')
        }, {
          path: 'classManagement',
          name: 'classManagement',
          component: () => import('./pages/content/classManagement.vue')
        },{
        path: 'classGuanli',
        name: 'classGuanli',
        component: () => import('./pages/content/classGuanli.vue')
        },
        {
          path: 'administration',
          name: 'administration',
          component: () => import('./pages/administration/administration.vue')
        },
        {
          path: 'teacher',
          name: 'teacher',
          component: () => import('./pages/administration/teacher.vue')
        },
        {
          path: 'existingSemesterList',
          name: 'existingSemesterList',
          component: () => import('./pages/administration/existingSemesterList.vue')
        },
        {
          path: 'alreadyClass/:years/:semester/:id',
          name: 'alreadyClass',
          component: () => import('./pages/content/alreadyClass.vue')
        },
        {
          path: 'teacherList',
          name: 'teacherList',
          component: () => import('./pages/administration/teacherList.vue')
        },
        {
          path:"studentAdministration",
          name:'studentAdministration',
          component : () => import('./pages/administration/studentAdministration.vue')
        },
        {
          path: 'squad/:id',
          name: 'squad',
          component: () => import('./pages/classRrade/squad.vue')
        },
        {
          path: 'examineClass',
          name: 'examineClass',
          component: () => import('./pages/content/examineClass.vue')
        },
        {
          path:'teacherMeun/:name/:id', //动态老师
          name:'teacherMeun',
          component: ()=> import('./pages/classRrade/teacherMeun.vue')
        }
      ],
    },


  ]
})
