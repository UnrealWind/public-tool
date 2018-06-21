
//https://blog.coding.net/blog/techniques-for-authentication-in-angular-js-applications?type=hot
// http://www.jdon.com/46055
// http://www.open-open.com/lib/view/open1398335709171.html

angular.module('infi-basic')
  .controller('LoginController',["$scope","$rootScope","AuthService","SYS","Session","$location","TransformService","naviServices",
      function ($scope, $rootScope, AuthService,SYS,Session,$location,TransformService,naviServices) {
    $scope.SYS = SYS;
    $scope.credentials = {
      username: '',
      password: '',
      eu: '',
      ep: ''
    };
    $scope.credentials.name = Session.getUser().name;

    $scope.$on(SYS.STATUS_DO_LOGIN,function () {
      if( !Session.isAuthenticated() ){
          goToLogin();
        // $location.path('login');
      }
    });

    $scope.loginHeader = true;
    $scope.login = function () {
        // console.log($scope.credentials);
      var credentials = $scope.credentials;
      credentials.eu = md5(credentials.username);
      credentials.ep = md5(credentials.password);
      AuthService.login(credentials).then(function (msg) {
        $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);

          //解决权限不足问题，在login之中获取菜单数据，并向上传递到home controller中
          //这里仔细想了一下，因为这个导航的特殊性，和login息息相关，是没有办法解耦的，所以索性加载login之中
          naviServices.getNaviData().then(function(msg){
              msg.data?$rootScope.naviData = msg.data.menus:undefined;
              var strIdx = naviServices.getIndex(window.location.href,$rootScope.naviData);
              var callback = naviServices.restoreNavi($rootScope.naviData,strIdx);
              $rootScope.naviData = callback.naviData;
              $rootScope.secondNavi = callback.second;
              $rootScope.secondTitleOpt = callback.secondTitleOpt;
              $rootScope.shrinkfirst = naviServices.judgeShrink($rootScope.secondNavi);

              msg.data?TransformService.jumpPage(msg):undefined;
          });

          $scope.credentials.name = $scope.credentials.username;
         /*AuthService.jumpPage().then(function (msg) {
             debugger;
              TransformService.jumpPage(msg);
          });*/
      }, function () {
          $scope.loginHeader = false;
      });
    };

    $scope.logout = function () {
      AuthService.logout($scope.credentials);
        delete $rootScope.naviData;
        delete $rootScope.secondNavi;
        delete $rootScope.secondTitleOpt;
        delete $rootScope.shrinkfirst;
      $rootScope.$broadcast(SYS.ROLES_READY,false);
        goToLogin();
    }
  }]);
