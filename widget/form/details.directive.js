
angular.module('infi-basic').directive('inputTextDetail',function(){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right form-group">'
							+'<div class="infi-input-opt input-group">'
								+'<p>{{input.value}} {{input.unit}}</p>'
							+'</div>'
						+'</div>'
					+'</div>',
        replace: true
	};
})

angular.module('infi-basic').directive('inputTextDoubleDetail',function(){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right form-group">'
							+'<div class="infi-input-opt input-group">'
								+'<span ng-repeat="opt in input.dimension.options">{{opt.value}}<span ng-if="$index === 0"> - </span></span>'
							+'</div>'
						+'</div>'
					+'</div>',
        replace: true
	};
})

angular.module('infi-basic').directive('inputNumberDetail',function(){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right form-group">'
							+'<div class="infi-input-opt input-group">'
								+'<p>{{input.value}} {{input.unit}}</p>'
							+'</div>'
						+'</div>'
					+'</div>',
        replace: true
	};
})

angular.module('infi-basic').directive('inputDateDetail',function(){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'
							+'<div class="infi-input-opt input-group">'
								+'<p>{{input.value}}</p>'
							+'</div>'	
						+'</div>'
					+'</div>',
        replace: true
	};
})

angular.module('infi-basic').directive('inputRadioDetail',['groupServices',function(groupServices){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'
							+'<div class="infi-input-opt input-group">'
								+'<p>{{input.value}}</p>'
							+'</div>'	
						+'</div>'
					+'</div>',
        replace: true
	};
}])

angular.module('infi-basic').directive('inputRadioExtendDetail',['groupServices',function(groupServices){
	return {
		restrict: 'E',
         template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'
							+'<div class="infi-input-opt input-group">'
								+'<p>{{input.value}}</p>'
							+'</div>'	
						+'</div>'
					+'</div>',
        replace: true,
        link:function(scope,element,attrs){
            groupServices.updateValue.update(scope.input);
        }
	};
}])

angular.module('infi-basic').directive('inputCheckboxDetail',['groupServices',function(groupServices){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'

						//fydebug 这里面数组的value存放的并不是一个数组，所以还是需要对这个进行处理，在获取到数据的时候
							+'<div class="infi-input-opt input-group">'
							+'<p><span ng-repeat = "(key,value) in input.value" style="padding-right: 15px;">{{key}}</span></p>'
							+'</div>'	
							
						+'</div>'
					+'</div>',
        replace: true,
        link:function(scope,element,attrs){
            groupServices.updateValue.update(scope.input);
        }
	};
}])

angular.module('infi-basic').directive('inputCheckboxExtendDetail',['groupServices',function(groupServices){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'

						//fydebug 这里面数组的value存放的并不是一个数组，所以还是需要对这个进行处理，在获取到数据的时候
							+'<div class="infi-input-opt input-group">'
							+'<p><span ng-repeat = "(key,value) in input.value" style="padding-right: 15px;">{{key}},</span></p>'
							+'</div>'	
						+'</div>'
					+'</div>',
        replace: true,
        link:function(scope,element,attrs){
            groupServices.updateValue.update(scope.input);
        }
	};
}])


angular.module('infi-basic').directive('inputTextareaDetail',function(){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'
							+'<div class="infi-input-opt input-group">'
								+'<p>{{input.value}}</p>'
							+'</div>'
						+'</div>'
					+'</div>',
		replace: true
	};
})

angular.module('infi-basic').directive('inputHalfTextareaDetail',function(){
	return {
		restrict: 'E',
		template: '<div class="infi-input-box">'
		+'<div class = "infi-input-left">'
		+'<p class="infi-font-red"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
		+'</div>'
		+'<div class = "infi-input-right">'
		+'<div class="infi-input-opt input-group">'
		+'<p>{{input.value}}</p>'
		+'</div>'
		+'</div>'
		+'</div>',
		replace: true
	};
})

