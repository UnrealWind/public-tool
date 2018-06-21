angular.module('infi-basic').directive('infiNavi',['naviServices','$http','Session','$timeout',
    function(naviServices,$http,Session,$timeout){
    return {
        restrict: 'ECMA',
        templateUrl: '/src/widget/navi/html/navi.html',
        link:function(scope,ele,attr){

            //加载这个 directive 的时候去naviData里校验这个url
            scope.url = window.location.href;

            //第二级导航数据,这级数据根据点击数据去确认，初始化为null或者根据需求初始话展示第一个
            scope.shrinksecond = false;

            //如果没有注入这个东西就自己拿
            function init(){
                naviServices.getNaviData().then(function(msg){
                    scope.$root.naviData = msg.data.menus;

                    //加载这个directive的时候进行一下navi的教研
                    judgeUrl();
                })
            }

            //emm，在加载数据完成执行fixdata的时候 ，有的时候会得不到$routeParams的值，很迷，所以只好加了这个延迟
            !scope.$root.naviData?$timeout(function () {
                init();
            },100):judgeUrl();

            scope.choseNavi = function($event ,opt,mark){
                callback = JSON.parse(JSON.stringify(naviServices.choseNavi(opt,scope.$root.naviData,scope.$root.secondNavi,mark,$event.target)));
                
                //将href的跳转逻辑加在这里
                if(opt.href && !opt.target){
                    window.location.href = opt.href;
                }else if(opt.href && opt.target){
                    window.open(opt.href);
                }
                scope.url = opt.href;
                scope.$root.naviData = callback.naviData;
                scope.$root.secondNavi = callback.secondNavi;
            }

            //根据参数控制菜单收缩展开
            scope.shrink =function(mark){
                mark !== 'first'? scope['shrink'+mark] = !scope['shrink'+mark]:
                    scope.$root['shrink'+mark] = !scope.$root['shrink'+mark];
            }

            //用于根据url还原数据
            function judgeUrl(){
                var strIdx = naviServices.getIndex(scope.url,scope.$root.naviData);
                var callback = naviServices.restoreNavi(scope.$root.naviData,strIdx);
                scope.$root['naviData'] = callback.naviData;
                scope.$root['secondNavi'] = callback.second;
                scope.$root['secondTitleOpt']= callback.secondTitleOpt;
                scope.$root['shrinkfirst']= naviServices.judgeShrink(scope.$root.secondNavi)
            };

        },
        replace: true
    }
}]);

