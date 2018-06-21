angular.module('infi-basic')
    .directive('choserDetail',['TaskService','SYS',function (TaskService,SYS) {
        return{
            restrict:'A',
            templateUrl:'../choser.html',
            scope: {
                contents: '='
                // keywords:'='
            },
            replace :true,
            link:function(scope,element){

                //页面初始化
                (function(){
                    //tab 默认显示第一项
                    if(scope.contents.tabs){
                        scope.contents.tabs[0].active=true;
                    }
                    if(scope.contents.type && !scope.contents.context){
                        if(scope.contents.range.length == 0){
                            scope.contents.range.push({
                                min: "",
                                max: ""
                            })
                        }
                    }
                })();

                /**
                 * 自定义选项的显示隐藏
                 * @param content
                 */
                scope.showRangeGroup = function (content) {
                    content.$checked = !content.$checked;
                    if (content.length == 0) {
                        scope.addRange(content);
                    }
                }

                /**
                 * 增加范围的公共方法
                 */
                scope.addRange = function (range) {
                    range.push({
                        min: "",
                        max: ""
                    })
                }

                /**
                 * 删除范围的公共方法
                 */
                scope.removeRange = function (range,idx) {
                    range.splice(idx,1);
                }

                /**
                 *  显示更多,收起
                 * @param conetnt
                 */
                scope.flexMores = function(conetnt){
                    conetnt.more.active=!conetnt.more.active;
                };



                /**
                 * 上部tab切换
                 * @param entity
                 */
                scope.choseIndexType = function(entity,content){
                    eachTabs(content,function(tab){
                        tab.active=false;
                        if(entity.id=tab.id){
                            entity.active=true;
                        }
                    });
                };

                /**
                 * tabs和options等调出前置条件
                 * @param options
                 */
                scope.choseContext = function(option,options,context){
                    if(option.active){
                        option.active = false;
                    }else{
                        angular.forEach(options,function(option){
                            option.active=false;
                        })
                        option.active=true;
                        if(context){
                            //前置条件情况
                            // delete context.$$hashKey;
                            // console.log(context,89)
                            option.context=[]
                            option.context.push(context);
                            option.context[0][0].active = true;
                            option.context.$select = option.context[0][0].id
                        }
                    }
                };

                /**
                 * 输入字段进行搜索
                 * @param contents
                 * @param keywords
                 */
                scope.searchMore = function (content) {
                    TaskService.getSearchData(content.keywords).then(function (msg) {
                        if(msg.status == SYS.STATUS_SUCCESS){
                            content.searchData = msg.data;
                        }
                    })
                }

                /**
                 * tabs迭代;
                 * @param contents
                 * @param callback
                 */
                function eachTabs(contents,callback){
                    angular.forEach(contents,function(tab){
                        callback(tab);
                    })
                }

                /**
                 * more及关联属性，前置条件的关闭操作;
                 * ljy_debug在进行关闭操作的时候需不需要对清空checkbox的值???这部分的绑定还是没有
                 * @param relas
                 */
                scope.closeRela = function(relas){
                    relas.active=false;
                };

                /**
                 * 添加前置条件
                 * @param option
                 */
                scope.addContext = function (option) {
                    // gqm_debug 这里push scope.contents.context有问题，问题是：haskey相同
                    if(!option.group){
                        option.group = {}
                    }
                    context.push(scope.contents.context);
                }

                /**
                 * 前置条件的手术或者院内切换,gqm_debug
                 * @param context
                 * @param contexts
                 */
                scope.changeContext = function (context,contexts) {

                }

                /**
                 * 关联属性
                 * @param relation
                 * @param relations
                 */
                scope.choseRelation = function (relation,relations) {
                    angular.forEach(relations,function (tab) {
                        tab.active=false;
                        if(relation.id=tab.id){
                            tab.active=true;
                        }
                    })
                    if(relation.tabs){
                        relation.tabs[0].active=true;
                    }
                }
            }
        }
    }])
    .directive('choserContext',function (){
        return {
            restrict: 'A',
            templateUrl: '../context.html',
            replace: true
        }
    })