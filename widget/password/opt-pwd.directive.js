angular.module('infi-basic').directive('changePwdModel', ['$http','$timeout','AuthService','$rootScope','$location','SYS',function ($http,$timeout,AuthService,$rootScope,$location,SYS) {
    return {
        restrict: 'A',
        replace:true,
        templateUrl: '../src/widget/password/changePwd/index.html',
        link: function (scope) {
            scope.returnData = {status:'default'}  //用于盛放修改密码接口连接的返回值
            var url = 'http://192.168.1.22:8080/security/user/';  //修改密码后台接口
            /**
             * 提交修改的密码
             */
            scope.commitPassword = function () {
                scope.password.$newWord = md5(scope.password.newWord);
                $http.put(url+'update/password?password='+scope.password.$newWord).then(function (msg) {
                    scope.returnData = msg.data;
                    if(scope.returnData.status == 'ok'){
                        $timeout(function () {
                            $('#passwordModel').modal('hide');
                            scope.clearPassword();

                            //修改密码成功后推出登录
                            AuthService.logout();
                            $rootScope.$broadcast(SYS.ROLES_READY,false);
                            $location.path('login');
                        },1000)
                    }
                });
            }

            /**
             * 点击关闭清空密码输入值
             */
            scope.clearPassword = function () {
                scope.password = {
                    oldWord:'',
                    newWord:'',
                    newWordAgain:''
                };
                scope.returnData.status = 'default';  //将返回值的状态动态修改,避免修改密码框再次出现错误提示
            }

            /**
             * 输入的密码框输入改变时,将出现的错误提示抹掉
             */
            scope.passwordChange = function (type) {
                scope.returnData.status = 'default';
                if(type&&type  == 'original'&&scope.password.oldWord){
                    scope.password.$oldWord = md5(scope.password.oldWord);
                    $http.get(url+'valid?password='+scope.password.$oldWord).then(function (msg) {
                        if(msg.data && msg.data.data.vaild){
                            scope.checkPwd = true;
                        }else{
                            scope.checkPwd = false;
                        }
                    });
                }
            }
        }
    }
}])
    .directive('changePwd', [function () {
        return {
            restrict: 'A',
            // replace:true,
            template:'<p class="infi-header-name">'+
            '<a ng-click="showPasswordModal()" class="glyphicon">修改密码</a>'+
            '</p>',
            link: function (scope) {
                //展示修改密码弹框
                scope.showPasswordModal = function(){
                    $('#passwordModel').modal({backdrop: 'static'});
                }
            }
        }
    }])
    .directive('forgetPwd', [function () {
        return {
            restrict: 'A',
            // replace:true,
            template:'<span ng-click="showPasswordModal()">忘记密码?</span>',
            link: function (scope) {
                //展示修改密码弹框
                scope.showPasswordModal = function(){
                    $('#forgetPwdModel').modal({backdrop: 'static'});
                }
            }
        }
    }])
    .directive('forgetPwdModal', ['$http','$timeout',function ($http,$timeout) {
        return {
            restrict: 'A',
            templateUrl:'../src/widget/password/forgetPwd/forget-pwd-modal.html',
            link: function (scope) {
                var url = 'http://192.168.1.22:8080/security/sys/user/password/';
                scope.returnData = {status:'default'};  //用于盛放修改密码接口连接的返回值
                scope.findType = 'email';
                //展示修改密码弹框
                scope.sendEmail = function(){
                    var typeUrl = scope.findType == 'email' ? 'email/appeal' : 'mobile/appeal';
                    var pattern = scope.findType == 'email' ? '&filter_email='+scope.user.email : '&filter_mobile='+scope.user.phone;
                    $http.get(url+typeUrl+'?filter_loginName='+scope.user.name+pattern).then(function (msg) {
                        scope.returnData = msg.data;
                        if(scope.returnData.status == 'ok'){
                            $timeout(function () {
                                $('#forgetPwdModel').modal('hide');
                                if(scope.findType == 'phone'){
                                    var path = 'http://'+window.location.hostname+':'+window.location.port;
                                    window.open(path + '/src/widget/password/forgetPwd/index.html?filter_loginName='+scope.user.name
                                        +'&filter_mobile='+scope.user.phone+'&filter_'+msg.data.data);
                                }
                                scope.clearPassword('close');
                            },2000)
                        }
                    });
                }

                /**
                 * 修改找回密码类型
                 * @param type
                 */
                scope.changeFindType = function (type) {
                    scope.findType = type;
                }

                scope.clearPassword = function (type) {
                    scope.user = {
                        name:"",
                        email:"",
                        phone:""
                    }
                    scope.returnData = {status:'default'};  //用于盛放修改密码接口连接的返回值
                    type?scope.findType = 'email':undefined;  //通过关闭按钮关闭的要将状态改为初始邮箱校验
                }

                /**
                 * 输入的密码框输入改变时,将出现的错误提示抹掉
                 */
                scope.userChange = function () {
                    scope.returnData.status = 'default';
                    console.log()
                }
            }
        }
    }])