/**
 * 异步请求的拦截器配置
 */
angular.module('infi-basic').factory('httpInterceptor',['$q','$rootScope','Session','SYS','$location','TransformService',function ($q, $rootScope,Session,SYS,$location,TransformService) {
    return {
        request: function (config) {
            if( !Session.isAuthenticated() ){
                // $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            }
            if( config.url.indexOf('/login')<0 &&config.url.indexOf('/logout')<0&& config.url.indexOf('.html')<0){
                TransformService.setInterceptorUrl(config);
            }
            //$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return config;
        },
        response: function (response) {
            //登陆失效后跳转到登陆页面
            // if( response.data.status == SYS.STATUS_AUTH_FAIL ){
            //     response.data.description = '登陆超时,请重新登陆';
            //     window.localStorage.clear();   //清除localstorage
            //     $location.path('login');
            // }
            return response || $q.when(response);
        },
        responseError: function (response) {
            // console.log(response);
            response.data = {
                tipsFromServer: response.data,
                status : 'error',
                description: '服务器忙,请稍后再试'
            }
            if( response.status == '401'){ // Unauthorized — The user is not logged in
                response.data.description = '请登陆';
                window.localStorage.clear();   //清除localstorage
                $location.path('login');
            }
            if( response.status == '403'){ // Forbidden — The user is logged in but isn’t allowed access
                response.data.description = '对不起,您没有此操作权限,请联系管理员确认';
            }
            if( response.status == '419'){ // Authentication Timeout (non standard) — Session has expired
                response.data.description = '登陆超时,请重新登陆';
            }
            if( response.data.status == SYS.STATUS_AUTH_FAIL ){
                console.log(response.data);
                response.data.description = '登陆超时,请重新登陆';
            }
            // console.log(response);
            // console.log(response.data);
            return response;
        }
    }
}]);

//
// var js2 = angular.module("ajaxHttp", []);
// js2.factory("httpInterceptor", [ "$q", "$rootScope", function($q, $rootScope) {
//     return {
//         request: function(config) {
// // do something on request success
//             return config || $q.when(config);
//         },
//         requestError: function(rejection) {
//             // do something on request error
//             return $q.reject(rejection)
//         },
//         response: function(response) {
// // do something on response success
//             return response || $q.when(response);
//         },
//         responseError : function(rejection) {
// // do something on response error
//             return $q.reject(rejection);
//         }
//     };
// }]);

