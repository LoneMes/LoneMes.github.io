(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{640:function(e,a,t){},650:function(e,a,t){"use strict";var n=t(0),r={name:"edit",theme:"outlined",icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"}}]}},l=t(7),s=function(e,a){return n.createElement(l.a,Object.assign({},e,{ref:a,icon:r}))};s.displayName="EditOutlined";a.a=n.forwardRef(s)},651:function(e,a,t){"use strict";var n=t(0),r={name:"search",theme:"outlined",icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"}}]}},l=t(7),s=function(e,a){return n.createElement(l.a,Object.assign({},e,{ref:a,icon:r}))};s.displayName="SearchOutlined";a.a=n.forwardRef(s)},660:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),l=t(654),s=t(661),o=t(40),c=t(351),i=t.n(c),u=(t(346),t(157)),d=t.n(u),m=(t(158),t(348)),p=t.n(m),f=(t(347),t(355)),h=t.n(f),v=(t(344),t(3)),b=t.n(v),y=(t(60),t(368)),g=t.n(y),w=(t(360),t(343)),E=t.n(w),k=(t(340),t(51)),C=t.n(k),T=(t(106),t(369)),O=t.n(T),S=(t(361),t(341)),x=t.n(S),j=(t(345),t(662)),N=t(663),L=t(650),D=t(664),U=t(665),z=t(651),I=(t(640),t(61)),P=t(378),R=t.n(P),M=(t(372),t(114));function q(e){var a=Object(n.useState)([]),t=a[0],l=a[1];Object(n.useEffect)((function(){l(e.defaultKeys.map((function(e){return""+e})))}),[e.defaultKeys]);var s=Object(n.useCallback)((function(e,a){var t;return(t=e?a.filter((function(a){return a.parent===e.id})):a.filter((function(e){return!e.parent}))).forEach((function(e){return e.children=s(e,a)})),t.length?t:null}),[]),o=Object(n.useCallback)((function(){var a=e.data.filter((function(e){return t.includes(""+e.id)}));e.onOk&&e.onOk(t,a)}),[e,t]),c=Object(n.useCallback)((function(){e.onClose()}),[e]),i=Object(n.useCallback)((function(e){l(e)}),[]),u=Object(n.useMemo)((function(){var a=Object(M.cloneDeep)(e.data);return a.forEach((function(e){e.key=String(e.id)})),s(null,a)||[]}),[e.data,s]);return r.a.createElement(E.a,{title:e.title||"请选择",visible:e.visible,wrapClassName:"menuTreeModal",confirmLoading:e.loading,onOk:o,onCancel:c},r.a.createElement(R.a,{checkable:!0,selectable:!1,checkedKeys:t,onCheck:i,treeData:u}))}var A=function(){return(A=Object.assign||function(e){for(var a,t=1,n=arguments.length;t<n;t++)for(var r in a=arguments[t])Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r]);return e}).apply(this,arguments)},F=function(e,a,t,n){return new(t||(t=Promise))((function(r,l){function s(e){try{c(n.next(e))}catch(e){l(e)}}function o(e){try{c(n.throw(e))}catch(e){l(e)}}function c(e){var a;e.done?r(e.value):(a=e.value,a instanceof t?a:new t((function(e){e(a)}))).then(s,o)}c((n=n.apply(e,a||[])).next())}))},K=function(e,a){var t,n,r,l,s={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return l={next:o(0),throw:o(1),return:o(2)},"function"==typeof Symbol&&(l[Symbol.iterator]=function(){return this}),l;function o(l){return function(o){return function(l){if(t)throw new TypeError("Generator is already executing.");for(;s;)try{if(t=1,n&&(r=2&l[0]?n.return:l[0]?n.throw||((r=n.return)&&r.call(n),0):n.next)&&!(r=r.call(n,l[1])).done)return r;switch(n=0,r&&(l=[2&l[0],r.value]),l[0]){case 0:case 1:r=l;break;case 4:return s.label++,{value:l[1],done:!1};case 5:s.label++,n=l[1],l=[0];continue;case 7:l=s.ops.pop(),s.trys.pop();continue;default:if(!(r=s.trys,(r=r.length>0&&r[r.length-1])||6!==l[0]&&2!==l[0])){s=0;continue}if(3===l[0]&&(!r||l[1]>r[0]&&l[1]<r[3])){s.label=l[1];break}if(6===l[0]&&s.label<r[1]){s.label=r[1],r=l;break}if(r&&s.label<r[2]){s.label=r[2],s.ops.push(l);break}r[2]&&s.ops.pop(),s.trys.pop();continue}l=a.call(e,s)}catch(e){l=[6,e],n=0}finally{t=r=0}if(5&l[0])throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}([l,o])}}},B=p.a.TextArea,J=x.a.Option,V={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:19}}};a.default=Object(o.b)((function(e){return{powerTreeData:e.sys.powerTreeData,userinfo:e.app.userinfo,powersCode:e.app.powersCode}}),(function(e){return{getAllRoles:e.sys.getAllRoles,addUser:e.sys.addUser,upUser:e.sys.upUser,delUser:e.sys.delUser,getUserList:e.sys.getUserList,setUserRoles:e.sys.setUserRoles}}))((function(e){var a=this,t=e.powersCode,o=i.a.useForm()[0],c=Object(n.useState)([]),u=c[0],m=c[1],f=Object(n.useState)(!1),v=f[0],y=f[1],w=Object(l.a)({pageNum:1,pageSize:10,total:0}),k=w[0],T=w[1],S=Object(l.a)({operateType:"add",nowData:null,modalShow:!1,modalLoading:!1}),P=S[0],R=S[1],M=Object(l.a)({username:void 0,conditions:void 0}),G=M[0],H=M[1],Q=Object(l.a)({roleData:[],roleTreeLoading:!1,roleTreeShow:!1,roleTreeDefault:[]}),W=Q[0],X=Q[1];Object(s.a)((function(){Z(k),Y()}));var Y=function(){return F(a,void 0,void 0,(function(){var a;return K(this,(function(t){switch(t.label){case 0:return t.trys.push([0,2,,3]),[4,e.getAllRoles()];case 1:return(a=t.sent())&&200===a.status&&X({roleData:a.data}),[3,3];case 2:return t.sent(),[3,3];case 3:return[2]}}))}))};function Z(a){var t;return F(this,void 0,void 0,(function(){var n,r;return K(this,(function(l){switch(l.label){case 0:if(!e.powersCode.includes("user:query"))return[2];n={pageNum:a.pageNum,pageSize:a.pageSize,username:G.username,conditions:G.conditions},y(!0),l.label=1;case 1:return l.trys.push([1,,3,4]),[4,e.getUserList(I.a.clearNull(n))];case 2:return(r=l.sent())&&200===r.status?(m(r.data.list),T({pageNum:a.pageNum,pageSize:a.pageSize,total:r.data.total})):b.a.error(null!==(t=null==r?void 0:r.message)&&void 0!==t?t:"数据获取失败"),[3,4];case 3:return y(!1),[7];case 4:return[2]}}))}))}var $=function(e,a){R({modalShow:!0,nowData:e,operateType:a}),setTimeout((function(){"add"===a?o.resetFields():e&&o.setFieldsValue({formConditions:e.conditions,formDesc:e.desc,formUsername:e.username,formPhone:e.phone,formEmail:e.email,formPassword:e.password})}))},_=function(){R({modalShow:!1})},ee=function(){X({roleTreeShow:!1})},ae=[{title:"序号",dataIndex:"serial",key:"serial"},{title:"用户名",dataIndex:"username",key:"username"},{title:"电话",dataIndex:"phone",key:"phone"},{title:"邮箱",dataIndex:"email",key:"email"},{title:"描述",dataIndex:"desc",key:"desc"},{title:"状态",dataIndex:"conditions",key:"conditions",render:function(e){return 1===e?r.a.createElement("span",{style:{color:"green"}},"启用"):r.a.createElement("span",{style:{color:"red"}},"禁用")}},{title:"操作",key:"control",width:200,render:function(t,n){var l=[],s=e.userinfo.userBasicInfo||{id:-1},o=e.powersCode;o.includes("user:query")&&l.push(r.a.createElement("span",{key:"0",className:"control-btn green",onClick:function(){return $(n,"see")}},r.a.createElement(C.a,{placement:"top",title:"查看"},r.a.createElement(j.a,null)))),o.includes("user:up")&&l.push(r.a.createElement("span",{key:"1",className:"control-btn blue",onClick:function(){return $(n,"up")}},r.a.createElement(C.a,{placement:"top",title:"修改"},r.a.createElement(N.a,null)))),o.includes("user:role")&&l.push(r.a.createElement("span",{key:"2",className:"control-btn blue",onClick:function(){return function(e){R({nowData:e}),X({roleTreeShow:!0,roleTreeDefault:e.roles||[]})}(n)}},r.a.createElement(C.a,{placement:"top",title:"分配角色"},r.a.createElement(L.a,null)))),o.includes("user:del")&&s.id!==n.id&&l.push(r.a.createElement(g.a,{key:"3",title:"确定删除吗?",onConfirm:function(){return t=n.id,F(a,void 0,void 0,(function(){var a,n;return K(this,(function(r){switch(r.label){case 0:y(!0),r.label=1;case 1:return r.trys.push([1,,3,4]),[4,e.delUser({id:t})];case 2:return(a=r.sent())&&200===a.status?(b.a.success("删除成功"),Z(k)):b.a.error(null!==(n=null==a?void 0:a.message)&&void 0!==n?n:"操作失败"),[3,4];case 3:return y(!1),[7];case 4:return[2]}}))}));var t},okText:"确定",cancelText:"取消"},r.a.createElement("span",{className:"control-btn red"},r.a.createElement(C.a,{placement:"top",title:"删除"},r.a.createElement(D.a,null)))));var c=[];return l.forEach((function(e,a){a&&c.push(r.a.createElement(O.a,{key:"line"+a,type:"vertical"})),c.push(e)})),c}}],te=Object(n.useMemo)((function(){return u.map((function(e,a){return{key:a,id:e.id,serial:a+1+(k.pageNum-1)*k.pageSize,username:e.username,password:e.password,phone:e.phone,email:e.email,desc:e.desc,conditions:e.conditions,control:e.id,roles:e.roles}}))}),[k,u]);return r.a.createElement("div",null,r.a.createElement("div",{className:"g-search"},r.a.createElement("ul",{className:"search-func"},r.a.createElement("li",null,r.a.createElement(d.a,{type:"primary",icon:r.a.createElement(U.a,null),disabled:!t.includes("user:add"),onClick:function(){return $(null,"add")}},"添加用户"))),r.a.createElement(O.a,{type:"vertical"}),t.includes("user:query")&&r.a.createElement("ul",{className:"search-ul"},r.a.createElement("li",null,r.a.createElement(p.a,{placeholder:"请输入用户名",onChange:function(e){e.target.value.length<20&&H({username:e.target.value})},value:G.username})),r.a.createElement("li",null,r.a.createElement(x.a,{placeholder:"请选择状态",allowClear:!0,style:{width:"200px"},onChange:function(e){H({conditions:e})},value:G.conditions},r.a.createElement(J,{value:1},"启用"),r.a.createElement(J,{value:-1},"禁用"))),r.a.createElement("li",null,r.a.createElement(d.a,{type:"primary",icon:r.a.createElement(z.a,null),onClick:function(){Z(k)}},"搜索")))),r.a.createElement("div",{className:"diy-table"},r.a.createElement(h.a,{columns:ae,loading:v,dataSource:te,pagination:{total:k.total,current:k.pageNum,pageSize:k.pageSize,showQuickJumper:!0,showTotal:function(e,a){return"共 "+e+" 条数据"},onChange:function(e,a){Z({pageNum:e,pageSize:a})}}})),r.a.createElement(E.a,{title:{add:"新增",up:"修改",see:"查看"}[P.operateType],visible:P.modalShow,onOk:function(){return F(a,void 0,void 0,(function(){var a,t,n,r,l,s;return K(this,(function(c){switch(c.label){case 0:if("see"===P.operateType)return _(),[2];c.label=1;case 1:return c.trys.push([1,12,,13]),[4,o.validateFields()];case 2:if(a=c.sent(),R({modalLoading:!0}),t={username:a.formUsername,password:a.formPassword,phone:a.formPhone,email:a.formEmail,desc:a.formDesc,conditions:a.formConditions},"add"!==P.operateType)return[3,7];c.label=3;case 3:return c.trys.push([3,,5,6]),[4,e.addUser(t)];case 4:return(n=c.sent())&&200===n.status?(b.a.success("添加成功"),Z(k),_()):b.a.error(null!==(r=null==n?void 0:n.message)&&void 0!==r?r:"操作失败"),[3,6];case 5:return R({modalLoading:!1}),[7];case 6:return[3,11];case 7:t.id=null===(l=P.nowData)||void 0===l?void 0:l.id,c.label=8;case 8:return c.trys.push([8,,10,11]),[4,e.upUser(t)];case 9:return(n=c.sent())&&200===n.status?(b.a.success("修改成功"),Z(k),_()):b.a.error(null!==(s=null==n?void 0:n.message)&&void 0!==s?s:"操作失败"),[3,11];case 10:return R({modalLoading:!1}),[7];case 11:return[3,13];case 12:return c.sent(),[3,13];case 13:return[2]}}))}))},onCancel:_,confirmLoading:P.modalLoading},r.a.createElement(i.a,{form:o,initialValues:{formConditions:1}},r.a.createElement(i.a.Item,A({label:"用户名",name:"formUsername"},V,{rules:[{required:!0,whitespace:!0,message:"必填"},{max:12,message:"最多输入12位字符"}]}),r.a.createElement(p.a,{placeholder:"请输入用户名",disabled:"see"===P.operateType})),r.a.createElement(i.a.Item,A({label:"密码",name:"formPassword"},V,{rules:[{required:!0,whitespace:!0,message:"必填"},{min:6,message:"最少输入6位字符"},{max:18,message:"最多输入18位字符"}]}),r.a.createElement(p.a,{type:"password",placeholder:"请输入密码",disabled:"see"===P.operateType})),r.a.createElement(i.a.Item,A({label:"电话",name:"formPhone"},V,{rules:[function(){return{validator:function(e,a){var t=a;return t&&!I.a.checkPhone(t)?Promise.reject("请输入有效的手机号码"):Promise.resolve()}}}]}),r.a.createElement(p.a,{placeholder:"请输入手机号",maxLength:11,disabled:"see"===P.operateType})),r.a.createElement(i.a.Item,A({label:"邮箱",name:"formEmail"},V,{rules:[function(){return{validator:function(e,a){var t=a;return t&&!I.a.checkEmail(t)?Promise.reject("请输入有效的邮箱地址"):Promise.resolve()}}}]}),r.a.createElement(p.a,{placeholder:"请输入邮箱地址",disabled:"see"===P.operateType})),r.a.createElement(i.a.Item,A({label:"描述",name:"formDesc"},V,{rules:[{max:100,message:"最多输入100个字符"}]}),r.a.createElement(B,{rows:4,disabled:"see"===P.operateType,autoSize:{minRows:2,maxRows:6}})),r.a.createElement(i.a.Item,A({label:"状态",name:"formConditions"},V,{rules:[{required:!0,message:"请选择状态"}]}),r.a.createElement(x.a,{disabled:"see"===P.operateType},r.a.createElement(J,{key:1,value:1},"启用"),r.a.createElement(J,{key:-1,value:-1},"禁用"))))),r.a.createElement(q,{title:"分配角色",data:W.roleData,visible:W.roleTreeShow,defaultKeys:W.roleTreeDefault,loading:W.roleTreeLoading,onOk:function(t){return F(a,void 0,void 0,(function(){var a,n,r,l;return K(this,(function(s){switch(s.label){case 0:if(!(null===(r=P.nowData)||void 0===r?void 0:r.id))return b.a.error("未获取到该条数据id"),[2];a={id:P.nowData.id,roles:t.map((function(e){return Number(e)}))},X({roleTreeLoading:!0}),s.label=1;case 1:return s.trys.push([1,,3,4]),[4,e.setUserRoles(a)];case 2:return(n=s.sent())&&200===n.status?(b.a.success("分配成功"),Z(k),ee()):b.a.error(null!==(l=null==n?void 0:n.message)&&void 0!==l?l:"操作失败"),[3,4];case 3:return X({roleTreeLoading:!1}),[7];case 4:return[2]}}))}))},onClose:ee}))}))}}]);