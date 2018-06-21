angular.module("infi-basic").controller('testNavi', ['$scope','naviServices',function($scope,naviServices){
	naviServices.getNaviData().then(function(msg){
	    $scope.naviData = msg.menus;
	})
	
}]);
