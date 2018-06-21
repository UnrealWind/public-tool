angular.module('infi-basic').filter('empty',function(){
  return function(value){
    if( value==undefined || value=="" || value===null ){
      return "";
    }
    return value;
  }
});

angular.module('infi-basic').filter('unescape',function(){
  return function(value){
    if( value!=undefined && value.indexOf('name_')>=0 ){
      return unescapeLabel(value);
    }else if( value==undefined || value=="" || value===null ){
      return "";
    }
    return value;
  };

  function unescapeLabel(value){
    var label = value,
      labels = String.prototype.split.call(label,','),
      idx,
      length = labels.length,
      temp,
      result = [];

    for( idx=0;idx<length;idx++){
      temp = labels[idx];
      temp = temp.replace(/name_/g,'');
      temp = temp.replace(/_b_/g,'+');
      temp = temp.replace(/_a_/g,'-');
      temp = temp.replace(/__/g,'%');
      temp = unescape(temp);
      result.push(temp);
    }

    return result.join();
  }

});

angular.module('infi-basic').filter('bmi',[function(){
  return function(value){
    if(value){
      var newValue = value;
      if(value<18.5){
        newValue = "过轻";
      }else if(value>=18.5 && value<25){
        newValue = "正常";
      }else if(value>=25 && value<28){
        newValue = "过重";
      }else if(value>=28 && value<32){
        newValue = "肥胖";
      }else if(value>=32){
        newValue = "非常肥胖";
      }
      return value.toFixed(2) + "[" + newValue + "]";
    }
  }
}]);

angular.module('infi-basic').filter('replacePrefix',function(){
  return function(value){
    if( value!=undefined ){
      value = String.prototype.replace.call(value,'门诊_','');
      value = String.prototype.replace.call(value,'住院_','');
    }
    return value;
  }
});

/**
 * 要求日期为空时不显示null;
 */
angular.module('infi-basic').filter('formatDates',function(){
  return function(value){
    if( value == 'null' ){
      value='';
    }
    return value;
  }
});

//
angular.module('infi-basic').filter('getUrlParameter',['Session',function(Session){
    return function(value){
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = value.match(reg);
            if (r != null) return unescape(r[2]); return null;
        } 
        var status = getQueryString("eu");
        if(status === null){
            var user = Session.getUser();
            var params = 'eu='+user.eu+'&ep='+user.ep;
            if( value.indexOf('?')>=0 ){
                value += '&' + params;
            } else {
                value += '?' + params;
            }
        }

        return value;
    }
}]);
