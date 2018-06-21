angular.module("infi-basic").service('AdapterConvert',[function () {
    // 取数-条件选取针对不同的类型,options,tabs做出一些列处理
    var that = this,
        commitMappingData = {};

    /**
     * 提交时将对比的mappingdata置空
     */
    that.setCommitMappingNull = function () {
        commitMappingData = {};
    }
    
    //后台读到的数据对于不同情况进行不同处理  contextLogic：逻辑配置页面左侧前置条件的显示
    that.tagAdapters = {
        options : function(pojo,entity){
            if(pojo.valueType=="term"&&pojo.resourceDimensionDatas&&pojo.resourceDimensionDatas.length > 0) {
                entity.options = [];
                that.setScene.from(entity,entity.options, pojo.resourceDimensionDatas, "value");
            }
            // gqm_debug先暂时注释,有需要再完善
            // else if(pojo.resourceDimensionDatas&&pojo.resourceDimensionDatas.length == 0&&pojo.moreResourceId){
            //     //没有options，但是有moreResourceId可以搜索，所以给它一个空的options
            //     entity.options = [];
            // }
        },
        tabs : function(pojo,entity){  //多层级的数据独立处理
            function setDatas(list,tabs,parent) {
                angular.forEach(list,function (entity) {
                    var tab = {
                        label:entity.label,
                        id:entity.value,
                        parent:parent,  //点击向上级联时方便使用
                        valueType:entity.valueType?entity.valueType:"",  //用于标识既有组又有前置条件的属性类型
                        searchType:"",  //用与标识属性是搜索到的还是原来属性中存在的
                        nodeType:entity.nodeType,  //标示此层级是什么标签
                        pinYin:entity.pinYin  //可搜索的标签
                    };
                    if(entity.children){
                        tab.children = [];
                        setDatas(entity.children,tab.children,tab);
                    }
                    tabs.push(tab);
                });
            }
            if(pojo.tabResourceDimensionDatas&&pojo.tabResourceDimensionDatas.length > 0) {
                //目前检验项目要修改成按ABCD首字母分组
                entity.tabs = [];
                if(pojo.label == '检验项目'){
                    entity.searchTab = true;  //首字母筛选模板
                }else{
                    entity.searchTab = false;  //普通多层级模板
                }
                setDatas(pojo.tabResourceDimensionDatas,entity.tabs,entity);
            }
        },
        context : function(pojo,entity) {
            if (pojo.context.length > 0) {
                entity.context = [];
                angular.forEach(pojo.context, function (contexts) {
                    var context = {
                        id: "name_" + contexts.id,  //angular select绑定时数字形式的id绑定不好用
                        label: contexts.label
                    }
                    if (contexts.eventPosition.options != null && contexts.eventPosition.options.length > 0) {
                        context.eventPosition = changeContextId(contexts.eventPosition,"id");
                    }
                    if (contexts.eventNames.options != null && contexts.eventNames.options.length > 0) {
                        context.eventNames = changeContextId(contexts.eventNames,"value");
                        context.eventNames.searchId=contexts.moreResourceId?contexts.moreResourceId:""
                    }
                    if (contexts.relationship.options != null && contexts.relationship.options.length > 0) {
                        context.relationship = changeContextId(contexts.relationship,"id");
                    }
                    //前...小时,可以直接输入
                    if (contexts.customAttributes != null && contexts.customAttributes.label == "yes") {
                        context.customAttributes = {label: "", id: contexts.customAttributes.id}
                    }
                    if (contexts.attributePosition.options != null && contexts.attributePosition.options.length > 0) {
                        context.attributePosition = changeContextId(contexts.attributePosition,"id");
                    }
                    entity.context.push(context);
                });

                //给有前置条件的option加一个空的用于页面中显示的前置条件数据
                if (entity.options) {
                    setOptionContext(entity.options);
                }
                //数值类型暂时没有前置条件
                if (entity.range && entity.customRange) {
                    setOptionContext(entity.range);
                }

                if (entity.tabs) {
                    setTabContext(entity.tabs,entity);
                }
                //导出页面,第一层级的前置条件
                if (!entity.options && !entity.tabs) {
                    entity.contextCheck = [];
                }
            }

            //带层级的标签需要递归展示
            function setTabContext(list,parent) {
                //检验名称nodeType为tag的不显示前置条件
                if(pojo.label == '检验项目'){
                    if(parent.nodeType == 'leaf'){
                        setOptionContext(list);
                    }
                }else{
                    setOptionContext(list);
                }

                angular.forEach(list, function (tab) {
                    if(tab.children){
                        setTabContext(tab.children,tab);
                    }
                });
            }

            /**
             * 给前置条件的id做处理适应angular select的绑定
             * @param options
             * @returns {*}
             */
            function changeContextId(options,type) {
                angular.forEach(options.options,function (option) {
                    option["id"]="name_"+option[type];
                });
                return options;
            }

            /**
             * 给有前置条件的option加上空contextCheck数据
             * @param original
             */
            function setOptionContext(original) {
                angular.forEach(original,function (option) {
                    if(option.valueType&& option.valueType == "term"){  //valueType为term则显示分组的文本前置条件
                        option.contextRange = [];
                        //既有组又有前置条件的，默认点击父选项出现一大组
                        option.contextRange.push({
                            text:"",
                            contextCheck:[]
                        });
                        option.valueType = "term";
                    }else if(option.valueType && option.valueType == "numberic"){//valueType为numberic则显示分组的数字前置条件
                        option.contextRange = [];
                        option.contextRange.push({
                            min:"",
                            max:"",
                            contextCheck:[]
                        });
                        option.valueType = "numberic";
                    }else{  //显示普通的前置条件
                        option.contextCheck = [];
                    }
                });
            }
        },
        range : function(pojo,entity){
            if(pojo.valueType=="numberic"&&pojo.resourceDimensionDatas.length > 0) {
                entity.range = [];
                that.setScene.from(entity,entity.range,pojo.resourceDimensionDatas,"value","numberic");
                entity.customRange = [];  //自定义的数据
            }
        },
        unit : function(pojo,entity){
            if(pojo.valueType=="numberic"&&pojo.resourceDimensionDatas.length == 0&&!pojo.multiValue) {
                entity.type = "unit";
                entity.range = [];
            }
        },
        date : function(pojo,entity){
            if(pojo.valueType=="date") {
                entity.type = "date";
                entity.format = "yyyy-MM-dd";  //gqm_debug 后台没有给时间格式
                entity.range = [];
            }
        },
        group : function(pojo,entity){
            if(pojo.valueType=="numberic"&&pojo.resourceDimensionDatas.length == 0&&pojo.multiValue) {
                entity.type = "group";
                entity.range = [];
            }
        },
        relation : function(pojo,entity){
            if(pojo.childs != null && pojo.childs.length > 0){
                entity.relation = [];
                that.setScene.from(entity,entity.relation,pojo.childs,"id");
            }
        },
        contextLogic : function (original,tagOriginal,tagData) {
            if ((original.context && original.context.length > 0) || (original.contextRange && original.contextRange.length > 0)) {
                if (original.context) {
                    setContext(original, original.label, 'context');
                } else if (original.contextRange) {
                    angular.forEach(original.contextRange, function (range) {
                        var contextHtml = "", onlyContext = false;
                        if (original.valueType == "numberic" && (range.min != "" || range.max != "")) {
                            contextHtml = "(";
                            contextHtml += range.min + "~" + range.max;
                        } else if (original.valueType == "term" && range.text != "") {
                            contextHtml = "(";
                            contextHtml += range.text;
                        } else {
                            onlyContext = true;
                        }
                        contextHtml += onlyContext ? "" : ")";

                        //检验参数，最小值、最大值或者文本没有填写是不允许拖动的，检验信息的检验名称即使没有上述数组也是可以拖动的
                        if (onlyContext && (tagData.tagName == "超声心动图参数" || tagData.tagName == "椎动脉超声参数" || tagData.tagName == "颈动脉超声参数")) {
                        } else {
                            //填写了最小值、最大值或者文本的两种情况，没设置前者的按普通的处理
                            if (onlyContext) {
                                setContext(range, original.label, 'contextRange', onlyContext);
                            } else {
                                setContext(range, contextHtml, 'contextRange', onlyContext);
                            }
                        }
                    })
                }
            } else {
                //没有前置条件的内容也要加到数据项中
                original.uniqueId = original.id;  //uniqueId区分同一属性下的不同前置条件，uniqueId是最小匹配id
                tagOriginal.values.push(angular.copy(original));
            }

            /**
             * 逻辑配置页面前置条件的title拼写
             * @param range  带有前置条件数据
             * @param contextText 显示的label的前缀
             * @param type 标识是context还是contextRange
             * @param onlyContext 标识contextRange时候有最小值、最大值等
             * @returns {*}
             */
            function setContext(range,contextText,type,onlyContext){
                if(range.context.length > 0){
                    angular.forEach(range.context,function (tag) {
                        var contextHtml = contextText?contextText:"";
                        contextHtml += "[";
                        contextHtml += tag.eventType.label +"_";
                        contextHtml += !tag.eventPosition?"":"_"+tag.eventPosition.label;
                        contextHtml += !tag.eventNames?"":"_"+tag.eventNames.label;
                        contextHtml += !tag.relationship?"":"_"+tag.relationship.label;
                        contextHtml += !tag.customAttributes?"":"_"+tag.customAttributes.label;
                        contextHtml += !tag.attributePosition?"":"_"+tag.attributePosition.label;
                        contextHtml += "]";

                        var tagValue = angular.copy(original);
                        tagValue.uniqueId = tag.contextId;  //不同组的不同前置条件或者属性的不同前置条件设置一个唯一id来标识是哪个情况
                        tagValue.label = contextHtml;
                        if(type == "context"){  //只有前置条件情况，将前置条件放到普通的数组中
                            tagValue.context = tag;
                            tagOriginal.values.push(tagValue);
                        }else{ //既有组又有前置条件
                            tagValue.contextRange= angular.copy(range);
                            tagValue.contextRange.context = angular.copy(tag);
                            if(onlyContext){  //没有填写最小值、最大值等的情况
                                tagOriginal.values.push(tagValue);
                            }else{  //填写了最大值、最小值等的情况
                                tagData.values.push(tagValue);
                            }
                        }
                    })
                }else{  //既有组又有前置条件的情况，但是没有填写前置条件,以组和前置条件的数组中这一项为最小单位
                    var tagValue = angular.copy(original);
                    tagValue.contextRange= angular.copy(range);
                    tagValue.uniqueId = range.rangeId;
                    tagValue.label = contextText;
                    tagData.values.push(tagValue);
                }

            }
        }
    };
    
    //页面向后台传递的数据对于不同情况进行不同处理
    //options中传入“option”字符串，目的是标识options，加上type=“name”
    that.tagSubmitAdapters = {
        options : function (original,tag) {
            if(original.options){
                that.setScene.to(original.options,tag,"option");
            }
        },
        range : function (original,tag) {
            if(original.range&&original.customRange){
                that.setScene.to(original.range,tag,"option");
                if(original.customRange.length > 0){
                    that.setScene.to(original.customRange,tag,"numberic");
                }
            }
        },
        unit : function (original,tag) {
            if(original.type && original.type=="unit"){
                that.setScene.to(original.range,tag,"numberic");
            }
        },
        group : function (original,tag) {
            if(original.type && original.type=="group"){
                that.setScene.to(original.range,tag,"numberic");
            }
        },
        date : function (original,tag) {
            if(original.type && original.type=="date"){
                that.setScene.to(original.range,tag,"date");
            }
        },
        tabs : function (original,tag) {  //多层级数据单独处理
            if(original.tabs){
                transformTabs(original.tabs,original);
            }
            function transformTabs(list,parent) {
                angular.forEach(list,function (tab) {
                    //tab.nodeType == 'classity'---按急慢性分类不选中,但是子集选中也得向后台传递
                    if(tab.$checked||tab.nodeType == 'classity'){
                        if(tab.$checked&&tab.nodeType != 'classity'){  //nodeType=classity不向后台传递
                            //为防止自己id重复,使用顶级父级id与自己id拼接形式
                            var mappingId = tag.values ? tag.tagId+"_"+tab.id : tag.id+"_"+tab.id;
                            if(!commitMappingData[mappingId]) {
                                commitMappingData[mappingId] = mappingId;
                                var option = {
                                    label:tab.label,
                                    value:tab.label,
                                    type:tab.nodeType ? 'tag' : 'name',  //用于向后台传递的标示数据类型
                                    valueType:tab.valueType,
                                    searchType:tab.searchType
                                }
                                if(tag.values){  //条件选取页面数据保存
                                    option.id = tag.tagId+"_"+tab.id;  //标签的id有的也是重复的，在这里也做了拼接
                                    tag.values.push(option);
                                }else{  //前置条件中的标签,目前好像没有此种情况
                                    if(!tag.options){
                                        tag.options = [];
                                    }
                                    option.id = tab.id;
                                    tag.options.push(option);
                                }
                                that.tagSubmitAdapters.context(tab,option);
                            }
                        }
                        if(tab.children){
                            transformTabs(tab.children,tab);
                        }
                    }
                });
            }
        },
        context : function (original,tag) {
            //区分是只有前置条件还是前置条件和组都有
            if (original.contextCheck || original.contextRange) {
                if (original.contextCheck) {
                    //只有前置条件
                    tag.context = [];
                    angular.forEach(original.contextCheck, function (context) {
                        angular.forEach(context, function (child) {
                            setCommitContext(context, child, tag.context);
                        });
                    });
                } else if (original.contextRange) {
                    //即有前置条件还有组
                    tag.contextRange = [];
                    angular.forEach(original.contextRange, function (contextRange) {
                        //区分是数值类型的组还是文本类型的组,最大值、最小值有一个填写或者前置条件填写就加入到contextRange中
                        if ((original.valueType == "term" && (contextRange.text != "" || contextRange.contextCheck.length > 0)) ||
                            (original.valueType == "numberic" && ((contextRange.min != "" && !isNaN(contextRange.min)) || (contextRange.max != "" && !isNaN(contextRange.max)) || contextRange.contextCheck.length > 0))) {

                            var contextRangeData = {
                                context: [],
                                rangeId:contextRange.rangeId?contextRange.rangeId:new Date().getTime()+Math.floor(Math.random()*100+1)
                            };
                            if (original.valueType == "term") {
                                contextRangeData.text = contextRange.text;
                            } else if (original.valueType == "numberic") {
                                contextRangeData.min = contextRange.min;
                                contextRangeData.max = contextRange.max;
                            }
                            angular.forEach(contextRange.contextCheck, function (context) {
                                angular.forEach(context, function (child) {
                                    setCommitContext(context, child, contextRangeData.context);
                                });
                            });
                            tag.contextRange.push(contextRangeData);
                        }
                    });
                }
            }

            //将原始的前置条件转换成需要的格式
            function setCommitContext(context,child,contextCommit) {
                if(context.$select == child.id){
                    contextCommit.push({
                        contextId:context.contextId?context.contextId:new Date().getTime()+Math.floor(Math.random()*100+1),  //为了同一属性的前置条件需要分别拖动做一个唯一标识
                        eventType:{
                            label:child.label,
                            id:+context.$select.substr(5)
                        },
                        eventPosition:matchContext(child.eventPosition), //eventNames的唯一标识为value，其他的为id，所以在这做了区分
                        relationship:matchContext(child.relationship),
                        eventNames:matchContext(child.eventNames),
                        attributePosition:matchContext(child.attributePosition),
                        customAttributes:(child.customAttributes && !isNaN(child.customAttributes.label))?child.customAttributes:null
                    });
                }
            }

            //将前置条件里面的内容转化成需要的格式,此处的contextChild是前置条件的具体项
            function matchContext(child) {
                var contextChild=null;
                if(child){
                    angular.forEach(child.options,function (option) {
                        if(option["id"] == child.value){
                            contextChild = {label:option.label,id:+option["id"].substr(5)};
                        }
                    })
                }
                return contextChild;
            }
        },
        relation : function (original,tag) {
            //页面中有属性时,属性选中才可以传递关联属性;无属性是,关联属性选中即可传递
            //关联属性作用位置不同
            var optionTrue = ((original.options||original.tabs) && tag.options && tag.options.length > 0) || (!original.options&&!original.tabs);
            if(original.relation&&optionTrue){
                tag.relation=[]
                that.setScene.to(original.relation,tag,"",tag.relation);
            }
        }
    }
    
    /**
     * 设置option和relation等数据的匹配和提取
     */
    that.setScene = {
        /**
         * @param tag   传入的包含range，options，tabs等父级数据，目的是在给子数据设置parent，做级联时方便使用
         * @param tagValue 传入的是range或options等
         * @param original 要循环数据
         * @param type 区分唯一标识是value还是id
         * @param identity valueType=="numberic"的数据使用minValue和maxValue拼写value
         */
        from:function(tag,tagValue,original,type,identity){
            angular.forEach(original,function (dimension) {
                var option = {
                    id:dimension[type],
                    parent:tag,  //级联
                    valueType:dimension.valueType?dimension.valueType:"",  //用于标识既有组又有前置条件的属性类型
                    searchType:"",  //用与标识属性是搜索到的还是原来属性中存在的
                    nodeType:dimension.nodeType  //标示此层级是什么标签
                }

                //对于可以添加自定义的数值型的value为最小值与最大值拼接
                if(identity){
                    option.value = dimension.minValue+"~"+dimension.maxValue;
                    option.label = dimension.minValue+"-"+dimension.maxValue;
                }else{
                    option.value = dimension.label;
                    option.label = dimension.label;
                }
                tagValue.push(option);

                //关联属性包含关联属性;关联属性包含option详情;关联属性包含有标签的数据
                var adapters = ["relation","options","tabs"],
                    entity = tagValue[tagValue.length-1],
                    idx;
                entity.searchId=dimension.moreResourceId?dimension.moreResourceId:"";  //关联属性中属性需要搜索
                for( idx=0; idx<adapters.length; idx++){
                    var fn = adapters[idx];
                    that.tagAdapters[fn](dimension,entity);
                }
            })
        },
        to:function (original,checkedData,identity,relation) {
            //type=tag/name的判定
            //tabs中的数据本来应该都有nodeType,但是检验特殊,上面标签有nodeType,标签下面的属性没有nodeType
            //检验-上面标签type=tag,标签下面的属性type=name.其他多级标签的都为type=tag
            //==============目前还没出现即有options又有tabs
            //options中的数据,有多级标签的数据有nodeType,没有多级标签的没有nodeType
            //options-有多级标签存在的type=tag,没有多级标签存在的type=tag
            angular.forEach(original,function (tag,index) {
                if(tag.$checked){
                    //方便mapping的id对比数据
                    var tagId = checkedData.tagId?checkedData.tagId:checkedData.id,
                    //区分条件选取页面和导出页面采用的id的key不同情况
                        tagValueId = checkedData.tagId?checkedData.tagId.toString()+"_"+tag.id.toString():tag.id,
                        mappingId = tagId + "_"+ tag.id;
                    
                    if(!commitMappingData[mappingId]){
                        commitMappingData[mappingId] = mappingId;
                        var tagSubmit = {
                            label:tag.label,
                            id:tagValueId,  //‘姓名’等一级的id有可能与‘男、女’id相同，此处将二级id转换成不同的,
                            value:tag.value?tag.value:tag.label,
                            valueType:tag.valueType,
                            searchType:tag.searchType
                        }
                        //给男、女那一级加上标识位
                        if(identity&&identity == "option"){
                            tagSubmit.type = tag.nodeType ? 'tag' : 'name';  //有nodeType的就是tag,有的options中的数据类型也是tag,所以要有标示
                        }

                        //options包含前置条件，relation包含relation，relation包含options或者tabs
                        var adapters = ["context","relation","options","tabs"],
                            idx;
                        for( idx=0; idx<adapters.length; idx++){
                            var fn = adapters[idx];
                            that.tagSubmitAdapters[fn](tag,tagSubmit);
                        }

                        if(checkedData.values){  //条件选取页面盛放选中的options或者tabs
                            checkedData.values.push(tagSubmit);
                        }else if(relation){  //数据导出页面盛放关联属性选中项
                            relation.push(tagSubmit);
                        }else{  //数据导出页面盛放选中的options或者tabs；关联属性里面包含的options或者tabs的选中项
                            if(!checkedData.options){
                                checkedData.options = [];
                            }
                            checkedData.options.push(tagSubmit);
                        }
                    }
                }

                //将自定义的内容呈现方式转换成min～max形式,不是时间的最小值、最大值有值并且为数字才可以向后台传递,是时间最小值、最大值有值就可以向后台传递
                if(identity ){
                    if((identity == "numberic"&&((tag.min!=""&&!isNaN(tag.min))||(tag.max!=""&&!isNaN(tag.max))))
                        ||(identity == "date"&&(tag.min!=""||tag.max!=""))){
                        checkedData.values.push({
                            label:tag.min+'~'+tag.max,
                            id:checkedData.tagId.toString()+"_"+index.toString()+'_range',  //给自定义范围的数据加上id，不能与前面有范围的重复
                            value:tag.min+'~'+tag.max,
                            type:"name",  //所有自定的都是name形式
                            valueType:"",
                            searchType:""
                        })
                    }
                }
            })
        }
    }
}]);