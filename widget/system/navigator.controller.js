app.controller('NavigatorController',['$scope','MedicalModel','DimensionModel',function($scope,MedicalModel,DimensionModel){
	/***********************************************
	 * 1 页面首先要对页面是否有record.pathParams.patientId,visitId进行判断当存在时才能进行工作列表的显示;
	 * 2 当页面存在patientId visitId recordId要进行数据的加载;加载六个维表数据;
	 * 3 在页面上进行迭代显示维表数据;
	 * 4 要将获取的数据进行维表的转义
	 * 5 当点击六个疾病信息数据时要显示对应的小
	 * 6 跟郭经理确定点击医疗信息时的业务;
	 * 7 工作列表
	 * @type {*[]}
	 */
	$scope.medicalInfo=[
		{
			name:$scope.EMR.DISEASE,
			label:'疾病信息',
			children:[],
			dimension:[]
		},
		{
			name:$scope.EMR.SYMPTOM,
			label:'症状信息',
			children:[],
			dimension:[]
		},
		{
			name:$scope.EMR.DRUG,
			label:'用药信息',
			children:[],
			dimension:[]
		},
		{
			name:$scope.EMR.TEST,
			label:'检验信息',
			children:[],
			dimension:[]
		},
		{
			name:$scope.EMR.EXAM,
			label:'检查信息',
			children:[],
			dimension:''
		},
		{
			name:$scope.EMR.SUPPLEMENT,
			label:'其他信息',
			children:[],
			dimension:[]
		}
	];
	/**
	 * 如果当前路由的$routeParams和之前路由的$routeParams发生改变那么就满足满足刷新机制;
	 * 当点击单个医疗信息数据时,刷新单个医疗信息数据,之前是刷新全部医疗信息数据
	 *  current获取当前路由;
	 *  previous获取之前页面路由;
	 */
	$scope.$on("$routeChangeStart",function(event,current,previous){
		if(current.pathParams.patientId&&current.pathParams.visitId){
			$scope.parameter=current.pathParams;
			if(previous){
				if(current.pathParams.patientId!==previous.pathParams.patientId
					&&current.pathParams.visitId!==previous.pathParams.visitId){
					getMedicalInfo(current);
				}else{
					getSingleMedicalInfo(current);
				}
			}else{
				getMedicalInfo(current);
			}
		}else{
			$('body').attr('class','standard');
		}
	});
	/**
	 * 获取六条基本医疗信息数据以及六个医疗医疗信息的维表数据,导航栏场景切换
	 * @param current
     */
	function getMedicalInfo(current){
		iterationMedicalInfo($scope.medicalInfo,current,function(wraps){
			getMedicalList(wraps,current);
		});
			$('body').attr('class','workspace-min');
		}

	/**
	 * 获取单条医疗信息数据
	 * @param current
     */
	function getSingleMedicalInfo(current){
		iterationMedicalInfo($scope.medicalInfo,current,function(wraps){
			if(wraps.name==current.pathParams.type){
				getMedicalList(wraps,current)
			}
		})
	}

	/**
	 * 获取医疗信息数据,以及维表信息
	 * 获取单个医疗信息的时候仍然需要获取维表数据,因为需要考虑到自定义保存的情况;
	 * @param wraps
	 * @param current
     */
	function getMedicalList(wraps,current){
		MedicalModel.getList(wraps.name,current.pathParams).then(function success(msg){
			if(msg.data.status == $scope.SYS.STATUS_SUCCESS ){
				wraps.children=msg.data.page.content;
			}else{
				//请求不成功将数组清空
				wraps.children=[];
			}
		});
		DimensionModel.getOne(wraps.name,current.pathParams).then(function success(msg){
			wraps.dimension = msg.data;
		});
	}

	/**
	 * 迭代医疗信息数据,工作列表展开状态切换
	 * @param medicalInfo
	 * @param callback
     */
	function iterationMedicalInfo(medicalInfo,current,callback){
		_.each(medicalInfo,function(wraps){
			wraps.name==current.pathParams.type?wraps.active=true:wraps.active=false;
			callback(wraps)
		})
	}

	function pageConfig(){
		var config  = {
			bodyHeight : $(document).height() > $(window).height() ? $(document).height() : $(window).height(),
		};
		$('.self-left-nav').css('min-height', config.bodyHeight - $('.self-header').height() + 'px');
		//ljy_debug这个地方第二个菜单栏的高度是由第一个菜单栏的高度进行控制的所以删除init.js的时候会第二个菜单造成影响;
		$('.self-left-nav-second').css('height', $('.self-left-nav').height() + 'px');
		$('.self-content').css('min-height', config.bodyHeight - 72 + 'px');
		$('.self-content').css('margin-left', $('.self-left-nav').width() + $('.self-left-nav-second').width() + 'px');

	}
	pageConfig();
	/**
	 * 工作列表单个项目的展开收起
	 * @param option
     */
	$scope.shrink=function(option){
		if(option.active){
			option.active=false;
		}else{
			option.active=true;
		}
	};
	/**
	 * ljy_debug页面上入院记录是写死的,当点击时其他的疾病信息列表应该处于收缩状态,当然这个后期需要更改,现在只是
	 * 让工作列表的效果好些,以后需要进行改正优化
	 * @param medicalInfo
     */
	$scope.shrinkAll = function(medicalInfo){
		_.each(medicalInfo,function(option){
			option.in=false;
		})
	};

	/**
	 * 左菜单点击事件
	 */
	$scope.toogleNavi = function () {
		var clazz = $('body').attr('class');
		if( clazz.indexOf('-min')>=0 ){
			clazz = clazz.replace('-min','');
		} else {
			clazz = clazz.replace('workspace','workspace-min');
			clazz = clazz.replace('standard','standard-min');
		}
		$('body').attr('class',clazz);
	};

	$scope.openNavi = function () {
		var clazz = $('body').attr('class');
		if( clazz.indexOf('-min')>=0 ){
			clazz = clazz.replace('-min','');
		}
		$('body').attr('class',clazz);
	};

	/**
	 * 右侧菜单点击事件
	 */
	$scope.toogleSubNavi = function(){
		var clazz = $('body').attr('class');
		//var before = clazz;
		if( clazz.indexOf('workspace')>=0 ){
			if( clazz.indexOf('-hide')>=0 ){
				clazz = clazz.replace('-hide','');
			} else if( clazz.indexOf('workspace-min')>=0 ){
				clazz = clazz.replace('workspace-min','workspace-min-hide');
			} else {
				clazz = clazz.replace('workspace','workspace-hide');
			}
			toogleSubNavi();
		}
		$('body').attr('class',clazz);
	};

	/**
	 * 右侧菜单栏控制按钮箭头方向
	 */
	function toogleSubNavi(){
		var target = $('.glyphicon', '.self-left-second-systole'),
			clazz = target.attr('class');
		if( clazz.indexOf('glyphicon-menu-left') >= 0 ){
			target.removeClass('glyphicon-menu-left').addClass('glyphicon-menu-right');
		}else {
			target.removeClass('glyphicon-menu-right').addClass('glyphicon-menu-left');
		}
	}
}]);
