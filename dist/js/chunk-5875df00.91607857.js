(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5875df00"],{"312c":function(t,e,n){},"403e":function(t,e,n){"use strict";var a=n("312c"),i=n.n(a);i.a},"57da":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-container",{staticClass:"home-container"},[a("el-header",[a("div",[a("img",{attrs:{src:n("cf05"),alt:""}}),a("span",[t._v("电商后台管理系统")])]),a("el-button",{attrs:{type:"info"},on:{click:t.logout}},[t._v("退出")])],1),a("el-container",[a("el-aside",{attrs:{width:t.isCollapse?"64px":"200px"}},[t.isCollapse?a("div",{staticClass:"toggle-button-r",on:{click:t.toggleCollapse}},[t._v("》》》")]):a("div",{staticClass:"toggle-button-l",on:{click:t.toggleCollapse}},[t._v("《《《")]),a("el-menu",{attrs:{"background-color":"#333744","text-color":"#fff","active-text-color":"#409EFF","unique-opened":!0,collapse:t.isCollapse,"collapse-transition":!1,router:!0,"default-active":t.activePath}},t._l(t.menuList,(function(e){return a("el-submenu",{key:e.id,attrs:{index:e.id+""}},[a("template",{slot:"title"},[a("i",{class:t.iconsObj[e.id]}),a("span",[t._v(t._s(e.authName))])]),t._l(e.children,(function(e){return a("el-menu-item",{key:e.id,attrs:{index:"/"+e.path},on:{click:function(n){return t.saveNavState("/"+e.path)}}},[a("template",{slot:"title"},[a("i",{staticClass:"el-icon-menu"}),a("span",[t._v(t._s(e.authName))])])],2)}))],2)})),1)],1),a("el-main",[a("router-view")],1)],1)],1)},i=[],o=(n("96cf"),n("1da1")),s={name:"Home",data:function(){return{menuList:[],iconsObj:{125:"iconfont icon-user",103:"iconfont icon-tijikongjian",101:"iconfont icon-shangpin",102:"iconfont icon-danju",145:"iconfont icon-baobiao"},isCollapse:!1,activePath:""}},created:function(){this.getMenuList(),this.activePath=window.sessionStorage.getItem("activePath")},methods:{logout:function(){window.sessionStorage.clear(),this.$router.push("/login")},getMenuList:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$http.get("menus");case 2:if(n=e.sent,a=n.data,200===a.meta.status){e.next=6;break}return e.abrupt("return",t.$message.error(a.meta.msg));case 6:t.menuList=a.data;case 7:case"end":return e.stop()}}),e)})))()},toggleCollapse:function(){this.isCollapse=!this.isCollapse},saveNavState:function(t){window.sessionStorage.setItem("activePath",t),this.activePath=t}}},c=s,r=(n("403e"),n("2877")),l=Object(r["a"])(c,a,i,!1,null,"104767de",null);e["default"]=l.exports},cf05:function(t,e,n){t.exports=n.p+"img/logo.80da4aed.png"}}]);
//# sourceMappingURL=chunk-5875df00.91607857.js.map