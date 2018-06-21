
angular.module('infi-basic').service('formNaviServices',['$http','SYS',function($http,SYS){
	
	//获取测试数据
	this.ajaxNaviData = function(routeParams){
		return $http({
			url: SYS.url+'/load/profiles/category/'+routeParams.projectName+'?filter_id=1',
			method: 'get',
			params: ''
		})
		.then(function(msg){
			return msg.data;
		});
    };

}]); 