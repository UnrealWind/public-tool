angular.module('infi-basic').directive('infiTimeline', ['$timeout','$interval','$routeParams',
    function ($timeout,$interval,$routeParams) {
        return {
            restrict: 'A',
            scope: {
                events: '=events',
                type:'=type',
                //方法中要加上e.stopPropagation(),阻止冒泡
                btnClick:'&',
                //延续护理在时间轴上有两个按钮
                btn2Click:'&'
            },
            templateUrl: '../src/widget/timeline/timeline.html',
            link: function ($scope, element, attr) {
                $scope.$watch('events', function (value) {
                    if (value != undefined) {
                        init(value);
                    }
                });
                element.on("btnClick",function(event){
                    var $e = event ||window.event;
                    console.log($e);
                });
                function init(options) {
                    var data = [],
                        list = options.data;

                    list.sort(sort);
                    $scope.$navigators = filterByYear(list);
                }

                function sort(b, a) {
                    return +a.year * 10000 + (+a.month * 100) + (+a.day) - (+b.year * 10000) - (+b.month * 100) - (+b.day);
                }

                function filterByYear(list) {
                    var idx, idy,
                        current, event,
                        length = list.length,
                        result = [];

                    for (idx = 0; idx < length; idx++) {
                        event = list[idx];
                        if (current == undefined || current.year != event.year) {
                            current = {
                                id: uuid(),
                                year: event.year,
                                label: event.year + '年',
                                events: []
                            };

                            result.push(current);
                        }
                        event.uniqueId = event.id;  //保留自己的id
                        event.id = uuid();          //这个id是按照排序顺序排的
                        if (event.title) {
                            event.label = event.title;
                        } else {
                            event.label = event.month + '月--' + mappingTypeLabel(event.type);
                        }
                        current.events.push(event);
                    }

                    return result;
                }

                var tIndex = 1;

                function uuid() {
                    return 'uuid_' + tIndex++;
                }

                function mappingTypeLabel(value) {
                    var mapping = {
                        'menzhen': '门诊',
                        'zhuyuan': '住院',
                        'tijain': '体检'
                    };
                    return mapping[value] ? mapping[value] : '未知';
                }

                /**
                 * 页面跳转(门诊,住院)
                 * @param event
                 */
                $scope.openTarget = function (event) {
                    if($scope.type == 'wj-301'){
                        event.url = event.url.toString().replace("#","#/301");
                    }
                    window.location.href = event.url;
                };

                if($('.infi-timeline')){
                    $scope.type === 'wj-301'?wj301SetOption():wjSetOption();
                }

                function wjSetOption(){
                    /**
                     * 右侧导航页面定位导航
                     * @param year
                     */
                    $scope.scrollOption = function(year){
                        $(".infi-wj-article").animate({scrollTop: $("#timeline"+'-'+year.year).position().top+300},260);
                    };

                    $('.timeline_nav').css('display','block');

                    var timeWj  = setInterval(function(){
                        try{
                            var fixedHeight = $('.infi-timeline').offset().top;
                        }
                        catch(fixedHeight){
                            clearInterval(timeWj);
                        }


                        var width = $(window).width();
                        var scrollTopData = $(document).scrollTop();

                        if(scrollTopData>(fixedHeight+72)){
                            $('.timeline_nav').css({'top':'102px','right':width/9.5});
                        }else{
                            $('.timeline_nav').css({'top':fixedHeight+185-scrollTopData,'right':width/9.5});
                        }
                    },1)
                }

                function wj301SetOption(){
                    /**
                     * 右侧导航页面定位导航
                     * @param year
                     */
                    $scope.scrollOption = function(year){
                        $(".infi-wj-article").animate({scrollTop: $("#timeline"+'-'+year.year).offset().top-75},260);
                    };

                    $('.timeline_nav').css('display','block');

                    var time301Wj =setInterval(function(){
                        try{
                            var fixedHeight = $('.infi-timeline').offset().top;
                        }
                        catch(fixedHeight){
                            clearInterval(time301Wj);
                        }
                        var width = $(window).width();
                        var scrollTopData = $('.infi-wj-article').scrollTop();
                        if(scrollTopData>(fixedHeight+72)){
                            $('.timeline_nav').css({'top':'102px','right':width/9.5});
                        }else{
                            $('.timeline_nav').css({'top':fixedHeight+185-scrollTopData,'right':width/9.5});
                        }
                    },1)

                }
            }
        }
    }
]);
