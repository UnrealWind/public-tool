angular.module('infi-basic').directive('infiTable',[function(){
  return {
    restrict: 'A',
    templateUrl: '../src/widget/table/table.html',
    scope:{
      columns:'=columns',
      content:'=content',
      opts: '=opts',//操作
      tableCheckBox: '=tableCheckBox',
      selectMain:'=selectMain',
      updatePage:'&updatePage',//分页
      btnCallback: '&btnCallback',//操作的方法
      btnBack:'&btnBack',
      noAuthority:'=noAuthority',
      consultationRole:"=consultationRole",
      consultation:"=consultation"
    },
    link:function($scope){
      $scope.$watch('columns',function(){
        updateValue($scope.columns,$scope.content);
      });
      $scope.$watch('content',function(){
        updateValue($scope.columns,$scope.content);
      });

      function updateValue(columns,content) {
        $scope.$columns = angular.copy(columns);
        $scope.$content = [];
        $scope.$hasData = true;
        if( content && content.page && content.page!==null){
          angular.forEach(content.page.content,function (entity) {
            var data = {
              plain: [],
              original: entity
            };
            angular.forEach(columns,function (column) {
              //这种情况是不需要维表转义，后台直接提供中文
              if(entity[column.name]!=null){
                //字段超出20个省略号...显示
                // if(entity[column.name].length>20){
                //   var label = entity[column.name].substring(0,20);
                //   label = label +"...";
                //   data.plain.push({
                //     label:label,
                //     titleLabel:entity[column.name],
                //     ellipsis:true
                //   });
                // }else {
                  data.plain.push({label:entity[column.name]});
                // }
              }else{
                data.plain.push({label:entity[column.name]});
              }
            });
            $scope.$content.push(data);
            $scope.$content.totalElements = content.page.totalElements;
            $scope.$content.totalPages = content.page.totalPages;
            $scope.$content.number = content.page.number;
            $scope.$content.size = content.page.size;
          })
        } else {
          $scope.$hasData = false;
          content&&content.description ? $scope.$description = content.description : $scope.$description = '系统没有查询到数据！';
          $scope.$columnSize = $scope.opts ? columns.length+1 :columns.length;
          if($scope.tableCheckBox){
            $scope.$columnSize = columns.length+1;
          }
        }
      }
    }
  }
}]);

