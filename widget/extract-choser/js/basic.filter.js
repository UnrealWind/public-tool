angular.module('infi-basic')
    .filter('recordExtractTabs',[function(){
        //筛选条件选取页面筛选条件显示,标签中属性与options中相同要去重
        return function(parent,child,option,childIndex) {
            if(child.$checked&&(!child.searchType||child.searchType!='search')){
                var idx;
                if(option.options){  //父级有options,判断options是否有属性与此属性相同
                    for(idx=0;idx<option.options.length;idx++){
                        var opt = option.options[idx];
                        if(opt.id == child.id){  //options中有属性与tabs中相同,则将tabs中隐藏
                            return "hide";
                        }
                    }
                }
                //如果options没有,则判断同级标签列表中是否有相同属性
                //tabs中如果有相同属性,只保留最后一个属性,其他的隐掉
                var lastTab,lastOption;
                if(option.tabs){
                    matchTabs(option.tabs,option);
                }
                function matchTabs(list,listParent) {
                    for(var idy = 0;idy < list.length;idy++){
                        var tab = list[idy];
                        if(tab.id == child.id && tab.$checked){  //两者id相同并且后者选中情况下才去重
                            lastTab = listParent;  //盛放最后一个相同的属性父级
                            lastOption = idy;  //盛放最后一个属性的index
                        }
                        if(tab.children){
                            matchTabs(tab.children,tab);
                        }
                    }
                }
                //最后一个相同属性与本属性的父级相同,最后一个循环属性与本属性index相同,则为最后一个
                if(lastTab.id != parent.id||lastOption != childIndex){
                    return "hide";
                }
            }
        }
    }])
    .filter('InputCheck',[function(){
        //校验数值输入框是否输入的为数值
        return function(content,type) {
            if(type == "range"&&(!isNaN(content.min) && !isNaN(content.max))){
                return "hide";
            }else if(type == "context"){  //暂时还没有写前置条件中输入的提示
                if(content&&(!isNaN(content.label))){
                    return "hide";
                }else if(!content){
                    return "hide";
                }
            }
        }
    }])
    .filter('tabsShow',[function(){
        //多级标签中tab切换没有子集的隐藏,因为判断是在repeat里面,所以会出现一个空的div
        return function(content) {
            for(var i = 0; i < content.length; i++){
                if(content[i].nodeType == 'label' || content[i].nodeType == 'leaf'){
                    return "";
                }
            }
            return "hide";
        }
    }])
    .directive('contextMoreModal',[function () {
        //前置条件中药品或者疾病更多的搜索框位置居中.模态框没有用bootstrap因为有太多定位,致使弹出框显示有问题
        return{
            restrict:'A',
            replace:true,
            link:function (scope,element) {
                var targetWidth = element.width(),
                    screenWidth = $(window).width();
                var positionLeft = (screenWidth-targetWidth)/2;
                element.css("left",positionLeft+"px");
            }
        }
    }])
    .directive('modalPosition',[function () {
        //弹出框位置动态改变,防止弹出框显示不全或者位置不好
        return{
            restract:'A',
            replace:true,
            link:function (scope,element) {
                var eleWidth = element.outerWidth()+50,
                    leftPosition = element.offset().left,
                    screenWidth = $(window).width(),
                    rightPosition = screenWidth-leftPosition;
                //弹框的宽度大于距离屏幕右侧的长度，并且弹框长度小于屏幕宽度，弹框向左移动
                if(rightPosition < eleWidth && screenWidth > eleWidth){
                    var left = (rightPosition-eleWidth)+"px";
                    element.css("left",left);
                }else if(rightPosition < eleWidth && screenWidth < eleWidth){
                    //弹框的宽度大于距离屏幕右侧的长度，并且弹框长度大于屏幕宽度，弹框顶到屏幕最左侧
                    var left = -screenWidth + "px";
                    element.css("left",left);
                }
            }
        }
    }]);