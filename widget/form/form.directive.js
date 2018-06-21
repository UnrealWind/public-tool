angular.module("infi-basic").directive('inputTemplate',function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl: '../../../../src/widget/form/basic-template/input.template.html',
        replace: true
    };
});

angular.module("infi-basic").directive('inputDetailTemplate',function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl: '../../../../src/widget/form/basic-template/input.detail.template.html',
        replace: true
    };
});


angular.module("infi-basic").directive('inputText',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label" class="{{input.write}}" ng-class="{true:\'orange\'}[input.defaultVal !== input.value]"></span>'
                                +'<a ng-show="input.prompt && input.prompt != null &&input.prompt != \'\'" tabindex="0" type="button" role="button" class="prompt glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="{{input.prompt}}"></a>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right form-group">'
                            +'<div class="infi-input-opt input-group">'
                                +'<input ng-disabled="input.name==\'基本信息_a_基本信息_a_1000\' || input.name==\'基本信息_a_基本信息_a_1003\'|| input.name==\'基本信息_a_基本信息_a_1004\'" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" >'
                                +'<div ng-if="input.unit" class="input-group-addon" ng-bind="input.unit"></div>'
                                +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);


angular.module("infi-basic").directive('inputTextDouble',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right form-group">'
                            +'<div class="infi-input-opt input-group row">'
                                +'<div ng-repeat = "opt in input.dimension.options" class="col-md-4 infi-input-text-double">'
                                    +'<input class="form-control" type="text" name="{{input.name}}" ng-model="input.value[opt.name]">'
                                    +'<span ng-if="$index === 1">-</span>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);


angular.module("infi-basic").directive('inputNumber',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right form-group">'
                            +'<div class="infi-input-opt input-group">'
                                +'<input ng-disabled="input.name==\'基本信息_a_基本信息_a_1000\' || input.name==\'基本信息_a_基本信息_a_1003\' || input.name==\'基本信息_a_基本信息_a_1004\'" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" >'
                                +'<div ng-if="input.unit" class="input-group-addon" ng-bind="input.unit"></div>'
                                +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputDate',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<label>'
                                    +'<input class="form-control" type="text" name="{{input.name}}" readonly="readonly"'
                                    +'ng-model="input.value"  ng-click="timePlugin(input.name,input.format)">'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</label>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.timePlugin = function(tagName,format){
                groupServices.timePlugin(tagName,format);
            };
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputScale',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl:'../../../../src/widget/form/basic-template/scale.html',
        replace: true,
        link:function(scope,element,attrs){
            //缺失的数据会在这里得到添加
            groupServices.updateValue.update(scope.input);
            scope.scaleModal = function(input){
                //data为null的话，说明并没有请求新的scale数据，所以直接使用自己input中缓存的数据即可
                var data = groupServices.getScaleData(input);
                if(data == null){
                    scope.scaleData = input.scaleData;
                }else{
                    input.scaleData= data;
                    scope.scaleData = data;
                }
                scope.scaleData.tagInputData = input;
                $('#infi-u-scale').modal({backdrop: 'static'});
            }
        }
    };
}]);

angular.module("infi-basic").directive('inputRadio',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label" class="{{input.write}}" ng-class="{true:\'orange\'}[input.defaultVal !== input.value]"></span>'
                                +'<a ng-show="input.prompt && input.prompt != null &&input.prompt != \'\'" tabindex="0" type="button" role="button" class="prompt glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="{{input.prompt}}"></a>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<ul>'
                                   +'<li ng-repeat = "opt in input.dimension.options">'
                                        +'<label class="radio-inline">'
                                            +'<input ng-checked="opt.value === input.value" type="radio" value="{{opt.value}}" name="{{input.name}}"'
                                            +'ng-model="input.value" ng-change="updateChildren(opt.value)">{{opt.label}}'
                                        +'</label>'
                                    +'</li>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</ul>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.updateChildren = function(value){
                groupServices.updateChildren(value,scope.input,scope.parent);
            }
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);


angular.module("infi-basic").directive('inputSwitch',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label" class="{{input.write}}" ng-class="{true:\'orange\'}[input.defaultVal != input.value]"></span>'
                                +'<a ng-show="input.prompt && input.prompt != null &&input.prompt != \'\'" tabindex="0" type="button" role="button" class="prompt glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="{{input.prompt}}"></a>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<label class="ui-switch">'
                                    +'<span ng-class="{true:\'active\'}[input.switchChecked == \'checked\']"></span>'
                                    +'<input class="hide" ng-click="changeVal(input)" type="checkbox" ng-checked="input.switchChecked == \'checked\'">'
                                +'</label>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.changeVal = function(input){
                input.value == "0"?input.value = "1":input.value = "0";
                input.switchChecked == 'checked'?input.switchChecked = '':input.switchChecked = 'checked';
                groupServices.updateChildren(input.value,scope.input,scope.parent);
            }

            $('.glyphicon-question-sign',element).popover();
        }
    };
}]);

