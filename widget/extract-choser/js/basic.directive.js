angular.module('infi-basic')
    .directive('choserLeftTab',['SYS','TaskInteractiveService',function (SYS,TaskInteractiveService) {
        return{  //左侧tab展示
            restrict:'A',
            templateUrl:'../src/widget/extract-choser/html/choser-left-tab.html',
            link:function (scope) {
                //左侧数据切换
                scope.leftTabChoice = function (targetData) {
                    TaskInteractiveService.leftTabChoice(scope.summaryData.data,targetData);
                }
            }
        }
    }])
    .directive('extractChoser',['DataAdapter','SYS','TaskInteractiveService','TaskPopupConvertService','TaskMappingService','PopupFilterService',function (DataAdapter,SYS,TaskInteractiveService,TaskPopupConvertService,TaskMappingService,PopupFilterService) {
        return{  //条件选取总页面
            restrict:'A',
            templateUrl:'../src/widget/extract-choser/html/index.html',
            scope:{
                summaryData:"=",  //页面显示的所有数据
                allData:"=",  //右侧显示的具体数据
                mappingData:"=",  //返回此页面时上次选中的数据
                used:'='  //标示条件选取/导出页面
            },
            link:function (scope) {
                scope.SYS = SYS;
                //初始化对数据进行处理
                if(scope.summaryData.status == SYS.STATUS_SUCCESS&&scope.allData.status == SYS.STATUS_SUCCESS){
                    //左侧tab数据整理
                    scope.summaryData.data = DataAdapter.convertCategory(scope.summaryData.data);
                    //左侧tab默认第一个选中
                    TaskInteractiveService.leftTabChoice(scope.summaryData.data,scope.summaryData.data[0]);
                    //右侧数据整理
                    scope.allData.data = DataAdapter.convertPopUp(scope.allData.data);
                    //筛选页面不显示关联属性\导出页面一些属性不显示弹框
                    if(scope.used == 'export'){
                        scope.allData.data = PopupFilterService.filterForExtract(scope.allData.data);
                    }else if(scope.used == 'screen'){
                        scope.allData.data = PopupFilterService.filterForFilter(scope.allData.data);
                    }
                    //左侧数据与右侧弹出数据合并
                    TaskInteractiveService.setCompleteData(scope.summaryData.data,scope.allData.data);
                    //返回此页面要做数据匹配对应
                    if(scope.mappingData){
                        TaskMappingService.taskRollbackMapping(scope.allData.data,scope.mappingData,scope.used);
                    }
                    //导出页面提取记录使用js拼接,所以要动态调用方法
                    if(scope.used == 'export'){
                        TaskInteractiveService.setExportRecord(scope.summaryData.data);
                    }
                    scope.summaryData.showLoad = true;  //将等待的标示去掉
                }

                /**
                 * 得到点击显示的数据
                 * @param info  点击的数据
                 * @param infoList  点击的数据数据
                 * @param type  标示点击的是文本还是checkbox
                 */
                scope.setTagDetail = function (info,infoList,type) {
                    TaskPopupConvertService.setTagDetail(info,infoList,type);
                    TaskInteractiveService.setExportRecord(scope.summaryData.data);
                }
            }
        }
    }])
    .directive('choserDetails',['TaskService','SYS','TaskInteractiveService','TaskPopupConvertService',function (TaskService,SYS,TaskInteractiveService,TaskPopupConvertService) {
        return{  //点击显示的具体的内容
            restrict:'A',
            templateUrl:'../src/widget/extract-choser/html/choser.html',
            scope: {
                contents: '=',  //显示的具体数据
                catogary:"="  //所有数据
            },
            replace :true,
            link:function(scope,element){
                scope.SYS = SYS;

                /**
                 * 输入字段进行搜索
                 * @param tag  盛放options，searchId等数据的数据集合
                 * searchData 对象格式，包含data，status，description，方便错误提示
                 */
                scope.searchMore = function (tag) {
                    // 搜索框内容修改后将前置条件弹框隐藏,否则页面会冲突
                    scope.$broadcast('closeContext');
                    TaskService.getSearchData(tag.searchId,tag.keyword).then(function (msg) {
                        var searchData = TaskPopupConvertService.matchSearchData(tag,msg);
                        tag.searchData = searchData;  //缓存搜的数据
                    });
                }

                /**
                 * 点击空白处，弹框依次关闭
                 */
                $(document).off('click');  //防止绑定多次,重复调用
                $(document).click(function (event) {
                    TaskPopupConvertService.hidePopUp(scope,event,scope.contents);
                })
            }
        }
    }])
    .directive('choserOption',['TaskInteractiveService','TaskPopupConvertService',function (TaskInteractiveService,TaskPopupConvertService) {
        return {  //弹窗里‘所有属性’的显示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/choser-options.html',
            replace: true,
            scope:{
                options:"=",  //循环的需要显示的数据
                contents:"=",  //父级数据
                catogary:"=",  //所有数据
                type:"="       //标示展示类型
            },
            link:function (scope) {
                /**
                 * 自定义选项的显示隐藏
                 * @param content
                 */
                scope.showRangeGroup = function (content) {
                    content.$checked = !content.$checked;
                    if (content.length == 0) {
                        content.push({
                            min: "",
                            max: ""
                        });
                    }
                }

                /**
                 * option级联上一级
                 */
                scope.setTagCheck = function (original) {
                    /**
                     * 判断点击的搜索结果是否为在范围外
                     * 如果是，则判断现有 tab 里是否有 ‘其他’，没有则手动添加
                     * 并将点击的对象添加进 ‘其他’ 的 children 属性中
                     */
                    if (original.other == 1) {
                        if (scope.contents.tabs[scope.contents.tabs.length-1].label != '其他') {
                            scope.contents.tabs.push({
                                // id: '255360',
                                children: [],
                                label: "其他",
                                parent: scope.contents,
                                nodeType: "label",
                            })
                        }

                        // 判断点击的结果项是否已经在 tab 的 chilidren 中
                        TaskPopupConvertService.checkOptionInTab(scope.contents.tabs[scope.contents.tabs.length-1], original)
                        TaskPopupConvertService.hasChildChecked(scope.contents.tabs[scope.contents.tabs.length-1].children, scope.contents)
                        
                    }


                    scope.preOption ? scope.preOption.$contextActive = false : undefined;
                    //必须先做options和tabs的对应才能向上级联
                    TaskPopupConvertService.setOptionsMapping(scope.contents,original,scope.type);
                    //操作的是search的数据并且tabs存在时不用级联,在上一步optionsMapping中级联已经操作了
                    (scope.type == 'search' && scope.contents.tabs) ? undefined : TaskPopupConvertService.setParentCheck(original.parent);
                    TaskInteractiveService.setExportRecord(scope.catogary);
                }
                /**
                 * 显示前置条件
                 * @param option
                 */
                scope.showContext = function (option) {
                    TaskPopupConvertService.setContextShow(option,scope);
                }
                /**
                 * 将前置条件框隐藏
                 */
                scope.$on('closeContext',function () {
                    scope.preOption ? scope.preOption.$contextActive = false : undefined;
                });
            }
        }
    }])
    .directive('choserTab',['TaskInteractiveService','TaskPopupConvertService',function (TaskInteractiveService,TaskPopupConvertService) {
        return {  //弹窗的‘tab’的显示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/choser-tabs.html',
            replace: true,
            scope:{
                tabs:"=",  //循环的显示数据
                contents:"=",  //父级数据
                catogary:"=",  //所有数据
                context:"="  //带有前置条件模板的那一层级数据
            },
            link:function (scope) {
                /**
                 * 上部tab切换
                 * @param entity  点击的数据
                 * @param content  循环的父级数据,与extractChoser中的此方法数据略有差别
                 * @param type 标示点击的是文本还是checkbox
                 */
                scope.showTabDetail = function (entity,content,type) {
                    scope.preOption ? scope.preOption.$contextActive = false : undefined;
                    TaskPopupConvertService.setTagDetail(entity,content,type);
                    TaskPopupConvertService.setOptionsMapping(scope.catogary,entity);
                    TaskPopupConvertService.setParentCheck(scope.contents);
                    TaskInteractiveService.setExportRecord(scope.catogary);
                }
                /**
                 * 显示前置条件
                 * @param option
                 */
                scope.showContext = function (option) {
                    TaskPopupConvertService.setContextShow(option,scope);
                }

                /**
                 * 标签过多,20条以上的展示或者隐藏
                 * @param type
                 */
                scope.showTabsAll = function (type) {
                    scope.contents.showAll = type == 'down' ? true : false;
                }
                /**
                 * 将前置条件框隐藏
                 */
                scope.$on('closeContext',function () {
                    scope.preOption ? scope.preOption.$contextActive = false : undefined;
                });
            }
        }
    }])
    .directive('choserGroupRanges',['TaskPopupConvertService',function (TaskPopupConvertService) {
        return {  //弹窗的‘最小值、最大值’显示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/choser-group-range.html',
            replace: true,
            scope:{
                ranges:"=",
                contents:"="
            },
            link:function (scope) {
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
                    //删除组时调用级联，上一级选中或者不选中
                    scope.setTagCheck();
                }

                /**
                 * 分组级联上一级
                 */
                scope.setTagCheck = function () {
                    TaskPopupConvertService.setParentCheck(scope.contents);
                }
            }
        }
    }])
    .directive('choserContexts',['TaskInteractiveService','TaskPopupConvertService',function (TaskInteractiveService,TaskPopupConvertService){
        return {  //弹窗的‘前置条件’的显示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/choser-context.html',
            replace: true,
            scope:{
                option:"=",  //出现前置条件的那一项
                contents:"=",  //有前置条件模板的数据
                catogary:"=",  //所有数据
                type:"="       //标示展示类型
            },
            link:function(scope){
                /**
                 * 添加前置条件
                 * @param option 点击的某个具体属性
                 * @param contents  带有外层带有context的数据，方便判断既有前置条件又有分组
                 * @param parent  既有组又有前置条件的添加前置条件后设置父级的级联是对parent即属性进行的操作
                 */
                scope.addContext = function (option,contents,parent) {
                    if(contents.context && !option.contextCheck){
                        //前置条件情况
                        option.contextCheck=[];
                    }
                    setFirstOptionSelected(option,contents);
                    if(parent){
                        contextChangeCheck(parent);
                    }else{
                        contextChangeCheck(option);
                    }
                }

                /**
                 * 删除前置条件
                 * @param option 前置条件所在的属性
                 * @param idx 此条前置条件的位置
                 * @param  parent  既有组又有前置条件的删除前置条件后设置父级的级联是对parent即属性进行的操作
                 */
                scope.removeContext = function (option,idx,parent) {
                    option.contextCheck.splice(idx,1);
                    if(parent){
                        contextChangeCheck(parent);
                    }else{
                        contextChangeCheck(option);
                    }
                }

                /**
                 * 添加前置条件和小分组
                 * @param option 点击的某个具体属性
                 * @param contents  带有外层带有context的数据，方便判断既有前置条件又有分组
                 */
                scope.addRangeContext = function (option) {
                    if(option.valueType && option.valueType == "term"){
                        var contextRange = {
                            text:"",
                            contextCheck:[]
                        };
                    }else if(option.valueType && option.valueType == "numberic"){
                        var contextRange = {
                            min:"",
                            max:"",
                            contextCheck:[]
                        };
                    }

                    option.contextRange.push(contextRange);
                    contextChangeCheck(option);
                }

                /**
                 * 删除前置条件和小分组
                 * @param option 前置条件所在的属性
                 * @param idx 此条前置条件的位置
                 */
                scope.removeRangeContext = function (option,idx) {
                    option.contextRange.splice(idx,1);
                    contextChangeCheck(option);
                }

                /**
                 * 关闭前置条件弹窗
                 * @param relas
                 */
                scope.closeRela = function(relas){
                    relas.$contextActive=false;
                };

                /**
                 * 前置条件的下拉框内容改变，修改筛选记录
                 */
                scope.setExportRecord = function (events) {
                    //events选中值发生变化时，点击更多弹出弹出框；valueCopy记录上次选中的值，防止点击更多后更多将上次值覆盖
                    if(events&&events.value == "more"){
                        events.value = events.valueCopy;
                        events.showModel = true;
                        scope.eventsSelect = events;
                    }else{
                        if(events){
                            events.valueCopy = events.value;
                        }
                        TaskPopupConvertService.setOptionsMapping(scope.contents,scope.option,scope.type);
                        TaskInteractiveService.setExportRecord(scope.catogary);
                    }
                }

                /**
                 * 前置条件下拉框的默认选中第一个
                 * @param option
                 * @param contents
                 */
                function setFirstOptionSelected(option,contents) {
                    //用angular.copy方法，避免把context中的$$hashKey赋值给option.context
                    option.contextCheck.push(angular.copy(contents.context));
                    // gqm_debug 新添加的前置条件默认显示‘院内’，在这里写的不好
                    angular.forEach(option.contextCheck[option.contextCheck.length-1],function (context,index) {
                        if(index == 0){
                            option.contextCheck[option.contextCheck.length-1].$select = context.id;
                        }
                        if(context.eventPosition){
                            context.eventPosition.value = context.eventPosition.options[0].id;
                        }
                        if(context.eventNames){
                            context.eventNames.value = context.eventNames.options[0].id;
                            context.eventNames.valueCopy = context.eventNames.options[0].id;  //方便更多按钮记录上次选择的eventNames
                        }
                        if(context.relationship){
                            context.relationship.value = context.relationship.options[0].id;
                        }
                        if(context.attributePosition){
                            context.attributePosition.value = context.attributePosition.options[0].id;
                        }
                    });
                }

                /**
                 * 添加、删除前置条件所做的一些列操作
                 * @param option
                 */
                function contextChangeCheck(option) {
                    //有前置条件则父选项选中，没有则不选中
                    if((option.contextCheck&&option.contextCheck.length > 0) || (option.contextRange&&option.contextRange.length > 0)){
                        option.$checked = true;
                    }else{
                        option.$checked = false;
                    }

                    //options选中，则相应的tabs也选中；相反也会级联
                    TaskPopupConvertService.setOptionsMapping(scope.contents,option,scope.type);
                    //子集选中或者不选中，父级也会跟着级联
                    TaskPopupConvertService.setParentCheck(option);
                    //导出页面的筛选记录
                    TaskInteractiveService.setExportRecord(scope.catogary);
                }
            }
        }
    }])
    .directive('choserRelations',['TaskInteractiveService','SYS','TaskPopupConvertService',function (TaskInteractiveService,SYS,TaskPopupConvertService) {
        return {  //弹窗的‘关联属性’的显示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/choser-relation.html',
            replace: true,
            scope: {
                contents: "=",  //父级元素
                relations:"=",  //要循环的关联属性
                catogary:"=",  //所有数据
                searchMore:"&"  //关联属性中有moreResourceId的也可以进行属性搜索
            },
            link: function (scope) {
                scope.SYS = SYS;

                /**
                 * 关联属性给上一级做级联
                 */
                scope.setTagCheck = function (tag,relations,type) {
                    //点击出关联属性里面的其他项目值
                    var noPopUp = !(tag.options || tag.tabs || tag.relation);  //标识此属性下面是否可以出弹框
                    TaskPopupConvertService.setPopUpShow(tag,relations,type,noPopUp);

                    TaskPopupConvertService.setParentCheck(scope.contents);
                    TaskInteractiveService.setExportRecord(scope.catogary);
                }
            }
        }
    }])
    .directive('recordExtracts',['TaskPopupConvertService',function (TaskPopupConvertService){
        return {  //条件选取页面‘筛选条件’的展示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/record-extract.html',
            replace: true,
            scope:{
                summaryData:"="
            },
            link:function (scope) {
                /**
                 * 点击筛选条件的X号，将选中的变为未选中
                 * @param option 一级标题‘手术名称’那一级别
                 */
                scope.deleteFilter = function (option) {
                    option.$checked = false;  //不选中
                    option.$active = false;  //显示关闭
                    TaskPopupConvertService.optChildNode(option,"all");
                }

                /**
                 * 清空所有筛选条件
                 * @param summaryData
                 */
                scope.deleteAllFilter = function (summaryData) {
                    angular.forEach(summaryData,function (summary) {
                        angular.forEach(summary.options,function (options) {
                            angular.forEach(options.children,function (option) {
                                scope.deleteFilter(option);
                            })
                        })
                    })
                }
            }
        }
    }])
    .directive('recordContexts',function () {
        return {  //筛选条件中‘前置条件’的展示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/record-context.html',
            replace: true,
            scope: {
                contexts: "="
            }
        }
    })
    .directive('recordTabs',function () {
        return {  //筛选条件中‘前置条件’的展示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/record-tabs.html',
            replace: true,
            scope: {
                tabs: "=",
                parent:"=",
                contents:"="
            }
        }
    })
    .directive('contextSearch',['TaskService','SYS','TaskInteractiveService',function (TaskService,SYS,TaskInteractiveService) {
        return {  //前置条件中的‘eventNames’中搜索‘手术名称或者药品名称’的展示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/attribute-search.html',
            replace: true,
            scope:{
                contents:"=",
                catogary:"="
            },
            link:function(scope){
                scope.SYS = SYS;
                //搜索
                scope.searchMore = function (tag) {
                    TaskService.getSearchData(tag.searchId,tag.keyword).then(function (msg) {
                        scope.contents.searchData = msg;
                    });
                }
                /**
                 * 确定或者关闭的操作
                 * @param original 原始数据
                 * @param type  标识是确定还是关闭
                 */
                scope.optSearchData = function (original,type) {
                    if(type == "ok" && original.searchData && original.searchData.data){
                        var searchData = original.searchData.data;
                        angular.forEach(searchData,function (search) {
                            if(searchData.value == search.value){
                                search.id = "name_"+search.value;
                                var isHave = false;
                                angular.forEach(original.options,function (option) {
                                    if(search.id == option.id){
                                        isHave = true;
                                        original.value = option.id;
                                        original.valueCopy = option.id;
                                    }
                                })
                                if(!isHave){
                                    original.options.unshift(search);
                                    original.value = search.id;
                                    original.valueCopy = search.id;
                                }
                            }
                        });
                        TaskInteractiveService.setExportRecord(scope.catogary);
                    }
                    delete original.searchData;
                    delete original.keyword;
                    original.showModel = false;
                }
            }
        }
    }])
    .directive('searchTab',['TaskInteractiveService','TaskPopupConvertService','$timeout',function (TaskInteractiveService,TaskPopupConvertService,$timeout) {
        return {  //检验,按照首字母排序显示
            restrict: 'A',
            templateUrl: '../src/widget/extract-choser/html/search-tabs.html',
            replace: true,
            scope:{
                contents:"=",  //父级数据
                catogary:"=",  //所有数据
                type:"="       //标示展示类型
            },
            link:function (scope) {
                //分类mapping
                scope.codeList = [{label:"AB",content:[{label:"A"},{label:"B"}],reg:/^[a-b]$/i},
                    {label:"CD",content:[{label:"C"},{label:"D"}],reg:/^[c-d]$/i},
                    {label:"EFG",content:[{label:"E"},{label:"F"},{label:"G"}],reg:/^[e-g]$/i},
                    {label:"HJ",content:[{label:"H"},{label:"J"}],reg:/^[h-j]$/i},
                    {label:"KL",content:[{label:"K"},{label:"L"}],reg:/^[k-l]$/i},
                    {label:"MNP",content:[{label:"M"},{label:"N"},{label:"P"}],reg:/^[m-p]$/i},
                    {label:"QR",content:[{label:"Q"},{label:"R"}],reg:/^[q-r]$/i},
                    {label:"ST",content:[{label:"S"},{label:"T"}],reg:/^[s-t]$/i},
                    {label:"WX",content:[{label:"W"},{label:"X"}],reg:/^[w-x]$/i},
                    {label:"YZ",content:[{label:"Y"},{label:"Z"}],reg:/^[y-z]$/i}];

                //数据整理
                for(var i=0;i < scope.contents.tabs.length;i++){
                    var tab = scope.contents.tabs[i],
                        pinYin = tab.pinYin.split('|'),
                        letter = pinYin[2].slice(0,1).toUpperCase();
                    for(var j=0;j<scope.codeList.length;j++){
                        var codeContent = scope.codeList[j].content;
                        for(var z=0;z<codeContent.length;z++){
                            var code = codeContent[z];
                            !code.content ? code.content = [] : undefined;
                            if(code.label == letter){
                                code.content.push(tab);
                                continue;
                            }
                        }
                    }
                }
                scope.codeList[0].$active = true;

                //按照字母顺序排序的数据
                scope.switchTabs = function (code) {
                    angular.forEach(scope.codeList,function (entity) {
                        entity.$active = false;
                    });

                    code.$active = true;
                }

                /**
                 * 首级tab切换
                 * @param entity  点击的数据
                 * @param content  循环的父级数据,与extractChoser中的此方法数据略有差别
                 * @param type 标示点击的是文本还是checkbox
                 */
                scope.showTabDetail = function (entity,content,type) {
                    scope.preOption ? scope.preOption.$contextActive = false : undefined;
                    TaskPopupConvertService.setTagDetail(entity,content,type);
                    TaskPopupConvertService.setParentCheck(scope.contents);
                    TaskInteractiveService.setExportRecord(scope.catogary);
                }

                /**
                 * 显示前置条件
                 * @param option
                 */
                scope.showContext = function (option) {
                    TaskPopupConvertService.setContextShow(option,scope);
                }
                /**
                 * 将前置条件框隐藏
                 */
                scope.$on('closeContext',function () {
                    scope.preOption ? scope.preOption.$contextActive = false : undefined;
                });
            }
        }
    }]);