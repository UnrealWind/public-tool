function FormLogic(tags,groups,$target){
    init();

    /**
     * 拼写logic与或html
     * @param optionData
     * @returns {string}
     */
    function genLogicHtml(optionData){
        var isEqual = {
            "and": "",
            "or": ""
        };
        //标识与或按钮哪个是选中状态
        if (optionData.logic == "and") {
            isEqual.and = "active";
        } else {
            isEqual.or = "active";
        }

        return '<div class="infi-logic-btn">' +
            '<button class="btn infi-btn-linear-default ' + isEqual.and + '">与</button>' +
            '<button class="btn infi-btn-linear-default ' + isEqual.or + '">或</button>&nbsp;&nbsp;' +
            '<i class="glyphicon glyphicon-minus-sign remove-group" title="删除组"></i>'+
            '</div><br />';
    }

    /**
     * 拼写外围容器html,给每个容器添加唯一标识id
     * @param group
     * @returns {string}
     */
    function genGroupHtml(group){
        var targetHtml = "";
        //判断是否是logic
        if (group.logic) {
            //是logic则增加与或按钮
            targetHtml += genLogicHtml(group);
        } else{
            //不是logic则增加具体内容 getLogicContainer()
            targetHtml += genGroupDetailHtml();
            for (var idx = 0; idx < group.length; idx++) {
                if (group[idx].logic) {
                    targetHtml += genLogicHtml(group[idx]);
                } else if (group[idx].length&&group[idx].length>0) {
                    //数据为数组，则生成新的section
                    targetHtml += genGroupHtml(group[idx]);
                } else if(group[idx].isEqual){
                    //数据为对象，直接生成内容
                    targetHtml += genOptionHtml(group[idx]);
                }
            }
            targetHtml += '</div>';
        }
        return targetHtml;
    }

    /**
     * 返回组的外框的html
     * @returns {string}
     */
    function genGroupDetailHtml() {
        return '<div class="infi-screen-details node-parent" ondragover="formLogic.allowDrop(event)" ondrop="formLogic.drop(event)">' +
            '<div class="infi-section-title">' +
            '<button class="btn infi-btn-linear-green-l btn-sm add-group">添加组</button>' +
            '</div>';
    }

    /**
     * 拼写具体属性
     * @param sourceData 性别那一层级数据
     * @returns {string}
     */
    function genOptionHtml(sourceData){
        var childHtml = "",
            ischeck = {
                yes: "",
                no: ""
            };
        if (sourceData.isEqual == "yes") {
            ischeck.yes = "selected";
        } else if (sourceData.isEqual == "no") {
            ischeck.no = "selected";
        }
        //拼写具体项数组中数据,判断values是数组还是对象。loginJson中values为对象，拖动时为数组
        if(sourceData.values.length){
            for (var idx = 0; idx < sourceData.values.length; idx++) {
                childHtml+=genDetailHtml(sourceData,sourceData.values[idx],ischeck);
            }
        }else{
            childHtml+=genDetailHtml(sourceData,sourceData.values,ischeck);
        }

        return childHtml;
    }

    /**
     * 获取具体配置项的html
     * @param sourceData  性别那一层级的数据
     * @param value  男、女那一层的数据
     * @param ischeck 选择的是等于还是不等于
     * @returns {string}
     */
    function genDetailHtml(sourceData,value,ischeck) {
        var childHtml = "";
        childHtml += '<div unique="' + sourceData.id + '" class="infi-logic-detail">' +
            '<span class="infi-logic-detail-label">' + sourceData.tagName + '</span>:<span class="glyphicon glyphicon-minus-sign remove-detail"></span>' +
            '<select class="form-control infi-input-w-xsx infi-logic-detail-equal" value="' + sourceData.isEqual + '">' +
            '<option value="yes" ' + ischeck.yes + '>等于</option>' +
            '<option value="no" ' + ischeck.no + '>不等于</option>' +
            '</select>';
        childHtml += '<span class="infi-logic-detail-value" unique="' + value.id+'">' + value.label +'</span></div>&nbsp&nbsp';
        return childHtml;
    }

    /**
     * 右侧logic逻辑配置html拼写
     */
    function drawGroups(){
        //groups(右侧部分数据),只取数据类型为数组的数据
        if(groups.length > 0){
            var targetHtmls="";
            for (var idx = 0; idx < groups.length; idx++) {
                targetHtmls += genGroupHtml(groups[idx]);
            }

            $target.append(targetHtmls);
        }
    }

    //初始化
    function init(){
        drawGroups();
    }
    //===========================以上是右侧逻辑配置html显示拼写，以下是右侧逻辑配置数据获取

    /**
     * 获取逻辑配置json
     * @param historyData  逻辑配置历史记录数据
     * @returns {Array}
     */
    function getFilterData(historyData){
        var outContainer = $target,
            elem = outContainer.children(),
            filterData = [],
            filterRecord = "";
        elem.each(function (index) {
            //在筛选历史记录里面，最后一个项不显示“or”“and”所以用一个变量标识是不是最后一个
            var isLast = elem.length-1 == index;
            filterRecord = getGroupData($(this), filterData,filterRecord,"",isLast);
        });
        if(historyData){
            historyData.unshift({num:"",historyLogic:filterRecord});
        }
        return filterData;
    }

    var logicTextFirst;
    /**
     * 获取组里面的数据
     * @param ele  循环的某一项dom
     * @param data 向后台传递的数据集合
     * @param recordData  显示的历史记录
     * @param logicText 传递进来的与或的值
     * @param isLast 是否是最后一项
     * @returns {*}  注意，向方法中传递recordData的方法，最后赋值时直接recordData = function方法，不能用+=
     */
    function getGroupData(ele, data,recordData,logicText,isLast) {
        if (ele.hasClass('infi-logic-btn')) {
            logicTextFirst = getLogicData(data,ele);
        } else if (ele.hasClass('node-parent')) {
            recordData +='(';
            var logicData = [];
            var logicTextSecond = "";
            ele.children().each(function (index) {
                if ($(this).hasClass('infi-logic-btn')) {
                    logicTextSecond = getLogicData(logicData,$(this));
                } else if ($(this).hasClass('infi-logic-detail')) {
                    var isLast = ele.children().length - 1 == index;
                    recordData+=getOptionData(logicData,$(this),logicTextSecond,isLast)
                } else if ($(this).hasClass('node-parent')) {
                    var isLast = ele.children().length - 1 == index;
                    recordData = getGroupData($(this), logicData,recordData,logicTextSecond,isLast);
                }
            })
            data.push(logicData);
            recordData +=')';

            //外层容器的直接子容器采用外层的与或，里面的内容采用‘node-parent’里面的与或，所以需要传递与或数据
            if(!isLast && logicText != ""){
                recordData += logicText;
            }else if(!isLast && logicText == ""){
                recordData += logicTextFirst;
            }
        }
        return recordData;
    }

    /**
     * 获取具体属性数据
     * @param data 盛放配置项的数据
     * @param ele  配置项($(this))
     * @param logicTextSecond
     * @param isLast  是否是最后一项，最后一项历史记录拼写不添加"or/and"
     * @returns {string}
     */
    function getOptionData(data,ele,logicTextSecond,isLast) {
        var logicDetailData = {
                id: ele.attr("unique"),
                values: {}
            },
            historyLogic = "";
        ele.children().each(function (index) {
            if ($(this).hasClass('infi-logic-detail-label')) {
                historyLogic+=$(this).text();
            } else if ($(this).hasClass('infi-logic-detail-equal')) {
                var equal = $(this).val() == "yes" ? " = " : " != ";
                historyLogic+=equal;
                logicDetailData.isEqual = $(this).val();
            } else if ($(this).hasClass('infi-logic-detail-value')) {
                historyLogic+=$(this).text();
                historyLogic += (index == ele.children().length-1)?"":'、';
                getValueData($(this).attr("unique"),logicDetailData);
            }
        });

        if(!isLast){
            historyLogic += logicTextSecond;
        }

        data.push(logicDetailData);
        return historyLogic;
    }

    /**
     * 获取具体配置项数据
     * @param id 配置项id
     * @param logicDetailData 盛放配置项的数据
     */
    function getValueData(id,logicDetailData) {
        angular.forEach(tags,function (tag) {
            if(logicDetailData.id == tag.id){
                logicDetailData.tagId = tag.tagId;
                logicDetailData.tagLabel = tag.tagLabel;
                logicDetailData.tagName = tag.tagName;
                angular.forEach(tag.values,function (entity) {
                    if(entity.id == id){
                        logicDetailData.values = angular.copy(entity);
                        getContextData(logicDetailData.values);
                    }
                })
            }
        })
    }

    /**
     * 前置条件数据获取
     * @param id  配置项id
     * @param logicDetailData 盛放配置项的数据
     */
    function getContextData(value){
        if(value.contextRange){
            //既有组又有前置条件的情况，如果没有设置则group里面的属性都为空
            if(value.contextRange.length == 0){
                var range = {
                    context:null
                };
                if(value.valueType == "term"){
                    range.text = "";
                }else{
                    range.min = "";
                    range.max = "";
                }
                value.group = range;
                delete value.contextRange;
            }else{
                //前置条件数组长度为0则context=null
                value.contextRange.context = (!value.contextRange.context||value.contextRange.context.length == 0)?null:value.contextRange.context;
                value.group = angular.copy(value.contextRange);
                delete value.contextRange;
            }
        }else if(value.context){
            value.context = (!value.context||value.context.length == 0)?null:value.context;
        }
    }

    /**
     * 获取逻辑与或数据
     * @param data
     * @param ele
     * @returns {string}
     */
    function getLogicData(data,ele) {
        var logicData = {},
            historyLogic = "";
        ele.children().each(function () {
            if ($(this).hasClass('active') && $(this).text() == "与") {
                logicData.logic = "and";
                historyLogic =' and '
            } else if ($(this).hasClass('active') && $(this).text() == "或") {
                logicData.logic = "or";
                historyLogic = ' or '
            }
        })
        data.push(logicData);
        return historyLogic;
    }
    //==========================以上是右侧逻辑配置数据获取，以下是拖拽一系列操作和右侧页面上的操作

    /**
     * 添加组
     * @param tar 添加组按钮（$(this)）
     */
    function addGroup(tar){
        var target = tar.closest(".node-parent"), //找到外层指定父容器即section，在section里面再加入section
            childHtml = "";
        childHtml += '';
        //要加入的容器中存在一个以上的子节点，要给新加入的节点加上与或按钮
        childHtml += genGroupDetailHtml() + genLogicHtml({and: "", or: "active"}) + "</div>";
        target.append(childHtml);
    }

    /**
     * 与或按钮选择
     * @param tar
     */
    function choseLogic(tar){
        tar.addClass('active').siblings().removeClass('active');
    }

    /**
     * 删除逻辑配置具体项
     * @param elemParent  删除按钮所在的具体项
     * @param target  //父级组
     */
    function removeOption(elemParent,target){
        var eleParents = elemParent.parents(".node-parent");
        var detailId = elemParent.children('.infi-logic-detail-value').attr("unique"),
            parentId = elemParent.attr("unique");
        //通过父级和子集id找到原始数据中的具体项
        searchOption(detailId,parentId);
        for(var i=0;i<eleParents.length;i++){
            //可用元素一个往上，只删除自己并且不再循环
            var childLenth = eleParents.eq(i).children('.node-parent').length + eleParents.eq(i).children('.infi-logic-detail').length;
            if(childLenth > 1 && i == 0){
                elemParent.remove();
                break;
            }else if(childLenth > 1){
                eleParents.eq(i-1).remove();
                break;
            }else if(eleParents.eq(i).hasClass("node-outside")){
                eleParents.eq(i).children().remove();
            }
        }
    }

    /**
     * 删除逻辑配置组
     * @param parent 父级组
     */
    function removeGroup(parent) {
        //循环dom，找到父级和子级id
        searchOptionDom(parent);
        //删除的组为最外层，则删除容器里面的元素
        if(parent.hasClass('node-outside')){
            parent.children().remove();
        }else{
            //删除的子集组是父级唯一的节点并且父级为最外层容器，则删除容器里面的元素
            if(parent.parents('.node-parent').length == 1){
                if(parent.siblings('.node-parent').length == 0){
                    $(".node-outside").children().remove();
                }else{
                    parent.remove();
                }
            }else{
                parent.remove();
            }
        }
    }

    function drag(e) {
        e.dataTransfer.setData("Text", e.target.id);
        e.dataTransfer.effectAllowed = 'copy';
    }

//拖拽成功，释放鼠标时触发
    function drop(e) {
        e.preventDefault();   //阻止默认行为
        e.stopPropagation();  //阻止冒泡
        var sourceElem = $('#' + e.dataTransfer.getData("Text")),   //被拖动的元素
            targetElem = e.target || e.srcElement;   //放置的目标元素
        // 这里使用的angular的API，获取到待拖动元素的原始数据
        var scope = $('.infi-box').scope(),
            recordData = tags;

        while (targetElem) {
            //用于盛放拖动元素的标识以及拖动元素对应的数据
            var sourceData = null;
            //判断拖动的元素是姓名、年龄等；还男、女、冠心病等
            for (var idx = 0; idx < recordData.length; idx++) {
                //拖动的是姓名类型的
                if (recordData[idx].tagId == sourceElem.attr("id")) {
                    sourceData = recordData[idx];
                    sourceData.isEqual = "";
                    //将此组中的具体项标识次数加一
                    setGroupRecord(sourceData,'add');
                    break;
                } else {
                    //拖动的是男、女类型的,唯一标示为id
                    for (var idy = 0; idy < recordData[idx].values.length; idy++) {
                        if (recordData[idx].values[idy].id == sourceElem.attr("id")) {
                            sourceData = angular.copy(recordData[idx]);
                            sourceData.isEqual = "";
                            sourceData.values = [];
                            sourceData.values.push(recordData[idx].values[idy]);
                            //将此具体项标识次数加一
                            setOptionRecord(recordData[idx].values[idy],'add');
                            break;
                        }
                    }
                }
            }

            //此节点有名为'node-parent'的class为元素的上一级
            if ($(targetElem).hasClass('node-parent')) {
                var childHtml = '';
                //容器为最外层容器
                if ($(targetElem).parents(".node-parent").length == 0) {
                    if ($(targetElem).children().length == 0) {
                        //容器中有子节点，在生成section前面加上与或按钮
                        childHtml += genLogicHtml({and: "", or: "active"});
                    }
                    childHtml += genGroupDetailHtml() + genLogicHtml({and: "", or: "active"})+ genOptionHtml(sourceData);
                    $(targetElem).append(childHtml);
                } else {
                    //将拖拽的内容直接放入容器中
                    childHtml += genOptionHtml(sourceData);
                    if($(targetElem).children('.infi-logic-detail').length > 0){  //拖拽的detail放到最后一个detail后面
                        $(targetElem).children('.infi-logic-detail:last').after(childHtml);
                    }else{
                        $(targetElem).children('br').after(childHtml);
                    }
                }

                //拖动结束后重新绘图
                scope.changeChart(getFilterData(scope.groupData.historyData));

                //找到父级元素就停止向上找
                return;
            }
            targetElem = targetElem.parentNode;
        }
    }

    function allowDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }

    /**
     * 查询DOM中显示详情值的唯一标识
     * @param parent 父级组的dom
     */
    function searchOptionDom(parent) {
        var childNode = parent.children();
        childNode.each(function () {
            if($(this).hasClass('infi-logic-detail')){
                var detailId = $(this).children('.infi-logic-detail-value').attr("unique"),
                    parentId = $(this).attr("unique");
                searchOption(detailId,parentId);
            }else if($(this).hasClass('node-parent')){
                searchOptionDom($(this));
            }
        })
    }

    /**
     * 通过targetId和子集id在原始数据中找到此项
     * @param detailId 子集id
     * @param parentId  父级id
     */
    function searchOption(detailId,parentId) {
        var idx,idy;
        for(idx=0;idx<tags.length;idx++){
            var parent = tags[idx];
            if(parent.id == parentId ){
                for(idy=0;idy<parent.values.length;idy++){
                    var child = parent.values[idy];
                    if(child.id == detailId){
                        setOptionRecord(child,"remove");
                    }
                }
            }
        }
    }

    /**
     * 组的标识，循环组标识具体项的拖动次数
     * @param group 原始数据
     * @param type  增加拖动次数还是减少拖动次数
     */
    function setGroupRecord(group,type) {
        var index;
        for(index=0;index<group.values.length;index++){
            setOptionRecord(group.values[index],type);
        }
    }

    /**
     * 具体项标识，记录具体项的拖动次数
     * @param option 具体项数据
     * @param type  增加拖动次数还是减少拖动次数
     */
    function setOptionRecord(option,type) {
        if(type == "add"){
            option.number = option.number?++option.number:1;
        }else if(type == "remove"){
            --option.number;
        }
    }

    return {
        drop:drop,
        drag: drag,
        allowDrop:allowDrop,
        addGroup:addGroup,
        removeOption:removeOption,
        choseLogic:choseLogic,
        getFilterData:getFilterData,
        removeGroup:removeGroup
    }
}
