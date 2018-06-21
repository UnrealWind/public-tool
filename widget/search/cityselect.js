/* *
 * 城市控件构造函数
 * @CitySelector
 * */

function Vcity() {
    var CitySelector = this;  //将此作用域this赋值,避免和其他方法里的this冲突
    CitySelector._m = {
        /* 选择元素 */
        $:function (arg, context) {
            var tagAll, n, eles = [], i, sub = arg.substring(1);
            context = context || document;
            if (typeof arg == 'string') {
                switch (arg.charAt(0)) {
                    case '#':
                        return document.getElementById(sub);
                        break;
                    case '.':
                        if (context.getElementsByClassName) return context.getElementsByClassName(sub);
                        tagAll = CitySelector._m.$('*', context);
                        n = tagAll.length;
                        for (i = 0; i < n; i++) {
                            if (tagAll[i].className.indexOf(sub) > -1) eles.push(tagAll[i]);
                        }
                        return eles;
                        break;
                    default:
                        return context.getElementsByTagName(arg);
                        break;
                }
            }
        },

        /* 绑定事件 */
        on:function (node, type, handler) {
            node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
        },

        /* 获取事件 */
        getEvent:function(event){
            return event || window.event;
        },

        /* 获取事件目标 */
        getTarget:function(event){
            return event.target || event.srcElement;
        },

        /* 获取元素位置 */
        getPos:function (node) {
            var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
                scrollt = document.documentElement.scrollTop || document.body.scrollTop;
            var pos = node.getBoundingClientRect();
            return {top:pos.top + scrollt, right:pos.right + scrollx, bottom:pos.bottom + scrollt, left:pos.left + scrollx }
        },

        /* 添加样式名 */
        addClass:function (c, node) {
            if(!node)return;
            node.className = CitySelector._m.hasClass(c,node) ? node.className : node.className + ' ' + c ;
        },

        /* 移除样式名 */
        removeClass:function (c, node) {
            var reg = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");
            if(!CitySelector._m.hasClass(c,node))return;
            node.className = reg.test(node.className) ? node.className.replace(reg, '') : node.className;
        },

        /* 是否含有CLASS */
        hasClass:function (c, node) {
            if(!node || !node.className)return false;
            return node.className.indexOf(c)>-1;
        },

        /* 阻止冒泡 */
        stopPropagation:function (event) {
            event = event || window.event;
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        },
        /* 去除两端空格 */
        trim:function (str) {
            return str.replace(/^\s+|\s+$/g,'');
        }
    };

    /* 正则表达式 筛选中文城市名、拼音、首字母 */
    CitySelector.regEx = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\w)\w*$/i;
    CitySelector.regExChiese = /([\u4E00-\u9FA5\uf900-\ufa2d]+)/;

    CitySelector.createSearchContent = function () {
        var citys = CitySelector.allCity, match, letter,
            regEx = CitySelector.regEx,
            reg2 = /^[a-b]$/i, reg3 = /^[c-d]$/i, reg4 = /^[e-g]$/i,reg5 = /^[h]$/i,reg6 = /^[j]$/i,reg7 = /^[k-l]$/i,reg8 =  /^[m-p]$/i,reg9 =  /^[q-r]$/i,reg10 =  /^[s]$/i,reg11 =  /^[t]$/i,reg12 =  /^[w]$/i,reg13 =  /^[x]$/i,reg14 =  /^[y]$/i,reg15 =  /^[z]$/i;

        if (!CitySelector.oCity) {
            CitySelector.oCity = {hot:{},AB:{},CD:{},EFG:{},H:{},J:{},KL:{},MNP:{},QR:{},S:{},T:{},W:{},X:{},Y:{},Z:{}};
            for (var i = 0, n = citys.length; i < n; i++) {
                match = regEx.exec(citys[i]);
                letter = match[3].toUpperCase();
                if (reg2.test(letter)) {
                    if (!CitySelector.oCity.AB[letter]) CitySelector.oCity.AB[letter] = [];
                    CitySelector.oCity.AB[letter].push(match[1]);
                } else if (reg3.test(letter)) {
                    if (!CitySelector.oCity.CD[letter]) CitySelector.oCity.CD[letter] = [];
                    CitySelector.oCity.CD[letter].push(match[1]);
                } else if (reg4.test(letter)) {
                    if (!CitySelector.oCity.EFG[letter]) CitySelector.oCity.EFG[letter] = [];
                    CitySelector.oCity.EFG[letter].push(match[1]);
                }else if (reg5.test(letter)) {
                    if (!CitySelector.oCity.H[letter]) CitySelector.oCity.H[letter] = [];
                    CitySelector.oCity.H[letter].push(match[1]);
                }else if (reg6.test(letter)) {
                    if (!CitySelector.oCity.J[letter]) CitySelector.oCity.J[letter] = [];
                    CitySelector.oCity.J[letter].push(match[1]);
                }else if (reg7.test(letter)) {
                    if (!CitySelector.oCity.KL[letter]) CitySelector.oCity.KL[letter] = [];
                    CitySelector.oCity.KL[letter].push(match[1]);
                }else if (reg8.test(letter)) {
                    if (!CitySelector.oCity.MNP[letter]) CitySelector.oCity.MNP[letter] = [];
                    CitySelector.oCity.MNP[letter].push(match[1]);
                }else if (reg9.test(letter)) {
                    if (!CitySelector.oCity.QR[letter]) CitySelector.oCity.QR[letter] = [];
                    CitySelector.oCity.QR[letter].push(match[1]);
                }else if (reg10.test(letter)) {
                    if (!CitySelector.oCity.S[letter]) CitySelector.oCity.S[letter] = [];
                    CitySelector.oCity.S[letter].push(match[1]);
                }else if (reg11.test(letter)) {
                    if (!CitySelector.oCity.T[letter]) CitySelector.oCity.T[letter] = [];
                    CitySelector.oCity.T[letter].push(match[1]);
                }else if (reg12.test(letter)) {
                    if (!CitySelector.oCity.W[letter]) CitySelector.oCity.W[letter] = [];
                    CitySelector.oCity.W[letter].push(match[1]);
                }else if (reg13.test(letter)) {
                    if (!CitySelector.oCity.X[letter]) CitySelector.oCity.X[letter] = [];
                    CitySelector.oCity.X[letter].push(match[1]);
                }else if (reg14.test(letter)) {
                    if (!CitySelector.oCity.Y[letter]) CitySelector.oCity.Y[letter] = [];
                    CitySelector.oCity.Y[letter].push(match[1]);
                }else if (reg15.test(letter)) {
                    if (!CitySelector.oCity.Z[letter]) CitySelector.oCity.Z[letter] = [];
                    CitySelector.oCity.Z[letter].push(match[1]);
                }

                /* 热门城市 前16条 */
                if(i<20){
                    if(!CitySelector.oCity.hot['hot']) CitySelector.oCity.hot['hot'] = [];
                    CitySelector.oCity.hot['hot'].push(match[1]);
                }
            }
        }
    };
    CitySelector.creatHotHtml = function () {
        /* 城市HTML模板 */
        CitySelector._template = [
            '<p class="tip">直接输入可搜索'+CitySelector.title+'(支持汉字/拼音)</p>',
            '<ul>',
            '<li class="on">热门'+CitySelector.title+'</li>',
            '<li>AB</li>',
            '<li>CD</li>',
            '<li>EFG</li>',
            '<li>H</li>',
            '<li>J</li>',
            '<li>KL</li>',
            '<li>MNP</li>',
            '<li>QR</li>',
            '<li>S</li>',
            '<li>T</li>',
            '<li>W</li>',
            '<li>X</li>',
            '<li>Y</li>',
            '<li>Z</li>',
            '</ul>'
        ];
    };

    /* 初始化 */
    CitySelector.initialize  = function (options) {
        var input = options.input;
        CitySelector.input = CitySelector._m.$('#'+ input);

        CitySelector.allCity = options.cityData.content;  //页面上显示的数据
        CitySelector.title = options.cityData.title;  //搜索的内容名称
        CitySelector.boxId = options.boxId;  //弹出框id
        CitySelector.callback = options.callback;  //回调函数,选择了内容之后的操作
        CitySelector.creatHotHtml();
        CitySelector.createSearchContent();

        CitySelector.inputEvent();
    };

    /* *
     * @createWarp
     * 创建城市BOX HTML 框架
     * */
    CitySelector.createWarp = function(){
        var inputPos = CitySelector._m.getPos(this.input);
        var div = this.rootDiv = document.createElement('div');
        var that = this;

        // 设置DIV阻止冒泡
        CitySelector._m.on(this.rootDiv,'click',function(event){
            CitySelector._m.stopPropagation(event);
        });

        // 设置点击文档隐藏弹出的城市选择框
        CitySelector._m.on(document, 'click', function (event) {
            event = CitySelector._m.getEvent(event);
            var target = CitySelector._m.getTarget(event);
            if(target == that.input) return false;
            if (that.cityBox)CitySelector._m.addClass('hide', that.cityBox);
            if (that.ul)CitySelector._m.addClass('hide', that.ul);
            if(that.myIframe)CitySelector._m.addClass('hide',that.myIframe);
        });
        div.className = 'citySelector';
        div.style.position = 'absolute';
        div.style.left = that.cityBoxPosition() + 'px';
        div.style.zIndex = 18;
        // div.style.left = inputPos.left + 'px';
        // div.style.top = inputPos.bottom + 5 + 'px';

        // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
        var isIe = (document.all) ? true : false;
        var isIE6 = this.isIE6 = isIe && !window.XMLHttpRequest;
        if(isIE6){
            var myIframe = this.myIframe =  document.createElement('iframe');
            myIframe.frameborder = '0';
            myIframe.src = 'about:blank';
            myIframe.style.position = 'absolute';
            myIframe.style.zIndex = '-1';
            this.rootDiv.appendChild(this.myIframe);
        }

        var childdiv = this.cityBox = document.createElement('div');
        childdiv.className = 'cityBox';
        childdiv.id = CitySelector.boxId;
        childdiv.innerHTML = CitySelector._template.join('');
        var hotCity = this.hotCity =  document.createElement('div');
        hotCity.className = 'hotCity';
        childdiv.appendChild(hotCity);
        div.appendChild(childdiv);
        this.createHotCity();
    };

    /* *
     * @createHotCity
     * TAB下面DIV：hot,a-h,i-p,q-z 分类HTML生成，DOM操作
     * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{},QRSTUVWXYZ:{}}
     **/
    CitySelector.createHotCity = function(){
        var odiv,odl,odt,odd,odda=[],str,key,ckey,sortKey,regEx = CitySelector.regEx,
            oCity = CitySelector.oCity;
        for(key in oCity){
            odiv = this[key] = document.createElement('div');
            // 先设置全部隐藏hide
            odiv.className = key + ' ' + 'cityTab hide';
            sortKey=[];
            for(ckey in oCity[key]){
                sortKey.push(ckey);
                // ckey按照ABCDEDG顺序排序
                sortKey.sort();
            }
            for(var j=0,k = sortKey.length;j<k;j++){
                odl = document.createElement('dl');
                odt = document.createElement('dt');
                odd = document.createElement('dd');
                odt.innerHTML = sortKey[j] == 'hot'?'&nbsp;':sortKey[j];
                odda = [];
                for(var i=0,n=oCity[key][sortKey[j]].length;i<n;i++){
                    str = '<a href="javascript:void(0);">' + oCity[key][sortKey[j]][i] + '</a>';
                    odda.push(str);
                }
                odd.innerHTML = odda.join('');
                odl.appendChild(odt);
                odl.appendChild(odd);
                odiv.appendChild(odl);
            }

            // 移除热门城市的隐藏CSS
            CitySelector._m.removeClass('hide',this.hot);
            this.hotCity.appendChild(odiv);
        }

        //将动态生成的选择框放置在输入框下面
        $("#"+this.input.id).after(this.rootDiv);
        // document.body.appendChild(this.rootDiv);
        /* IE6 */
        this.changeIframe();

        this.tabChange();
        this.linkEvent();
    };

    /* *
     *  tab按字母顺序切换
     *  @ tabChange
     * */
    CitySelector.tabChange = function(){
        var lis = CitySelector._m.$('li',this.cityBox);
        var divs = CitySelector._m.$('div',this.hotCity);
        var that = this;
        for(var i=0,n=lis.length;i<n;i++){
            lis[i].index = i;
            lis[i].onclick = function(){
                for(var j=0;j<n;j++){
                    CitySelector._m.removeClass('on',lis[j]);
                    CitySelector._m.addClass('hide',divs[j]);
                }
                CitySelector._m.addClass('on',this);
                CitySelector._m.removeClass('hide',divs[this.index]);
                /* IE6 改变TAB的时候 改变Iframe 大小*/
                that.changeIframe();
            };
        }
    };

    /* *
     * 城市LINK事件
     *  @linkEvent
     * */
    CitySelector.linkEvent = function(){
        var links = CitySelector._m.$('a',this.hotCity);
        var that = this;
        for(var i=0,n=links.length;i<n;i++){
            links[i].onclick = function(){
                that.input.value = this.innerHTML;

                //外部传递的方法,可以调用自定义的回调函数
                var value = this.innerHTML;
                CitySelector.callback?CitySelector.callback({sect:that.input.value}):undefined;

                CitySelector._m.addClass('hide',that.cityBox);
                /* 点击城市名的时候隐藏myIframe */
                CitySelector._m.addClass('hide',that.myIframe);
            }
        }
    };

    /* *
     * INPUT城市输入框事件
     * @inputEvent
     * */
    CitySelector.inputEvent = function(){
        var that = this;
        CitySelector._m.on(this.input,'click',function(event){
            event = event || window.event;
            if(!that.cityBox){
                that.createWarp();
            }else if(!!that.cityBox && CitySelector._m.hasClass('hide',that.cityBox)){
                // slideul 不存在或者 slideul存在但是是隐藏的时候 两者不能共存
                if(!that.ul || (that.ul && CitySelector._m.hasClass('hide',that.ul))){
                    // 弹出框在输入框点击出现时重新计算位置
                    $('#'+that.input.id).next().css('left',that.cityBoxPosition() + 'px');

                    CitySelector._m.removeClass('hide',that.cityBox);

                    /* IE6 移除iframe 的hide 样式 */
                    //alert('click');
                    CitySelector._m.removeClass('hide',that.myIframe);
                    that.changeIframe();
                }
            }
        });
        // CitySelector._m.on(this.input,'focus',function(){
        //     that.input.select();
        //     if(that.input.value == '城市名') that.input.value = '';
        // });
        CitySelector._m.on(this.input,'blur',function(){
            // if(that.input.value == '') that.input.value = '城市名';

            var value = CitySelector._m.trim(that.input.value);
            if(value != ''){

                var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
                var flag=0;
                for (var i = 0, n = CitySelector.allCity.length; i < n; i++) {
                    if (reg.test(CitySelector.allCity[i])) {
                        flag++;
                    }
                }
                if(flag==0){
                    that.input.value= '';
                }else{
                    var lis = CitySelector._m.$('li',that.ul);
                    if(typeof lis == 'object' && lis['length'] > 0){
                        var li = lis[0];
                        var bs = li.children;
                        if(bs && bs['length'] > 1){
                            that.input.value = bs[0].innerHTML;
                        }
                    }else{
                        that.input.value = '';
                    }
                }
            }

        });
        CitySelector._m.on(this.input,'keyup',function(event){
            event = event || window.event;
            var keycode = event.keyCode;
            CitySelector._m.addClass('hide',that.cityBox);
            that.createUl();

            /* 移除iframe 的hide 样式 */
            CitySelector._m.removeClass('hide',that.myIframe);

            // 下拉菜单显示的时候捕捉按键事件
            if(that.ul && !CitySelector._m.hasClass('hide',that.ul) && !that.isEmpty){
                that.KeyboardEvent(event,keycode);
            }
        });
    };

    /* *
     * 生成下拉选择列表
     * @ createUl
     * */
    CitySelector.createUl = function () {
        var str;
        var value = CitySelector._m.trim(this.input.value);
        // 当value不等于空的时候执行
        if (value !== '') {
            var reg = new RegExp("^" + value + "|\\|" + value, 'i');
            // 此处需设置中文输入法也可用onpropertychange
            var searchResult = [];
            for (var i = 0, n = CitySelector.allCity.length; i < n; i++) {
                if (reg.test(CitySelector.allCity[i])) {
                    var match = CitySelector.regEx.exec(CitySelector.allCity[i]);
                    if (searchResult.length !== 0) {
                        str = '<li><b class="cityname">' + match[1] + '</b></li>';
                    } else {
                        str = '<li class="on"><b class="cityname">' + match[1] + '</b></li>';
                    }
                    searchResult.push(str);
                }
            }
            this.isEmpty = false;
            // 如果搜索数据为空
            if (searchResult.length == 0) {
                this.isEmpty = true;
                str = '<li class="empty">对不起，没有找到 "<em>' + value + '</em>"</li>';
                searchResult.push(str);
            }
            // 如果slideul不存在则添加ul
            if (!this.ul) {
                var ul = this.ul = document.createElement('ul');
                ul.className = 'cityslide mCustomScrollbar';
                this.rootDiv && this.rootDiv.appendChild(ul);
                // 记录按键次数，方向键
                this.count = 0;
            } else if (this.ul && CitySelector._m.hasClass('hide', this.ul)) {
                this.count = 0;
                CitySelector._m.removeClass('hide', this.ul);
            }
            this.ul.innerHTML = searchResult.join('');

            /* IE6 */
            this.changeIframe();

            // 绑定Li事件
            this.liEvent();
        }else{
            CitySelector._m.addClass('hide',this.ul);
            CitySelector._m.removeClass('hide',this.cityBox);
            CitySelector._m.removeClass('hide',this.myIframe);
            this.changeIframe();
        }
    };

    /* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
    CitySelector.changeIframe = function(){
        if(!this.isIE6)return;
        this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
        this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
    };

    /* *
     * 特定键盘事件，上、下、Enter键
     * @ KeyboardEvent
     * */
    CitySelector.KeyboardEvent = function(event,keycode){
        var lis = CitySelector._m.$('li',this.ul);
        var len = lis.length;
        switch(keycode){
            case 40: //向下箭头↓
                this.count++;
                if(this.count > len-1) this.count = 0;
                for(var i=0;i<len;i++){
                    CitySelector._m.removeClass('on',lis[i]);
                }
                CitySelector._m.addClass('on',lis[this.count]);
                break;
            case 38: //向上箭头↑
                this.count--;
                if(this.count<0) this.count = len-1;
                for(i=0;i<len;i++){
                    CitySelector._m.removeClass('on',lis[i]);
                }
                CitySelector._m.addClass('on',lis[this.count]);
                break;
            case 13: // enter键
                //外部传递的方法,可以调用自定义的回调函数
                this.input.value = CitySelector.regExChiese.exec(lis[this.count].innerHTML)[0];
                CitySelector.callback?CitySelector.callback({sect:this.input.value}):undefined;

                CitySelector._m.addClass('hide',this.ul);
                CitySelector._m.addClass('hide',this.ul);
                /* IE6 */
                CitySelector._m.addClass('hide',this.myIframe);
                break;
            default:
                break;
        }
    };

    /* *
     * 下拉列表的li事件
     * @ liEvent
     * */
    CitySelector.liEvent = function(){
        var that = this;
        var lis = CitySelector._m.$('li',this.ul);
        for(var i = 0,n = lis.length;i < n;i++){
            CitySelector._m.on(lis[i],'click',function(event){
                event = CitySelector._m.getEvent(event);
                var target = CitySelector._m.getTarget(event);

                that.input.value = CitySelector.regExChiese.exec(target.innerHTML)[0];
                //外部传递的方法,可以调用自定义的回调函数
                CitySelector.callback?CitySelector.callback({sect:that.input.value}):undefined;

                CitySelector._m.addClass('hide',that.ul);
                /* IE6 下拉菜单点击事件 */
                CitySelector._m.addClass('hide',that.myIframe);
            });
            CitySelector._m.on(lis[i],'mouseover',function(event){
                event = CitySelector._m.getEvent(event);
                var target = CitySelector._m.getTarget(event);
                CitySelector._m.addClass('on',target);
            });
            CitySelector._m.on(lis[i],'mouseout',function(event){
                event = CitySelector._m.getEvent(event);
                var target = CitySelector._m.getTarget(event);
                CitySelector._m.removeClass('on',target);
            })
        }
    };

    /**
     * 热门**弹框位置,右侧超出页面向左移动,不能出滚动条
     */
    CitySelector.cityBoxPosition = function () {
        var that = this,boxWidth = 420;  //目前弹出的选择框的宽度为400
        var leftPosition = $('#'+that.input.id).offset().left,
            screenWidth = $(window).width(),
            rightWidth = screenWidth - leftPosition;

        if(rightWidth > boxWidth){
            return 0;
        }else if(rightWidth < boxWidth && boxWidth < screenWidth){
            return rightWidth-boxWidth;
        }else if(boxWidth < screenWidth){
            return (0-leftPosition);
        }
    };
}