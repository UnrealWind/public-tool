angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/task', {
            templateUrl: 'html/task.html',
            controller: 'TaskController'
        }).
        when('/view', {
            templateUrl: 'html/view.html',
            controller: 'ViewController'
        }).
        when('/audit',{
            templateUrl: 'html/audit.html',
            controller: 'AuditController'
        }).
        when('/total', {
            templateUrl: 'html/total.html',
            controller: 'TotalController'
        }).
        otherwise({
            redirectTo: '/task'
        });
    }]);