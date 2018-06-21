angular.module("infi-form").controller('inputData', ['$scope','testServices',function($scope,testServices){
	testServices.ajaxGroupData().then(function(msg){
		$scope.groupData = msg;
	});

	testServices.ajaxBasicInputData().then(function(msg){
		$scope.basicInput = msg;
	});

	testServices.ajaxChildIndexData().then(function(msg){
		$scope.childIndex = msg;
	});

	testServices.ajaxUpdateData().then(function(msg){
		$scope.update = msg;
	});
	
}]);




angular.module("infi-form").service('testServices',['$http',function($http){
	
	//获取测试数据
	this.ajaxGroupData = function(){
		return $http({
			url: 'test-data/group.json',
			method: 'get',
			params: ''
		})
		.then(function(msg){
			return msg.data;
		});
    };

    //获取测试数据
	this.ajaxBasicInputData = function(){
		return $http({
			url: 'test-data/basic.input.json',
			method: 'get',
			params: ''
		})
		.then(function(msg){
			return msg.data;
		});
    };

    //获取测试数据
	this.ajaxChildIndexData = function(){
		return $http({
			url: 'test-data/child.index.json',
			method: 'get',
			params: ''
		})
		.then(function(msg){
			return msg.data;
		});
    };

    //获取测试数据
	this.ajaxUpdateData = function(){
		return $http({
			url: 'test-data/update.json',
			method: 'get',
			params: ''
		})
		.then(function(msg){
			return msg.data;
		});
    };

}]); 