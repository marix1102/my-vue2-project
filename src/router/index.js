import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import WaferMap from '../views/wafer-map/WaferMap.vue'

import KitchenManager from '../components/Order/KitchenManager.vue'
import ShoppingCart from '../components/ShoppingCart.vue'
import Product from '../product/Product.vue'

import CardAndListDemo from '../components/RWD/CardAndListDemo.vue'
import ButtonDemoView from '../components/RWD/ButtonDemoView.vue'

import BasicForm from '../components/form/BasicForm.vue'
import SimpleTable from '../components/form/SimpleTable.vue'
import SimpleDialog from '../components/form/SimpleDialog.vue'
import SimpleTextField from '../components/form/SimpleTextField.vue'
import SimpleDatePicker from '../components/form/SimpleDatePicker.vue'
import SimpleMenu from '../components/form/SimpleMenu.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/product',
    name: 'product',
    component: Product
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/list',
    name: 'list',
    component: CardAndListDemo,
    children: [
      {
        path: '/list/basic-form', //建議全小寫 - 分隔
        component: BasicForm 
      },
      {
        path: '/list/simple-text-field', 
        component: SimpleTextField 
      },
      {
        path: '/list/simple-menu', 
        component: SimpleMenu 
      },
      {
        path: '/list/simple-date-picker', 
        component: SimpleDatePicker 
      },
      {
        path: '/list/simple-table', 
        component: SimpleTable 
      },
      {
        path: '/list/simple-dialog', 
        component: SimpleDialog 
      },
      {
        path: '/list/shopping', 
        component: ShoppingCart 
      },
      {
        path: '/list/order',
        component: KitchenManager 
      },
      {
        path: '/list/button-demo',
        component: ButtonDemoView 
      },
      {
        path: '/list/wafer-map',
        component: WaferMap 
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
