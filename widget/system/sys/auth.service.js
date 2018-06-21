angular.module('infi-basic')
  .service('AuthService',['$http','SYS','Session','TransformService','naviServices',
      function($http,SYS,Session,TransformService,naviServices){
    var authService = {};

    authService.login = function (credentials) {
      Session.destroy();
        var url = SYS.url+'login',
            urlPath = TransformService.setLoginUrl(url,credentials);
      return $http(urlPath)
        .then(function (res) {
            // res.data.data ? TransformService.setSessionInfo(res.data.data,credentials) : TransformService.setSessionInfo(res.data,credentials);
            // return res.data;

          if( res.data && res.data.data && SYS.STATUS_AUTH_PASSED == res.data.data.status ){
              TransformService.setSessionInfo(res.data.data,credentials);
              return res.data;
          } else {
            //res.data.description
            // zjl_debug 后台应该优化提示语句
            credentials.error = '用户名或密码错误,请重新填写';
          }
        });
    };

    authService.logout = function (credentials) {
      var ctoken = Session.getCtoken();
      Session.destroy();
      var url = SYS.url+'logout?ctoken='+ctoken;
      return $http.post(url)
        .then(function success(res) {

        });
    };

      authService.jumpPage = function () {
          var url = 'menu/platfrom/tree';
          return $http.get(SYS.url+url).then(function (msg) {
              return msg.data;
          });
      }

    return authService;
  }]);

angular.module('infi-basic')
    .service('TransformService',['SYS','Session','$location',function(SYS,Session,$location){
        //检验目前使用的系统是否为为用户系统,并进一步做出区分
        function checkProject () {
            var path = window.location.pathname;
            return path.indexOf('system-management') > 0 || path.indexOf('diseases-plan-src') > 0;
        }

        /**
         * 设置登录连接
         * @param url  基础连接
         * @param credentials
         * @returns {*}
         */
        this.setLoginUrl = function (url,credentials) {
            var isSYS = checkProject();
            /*if(isSYS){
               return {
                    method:'post',
                    url:url,
                    headers: {'eu':credentials.eu,'ep':credentials.ep}
                };
            }else{
                url = url + "?eu="+credentials.eu+"&ep="+credentials.ep;
                return {
                    method:'post',
                    url:url
                };
            }*/

            //先全加上，若所有系统更新后台完毕后完全修改为 ctoken模式的
            url = url + "?eu="+credentials.eu+"&ep="+credentials.ep;
            return {
                method:'post',
                url:url,
                headers: {'eu':credentials.eu,'ep':credentials.ep}
            };

        }

        /**
         * 设置登录成功后用户等信息
         * @param data
         * @param credentials
         */
        this.setSessionInfo = function (data,credentials) {
            var isSYS = checkProject();
            if(isSYS){
                data.userInfo.user.eu = credentials.eu;
                data.userInfo.user.ep = credentials.ep;
                Session.create(data.userInfo.user,data.userInfo.ctoken);
            }else{
                data.user.eu = credentials.eu;
                data.user.ep = credentials.ep;
                Session.create(data.user);
            }
        }

        /**
         * 设置拦截器对于用户系统与其他系统的不同
         * @param config
         */
        this.setInterceptorUrl = function (config) {
            var user = Session.getUser(),
                ctoken = Session.getCtoken(),
                isSYS = checkProject();

            /*if(isSYS){*/
                config.headers.ctoken = ctoken;
            /*}else{*/
                var params = 'eu='+user.eu+'&ep='+user.ep;
                if( config.url.indexOf('?')>=0 ){
                    config.url += '&' + params;
                } else {
                    config.url += '?' + params;
                }
           /* }*/
        }

        /**
         * 登录成功后跳转页面
         * @param msg
         */
        this.jumpPage = function (msg) {

            /**
             * 获取表单数据,查找referrer链接是否在左侧菜单中
             * @param entity  菜单子集数据
             * @param pathName referrer中程序名称
             * @param flag  记录是否匹配
             * @returns {boolean}
             */
            function searchHref(entity,pathName,flag) {
                for(var idx=0; idx < entity.length;idx++){
                    var child = entity[idx],
                        menu = child.href;
                    if(menu && menu.indexOf(pathName) > -1){
                        flag.key = 1;
                        return false;
                    }
                    child.menus&&child.menus.length>0 ? searchHref(child.menus,pathName,flag) : child.second&&child.second.length>0
                        ? searchHref(child.second,pathName,flag) : undefined;
                }
            }

            /**
             * 跳转到默认页,即左侧菜单第一项
             * @param msg
             */
            function goToDefaultPage(msg) {
                var defaultPage = msg.data.menus[0].menus[0].href;
                //左侧菜单的链接,有的带有端口号,ip等,有的只是项目名称和地址
                if(defaultPage.indexOf('http') > -1){
                    window.location.href = msg.data.menus[0].menus[0].href;
                }else{
                    var path = 'http://'+window.location.hostname+':'+window.location.port;
                    window.location.href = path + '/' + defaultPage;
                }
            }
            if(msg.status == SYS.STATUS_SUCCESS && msg.data && msg.data.menus){
                var referrer = document.referrer,
                    pathArray = referrer.split('/');
                if(referrer == ""){
                    //在浏览器直接输入用户系统网址,则referrer为空,直接进入用户系统的项目
                    //只有用户系统会出现这种情况
                    var path = 'http://'+window.location.hostname+':'+window.location.port;
                    window.location.href = path + '/' + "system-management";
                }else{
                    //链接数组中第四项为项目名称
                    //本地测试项目会从http://127.0.0.1:2000/进入,则链接数组中第四项为空,也需要跳转到默认页
                    if(pathArray.length >= 4&&pathArray[3].length > 0){
                        var pathName = pathArray[3],
                            flag = {key:0};
                        searchHref(msg.data.menus,pathName,flag);
                        flag.key == 0 ? goToDefaultPage(msg) : window.location.href = document.referrer;
                    }else{
                        goToDefaultPage(msg);
                    }
                }

            }
        }
    }]);
