
angular.module('infi-basic').service('formServices',['$http','SYS','Session',function($http,SYS,Session){
	
    this.ajaxModuleData = function(moduleName,detailsMark,routeParams){
    	var that = this;
    	var url = SYS.url+'/load/data/content/'+routeParams.projectName+'/'+routeParams.recordId+'/'+moduleName
    	var result = null;
    	var tagData = null;

    	var user = Session.getUser();
        var params = 'eu='+user.eu+'&ep='+user.ep;

    	$.ajax({
			data:'',
			url: url+'?'+params,
			type:'get',
			async:false,
			success:function(msg){
				if(msg.data instanceof Array ){
					var data = JSON.parse(JSON.stringify(msg.data));
					msg.data = {};
					msg.data.stableVersion = [];
					msg.data.version = data; 
					msg.status = 'ok';
				}
				if( msg.status === 'ok'){

					if(msg.data.stableVersion == undefined || msg.data.stableVersion == null){
						msg.data.stableVersion = [];
					}else{
						//updateValue.update(msg.data.stableVersion);
					}

					//updateValue.update(msg.data.version);

					//如果是details的情况下，就进行验证module中是否有value是非空的
					if(detailsMark){
						msg.data.stableVersion = that.checkModule(msg.data.stableVersion);
						msg.data.version = that.checkModule(msg.data.version);
						result = msg.data;
					}else{
						result = msg.data;
					}
				} else {
					
				}

				tagData = msg;
			}
		});

		return tagData.data;

    };

    this.saveModule = function(mark,$scope){
    	//这个字段用于标记必填项是否填写  false 无必填项没填，true  有必填项么填 
		var hasNecessary = false;
		var necessaryTip = null;
		
    	var dataToSave = filter($scope.currentData);
		var name = $scope.currModuleName;
		function filter(array){
			var newData = [];
			for(var index in array){
				var entity = array[index];
				if( entity ){
					var transformedEntity = {};
					if( entity.value && entity.value!=''){
						if( entity.type.indexOf('多选')>=0 ||entity.type.indexOf('超链接')>=0){
							var values = [];
							for( var idy in entity.value ){
								if( entity.value[idy] ){
									values.push( idy );
								}
							}
							transformedEntity.value = values.join(',');
						} else if(entity.value instanceof Array) {
							transformedEntity.value = entity.value.join(',');
						}else if(entity.type.indexOf('量表')>= 0 ){
							transformedEntity.value = entity.value+'##'+entity.score;
						}else {
							transformedEntity.value = entity.value;
						}
					}else if( entity.value == null && entity.notNull){
						/*if(!hasNecessary){
							necessaryTip = '请填写'+entity.label+'！！！';
						}*/
						hasNecessary = true;
						//Event.modalNecessary();
					}
					
					transformedEntity.type = entity.type;
					transformedEntity.name = entity.name;
					
					//fydebug 李博同学需要增加这个label
					transformedEntity.label = entity.label;
					transformedEntity.bizName = entity.bizName;
					
					//必选字段要作为一个标记传回去
					transformedEntity.notEmpty = entity.notNull;
					
					newData.push(transformedEntity);
					
					if( entity.children && entity.children.length> 0 ){ //array[index].value==undefined && 
						transformedEntity.children = filter(entity.children);
					}
				}
			};
			return newData;
		}

		$http({
			url: SYS.url+'/load/data/'+$scope.routeParams.projectName+'/'+$scope.routeParams.recordId+'/'+name,
			method: 'post',
			data: JSON.stringify(dataToSave)
		}).success(function(msg){
			if(mark === 'back'){
				window.history.go(-1);
			};
		});
		
		/*fydebug 这里放开了页面提示
		 * if(!hasNecessary){
			$.ajax({
				data: JSON.stringify(dataToSave),
				url: _CTX+'/load/data/'+projectName+'/'+recordId+'/'+name ,
				type: 'post',
				contentType: "application/json",
				async: false
			});
			
			if(mark === 'back'){
				window.location.href= _CTX+"/load/records/"+projectName+"/list";
			}
		}*/
		
		return {
			'necessaryTip':necessaryTip,
			'hasNecessary':hasNecessary
		};
    };

    this.refreshNavigates = function(data,currModuleName){
    	data.forEach(function(n,i){
			n.children.forEach(function(ny,iy){
				if(ny.name === currModuleName){
					ny.hasNecessary = false;
				}
			});
		});
    	return data;
    };

    this.checkModule = function(arry){
    	
		if(arry.length == 0){
			return;
		};
		var data = arry;
		// 这里初始化一下
		data[0].notEmpty = false;
		check(data);
		// zjl_debug 临时实现,需要优化
		checkValue(data[0]);
		checkValue2(data[0]);
		function check(arry){
			arry.forEach(function(element,iz){
				if(element.value !== undefined && element.value !== null && element.value !=='' && element.type !=="虚拟菜单"){

					//fydebug 这里module是单独放在数组里加载进来的，所以是data[0]
					data[0].notEmpty = true;
				}
			});
		}
		
		function checkValue(node){
			if( node.children && node.children instanceof Array ){
				for( var idx=0;idx<node.children.length;idx++){
					if( node.children[idx] && node.children[idx].value && node.children[idx].value!='' && node.children[idx].type !=="虚拟菜单"){
						node.notEmpty = true;
					}
					checkValue(node.children[idx]);
				}
			}
		}
		
		function checkValue2(node){
			if( node.children && node.children instanceof Array ){
				for( var idx=0;idx<node.children.length;idx++){
					if( node.children[idx] && node.children[idx].notEmpty){
						node.notEmpty = true;
					}
					checkValue2(node.children[idx]);
				}
			}
		}
		return data;
	}
	this.print = function(naviData,$scope){
    	var that = this;
    	
    	var currentData = [];
    	var auditPassData = [];

    	//直接调用原有的api获取到数据
    	naviData.forEach(function(n,i){

    		n.children.forEach(function(module,iy){
    			var moduleName = module.name;
    			var data = that.ajaxModuleData(moduleName,'details',$scope.routeParams);
    			if(data.version){
    				if(data.stableVersion && data.stableVersion!=null && data.stableVersion.length>0){
    					auditPassData.push(data.stableVersion[0]);
    				}
    				currentData.push(data.version[0]);
    			}else{
    				currentData.push(data[0])
    			}
    			
    		})
    	});

    	return {
    		'currentData':currentData,
    		'auditPassData':auditPassData
    	};
    }
    this.bindPrint = function(){
    	jqprintDiv();
    	var HKEY_Root, HKEY_Path, HKEY_Key;
	        HKEY_Root = "HKEY_CURRENT_USER";
	        HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        function jqprintDiv() {
			$("#printArea").print();
        }

        function PageSetup_Null() {
            try {
                var Wsh = new ActiveXObject("WScript.Shell");
                HKEY_Key = "header";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
                HKEY_Key = "footer";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, ""); 
            }
            catch (e) { }
        }
    };

}]); 