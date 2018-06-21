angular.module('infi-basic').directive('infiMultiSearch',['$timeout',function($timeout) {
    return {
        restrict: 'A',
        templateUrl: '../src/widget/search/index.html',
        replace:true,
        scope: {
            searchData:"=",  //显示的数据
            searchId:"=",  //容器id
            boxId:"=",  //弹出层id
            selectedDetail:"&"  //选择内容后的具体操作
        },
        link: function (scope) {
            var test=new Vcity();
            test.initialize({input:scope.searchId,cityData:scope.searchData,boxId:scope.boxId,callback:scope.selectedDetail});
        }
    }
}])