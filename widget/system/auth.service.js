angular.module('infi-basic')
  .service('AuthService',['$http','SYS','Session',function($http,SYS,Session){
    var authService = {};

    authService.login = function (credentials) {
      Session.destroy();

      var url = SYS.url+'login?eu='+credentials.eu+'&ep='+credentials.ep;
      return $http
        .post(url, {
          eu: credentials.eu,
          ep: credentials.ep
        })
        .then(function (res) {
          if( SYS.STATUS_AUTH_PASSED == res.data.status ){
            // zjl_debug 后期需要修改权限接口
            return $http.get(SYS.url+'sys/security/roles?eu='+credentials.eu+'&ep='+credentials.ep).then(function (msg) {
              if( msg.data.success ){
                var roles = [];
                msg.data.roles.forEach(function (entity) {
                  roles.push(entity.enname);
                });
                Session.setRoles(roles);

                res.data.user.eu = credentials.eu;
                res.data.user.ep = credentials.ep;
                Session.create(res.data);
                credentials.error = undefined;
                return res.data.user;
              }
            });

          } else {
            //res.data.description
            // zjl_debug 后台应该优化提示语句
            credentials.error = '用户名或密码错误,请重新填写';
          }
        });
    };

    authService.logout = function (credentials) {
      Session.destroy();

      var url = SYS.url+'logout';
      return $http
        .head(url, {
          eu: credentials.eu,
          ep: credentials.ep
        })
        .then(function success(res) {
        });
    };

    return authService;
  }]);
