angular.module('infi-basic').directive('affix',function($http,naviServices){
	return {
		restrict: 'ECMA',
        template: '<div id="affix" class="affix-nav" role="complementary">'
						+'<ul id="affix-nav" class="nav " role="tablist">'
							+'<li class="infi-nav-outside {{model.showNav}}" ng-repeat = "model in navigates">'
								+'<a style="padding-right: 0px;" href="javascript:;" ng-click = "showNav(model)"><span ng-if="model.hasNecessary" ng-class="{\'true\':\'self-font-red\'}[model.hasNecessary]">*</span>{{model.label}}</a>'
								+'<ul class="infi-nav-inside">'
									+'<li ng-repeat = "theme in model.children" ng-click = "changeModel(theme.name)">'
										+'<a ng-class="{true:\'active\',false:\'\'}[currModuleName === theme.name]" href="javascript:;"><span ng-if="theme.hasNecessary" ng-class="{\'true\':\'infi-font-red\'}[theme.hasNecessary]">*</span>{{theme.label}}</a>'
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
			
			scope.changeModel = function(module){
				scope.saveModule();
				scope.updateModuleForm(module,'details');
			}
		}
	};
})