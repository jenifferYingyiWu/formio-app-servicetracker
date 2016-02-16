!function(){"use strict";angular.module("formioServiceTrackerApp",["formio","ui.router","ngMap","bgf.paginateAnything","angularMoment"]).filter("capitalize",[function(){return _.capitalize}]).filter("truncate",[function(){return function(e,t){return _.isNumber(t)&&(t={length:t}),_.truncate(e,t)}}]).provider("Resource",["$stateProvider",function(e){var t={};return{register:function(r,o,n){t[r]=r;var a=n&&n.parent?n.parent:null,i=r+"Id",s=function(e){var t={};return t[i]=e._id,t},m=function(e){return["$scope","$rootScope","$state","$stateParams","Formio","FormioUtils","$controller",e]},c=n&&n.templates?n.templates:{};e.state(r+"Index",{url:"/"+r,parent:a?a:null,params:n.params&&n.params.index,templateUrl:c.index?c.index:"views/resource/index.html",controller:m(function(e,t,a,m,c,u,l){e.currentResource={name:r,queryId:i,formUrl:o},e.$on("submissionView",function(e,t){a.go(r+".view",s(t))}),e.$on("submissionEdit",function(e,t){a.go(r+".edit",s(t))}),e.$on("submissionDelete",function(e,t){a.go(r+".delete",s(t))}),n&&n.index&&l(n.index,{$scope:e})})}).state(r+"Create",{url:"/create/"+r,parent:a?a:null,params:n.params&&n.params.create,templateUrl:c.create?c.create:"views/resource/create.html",controller:m(function(e,t,a,m,c,u,l){e.currentResource={name:r,queryId:i,formUrl:o},e.submission={data:{}};var d=!1;if(n&&n.create){var p=l(n.create,{$scope:e});d=p.handle||!1}d||e.$on("formSubmission",function(e,t){a.go(r+".view",s(t))})})}).state(r,{"abstract":!0,url:"/"+r+"/:"+i,parent:a?a:null,templateUrl:"views/resource.html",controller:m(function(e,t,s,m,c,u,l){var d=o+"/submission/"+m[i];e.currentResource=e[r]={name:r,queryId:i,formUrl:o,submissionUrl:d,formio:new c(d),resource:{},form:{},href:"/#/"+r+"/"+m[i]+"/",parent:a?e[a]:{href:"/#/",name:"home"}},e.currentResource.loadFormPromise=e.currentResource.formio.loadForm().then(function(t){e.currentResource.form=e[r].form=t}),e.currentResource.loadSubmissionPromise=e.currentResource.formio.loadSubmission().then(function(t){e.currentResource.resource=e[r].submission=t}),n&&n["abstract"]&&l(n["abstract"],{$scope:e})})}).state(r+".view",{url:"/",parent:r,params:n.params&&n.params.view,templateUrl:"views/"+r+"/view.html",controller:m(function(e,t,r,o,a,i,s){n&&n.view&&s(n.view,{$scope:e})})}).state(r+".edit",{url:"/edit",parent:r,params:n.params&&n.params.edit,templateUrl:c.edit?c.edit:"views/resource/edit.html",controller:m(function(e,t,o,a,i,m,c){var u=!1;if(n&&n.edit){var l=c(n.edit,{$scope:e});u=l.handle||!1}u||e.$on("formSubmission",function(e,t){o.go(r+".view",s(t))})})}).state(r+".delete",{url:"/delete",parent:r,params:n.params&&n.params["delete"],templateUrl:c["delete"]?c["delete"]:"views/resource/delete.html",controller:m(function(e,t,r,o,i,s,m){var c=!1;if(n&&n["delete"]){var u=m(n["delete"],{$scope:e});c=u.handle||!1}c||e.$on("delete",function(){a&&"home"!==a?r.go(a+".view"):r.go("home",null,{reload:!0})})})})},$get:function(){return t}}}]).directive("fileread",[function(){return{scope:{fileread:"="},link:function(e,t){t.bind("change",function(t){var r=new FileReader;r.onloadend=function(t){e.$apply(function(){e.fileread=jQuery(t.target.result)})},r.readAsText(t.target.files[0])})}}}]).config(["FormioProvider","ResourceProvider","$stateProvider","$urlRouterProvider","AppConfig",function(e,t,r,o,n){e.setBaseUrl(n.apiUrl),r.state("home",{url:"",templateUrl:"views/main.html"}).state("myforms",{url:"/forms",parent:"home",templateUrl:"views/myforms.html"}).state("auth",{"abstract":!0,url:"/auth",templateUrl:"views/user/auth.html"}).state("auth.dealerlogin",{url:"/dealer",parent:"auth",templateUrl:"views/user/dealerlogin.html",controller:["$scope","$state","$rootScope",function(e,t,r){e.$on("formSubmission",function(e,o){o&&(r.setUserRole("dealer"),r.user=o,t.go("home"))})}]}).state("auth.adminlogin",{url:"/admin",parent:"auth",templateUrl:"views/user/adminlogin.html",controller:["$scope","$state","$rootScope",function(e,t,r){e.$on("formSubmission",function(e,o){o&&(r.setUserRole("admin"),r.user=o,t.go("home"))})}]}).state("auth.contractorlogin",{url:"/contractor",parent:"auth",templateUrl:"views/user/contractorlogin.html",controller:["$scope","$state","$rootScope",function(e,t,r){e.$on("formSubmission",function(e,o){o&&(r.setUserRole("contractor"),r.user=o,t.go("home"))})}]});var a=function(e,t,r){var o=[],n=e.$on("formLoad",function(e,n){t.eachComponent(n.components,function(e){for(var t in r){var n=r[t];e.key===n&&(o.push({component:e,originalType:e.type}),e.type="hidden")}})});e.$on("$destroy",function(){n(),angular.forEach(o,function(e){e.component.type=e.originalType})})};t.register("contractor",n.contractorForm,{parent:"home",templates:{index:"views/contractor/index.html"},params:{index:{filter:{}}},index:["$scope","$rootScope","$stateParams",function(e,t,r){e.contractors=[],e.contractorsUrl=n.contractorForm+"/submission",e.filter=r.filter,t.isAdmin||(e.filter["dealer._id"]=t.getDealer()._id),e.urlParams=t.getUrlParams(e.filter)}],create:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||(e.submission.data={dealer:t.getDealer()},a(e,r,["dealer"]))}],view:["$scope","$rootScope","FormioUtils",function(e,t,r){var o=["password","submit"];t.isAdmin||o.push("dealer"),a(e,r,o)}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||a(e,r,["dealer"])}]}),t.register("customer",n.customerForm,{parent:"home",templates:{index:"views/customer/index.html"},params:{index:{filter:{},showInactive:!1}},"abstract":["$scope","$rootScope",function(e,t){t.isAdmin||(e.hideDelete=!0)}],index:["$scope","$rootScope","$stateParams",function(e,t,r){e.customers=[],e.customersUrl=n.customerForm+"/submission",e.filter=r.filter,e.showInactive=r.showInactive,t.isAdmin||(e.filter["dealer._id"]=t.getDealer()._id),e.urlParams=t.getUrlParams(e.filter),e.showInactive||(e.urlParams["data.inactive"]=!1)}],create:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||(e.submission.data={dealer:t.getDealer()},a(e,r,["dealer"]))}],view:["$scope","$state","FormioAlerts",function(e,t,r){e.position={lat:"40.74",lng:"-74.18"},e.$watch("currentResource.resource.data.address.geometry.location",function(t){t&&(e.position.lat=t.lat,e.position.lng=t.lng)}),e.equipment=[],e.equipmentUrl=n.equipmentForm+"/submission",e.equipmentUrlParams={"data.customer._id":e.currentResource.resource._id},e.currentResource.loadSubmissionPromise.then(function(){e.paginatorResources=[{name:"equipment",url:n.equipmentForm+"/submission",params:{"data.customer._id":e.currentResource.resource._id},onClick:function(e){t.go("equipment.view",{equipmentId:e._id})},footerTemplate:"views/equipment/footer.html"},{name:"service",url:n.serviceForm+"/submission",params:{"data.appointment.data.customer._id":e.currentResource.resource._id},onClick:function(e){t.go("service.view",{serviceId:e._id})},footerTemplate:"views/service/footer.html"},{name:"appointment",url:n.appointmentForm+"/submission",params:{"data.customer._id":e.currentResource.resource._id},onClick:function(e){t.go("appointment.view",{appointmentId:e._id})},footerTemplate:"views/appointment/footer.html"}]}),e.getFooterTemplate=function(){if(e.paginatorResources&&e.paginatorFilter){var t=_.find(e.paginatorResources,{name:e.paginatorFilter.name});return t?t.footerTemplate:void 0}},e.$watch("paginatorFilter.name",function(t){!t&&e.paginatorFilter&&delete e.paginatorFilter.name})}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||a(e,r,["dealer"])}]}),t.register("dealer",n.dealerForm,{parent:"home",templates:{index:"views/dealer/index.html"},params:{index:{filter:{}}},index:["$scope","$rootScope","$stateParams","FormioUtils",function(e,t,r,o){t.isAdmin?(e.dealers=[],e.dealersUrl=n.dealerForm+"/submission",e.filter=r.filter,e.urlParams=t.getUrlParams(e.filter)):(e.dealerUrl=n.dealerForm+"/submission/"+t.getDealer()._id,t.isDealer||a(e,o,["password"]))}],create:["$scope","$rootScope","$state",function(e,t,r){t.isAdmin||r.go("home")}],view:["$scope","$rootScope","FormioUtils",function(e,t,r){a(e,r,["password","submit"])}],edit:["$scope","$rootScope","$state",function(e,t,r){t.isAdmin||r.go("home")}],"delete":["$scope","$rootScope","$state",function(e,t,r){t.isAdmin||r.go("home")}]}),t.register("appointment",n.appointmentForm,{parent:"home",templates:{index:"views/appointment/index.html"},params:{index:{filter:{},startDate:moment().startOf("day").toDate(),endDate:moment().endOf("day").add(7,"days").toDate(),time_filter:{},time_startDate:moment().startOf("day").toDate(),time_endDate:moment().endOf("day").toDate()},create:{customer:null}},index:["$scope","$rootScope","$stateParams","Formio",function(e,t,r,o){e.appointments=[],e.appointmentsUrl=n.appointmentForm+"/submission",e.filter=r.filter,e.minDate=moment().startOf("day").toDate(),e.startDate=r.startDate,e.endDate=r.endDate,t.isAdmin||(e.filter["customer.data.dealer._id"]=t.getDealer()._id),t.isContractor&&!e.filter["assignedContractor._id"]&&(e.filter["assignedContractor._id"]=t.user._id),e.urlParams=t.getUrlParams(e.filter),e.urlParams.sort="data.appointmentTime",e.urlParams["data.appointmentTime__gte"]=e.startDate.toISOString(),e.urlParams["data.appointmentTime__lte"]=e.endDate.toISOString(),e.timeclocks=[],e.timeclocksUrl=n.timeclockForm+"/submission",e.time_filter=r.time_filter,e.time_startDate=r.time_startDate,e.time_endDate=r.time_endDate,t.isContractor&&(e.time_filter["appointment.data.assignedContractor._id"]=t.user._id),t.isDealer&&(e.time_filter["appointment.data.assignedContractor.data.dealer._id"]=t.getDealer()._id),e.time_urlParams=t.getUrlParams(e.time_filter),e.time_urlParams.sort="data.time",e.time_urlParams["data.time__gte"]=e.time_startDate.toISOString(),e.time_urlParams["data.time__lte"]=e.time_endDate.toISOString(),e.refreshContractors=function(r){var a={};t.isAdmin||(a={"data.dealer._id":t.getDealer()._id}),r&&(a["data.name__regex"]="/"+_.escapeRegExp(r)+"/i"),new o(n.contractorForm).loadSubmissions({params:a}).then(function(t){e.contractors=t})}}],create:["$scope","$rootScope","$stateParams","FormioUtils",function(e,t,r,o){e.submission.data={},r.customer&&(e.submission.data.customer=r.customer),t.isAdmin||e.$on("formLoad",function(e,r){var n=o.getComponent(r.components,"customer"),a=o.getComponent(r.components,"assignedContractor"),i={"data.dealer._id":t.getDealer()._id};n.params=i,a.params=i}),t.isContractor&&(e.submission.data.assignedContractor=t.user)}],view:["$scope","$rootScope","$stateParams",function(e,t,r){e.timeclocks=[],e.timeclocksUrl=n.timeclockForm+"/submission",e.urlParams={sort:"data.time"},e.services=[],e.servicesUrl=n.serviceForm+"/submission",e.serviceUrlParams={"data.appointment._id":r.appointmentId,sort:"created"}}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||e.$on("formLoad",function(e,o){var n=r.getComponent(o.components,"customer"),a=r.getComponent(o.components,"assignedContractor"),i={"data.dealer._id":t.getDealer()._id};n.params=i,a.params=i})}]}),t.register("timeclock",n.timeclockForm,{parent:"home",params:{create:{appointmentId:null}},create:["$scope","$rootScope","$stateParams","Formio","FormioUtils",function(e,t,r,o,a){e.submission.data={},r.appointmentId&&new o(n.appointmentForm+"/submission/"+r.appointmentId).loadSubmission().then(function(t){e.submission.data.appointment=t}),t.isAdmin||e.$on("formLoad",function(e,r){var o,n=a.getComponent(r.components,"appointment");t.isDealer&&(o={"data.customer.data.dealer._id":t.getDealer()._id}),t.isContractor&&(o={"data.assignedContractor._id":t.user._id}),n.params=o}),e.$on("formSubmit",function(e,t){t.owner=t.data.appointment.data.assignedContractor._id}),navigator.geolocation?navigator.geolocation.getCurrentPosition(function(t){e.submission.data.gpsLatitude=t.coords.latitude,e.submission.data.gpsLongitude=t.coords.longitude},function(){console.warn("Unable to retrieve location")}):console.warn("Geolocation is not supported. Cannot add GPS data to this time entry.")}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||e.$on("formLoad",function(e,o){var n,a=r.getComponent(o.components,"appointment");t.isDealer&&(n={"data.customer.data.dealer._id":t.getDealer()._id}),t.isContractor&&(n={"data.assignedContractor._id":t.user._id}),a.params=n}),e.$on("formSubmit",function(e,t){t.owner=t.data.appointment.data.assignedContractor._id})}],"delete":["$scope","$rootScope","$state",function(e,t,r){return e.$on("delete",function(){r.go("appointment.view",{appointmentId:e.currentResource.resource.data.appointment._id})}),!0}]}),t.register("equipment",n.equipmentForm,{parent:"customer",params:{create:{customerId:null}},create:["$scope","$rootScope","$stateParams","Formio","FormioUtils",function(e,t,r,o,i){e.submission.data={},r.customerId&&(new o(n.customerForm+"/submission/"+r.customerId).loadSubmission().then(function(t){e.submission.data.customer=t}),a(e,i,["customer"])),t.isAdmin||e.$on("formLoad",function(e,r){var o=i.getComponent(r.components,"customer"),n={"data.dealer._id":t.getDealer()._id};o.params=n})}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){a(e,r,["customer"]),t.isAdmin||e.$on("formLoad",function(e,o){var n=r.getComponent(o.components,"customer"),a={"data.dealer._id":t.getDealer()._id};n.params=a})}]}),t.register("service",n.serviceForm,{parent:"appointment",create:["$scope","$rootScope","$stateParams","Formio","FormioUtils",function(e,t,r,o,i){e.submission.data={},r.appointmentId&&(new o(n.appointmentForm+"/submission/"+r.appointmentId).loadSubmission().then(function(t){e.submission.data.appointment=t}),a(e,i,["appointment"])),t.isAdmin||e.$on("formLoad",function(e,r){var o,n=i.getComponent(r.components,"appointment");t.isDealer&&(o={"data.customer.data.dealer._id":t.getDealer()._id}),t.isContractor&&(o={"data.assignedContractor._id":t.user._id}),n.params=o})}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){a(e,r,["appointment"]),t.isAdmin||e.$on("formLoad",function(e,o){var n,a=r.getComponent(o.components,"appointment");t.isDealer&&(n={"data.customer.data.dealer._id":t.getDealer()._id}),t.isContractor&&(n={"data.assignedContractor._id":t.user._id}),a.params=n})}]}),o.otherwise("/appointment")}]).factory("FormioAlerts",["$rootScope",function(e){var t=[];return{addAlert:function(r){e.alerts.push(r),r.element?angular.element("#form-group-"+r.element).addClass("has-error"):t.push(r)},getAlerts:function(){var e=angular.copy(t);return t.length=0,t=[],e},onError:function r(e){if(e.message)this.addAlert({type:"danger",message:e.message,element:e.path});else{var t=e.hasOwnProperty("errors")?e.errors:e.data.errors;angular.forEach(t,r.bind(this))}}}}]).directive("resourcePanel",function(){return{restrict:"E",replace:!0,scope:{index:"&",title:"=",queryId:"="},templateUrl:"views/resource/panel.html"}}).directive("multiPaginator",["$q","$http","FormioAlerts",function(e,t,r){return{replace:!1,restrict:"E",require:"ngModel",scope:{resources:"=",perPage:"=",filter:"=",currentPage:"="},templateUrl:"views/multiPaginator.html",link:function(o,n,a,i){o.items=[],o.filteredItems=[],o.currentPage=o.currentPage||1,o.perPage=o.perPage||10,o.filter=o.filter||{};var s=function(){o.resources&&o.resources.length&&e.all(o.resources.map(function(e){var r=_({limit:Number.MAX_SAFE_INTEGER}).assign(e.params||{}).map(function(e,t){return t+"="+e}).join("&");return t.get(e.url+"?"+r).then(function(t){return t.data.map(function(t){return _.assign({submission:t},e)})})})).then(function(e){o.items=_(e).flatten().orderBy(["submission.modified"],["desc"]).value()})["catch"](function(e){r.onError(e),console.error(e)})};o.$watch("resources",s,!0),o.$watch("[items, filter]",function(){o.filteredItems=_(o.items).filter(o.filter||void 0).value()},!0),o.$watch("[filteredItems, currentPage]",function(){var e=o.perPage*(o.currentPage-1);i.$setViewValue(o.filteredItems.slice(e,e+o.perPage)),i.$render()},!0),o.getCurrentItems=function(){return i.$viewValue}}}}]).factory("GoogleAnalytics",["$window","$state",function(e,t){var r=function(e){return e.parent?r(t.get(e.parent))+e.url:e.url};return{sendPageView:function(){e.ga("set","page",r(t.current)),e.ga("send","pageview")},sendEvent:function(t,r,o,n){e.ga("send","event",t,r,o,n)}}}]).run(["$rootScope","$state","$stateParams","Formio","FormioAlerts","AppConfig","GoogleAnalytics",function(e,t,r,o,n,a,i){e.company=a.company,e.baseUrl=a.apiUrl,e.dealerLoginForm=a.dealerLoginForm,e.adminLoginForm=a.adminLoginForm,e.contractorLoginForm=a.contractorLoginForm,e.setUserRole=function(t){if(e.isAdmin=!1,e.isDealer=!1,e.isContractor=!1,t)switch(e.role=t.toLowerCase(),t){case"dealer":e.isDealer=!0;break;case"contractor":e.isContractor=!0;break;case"admin":e.isAdmin=!0}else e.role=null;localStorage.setItem("userRole",t)},e.getUrlParams=function(e){return _(e||{}).mapValues(function(e){return"/"+_.escapeRegExp(e)+"/i"}).mapKeys(function(e,t){return"data."+t+"__regex"}).value()},e.getDealer=function(){return e.isDealer?e.user:e.isContractor?e.user.data.dealer:void 0},e.getUserName=function(){return e.user.data.name||e.user.data.firstName+" "+e.user.data.lastName},e.user||o.currentUser().then(function(t){e.user=t;var r=localStorage.getItem("userRole");r&&e.setUserRole(r)});var s=function(){t.go("auth.contractorlogin"),n.addAlert({type:"danger",message:"Your session has expired. Please log in again."})};e.$on("formio.sessionExpired",s),e.logout=function(){e.setUserRole(null),e.user=null,o.logout().then(function(){t.go("auth.contractorlogin")})["catch"](s)},e.isActive=function(e){return-1!==t.current.name.indexOf(e)},e.authenticated=!!o.getToken(),e.$on("$stateChangeStart",function(r,n){e.authenticated=!!o.getToken(),"auth"!==n.name.substr(0,4)&&((_.startsWith(n.name,"contractor")||_.startsWith(n.name,"dealer"))&&e.isContractor&&(r.preventDefault(),t.go("home",null,{reload:!0})),"home"===n.name&&(r.preventDefault(),t.go("appointmentIndex",null,{reload:!0})),e.authenticated||(r.preventDefault(),t.go("auth.contractorlogin")))}),e.$on("$stateChangeSuccess",function(){e.breadcrumbs=[];for(var o in t.$current.path){var a=t.$current.path[o];a["abstract"]&&e.breadcrumbs.push({name:a.name,state:a.name+".view({"+a.name+'Id:"'+r[a.name+"Id"]+'"})'})}e.alerts=n.getAlerts(),i.sendPageView()}),e.$state=t}])}();