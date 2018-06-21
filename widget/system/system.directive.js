angular.module('infi-basic').directive('infiNavigator', function () {
    return {
        restrict: 'A',
        templateUrl: '../src/widget/system/html/navigator.tpl.html',
        scope: {
            navigators: '=navigators'
        },
        controller: ['$scope', function ($scope) {
            $scope.toggle = function (navigator) {
                navigator.active = !navigator.active;
            }


            /**
             * 如果当前路由的$routeParams和之前路由的$routeParams发生改变那么就满足满足刷新机制;
             * 当点击单个医疗信息数据时,刷新单个医疗信息数据,之前是刷新全部医疗信息数据
             *  current获取当前路由;
             *  previous获取之前页面路由;
             */
            $scope.$on("$routeChangeStart", function (event, current, previous) {
                var currentId = current.pathParams.id,
                    currentType = current.pathParams.type,
                    previousId = previous && previous.pathParams.id,
                    previousType = previous && previous.pathParams.type,
                    isToShowSubNavi = currentId && currentType && !previousId && !previousType;


                $scope.navigatorId = currentId;
                $scope.navigatorType = currentType;

                if (isToShowSubNavi) {

                }
                if (!isToShowSubNavi) {

                }
                /*
                 if(current.pathParams.id && current.pathParams.type ){
                 $scope.parameter=current.pathParams;
                 if(previous){
                 if(current.pathParams.patientId!==previous.pathParams.patientId
                 &&current.pathParams.visitId!==previous.pathParams.visitId){
                 getMedicalInfo(current);
                 }else{
                 getSingleMedicalInfo(current);
                 }
                 }else{
                 getMedicalInfo(current);
                 }
                 }else{
                 $('body').attr('class','standard');
                 }
                 */
            });
        }]
    }
});


angular.module("infi-basic").directive('infiDate', [function () {
    return {
        link: function (scope, element, attrs) {
            var format = 'yyyy-mm-dd',
                minView = 2,
                maxView = 4,
                startView = 'month';
            if (attrs && attrs.infiDate) {
                format = attrs.infiDate;
            }
            if (attrs && attrs.minView) {
                minView = attrs.minView;
            }
            if (attrs && attrs.maxView) {
                maxView = attrs.maxView;
            }
            if (attrs && attrs.startView) {
                startView = attrs.startView;
            }
            $(element).click(function () {
                $(this).datetimepicker({
                    format: format,
                    language: "zh-CN",
                    startView: startView,
                    minView:minView,
                    maxView:maxView,
                    autoclose: true,
                    forceParse: true
                }).trigger('focus');
            });
        }
    }
}]);

angular.module("infi-basic").directive('infiRadioLarge', [function () {
    return {
        link: function (scope, element, attrs) {
            $(element).parent().click(function () {
                $(element).show();
            });

            $(document).bind('click', bindHideEvent);

            function bindHideEvent(event) {
                var isHide = true,
                    e = event || window.event,
                    elem = e.target || e.srcElement;
                while (elem) {
                    if (elem.name == attrs.name) {
                        isHide = false;
                    }
                    if ($(elem).data('type') == 'hide-opt') {
                        isHide = true;
                    }
                    elem = elem.parentNode;
                }

                if (isHide) {
                    $(element).hide();
                }
            }
        }
    }
}]);

