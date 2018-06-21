angular.module('infi-basic').controller('HomeController', ['$http','$timeout','$scope','Utils','SYS',function ($http,$timeout,$scope,Utils,SYS) {
    $scope.SYS = SYS;

    function init() {
        windowResize();
        $scope.loginName = getUrlParam('filter_loginName');  //获取url中的用户名
        $scope.uid = getUrlParam('filter_uuid');  //获取url中的用户id
        $scope.mobile = getUrlParam('filter_mobile');  //获取url中的电话
        $scope.clearPassword();
    }

    /*
        清空密码输入框,将数据初始化
     */
    $scope.clearPassword = function () {
        $scope.password = {
            newWord:'',
            newWordAgain:''
        };
        $scope.returnData = {};
        $scope.returnData.status = 'default';  //将返回值的状态动态修改,避免修改密码框再次出现错误提示

        //通过判断电话是否存在,判断页面中显示输入验证码还是直接修改用户密码
        if($scope.mobile){
            $scope.password.resetType = 'mobile';  //标示是手机修改还是邮箱修改
            $scope.password.showHtml = 'next';  //标示要显示输入验证码框还是直接修改密码框
            $scope.checkedPass = true;
        }else{
            $scope.password.resetType = 'email';
            $scope.password.showHtml = 'password';
            //邮箱链接验证接口
            $http.get(SYS.url+'email/validate?filter_loginName='+$scope.loginName+'&filter_uuid='+$scope.uid).then(function (msg) {
                if(msg.data.status != SYS.STATUS_SUCCESS){  //如果验证失败,给出提示不能再修改密码
                    var errorTip = {
                        status:'error',
                        description:'用户验证失败,不能修改密码'
                    };
                    Utils.sysTip($scope,errorTip);
                    $scope.checkedPass = false;
                }else{
                    $scope.checkedPass = true;
                }
            });
        }
    }

    init();

    //窗口变化时,动态调整修改密码框位置
    $(window).resize(function () {
        windowResize();
    });

    /**
     * 调整修改密码框位置
     */
    function windowResize() {
        var windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            headerHeight = $('header').height(),
            footerHeight = $('footer').height();
        var formHeight = windowHeight-headerHeight-footerHeight-50;
        $('form').height(formHeight+'px');
    }

    //获取url中参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    /**
     * 保存密码
     */
    $scope.commitPassword = function () {
        var paremUrl = $scope.password.resetType+'/appeal/save?filter_loginName='+$scope.loginName+'&filter_uuid='+$scope.uid+
            '&filter_newPassword='+md5($scope.password.newWord);
        $scope.password.resetType=='mobile'?paremUrl+='&filter_mobile='+$scope.filter_mobile:undefined;
        $http.get(SYS.url+paremUrl).then(function (msg) {
            $scope.returnData = msg.data;
            Utils.sysTip($scope,msg.data);
            $scope.clearPassword();  //无论密码保存成功或者不成功,到将密码输入框清空
        });
    }

    $scope.nextStep = function () {
        $http.get(SYS.url+'mobile/validate?filter_loginName='+$scope.loginName+'&filter_uuid='+$scope.uid+'&filter_mobile='
            +$scope.mobile+'&filter_checkCode='+$scope.password.checkCode).then(function (msg) {
            if(msg.data.status != SYS.STATUS_SUCCESS){  //如果验证失败,给出提示不能再修改密码
                Utils.sysTip($scope,msg.data);
            }else{
                $scope.password.showHtml = 'password';
            }
        });
    }
}]);