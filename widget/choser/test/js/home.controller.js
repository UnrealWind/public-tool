angular.module('infi-basic')
    .controller('HomeController', ['$scope',function ($scope) {
        $scope.extract_navigation = [
            {'name':'基础类型','cls':'-list-alt','route':'task','active':'list-group-active'},
            {'name':'tab类型','cls':'-barcode','route':'view','active':''},
            {'name':'前置条件类型','cls':'-barcode','route':'audit','active':''},
            {'name':'综合类型','cls':'-check','route':'total','active':''}
        ];

        $scope.extract_nav = function(nav){
            angular.forEach( $scope.extract_navigation , function(data,i){
                $scope.extract_navigation[i].active = '';
            })
            nav.active = 'list-group-active';
        }

        $scope.liHover = function(){
            $('nav > .list-group .list-group-item').mouseover(function () {
                $(this).animate({paddingLeft: '40px'}, 100).animate({paddingLeft: '34px'}, 100);
            });
        };
    }]);