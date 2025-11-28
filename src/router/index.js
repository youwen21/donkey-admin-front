import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import AdminLayout from '../views/layout/AdminLayout.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import UserList from '../views/admin/user/UserList.vue'
import UserAdd from '../views/admin/user/UserAdd.vue'
import UserEdit from '../views/admin/user/UserEdit.vue'
import OrgList from '../views/admin/org/OrgList.vue'
import OrgAdd from '../views/admin/org/OrgAdd.vue'
import OrgEdit from '../views/admin/org/OrgEdit.vue'
import RoleList from '../views/admin/role/RoleList.vue'
import RoleAdd from '../views/admin/role/RoleAdd.vue'
import RoleEdit from '../views/admin/role/RoleEdit.vue'
import SubsystemList from '../views/admin/subsystem/SubsystemList.vue'
import SubsystemAdd from '../views/admin/subsystem/SubsystemAdd.vue'
import SubsystemEdit from '../views/admin/subsystem/SubsystemEdit.vue'
import MenuList from '../views/admin/menu/MenuList.vue'
import MenuAdd from '../views/admin/menu/MenuAdd.vue'
import MenuEdit from '../views/admin/menu/MenuEdit.vue'
import OperationList from '../views/admin/operation/OperationList.vue'
import OperationAdd from '../views/admin/operation/OperationAdd.vue'
import OperationEdit from '../views/admin/operation/OperationEdit.vue'
import UserPermission from '../views/admin/permission/UserPermission.vue'
import ApprovalList from '../views/admin/approval/ApprovalList.vue'
import NotFoundView from '../views/admin/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      beforeEnter: (to, from) => {
        // console.log("admin beforeEnter")
        // console.log('admin beforeEnter to', to)
        // console.log('admin beforeEnter from', from)
      },
      meta: { requiresAdmin: true },

      // beforeUpdate: (to, from) => { // 只能在组件内定义
      //   console.log("admin beforeUpdate")
      //   console.log('admin beforeUpdate to', to)
      //   console.log('admin beforeUpdate from', from)
      // },
      children: [
        {
          path: '',
          redirect: { name: 'admin.dashboard' },
        },
        {
          path: 'dashboard',
          name: 'admin.dashboard',
          meta: { requiresAdmin: true },
          beforeEnter: (to, from) => {
            console.log("admin dashboard beforeEnter")
            console.log('admin dashboard to', to)
            console.log('admin dashboard from', from)
          },
          component: () => import('../views/admin/DashboardView.vue'),
        },
        // {
        //   path: 'users',
        //   name: 'admin.users',
        //   meta: { requiresAdmin: true },
        //   beforeEnter: (to, from) => {
        //     console.log("admin user beforeEnter")
        //     console.log('admin user to', to)
        //     console.log('admin user from', from)
        //     // permission.setPermissions({
        //     //   "isAdmin": false,
        //     //   "routesActions": [
        //     //     {
        //     //       "path": "/admin/demo/2222222",
        //     //       "actions": [
        //     //         "add",
        //     //         "edit",
        //     //         "del",
        //     //       ],
        //     //     },
        //     //   ],
        //     // })
        //   },
        //   component: UserView,
        // },
        {
          path: 'user/list',
          name: 'admin.user.list',
          meta: { requiresAdmin: true },
          component: UserList,
        },
        {
          path: 'user/add',
          name: 'admin.user.add',
          meta: { requiresAdmin: true , 'activeNodePath': '/admin/user/list'},
          component: UserAdd,
        },
        {
          path: 'user/edit/:id',
          name: 'admin.user.edit',
          meta: { requiresAdmin: true , 'activeNodePath': '/admin/user/list'},
          component: UserEdit,
        },
        {
          path: 'org/list',
          name: 'admin.org.list',
          meta: { requiresAdmin: true },
          component: OrgList,
        },
        {
          path: 'org/add',
          name: 'admin.org.add',
          meta: { requiresAdmin: true },
          component: OrgAdd,
        },
        {
          path: 'org/edit/:id',
          name: 'admin.org.edit',
          meta: { requiresAdmin: true },
          component: OrgEdit,
        },
        {
          path: 'role/list',
          name: 'admin.role.list',
          meta: { requiresAdmin: true },
          component: RoleList,
        },
        {
          path: 'role/add',
          name: 'admin.role.add',
          meta: { requiresAdmin: true },
          component: RoleAdd,
        },
        {
          path: 'role/edit/:id',
          name: 'admin.role.edit',
          meta: { requiresAdmin: true },
          component: RoleEdit,
        },
        {
          path: 'subsystem/list',
          name: 'admin.subsystem.list',
          meta: { requiresAdmin: true },
          component: SubsystemList,
        },
        {
          path: 'subsystem/add',
          name: 'admin.subsystem.add',
          meta: { requiresAdmin: true },
          component: SubsystemAdd,
        },
        {
          path: 'subsystem/edit/:id',
          name: 'admin.subsystem.edit',
          meta: { requiresAdmin: true },
          component: SubsystemEdit,
        },
        {
          path: 'menu/list',
          name: 'admin.menu.list',
          meta: { requiresAdmin: true },
          component: MenuList,
        },
        {
          path: 'menu/add',
          name: 'admin.menu.add',
          meta: { requiresAdmin: true },
          component: MenuAdd,
        },
        {
          path: 'menu/edit/:id',
          name: 'admin.menu.edit',
          meta: { requiresAdmin: true },
          component: MenuEdit,
        },
        {
          path: 'operation/list',
          name: 'admin.operation.list',
          meta: { requiresAdmin: true },
          component: OperationList,
        },
        {
          path: 'operation/add',
          name: 'admin.operation.add',
          meta: { requiresAdmin: true },
          component: OperationAdd,
        },
        {
          path: 'operation/edit/:id',
          name: 'admin.operation.edit',
          meta: { requiresAdmin: true },
          component: OperationEdit,
        },
        {
          path: 'permission/user/:user_id',
          name: 'admin.permission.user',
          meta: { requiresAdmin: true },
          component: UserPermission,
        },
        {
          path: 'approval/list',
          name: 'admin.approval.list',
          meta: { requiresAdmin: true },
          component: ApprovalList,
        },
        {
          path: ':pathMatch(.*)*',
          name: 'admin.notfound',
          meta: { requiresAdmin: true },
          component: NotFoundView,
        },
      ],
    },
  ],
})

export default router
