webpackJsonp([3],{FSro:function(e,t){e.exports={indexManagement:{label:"管理首页",children:{authentication:"工作台",feedbackInfoDeal:"反馈信息",appealTaskDeal:"申诉任务",reportTaskDeal:"举报信息",withdraw:"提现管理"}},userManagement:{label:"用户管理",children:{roleManagement:"角色管理",taskManagement:"任务管理",accountManage:"平台账户"}},platformManagement:{label:"平台管理",children:{nearTask:"附近任务"}}}},VC2r:function(e,t){},VZrM:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("FSro"),r=a.n(n),o={data:function(){return{routerJson:r.a,user:{username:localStorage.getItem("username"),user_id:localStorage.getItem("user_id")}}},computed:{active:function(){return{reportTaskDeal:"reportTaskDeal",accountManage:"accountManage",nearTask:"nearTask",authentication:"authentication",watchTaskVerify:"watchTaskVerify",feedbackInfoDeal:"feedbackInfoDeal",appealTaskDeal:"appealTaskDeal",taskManagement:"taskManagement",notifyManagement:"notifyManagement",startPageSet:"startPageSet",categorySet:"categorySet",userHelpSet:"userHelpSet",authManagement:"authManagement",roleManagement:"roleManagement",withdraw:"withdraw"}[this.$route.name]}},mounted:function(){},methods:{logout:function(){localStorage.removeItem("token"),this.$router.push({name:"login"})},handleCommand:function(e){this[e]()}}},s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-container",{staticClass:"page-main"},[n("el-header",{staticClass:"header flex"},[n("div",{staticClass:"logo"},[e._v("Patchlinker")]),e._v(" "),n("div",{staticClass:"user-admin"},[n("el-dropdown",{attrs:{trigger:"click"},on:{command:e.handleCommand}},[n("p",{staticClass:"user-email"},[n("img",{attrs:{src:a("o2IA"),alt:""}}),e._v("\n\t\t\t\t\t"+e._s(e.user.username)+"\n\t\t\t\t")]),e._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"logout"}},[e._v("安全退出")])],1)],1)],1)]),e._v(" "),n("el-container",{staticClass:"content"},[n("el-aside",{staticClass:"aside",attrs:{width:"200px"}},[n("el-menu",{attrs:{"default-active":e.active,"unique-opened":"",router:"","text-color":"#a9afb6","active-text-color":"#1060b6","background-color":"#001525"}},e._l(e.routerJson,function(t,a){return n("el-submenu",{key:a,attrs:{index:a}},[n("template",{slot:"title"},[e._v(e._s(t.label))]),e._v(" "),e._l(t.children,function(t,a){return n("el-menu-item",{key:a,attrs:{index:a}},[e._v(e._s(t))])})],2)}),1)],1),e._v(" "),n("el-main",[n("router-view")],1)],1)],1)},staticRenderFns:[]};var l=a("VU/8")(o,s,!1,function(e){a("VC2r")},null,null);t.default=l.exports},o2IA:function(e,t,a){e.exports=a.p+"static/img/icon-header.80a5fe2.png"}});
//# sourceMappingURL=3.99dd78e596ab4a1438b7.js.map