angular.module('infi-basic').directive('affixDetail',['$http',function($http){
	return {
		restrict: 'E',
        template: '<div id="affix" class="affix-nav" role="complementary">'
						+'<ul id="affix-nav" class="nav " role="tablist">'
							+'<li class="infi-nav-outside {{model.showNav}}" ng-repeat = "model in navigates">'
								+'<a style="padding-right: 0px;" href="#{{model.name}}" ng-click = "showNav(model)">{{model.label}}</a>'
								+'<ul class="infi-nav-inside">'
									+'<li class="" ng-repeat = "theme in model.children" ng-click = "changeModel($index,theme.name)">'
										+'<a style="padding-right: 0px;" href="#{{theme.name}}">{{theme.label}}</a>'
									+'</li>'
								+'</ul>'
							+'</li>'
						+'</ul>'
					+'</div>',
		replace: true,
		link:function(scope,element,attrs){
			// zjl_debug 这边需要默认展开第一个
			scope.showNav = function(model){
				scope.navigates.forEach(function(n,i){
					n.showNav = '';
				})
				model.showNav = 'showChildLi';
			}
			
			scope.changeModel = function(index,module){
				scope.updateModuleForm(module,'details');
			}
		}
	};
}])

angular.module('infi-basic').directive('inputScaleDetail',['$http',function($http){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p ng-class="{\'true\':\'infi-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right form-group">'
							+'<div class="infi-input-opt input-group">'
								+'<p>{{input.tip}}</p>'
							+'</div>'
						+'</div>'
					+'</div>',
		replace: true,
		link:function(scope,element,attrs){
			
		}
	};
}])

//这个directive用于监听是否渲染完毕
angular.module('infi-basic').directive('repeatFinishDetail',['$timeout',function($timeout){
	return {
		restrict: 'ECMA',
		link:function(scope,element,attrs){
			 if(scope.$last == true && !scope.$first ){
		 	  	$timeout(function() {
                    scope.$emit( 'renderOver' );
                });
            }
		}
	}
}])


/*angular.module('infi-basic').directive('inputUpload',function(){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'
							+'<div class="infi-input-opt">'

								+'<label class="checkbox-inline">'
									+'<input id="{{input.name}}" type="file"  name="file" ngf-select="onFileSelect($files,input)">'
								+'</label>'
								+'<span ng-show = "input.tip!== undefined">'
									+'<a href="'+'/load/data/file/{{input.value}}" class="{{input.tipStyle}}" target="_blank">{{input.tip}}</a>'
								+'</span>'

							+'</div>'
						+'</div>'
					+'</div>',
        replace: true,
        link:function(scope,element,attrs){
        	
        }	
	};
})*/

//fydebug 上传图片类型配置文件上传时，后台报错，所以暂时先用这个代替
angular.module('infi-basic').directive('inputUploadDetail',['groupServices','SYS',function(groupServices,SYS){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box" >'
						+'<div class = "infi-input-left">'
							+'<p ng-class="{\'true\':\'infi-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'infi-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'
							+'<div class="infi-input-opt">'
								+'<p ng-repeat = "opt in input.value track by $index">'
									+'<a ng-href="{{url}}{{input.value[$index]}}?{{SYS.imgBack}}">{{input.tip[$index]}}上传成功！,点击下载</a>'
								+'</p>'
							+'</div>'
						+'</div>'
					+'</div>',
        replace: true,
        link:function(scope,element,attrs){
        	scope.SYS = SYS;
        	scope.input.remote?scope.url = SYS.url+'upload/download/':scope.url = SYS.url+'load/data/file/';
        	
        	groupServices.updateValue.update(scope.input);
        }	
	};
}])

