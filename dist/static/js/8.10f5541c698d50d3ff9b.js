webpackJsonp([8],{B3Go:function(t,e){},ixZd:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("Xxa5"),n=a.n(r),s=a("exGp"),o=a.n(s),l=a("PJh5"),i=a.n(l),p={name:"AppealTaskDeal",data:function(){return{total:10,moment:i.a,list:[],showInfo:!1,selectedList:[],search:{page:1,page_size:20},showAppealInfo:!1,operateInfo:{},currAppealInfo:{}}},mounted:function(){this.queryList()},methods:{queryList:function(){var t=this;return o()(n.a.mark(function e(){var a;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$api.appealList();case 2:200==(a=e.sent).code?(t.list=a.data.list,t.total=a.data.count):t.$message.error(a.msg);case 4:case"end":return e.stop()}},e,t)}))()},showInfoClick:function(t){var e=this;return o()(n.a.mark(function a(){var r;return n.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,e.$api.appealOpearteInfo({id:t});case 2:200==(r=a.sent).code?(e.showInfo=!0,e.operateInfo=r.data):e.$message.error(r.msg);case 4:case"end":return a.stop()}},a,e)}))()},verify:function(t){var e=this;return o()(n.a.mark(function a(){return n.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:e.selectedList,e.$prompt("","填写处理备注",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(){var a=o()(n.a.mark(function a(r){var s;return n.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(r.value){a.next=5;break}return e.$message.error("填写处理信息"),a.abrupt("return",!1);case 5:return a.next=7,e.$api.dealAppeal({id:t,reason:r.value});case 7:200==(s=a.sent).code?(e.$message.success("处理成功"),e.showInfo=!1,e.queryList()):e.$message.error(s.msg);case 9:case"end":return a.stop()}},a,e)}));return function(t){return a.apply(this,arguments)}}());case 2:case"end":return a.stop()}},a,e)}))()},handleCurrentChange:function(t){this.search.page=t,this.queryList()},showAppealContent:function(t){this.showAppealInfo=!0,this.currAppealInfo=t}}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"page"},[a("div",{staticClass:"page-title"},[t._v("申诉任务处理")]),t._v(" "),a("el-table",{ref:"multipleTable",attrs:{data:t.list}},[a("el-table-column",{attrs:{prop:"publisher_nickname",label:"发布人昵称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"publisher_phone",label:"手机号"}}),t._v(" "),a("el-table-column",{attrs:{prop:"content",label:"提交信息",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){return t.showAppealContent(e.row)}}},[t._v("申诉：【"+t._s(e.row.task_title)+"】")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"finisher_nickname",label:"完成人昵称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"status",label:"状态",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){return[1==e.row.status?a("p",[a("i",{staticClass:"tip-icon tip-fail"}),t._v("冻结\n\t\t\t\t\t")]):t._e(),t._v(" "),2==e.row.status?a("p",[a("i",{staticClass:"tip-icon tip-suc"}),t._v("已处理\n\t\t\t\t\t")]):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"status",label:"申请时间",width:"180",sortable:"","sort-by":"applyTime"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t.moment(1e3*e.row.created_at).format("YYYY-MM-DD HH:mm:ss")))]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[1==e.row.status?a("el-button",{attrs:{type:"text"},on:{click:function(a){return t.verify(e.row.id)}}},[t._v("标记为已处理")]):a("el-button",{attrs:{type:"text"},on:{click:function(a){return t.showInfoClick(e.row.id)}}},[t._v("处理信息")])]}}])})],1),t._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"","current-page":t.search.page,"page-size":t.search.page_size,layout:"total, prev, pager, next, jumper",total:t.total},on:{"current-change":t.handleCurrentChange}})],1),t._v(" "),a("el-dialog",{attrs:{title:"查看处理信息",visible:t.showInfo},on:{"update:visible":function(e){t.showInfo=e}}},[a("el-form",{ref:"form"},[a("el-form-item",{attrs:{label:"操作人"}},[a("div",{staticClass:"txt-right"},[t._v(t._s(t.operateInfo.operate_nickname))])]),t._v(" "),a("el-form-item",{attrs:{label:"操作时间"}},[a("div",{staticClass:"txt-right"},[t._v(t._s(t.moment(1e3*t.operateInfo.operated_at).format("YYYY-MM-DD")))])]),t._v(" "),a("el-form-item",{attrs:{label:"处理备注"}},[a("el-input",{attrs:{type:"textarea",disabled:"",value:t.operateInfo.operate_reason}})],1)],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"查看申诉信息",visible:t.showAppealInfo},on:{"update:visible":function(e){t.showAppealInfo=e}}},[a("el-form",{ref:"form"},[a("el-form-item",{attrs:{label:"用户昵称"}},[a("div",{staticClass:"txt-right"},[t._v(t._s(t.currAppealInfo.appealer_nickname))])]),t._v(" "),a("el-form-item",{attrs:{label:"申诉时间"}},[a("div",{staticClass:"txt-right"},[t._v(t._s(t.moment(1e3*t.currAppealInfo.created_at).format("YYYY-MM-DD HH:mm:ss")))])]),t._v(" "),a("el-form-item",{attrs:{label:"用户手机号"}},[a("div",{staticClass:"txt-right"},[t._v(t._s(t.currAppealInfo.appealer_phone))])]),t._v(" "),a("el-form-item",{attrs:{label:"申诉原因"}},[a("el-input",{attrs:{type:"textarea",disabled:"",value:t.currAppealInfo.appealer_content}})],1)],1)],1)],1)},staticRenderFns:[]};var u=a("VU/8")(p,c,!1,function(t){a("B3Go")},"data-v-f464e52e",null);e.default=u.exports}});
//# sourceMappingURL=8.10f5541c698d50d3ff9b.js.map