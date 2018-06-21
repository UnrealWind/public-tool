angular.module('infi-basic').service("TaskService",['$http','SYS',function ($http,SYS) {
    /**
     * 调用左侧tab的数据
     * @returns {*}
     */
    function getSummaryList(filter){
        return $http.get(SYS.url+"basic.json").then(function success(msg){
            return msg.data;
        })
    }
    
    return{
        getSummaryList:getSummaryList
    }
}])