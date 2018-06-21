angular.module('infi-basic').
// app.
controller('LogicController',['$scope','LogicService',function ($scope,LogicService) {
    $scope.recordData = {};
    $scope.configureData =[]
    LogicService.getDropData().then(function (msg) {
        $scope.recordData = msg;
    })
    LogicService.getConfigureData().then(function (msg) {
        $scope.configureData = msg;
    })
}])
.service('LogicService',['$http',function ($http) {
        function getDropData() {
            return $http.get('logic.json').then(function sucess(msg) {
                return msg.data;
            })
        }

        function getConfigureData() {
            return $http.get('logic-configure.json').then(function sucess(msg) {
                return msg.data;
            })
        }

        return{
            getDropData:getDropData,
            getConfigureData:getConfigureData
        }
    }])