angular.module("infi-basic").directive('infiRadioQuery', function () {
    return {
        link: function (scope, element, attrs) {
            var name = attrs.name,//如entity.name_7
                names = name.split('.'),//分成两部分['entity','name_7']
                length = names.length;
            scope.$watch(attrs.name, function (value) {
                var isEmpty, idy,
                    dimension = scope.dimensions[names[length - 1]],//names[length-1]就是name_7
                    options = dimension.options,
                    oLength = options.length;

                value = value != undefined ? value.replace(/ /g, '') : undefined;
                isEmpty = value == undefined || value == '';
                if (isEmpty) {
                    for (idy = 0; idy < oLength; idy++) {
                        options[idy].show = true;
                    }
                } else {
                    for (idy = 0; idy < oLength; idy++) {
                        options[idy].show = options[idy].label.indexOf(value) >= 0;
                    }
                    if(dimension.label == "药物治疗-药物名称"){
                        //将小写转换为大写
                        value=value.toString().toLocaleUpperCase();
                        for (idy = 0; idy < oLength; idy++) {
                            angular.forEach(options[idy].pyName,function(pyName){
                                if(pyName.indexOf(value) == 0){
                                    options[idy].show = true;
                                }
                            })
                        }
                    }
                }

            });

            return false;
            $(element).next().click(function () {
                var target = scope,
                    idx;
                for (idx = 0; idx < length; idx++) {
                    target = target[names[idx]];
                }
                console.log(target)
                target = '';
                $(this).prev().val('');
                scope.$apply();
                console.log(target)

            });
        }
    }
});
angular.module("infi-basic").directive('infiMoreQuery', function () {
    return {
        link: function (scope, element, attrs) {
            var name = attrs.name,
                names = name.split('.'),
            // moreOperation = attrs.name+'more',
                length = names.length;
            var namess = names.splice(0, 1);
            namess.splice(1, 1, 'name_16');

            scope.$watch(attrs.name, function (value) {
                var isEmpty, idy,
                    dimension = scope.dimensions[namess[length - 1]],
                    options = dimension.moreOperation,
                    oLength = options.length;

                value = value != undefined ? value.replace(/ /g, '') : undefined;
                isEmpty = value == undefined || value == '';

                if (isEmpty) {
                    for (idy = 0; idy < oLength; idy++) {
                        options[idy].show = true;
                    }
                } else {
                    for (idy = 0; idy < oLength; idy++) {
                        options[idy].show = options[idy].label.indexOf(value) >= 0;
                        if (options[idy].label.indexOf(value) >= 0) {
                            console.log(options[idy])
                        }
                    }
                }

            });

            return false;
            $(element).next().click(function () {
                var target = scope,
                    idx;
                for (idx = 0; idx < length; idx++) {
                    target = target[names[idx]];
                }
                console.log(target)
                target = '';
                $(this).prev().val('');
                scope.$apply();
                console.log(target)

            });
        }
    }
});
angular.module('infi-basic').directive('infiOtherValue', function () {
    return {
        link: function ($scope, element, attr) {
            var name = attr.name,
                type = attr.type,
                $target = $(element);
            var checkedWatch = $scope.$watch(name, function (value) {
                if (value != undefined) {
                    filter(value, name);
                    checkedWatch();
                }
            });
            $target.click(add);


            function filter(values, name) {
                var $parent = $target.parent(),
                    $input = $('input', $parent),
                    target = $scope,
                    names = name.split('.'),
                    idx;
                names[(names.length - 1)] = names[(names.length - 1)] + 'OTHER';
                for (idx = 0; idx < names.length; idx++) {
                    if (!target[names[idx]]) {
                        target[names[idx]] = {};
                    }
                    target = target[names[idx]];
                }
                var todoList = doFilter($input, values, name);
                for (key in todoList) {
                    target[key] = true;
                }
            }

            function doFilter(domList, values, name) {
                var domNames = {},
                    todoList = {},
                    domName,
                    idx, length;

                for (idx = 0, length = domList.length; idx < length; idx++) {
                    domName = $(domList[idx]).attr('ng-model');
                    domNames[domName] = true;
                }

                for (key in values) {
                    if (key != undefined && domNames[name + '.' + key] == undefined) {
                        delete values[key];
                        todoList[key] = true;
                    }
                }
                return todoList;
            }

            function add() {
                var html = '<input  type="text" placeholder="请输入其他" /><a class="btn infi-btn-linear-default btn-xs" style="cursor:pointer; margin-left: 5px;">确定</a>',
                    $html = $(html);

                $($html[1]).click(function () {
                    doAdd($html);
                });
                $target.before($html);
                $target.hide();
            }

            function doAdd($html) {
                var label = $($html[0]).val();
                //ljy_debug 当输入的值为空或者为空格那么则不让他添加
                if(label.trim()){
                    var target = $scope,
                        names = name.split('.'),
                        idx;
                    names[(names.length - 1)] = names[(names.length - 1)] + 'OTHER';
                    for (idx = 0; idx < names.length; idx++) {
                        if (!target[names[idx]]) {
                            target[names[idx]] = {};
                        }
                        target = target[names[idx]];
                    }
                    target[escapeLabel(label)] = true;
                    $scope.$apply();
                    $($html[0]).remove();
                    $($html[1]).remove();

                    $target.show();
                }else{
                    $($html[0]).remove();
                    $($html[1]).remove();
                    $target.show();
                }


            }

            /**
             * 给添加的名字进行编码，并在编码的前面加上name
             * @param label
             * @returns {*}
             */
            function escapeLabel(label) {
                var value = label;
                value = escape(value);
                value = value.replace(/-/g, '_a_');
                value = value.replace(/\+/g, '_b_');
                value = value.replace(/%/g, '__');
                value = 'name_' + value;
                return value;
            }

        }
    }
});
angular.module('infi-basic').directive('infiOtherValue2', function () {
    return {
        link: function ($scope, element, attr) {
            var name = attr.name,
                dimensionKey = name.replace('entity.', ''),
                type = attr.type,
                $target = $(element);

            $target.click(add);


            function add() {
                var html = '<input type="text" placehold="请输入其他" /><a style="cursor: pointer;">确定</a>',
                    $html = $(html);

                $($html[1]).click(function () {
                    doAdd($html);
                });
                $target.before($html);
                $target.hide();
            }

            function doAdd($html) {
                var label = $($html[0]).val();
                var target = $scope,
                    names = name.split('.'),
                    idx;
                for (idx = 0; idx < names.length; idx++) {
                    if (!target[names[idx]]) {
                        target[names[idx]] = {};
                    }
                    target = target[names[idx]];
                }
                //target[escapeLabel(label)] = true;

                $scope.dimensions[dimensionKey].options.push({
                    label: label,
                    name: label
                });

                if (type.indexOf('checkbox') >= 0) {

                    target[label] = true;
                } else {
                    target = label
                }
                $scope.$apply();
                $($html[0]).remove();
                $($html[1]).remove();

                $target.show();

            }

            function escapeLabel(label) {
                var value = label;
                value = escape(value);
                value = value.replace(/-/g, '_a_');
                value = value.replace(/\+/g, '_b_');
                value = value.replace(/%/g, '__');
                value = 'name_' + value;
                return value;
            }

        }
    }
});

angular.module('infi-basic').directive('gOptions', [function ($scope) {
    return {
        restrict: 'A',
        replace: true,
        link: function ($scope, element, attr) {
            var dimensions = $scope.dimensions,
                name = attr.name,
                key,
                type = attr.type,
                dimension;

            console.log(dimensions)
            if (dimensions != undefined && name != undefined) {
                key = name.substring(name.lastIndexOf('.') + 1);
                dimension = dimensions[key];

            }
            console.log(arguments)
        }
    }
}]);
