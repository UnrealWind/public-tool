angular.module('infi-basic').service('DataAdapter',['SYS','AdapterConvert',function(SYS,AdapterConvert){
  //取数-条件选取页面转化后台数据,前台数据整理的入口
  /**
   * 与其他js文件交互的方法:
   * convertCategory:处理后台传递的类别’自然信息‘到’性别‘层级的数据，用于页面显示
   * convertPopUp：处理后台传递的用于弹窗显示的数据
   * convertSubmitData:条件选取页面传递到后台的数据
   * convertSubmitFixData：导出页面传递到后台的数据
   * converLogicContext:逻辑配置页面将左侧数据的前置条件加到label后面
   * 
   * 基本方法：
   * convert包含的方法:
   *         category[处理类别‘自然信息’数据]；folder[处理title‘家族史’数据]；
   *         tag[处理子层级‘性别’数据]；tagValue[处理具体详情‘男、女’数据]
   * category包含的方法:from[将后台传递数据转换成页面所需要的数据];to[将页面选中的数据转换成提交到后台的数据];
   *         fromPop[处理原始数据弹窗子层级‘性别’的数据];fixTo[导出页面子层级‘性别’数据的提取];fixFrom[逻辑配置页面处理前置条件数据]
   * tagAdapters包含的方法:
   *         options[处理原始数据中类型为文本的数据];tabs[处理原始数据中有标签的数据];
   *         context[处理原始数据中的前置条件];range[处理原始数据中类型为数值的数据];
   *         unit[处理原始数据中带单位的数据];date[处理原始数据中类型为时间的数据];
   *         group[处理原始数据中既有组又有前置条件的数据];relation[处理原始数据中关联属性数据]
   * tagSubmitAdapters包含的方法:
   *         options[提取数据中类型为文本的数据];tabs[提取数据中有标签的数据];
   *         context[提取数据中的前置条件];range[提取数据中类型为数值的数据];
   *         unit[提取数据中带单位的数据];date[提取数据中类型为时间的数据];
   *         relation[提取数据中关联属性数据]
   */
  
  /**
   * category 处理‘自然信息’层级
   * folder  处理‘生活史’层级
   * tag 处理‘性别’层级
   * tagValue 处理弹框层级
   */
  var convert = this.convertFn = {};

  /**
   *转化‘自然信息’[category]层级数据
   */
  this.convertFn.category = {
    /**
     * 转化从后台收到的数据
     */
    from: function(original){
      var category = {
        id:original.id,
        label:original.label,
        options:[]
      };

      if(original.childs){
        convert.folder.from(original.childs,category);
      }else{
        console.log('无数据');
      }
      return category;
    }
  };

  /**
   * 转化‘家族史-title’[folder]层级数据
   * @type {{from: convert.folder.from, to: convert.folder.to}}
     */
  convert.folder = {
    from: function(originalList,category){
      //对于有folder层级和没有folder层级的做特殊处理
      var emptyFolder = {
        label:"",
        id:"",
        children:[]
      }, idx;
      for( idx=0;idx<originalList.length;idx++) {
        var original = originalList[idx],
            fn = convert.tag.from;
        if( !isFolder(original) ){
          emptyFolder.children.push(fn(original));
        }else{
          var folder = {
                label:original.label,
                id:original.id,
                children:[]
              };
          fn(original,folder.children);
          category.options.push(folder);
        }
      }
      if(emptyFolder.children.length > 0){
        category.options.splice(0,0,emptyFolder);
      }

      /**
       * 判断folder层是否为空
       * @param entity
       * @returns {boolean}
         */
      function isFolder(entity){
        return entity.type=="category";
      }
    }
  }

  /**
   * 转化‘性别’[tag]层级数据
   * @type {{from: convert.tag.from, to: convert.tag.to, newEntity: convert.tag.newEntity}}
   * from 后台数据左侧‘姓名’级别转化成页面需要的格式
   * fromPop 后台传递的用于弹框数据的处理
   * fixLogicFrom  逻辑配置页面logicJson与screenJson对比进行更替
   * to 筛选页面‘姓名’层级向后台传递的数据
   * fixTo  导出页面‘姓名’层级向后台传递的数据
     */
  convert.tag = {
    from: function(original,folder){
      var fn = convert.tag.newTag;
      if(original.type=="category"){
        angular.forEach(original.childs,function(child){
          folder.push(fn(child));
        })
      }
      else{
        return fn(original);
      }
    },
    newTag:function(original){
      return {
        label:original.label,
        id:original.tagId
      };
    },
    fromPop: function(original){
      var detail = {
        id:original.id,
        label:original.label,
        searchId:original.moreResourceId?original.moreResourceId:""
      }
      convert.tagValue.from(original,detail);
      return detail;
    },
    fixLogicFrom:function (screenJson,logicJson,parent,logicIdx) {
      //涉及到数组中项的去除，所以循环从后向前去除的项不对数组有影响
      var idx = logicJson.length-1,idy;
      for(idx;idx>=0;idx--){
        var logic = logicJson[idx];
        if(!logic.logic){
          if(logic.length){
            //循环的项是数组，则进行递归调用，继续循环匹配，logicJson，idx传入方法数组中数据的去除
            convert.tag.fixLogicFrom(screenJson,logic,logicJson,idx)
          }else{
            convert.tagValue.fixLogicFrom(screenJson,logic);
            //数据项中数据在原始数据中不存在，则将组中此数据删除,此时数据项values为对象
            if(!logic.values){
              logicJson.splice(idx,1);
            }
            //如果此组只剩下与或按钮，则将此组在父级中去掉
            if(logicJson.length == 1&&parent){
              parent.splice(logicIdx,1);
            }
          }
        }
        //将空数组去除
        if(logic.length == 0){
          logicJson.splice(idx,1);
        }
      }
      //将最外层的与或按钮去除
      if(logicJson.length == 1){
        logicJson.splice(0,1);
      }
    },
    fixScreenToLogicFrom:function (screenJson,logicJson) {
      var logic = {logic:"and"},
          logicContainer = [];
      logicJson.push(logic);
      logicContainer.push(logic);
      angular.forEach(screenJson,function (original) {
        for(var i=0;i<original.values.length;i++){
          (function (entity) {
            if (entity.label != '其他') {
              entity.number = 1;
              var data = $.extend(true,[],original);
              data.isEqual = "yes";
              data.values = $.extend(true,[],entity);
              if(data.values.contextRange){
                data.values.group = data.values.contextRange;
              }
              logicContainer.push(data);
            }
          })(original.values[i]);
        }
      });

      logicJson.push(logicContainer);
    },
    /**
     * 转化提交给后台的数据
     */
    to:function (original,submitData) {  //条件选取页面向逻辑配置页面提交的数据
      if(original.$checked){
        var checkedData = {
          tagName:original.label,
          tagId:original.id,
          values:[]
        };
        convert.tagValue.to(original,checkedData);
        submitData.push(checkedData);
      }
    },
    fixTo:function (original,submitData) {   //导出页面保存的数据
      if(original.$checked){
        submitData.num++;
        var checkedData = {
          label:original.label,
          id:original.id
        };
        if(original.options || original.tabs){
          checkedData.options=[];
        }
        convert.tagValue.to(original,checkedData);
        submitData.data.push(checkedData);
      }
    }
  }

  /**
   * 转化‘男、女’[tagValue]层级数据
   * @type {{from: convert.tagValue.from, to: convert.tagValue.to}}
   * from 后台传递的数据转化用于页面显示
   * to 页面的数据转化向后台传递
   * fixFrom  逻辑配置页面，screenJson转化成页面显示的格式
   * fixLogicFrom  逻辑配置页面，logicJson与screenJson对比替换
     */
  convert.tagValue = {
    from:function (original,tag) {
      //注意：前置条件的调用必须在options和tabs和range后面
      var adapter = ["options","tabs","range","unit","group","date","context","relation"],
          idx;
      for( idx=0; idx<adapter.length;idx++){
        var fn = adapter[idx];
        AdapterConvert.tagAdapters[fn](original,tag);
      }
    },
    to:function (original,tag) {
      var adapter = ["options","range","unit","group","date","tabs","context","relation"],
          idx;
      for( idx=0; idx<adapter.length;idx++){
        var fn = adapter[idx];
        AdapterConvert.tagSubmitAdapters[fn](original,tag);
      }
    },
    fixFrom:function (entity,summary) {
      var tagOriginal = {  //用于盛放没有最小值、最大值的前置条件情况和没有填写最大值、最小值的前置条件条件情况
        tagName:entity.tagName,
        tagId:entity.tagId,
        uniqueId:entity.tagId,  //区分检验项目中输入最小值、最大值和没有输入最小值、最大值不同情况
        tagLabel:entity.tagName,
        values:[]
      };

      angular.forEach(entity.values,function (option,index) {
        //既有组又有前置条件的显示 超声心动图参数-二尖瓣A峰 =！ （填写的值）
        if(option.contextRange&&option.contextRange.length>0){
          var tagData = {  //用于盛放填写了最大值、最小值的前置条件的情况
            tagName:entity.tagName,
            tagId:entity.tagId,
            uniqueId:entity.tagId+"range"+index,
            tagLabel:entity.tagName + "-" + option.value,
            values:[]
          };
          AdapterConvert.tagAdapters.contextLogic(option,tagOriginal,tagData);
          if(tagData.values.length > 0){
            summary.push(tagData);
          }
        }else{
          //检验参数里面，没有设置contextRange的不做处理，检验信息做处理，普通的正常处理
          if(entity.tagName != "超声心动图参数"&&entity.tagName != "椎动脉超声参数"&&entity.tagName != "颈动脉超声参数"){
            AdapterConvert.tagAdapters.contextLogic(option,tagOriginal);
          }
        }
      });

      if(tagOriginal.values.length > 0){
        summary.push(tagOriginal);
      }
    },
    fixLogicFrom:function (screenJson,logic) {
      var indey,indez,isHave = false;
      for(indey = 0;indey < screenJson.length;indey++){
        var screen = screenJson[indey];
        for(indez = 0;indez<screen.values.length;indez++){
          var screenData = screen.values[indez],
              logicData = logic.values;
          if(logicData.uniqueId == screenData.uniqueId){
            screenData.number = screenData.number?++screenData.number:1;  //记录左侧待拖动项在右侧出现的次数
            logic.values = angular.copy(screenData);
            isHave = true;
          }
        }
      }
      if(!isHave){
        delete logic.values;
      }
    }
  }

  /**
   * 后台传递的左侧数据的处理
   * @param list 左侧数据
     */
  this.convertCategory= function(list){
      var summary = [], idx;
      for( idx = 0; idx < list.length;idx++ ){
        var entity = list[idx],
            fn = convert["category"].from;
        summary.push(fn(entity));
      }
      return summary;
  }

  /**
   * 后台传递的用于弹框数据的处理
   * @param list
     */
  this.convertPopUp= function(list){
    var summary = [],idx;
    for( idx = 0; idx < list.length;idx++ ){
      var entity = list[idx],
          fn = convert["tag"].fromPop;
          summary.push(fn(entity));
    }

    return summary;
  }

  /**
   * 条件选取页面提交的数据
   * @param list
   * @returns {Array}
     */
  this.convertSubmitData = function (list) {
    AdapterConvert.setCommitMappingNull();  //MPPING置空
    var submitData = [];
    angular.forEach(list,function (entity) {
      angular.forEach(entity.options,function (options) {
        angular.forEach(options.children, function (option) {
          var fn = convert["tag"].to;
          fn(option,submitData);
        })
      })
    })

    return submitData;
  }

  /**
   * 数据导出页面提交的数据
   * @param list
     */
  this.convertSubmitFixData = function (list) {
    AdapterConvert.setCommitMappingNull();
    var submitData = {
      data:[],
      num:0
    };
    angular.forEach(list,function (entity) {
      angular.forEach(entity.options,function (options) {
        angular.forEach(options.children, function (option) {
            var fn = convert["tag"].fixTo;
            fn(option,submitData);
        });
      })
    });

    return submitData;
  }

  /**
   * 逻辑配置页面将左侧数据的前置条件加到label后面
   * @param list
   * @returns {*}
     */
  this.converLogicContext = function (list) {
    var summary = [];
    angular.forEach(list,function (entity) {
      var fn = convert["tagValue"].fixFrom;
      fn(entity,summary);
    });
 
    return summary;
  }

  /**
   * 逻辑配置页面右侧loginJson与screenJson的变化相应变化
   * @param screenJson
   * @param logicJson
   * @returns {*}
     */
  this.convertLogicJson = function (screenJson,logicJson) {
    if(screenJson.length == 0){
      logicJson = [];
    }else{
      var fn = convert["tag"].fixLogicFrom;
      fn(screenJson,logicJson);
    }

    return logicJson;
  }

  /**
   * 逻辑配置页面logicJson不存在则将左侧所有的东西显示
   * @param screenJson
   * @returns {*}
   */
  this.trasformScreenToLogic = function (screenJson) {
    var logicJson = [];
    if(screenJson.length != 0){
      var fn = convert["tag"].fixScreenToLogicFrom;
      fn(screenJson,logicJson);
    }
    return logicJson;
  }
}]);
