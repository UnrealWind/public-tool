angular.module('infi-basic')
    .directive('naviHeader',[function () {
        return {  
            restrict: 'A',
            template: '<header class="infi-section">'+
                '<ul class="infi-header-ul">'+
                '<li ng-repeat="data in headerData" style="width:{{col}}" ' +
                    'ng-class="{true: \'infi-header-active\', false:\'\'}[step == data.step]">'+
                '<span ng-bind="data.name"></span>'+
                '</li>'+
                '</ul>'+
                '</header>',
            scope: {
                headerData:"=",
                col:"=",
                step:"="
            },
            replace: true
        }
    }])