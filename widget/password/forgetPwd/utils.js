angular.module("infi-basic",[]);
angular.module('infi-basic').service('Utils',['SYS','$timeout',function (SYS,$timeout) {
    function sysTip($scope,tip) {
        $scope.sysTip = angular.copy(tip);
        var show ;
        $timeout.cancel(show);
        show = $timeout(function () {
            if( $scope.sysTip ){
                $scope.sysTip.status = undefined;
            }
        },2500);
    }

    function sysTipBefore($scope,description) {
        sysTip($scope,{
            status: SYS.STATUS_QUERYING,
            description: description
        });
    }

    return {
        sysTip: sysTip,
        sysTipBefore: sysTipBefore
    }
}]);
angular.module('infi-basic').directive('sysTip',[function(){
    return{
        restrict: 'A',
        template:'<div ng-if="sysTip.status" '+
        'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\',\'black\':\'notice_error\'}[sysTip.status]">'+
        '{{sysTip.description}}</div>'
    }
}]);