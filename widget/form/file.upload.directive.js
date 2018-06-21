angular.module("infi-basic").directive('inputImgFileTemplate',['groupServices','SYS',function(groupServices,SYS){
	return {
		restrict: 'ECMA',
		template: '<div class="infi-input-box">'
					+'<div class = "infi-input-left">'
						+'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}</p>'
					+'</div>'
					+'<div class = "infi-input-right">'
						+'<div class="infi-input-opt">'
							+'<div>'
								+'<label class="">'
									//fydebug 增加multiple 属性之后，可以一次上传n张图片了，但是操作流程未改变，
									+'{{dicomDiscribe}}<input multiple="true" id="{{input.name}}" type="file"  name="file" ngf-select="onFileSelect($files,input,\'img\')">'
								+'</label>'
							+'</div>'
							+'<div ng-if = "input.value !== null ">'
								+'<span ng-if="input.tip.length>0" ng-repeat = "opt in input.value track by $index" class="img-box">'
									+'<span ng-click = "deleteFileSelect($index)" class="deleteImg" title="删除该图片">x</span>'
									+'<img ng-src="{{url}}{{input.value[$index]}}{{urlBak}}" ng-click = "showImgModal(input.value[$index],input.callBackData)" '
									+'class="img-thumbnail"/><a class="img-discribe">{{input.tip[$index]}}</a>'
								+'</span>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>',
		replace: true,
		link:function(scope,element,attrs){

			scope.SYS = SYS;
			//fydebug 要使用原来的代码需要进行这样的适配，
			if(scope.theme){
				scope.input= scope.theme;
			}
			if(scope.childTheme){
				scope.input= scope.childTheme;
			}
			if(scope.attribute){
				scope.input= scope.attribute;
			}

            scope.dicomDiscribe = '';
            if(scope.input.type == '病理图片上传-多张'){
                scope.dicomDiscribe = '(gif bmp jpg png)'
            }else if(scope.input.type == '影像图片上传-多张'){
                scope.dicomDiscribe = '(dicom)'
			}else{

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

angular.module("infi-basic").directive('imgLoad', function() {
	return {
		restrict: 'ECMA',
		scope:{
			datas : '=',
			stopload : '=',
			upls : '='
		},
		template: '<div class="modal fade" id="imgLoad" >'
					+'<div class="modal-dialog modal-width">'
					+'	<div class="modal-content">'
					+'		<div class="modal-header">'
					+'			<button ng-disabled="!stopload" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
					+'			<h4 class="modal-title">图片上传</h4>'
					+'		</div>'
					+'		<div class="modal-body">'
					+'			<ul class="load-list list-header" >'
					+'				<li><b>图片待上传</b></li>'
					+'				<li><b></b></li>'
					+'				<li><b>上传结果</b></li>'
					+'			</ul>'
					   //待上传
					+'			<div class="load-body" id="load-body">'
					+'				<ul class="load-list" ng-repeat="data in datas" ng-show="data.upshow">'
					+'					<li>{{data.name}}</li>'
					+'					<li class="prog"><progress value="{{data.evt}}" max="100"></progress><span class="progressSpan">{{data.evt}}%</span></li>'
					+'				</ul>'
					+'			</div>'
						//上传成功
					+'			<div class="load-body loads-success" id="load-success">'
					+'				<ul class="load-list load-success" ng-repeat="data in upls">'
					+'					<li title="{{data.name}}">{{data.name}}</li>'
					+'					<li class="{{data.status}}">{{data.result}}</li>'
					+'				</ul>'
					+'			</div>'
					+'		</div>'
					+'		<div class="modal-footer">'
					// +'			<button type="button" class="btn btn-primary" ng-click="stoprequest()">停止上传</button>'
					+'			<button type="button" class="btn btn-primary" data-dismiss="modal" ng-disabled="!stopload">确定</button>'
					+'		</div>'
					+'	</div>'
					+'</div><!-- /.modal-dialog -->'
					+'</div><!-- /.modal -->',
		replace: true,
		link:function(scope,element,attrs,datas,stopload){
			scope.stoprequest = function(){
				scope.stopload = true;
			};
		}
	};
});

angular.module("infi-basic").directive('imgModal',['FileService','SYS','Session',function(FileService,SYS,Session){
	return {
		restrict: 'ECMA',
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
		+'							<img ng-if="tagImgData == null" ng-mouseover="changeImgSize(\'event\')" ng-mouseleave="endWheelEvent()" class="tagImg img-imgDirection{{imgDirection}}" ng-src="{{url}}{{imgId}}{{urlBak}}"/>'
		+'                          <div dwv-view></div>'
		+'						</div>'
		+'						<div class="col-md-2">'
		+'							<span ng-click = "getImgData(nextImgId,callBackData)" class="btn-right glyphicon glyphicon-chevron-right {{nextBtn}}" aria-hidden="true"></span>'
		+'						</div>'
		+'						<div ng-if="tagImgData == null" class="col-md-12 infi-img-tool">'
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
		+'						</div>'
		+'					</div>'
		+'				</div>'
		+'				<div class="img-details col-md-3">'
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
		+'				    <li ng-repeat="opt in imagesGroup" class="makeImgSame {{opt.show}}">'
		+'					    <img ng-src="{{url}}{{opt.id}}{{urlBak}}" ng-click = "getImgData(opt.id,callBackData)"/>'
		+'				    </li>'
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

			scope.changeImgSize = function(data){
				if(data == 'init'){
					scope.ImgSizeDirection.size = 100;
					$('.modal-body .tagImg',element).removeAttr('style');
					$('.modal-body .tagImg',element).css({
						'max-width':'100%',
						'max-height':'100%'
					});
				}else if(data == 'event'){

					//绑定滚轮滑动事件
					$('.modal-body .tagImg',element).bind('mousewheel DOMMouseScroll',function(e){
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