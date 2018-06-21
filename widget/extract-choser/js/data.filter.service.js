angular.module('infi-basic').service('PopupFilterService',['SYS',function(SYS){
    // 取数-条件选取与导出页面不显示的内容的标示配置
    /**
     * 去除掉页面选取页面显示不需要的数据
     * @param tag
     * @returns {*}
     */
    function filterForFilter(tag) {
        angular.forEach(tag,function (tagValue) {
            //没有数据的不显示弹窗
            if(!tagValue.tabs && !tagValue.options && !tagValue.range && !tagValue.type){
                //控制弹框的显示与否
                tagValue.popUp="hide";
            }
            //去除关联属性
            if(tagValue.relation){
                delete tagValue.relation;
            }
        });
        return tag;
    }

    /**
     * 去除掉导出页面显示不需要的数据
     * @param tag
     * @returns {*}
     */
    function filterForExtract(tag) {
        angular.forEach(tag,function (tagValue) {
            //没有数据的不显示弹窗
            if(!tagValue.relation && !tagValue.tabs && !tagValue.options){
                //控制弹框的显示与否
                tagValue.popUp="hide";
            }
            //去除时间、带单位、既有前置条件又有分组的数据
            if(tagValue.type){
                delete tagValue.type;
            }
            //去除区间的数据
            if(tagValue.range){
                delete tagValue.range;
            }
        });
        return tag;
    }

    return {
        filterForFilter:filterForFilter,
        filterForExtract:filterForExtract
    }
}])