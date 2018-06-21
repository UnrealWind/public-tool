
angular.module("infi-basic").service('FileService',['$http',function($http){
	
    this.makeUpFileOpt = function(input,msg,isMultiple,attachment){
    	//
    	if(msg.data.status === 'blank'){
    		return false;
    	}
    	var tip = msg.data.description;
    	msg.data.data.forEach(function(n,i){
     		if(isMultiple){
     			if(input.tip == null && !attachment){
    	        	input.tipStyle = [];
    		        input.tip = [];
    		        input.value= [];
    	        }else if(attachment){
                    input.tipStyle = [];
                    input.tip = [];
                    if(input.value == null){
                        input.value= [];
                    }
                    input.files.forEach(function(n,i){
                        input.tipStyle.push('[ ' + n.originName +' ]上传成功');
                        input.tipStyle.push('greenTip');
                    });
                }
    	        if(msg.data.status == 'ok'){
    	        	if(isMultiple==='img'){
    	        		tip = n.originName ;
    	        	}else{
    	        		tip = '[ ' + n.originName +' ]上传成功';
    	        	}
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
     		}else {
     			if(msg.data.status == 'ok'){
    	        	input.tipStyle = 'greenTip';
    	        	tip = '[ ' + n.originName +' ]上传成功';
    	        }else{
    	        	input.tipStyle ='redTip';
    	        	tip = '[ ' + n.originName +' ]上传失败';
    	        }
    	        input.tip = tip;
     			input.value = n.id;
     			if(!input.callBackData){
    	        	input.callBackData = [];
    	        }
    	        input.callBackData.push(n);
     		}
    	});
    }

    this.showImgModal = function(){
    	$('#imgModal').modal('show');
    }

    this.judgeData = function(n,i,length,callBackData){

    	var imgDataOpt = {};
    	var prevBtnState,nextBtnState;
        var initData = JSON.parse(JSON.stringify(callBackData));

		//这个数据用于存储第一个数据的位置，根据这个数值来选择需要进行显示的图片们
		var firstData = null;
		
		if(length>11){

			//当数据属于前五个的时候,就直接显示前11个就行咯，
			if(i<=5){
				firstData = 0;
				prevBtnState = 'hide'

			//如果大于十个而且是中间的数的话就显示那个数周围的那些数咯	
			}else if(4<i && i<length-6){
				firstData = i-5;
				prevBtnState = '';
				nextBtnState = '';

			//如果是后面五个，就得显示最后11个数了，
			}else if(i>=length-6){
				firstData = length-11
				nextBtnState = 'hide';
			}
		}else{
			firstData = 0;
			prevBtnState = 'hide';
			nextBtnState = 'hide';
		}

		imgDataOpt.tagData = initData.splice(firstData,11);
		imgDataOpt.prevBtnState = prevBtnState;
		imgDataOpt.nextBtnState = nextBtnState;

		return imgDataOpt;
    }

    this.judgeImgArea = function(mark,_callBackData,firstDataIdx,lastDataIdx){
    	
    	var imgAreaOpt = {};
    	var prevBtnState,nextBtnState,tagData;
        if(mark==='prev'){
			if(firstDataIdx <= 11){
				tagData = _callBackData.splice(0,11);
				prevBtnState = 'hide';
			}else{
				tagData = _callBackData.splice(firstDataIdx-11,11);
				prevBtnState = '';
			}
		}else{
			if(lastDataIdx > _callBackData.length-11){
				tagData = _callBackData.splice(_callBackData.length-11,11);
				nextBtnState = 'hide';
			}else{
				tagData = _callBackData.splice(lastDataIdx,11);
				nextBtnState = '';
			}
		}

		imgAreaOpt.tagData = tagData;
		imgAreaOpt.prevBtnState = prevBtnState;
		imgAreaOpt.nextBtnState = nextBtnState;

		return imgAreaOpt;
	}

}])
