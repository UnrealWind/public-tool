
angular.module("infi-basic").directive('inputFileTemplate',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        templateUrl: '../../../../src/widget/form/basic-template/input.upload.html',
        replace : true,
        link:function(scope,element,attrs){
            
        }
    };
}]);



angular.module("infi-basic").directive('inputFileUpload',['Upload','uploadServices','SYS','groupServices',function(Upload,uploadServices,SYS,groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            basic:'='
        },
        templateUrl:'../../../../src/widget/form/basic-template/input.uploadModal.html',
        replace : true,        
        link:function(scope,element,attrs){
        	scope.SYS = SYS;
            scope.input && scope.input.remote?scope.url = SYS.url+'upload/download/':scope.url = SYS.url+'load/data/file/';
            if(scope.basic){
                !scope.basic.subjectFiles?scope.basic.subjectFiles = null:undefined;
                scope.input = {'type':'不下载'};
            }else{
                groupServices.updateValue.update(scope.input);
            }
            scope.onFileSelects = function($files){

                //调用services
                uploadServices.uploadFile($files,scope,element,scope.input);
            };
            scope.deleteFileSelect = function(num){
                if(scope.basic){
                    scope.basic.subjectFiles.splice(num,1);
                }else{
                    scope.input.value.splice(num,1);
                    scope.input.tipStyle.splice(num,1);
                    scope.input.tip.splice(num,1);
                }
            }
        }
    };
}]);

angular.module("infi-basic").directive('imgLoads',function() {
    return {
        restrict: 'ECMA',
        scope:{
            datas : '=',
            stopload : '=',
            upls : '='
        },
        templateUrl: '../../../../src/widget/form/basic-template/input.imgLoad.html',
        replace: true,
        link:function(scope,element,attrs,datas,stopload){
            
        }
    };
});

