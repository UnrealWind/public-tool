
app.directive('example',[function(){
  return {
    restrict: 'ECMA',
    
    //和页面进行数据同步
    scope:{
      datas : '='
    },
    //内容
    template: '<div>hello,world</div>',
    replace : true,
    link:function(scope, element, attrs , datas){

    }
  };
}]);

app.directive('infiNav',[function(){
  return {
    restrict:'A',
    scope:{

    },
    templateUrl:'../template/infi-lefttab.html',
    replace:true,
    link:function($scope){
        // console.log($scope);
    }
  }
}]);

app.directive('infiFilter',[function(){
  return {
    restrict:'A',
    scope:{
      sex:'='
    },
    templateUrl:'../template/infi-filter.html',
    replace:true,
    link:function($scope){
      $scope.removeFilter = function(){
      }
    }
  }
}]);

app.directive('infiListing',[function(){
  return {
    restrict:'A',
    scope:{
      sex:'='
    },
    templateUrl:'../template/infi-listing.html',
    replace:true,
    link:function($scope){
      $scope.removeFilter = function(){
      }
    }
  }
}]);

app.directive('infiDrug',[function(){
  return {
    restrict:'A',
    scope:{
      
    },
    templateUrl:'../template/infi-drug.html',
    replace:true,
    link:function($scope){
      $scope.removeFilter = function(){
      }
    }
  }
}]);