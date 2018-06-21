angular.module("infi-basic").directive('scaleModal',['SYS','$http','Session',function(SYS,$http,Session){
	return {
		restrict: 'E',
        template: '<div class="modal fade" id="infi-u-scale">'
					+'<div class="modal-dialog modal-lg">'
					    +'<div class="modal-content">'
					      +'<div class="modal-header">'
					        +'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
					        +'<h1 class="modal-title">量表信息</h1>'
					      +'</div>'
					     /* +'<div ng-show = "scaleData.showWarning == true">'
							+'<div class="alert alert-warning infi-alert">请回答完所有题目以后再提交！</div>'
						  +'</div>'*/
					      +'<div class="modal-body">'
					      	+'<h1 class="infi-title">{{scaleData.tagInputData.label}}</h1>'
					      	+'<div class="infi-box-containter detail-main">'
					      		+'<div class="healthtestnav center-block">'
					      			+'<ul>'
					      				+'<li  ng-repeat = "opt in scaleData.data"><a ng-class="{true:\'active\',false:\'\'}[opt.showOptIdx]" index="{{$index+1}}" ng-click = "changeSubject(0,$index)">{{$index+1}}</a></li>'
					      			+'</ul>'
					      		+'</div>'
					      		+'<div class="text-check">'
					      			+'<form id="filterForm">'
					      				+'<a class="glyphicon glyphicon-chevron-left to-left prev" aria-hidden="true" ng-click = "changeSubject(-1)"> </a>'
					      					+'<ul class="list-inline">'
					      						+'<li ng-repeat = "options in scaleData.data" ng-class="{true:\'active\',false:\'\'}[options.showOpt]">'
					      							+'<p>{{$index+1}} . {{options.questionName}}</p>'
					      							+'<div ng-repeat = "opt in options.scaleQuestionOptions" class="radio">'
														+'<label class="checkbox-inline">'
															+'<input type="radio" ng-checked = "options.valueId == opt.id" value="{{opt.id}}" name="{{opt.questionName}}" ng-change = "changeOptIdx(options)" ng-model = "options.valueId">{{opt.optionName}}'
														+'</label>'
													+'</div>'
					      						+'</li>'
					      					+'</ul>'
					      				+'<a class="glyphicon glyphicon-chevron-right to-right next" aria-hidden="true" ng-click = "changeSubject(1)"> </a>'
					      			+'</form>'
					      		+'</div>'
					      	+'</div>'
					      +'</div>'
					      +'<div class="modal-footer">'
					      	/*+'<input ng-if="scaleData.showWarning == true" id="scale" class="btn btn-fix infi-btn-primary btn-submit" type="button" disabled="disabled" value="提交">'*/
					      	+'<button id="scale" class="btn btn-fix infi-btn-primary btn-submit" type="button" ng-click = "saveScale()">保存</button>'
					        +'<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
					      +'</div>'
					    +'</div><!-- /.modal-content -->'
					  +'</div><!-- /.modal-dialog -->'	
				 +'</div>',
		replace: true,
		link:function(scope,element,attrs){

			scope.changeSubject = function(changeMark,navNum){
				var data = scope.scaleData.data;
				for(var index in data){
					if(data[index].showOpt === true){
						if(index == 0 && changeMark == -1 || index==data.length-1 && changeMark==1){
							return;
						}
						data[index].showOpt = false;
						if(navNum||navNum==0){
							data[Number(navNum)].showOpt = true;
							return
						}
						data[Number(index)+Number(changeMark)].showOpt = true;
						return;
					}
				}
			}

			scope.changeOptIdx =function(options){
				options.showOptIdx = true;
				var idx = 0;
				scope.scaleData.data.forEach(function(n,i){
					if(n.showOptIdx == true){
						idx++;
					}
				});

				if(idx === scope.scaleData.data.length){
					scope.scaleData.showWarning = false;
				}
			}

			scope.saveScale = function(){
				var data = angular.copy(scope.scaleData).data;
				var tagData = [];
				
				//fydebug 删除无关紧要的数据
				data.forEach(function(n,i){
					delete n.$$hashKey;
					delete n.showOpt;
					delete n.order;
					n.scaleQuestionOptions.forEach(function(ny,iy){
						delete ny.$$hashKey;
					});
					if(n.showOptIdx){
						delete n.showOptIdx;
						tagData.push(n);
					}
				});
                var user = Session.getUser();
                var params = 'eu='+user.eu+'&ep='+user.ep;
				$.ajax({

				 	//把整个scaleData传回后台，其中包含了用户的选项
				 	data : JSON.stringify(tagData),
				 	url :  SYS.url+'/scale/save/'+scope.scaleData.tagInputData.scaleUrl+'?'+params,
				 	type : 'post',
				 	contentType: "application/json",
				 	async: false,
				 	success:function(msg){
				 		var scaleArry = msg.data.message.split('##');
				 		scope.scaleData.tagInputData.value =scaleArry[0];
			 			scope.scaleData.tagInputData.score =scaleArry[1];
				 		if(scaleArry[1]>-1){
				 			scope.scaleData.tagInputData.tip = scope.scaleData.tagInputData.score;
				 		}else{
				 			scope.scaleData.tagInputData.tip = '点击继续填写！';
				 		}
				 		$('#infi-u-scale').modal('hide');
				 		/*refreshScaleData(scope.currentData);
				 		function refreshScaleData(arry){
				 			arry.forEach(function(n,i){
				 				if(n.children && n.children.length>0){
				 					refreshScaleData(n.children);
				 				}
				 				if(n.type === '量表' && n.name === scope.scaleData.tagInputData.name){
				 					n.value = scope.scaleData.tagInputData.value;
				 					n.score = scope.scaleData.tagInputData.score;
				 				}
				 			});
				 		};*/
				 	}
				});  
			}
		}
	};
}])