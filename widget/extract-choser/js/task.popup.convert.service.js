angular.module('infi-basic').service("TaskPopupConvertService",['$http','SYS',function ($http,SYS) {
    //条件选取页面中弹出框里面的额一些列操作
    var that = this;
    /**
     * 设置弹框的数据
     * @param info 当前类别选中项
     * @param infoList  所有类别
     * @param type 区分点击的是checkbox还是label
     * 弹框的出现与隐藏逻辑查看 setPopUpShow 方法，两个方法相似，一般需要一起改动
     */
    that.setTagDetail = function (info,infoList,type) {
        //控制弹窗的显示
        if(!info.popUp&&((type == "input"&&info.$checked)||(type == "label"&&!info.$active))){
            setOtherClose();
            info.$active = true;
            getTagData();
            if(type == "label"){
                info.$checked = true;
            }
        }else{
            info.$active = false;
            that.optChildNode(info,"close");
            if(info.popUp&&type == "label"){
                info.$checked = !info.$checked;
            }
        }

        //有弹框，并且主复选框没有选中则清除子集内容
        if(!info.popUp&&!info.$checked){
            that.optChildNode(info,"empty");
        }

        //设置数值类型自定义初始值
        function getTagData() {
            // 如果弹窗是范围控件，则给显示数组绑定一个空数据
            if(info.type || info.customRange){
                if(info.range.length == 0){
                    info.range.push({
                        min: "",
                        max: ""
                    })
                }
            }
        }

        //将此列表下的弹框都关闭
        function setOtherClose() {
            if(infoList.options){  //性别那一层级的点击
                angular.forEach(infoList.options,function (entity) {
                    angular.forEach(entity.children,function (tag) {
                        if(tag.$active){
                            tag.$active = false;
                            that.optChildNode(tag,"close");
                        }
                    })
                });
            }else{  //标签那一层级的点击
                angular.forEach(infoList,function (tag) {
                    if(tag.$active){
                        tag.$active = false;
                        that.optChildNode(tag,"close");
                    }
                })
            }

        }
    }

    /**
     * 父级与子集进行级联
     * @param parent 点击的父级数据
     */
    that.setParentCheck = function (parent) {
        //判断options的选中
        var idxAll=0,idxPart=0;
        if(parent.options){
            idxAll++;
            var index = checkSelected(parent.options);
            if(index == parent.options.length){
                idxPart++;
            }
        }
        //判断搜索出的结果的选中，保证searchData和searchData.data都存在
        if(parent.searchData && parent.searchData.data){
            idxAll++;
            var index = checkSelected(parent.searchData.data);
            if(index == parent.searchData.data.length){
                idxPart++;
            }

        }
        //判断range的选中
        if(parent.range&&parent.customRange){
            idxAll++;
            var index = checkSelected(parent.range);
            if(index == parent.range.length){
                var customRange = parent.customRange;
                if(customRange.length > 0){
                    var idx;
                    for(idx=0;idx<customRange.length;idx++){
                        var range = customRange[idx];
                        if(range.min != "" || range.max != ""){
                            break;
                        }
                    }
                    if(idx == customRange.length){
                        idxPart++;
                    }
                }else{
                    idxPart++;
                }
            }
        }
        //判断标签的选中
        if(parent.tabs){
            idxAll++;
            var index = checkSelected(parent.tabs);
            if(index == parent.tabs.length){
                idxPart++;
            }
        }
        //设置标签的子集的向上选中
        if(parent.children){
            idxAll++;
            var index = checkSelected(parent.children);
            if(index == parent.children.length){
                idxPart++;
            }
        }
        //判断关联属性的选中
        if(parent.relation){
            idxAll++;
            var index = checkSelected(parent.relation);

            if(index == parent.relation.length){
                idxPart++;
            }
        }
        //判断时间、带单位的选中
        if(parent.type&&(parent.type == 'date'||parent.type == 'unit')){
            idxAll++;
            var idx;
            for(idx=0;idx<parent.range.length;idx++){
                var range = parent.range[idx];
                if(range.min != "" || range.max != ""){
                    break;
                }
            }
            if(idx == parent.range.length){
                idxPart++;
            }
        }
        //判断前置条件的选中
        if(parent.contextCheck || parent.contextRange){
            idxAll++;
            if((parent.contextCheck&&parent.contextCheck.length == 0)||(parent.contextRange&&parent.contextRange.length == 0)){
                idxPart++;
            }
        }

        //控制父级选中与否
        if(idxAll == idxPart){
            parent.$checked = false;
        }else{
            parent.$checked = true;
        }
        
        //向上追溯父级的父级，一级一级往上级联
        if(parent.parent){
            that.setParentCheck(parent.parent);
        }

        function checkSelected(options) {
            var idx;
            for(idx=0;idx<options.length;idx++){
                if(options[idx].$checked){
                    return;
                }
            }
            return options.length;
        }
    }

    /**
     * 搜索出的数据转化成页面需要的格式，将options中选中的放入searchData中
     * @param original options的数据
     * @param searchData 搜索到的数据
     * @returns {Array}
     */
    that.matchSearchData = function (original,searchData) {
        var searchTo = [],
            returnData = {
                status:searchData.status,
                description:searchData.description,
                data:searchTo
            };

        //注matchOptions方法必须在现在的位置，否则里面方法的一些匹配就会有问题
        if(searchData.data != null){
            angular.forEach(searchData.data,function (entity) {
                var option={
                    id:entity.value,
                    label:entity.label,
                    value:entity.label,
                    parent:original,
                    searchType:"search",
                    valueType:entity.valueType?entity.valueType:"",
                    other: entity.other,
                    nodeType: "label"
                };
                if(original.context){
                    if(entity.valueType != null && entity.valueType == "term"){
                        option.contextRange = [];
                        option.contextRange.push({
                            text:"",
                            contextCheck:[]
                        });
                    }else if(entity.valueType != null && entity.valueType == "numberic"){
                        option.contextRange = [];
                        option.contextRange.push({
                            min:"",
                            max:"",
                            contextCheck:[]
                        });
                    }else if(entity.valueType == null){
                        option.contextCheck = [];
                    }
                }
                searchTo.push(option);
            });
            matchOptions();
        }else{
            matchOptions();
            if(searchTo.length > 0){
                returnData.status = SYS.STATUS_SUCCESS;
            }
        }

        //将options中选中的内容加入到searchData中
        function matchOptions() {
            //options选中的将选中内容更新到搜索结果中
            if(original.options){
                angular.forEach(original.options,function (option,idx) {
                    var idz = optionChecked(option);
                    idz && idz == searchTo.length ? searchTo.unshift(option) : undefined;
                    // if(option.$checked){
                    //     var idz = 0;
                    //     angular.forEach(searchTo,function (search,idy) {
                    //         //当options中选中的在searchDate中出现，则将searchData选中
                    //         if(option.id == search.id){
                    //             searchTo[idy] = option;
                    //         }else{
                    //             idz++;
                    //         }
                    //     });
                    //     //当options中选中的在searchDate中未出现，则将searchData加上options的此项
                    //     if(idz == searchTo.length){
                    //         searchTo.unshift(option);
                    //     }
                    // }

                    //查询到选中的数据加入到options中，当未选中则在options中移除
                    if(option.searchType&&option.searchType=="search"&&!option.$checked){
                        original.options.splice(idx,1);
                    }
                });
            }else if(original.tabs){
                matchTabs(original.tabs);
            }

        }

        function matchTabs(tabs) {
            angular.forEach(tabs,function (tab) {
                optionChecked(tab);
                tab.children ? matchTabs(tab.children) : undefined;
            });

        }

        function optionChecked(option) {
            if(option.$checked){
                var idz = 0;
                angular.forEach(searchTo,function (search,idy) {
                    //当options中选中的在searchDate中出现，则将searchData选中
                    if(option.id == search.id){
                        searchTo[idy] = option;
                    }else{
                        idz++;
                    }
                });

                return idz;
            }
        }

        return returnData;
    }

    /**
     * 设置options、tabs、searchData之间的选中级联以及前置条件的对应
     * 目前options与tabs没有同时存在,不用互相级联
     * (options与searchData)(tabs与searchData)互相级联并且前置条件对应
     * tabs中相同的id标签,只有在两者都选中时才进行对应,因为标签中涉及父级,父级不选中子集选中也无效
     * @param parent  点击的属性所在的父级数据
     * @param original  点击的属性数据
     * @parem checkedType  点击的是查询到的数据
     */
    that.setOptionsMapping = function(parent,original,checkedType){
        //options的选中
        if(parent.options){
            //标识循环的是options中内容，为了将searchData选中的加入到options中
            mapping(parent.options,"option");
        }

        //tabs的选中
        if(parent.tabs){
            matchTabs(parent.tabs);
        }
        
        function matchTabs(list) {
            mapping(list,'tabs');
            angular.forEach(list,function (tab) {
                if(tab.children){
                    matchTabs(tab.children);
                }
            });
        }

        //搜索得到的内容的选中
        if(parent.searchData && parent.searchData.data){
            mapping(parent.searchData.data,'search');
        }

        function mapping(options,type) {
            var isHaving = 0;
            angular.forEach(options,function (option) {
                if(original.id == option.id){
                    //点击search,options时才会将选中的状态同步,因为tabs有父级会影响
                    type != 'tabs' ? option.$checked = original.$checked : undefined;
                    if(checkedType){
                        //点击search时会将所有状态同步,包括tabs
                        option.$checked = original.$checked;
                        //循环的是tabs就得将父级也同步,因为tabs的父级选中才会将属性保存
                        type == 'tabs' ? that.setParentCheck(option.parent) : undefined;
                    }
                    //进行前置条件的对应
                    if(option.contextCheck){
                        option.contextCheck = original.contextCheck;
                    }else if(option.contextRange){
                        option.contextRange = original.contextRange;
                    }
                }else{
                    isHaving++;
                }
            });

            //当前操作的是searchData&&searchData没有加入到options中&&searchData选中&&循环的是options
            if(original.$checked&&original.searchType&&original.searchType=="search"&&isHaving == options.length&&type=='option'){
                options.unshift(original);
            }
        }
    }

    /**
     * 点击其他空白处弹框消失
     * @param scope  弹框作用域
     * @param event  点击的dom
     * @param original  弹框的数据
     * 弹框统一加一个class“infi-level”，通过此class来标识
     * 复选框和复选框后面的字加一个class“select-item”，不算作点击消失的dom
     * scope.$apply();当用js将数据处理完成之后，调用$apply()来重新绘制dom
     */
    that.hidePopUp = function (scope,event,original) {
        //浏览器兼容性
        var e = event || window.event;
        var elem = e.target || e.srcElement;

        //点击的是展开收起的按钮
        if($(elem).hasClass("select-item")){
            return;
        }else if($(elem).parents('.infi-choser-tab').length > 0){
            //点击的是多级标签的空白处,不进行收起
            return;
        }
        else if($(elem).parents('.infi-level').length == 2){
            //点击的是最底层即第四层的弹框的空白处
            return;
        }else if(($(elem).parents('.infi-level').length == 1) && !$(elem).hasClass('select-item')){
            //点击的是第三层的弹框空白处，并且不是复选框和复选框后面的字
            if(original.relation){
                angular.forEach(original.relation,function (relation) {
                    if(relation.relation){
                        that.optChildNode(relation,"close");
                    }
                });
            }
            scope.$apply();
        }else if($(elem).parents('.extract-choser').length > 0 && !$(elem).hasClass('select-item')){
            //点击的是第二层的弹框空白处，并且不是复选框和复选框后面的字
            that.optChildNode(original,"close");
            scope.$apply();
        }
        else{
            //循环判断至跟节点，防止点击的是div子元素
            while (elem) {
                if ($(elem).hasClass('glyphicon-minus') || $(elem).hasClass('infi-level')) {
                    return;
                }
                elem = elem.parentNode;
            }
            original.$active = false;
            that.optChildNode(original,"close");
            scope.$apply();
        }
    }

    /**
     * 控制弹框的显示和隐藏
     * @param option  点击的具体项
     * @param options  此项所在的数据源，目的是将其他的项的弹框清除
     * @param type  区分点击的是checkbox或者名称
     * @param noPopUp  是否有弹框
     * 有弹框的情况下：点击checkbox，选中-出弹框，未选中-关闭弹框；点击名称，点击前没有弹框-出弹框，checkbox选中，点击前已展开-关闭弹框
     * 无弹框的情况下：checkbox选中-将checkbox置为未选中；checkbox未选中-将checkbox置为选中
     */
    that.setPopUpShow = function (option,options,type,noPopUp) {
        if(!noPopUp&&((type == "input"&&option.$checked)||(type == "label"&&!option.$active))){
            setElementHide(options);
            //将其他的弹框收起
            option.$active = true;
            if(type == "label"){
                option.$checked = true;
            }
        }else{
            setElementHide(options);
            if(noPopUp&&type == "label"){
                option.$checked = !option.$checked;
            }
        }
        //有弹框，并且主复选框没有选中则清除子集内容
        if(!noPopUp&&!option.$checked){
            that.optChildNode(option,"empty");
        }

        function setElementHide(options) {
            angular.forEach(options,function(option){
                if(option.$active){
                    option.$active=false;
                    that.optChildNode(option,"close");
                }
            });
        }
    }

    /**
     * 主复选框没有选中则清除子集内容,关闭主弹框将子级弹框也关掉
     * @param parent  主复选框数据
     * @param type  区分是清空自己内容还是关掉子级弹框  all代表两种操作都做
     */
    that.optChildNode = function (parent,type) {
        if(parent.range&&parent.customRange){
            setOptionNoCheck(parent.range);
            if(type == "empty" || type == "all"){
                parent.customRange = [];
            }
            if(type == "close" || type == "all"){
                parent.customRange.$checked = false;
            }
        }

        if(parent.type&&(type == "empty" || type == "all")){
            parent.range = [];
        }
        if(parent.options){
            setOptionNoCheck(parent.options);
        }
        if(parent.tabs){
            setTabsEmpty(parent.tabs);
        }
        //点击的是tab中的自己元素
        if(parent.children){
            setTabsEmpty(parent.children);
        }

        function setTabsEmpty(tabs) {
            setOptionNoCheck(tabs);
            angular.forEach(tabs,function (tab) {
                if(tab.children){
                    setTabsEmpty(tab.children);
                }
            });
        }

        if(parent.searchData && parent.searchData.data){
            setOptionNoCheck(parent.searchData.data);
        }
        if(parent.relation){
            setOptionNoCheck(parent.relation);
        }
        if((parent.contextCheck&&parent.contextCheck.length > 0) || (parent.contextRange&&parent.contextRange.length>0)){
            if(type == "empty"|| type == "all"){
                setContextNull(parent);
            }
        }
        
        //循环options，将选中状态改为未选中
        function setOptionNoCheck(options) {
            angular.forEach(options,function (option) {
                option.$contextActive ? option.$contextActive = false : undefined;  //将前置条件关闭
                if(type == "close"|| type == "all"){
                    option.$active = false;
                }
                if(type == "empty"|| type == "all"){1
                    option.$checked = false;
                }
                that.optChildNode(option,type);
            });
        }
        //将前置条件置空
        function setContextNull(option) {
            if(option.valueType&& option.valueType == "term"){
                option.contextRange = [];
                //既有组又有前置条件的，默认点击父选项出现一大组
                option.contextRange.push({
                    text:"",
                    contextCheck:[]
                });
            }else if(option.valueType && option.valueType == "numberic"){
                option.contextRange = [];
                option.contextRange.push({
                    min:"",
                    max:"",
                    contextCheck:[]
                });
            }else{
                option.contextCheck = [];
            }
        }
    }

    /**
     * 显示前置条件,options和tabs中都有此方法
     * @param option  点击的数据
     * @param scope  作用域
     */
    that.setContextShow = function (option,scope) {
        if(scope.preOption){
            if(scope.preOption.id == option.id){
                option.$contextActive = !option.$contextActive;
            }else{
                scope.preOption.$contextActive = false;
                scope.preOption = option;
                option.$contextActive = true;
            }
        }else{
            scope.preOption = option;
            option.$contextActive = true;
        }
    }

    /**
     * 判断既往史下 ‘其他’ 这一级下是否还有选中的，如果没有就将 ‘其他’ 这一级删除
     * @param {*} children 既往史 下一级元素
     * @param {*} contents 既往史
     */
    that.hasChildChecked = function(children, contents) {
        var flag = false
        angular.forEach(children, function(value, index) {
            if (value.$checked) {
                flag = true
            }
        })
        // 如果范围外的标签都没被选中，就将“其他”移除
        if (!flag) {
            contents.tabs.pop();
        }
    }

    // 判断点击的选项是否已经在数组中
    that.checkOptionInTab = function(tabs, original) {
        var flag = false;
        angular.forEach(tabs.children, function(value, index) {
            if(original.id == value.id) {
                flag = true
            }
        })

        if(!flag) {
            // 修正搜索出的不在原先范围内的结果的 parent 指向，指为 “其他” 而不是 “既往史”
            original.parent = tabs
            tabs.children.push(original)
        }
    }
}]);