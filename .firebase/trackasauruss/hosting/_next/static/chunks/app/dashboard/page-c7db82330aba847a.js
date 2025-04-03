(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[105],{285:(e,t,a)=>{"use strict";a.d(t,{$:()=>l,r:()=>o});var r=a(5155);a(2115);var s=a(9708),d=a(2085),n=a(9434);let o=(0,d.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",{variants:{variant:{default:"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",destructive:"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2 has-[>svg]:px-3",sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",lg:"h-10 rounded-md px-6 has-[>svg]:px-4",icon:"size-9"}},defaultVariants:{variant:"default",size:"default"}});function l(e){let{className:t,variant:a,size:d,asChild:l=!1,...i}=e,c=l?s.DX:"button";return(0,r.jsx)(c,{"data-slot":"button",className:(0,n.cn)(o({variant:a,size:d,className:t})),...i})}},7194:(e,t,a)=>{Promise.resolve().then(a.bind(a,7635))},7635:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>ea});var r=a(5155),s=a(2115),d=a(8185),n=a(5317);let o=(e,t)=>{if(!e)return()=>{};let a=(0,n.rJ)(d.db,"users/".concat(e,"/tasks")),r=(0,n.P)(a,(0,n.My)("dueDate"));return(0,n.aQ)(r,e=>{t(e.docs.map(e=>({id:e.id,...e.data(),dueDate:e.data().dueDate?e.data().dueDate.toDate():null})))},e=>{console.error("Error getting tasks:",e),t([])})},l=async(e,t)=>{try{if(!e)throw Error("User not authenticated");let a=(0,n.rJ)(d.db,"users/".concat(e,"/tasks")),r={text:t.text,dueDate:t.dueDate?n.Dc.fromDate(new Date(t.dueDate)):null,completed:!1,createdAt:(0,n.O5)()};return{id:(await (0,n.gS)(a,r)).id,...r}}catch(e){throw console.error("Error adding task:",e),e}},i=async(e,t,a)=>{try{if(!e)throw Error("User not authenticated");let r=(0,n.H9)(d.db,"users/".concat(e,"/tasks/").concat(t));await (0,n.mZ)(r,{completed:a})}catch(e){throw console.error("Error toggling task completion:",e),e}},c=async(e,t)=>{try{if(!e)throw Error("User not authenticated");let a=(0,n.H9)(d.db,"users/".concat(e,"/tasks/").concat(t));await (0,n.kd)(a)}catch(e){throw console.error("Error deleting task:",e),e}},u=(e,t)=>{if(!e)return()=>{};let a=(0,n.rJ)(d.db,"users/".concat(e,"/attendance")),r=(0,n.P)(a,(0,n.My)("date","desc"));return(0,n.aQ)(r,e=>{t(e.docs.map(e=>({id:e.id,...e.data(),date:e.data().date?e.data().date.toDate():null})))},e=>{console.error("Error getting attendance:",e),t([])})},x=async(e,t)=>{try{if(!e)throw Error("User not authenticated");let a=(0,n.rJ)(d.db,"users/".concat(e,"/attendance")),r=new Date(t);r.setHours(0,0,0,0);let s=n.Dc.fromDate(r);r.setHours(23,59,59,999);let o=n.Dc.fromDate(r),l=(0,n.P)(a,(0,n._M)("date",">=",s),(0,n._M)("date","<=",o)),i=await (0,n.GG)(l);if(i.empty)return null;return{id:i.docs[0].id,...i.docs[0].data()}}catch(e){return console.error("Error getting attendance by date:",e),null}},m=(e,t)=>0===e?"absent":e<t?"partial":"full",g=async(e,t)=>{try{let a;if(!e)throw Error("User not authenticated");let r=(0,n.rJ)(d.db,"users/".concat(e,"/attendance")),s=Math.max(0,Number(t.attendedHours)||0),o=Math.max(0,Number(t.conductedHours)||0);if(s>o)throw Error("Attended hours cannot exceed conducted hours");let l=m(s,o),i={date:n.Dc.fromDate(new Date(t.date)),attendedHours:s,conductedHours:o,status:l,createdAt:(0,n.O5)()},c=await x(e,t.date);return c?(a=(0,n.H9)(d.db,"users/".concat(e,"/attendance/").concat(c.id)),await (0,n.mZ)(a,{...i,updatedAt:(0,n.O5)()})):a=await (0,n.gS)(r,i),await b(e),c?{id:c.id,...i}:{id:a.id,...i}}catch(e){throw console.error("Error adding/updating attendance:",e),e}},h=async(e,t,a)=>{try{if(!e)throw Error("User not authenticated");let r=(0,n.H9)(d.db,"users/".concat(e,"/attendance/").concat(t)),s=Math.max(0,Number(a.attendedHours)||0),o=Math.max(0,Number(a.conductedHours)||0);if(s>o)throw Error("Attended hours cannot exceed conducted hours");let l=m(s,o),i={attendedHours:s,conductedHours:o,status:l,updatedAt:(0,n.O5)()};return a.date&&(i.date=n.Dc.fromDate(new Date(a.date))),await (0,n.mZ)(r,i),await b(e),{success:!0,id:t,...i}}catch(e){throw console.error("Error updating attendance:",e),e}},p=async(e,t)=>{try{if(!e)throw Error("User not authenticated");let a=(0,n.H9)(d.db,"users/".concat(e,"/attendance/").concat(t));await (0,n.kd)(a),await b(e)}catch(e){throw console.error("Error deleting attendance:",e),e}},b=async e=>{try{if(!e)throw Error("User not authenticated");let t=(0,n.rJ)(d.db,"users/".concat(e,"/attendance")),a=await (0,n.GG)(t),r=0,s=0;a.forEach(e=>{let t=e.data();r+=Number(t.attendedHours)||0,s+=Number(t.conductedHours)||0});let o=s>0?Math.round(r/s*100):0,l=(0,n.H9)(d.db,"users",e);return await (0,n.mZ)(l,{attendancePercentage:o,totalAttendedHours:r,totalConductedHours:s}),{attendancePercentage:o,totalAttendedHours:r,totalConductedHours:s}}catch(e){throw console.error("Error updating attendance stats:",e),e}},y=(e,t)=>{if(!e)return()=>{};let a=(0,n.H9)(d.db,"users",e);return(0,n.aQ)(a,e=>{e.exists()?t({id:e.id,...e.data()}):t(null)},e=>{console.error("Error getting user profile:",e),t(null)})},f=async(e,t)=>{try{if(!e)throw Error("User not authenticated");let a=(0,n.H9)(d.db,"users",e);await (0,n.mZ)(a,{cityProgress:Number(t)})}catch(e){throw console.error("Error updating city progress:",e),e}};var j=a(9434);function N(e){let{className:t,...a}=e;return(0,r.jsx)("div",{"data-slot":"card",className:(0,j.cn)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",t),...a})}function v(e){let{className:t,...a}=e;return(0,r.jsx)("div",{"data-slot":"card-header",className:(0,j.cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",t),...a})}function w(e){let{className:t,...a}=e;return(0,r.jsx)("div",{"data-slot":"card-title",className:(0,j.cn)("leading-none font-semibold",t),...a})}function H(e){let{className:t,...a}=e;return(0,r.jsx)("div",{"data-slot":"card-description",className:(0,j.cn)("text-muted-foreground text-sm",t),...a})}function D(e){let{className:t,...a}=e;return(0,r.jsx)("div",{"data-slot":"card-content",className:(0,j.cn)("px-6",t),...a})}var A=a(646),k=a(3717),M=a(4186),E=a(5196),C=a(2525),_=a(9074),S=a(2355),P=a(3052),F=a(6183),z=a(760),T=a(3898),O=a(3008),U=a(542),I=a(285),G=a(547);let R=G.bL,L=G.l9;G.Mz;let Y=s.forwardRef((e,t)=>{let{className:a,align:s="center",sideOffset:d=4,...n}=e;return(0,r.jsx)(G.ZL,{children:(0,r.jsx)(G.UC,{ref:t,align:s,sideOffset:d,className:(0,j.cn)("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",a),...n})})});Y.displayName=G.UC.displayName;var q=a(1165);function J(e){let{className:t,classNames:a,showOutsideDays:s=!0,...d}=e;return(0,r.jsx)(q.hv,{showOutsideDays:s,className:(0,j.cn)("p-3",t),classNames:{months:"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",month:"space-y-4",caption:"flex justify-center pt-1 relative items-center",caption_label:"text-sm font-medium",nav:"space-x-1 flex items-center",nav_button:(0,j.cn)((0,I.r)({variant:"outline"}),"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),nav_button_previous:"absolute left-1",nav_button_next:"absolute right-1",table:"w-full border-collapse space-y-1",head_row:"flex",head_cell:"text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",row:"flex w-full mt-2",cell:(0,j.cn)("relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md","range"===d.mode?"[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md":"[&:has([aria-selected])]:rounded-md"),day:(0,j.cn)((0,I.r)({variant:"ghost"}),"h-8 w-8 p-0 font-normal aria-selected:opacity-100"),day_range_start:"day-range-start",day_range_end:"day-range-end",day_selected:"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",day_today:"bg-accent text-accent-foreground",day_outside:"day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",day_disabled:"text-muted-foreground opacity-50",day_range_middle:"aria-selected:bg-accent aria-selected:text-accent-foreground",day_hidden:"invisible",...a},components:{IconLeft:e=>{let{className:t,...a}=e;return(0,r.jsx)(S.A,{className:(0,j.cn)("h-4 w-4",t),...a})},IconRight:e=>{let{className:t,...a}=e;return(0,r.jsx)(P.A,{className:(0,j.cn)("h-4 w-4",t),...a})}},...d})}J.displayName="Calendar";var W=a(3921);function Z(e){let{delayDuration:t=0,...a}=e;return(0,r.jsx)(W.Kq,{"data-slot":"tooltip-provider",delayDuration:t,...a})}function $(e){let{...t}=e;return(0,r.jsx)(Z,{children:(0,r.jsx)(W.bL,{"data-slot":"tooltip",...t})})}function K(e){let{...t}=e;return(0,r.jsx)(W.l9,{"data-slot":"tooltip-trigger",...t})}function Q(e){let{className:t,sideOffset:a=0,children:s,...d}=e;return(0,r.jsx)(W.ZL,{children:(0,r.jsxs)(W.UC,{"data-slot":"tooltip-content",sideOffset:a,className:(0,j.cn)("bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",t),...d,children:[s,(0,r.jsx)(W.i3,{className:"bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"})]})})}var V=a(3568),B=a(5339);let X=e=>{if(!e||!Array.isArray(e))return 0;let t=new Date().getMonth(),a=new Date().getFullYear();return e.filter(e=>{let r=new Date(e.date);return r.getMonth()===t&&r.getFullYear()===a}).reduce((e,t)=>e+Number(t.attendedHours),0)},ee=e=>{if(!e||!Array.isArray(e))return 0;let t=new Date().getMonth(),a=new Date().getFullYear();return e.filter(e=>{let r=new Date(e.date);return r.getMonth()===t&&r.getFullYear()===a}).reduce((e,t)=>e+Number(t.conductedHours),0)},et=e=>{let t=X(e),a=ee(e);return a>0?Math.round(t/a*100):0};function ea(){let{user:e,tasks:t,attendance:a,profile:n,loading:m,addTask:b,toggleTask:j,deleteTask:G,addAttendance:q,updateAttendance:W,deleteAttendanceRecord:Z,checkAttendanceForDate:ea}=function(){let[e,t]=(0,s.useState)(null),[a,r]=(0,s.useState)([]),[n,m]=(0,s.useState)([]),[b,j]=(0,s.useState)(null),[N,v]=(0,s.useState)(!0);(0,s.useEffect)(()=>{let e=d.j.onAuthStateChanged(e=>{t(e),v(!!e)});return()=>e()},[]),(0,s.useEffect)(()=>{let t=()=>{};return e?t=o(e.uid,e=>{r(e),v(!1)}):r([]),()=>t()},[e]),(0,s.useEffect)(()=>{let t=()=>{};return e?t=u(e.uid,e=>{m(e),v(!1)}):m([]),()=>t()},[e]),(0,s.useEffect)(()=>{let t=()=>{};return e?t=y(e.uid,e=>{j(e)}):j(null),()=>t()},[e]);let w=async t=>e?l(e.uid,t):null,H=async(t,a)=>{if(e)return i(e.uid,t,a)},D=async t=>{if(e)return c(e.uid,t)},A=async t=>{if(!e)return null;let a=await x(e.uid,t.date);return a?h(e.uid,a.id,{date:t.date,attendedHours:Number(t.attendedHours),conductedHours:Number(t.conductedHours),status:E(t.attendedHours,t.conductedHours)}):g(e.uid,{...t,status:E(t.attendedHours,t.conductedHours)})},k=async(t,a)=>{if(!e)return;let r={...a,status:E(a.attendedHours,a.conductedHours)};return h(e.uid,t,r)},M=async t=>{if(e)return p(e.uid,t)},E=(e,t)=>{let a=Number(e),r=Number(t);return 0===a?"absent":a<r?"partial":"full"},C=async t=>{if(e)return f(e.uid,t)};return{user:e,tasks:a,attendance:n,profile:b,loading:N,addTask:w,toggleTask:H,deleteTask:D,addAttendance:A,updateAttendance:k,deleteAttendance:M,updateCityProgress:C,checkAttendanceForDate:e=>{if(!n||!Array.isArray(n))return null;let t=new Date(e);return t.setHours(0,0,0,0),n.find(e=>{if(!e.date)return!1;let a=new Date(e.date.seconds?1e3*e.date.seconds:e.date);return a.setHours(0,0,0,0),a.getTime()===t.getTime()})}}}(),[er,es]=(0,s.useState)({text:"",dueDate:""}),[ed,en]=(0,s.useState)({date:new Date().toISOString().split("T")[0],attendedHours:"",conductedHours:""}),[eo,el]=(0,s.useState)(""),[ei,ec]=(0,s.useState)(null),[eu,ex]=(0,s.useState)(new Date),[em,eg]=(0,s.useState)(!1),[eh,ep]=(0,s.useState)(null);if(m)return(0,r.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gray-900",children:(0,r.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})});let eb=async e=>{e.preventDefault();try{await b(er),es({text:"",dueDate:""})}catch(e){console.error("Failed to add task:",e)}},ey=e=>{let t=e.target.value,a=ea(t);a?(eg(!0),ep(a.id),en({date:t,attendedHours:a.attendedHours.toString(),conductedHours:a.conductedHours.toString()}),(0,V.oR)("You are editing an existing attendance record",{icon:"\uD83D\uDCDD",style:{background:"#1f2937",color:"#fff",border:"1px solid rgba(59, 130, 246, 0.2)"}})):(eg(!1),ep(null),en({date:t,attendedHours:"",conductedHours:""}),el(""))},ef=()=>{if(em)return;let e=ea(ed.date);e&&(eg(!0),ep(e.id),en({date:ed.date,attendedHours:e.attendedHours.toString(),conductedHours:e.conductedHours.toString()}),(0,V.oR)("Editing existing attendance record",{icon:"\uD83D\uDCDD",style:{background:"#1f2937",color:"#fff",border:"1px solid rgba(245, 158, 11, 0.2)"}}))},ej=async e=>{e.preventDefault();let t=parseFloat(ed.attendedHours),a=parseFloat(ed.conductedHours);if(isNaN(t)||isNaN(a)){el("Please enter valid numbers");return}if(t<0||a<0){el("Hours cannot be negative");return}if(t>a){el("Attended hours cannot exceed conducted hours");return}el("");try{if(em&&eh)await W(eh,{date:ed.date,attendedHours:parseFloat(ed.attendedHours),conductedHours:parseFloat(ed.conductedHours)}),V.oR.success("Attendance updated successfully!",{icon:"✓",style:{background:"#1f2937",color:"#fff",border:"1px solid rgba(74, 222, 128, 0.2)"}});else{let e=ea(ed.date);if(e){eg(!0),ep(e.id),el("Attendance already exists for this date. You can edit it instead.");return}await q({date:ed.date,attendedHours:parseFloat(ed.attendedHours),conductedHours:parseFloat(ed.conductedHours)}),V.oR.success("Attendance recorded successfully!",{icon:"✅",style:{background:"#1f2937",color:"#fff",border:"1px solid rgba(74, 222, 128, 0.2)"}})}eg(!1),ep(null),en({date:new Date().toISOString().split("T")[0],attendedHours:"",conductedHours:""})}catch(e){V.oR.error(e.message||"Failed to save attendance"),console.error("Error saving attendance:",e)}},eN=e=>{let t=e.target.value,a=ed.conductedHours;en({...ed,attendedHours:t}),t&&a&&(parseFloat(t)>parseFloat(a)?el("Attended hours cannot exceed conducted hours"):el(""))};return(0,r.jsxs)("main",{className:"p-6 bg-gray-900 text-white",children:[(()=>{let e=new Date;return a&&a.some(t=>t.date&&(0,T.r)(new Date(t.date),e))})()&&(0,r.jsxs)(F.P.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center",whileHover:{backgroundColor:"rgba(34, 197, 94, 0.15)",borderColor:"rgba(34, 197, 94, 0.3)"},children:[(0,r.jsx)("div",{className:"bg-green-500/20 p-2 rounded-full mr-3",children:(0,r.jsx)(A.A,{size:20,className:"text-green-500"})}),(0,r.jsxs)("div",{className:"flex-1",children:[(0,r.jsx)("p",{className:"font-medium text-white",children:"Attendance Marked Successfully!"}),(0,r.jsx)("p",{className:"text-sm text-gray-300",children:"You've already recorded your attendance for today."})]}),(0,r.jsx)("button",{onClick:()=>ec(new Date),className:"text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 py-1 px-3 rounded-md ml-4 transition-colors",children:"View Details"})]}),(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6",children:[(0,r.jsx)(F.P.div,{className:"lg:col-span-4",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:(0,r.jsxs)(N,{className:"bg-gray-900/80 border-gray-800 shadow-xl h-full",children:[(0,r.jsxs)(v,{children:[(0,r.jsx)(w,{className:"text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text",children:"ATTENDANCE SCORE"}),(0,r.jsx)(H,{className:"text-gray-400",children:"Your overall attendance performance"})]}),(0,r.jsxs)(D,{className:"flex flex-col items-center justify-center h-full",children:[(0,r.jsxs)("div",{className:"relative w-48 h-48 mb-4",children:[(0,r.jsx)("div",{className:"absolute inset-0 rounded-full bg-gray-800"}),(0,r.jsxs)("svg",{className:"absolute inset-0 w-full h-full",viewBox:"0 0 100 100",children:[(0,r.jsx)("circle",{cx:"50",cy:"50",r:"40",fill:"transparent",stroke:"#1F2937",strokeWidth:"10"}),(0,r.jsx)(F.P.circle,{cx:"50",cy:"50",r:"40",fill:"transparent",stroke:"url(#gradient)",strokeWidth:"10",strokeDasharray:"".concat(2*Math.PI*40),initial:{strokeDashoffset:2*Math.PI*40},animate:{strokeDashoffset:2*Math.PI*40*(1-((null==n?void 0:n.attendancePercentage)||0)/100)},transition:{duration:.8,ease:"easeOut",delay:.3},strokeLinecap:"round",transform:"rotate(-90 50 50)"}),(0,r.jsx)("defs",{children:(0,r.jsxs)("linearGradient",{id:"gradient",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[(0,r.jsx)("stop",{offset:"0%",stopColor:"#c084fc"}),(0,r.jsx)("stop",{offset:"100%",stopColor:"#60a5fa"})]})})]}),(0,r.jsxs)("div",{className:"absolute inset-0 flex items-center justify-center flex-col",children:[(0,r.jsxs)(F.P.span,{className:"text-4xl font-bold",initial:{opacity:0},animate:{opacity:1},transition:{duration:.6,delay:.8},children:[(null==n?void 0:n.attendancePercentage)||0,"%"]},(null==n?void 0:n.attendancePercentage)||0),(0,r.jsx)(F.P.span,{className:"text-sm text-gray-400",initial:{opacity:0},animate:{opacity:1},transition:{duration:.6,delay:1},children:"Attendance"})]})]}),(0,r.jsxs)("div",{className:"w-full grid grid-cols-2 gap-4 mt-4",children:[(0,r.jsxs)(F.P.div,{className:"bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex flex-col items-center",whileHover:{scale:1.03,backgroundColor:"rgba(31, 41, 55, 0.7)",transition:{duration:.2}},children:[(0,r.jsx)("p",{className:"text-xs text-gray-400",children:"Attended"}),(0,r.jsxs)("p",{className:"text-xl font-medium",children:[Math.round((null==n?void 0:n.totalAttendedHours)||0)," hrs"]})]}),(0,r.jsxs)(F.P.div,{className:"bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex flex-col items-center",whileHover:{scale:1.03,backgroundColor:"rgba(31, 41, 55, 0.7)",transition:{duration:.2}},children:[(0,r.jsx)("p",{className:"text-xs text-gray-400",children:"Conducted"}),(0,r.jsxs)("p",{className:"text-xl font-medium",children:[Math.round((null==n?void 0:n.totalConductedHours)||0)," hrs"]})]})]})]})]})}),(0,r.jsx)(F.P.div,{className:"lg:col-span-4",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.1},children:(0,r.jsxs)(N,{className:"bg-gray-900/80 border-gray-800 shadow-xl h-full",children:[(0,r.jsxs)(v,{children:[(0,r.jsx)(w,{className:"text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text",children:"ADD ATTENDANCE"}),(0,r.jsx)(H,{className:"text-gray-400",children:"Record your daily attendance"})]}),(0,r.jsxs)(D,{children:[em?(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("form",{onSubmit:ej,className:"space-y-4",children:[(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("div",{className:"flex justify-between items-center",children:[(0,r.jsx)("label",{className:"text-sm text-gray-400",children:"Date"}),(0,r.jsxs)("div",{className:"text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full flex items-center gap-1",children:[(0,r.jsx)(k.A,{size:12}),(0,r.jsx)("span",{children:"Editing"})]})]}),(0,r.jsx)("input",{type:"date",value:ed.date,onChange:ey,className:"w-full p-2 bg-gray-800 border border-gray-700 rounded text-white",required:!0})]}),(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("label",{className:"text-sm text-gray-400 flex items-center gap-1.5",children:[(0,r.jsx)(M.A,{className:"h-3.5 w-3.5 text-gray-500"}),"Hours Attended"]}),(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)("input",{type:"number",placeholder:"0",value:ed.attendedHours,onChange:eN,onFocus:ef,className:"w-full p-2 pl-3 bg-gray-800 border rounded text-white transition-all duration-200\n                              ".concat(eo?"border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]":"border-gray-700"),min:"0",step:"1",required:!0}),eo&&(0,r.jsx)(F.P.div,{initial:{scale:.5},animate:{scale:1},className:"absolute top-1/2 right-2 -translate-y-1/2 text-red-500",children:(0,r.jsx)(B.A,{className:"h-4 w-4"})})]})]}),(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("label",{className:"text-sm text-gray-400 flex items-center gap-1.5",children:[(0,r.jsx)(M.A,{className:"h-3.5 w-3.5 text-gray-500"}),"Hours Conducted"]}),(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)("input",{type:"number",placeholder:"0",value:ed.conductedHours,onChange:e=>{let t=e.target.value;en({...ed,conductedHours:t}),ed.attendedHours&&t&&(parseFloat(ed.attendedHours)>parseFloat(t)?el("Attended hours cannot exceed conducted hours"):el(""))},onFocus:ef,className:"w-full p-2 pl-3 bg-gray-800 border rounded text-white transition-all duration-200\n                              ".concat(eo?"border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]":"border-gray-700"),min:"0",step:"1",required:!0}),eo&&(0,r.jsx)(F.P.div,{initial:{scale:.5},animate:{scale:1},className:"absolute top-1/2 right-2 -translate-y-1/2 text-red-500",children:(0,r.jsx)(B.A,{className:"h-4 w-4"})})]})]})]}),(0,r.jsx)(z.N,{children:eo&&(0,r.jsxs)(F.P.div,{className:"bg-red-900/20 border border-red-500/30 rounded-md p-2 flex items-start gap-2",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,height:0},transition:{duration:.2},children:[(0,r.jsx)(B.A,{className:"h-4 w-4 text-red-400 mt-0.5 flex-shrink-0"}),(0,r.jsx)("p",{className:"text-sm text-red-200",children:eo})]})}),(0,r.jsxs)("div",{className:"flex gap-3",children:[(0,r.jsx)("button",{type:"submit",className:"flex-1 p-2 rounded transition-all duration-300\n                          ".concat(eo?"bg-gray-700 text-gray-400 cursor-not-allowed":"bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/20"),disabled:!!eo,children:eo?"Fix Errors to Continue":"Update Attendance"}),(0,r.jsx)("button",{type:"button",onClick:()=>{eg(!1),ep(null),en({date:new Date().toISOString().split("T")[0],attendedHours:"",conductedHours:""}),el("")},className:"p-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-800 transition-colors",children:"Cancel"})]})]})}):(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("form",{onSubmit:ej,className:"space-y-4",children:[(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsx)("label",{className:"text-sm text-gray-400",children:"Date"}),(0,r.jsx)("input",{type:"date",value:ed.date,onChange:ey,className:"w-full p-2 bg-gray-800 border border-gray-700 rounded text-white",required:!0})]}),(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("label",{className:"text-sm text-gray-400 flex items-center gap-1.5",children:[(0,r.jsx)(M.A,{className:"h-3.5 w-3.5 text-gray-500"}),"Hours Attended"]}),(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)("input",{type:"number",placeholder:"0",value:ed.attendedHours,onChange:eN,onFocus:ef,className:"w-full p-2 pl-3 bg-gray-800 border rounded text-white transition-all duration-200\n                              ".concat(eo?"border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]":"border-gray-700"),min:"0",step:"1",required:!0}),eo&&(0,r.jsx)(F.P.div,{initial:{scale:.5},animate:{scale:1},className:"absolute top-1/2 right-2 -translate-y-1/2 text-red-500",children:(0,r.jsx)(B.A,{className:"h-4 w-4"})})]})]}),(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("label",{className:"text-sm text-gray-400 flex items-center gap-1.5",children:[(0,r.jsx)(M.A,{className:"h-3.5 w-3.5 text-gray-500"}),"Hours Conducted"]}),(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)("input",{type:"number",placeholder:"0",value:ed.conductedHours,onChange:e=>{let t=e.target.value;en({...ed,conductedHours:t}),ed.attendedHours&&t&&(parseFloat(ed.attendedHours)>parseFloat(t)?el("Attended hours cannot exceed conducted hours"):el(""))},onFocus:ef,className:"w-full p-2 pl-3 bg-gray-800 border rounded text-white transition-all duration-200\n                              ".concat(eo?"border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]":"border-gray-700"),min:"0",step:"1",required:!0}),eo&&(0,r.jsx)(F.P.div,{initial:{scale:.5},animate:{scale:1},className:"absolute top-1/2 right-2 -translate-y-1/2 text-red-500",children:(0,r.jsx)(B.A,{className:"h-4 w-4"})})]})]})]}),(0,r.jsx)(z.N,{children:eo&&(0,r.jsxs)(F.P.div,{className:"bg-red-900/20 border border-red-500/30 rounded-md p-2 flex items-start gap-2",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,height:0},transition:{duration:.2},children:[(0,r.jsx)(B.A,{className:"h-4 w-4 text-red-400 mt-0.5 flex-shrink-0"}),(0,r.jsx)("p",{className:"text-sm text-red-200",children:eo})]})}),(0,r.jsx)("button",{type:"submit",className:"w-full p-2 rounded mt-3 transition-all duration-300\n                        ".concat(eo?"bg-gray-700 text-gray-400 cursor-not-allowed":"bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/20"),disabled:!!eo,children:eo?"Fix Errors to Continue":"Add Attendance Record"})]})}),(0,r.jsxs)("div",{className:"mt-4 pt-4 border-t border-gray-800",children:[(0,r.jsxs)("div",{className:"flex justify-between items-center",children:[(0,r.jsx)("p",{className:"text-sm text-gray-400",children:"Current Month Statistics"}),(0,r.jsxs)("p",{className:"text-sm font-medium",children:[et(a||[]),"%"]})]}),(0,r.jsx)("div",{className:"h-2 bg-gray-800 mt-2 rounded overflow-hidden",children:(0,r.jsx)(F.P.div,{className:"h-full bg-gradient-to-r from-purple-500 to-blue-500",initial:{width:0},animate:{width:"".concat(et(a||[]),"%")},transition:{duration:1.1,ease:"easeOut"}})}),(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-2 mt-4",children:[(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsx)("p",{className:"text-xs text-gray-400",children:"Month Attended"}),(0,r.jsxs)("p",{className:"text-lg font-medium",children:[Math.round(X(a||[]))," hrs"]})]}),(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsx)("p",{className:"text-xs text-gray-400",children:"Month Conducted"}),(0,r.jsxs)("p",{className:"text-lg font-medium",children:[Math.round(ee(a||[]))," hrs"]})]})]})]})]})]})}),(0,r.jsx)(F.P.div,{className:"lg:col-span-4",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},children:(0,r.jsxs)(N,{className:"bg-gray-900/80 border-gray-800 shadow-xl h-full",children:[(0,r.jsx)(v,{children:(0,r.jsx)("div",{className:"flex justify-between items-center",children:(0,r.jsx)(w,{className:"text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text",children:"TASKS"})})}),(0,r.jsxs)(D,{children:[(0,r.jsxs)("form",{onSubmit:eb,className:"mb-4",children:[(0,r.jsxs)("div",{className:"grid grid-cols-1 gap-3 mb-3",children:[(0,r.jsx)("input",{type:"text",placeholder:"New task...",value:er.text,onChange:e=>es({...er,text:e.target.value}),className:"w-full p-2 bg-gray-800 border border-gray-700 rounded text-white",required:!0}),(0,r.jsx)("div",{className:"relative",children:(0,r.jsx)("input",{type:"date",value:er.dueDate,onChange:e=>es({...er,dueDate:e.target.value}),className:"w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"})})]}),(0,r.jsx)("button",{type:"submit",className:"w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded",children:"Add Task"})]}),(0,r.jsx)("div",{className:"space-y-3 max-h-[280px] overflow-y-auto pr-1",children:t&&0===t.length?(0,r.jsxs)(F.P.div,{initial:{opacity:0},animate:{opacity:1},className:"text-center py-8",children:[(0,r.jsx)("svg",{className:"mx-auto h-12 w-12 text-gray-700",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1,d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 012 2"})}),(0,r.jsx)("p",{className:"mt-2 text-sm text-gray-500",children:"No tasks yet"}),(0,r.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Add your first task using the form above"})]}):t&&t.map(e=>(0,r.jsxs)("div",{className:"bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-3",children:[(0,r.jsx)("div",{className:"min-w-[20px] h-5 w-5 rounded border ".concat(e.completed?"bg-blue-500 border-blue-600":"border-gray-600"," \n                        flex items-center justify-center cursor-pointer"),onClick:()=>j(e.id,!e.completed),children:e.completed&&(0,r.jsx)(E.A,{className:"w-3 h-3 text-white"})}),(0,r.jsxs)("div",{className:"flex-1 min-w-0",children:[" ",(0,r.jsx)("p",{className:"".concat(e.completed?"line-through text-gray-500":"text-white"," truncate"),children:e.text}),e.dueDate&&(0,r.jsxs)("p",{className:"text-xs text-gray-400 truncate",children:["Due: ",new Date(e.dueDate).toLocaleDateString()]})]}),(0,r.jsx)("button",{onClick:()=>G(e.id),className:"text-gray-500 hover:text-red-400 ml-auto",children:(0,r.jsx)(C.A,{className:"w-4 h-4"})})]},e.id))})]})]})}),(0,r.jsx)(F.P.div,{className:"lg:col-span-8 col-span-12",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.3},children:(0,r.jsxs)(N,{className:"bg-gray-900/80 border-gray-800 shadow-xl h-full backdrop-blur-sm",children:[(0,r.jsxs)(v,{className:"pb-2",children:[(0,r.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2",children:[(0,r.jsx)(w,{className:"text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text",children:"CALENDAR"}),(0,r.jsx)("div",{className:"flex items-center gap-2",children:(0,r.jsxs)(R,{children:[(0,r.jsx)(L,{asChild:!0,children:(0,r.jsxs)(I.$,{variant:"outline",className:"text-gray-400 border-gray-700 flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-sm",children:[(0,r.jsx)(_.A,{className:"h-4 w-4 text-purple-400"}),(0,r.jsx)("span",{className:"truncate max-w-[120px]",children:ei?(0,O.GP)(ei,"MMM d, yyyy"):"Pick a date"})]})}),(0,r.jsx)(Y,{className:"w-auto p-0 bg-gray-900 border-gray-700",children:(0,r.jsx)(J,{mode:"single",selected:ei,onSelect:ec,initialFocus:!0,className:"bg-gray-900 text-white"})})]})})]}),(0,r.jsx)(H,{className:"text-gray-400",children:"Track your schedule and events"})]}),(0,r.jsxs)(D,{className:"p-0",children:[(0,r.jsxs)("div",{className:"rounded-lg border border-gray-800",children:[(0,r.jsxs)("div",{className:"flex justify-between items-center p-3 sm:p-4 bg-gray-800/50",children:[(0,r.jsx)(I.$,{variant:"outline",size:"icon",onClick:()=>{let e=new Date(eu);e.setMonth(e.getMonth()-1),ex(e)},className:"h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700",children:(0,r.jsx)(S.A,{className:"h-4 w-4"})}),(0,r.jsx)("h3",{className:"text-base md:text-lg font-medium",children:(0,O.GP)(eu,"MMMM yyyy")}),(0,r.jsx)(I.$,{variant:"outline",size:"icon",onClick:()=>{let e=new Date(eu);e.setMonth(e.getMonth()+1),ex(e)},className:"h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700",children:(0,r.jsx)(P.A,{className:"h-4 w-4"})})]}),(0,r.jsx)("div",{className:"grid grid-cols-7 text-center bg-gray-800/30",children:[{id:"mon",label:"M"},{id:"tue",label:"T"},{id:"wed",label:"W"},{id:"thu",label:"Th"},{id:"fri",label:"F"},{id:"sat",label:"S"},{id:"sun",label:"Su"}].map(e=>(0,r.jsx)("div",{className:"py-2 text-gray-400 font-medium border-b border-gray-800",children:e.label},e.id))}),(0,r.jsx)("div",{className:"bg-gray-900/20",children:(e=>{let t=e.getFullYear(),a=e.getMonth(),r=new Date(t,a,1),s=new Date(t,a+1,0),d=r.getDay();0===d&&(d=7),d--;let n=s.getDate(),o=Math.ceil((n+d)/7),l=[],i=1,c=new Date(t,a,0).getDate();for(let e=0;e<o;e++){let r=[];for(let s=0;s<7;s++)if(0===e&&s<d){let e=c-(d-s)+1;r.push(new Date(t,a-1,e))}else i>n?r.push(new Date(t,a+1,i-n)):r.push(new Date(t,a,i)),i++;l.push(r)}return l})(eu).map((e,s)=>(0,r.jsx)("div",{className:"grid grid-cols-7",children:e.map((e,d)=>{let n=t&&Array.isArray(t)?t.filter(t=>t.dueDate&&(0,T.r)(new Date(t.dueDate),e)):[],o=a&&Array.isArray(a)?a.find(t=>t.date&&(0,T.r)(new Date(t.date),e)):null,l=(0,T.r)(e,new Date),i=(0,U.t)(e,eu);return(0,r.jsxs)($,{children:[(0,r.jsx)(K,{asChild:!0,children:(0,r.jsxs)("div",{onClick:()=>ec(e),className:"\n                                  min-h-[40px] sm:min-h-[50px] md:min-h-[60px] p-1 sm:p-2 \n                                  border border-gray-800 relative cursor-pointer\n                                  ".concat(i?"":"text-gray-600 bg-gray-900/40","\n                                  ").concat(l?"bg-purple-900/20":"hover:bg-gray-800/50","\n                                  ").concat((0,T.r)(e,ei)?"bg-gray-700/50 border-purple-500":"","\n                                "),children:[(0,r.jsx)("span",{className:"\n                                  absolute top-1 right-1 text-sm font-medium\n                                  ".concat(l?"bg-purple-500 text-white h-6 w-6 flex items-center justify-center rounded-full":"","\n                                "),children:(0,O.GP)(e,"d")}),(0,r.jsxs)("div",{className:"absolute bottom-1 left-1 flex space-x-1",children:[n.length>0&&(0,r.jsx)("div",{className:"h-2 w-2 rounded-full bg-blue-500"}),o&&(0,r.jsxs)("div",{className:"absolute bottom-1 left-1 flex items-center",children:[(0,r.jsx)("div",{className:"h-2 w-2 rounded-full mr-0.5\n                                          ".concat(0===Number(o.attendedHours)?"bg-red-500":Number(o.attendedHours)<Number(o.conductedHours)?"bg-yellow-500":"bg-green-500")}),(0,r.jsxs)("span",{className:"text-[0.6rem] text-gray-400",children:[Math.round(o.attendedHours),"/",Math.round(o.conductedHours)]})]})]})]})}),(0,r.jsxs)(Q,{className:"bg-gray-800 border-gray-700 text-xs p-2 z-50",children:[(0,r.jsx)("div",{className:"font-medium",children:(0,O.GP)(e,"EEE, MMM d")}),n.length>0&&(0,r.jsxs)("div",{className:"text-blue-400 mt-1",children:[n.length," task",1!==n.length?"s":""]}),o&&(0,r.jsxs)("div",{className:"text-green-400 mt-1",children:[o.attendedHours,"/",o.conductedHours," hrs"]})]})]},"".concat(s,"-").concat(d))})},s))})]}),ei&&(0,r.jsxs)("div",{className:"mt-3 p-3 border-t border-gray-800",children:[(0,r.jsx)("h3",{className:"text-sm font-medium mb-2",children:(0,O.GP)(ei,"EEEE, MMMM d, yyyy")}),(0,r.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[(0,r.jsxs)("div",{className:"bg-gray-800/50 p-2 rounded-lg border border-gray-700",children:[(0,r.jsx)("h4",{className:"text-xs font-medium mb-1.5",children:"Attendance"}),(()=>{let e=a&&Array.isArray(a)?a.find(e=>e.date&&(0,T.r)(new Date(e.date),ei)):null;return e?(0,r.jsxs)("div",{className:"flex justify-between items-center",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"text-xs text-gray-400",children:"Attended"}),(0,r.jsxs)("p",{className:"text-sm font-medium",children:[e.attendedHours," hrs"]})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"text-xs text-gray-400",children:"Conducted"}),(0,r.jsxs)("p",{className:"text-sm font-medium",children:[e.conductedHours," hrs"]})]})]}):(0,r.jsx)("p",{className:"text-gray-500 text-xs",children:"No attendance record"})})()]}),(0,r.jsxs)("div",{className:"bg-gray-800/50 p-2 rounded-lg border border-gray-700",children:[(0,r.jsx)("h4",{className:"text-xs font-medium mb-1.5",children:"Tasks"}),(()=>{let e=t&&Array.isArray(t)?t.filter(e=>e.dueDate&&(0,T.r)(new Date(e.dueDate),ei)):[];return e.length>0?(0,r.jsx)("div",{className:"space-y-1 max-h-16 overflow-y-auto pr-1",children:e.map(e=>(0,r.jsxs)("div",{className:"flex items-center text-xs",children:[(0,r.jsx)("div",{className:"min-w-[8px] h-2 mr-1.5 rounded-full \n                                      ".concat(e.completed?"bg-green-500":"bg-blue-500")}),(0,r.jsx)("span",{className:e.completed?"line-through text-gray-500":"",children:e.text})]},e.id))}):(0,r.jsx)("p",{className:"text-gray-500 text-xs",children:"No tasks due"})})()]})]})]})]})]})})]})]})}},8185:(e,t,a)=>{"use strict";a.d(t,{j:()=>o,db:()=>i,M:()=>l});var r=a(3915),s=a(6203),d=a(5317);let n=(0,r.Wp)({apiKey:"AIzaSyDgsESwCYJW7qdTSECKG-vMWesnDmV-pzw",authDomain:"trackasauruss.firebaseapp.com",projectId:"trackasauruss",storageBucket:"trackasauruss.firebasestorage.app",messagingSenderId:"14265541512",appId:"1:14265541512:web:5df496f8185d7dead7103d"}),o=(0,s.xI)(n),l=new s.HF,i=(0,d.aU)(n)},9434:(e,t,a)=>{"use strict";a.d(t,{cn:()=>d});var r=a(2596),s=a(9688);function d(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,s.QP)((0,r.$)(t))}}},e=>{var t=t=>e(e.s=t);e.O(0,[992,93,613,697,160,441,684,358],()=>t(7194)),_N_E=e.O()}]);