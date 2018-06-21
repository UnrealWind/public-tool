angular.module('infi-basic')
    .controller('AuditController', ['$scope','AuditService','SYS',function ($scope,AuditService,SYS) {
        $scope.SYS = SYS;
        //用于显示左侧tab的数据
        $scope.summaryData = {};
        //用于显示右侧性别、年龄等信息
        $scope.informationData = {};
        //用于显示点击某个名称出现的弹出框数据
        $scope.detailData = {
            id:"",  //点击的某个名称的id，通过id向后台查询详情
            keywords:"",   //用于更多搜索的关键字
            tagData:"",  //用于盛放标签搜索到的数据  gqm_debug：不知道后台传过来的标签的数据和全部的数据是不是一个数据？
            recordPage:"",  //用于盛放后台返回的原始数据
            pageResult:""  //盛放页面显示的数据
        };

        //盛放筛选的数据,同时筛选条件显示也是通过此数据显示的 gqm_debug：页面筛选时的数据不是filterData，所以操作筛选条件的X号时要通过id找到原始数据，将checked属性去掉
        $scope.filterData = "";

        /**
         * 页面初始化
         */
        init();
        function init(){
            //获取左侧tab数据 filter为不同医院不同病区
            AuditService.getSummaryList().then(function (msg) {
                $scope.summaryData = msg;
            });
            // TaskService.getInfoDetailData().then(function (msg) {
            //     $scope.detailData.recordPage = msg.data;
            //     console.log($scope.detailData.recordPage,8)
            // })
        }


        $scope.step = 1;
        $scope.extract_collection = function(){
            $('#infi-collection').modal({backdrop: 'static'});
        }
    }]).service("AuditService",['$http','SYS',function ($http,SYS) {
    /**
     * 调用左侧tab的数据
     * @returns {*}
     */
    function getSummaryList(filter){
        return $http.get(SYS.url+"context.json").then(function success(msg){
            return msg.data;
        })
    }

    return{
        getSummaryList:getSummaryList
    }
}]);