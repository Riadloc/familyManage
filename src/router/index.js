import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Management from '@/components/Management'
import User from '@/components/User'
import Family from '@/components/Family'
import Bill from '@/components/Bill'

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
        }
      ]
    }
  ]
})
