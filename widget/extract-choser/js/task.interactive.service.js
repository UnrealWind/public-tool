angular.module('infi-basic').service("TaskInteractiveService",['$http','SYS',function (){
    var that = this;

    /**
     * 左侧菜单的选中
     * @param original  左侧所有循环的数据
     * @param entity  点击的数据
     */
    that.leftTabChoice = function (original,entity) {
        angular.forEach(original,function (target) {
            //将左侧选中的清除
            target.$active = false;
        });
        entity.$active = true;
    }
    
    /**
     * 当左侧数据与弹窗数据都加载完成时，将弹窗数据放入左侧数据中
     * @param tree 左侧数据
     * @param all  所有数据
     */
    that.setCompleteData = function (tree,all) {
        if(all && tree){
            angular.forEach(tree,function (summary,idx) {
                angular.forEach(summary.options,function (option,idy) {
                    angular.forEach(option.children,function (child,idz) { //循环summary结束，找到‘姓名’那一级
                        angular.forEach(all,function (detail) {  //循环recordPage弹窗数据，找到‘姓名那一级’
                            if(detail.id == child.id){
                                // child = detail;  gqm_debug 为什么这样给$scope.summaryData赋值赋不上
                                tree[idx].options[idy].children[idz] = detail;
                            }
                        })
                    })
                })
            });
        }
    }

    /**
     * 设置导出页面的属性提取记录
     * @param original
     */
    that.setExportRecord = function(original){
        //只有导出页面才运用此方法
        if($(".record-export").length > 0){
            var recordHtml = "",
                optionMap = {};  //设置options选中的对象，用于处理显示选中的option不重复
            angular.forEach(original,function (catogary) {
                angular.forEach(catogary.options,function (folder) {
                    angular.forEach(folder.children,function (tag) {
                        setTagHtml(tag);
                    });
                });
            });

            $(".record-export").html(recordHtml);
            $("#collectedExpRecDetail .node-outside").html(recordHtml)
        }

        //设置一个项的html
        function setTagHtml(tag) {
            if(tag.$checked){
                var inlineBlock = tag.popUp?"infi-inline-block":"",
                    block = !tag.popUp?"infi-block":"",
                    colon = tag.popUp?"":":";
                var tagHtml = "<div class='"+inlineBlock+"'>";
                tagHtml += "<span class='infi-title block'>"+tag.label+colon+"</span>";

                tagHtml += setOptionHtml(tag);
                tagHtml += setTabsHtml(tag);
                tagHtml += setContextHtml(tag);
                tagHtml += setRelationHtml(tag);

                tagHtml += "</div>";

                recordHtml += tagHtml;
            }
        }

        //设置关联属性
        function setRelationHtml(tag,identify) {
            var tagValueHtml = "";
            if(tag.relation){
                var hasRelation = false;
                angular.forEach(tag.relation,function (relation) {
                    if(relation.$checked){
                        if(!hasRelation){
                            if(identify){
                                tagValueHtml += "<div>(";
                            }else{
                                tagValueHtml += "<div>";
                            }
                            tagValueHtml += "<span class='infi-record-title'>[关联属性]：</span>";
                        }
                        tagValueHtml += "<span class='infi-record-detail'>"+relation.label+"</span>";

                        tagValueHtml += setOptionHtml(relation,tag,"relation");
                        tagValueHtml += setTabsHtml(relation,"relation");
                        tagValueHtml += setRelationHtml(relation,"relation");

                        hasRelation = true;
                    }
                });
                if(hasRelation){
                    if(identify){
                        tagValueHtml += ")<div>";
                    }else{
                        tagValueHtml += "</div>";
                    }
                }
            }
            return tagValueHtml;
        }

        //设置options
        function setOptionHtml(tag,parent,identify){
            var tagValueHtml = "",
                tagId = parent && parent!=""?parent.id:tag.id;
            if(tag.options){
                var hasOption = false;
                angular.forEach(tag.options,function (option) {
                    //option选中并且没有显示过的才显示
                    var mappingId = tagId + "_" + option.id;
                    if(option.$checked && !optionMap[mappingId]){
                        optionMap[mappingId] = mappingId;
                        if(identify && !hasOption){
                            tagValueHtml += "(";
                        }
                        tagValueHtml += "<span class='infi-record-detail'>"+option.label+"</span>";

                        tagValueHtml += setContextHtml(option);

                        hasOption = true;
                    }
                });
                if(hasOption && identify){
                    tagValueHtml += ")";
                }
            }
            return tagValueHtml;
        }

        //设置tabs
        function setTabsHtml(tag,identify){
            var tagValueHtml = "";
            if(tag.tabs){
                tagValueHtml += matchTabs(tag.tabs,tag);
            }

            return tagValueHtml;
        }

        function matchTabs(list,parent) {
            var tagValueHtml = "";
            angular.forEach(list,function (tab) {
                var mappingId = parent.id + "_" + tab.id;
                if(tab.$checked && !optionMap[mappingId]&&tab.nodeType!='classity'){  //nodeType='classity'不显示在记录中
                    optionMap[mappingId] = mappingId;
                    tagValueHtml += "<span class='infi-record-detail'>"+tab.label+"</span>";
                    tagValueHtml += setContextHtml(tab);
                }
                if((tab.$checked||tab.nodeType=='classity')&&tab.children){
                    tagValueHtml += matchTabs(tab.children,parent);
                }
            });
            
            return tagValueHtml;
        }

        //设置前置条件
        function setContextHtml(tag) {
            var tagValueHtml = "";
            if(tag.contextCheck&&tag.relation){
                if(tag.contextCheck.length > 0){
                    tagValueHtml += "<div>";
                    tagValueHtml += setContext();
                    tagValueHtml += "</div>";

                }
            }else if(tag.contextCheck&&(!tag.options && !tag.tabs && !tag.searchData)){
                if(tag.contextCheck.length > 0){
                    tagValueHtml += "<div class='infi-inline' style='padding-right: 10px;'>(";
                    tagValueHtml += setContext();
                    tagValueHtml += "</span>)</div>";
                }
            }

            function setContext() {
                var valueHtml = "";
                valueHtml += "<span class='infi-record-title'>[前置条件]：</span><span>";
                angular.forEach(tag.contextCheck,function (context,index) {
                    if(index != 0){
                        valueHtml+="、";
                    }
                    angular.forEach(context,function (child) {
                        if(context.$select == child.id){
                            valueHtml+=child.label;
                            valueHtml+=matchContext(child.eventPosition);
                            valueHtml+=matchContext(child.eventNames);
                            valueHtml+=matchContext(child.relationship);
                            valueHtml+=child.customAttributes?"_"+child.customAttributes.label:""
                            valueHtml+=matchContext(child.attributePosition);
                        }
                    })
                });
                return valueHtml;
            }

            function matchContext(child) {
                if(child){
                    var idx,options = child.options;
                    for(var idx=0;idx<options.length;idx++){
                        var option = options[idx];
                        if(option["id"] == child.value){
                            return "_"+option.label;
                        }
                    }
                }
                return "";
            }
            return tagValueHtml;
        }
    }
}]);