
angular.module('infi-basic').service('naviServices',['$http','SYS','$routeParams','Session','$timeout'
	,function($http,SYS,$routeParams,Session,$timeout){
	this.getNaviData = function(opt){
		var that = this;

        var url = '/src/widget/navi/data/testNavi.json';
        // var url = 'http://192.168.1.167:37561/platform/menu/get/source';
        //var url = 'http://192.168.1.163:8089/security/menu/platfrom/tree';


        return $http({
			url:url,
			method: 'get',
			params: ''
		}).then(function(msg){
			//适配一下数据，使数据可以使用
			//在刚哥改好接口之前通过这个进行适配
			msg.data.menus?msg.data['data'] = msg.data:undefined;
			msg.data.data.menus = that.fixData(msg.data.data.menus)
			return msg.data;
		})
	}

	this.choseNavi =function(opt,naviData,secondNavi,mark,element){
		//有mark的为第一级菜单
		//存储一下这个用户信息，
		var userOpt = Session.getUser();
		var urlBak = '?eu='+userOpt.loginName+'&ep='+userOpt.no;
		var that = this;

		if(!mark){
			function judgeActive(arr){
				arr.forEach(function(n,i){
					n.active?n.active = false:undefined;
					n.name == opt.name?n['active'] = true:undefined;
					n.menus?judgeActive(n.menus):undefined;
				})
			}
			judgeActive(secondNavi);
		}

		//有children字段且标示show 为true,证明其为展开状态，需要进行收缩操作
		if(opt.menus && opt.show === true){
			opt['show'] = false;

		//有children字段且show 为false或不存在的则展开，需要进行展开操作
		}else if(opt.menus && opt['show'] === false|| opt.menus && !opt.show ){
			opt['show'] = true;
		}

		// 点击的是第一级菜单且无second则收缩二级菜单
		if(mark && !opt.second){
			secondNavi = null;

		//含有second 一定展开2级菜单，展开二级菜单的时候默认打开二级菜单中第一个可以用于显示页面的页面
		}else if(mark && opt.second && opt.second.length>0){

			//重置一下2级菜单的值
			secondNavi = opt.second;
		}

		if(mark && opt.href){
			naviData.forEach(function(n,i){
				n.menus.forEach(function(ny,iy){
					ny.active?delete ny.active:undefined;
					ny.href === opt.href?ny['active'] = true:undefined;
				})
			})
		}

		//第一级菜单点击的时候需要重置同级菜单的状态 		
		if(mark && opt.menus){
			naviData = that.resetShow(naviData,opt);
		}
	
		return {
			"naviData":naviData,
			"secondNavi":secondNavi
		};

	}

	//这个方法用于给初始状态的数据增加一些字段，目前增加了show字段，以后增加字段都可以在这里进行增加
	this.fixData = function(arr){
		if(!arr){
			return false;
		}

		//获取当前访问的ip和端口号
		var ipPort = 'http://'+window.location.hostname+':'+window.location.port+'/';

		//适配器
		(function fixData(arr,showMark){
			arr.forEach(function(n,i){

				//不知道为什么后台总是传空格过来，就直接把它校验掉
				n.href = $.trim(n.href);

				//show 字段用于控制收缩
				!n.show?n['show'] = false:undefined;

				//二级导航默认全部展开
				showMark?n['show'] = true:undefined;

				//href为空的字段直接删了，省着影响别的
				n.href === null || n.href === ''?delete n.href:undefined;

				//不含有target字段的,进这个逻辑拼接url
				if((!n.target || n.target == '' || n.target == null)&& n.href){
                    n.href && $routeParams.id && n.href.charAt(n.href.length-1) =='/'?n.href = ipPort+n.href+$routeParams.id:n.href = ipPort+n.href;
                }

				//去除一下无用的字段
				n.menus == null||n.menus.length == 0?delete n.menus:undefined;
				n.second == null||n.second.length == 0?delete n.second:undefined;

				//递归调用进行修复
				n.menus?fixData(n.menus):undefined;
				n.second?fixData(n.second,'show'):undefined;
			})
		})(arr)
		
		return arr;
	}

	//想了一下，如果使用 angularjs $index 或者 $parent.$index一类的来获取index标记的话，都有一些问题，
	//所以直接用这个方法来获取其下标
	this.getIndex = function(href,naviData){
		var strIdx = '';
		var arrIdx = [];

		//这个标示标志了你在刷新第几个位置的数组，做的有点麻烦了想法有点问题
		var index = 0;

		function getIndex(arr){
			arr.forEach(function(n,i){
				arrIdx[index] = i;

				//如果校验对之后则进行最终字符串的拼接，
				if(n.href && n.href.split('#')[1] === href.split('#')[1]){
				//if(n.href === href){
					arrIdx.forEach(function(ny,iy){
						iy===0?strIdx += ny:strIdx += ','+ny;
					})
					n['active'] = true;
				}

				//当存在children或者second字段的话，则进行递归操作
				if(n.menus ||n.second){
					index++;
					getIndex(n.menus || n.second);
				}else{
					i === arr.length-1?index = index-1:undefined;
					
				}
				arrIdx.pop();
			});
		}

		//第一层要记录下这个初始状态,用这个状态去刷新记录的数组
		naviData.forEach(function(n,i){
			index = 0;
			arrIdx[index] = i;
			if(n.menus ||n.second){
				index++;
				getIndex(n.menus || n.second);
			}
		})
		
		return strIdx;
	}

	//根据传递的idx还原原有数据
	this.restoreNavi = function(naviData,strIdx){
        var arrIdx = strIdx.split(',');
        var second = null;
        var secondTitleOpt = null;
        var i = 0;
		(function fixNaviData(arr){
			var idx = arrIdx[i];
			i++;

			i===2?secondTitleOpt = arr[idx]:undefined;
			if(!arr[idx]){
				return;
			}

			arr[idx].menus?arr[idx].show = true:undefined;
			if(arr[idx].second){
				second = arr[idx].second;
				arr[idx]['active'] = true;
			}
			second!==null && arr[idx].href && arr[idx].menus?second = null:undefined;
			second===null && arrIdx.length === i && arrIdx.length>2?second = arr :undefined;

			arr[idx].second || arr[idx].menus?fixNaviData(arr[idx].second || arr[idx].menus):undefined;
			
		})(naviData)

		return {
			'naviData':naviData,
			'second':second,
			'secondTitleOpt':secondTitleOpt
		};
	}

	//第一级导航在点击的时候要重置其他同级的状态
	this.resetShow = function(naviData,opt){
		naviData.forEach(function(n,i){
			n.name === opt.name?undefined:n['show'] = false;
		})
		return naviData;
	}
	
	this.judgeShrink = function (secondNavi) {
		if(secondNavi && secondNavi.length > 0 || window.location.href.indexOf('record-src-demo')>=0){
			return true;
		}else {
			return false;
		}
    }

}]); 