/*angular.module('infi-basic').directive('inputUploadEx',function(){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p>{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'
							+'<div class="infi-input-opt">'
								+'<div>'
									+'<label class="checkbox-inline">'
										+'<input id="{{input.name}}" type="file"  name="file" ngf-select="onFileSelect($files,input,\'ex\')">'
									+'</label>'
								+'</div>'
								+'<div ng-if = "input.value !== null" ng-repeat = "opt in input.value">'
									+'<span ng-show = "input.tip[$index]!== undefined">'
										+'<a href="'+'/load/data/file/{{input.value[$index]}}" class="{{input.tipStyle[$index]}}" target="_blank">{{input.tip[$index]}}</a>'
										+'<a class="btn btn-default" href="javascript:;" role="button" ng-click="deleteFileSelect($index)">删除</a>'
									+'</span>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>',
        replace: true,
        link:function(scope,element,attrs){
        	scope.deleteFileSelect = function(num){
        		$('#'+scope.input.name).val('');
        		scope.input.value.splice(num,1);
        		scope.input.tipStyle.splice(num,1);
        		scope.input.tip.splice(num,1);
        	}
        }	
	};
})*/

//fydebug 上传图片类型配置文件上传时，后台报错，所以暂时先用这个代替
angular.module('infi-basic').directive('inputUploadExDetail',['groupServices','SYS',function(groupServices,SYS){
	return {
		restrict: 'E',
        template: '<div class="infi-input-box">'
						+'<div class = "infi-input-left">'
							+'<p ng-class="{\'true\':\'infi-font-red\'}[input.changed]">{{input.label}}：</p>'
						+'</div>'
						+'<div class = "infi-input-right">'
							+'<div class="infi-input-opt">'
								+'<div>'
									+'<label ng-if="input.tip.length>0" class="checkbox-inline">'

										//fydebug style后期重构移植，目前暂时写一下
										+'<button style=" line-height: 1.2;margin: 0 0 10px;" type="button" class="btn btn-primary" ng-click="showDownloadModel(input.callBackData)">批量下载图片</button>'
									+'</label>'
								+'</div>'
								+'<div ng-if = "input.value !== null">'

									//这里提前没有将value的字符串校验为数组之前会直接按照字符串去后台获取数据,所以这里直接用校验成数组后才会出现的字段进行控制
									//fydebug 暂时没有想到会造成什么负面影响，
									+'<span ng-if="input.tip.length>0" ng-repeat = "opt in input.value track by $index" class="img-box">'
										+'<img ng-src="{{url}}{{input.value[$index]}}?{{SYS.imgBack}}" ng-click = "showImgModal(input.value[$index],input.callBackData)" '
										+'class="img-thumbnail"/><a class="img-discribe">{{input.tip[$index]}}</a>'
									+'</span>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>',
        replace: true,
        link:function(scope,element,attrs){
        	
            //fydebug 要使用原来的代码需要进行这样的适配，
			if(scope.theme){
				scope.input= scope.theme;
			}
			if(scope.childTheme){
				scope.input= scope.childTheme;
			}
			if(scope.attribute){
				scope.input= scope.childTheme;
			}

			
			scope.input.remote?scope.url = SYS.url+'upload/view/':scope.url = SYS.url+'load/data/file/';

			//缺失的数据会在这里得到添加,这个是可以复用的
        	groupServices.updateValue.update(scope.input);
        	
        	scope.deleteFileSelect = function(num){
        		$('#'+scope.input.name).val('');
        		scope.input.value.splice(num,1);
        		scope.input.tipStyle.splice(num,1);
        		scope.input.tip.splice(num,1);
        		scope.input.callBackData.splice(num,1);
        	}    	
        }	
	};
}])

