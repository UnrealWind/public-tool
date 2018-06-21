angular.module('infi-basic')
    .directive('dwvView',['SYS',function (SYS) {
        return{  
            restrict:'A',
            templateUrl:'../src/widget/dwv-view/viewers/static/index.html',
            link:function (scope) {
                var watchModel;
                //模态框显示时进行的操作
                $("#imgModal").on('shown.bs.modal',function(){
                    //给watch函数赋值方便watch关闭,并且首次执行图形的调用与绘制
                    watchModel = scope.$watch("imgId",function(newValue, oldValue){
                        initDraw();
                    });
                    //模态框显示时不会绑定watch方法,所以要在模态框显示时调用一次
                    initDraw();
                })

                //模态框关闭时将watch函数关闭
                $("#imgModal").on('hidden.bs.modal',function(){
                    //关闭watch方法
                    watchModel();
                    //关闭弹框时隐藏图形
                    $("#dwv").css("visibility","hidden");
                })

                function initDraw() {
                    function startApp() {
                        dwv.watermark = "北京无极慧通科技公司";  //设置水印的名称,以后需要后台传递
                        dwv.gui.setup();
                        dwv.gui.getElement = dwv.gui.base.getElement;
                        dwv.gui.displayProgress = function (percent) {
                        };
                        var app = new dwv.App();

                        app.init({
                            "containerDivId": "dwv",
                            "fitToWindow": true,
                            "tools": ["ZoomAndPan"]
                        });
                        app.loadURLs([scope.url+'dicom/'+scope.imgId+'?'+SYS.imgBack]);
                    }

                    if(scope.imgId && scope.tagImgData){
                        //当图形绘制完成后再显示,未完成时显示提示文字
                        $("#dwv").css("visibility","hidden");
                        $("#loadTip").text("加载中...");
                        
                        // Image decoders (for web workers)
                        dwv.image.decoderScripts = {
                            "jpeg2000": "../../decoders/pdfjs/decode-jpeg2000.js",
                            "jpeg-lossless": "../../decoders/rii-mango/decode-jpegloss.js",
                            "jpeg-baseline": "../../decoders/pdfjs/decode-jpegbaseline.js"
                        };

                        // check browser support
                        dwv.browser.check();
                        // initialise i18n
                        dwv.i18nInitialise();

                        // status flags
                        var domContentLoaded = true;   //*为true时才可以绘图
                        var i18nLoaded = false;  //国际化,检测用户使用语言
                        // launch when both DOM and i18n are ready
                        function launchApp() {
                            if ( domContentLoaded && i18nLoaded ) {
                                startApp();
                            }
                        }

                        // i18n ready?
                        dwv.i18nOnLoaded( function () {
                            // call next once the overlays are loaded
                            var onLoaded = function (data) {
                                dwv.gui.info.overlayMaps = data;
                                i18nLoaded = true;
                                launchApp();
                                //i18n.js中dwv.i18nOnLoaded方法会绑定多次load方法,所以运行完毕后解绑,否则会调用好多次获取数据
                                dwv.i18nOffLoaded();
                            };
                            // load overlay map info
                            $.getJSON( dwv.i18nGetLocalePath("overlays.json"), onLoaded )
                                .fail( function () {
                                    console.log("Using fallback overlays.");
                                    $.getJSON( dwv.i18nGetFallbackLocalePath("overlays.json"), onLoaded );
                                });
                        });
                    }else{
                        //传递的不是dicom文件
                        $("#dwv").css("visibility","hidden");
                        $("#loadTip").text("");
                    }
                }
            }
        }
    }]);
