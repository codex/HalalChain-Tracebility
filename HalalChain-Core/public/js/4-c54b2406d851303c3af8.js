webpackJsonp([4],{698:function(e,t,n){"use strict";function a(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function c(e){return{user:e.user,come:e.come}}function s(e){return{comeActions:(0,I.bindActionCreators)(T,e)}}Object.defineProperty(t,"__esModule",{value:!0});var d=n(32),f=r(d),p=n(147),m=r(p),h=n(297),b=r(h),g=n(81),y=r(g),v=n(80),w=r(v),x=n(82),O=r(x),k=n(46),P=r(k),E=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},_=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),S=n(1),C=r(S),I=n(44),j=(n(66),n(61)),N=(n(28),n(71)),A=r(N),M=n(70),T=a(M),F=n(153),R=(r(F),n(128)),D=r(R),K=n(700),L=r(K),z=n(104),B=n(699),J=r(B);n(1003);var V=n(3),Y=r(V),q=f.default.Item,H={labelCol:{span:7},wrapperCol:{span:15}},Q=O.default.Option,W=function(e){function t(){var e,n,a,r;i(this,t);for(var o=arguments.length,u=Array(o),c=0;c<o;c++)u[c]=arguments[c];return n=a=l(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(u))),a.state={isLoading:!1,selectedRowKeys:[],visible:!1,count:1,dataSource:[],columns:[{title:"No.",width:"80px",dataIndex:"index"},{title:"Ear Tag No.",width:"240px",dataIndex:"productId",render:function(e,t,n){return C.default.createElement(L.default,{val:t.productId,index:n,onInputChange:a.handleProductBlur.bind(a)})}},{title:"Breed",width:"130px",dataIndex:"kind"},{title:"Lairage Time",width:"180px",dataIndex:"lairageTime"},{title:"Out-Fence",width:"130px",dataIndex:"fattenedTime"},{title:"Location",width:"120px",dataIndex:"mapPosition"},{title:"Terminals",width:"120px",dataIndex:"iName"},{title:"Animal Age",dataIndex:"days",width:"130px",render:function(e,t,n){return t.days}}]},r=n,l(a,r)}return u(t,e),_(t,[{key:"componentWillMount",value:function(){document.title="Out-Fence"}},{key:"handleProductBlur",value:function(e,t){var n=this;if(e=e.trim()){var a=JSON.stringify({ProductId:e}),r=this.state,o=(r.count,r.dataSource);this.props.comeActions.getProductDetail({data:{fcn:"QueryProductDetail",args:["QueryProductDetail",a],peers:D.default},success:function(e){o.map(function(n,a){a==t&&(n=E({},n,JSON.parse(e.payloads[0]),{iName:"Farmer",fattenedTime:(0,Y.default)().format("YYYY-MM-DD HH:MM:ss")}),o[a]=n)}),n.setState({dataSource:o})},fail:function(){console.log("fail")}})}}},{key:"gotoLink",value:function(e){this.props.router.push(e)}},{key:"handleTableCell",value:function(e){console.log(e)}},{key:"handleAdd",value:function(){var e=this.state,t=e.count,n=e.dataSource,a={index:t,productId:"",kind:"",lairage:"",fattenedTime:"",mapPosition:"",iName:"",days:""};this.setState({dataSource:[].concat(o(n),[a]),count:t+1})}},{key:"hideModal",value:function(){this.setState({visible:!1})}},{key:"okModal",value:function(){var e=this,t=[],n=this;this.props.form.validateFields(function(a,r){a||(e.setState({visible:!1}),e.state.dataSource.map(function(a,o){e.state.selectedRowKeys.map(function(e,o){if(a.index===e+1){var i=JSON.stringify({productId:a.productId,comment:"Out-Fence",mapPosition:a.mapPosition,operator:a.iName,fattenedTime:a.fattenedTime,fattenedCause:z.outResult.filter(function(e){return e.value==r.fattenedCause})[0].name}),l=JSON.stringify({productId:a.productId,toOrgMsgId:"butcher"});t.push(new Promise(function(e,t){n.props.comeActions.commonAjax({data:{fcn:"ChangeProduct",args:["ChangeProduct",i],peers:D.default},success:function(){n.props.comeActions.commonAjax({data:{fcn:"ChangeOwner",args:["ChangeOwner",l],peers:D.default},success:function(){e("Success")},fail:function(){t("Failed")}})},fail:function(){t("ChangeProduct failed")}})})),n.setState({isLoading:!0}),Promise.all(t).then(function(e){e.length===t.length&&(n.setState({isLoading:!1}),A.default.success("Success",1,function(){window.location.reload()}))},function(e){n.setState({isLoading:!1}),A.default.success("Failed",1)})}})}))})}},{key:"submit",value:function(){var e=this;if(!this.state.selectedRowKeys.length)return void A.default.warning("Please input the out-fence item");var t=!0;return this.state.selectedRowKeys.map(function(n){e.state.dataSource[n]&&e.state.dataSource[n].productId||(t=!1)}),t?void this.setState({visible:!0}):void A.default.error("Please input the out-fence item")}},{key:"render",value:function(){var e=this,t=this.props.form.getFieldDecorator,n=this.state.isLoading,a={columns:this.state.columns,dataSource:this.state.dataSource,rowSelection:{selectedRowKeys:this.state.selectedRowKeys,onChange:function(t){e.setState({selectedRowKeys:t})}}};return C.default.createElement("div",{className:"out-wrapper"},C.default.createElement("div",{className:"content"},C.default.createElement("p",{className:"title"},"Farming Out Fence Operation"),C.default.createElement("div",{className:"main-table"},C.default.createElement(J.default,{listProps:a}),C.default.createElement("div",{className:"btn-wrap"},C.default.createElement(P.default,{className:"submit-btn-add",onClick:this.handleAdd.bind(this)},"Add"),C.default.createElement(P.default,{onClick:this.submit.bind(this),className:"submit-btn"},"Confirm")))),C.default.createElement(b.default,{title:"Confirm",visible:this.state.visible,onOk:this.okModal.bind(this),onCancel:this.hideModal.bind(this),okText:"Submit"},C.default.createElement(y.default,null,C.default.createElement(w.default,null,C.default.createElement(q,E({label:"remark"},H),t("fattenedCause",{initialValue:"",rules:[{required:!0,message:"please select remark"}]})(C.default.createElement(O.default,{className:"select-modal"},z.outResult.map(function(e,t){return C.default.createElement(Q,{key:t,value:e.value},e.name)}))))),C.default.createElement(w.default,null,C.default.createElement(q,E({label:"destination"},H),t("destination",{initialValue:"",rules:[{required:!0,message:"please select destination"}]})(C.default.createElement(O.default,{className:"select-modal"},z.outPlace.map(function(e,t){return C.default.createElement(Q,{key:t,value:e.value},e.name)}))))))),n&&C.default.createElement("div",{className:"loading-wrap"},C.default.createElement(m.default,{size:"large"})))}}]),t}(S.Component);W=f.default.create()(W),t.default=(0,j.connect)(c,s)(W)},699:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(148),o=a(r),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},l=n(1),u=a(l),c=function(e){var t=e.listProps;return u.default.createElement("div",null,u.default.createElement("p",{className:"title"},"Approval history"),u.default.createElement(o.default,i({},t,{scroll:{x:"1200px"},pagination:!1,rowKey:function(e,t){return t}})))};t.default=c},700:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=n(32),u=a(l),c=n(47),s=a(c),d=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),f=n(1),p=a(f),m=function(e){function t(){var e,n,a,i;r(this,t);for(var l=arguments.length,u=Array(l),c=0;c<l;c++)u[c]=arguments[c];return n=a=o(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(u))),a.state={},i=n,o(a,i)}return i(t,e),d(t,[{key:"handleBlur",value:function(){var e=this.props,t=e.onInputChange,n=e.index,a=this.props.form,r=(a.getFieldDecorator,a.getFieldValue),o=r("productId");t(o,n)}},{key:"render",value:function(){var e=this.props,t=e.val,n=(e.onInputChange,this.props.form),a=n.getFieldDecorator;n.getFieldValue;return p.default.createElement("p",null,a("productId",{initialValue:t.productId})(p.default.createElement(s.default,{onBlur:this.handleBlur.bind(this)})))}}]),t}(p.default.Component);m=u.default.create()(m),t.default=m},970:function(e,t,n){t=e.exports=n(76)(),t.push([e.id,".out-wrapper .content{padding:30px;width:100%;background:#3399cd;border-radius:10px}.out-wrapper .content .title{color:#fff;font-size:20px}.out-wrapper .content .main-table{margin-top:25px;background:#fff;border-radius:30px;padding:38px 35px 22px;box-shadow:0 0 10px #ddd;min-height:380px}.out-wrapper .content .main-table .filter-title{font-size:24px;color:#323232}.out-wrapper .content .main-table .ant-table-thead{background:#f5f8ff}.out-wrapper .content .main-table .ant-table-thead span{font-size:18px;color:#323232}.out-wrapper .content .btn-wrap{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.out-wrapper .content .submit-btn,.out-wrapper .content .submit-btn-add{background:#6ec1ff;width:120px;height:40px;line-height:40px;margin-top:22px;font-size:16px;color:#fff;border-radius:100px}.out-wrapper .content .submit-btn-add{margin-right:20px;background:#4ecb73}.select-modal{width:300px}",""])},1003:function(e,t,n){var a=n(970);"string"==typeof a&&(a=[[e.id,a,""]]);n(79)(a,{});a.locals&&(e.exports=a.locals)}});