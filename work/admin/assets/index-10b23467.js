import{b as P,a as R,r,l as A,j as s,B as J,I as v,m as d,T as I}from"./index-33213bd0.js";import{u as V,T as z,P as K,a as Q,M as Y,S as w,E as G,b as H,c as W,D as X,d as Z}from"./index-513cd105.js";import{F as l,u as _,I as k}from"./useMount-751534fc.js";import{I as ee}from"./index-0ed36c48.js";const se=["icon-Dollar","icon-compass","icon-EURO","icon-time-circle","icon-earth","icon-YUAN","icon-message","icon-dashboard","icon-piechart","icon-setting","icon-eye","icon-save","icon-appstore","icon-control","icon-detail","icon-project","icon-wallet","icon-user","icon-team","icon-areachart","icon-linechart","icon-barchart","icon-pointmap","icon-database","icon-reconciliation","icon-securityscan","icon-propertysafety","icon-safetycertificate","icon-alert","icon-bulb","icon-trophy","icon-USB","icon-home","icon-like","icon-unlock","icon-lock","icon-customerservice","icon-flag","icon-moneycollect","icon-medicinebox","icon-shop","icon-rocket","icon-shopping","icon-folder","icon-folder-open","icon-sliders","icon-cloud","icon-crown","icon-desktop","icon-gift"];const{Option:T}=w,{TextArea:ne}=k,c={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:19}}};function re(){const u=P(e=>e.app.powersCode),i=R(),[h]=l.useForm(),[p,N]=r.useState([]),[M,S]=r.useState(!1),[a,m]=V({operateType:"add",nowData:null,modalShow:!1,modalLoading:!1}),[f,U]=r.useState({});_(()=>{x()});const x=async()=>{if(u.includes("menu:query")){S(!0);try{const e=await i.sys.getMenus();e&&e.status===200&&N(e.data)}finally{S(!1)}}},j=r.useCallback((e,n)=>{let t;return e?t=n.filter(o=>o.parent===e.id):t=n.filter(o=>!o.parent),t.forEach(o=>o.children=j(o,n)),t.length?t:void 0},[]),D=r.useCallback(e=>{const n=[];for(let t=0;t<e.length;t++){const o={...e[t]};o.children&&(o.children=D(o.children));const g={...o,key:o.id};n.push(g)}return n},[]),E=r.useCallback((e,n)=>{let t={};n.selected&&(t={title:n.node.title,id:n.node.id}),U(t)},[]),L=e=>{const n=p.find(t=>t.id===e);return n?n.title:void 0},b=(e,n)=>{m({modalShow:!0,nowData:e,operateType:n}),setTimeout(()=>{n==="add"?h.resetFields():e&&h.setFieldsValue({formConditions:e.conditions,formDesc:e.desc,formIcon:e.icon,formSorts:e.sorts,formTitle:e.title,formUrl:e.url})})},y=()=>{m({modalShow:!1})},O=async()=>{var e;if(a.operateType==="see"){y();return}try{const n=await h.validateFields(),t={title:n.formTitle,url:n.formUrl,icon:n.formIcon,parent:Number(f.id)||null,sorts:n.formSorts,desc:n.formDesc,conditions:n.formConditions};if(m({modalLoading:!0}),a.operateType==="add")try{const o=await i.sys.addMenu(t);o&&o.status===200?(d.success("添加成功"),x(),y(),i.app.updateUserInfo(null)):d.error("添加失败")}finally{m({modalLoading:!1})}else try{t.id=(e=a==null?void 0:a.nowData)==null?void 0:e.id;const o=await i.sys.upMenu(t);o&&o.status===200?(d.success("修改成功"),x(),y(),i.app.updateUserInfo(null)):d.error("修改失败")}finally{m({modalLoading:!1})}}catch{}},q=async e=>{const n={id:e.id},t=await i.sys.delMenu(n);t&&t.status===200?(x(),i.app.updateUserInfo(null),d.success("删除成功")):d.error((t==null?void 0:t.message)??"操作失败")},F=r.useMemo(()=>{const e=A.cloneDeep(p),n=D(e);return n.sort((t,o)=>t.sorts-o.sorts),j(null,n)||[]},[p,j]),B=[{title:"序号",dataIndex:"serial",key:"serial"},{title:"图标",dataIndex:"icon",key:"icon",render:e=>e?s.jsx(v,{type:e}):""},{title:"菜单名称",dataIndex:"title",key:"title"},{title:"路径",dataIndex:"url",key:"url",render:e=>e?`/${e.replace(/^\//,"")}`:""},{title:"描述",dataIndex:"desc",key:"desc"},{title:"父级",dataIndex:"parent",key:"parent",render:e=>L(e)},{title:"状态",dataIndex:"conditions",key:"conditions",render:e=>e===1?s.jsx("span",{style:{color:"green"},children:"启用"}):s.jsx("span",{style:{color:"red"},children:"禁用"})},{title:"操作",key:"control",width:120,render:(e,n)=>{const t=[];u.includes("menu:query")&&t.push(s.jsx("span",{className:"control-btn green",onClick:()=>b(n,"see"),children:s.jsx(I,{placement:"top",title:"查看",children:s.jsx(G,{})})},"0")),u.includes("menu:up")&&t.push(s.jsx("span",{className:"control-btn blue",onClick:()=>b(n,"up"),children:s.jsx(I,{placement:"top",title:"修改",children:s.jsx(H,{})})},"1")),u.includes("menu:del")&&t.push(s.jsx(W,{title:"确定删除吗?",okText:"确定",cancelText:"取消",onConfirm:()=>q(n),children:s.jsx("span",{className:"control-btn red",children:s.jsx(I,{placement:"top",title:"删除",children:s.jsx(X,{})})})},"2"));const o=[];return t.forEach((g,C)=>{C&&o.push(s.jsx(Z,{type:"vertical"},`line${C}`)),o.push(g)}),o}}],$=r.useMemo(()=>p.filter(e=>e.parent===(Number(f.id)||null)).map((e,n)=>({key:n,id:e.id,icon:e.icon,parent:e.parent,title:e.title,url:e.url,desc:e.desc,sorts:e.sorts,conditions:e.conditions,serial:n+1,control:e.id})),[p,f.id]);return s.jsxs("div",{className:"page-menu-admin",children:[s.jsxs("div",{className:"l",children:[s.jsx("div",{className:"title",children:"目录结构"}),s.jsx("div",{children:s.jsx(z,{onSelect:E,treeData:F})})]}),s.jsxs("div",{className:"r",children:[s.jsx("div",{className:"searchBox",children:s.jsx("ul",{children:s.jsx("li",{children:s.jsx(J,{type:"primary",icon:s.jsx(K,{}),onClick:()=>b(null,"add"),disabled:!u.includes("menu:add"),children:`添加${f.title||"根级"}子菜单`})})})}),s.jsx(Q,{className:"diy-table",columns:B,loading:M,dataSource:$,pagination:{showQuickJumper:!0,showTotal:e=>`共 ${e} 条数据`}})]}),s.jsx(Y,{title:`${{add:"新增",up:"修改",see:"查看"}[a.operateType]}`,visible:a.modalShow,onOk:O,onCancel:y,confirmLoading:a.modalLoading,children:s.jsxs(l,{form:h,initialValues:{formConditions:1},children:[s.jsx(l.Item,{label:"菜单名",name:"formTitle",...c,rules:[{required:!0,whitespace:!0,message:"必填"},{max:12,message:"最多输入12位字符"}],children:s.jsx(k,{placeholder:"请输入菜单名",disabled:a.operateType==="see"})}),s.jsx(l.Item,{label:"菜单链接",name:"formUrl",...c,rules:[{required:!0,whitespace:!0,message:"必填"}],children:s.jsx(k,{placeholder:"请输入菜单链接",disabled:a.operateType==="see"})}),s.jsx(l.Item,{label:"图标",name:"formIcon",...c,children:s.jsx(w,{dropdownClassName:"iconSelect",disabled:a.operateType==="see",children:se.map((e,n)=>s.jsx(T,{value:e,children:s.jsx(v,{type:e})},n))})}),s.jsx(l.Item,{label:"描述",name:"formDesc",...c,rules:[{max:100,message:"最多输入100位字符"}],children:s.jsx(ne,{rows:4,disabled:a.operateType==="see",autoSize:{minRows:2,maxRows:6}})}),s.jsx(l.Item,{label:"排序",name:"formSorts",...c,rules:[{required:!0,message:"请输入排序号"}],children:s.jsx(ee,{min:0,max:99999,style:{width:"100%"},disabled:a.operateType==="see"})}),s.jsx(l.Item,{label:"状态",name:"formConditions",...c,rules:[{required:!0,message:"请选择状态"}],children:s.jsxs(w,{disabled:a.operateType==="see",children:[s.jsx(T,{value:1,children:"启用"},1),s.jsx(T,{value:-1,children:"禁用"},-1)]})}),a.operateType==="add"?s.jsx(l.Item,{label:"赋予",...c,children:s.jsx("span",{style:{color:"green"},children:"新增菜单后请前往角色管理将菜单授权给相关角色"})}):null]})})]})}export{re as default};