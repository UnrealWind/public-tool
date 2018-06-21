angular.module("infi-basic").service('groupServices',['$http','SYS','Session',function($http,SYS,Session){

	//用于更新input数据
	this.updateValue = {
		update : function(input){
			if(input.type === '自动生成'){
				
			}else if(input.type==='单选+扩充输入'||input.type==='单选'){

				//添加扩充输入字段
				this.addExtend(input);
				this.updateRadio(input);
			}else if(input.type==='多选+扩充输入'|| input.type==='多选'||input.type==='文本输入-双值'){

				//添加扩充书如以及将value字段改变为对象
				this.addExtend(input);
				this.updateCheckbox(input);
			}else if(input.type === '菜单' && input.group == "true"){

				//在这个主题或者子主题存储自己的初始状态
				input.groupOpts = angular.copy(input);
			}else if(input.type.indexOf('上传')>-1 && input.value!==null && input.value!==''){
				this.updateUpload(input);
			}else if(input.type === '量表' ){
                this.ajaxScaleInfo(input);
            }

		},

        ajaxScaleInfo : function(input){
            if(input.value!=='' && input.value !==null && input.value.split('##')[1]>-1){
                input.tip = input.value.split('##')[1];
            }else{
                input.tip = '未填写完成！';
            }

        },
		addExtend : function(input){

			//这个值用于存储输入用户未填写的值
			input.extendValue = null;
		},

		//之前虽然定义了单选+扩充输入，但是实际上并没有这种类型，所以还是增加了该种情况的适配器
		updateRadio: function(input){
			var that = this;
			if( !that.contains(input.dimension,input.value) ){
				input.dimension.options.push({label: input.value,value: input.value});
			}
			
		},

		updateCheckbox :function(input){
			var that = this;
			if(!input.value || input.value===''||input.value === null){
				input.value={}
			}else{
				var tempValue = {};
				var tempValues = input.value.split(',');
				for( var idx=0;idx<tempValues.length;idx++){
					tempValue[tempValues[idx]] =true;
					if( !that.contains(input.dimension,tempValues[idx]) ){
						input.dimension.options.push({label: tempValues[idx],value: tempValues[idx]});
					}
				}
				input.value = tempValue;
			}
			
		},

		updateUpload: function(input){
			var url = SYS.url+'load/data/file/info/'+input.value;
			input.remote?url = SYS.url+'upload/info/'+input.value:undefined;

			$http({
				url: url,
				method: 'get',
				params: ''
			})
			.then(function(msg){
				//迭代msg里的数据，msg中存储的是多个文件类型相关的数据
				var value = [];
				var tip = [];
				var tipStyle = [];
				msg.data.data.forEach(function(file,index){
					value.push(file.id);
					tip.push(file.originName);
					tipStyle.push('greenTip');
				});

				input.value = value;
				input.tip = tip;
				input.tipStyle = tipStyle;
				input.callBackData = msg.data.data;
			});

			/*$.ajax({
				data:'',
				url: SYS.url+'/load/data/file/info/'+input.value,
				type:'get',
				async: false,
				success:function(msg){

					//迭代msg里的数据，msg中存储的是多个文件类型相关的数据
					var value = [];
					var tip = [];
					var tipStyle = [];
					msg.data.forEach(function(file,index){
						value.push(file.id);
						tip.push(file.originName);
						tipStyle.push('greenTip');
					});

					input.value = value;
					input.tip = tip;
					input.tipStyle = tipStyle;
					input.callBackData = msg.data;
					
				}
			});	*/
		},

		contains: function(dimension,name){
			if( dimension.options && dimension.options instanceof Array ){
				for( var idx=0;idx<dimension.options.length;idx++ ){
					var option = dimension.options[idx];
					if( option.label == name ){
						return true;
					}
				}
			}
		}
	}

	//用于单选扩充输入
	this.addRadioExtendOpt = function(input){
		var data = input.extendValue;
        data !== '' && data !== null ? input.dimension.options.splice(input.dimension.options.length-1,0,{'label':data,'value':data}) : undefined;
        input.value = data;
        input.extendValue = null;
	}

	//用于多选扩充输入
	this.addCheckboxExtendOpt = function(input){
		var data = input.extendValue;

        data !== '' && data !== null ? input.dimension.options.splice(input.dimension.options.length-1,0,{'label':data,'value':data}) : undefined;
        
       	input.value[data] = true;
		input.value['其他'] = false;

		//重置掉其他选项
		delete input.value.other;
		input.extendValue = null;
	}

	//用于控制子目录显示
	this.updateChildren = function(value,input,parent){
		
		var Update = function (tagValue,tagInput,tagParent){
			this.value = tagValue;
			this.input = tagInput;
			this.parent = tagParent;
		}

		Update.prototype = {
			init: function(){
				var that = this;

				if(that.input.children.length>0){

					//这个迭代找到了需要添加的数据
					that.input.children.forEach(function(n,i){

						//判断他是否是添加还是删除操作功能的首要条件即这个value是否为空或者是否存在
						if(n.value === that.input.value || that.input.value[n.value]){

							//这里进入了添加操作，由于多选状态需要区分多个选中状态，所以还需要教研当前选中值
							if(that.value === n.value){
								that.addOpt(n);
							}
						}else{

							//这里进入了删除操作
							that.deleteOpt(n);
						}
					});
				}
			},
			addOpt: function(opt){
				var that = this;
				var opt = angular.copy(opt);

				//通过去掉子节点的name的最后一个_a_以及之后的内容获取其parent的内容，这个tagname是判断其是
				//否插入位置的关键，children的parent字段存储的是并不是其parent的name，并不能用于判断，
				var tagName = that.getTagName(opt.name);
				add(that.parent);
				function add(arr){
					arr.forEach(function(n,i){
						if(n.bizName === tagName){

							//在目标位置之后插入即可
							arr.splice(i+1,0,opt)
							return false;
						}
						if(n.type == '虚拟菜单' && n.children){
							add(n.children)
						}
					});
				}
			},
			deleteOpt: function(opt){
				var that = this;
				var opt = angular.copy(opt);

				del(that.parent);
				//因为这里一定是删除流程，所以直接对要删除的数据进行删除操作即可
				
				function del(arr){
					var delArr = [];

					for(var i = arr.length-1;i>=0;i--){
						
						//删除的时候多选情况下不同选项下的子目录name都是相同的，所以还需要判断value是否相同，value字段
						//存储了那个选项的value触发了该子目录
						//when u are in group function,u should delete the group which has same group field 
						if((arr[i].name === opt.name && opt.value === arr[i].value) || (arr[i].group!= '' && arr[i].group != null && arr[i].group === opt.group && opt.value === arr[i].value)){

							//删除的时候会改变数组的长度，但是i并没有变化，所以会导致删除错误数据，所以将要删除的数据记录下来，
							//在这里面进行了删除操作
							arr.splice(i,1);
							continue;
						}

						if(arr[i].type == '虚拟菜单' && arr[i].children){
							del(arr[i].children)
						}
					}
				}
			},

			//这个方法用于获取children的父级的name值，单纯的砍掉了最后的一个_a_及后面的属性
			getTagName: function(name){
				var nameArr = name.split('_a_');
				var tagName = '';
				for(var i = 0;i<nameArr.length-1;i++){
					i==0?tagName +=  nameArr[i]:tagName +=  '_a_'+nameArr[i];
				}
				return tagName;
			}

		}

		//实例化Update，个人认为上面的东西应该放到factory里
		var update = new Update(value,input,parent);
		update.init();
		
	};

	this.addGroup = function(input,parent,addType){
		var addAttr = function (tagInput,tagParent,tagType){
			
			this.input = tagInput;
			this.parent = tagParent;
			this.tagType = tagType;
		}

		addAttr.prototype = {
			init: function(){
				var that = this;
				!that.tagType?that.addOpt():that.addGroups();
			},
			addOpt: function(){
				var that = this;
				
				//tagOpt，包含name改变后的属性数据，初始位置，以及已经插入过多少个，
				var tagOpt = that.changeAttr();
				add(that.parent);

				function add(arr){
					arr.forEach(function(n,i){
						if(n.name === tagOpt.initName){

							//初始位置，以及插入的个数，确定了即使是多选状态下的插入位置
							arr.splice(i+tagOpt.index,0,tagOpt.tagInput)
						}

						if(n.children){
							add(n.children)
						}
					});
				}
				
			},
			changeAttr: function(){
				var that = this;

				//初始化一下index，用于标记已经插入过多少次
				var index = 0;

				//存储追加标识的位置，这个位置即tagInput.name.split('_a_')的length
				var tagInputName = that.input.name;
				var addIndex = tagInputName.split('_a_').length;

				//获取一下初始的name值，用于不管点击那个添加按钮都会在对应的子目录位置进行添加
				var initName = that.getInitName(that.input,addIndex);

				//初始数据
				var tagInput = null;

				that.parent.forEach(function(n,i){

					//用于如果是多选多个子目录同时出现的情况下，由于子目录的name都是相同的，插入位置会混乱，所以进行了筛选
					//这个样子插入的数据即按顺序插入的
					if(n.type === "虚拟菜单" && n.group === that.input.group && n.value === that.input.value){
						index++;
						if(index === 1){

							//目标表单的上一个表单一定是初始parent表单，在这里可以拿到初始状态的表单
							that.parent[i-1].children.forEach(function(ny,iy){
								if(ny.group === that.input.group && ny.value === that.input.value){
									tagInput = angular.copy(ny)
								}
							})
						}
					}else if(n.type === "菜单" && n.label === that.input.label){

						//如果是主题组合或者子主题组合的话，则label相同即可
						index++;
						index === 1?tagInput = angular.copy(n.groupOpts):undefined;
					}
				});
				
				//对name进行更新，对addIndex的位置进行更新
				tagInput.name = initName + '['+index+']';

				//更新一下taginput下的所有name
				update(tagInput.children);
				function update(arry){
					arry.forEach(function(n,i){
						//n.label = '第'+index+'次'+n.label;
						var name = n.name;
						var nameArr = name.split('_a_');
						n.name =  initName+'['+index+']';
						for(var i=addIndex;i<nameArr.length;i++){
							n.name += '_a_'+nameArr[i];
						};
						if(n.children.length>0){
							update(n.children);
						};
					});
				};
				
				return {
					"tagInput":tagInput,
					"index":index,
					"initName":initName
				};
			},
			getInitName:function(tagInput,addIndex){

				//解除绑定
				var tagName =  angular.copy(tagInput).name;
				var nameArr = tagName.split('_a_');
				var initName ='';
				for(var i = 0;i<nameArr.length;i++){

					//addInd存储的位置，即标识发生变化的位置，这个只有这个位置的标识改变，所以重置这个位置的index即
					//可以得到当前模块相对initname
					if(i == addIndex-1){
						nameArr[i] = nameArr[i].split('[')[0];
					}
					i==nameArr.length-1?initName += nameArr[i]:initName += nameArr[i]+'_a_';
				}

				return initName;
			},

			addGroups: function(){
				var that = this;

				//tagOpt，包含name改变后的属性数据，初始位置，以及已经插入过多少个，
				var tagOpt = that.changeAttr();

				that.parent.forEach(function(n,i){
					if(n.name === tagOpt.initName){

						//初始位置，以及插入的个数，确定了即使是多选状态下的插入位置
						that.parent.splice(i+tagOpt.index,0,tagOpt.tagInput)
					}
				});
			},

		}
 
		//实例化Update，个人认为上面的东西应该放到factory里
		var addAttr = new addAttr(input,parent,addType);
		addAttr.init();
	}

	//时间插件
	this.timePlugin = function(tagName,format){

        var minView = null;
        var startView = null;
        if(format.indexOf('hh')>-1||format.indexOf('HH')>-1){
            minView = 0;
            startView = 2;
        }else if(format.indexOf('dd')>-1||format.indexOf('DD')>-1){
            minView = 2;
            startView = 2;
        }else{
            minView = 3;
            startView = 3;
        }

		$('input[name="'+tagName+'"]').datetimepicker({
	        format: format,
			language:"zh-CN",
			autoclose: true,
			forceParse:true,
			minView:minView,
            startView:startView
	    }).trigger('focus');
	};

    this.getScaleData = function(input){
    	var url =null;
        var id = input.scaleUrl;
        var resultId = null;
        input.value !=='' && input.value!==null?resultId = input.value.split('##')[0]:undefined;
        var data = null;
        var user = Session.getUser();
        var params = 'eu='+user.eu+'&ep='+user.ep;
        if(resultId && resultId !==null){
            url = SYS.url+'scale/result/detail/'+input.scaleUrl+'/'+resultId+'?'+params;
        }else{
            url = SYS.url+'scale/input/'+id+'?'+params;
        }
        $.ajax({
            type:'get',
            url: url,
            async: false,
            success:function(msg){

                //fydebug reload的时候因为值的变化是ng-change无法监听到的，所以reload的时候就默认增加上需要的opt
                if(resultId){
                    msg.data.forEach(function(n,i){
                        n.valueId == 0?n.showOptIdx = false:n.showOptIdx = true;
                    });
                    msg.showWarning = false;
                }else {
                    msg.data.forEach(function(n,i){
                        n.showOpt = false;
                        n.showOptIdx = false;
                    })
                    msg.showWarning = true;
                }

                //初始化一下
                msg.data[0].showOpt = true;
                data = msg;
            }
        });
        return data;
    }

}]); 