angular.module("infi-basic").directive('viewAttachment',['groupServices','SYS','FileService','$http',function(groupServices,SYS,FileService,$http) {
    return {
        restrict: 'ECMA',
        templateUrl: '../../../../src/widget/form/basic-template/input.view.attachment.html',
        replace: true,
        link:function(scope,element,attrs){
            scope.SYS = SYS;
            scope.show = false;
            scope.tagData = {};

            scope.changeAttachmentDataNavi = function(mark){
                scope.tagData['fileType'] =mark;
                $http({
                    url: SYS.url+'/subject/record/'+scope.routeParams.recordId+'/list',
                    method: 'get',
                    params: scope.tagData
                }).success(function(msg){
                    if(msg.data===null){
                        msg.data = {};
                        msg.data['value'] = null;
                        msg.data['files'] = [];
                        msg.data['fileType'] = mark;
                        msg.data['remark'] = '';
                    }else{
                        var arr = angular.copy(msg.data);
                        msg.data = {};
                        msg.data['files'] = arr;
                        msg.data['value'] = [];
                        arr.forEach(function(n,i){
                            msg.data.value.push(n.id);
                        })
                        msg.data['fileType'] = mark;
                    }
                    if(msg.data.fileType === 'image'){
                        msg.data['label'] = "上传病历图片";
                        msg.data['type'] = '图片上传-多个';
                    }else if(msg.data.fileType === 'file'){
                        msg.data['label'] = "上传病历文件";
                        msg.data['type'] = '文件上传-多个';
                    }else{
                        msg.data['label'] = "病历描述";
                        msg.data['type'] = '大文本输入';
                        msg.data.value = msg.data['files'][0]
                    }
                    scope.input = msg.data;

                     //缺失的数据会在这里得到添加,这个是可以复用的
                    groupServices.updateValue.update(scope.input);
                    if (msg.data.fileType !== 'descrip'&& msg.data.value!== null) {
                        scope.getImgData(scope.input.files[0].id,scope.input.files);
                    }
                });
            }

            scope.changeAttachmentDataNavi('image');
            scope.showModal = function(){
                scope.show = !scope.show;
            }

            scope.saveAttachment = function(){
                var url = '';
                var data = {};
                data['fileType'] = scope.input.fileType;
                if(scope.input.fileType == 'descrip'){
                    url = SYS.url+'/subject/record/descrip/save?recordId='+scope.routeParams.recordId+'&descrip='+scope.input.value;
                }else{
                    url = SYS.url+'/subject/record/save?recordId='+scope.routeParams.recordId;
                    data = scope.input.files;
                }

                //强行校验，ｄａｔａ如果是空数组则不会触发保存操作
                if(data.length == 0){
                    return false
                }

                $http({
                    url: url,
                    method: 'post',
                    data:data
                }).success(function(msg){

                })
            }

            scope.deleteFileSelect = function(num){
                $('#'+scope.input.name).val('');
                scope.input.value.splice(num,1);
                if(scope.input.tipStyle){
                    scope.input.tipStyle.splice(num,1);
                    scope.input.tip.splice(num,1);
                    scope.input.callBackData.splice(num,1);
                }
                if(scope.imagesGroup){
                    scope.imagesGroup.splice(num,1);
                }
                scope.input.files.splice(num,1);
                if(scope.imagesGroup.length>0){
                    scope.imgId = scope.imagesGroup[num-1].id; 
                }else{
                    scope.imgId = undefined;
                }
            }

            scope.imgDirection = 0;
            scope.ImgSizeDirection = {
                'size':100,
                'width':0,
                'height':0
            };

            scope.onFileSelects = function($files){

                //调用services
                uploadServices.uploadFile($files,scope,element);
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

                //每次改变都重置掉这个值,并且重新获取新的宽高
                scope.ImgSizeDirection = {};
                getImgSize();
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
                if(!scope.ImgSizeDirection.height){
                    getImgSize();   
                }

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

            /*  这里逻辑与之前不同，所以不通过这个监听来触发 getImgSize 的方法
            scope.$watch('imgId',function(newValue, oldValue){
                if(newValue !== oldValue){
                    getImgSize();
                }
            });*/

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
}]);


angular.module("infi-basic").service('uploadServices',['$http','Upload','SYS',function($http,Upload,SYS){
    this.uploadFile = function(file,scope,element,input){
        var url = '';
        if(scope.basic){
            url = SYS.url+'/subject/file/save';
        }else {

            //如果含有该字段则为远程会诊项目，该项目与科研2.0走不同的url根据这个字段进行区分
            input.remote?url = SYS.url+'/upload/file':url = SYS.url+'/load/data/file/'+SYS.routeParams.projectName+'/'+SYS.routeParams.recordId;
        }

        //定义一下全局scope
        //上传成功列表数据,每次需要进行清空,不能提到函数外面
        scope.upls = [];

        //待上传列表数据
        scope.datas = [];

        //控制上传按钮的开启和关闭,不能提到函数外面
        scope.stopload = false;

        //记录上传的个数,判断是否传完,不能提到函数外面
        scope.num = 0;

        //初始滚动条在最上面
        $('#load-body').scrollTop(0);

        
        var UploadFile = function (file,obj){
            this.file = file;
            this.obj = obj;
        }

        UploadFile.prototype = {
            init: function(){
                var that = this;
                that.upload();
            },
            upload: function(){
                var that = this;
                Upload.upload({
                    url: url,
                    method: 'post',
                    file: that.file,
                    params: {filter:false}
                }).progress(function(evt){
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    that.obj.evt = progressPercentage-1;
                }).then(function (msg){
                    if(msg.data.status == 'ok'){
                        that.updateFileOpt(scope.input,msg);
                        
                        that.obj.status = 'good';
                        that.obj.result = '上传成功';
                        that.obj.evt = 100;
                    }else if(msg.data.status == 'error' || msg.data.status == 'blank'){
                        that.obj.status = 'red';
                        that.obj.result = '上传失败';
                        that.obj.evt = 0;
                    }
                    scope.upls.push({name:that.obj.name,status:that.obj.status ,result:that.obj.result});
                    that.obj.upshow = false;
                    scope.num++;
                    if(scope.datas.length == scope.num){
                        scope.stopload = true;
                    }
                    if(scope.basic){
                        scope.basic.subjectFiles==null?scope.basic.subjectFiles = msg.data.data:scope.basic.subjectFiles.push(msg.data.data[0]);
                    }
                });
            },
            updateFileOpt: function(input,msg){
                var tip = msg.data.description;
                if(msg.data.data instanceof Array === false){
                    var data = msg.data.data;
                    msg.data.data = [];
                    msg.data.data.push(data);
                }
                msg.data.data.forEach(function(n,i){
                    if(input.tip == null){
                        input.tipStyle = [];
                        input.tip = [];
                        input.value= [];
                    }
                    if(msg.data.status == 'ok'){
                        tip = '[ ' + n.originName +' ]上传成功';
                        input.tipStyle .push('greenTip');
                    }else{
                        input.tipStyle .push('redTip');
                        tip = '[ ' + n.originName +' ]上传失败';
                    }
                    input.tip.push(tip);
                    input.value.push(n.id);
                    if(!input.callBackData){
                        input.callBackData = [];
                    }
                    input.callBackData.push(n);
                });  
            }
        }

        for(var i = 0; i < file.length; i++){
            i===0?$('#imgLoads,element').modal({backdrop: 'static'}):undefined;
            scope.datas[i] = {};
            scope.datas[i].name = file[i].name;
            scope.datas[i].status = '';
            scope.datas[i].upshow = true;
            scope.datas[i].evt = '0';
            scope.datas[i].result = '...正在上传...';
            
            //实例化一下,最后决定还是将scope作为全局变量用
            var uploadFile = new UploadFile(file[i],scope.datas[i]);
            uploadFile.init();
        }

    };

}]);