angular.module('infi-basic').directive('imgModalDetail',['FileService','SYS',function(FileService,SYS){
	return {
		restrict: 'E',
        template: '<div class="modal fade" id="imgModal" >'
						+'<div class="modal-dialog">'
						+'	<div class="modal-content">'
						+'		<div class="modal-header">'
						+'			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
						+'			<h4 class="modal-title">图片详情</h4>'
						+'		</div>'
						+'		<div class="modal-body">'
						+'			<div class="row">'
						+'				<div class="modal-img-box col-md-9">'
						+'					<div class="row">'
						+'						<div class="col-md-2">'
						+'							<span ng-click = "getImgData(prevImgId,callBackData)" class="btn-left glyphicon glyphicon-chevron-left {{prevBtn}}" aria-hidden="true"></span>'
						+'						</div>'
						+'						<div class="col-md-8">'
						+'							<img ng-mouseover="changeImgSize(\'event\')" ng-mouseleave="endWheelEvent()" class="tagImg img-imgDirection{{imgDirection}}" ng-src="{{url}}{{imgId}}?{{SYS.imgBack}}"/>'
						+'						</div>'
						+'						<div class="col-md-2">'
						+'							<span ng-click = "getImgData(nextImgId,callBackData)" class="btn-right glyphicon glyphicon-chevron-right {{nextBtn}}" aria-hidden="true"></span>'
						+'						</div>'
						+'						<div class="col-md-12 infi-img-tool">'
						+'							<div>'
						+'							    <a ng-click="changeImgSize(1)">+</a>'
						+'							    <a ng-click="changeImgSize(\'init\')">{{ImgSizeDirection.size}}%</a>'
						+'							    <a ng-click="changeImgSize(-1)">-</a>'
						+'							</div>'
						+'							<div>'
						+'							    <a ng-click="rotateImg(-1)">逆时针旋转</a>'
						+'							    <a ng-click="rotateImg(\'init\')">初始位置</a>'
						+'							    <a ng-click="rotateImg(1)">顺指针旋转</a>'
						+'							</div>'	
						+'							<div>'
						+'							    <a ng-if="!remote" href="{{SYS.url}}/load/data/file/export/all/img/'+'?filter_uploadIds={{imgId}}"><span class=" glyphicon glyphicon-floppy-save"></span>下载</a>'
						+'							</div>'							
						+'						</div>'
						+'					</div>'
						+'				</div>'
						+'				<div class="img-details col-md-3" style="position:relative;">'
						+'					<ul>'
						+'						<li>'
						+'							<span>序列号：</span><span>{{tagImgData.seriesNumber}}</span>'
						+'						</li>'
						+'						<li>'
						+'							<span>x光管电流：</span><span>{{tagImgData.xRayTubeCurrent}}</span>'
						+'						</li>'
						+'						<li>'
						+'							<span>千伏特峰值：</span><span>{{tagImgData.kvp}}</span>'
						+'						</li>'
						+'						<li>'
						+'							<span>窗口中心：</span><span>{{tagImgData.windowCenter}}</span>'
						+'						</li>'
						+'						<li>'
						+'							<span>窗口宽度：</span><span>{{tagImgData.windowWidth}}</span>'
						+'						</li>'
						+'					</ul>'
						+'				</div>'
						+'			</div>'
						+'			<ul class= "imgs-thumbnail">'
						+'				<div><span ng-click = "changeImgArea(\'prev\')" class="btn-left glyphicon glyphicon-chevron-left {{prevBtnState}}" aria-hidden="true"></span></div>'
						+'				<li ng-repeat="opt in imagesGroup" class="makeImgSame {{opt.show}}">'
						+'					<img ng-src="{{url}}{{opt.id}}?{{SYS.imgBack}}" ng-click = "getImgData(opt.id,callBackData)"/>'
						+'				</li>'
						+'				<div><span ng-click = "changeImgArea(\'next\')" class="btn-right glyphicon glyphicon-chevron-right {{nextBtnState}}" aria-hidden="true"></span></div>'
						+'			</ul>'
						+'		</div>'
						+'	</div>'
						+'</div><!-- /.modal-dialog -->'
					+'</div><!-- /.modal -->',
        replace: true,
        link:function(scope,element,attrs){

        	scope.remote?scope.url = SYS.url+'upload/view/':scope.url = SYS.url+'load/data/file/';
        	scope.imgDirection = 0;
        	scope.ImgSizeDirection = {
        		'size':100,
        		'width':0,
        		'height':0
        	};

        	scope.getImgData = function(imgId,callBackData){
        		scope.imgDirection = 0;
        		var _callBackData = JSON.parse(JSON.stringify(callBackData));
        		scope.imagesGroup = [];
        		var tagData = null;
        		_callBackData.forEach(function(n,i){
        			n.show = '';
        			if(n.id === imgId){
        				
        				//这个标记指明了谁是焦点图片
        				n.show = 'focus';
        				
        				//当callbackdata只有一个值的时候,是一个特殊的情况在这里进行处理
        				if(_callBackData.length === 1){
        					scope.prevImgId = _callBackData[i].id;
        					scope.nextImgId = _callBackData[i].id;
        					scope.prevBtn = 'hide';
        					scope.nextBtn = 'hide';
        				}else{
        					if(0<i && i<_callBackData.length-1){
            					scope.prevImgId = _callBackData[i-1].id;
            					scope.nextImgId = _callBackData[i+1].id;
            					scope.prevBtn = '';
            					scope.nextBtn = '';
            				}else if(i === 0){
            					scope.prevImgId = _callBackData[i].id;
            					scope.nextImgId = _callBackData[i+1].id;
            					scope.prevBtn = 'hide';
            					scope.nextBtn = '';	
            				}else{
            					scope.prevImgId = _callBackData[i-1].id;
            					scope.nextImgId = _callBackData[i].id;
            					scope.prevBtn = '';
            					scope.nextBtn = 'hide';
            				}
        				}
        				var imgDataOpt = FileService.judgeData(n,i,_callBackData.length,_callBackData);
        				tagData = imgDataOpt.tagData;
        				scope.prevBtnState = imgDataOpt.prevBtnState;
        				scope.nextBtnState = imgDataOpt.nextBtnState;
        				scope.tagImgData = n.dicomInfo;
        			}
        		});

        		// 缩略图的group
        		scope.imagesGroup = tagData;

        		// 目标图片的id
        		scope.imgId = imgId;

        		// 点击之后的目标图片集合
        		scope.callBackData = callBackData;
        	}

        	scope.changeImgArea = function(mark){

        		var firstDataIdx = null;
        		var lastDataIdx = null;
        		var tagData = null;

        		if(scope.callBackData.length<=11){
        			return false;
        		};
        		var _callBackData = JSON.parse(JSON.stringify(scope.callBackData));

        		_callBackData.forEach(function(n,i){

        			//找到第一个id的位置
        			if(n.id === scope.imagesGroup[0].id){
        				firstDataIdx = i;
        			}else if(n.id === scope.imagesGroup[scope.imagesGroup.length-1].id){
        				lastDataIdx = i;
        			}
        		});

        		var imgAreaOpt = FileService.judgeImgArea(mark,_callBackData,firstDataIdx,lastDataIdx);

        		scope.imagesGroup = imgAreaOpt.tagData;
        		scope.prevBtnState = imgAreaOpt.prevBtnState;
        		scope.nextBtnState = imgAreaOpt.nextBtnState;

        	}

        	scope.rotateImg = function(data){
        		if(data == 'init'){
        			scope.imgDirection = 0;
        		}else{
        			scope.imgDirection += data;
        			if(scope.imgDirection<0){
        				scope.imgDirection += 4;
        			}else if(scope.imgDirection>3){
        				scope.imgDirection -= 4;
        			}
        		}
        	}

        	scope.changeImgSize = function(data){
				if(data == 'init'){
					scope.ImgSizeDirection.size = 100;
					$('.modal-body .tagImg',element).removeAttr('style');
					$('.modal-body .tagImg',element).css({
						'max-width':'100%',
						'max-height':'100%'
					});
				}else if(data == 'event'){
					console.log($('#imgModal .modal-body .tagImg',element),element)
					//绑定滚轮滑动事件
					$('.modal-body .tagImg',element).bind('mousewheel DOMMouseScroll',function(e){
						console.log(e)
						var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
							(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
							
						scope.changeImgSize(delta);
						scope.$apply();
						return false;
					});

					//鼠标按下时在img父元素上绑定鼠标运动事件
					$('.modal-body .tagImg',element).bind('mousedown',function(e){
						this.setCapture && this.setCapture();
						var pointX = e.pageX;
						var pointY = e.pageY;
						$('.modal-body .col-md-8',element).bind('mousemove',function(ev){
							$('.modal-body .tagImg',element).css({
								'left':ev.pageX-pointX,
								'top':ev.pageY-pointY,
								'position':'relative'
							});
						});
					});

					//鼠标抬起解绑img父元素上鼠标运动事件
					$('.modal-body .tagImg',element).bind('mouseup',function(){
						$('.modal-body .col-md-8',element).unbind();
					})

				}else{
					scope.ImgSizeDirection.size += data*10;
					changeSize();
				}

				function changeSize(){
					if(scope.ImgSizeDirection.width == 0){
						scope.ImgSizeDirection.height = $('.modal-body .tagImg',element).height();
						scope.ImgSizeDirection.width = $('.modal-body .tagImg',element).width();
					}
					var width = scope.ImgSizeDirection.width*(scope.ImgSizeDirection.size/100);
					var height = scope.ImgSizeDirection.height*(scope.ImgSizeDirection.size/100);
					$('.modal-body .tagImg',element).css({
						'width':width,
						'height':height,
						'max-width':'none',
						'max-height':'none'
					});
				};
			}


        	scope.$watch('imgId',function(newValue, oldValue){
   				if(newValue !== oldValue){
   					getImgSize();
   				}
   			});

        	//离开img区域时解绑所有事件
        	scope.endWheelEvent = function(){
        		$('.modal-body .tagImg',element).unbind('mousewheel DOMMouseScroll mousedown mouseup');
        	};

        	function getImgSize(){

        		$('.modal-body .tagImg',element).removeAttr('style');
				$('.modal-body .tagImg',element).css({
					'max-width':'100%',
					'max-height':'100%'
				});

        		//改变图片的时候需要重置这个值
        		scope.ImgSizeDirection.height = $('.modal-body .tagImg',element).height();
				scope.ImgSizeDirection.width = $('.modal-body .tagImg',element).width();
				scope.ImgSizeDirection.size = 100;
        	}
        }	
	};
}])

//http://localhost:8080/platform/load/data/file/export/all/img/204?filter_uploadIds=366,367
angular.module('infi-basic').directive('downloadImgModelDetail',['groupServices','SYS',function(groupServices,SYS){
	return {
		restrict: 'E',
        template: '<div class="modal fade" id="downloadImg" >'
						+'<div class="modal-dialog">'
						+'	<div class="modal-content">'
						+'		<div class="modal-header">'
						+'			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
						+'			<h4 class="modal-title">图片下载</h4>'
						+'		</div>'
						+'		<div class="modal-body">'
						+'			<div class="row">'
						+'				<div class="modal-downloadImg-box col-md-4">'
						+'					<ul class="imgs-thumbnail">'
						+'				        <li ng-repeat="opt in downloadImgData" class="makeImgSame {{opt.focus}}">'
						+'					        <img ng-src="{{url}}{{opt.id}}?{{SYS.imgBack}}" ng-click = "getTagImg(opt)"/>'
						+'				        </li>'
						+'					</ul>'
						+'				</div>'
						+'				<div class="downloadImg-details col-md-8">'
						+'					<img ng-if="downloadGroup.length != 0" ng-src="{{url}}{{tagImgId}}?{{SYS.imgBack}}"/>'
						+'					<div ng-if="downloadGroup.length == 0" class="alert alert-danger">'
						+'						请选择图片下载 ！'
						+'					</div>'
						+'				</div>'
						+'			</div>'
						+'		</div>'
						+'		<div class="modal-footer">'
						+'          <a type="button" class="btn btn-success" ng-click="choseAllImg()">选择全部图片</a>'
						+'          <a type="button" class="btn btn-success" ng-href="{{downloadAllHref}}">下载全部图片</a>'
						+'		    <a ng-if="!allowDownload" disabled="disabled" type="button" class="btn btn-primary" href="javascript:;">下载选中图片</a>'
						+'		    <a ng-if="allowDownload" type="button" class="btn btn-primary" ng-href="{{tagHref}}">下载选中图片</a>'
						+'		</div>'
						+'	</div>'
						+'</div><!-- /.modal-dialog -->'
					+'</div><!-- /.modal -->',
        replace: true,
        link:function(scope,element,attrs){
        	scope.SYS = SYS;
        	
        	if(scope.remote){
        		scope.url = SYS.url+'/upload/view/';
        		scope.Href = SYS.url+'/upload/download/zip';
        	}else {
        		scope.url = SYS.url+'/load/data/file/';
        		scope.Href = SYS.url+'/load/data/file/export/all/img/'
        	}

        	//存储一个需要下载图片的列表
        	scope.downloadGroup = [];
        	scope.downloadAllHref = '';
        	scope.allowDownload = false;
        	scope.downloadImgData = null;

        	//通过完全放开互通的controller在controller中获取数据，fydebug重构时会缩小controller的范围
        	scope.getDownloadImgData = function(callBackData){
        		scope.downloadImgData = angular.copy(callBackData);
        		scope.downloadImgData.forEach(function(n,i){
        			n.focus = '';
        		});
        		getAllImgId();
        	}
        	//该方法判断
        	scope.addDownloadGroup = function(id){
        		var mark = false;
        		scope.downloadGroup.forEach(function(n,i){
        			if(n==id){
        				scope.downloadGroup.splice(i,1);
        				mark = true;
        			}
        		});
        		!mark?scope.downloadGroup.push(id):mark;
        		scope.genDownloadImg();
        	};

        	// 下载图片url拼接
        	scope.genDownloadImg = function(){
        		var data = '';
        		scope.downloadGroup.forEach(function(n,i){
        			i===0?data += n:data += ','+n;
        		});
        		data == ''?scope.allowDownload = false:scope.allowDownload = true;
        		scope.tagHref = scope.Href+'?filter_uploadIds='+data+'&'+scope.SYS.imgBack;
        		
        	};

        	scope.getTagImg = function(opt){
        		scope.tagImgId = opt.id;
        		scope.addDownloadGroup(opt.id);
        		opt.focus == 'focus'?opt.focus = '':opt.focus = 'focus';
        	};

        	scope.choseAllImg = function(){
        		scope.downloadGroup = [];
        		scope.downloadImgData.forEach(function(n,i){
        			n.focus = "focus";
        			scope.downloadGroup.push(n.id);
        		});
        		scope.genDownloadImg();
        	};

        	function getAllImgId(){
        		var data = '';
        		scope.downloadImgData.forEach(function(n,i){
        			 i===0?data += n.id:data += ','+n.id;
        		});
        		scope.downloadAllHref = scope.Href+'?filter_uploadIds='+data+'&'+scope.SYS.imgBack;
        	}
        }
	};
}])

angular.module('infi-basic').directive('repeatFinish',function($timeout){
	return {
		restrict: 'ECMA',
		link:function(scope,element,attrs){
			 if(scope.$last === true && !scope.$first && scope.$index == scope.$parent.moduleNameArr.length-1){
		 	  	$timeout(function() {
                    scope.$emit( 'renderOver' );
                });
            }
		}
	}
})

angular.module('infi-basic').directive('inputDetailThirdStep',function(){
	return{
		restrict:'ECMA',
		templateUrl: '../../../../src/widget/form/basic-template/input.detail.third.step.html',
		link:function(scope,element,attrs){

			//fydebug 这里估计是因为directive嵌套的缘故，模板加载出现了时差，虽然是在最后一个模板加载完成的时候调用的该方法
			//但是实际上第二层模板之后的input没有被选中，这个问题也是打印功能无法完成的原因延期执行，
			scope.$on('renderOver', function () {
				//console.log($(element).find('input'))
		         $('input,textarea',element).attr('disabled','disabled');
			});
		}
	}
})
