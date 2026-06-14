import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import AboutView from '../views/AboutView.vue'
import WaferMap from '../views/wafer-map/WaferMap.vue'
import filecompare from '../views/mxic-test/file-compare.vue'

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
import SimpleMixin from '../components/form/SimpleMixin.vue'

import SimpleKeepAlive from '@/components/keep-alive/SimpleKeepAlive.vue'
import SimpleEventBus from '@/components/event-bus/SimpleEventBus.vue'

import LazyLoad from '@/components/load/LazyLoad.vue'
import Badge from '@/components/badge/Badge.vue'
import NotificationMenu from '@/components/badge/NotificationMenu.vue'

import SimpleVirtualScroller from '@/components/virtual-scroller/SimpleVirtualScroller.vue'
import LayerCompositionDemo from '@/components/layer-composition/LayerCompositionDemo.vue'
import TreeviewDemo from '@/components/tree-view/TreeviewDemo.vue'
import WorkflowStepper from '@/components/step/WorkflowStepper.vue'

// import FileDiffViewer from '@/components/file-compare/FileDiffViewer.vue'
import SourceCompare from '@/components/file-compare/SourceCompare.vue'


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
    component: SourceCompare
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
      },
      {
        path: '/list/mxic-test',
        component: filecompare 
      },
      {
        path: '/list/file-compare',
        component: SourceCompare 
      },
      {
        path: '/list/simple-mixin',
        component: SimpleMixin 
      },
      {
        path: '/list/keep-alive',
        component: SimpleKeepAlive 
      },
      {
        path: '/list/event-bus',
        component: SimpleEventBus 
      },
      {
        path: '/list/lazy-load',
        component: LazyLoad 
      },
      {
        path: '/list/badge',
        component: Badge 
      },
      {
        path: '/list/notification',
        component: NotificationMenu 
      },
      {
        path: '/list/virtual-scroller',
        component: SimpleVirtualScroller 
      },
      {
        path: '/list/layer-composition',
        component: LayerCompositionDemo 
      },
      {
        path: '/list/tree-view',
        component: TreeviewDemo 
      }
      ,
      {
        path: '/list/step',
        component: WorkflowStepper 
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
