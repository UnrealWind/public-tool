app.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
        .when('/logic',{
            templateUrl:'../logic.html',
            controller:'LogicController'
        })
        .otherwise({
            redirectTo: '/logic'
        })
}])