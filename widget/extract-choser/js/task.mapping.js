angular.module('infi-basic').service("TaskMappingService",['$http','SYS',function ($http,SYS){
    //转换一些数据,供页面使用
    /**
     * 回退到条件筛选、导出页面，将原先选中的进行匹配
     * @param detailData  页面显示的数据
     * @param originalData  先前设置的数据
     * @param type  区分是提取页面还是导出页面
     */
    function taskRollbackMapping(detailData,originalData,type) {
        angular.forEach(originalData,function (original) { //循环上次保存的第一步配置的数据，找到‘姓名那一级’
            angular.forEach(detailData,function (detail){
                var tagId = type=="screen"?original.tagId:original.id;  //条件选取页面的id是做过处理的
                if(tagId == detail.id) {  //将上次保存的数据反映到显示的数据上面
                    detail.$checked = true; //"性别"那一级选中
                    mappingTagValue(detail,original);
                }
            });
        });

        /**
         * 匹配数据中的不同情况
         * @param detail  页面展示的数据
         * @param original  原先选中的数据
         */
        function mappingTagValue(detail,original) {
            //区分条件选取和导出页面存放数据的属性（values、options）不同，还有导出页面有关联属性
            var oriRelation = original.relation?original.relation:null,
                oriOptions = original.values?original.values:original.options?original.options:null,
                oriContext = original.context?original.context:null;

            if(oriOptions){
                angular.forEach(oriOptions,function (ori) {
                    //有options的情况
                    if(detail.options){
                        configureChecked(ori,detail.options,"options",detail,detail);
                    }
                    //有tabs的情况
                    if(detail.tabs){
                        matchTabs(detail.tabs,ori);

                        if (ori.label == '其他') {
                            detail.tabs.push({
                                'label': '其他',
                                '$active': false,
                                '$checked': true,
                                'children': [],
                                'parent': detail,
                                'nodeType': 'label'
                            })  
                        } else {
                            detail.tabs[detail.tabs.length -1].children.push({
                                'label': ori.label,
                                'id': ori.id.split('_')[1],
                                '$checked': true,
                                'nodeType': 'label',
                                'parent': detail.tabs[detail.tabs.length -1]
                            })
                        }
                    }

                    //数据为range的自定义情况
                    if(detail.range && detail.customRange){
                        angular.forEach(detail.range,function(range){
                            if(ori.id == detail.id+"_"+range.id){  //向后台传递的“男、女”那一级的id是做过处理的
                                range.$checked = true;
                            }
                        });
                        //自定义的数据
                        if(ori.id.indexOf("range")>-1){
                            var ran = ori.label.split("~");
                            detail.customRange.push({
                                min:ran[0],
                                max:ran[1]
                            });
                        }
                    }
                    //时间和带单位和支架植入数量的情况
                    if(detail.type){
                        var ran = ori.label.split("~");
                        detail.range.push({
                            min:ran[0],
                            max:ran[1]
                        });
                    }
                })
            }

            /**
             * 多级标签的显示匹配
             * @param list  循环的数据
             * @param parent  父级数据
             */
            function matchTabs(list,ori) {
                configureChecked(ori,list,'tabs',detail);
                angular.forEach(list,function (entity) {
                    if(entity.children){
                        matchTabs(entity.children,ori)
                    }
                });
            }
            
            //有前置条件的情况
            if(oriRelation&&detail.relation){
                angular.forEach(oriRelation,function (relation) {
                    configureChecked(relation,detail.relation,"relation");
                });
            }
            //tag上存在前置条件
            if(oriContext){
                configureContext(original,detail,detail);
            }
        }

        /**
         * 将options，tabs，relation等进行更详细的操作
         * @param ori  原先选中的具体项
         * @param detailChild  要循环的页面显示数据进行匹配
         * @param valueType  标示循环的是options还是tabs
         * @param detail 要循环的页面显示数据的父级,方便向下查找
         */
        function configureChecked(ori,detailChild,valueType,detail) {
            var idx=0;
            angular.forEach(detailChild,function(option){
                //区分条件选取或者导出，条件选取页面的属性id是做过处理的
                var tagValueId = type == "screen"?detail.id+"_"+option.id:option.id;
                if(ori.id == tagValueId){  //向后台传递的“男、女”那一级的id是做过处理的
                    option.$checked = true;
                    configureContext(ori,option,detail);
                    if(ori.options){
                        angular.forEach(ori.options,function (det) {
                            //关联属性包含options
                            if(option.options){
                                configureChecked(det,option.options,"options",option);
                            }
                            //关联属性包含tabs
                            if(option.tabs){
                                angular.forEach(option.tabs, function (tab) {
                                    configureChecked(det,tab.options,"tabs",option);
                                });
                            }
                        });
                    }
                    //关联属性包含关联属性
                    if(ori.relation&& option.relation){
                        angular.forEach(ori.relation,function (det) {
                            configureChecked(det,option.relation,"relation");
                        })
                    }
                }else{
                    idx++;
                }
            });

            //后台传递的数据在options中没有并且是搜到的属性，则将数据加入到options中，并且只加入到options中
            if(idx == detailChild.length&&valueType=="options"&&ori.searchType=="search"){
                var otherOption = angular.copy(ori);
                delete otherOption.context;
                delete otherOption.contextRange;
                delete otherOption.type;
                otherOption.$checked = true;
                otherOption.id = type=="screen"?otherOption.id.split('_')[1]:otherOption.id;  //条件选取页面此处的id是做过处理的，必须弄成原始数据的id
                configureContext(ori,otherOption,detail);
                detailChild.unshift(otherOption);
            }
        }

        /**
         * 当前置条件或者有组有前置条件的没有设置为null时，则给他们一个初始化的值
         * @param ori 原先选中的具体项
         * @param option  匹配上的页面显示的数据
         * @param contextParent  带有模板前置条件的顶级父级
         */
        function configureContext(ori,option,contextParent){
            if(ori.context){  //前置条件的绑定
                option.contextCheck = [];
                bindContext(ori,option,contextParent);
            }else if(ori.contextRange){
                option.contextRange = [];
                if(ori.contextRange.length == 0){
                    var range = {
                        contextCheck:[]
                    }
                    if(ori.valueType == "term"){
                        range.text = "";
                    }else{
                        range.min = "";
                        range.max = "";
                    }
                    option.contextRange.push(range);
                }else{
                    angular.forEach(ori.contextRange,function (contextRange) {
                        var contextData = angular.copy(contextRange);
                        contextData.contextCheck = [];
                        bindContext(contextRange,contextData,contextParent);
                        option.contextRange.push(contextData);
                    });
                }
            }
        }

        function bindContext(ori,option,contextParent){
            angular.forEach(ori.context,function (oriContext) {
                option.contextCheck.push(angular.copy(contextParent.context));
                var optionContextCheck = option.contextCheck[option.contextCheck.length-1];
                //每一个前置条件都有一个特定的id
                if(oriContext.contextId){
                    optionContextCheck.contextId = oriContext.contextId;
                }
                angular.forEach(optionContextCheck,function (context) {
                    if("name_"+oriContext.eventType.id == context.id){
                        optionContextCheck.$select = context.id;
                    }
                    if(oriContext.eventPosition && context.eventPosition){
                        angular.forEach(context.eventPosition.options,function (position) {
                            if("name_"+oriContext.eventPosition.id == position.id){
                                context.eventPosition.value = position.id;
                            }
                        });
                    }
                    if(oriContext.eventNames&& context.eventNames){
                        var isHave = false;
                        angular.forEach(context.eventNames.options,function (name) {
                            if("name_"+oriContext.eventNames.id == name.id){
                                context.eventNames.value = name.id;
                                context.eventNames.valueCopy = name.id; //方便更多按钮记录上次选择的eventNames
                                isHave = true;
                            }
                        });
                        //药品和手术的前置条件可以搜索，搜到的内容在原options没有，需要加入到options中。同时对比是加入到手术还是药品的options中
                        if(!isHave&&("name_"+oriContext.eventType.id == context.id)){
                            var ori = angular.copy(oriContext.eventNames);
                            ori.id = "name_"+ori.id;
                            context.eventNames.value = ori.id;
                            context.eventNames.valueCopy = ori.id;
                            context.eventNames.options.unshift(ori);
                        }
                    }
                    if(oriContext.relationship&& context.relationship){
                        angular.forEach(context.relationship.options,function (ship) {
                            if("name_"+oriContext.relationship.id == ship.id){
                                context.relationship.value = ship.id;
                            }
                        });
                    }
                    if(oriContext.attributePosition&& context.attributePosition){
                        angular.forEach(context.attributePosition.options,function (attribute) {
                            if("name_"+oriContext.attributePosition.id == attribute.id){
                                context.attributePosition.value = attribute.id;
                            }
                        });
                    }
                    if(oriContext.customAttributes && context.customAttributes){
                        context.customAttributes = oriContext.customAttributes;
                    }
                });
                //将上次未设置的手术或者院内等加上默认选项
                angular.forEach(optionContextCheck,function (context) {
                    if(optionContextCheck.$select != context.id){
                        if(context.eventPosition){
                            context.eventPosition.value = context.eventPosition.options[0].id;
                        }
                        if(context.eventNames){
                            context.eventNames.value = context.eventNames.options[0].id;
                            context.eventNames.valueCopy = context.eventNames.options[0].id; //方便更多按钮记录上次选择的eventNames
                        }
                        if(context.relationship){
                            context.relationship.value = context.relationship.options[0].id;
                        }
                        if(context.attributePosition){
                            context.attributePosition.value = context.attributePosition.options[0].id;
                        }
                    }
                });
            })
        }
    }
    
    return{
        taskRollbackMapping:taskRollbackMapping
    }
}])