angular.module("infi-basic").directive('inputSelect',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label" class="{{input.write}}" ng-class="{true:\'orange\'}[input.defaultVal !== input.value]"></span>'
                                +'<a ng-show="input.prompt && input.prompt != null &&input.prompt != \'\'" tabindex="0" type="button" role="button" class="prompt glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="{{input.prompt}}"></a>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right form-group">'
                            +'<div class="infi-input-opt input-group">'
                                +'<select ng-model="input.value" class="form-control">'
                                    +'<option ng-checked="input.value == option.value" ng-repeat="option in input.dimension.options" value="{{option.value}}">{{option.label}}</option>'
                                +'</select>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover();
        }
    };
}]);

angular.module("infi-basic").directive('inputRadioExtend',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<ul>'
                                    +'<li ng-repeat = "opt in input.dimension.options">'
                                         +'<label class="radio-inline">'
                                            +'<input ng-checked="opt.value === input.value" type="radio" value="{{opt.value}}" name="{{input.name}}"'
                                            +'ng-model="input.value" ng-change="updateChildren(opt.value)">{{opt.label}}'
                                        +'</label>'
                                    +'</li>'
                                    +'<li class="" ng-show = "input.value === \'其他\'">'
                                        +'<label>'
                                            +'<input class="" type="text" name="" placeholder="请输入其他" ng-model = "input.extendValue">'
                                        +'</label>'
                                        +'<button class="btn btn-default btn-sm" type="button" ng-click = "addExtendOpt()">添加</button>'
                                    +'</li>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</ul>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){

            //缺失的数据会在这里得到添加
            groupServices.updateValue.update(scope.input);

            //控制分支
            scope.updateChildren = function(value) {
                groupServices.updateChildren(value,scope.input,scope.parent);
            }

            //扩充输入
            scope.addExtendOpt = function(){
                groupServices.addRadioExtendOpt(scope.input);
            }
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputCheckbox',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<ul>'
                                    +'<li ng-repeat = "opt in input.dimension.options">'
                                        +'<label class="checkbox-inline">'
                                            +'<input ng-checked="opt.value === input.value" type="checkbox" value="{{opt.value}}" name="{{input.name}}"'
                                            +'ng-model="input.value[opt.value]" ng-change="updateChildren(opt.value)">{{opt.label}}'
                                        +'</label>'
                                    +'</li>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</ul>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.updateChildren = function(value){
                groupServices.updateChildren(value,scope.input,scope.parent)
            }
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputCheckboxExtend',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<ul>'
                                    +'<li ng-repeat = "opt in input.dimension.options">'
                                       +'<label class="checkbox-inline">'
                                            +'<input ng-checked="input.value[opt.value]===true" type="checkbox" value="{{opt.value}}" name="{{input.name}}"'
                                            +'ng-model="input.value[opt.value]" ng-change="updateChildren(opt.value)">{{opt.label}}'
                                        +'</label>'
                                    +'</li>'
                                    +'<li class="" ng-show = "input.value[\'其他\']">'
                                        +'<label>'
                                            +'<input class="" type="text" name="" placeholder="请输入其他" ng-model = "input.extendValue">'
                                        +'</label>'
                                        +'<button class="btn btn-default btn-sm" type="button" ng-click = "addCheckboxExtendOpt()">添加</button>'
                                    +'</li>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</ul>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){

            //缺失的数据会在这里得到添加
            groupServices.updateValue.update(scope.input);

            //控制分支
            scope.updateChildren = function(value) {
                groupServices.updateChildren(value,scope.input,scope.parent);
            }

            //扩充输入
            scope.addCheckboxExtendOpt = function(){
                groupServices.addCheckboxExtendOpt(scope.input);
            }
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputTextarea',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<label class="">'
                                    +'<textarea class="form-control" ng-model="input.value" name="{{input.name}}" ></textarea>'
                                +'</label>'
                                +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

//zyz_debug 新增textarea，高度缩短一半
angular.module("infi-basic").directive('inputHalfTextarea',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<label class="">'
                                    +'<textarea class="form-control infi-area-half-height" ng-model="input.value" name="{{input.name}}" ></textarea>'
                                +'</label>'
                                +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                            +'</div>'
                        +'</div>'
                   +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('addGroup',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent : '='
        },
        template: '<button class="btn btn-primary infi-add-attr-group" ng-click="addGroup(input.categoryLevel)">添加</button>',
        replace : true,
        link:function(scope,element,attrs){

            groupServices.updateValue.update(scope.input);

            scope.addGroup = function(addType){
                groupServices.addGroup(scope.input,scope.parent,addType);
            }
        }
    };
}]);

//这个directive用于监听历史信息是否渲染完毕
angular.module("infi-basic").directive('repeatHistoryFinish',['$timeout',function($timeout){
    return {
        restrict: 'ECMA',
        link:function(scope,element,attrs){
             if(scope.$last == true){
                $timeout(function() {
                    scope.$emit( 'renderOverHistory');
                });
            }
        }
    }
}])