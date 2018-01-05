import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Management from '@/components/Management'
import User from '@/components/User'
import Family from '@/components/Family'
import Bill from '@/components/Bill'
import Tips from '@/components/Tips'
import TipsDetail from '@/components/TipsDetail'
import Config from '@/components/Config'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/manage',
      name: 'Management',
      component: Management,
      children: [
        {
          path: 'user',
          name: 'User',
          component: User
        },
        {
          path: 'family',
          name: 'Family',
          component: Family
        },
        {
          path: 'bill',
          name: 'Bill',
          component: Bill
        },
        {
          path: 'tips',
          name: 'Tips',
          component: Tips
        },
        {
          path: 'detail',
          name: 'TipsDetail',
          component: TipsDetail
        },
        {
          path: 'config',
          name: 'Config',
          component: Config
        }
      ]
    }
  ]
})
