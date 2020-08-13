import Vue from 'vue'
import Router from 'vue-router'
import api from '../api'

Vue.use(Router)

let router = new Router({
  routes: [{
    path: '*',
    redirect: 'login' //无效路由匹配 登录
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  }, {
    path: '/',
    component: () => import('../views/Main.vue'),
    //验证登录
    // async beforeEnter(to, fom, next) {
    //     if (sessionStorage.getItem('auth') == 1) {
    //         next();
    //     } else {
    //         // let res = await api.verify({});
    //         // if (res.data.valid == 1) {
    //         //     sessionStorage.setItem('auth', 1);
    //         //     next();
    //         // } else {
    //         //     next('login');
    //         // }
    //         next('login')
    //     }
    // },
    children: [{
      path: '',
      redirect: '/authentication'
    }, {
      name: 'authentication',
      path: 'authentication',
      component: () => import('../views/work/Authentication.vue')
    }, {
      name: 'watchTaskVerify',
      path: 'watchTaskVerify',
      component: () => import('../views/work/WatchTaskVerify.vue')
    }, {
      name: 'feedbackInfoDeal',
      path: 'feedbackInfoDeal',
      component: () => import('../views/work/FeedbackInfoDeal.vue')
    }, {
      name: 'appealTaskDeal',
      path: 'appealTaskDeal',
      component: () => import('../views/work/AppealTaskDeal.vue')
    }, {
      name: 'taskManagement',
      path: 'taskManagement',
      component: () => import('../views/platform/TaskManagement.vue')
    }, {
      name: 'notifyManagement',
      path: 'notifyManagement',
      component: () => import('../views/platform/NotifyManagement.vue')
    }, {
      name: 'startPageSet',
      path: 'startPageSet',
      component: () => import('../views/appSet/StartPageSet.vue')
    }, {
      name: 'categorySet',
      path: 'categorySet',
      component: () => import('../views/appSet/CategorySet.vue')
    }, {
      name: 'userHelpSet',
      path: 'userHelpSet',
      component: () => import('../views/appSet/UserHelpSet.vue')
    }, {
      name: 'authManagement',
      path: 'authManagement',
      component: () => import('../views/account/AuthManagement.vue')
    }, {
      name: 'roleManagement',
      path: 'roleManagement',
      component: () => import('../views/account/RoleManagement.vue')
    }, {
      name: 'checkTasks',
      path: 'checkTasks',
      component: () => import('../views/platform/CheckTasks.vue')
    }, {
      name: 'taskAccount',
      path: 'taskAccount',
      component: () => import('../views/platform/Account.vue')
    }, {
      name: 'withdraw',
      path: 'withdraw',
      component: () => import('../views/platform/Withdraw.vue')
    }, {
      name: 'nearTask',
      path: 'nearTask',
      component: () => import('../views/platform/NearTask.vue')
    }, {
      name: 'accountManage',
      path: 'accountManage',
      component: () => import('../views/account/AccountManage.vue')
    }, {
      name: 'reportTaskDeal',
      path: 'reportTaskDeal',
      component: () => import('../views/work/ReportTaskDeal.vue')
    }]
  }
  ]
})
//
let auth = sessionStorage.getItem('auth')
//拦截路由，判断有没有auth，没有就再次verify
router.beforeEach(async (to, from, next) => {
  if (to.name != 'login' && !localStorage.getItem('token')) {
    router.push({ name: 'login' })
  } else {
    next()
  }
})

export default router;