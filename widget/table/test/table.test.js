angular.module('infi-basic').controller('tableController',['$scope','tableService',function ($scope,tableService) {
    $scope.columns = [];
    $scope.content = [];
    
    tableService.getColumns().then(function(msg){
        $scope.columns = msg.data;
    });

    $scope.changePage = function(page,size){
        tableService.getContent(page,size).then(function(msg){
            $scope.content = msg.data;
        });
    };
    $scope.changePage(1,4);
}])

.service('tableService',['$http',function ($http) {
    function getColumns(){
        return $http.get('1.json').then(function success(msg){
            return msg.data;
        })
    }

    /**
     *
     * @param page
     * @param size
     * @returns {*}
     */
    function getContent(page,size){
        return $http.get('basic.page.content.json?page='+page+'&size='+size).then(function success(msg){
            return msg.data;
        })
    }
    return {
        getColumns:getColumns,
        getContent:getContent
    }
}]);