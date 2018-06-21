function FormLogic(tags,groups,$target) {
    initPage();
    //gqm_debug 利用angular的api没办法获得所需要的数据
    //gqm_debug 原先的sass文件已经不能满足现在的需求，我能直接改原先的sass吗？改了的话src的html就不能用了
    function initPage() {
        $.ajax({
            url: 'logic-configure.json',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var targetHtmls = ""
                for (var idx = 0; idx < data.data.length; idx++) {
                    targetHtmls += setOpetion(data.data[idx]);
                }
                $target.html(targetHtmls);
            }
        })
    }

    /**
     * 设置一个容器内容的html拼写
     * @param optionData
     * @returns {string}
     */
    function setOpetion(optionData) {
        var targetHtml = "";
        //判断是否是logic
        if (optionData.logic) {
            //是logic则增加与或按钮
            targetHtml += setLogicBtn(optionData);
        } else {
            //不是logic则增加具体内容 getLogicContainer()
            targetHtml += '<div class="infi-screen-details node-parent" ondragover="allowDrop(event)" ondrop="drop(event)">' +
                '<div class="infi-section-title">' +
                '<button class="btn infi-btn-linear-green-l btn-sm add-group">添加组</button>' +
                '</div>';
            for (var idx = 0; idx < optionData.length; idx++) {
                if (optionData[idx].logic) {
                    targetHtml += setLogicBtn(optionData[idx]);
                } else if (optionData[idx].length) {
                    //数据为数组，则生成新的section
                    targetHtml += setOpetion(optionData[idx]);
                } else {
                    //数据为对象，直接生成内容
                    targetHtml += getLogicDetail(optionData[idx]);
                }
            }
            targetHtml += '</div>';
        }
        return targetHtml;
    }

    /**
     * 标识逻辑关系与或
     * @param optionData
     * @returns {string}
     */
    function setLogicBtn(optionData) {
        var isEqual = {
            "and": "",
            "or": ""
        };
        //标识与或按钮哪个是选中状态
        if (optionData.logic == "and") {
            isEqual.and = "active";
        } else {
            isEqual.or = "active";
        }
        return getLogicBtnHtml(isEqual);
    }

    function drag(e) {
        e.dataTransfer.setData("Text", e.target.id);
        e.dataTransfer.effectAllowed = 'copy';
    }

//拖拽成功，释放鼠标时触发
    function drop(e) {
        e.preventDefault();   //阻止默认行为
        e.stopPropagation();  //阻止冒泡
        var sourceElem = $('#' + e.dataTransfer.getData("Text")),   //被拖动的元素
            targetElem = e.target || e.srcElement;   //放置的目标元素
        while (targetElem) {
            // 这里使用的angular的API，获取到待拖动元素的原始数据
            var scope = $('.infi-box').scope(),
                recordData = groups;
            //用于盛放拖动元素的标识以及拖动元素对应的数据
            var sourceData = {
                label: "",
                value: "",
                isEqual: "",
                values: []
            }

            //判断拖动的元素是姓名、年龄等；还男、女、冠心病等
            for (var idx = 0; idx < recordData.length; idx++) {
                sourceData.label = recordData[idx].label;
                sourceData.value = recordData[idx].value;
                //拖动的是姓名类型的
                if (recordData[idx].value == sourceElem.attr("id")) {
                    sourceData.values = recordData[idx].values;
                    break;
                } else {
                    //拖动的是男、女类型的
                    for (var idy = 0; idy < recordData[idx].values.length; idy++) {
                        if (recordData[idx].values[idy].value == sourceElem.attr("id")) {
                            sourceData.values.push(recordData[idx].values[idy]);
                            break;
                        }
                    }
                }
            }

            //此节点有名为'node-parent'的class为元素的上一级
            if ($(targetElem).hasClass('node-parent')) {
                var childHtml = '';
                //容器为最外层容器
                if ($(targetElem).parents(".node-parent").length == 0) {
                    if ($(targetElem).children().length > 0) {
                        //容器中有子节点，在生成section前面加上与或按钮
                        childHtml += getLogicBtnHtml({and: "", or: "active"});
                    }
                    childHtml += getLogicContainer($(targetElem)) + getLogicDetail(sourceData) + '</div>';
                    $(targetElem).append(childHtml);

                } else {
                    //将拖拽的内容直接放入容器中
                    if ($(targetElem).children().length > 1) {
                        //容器中有子节点，在生成section前面加上与或按钮
                        childHtml += getLogicBtnHtml({and: "", or: "active"});
                    }
                    childHtml += getLogicDetail(sourceData);
                    $(targetElem).append(childHtml);
                }

                //找到父级元素就停止向上找
                return;
            }
            targetElem = targetElem.parentNode;
        }
    }

    function allowDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }

    /**
     * 返回逻辑按钮的html
     * @returns {string}
     */
    function getLogicBtnHtml(isEqual) {
        return '<div class="infi-logic-btn">' +
            '<button class="btn infi-btn-linear-default ' + isEqual.and + '">与</button>' +
            '<button class="btn infi-btn-linear-default ' + isEqual.or + '">或</button>' +
            '</div>'
    }

    /**
     * 返回显示详情的html
     * @param sourceData
     * @returns {string}
     */
    function getLogicDetail(sourceData) {
        // gqm_debug 这里设置的option被选中写的比较笨，有没有更好的办法
        var childHtml = "",
            ischeck = {
                yes: "",
                no: ""
            };
        if (sourceData.isEqual == "yes") {
            ischeck.yes = "selected";
        } else if (sourceData.isEqual == "no") {
            ischeck.no = "selected";
        }
        childHtml += '<div id="' + sourceData.value + '" class="infi-logic-detail">' +
            '<span class="infi-logic-detail-label">' + sourceData.label + '</span>:<span class="glyphicon glyphicon-minus-sign"></span>' +
            '<select class="form-control infi-input-w-xsx infi-logic-detail-equal" value="' + sourceData.isEqual + '">' +
            '<option value="yes" ' + ischeck.yes + '>等于</option>' +
            '<option value="no" ' + ischeck.no + '>不等于</option>' +
            '</select>';
        for (var idx = 0; idx < sourceData.values.length; idx++) {
            childHtml += '<span class="infi-logic-detail-value" id="' + sourceData.values[idx].value + '">' + sourceData.values[idx].label + '</span>&nbsp&nbsp'
        }
        childHtml += "</div>"
        return childHtml;
    }

    /**
     * 返回逻辑容器的html
     * @returns {string}
     */
    function getLogicContainer(parentEle) {
        // var width = parentEle.width() - 100;
        return '<div class="infi-screen-details node-parent" style="width:' + width + 'px" ondragover="allowDrop(event)" ondrop="drop(event)">' +
            '<div class="infi-section-title">' +
            '<button class="btn infi-btn-linear-green-l btn-sm add-group">添加组</button>' +
            '</div>';
    }

    /**
     * 添加组按钮的点击
     */
    $(".dir-nav-container").on('click', '.add-group', function () {
        var target = $(this).closest(".node-parent"), //找到外层指定父容器即section，在section里面再加入section
            childHtml = "";
        childHtml += '';
        //要加入的容器中存在一个以上的子节点，要给新加入的节点加上与或按钮
        if (target.children().length > 1) {
            childHtml += getLogicBtnHtml({and: "", or: "active"});
        }
        childHtml += getLogicContainer(target) + "</div>";
        target.append(childHtml);
    })

    /**
     * 删除按钮的操作
     */
    $(".dir-nav-container").on('click', '.glyphicon-minus-sign', function () {
        var elem = $(this),
            elemParent = elem.closest('.infi-logic-detail'),  //找到删除信息的详情容器
            target = elem.closest('.node-parent'); //找到盛放详情的容器
        //容器中只有一个可删除的节点，删除此节点时将section删除
        if (target.children().length == 2) {
            //当删除的section是第一个子节点,并且后面有其他节点，将下一个节点的与或按钮删除 && target.prev('.infi-section-title').length > 0
            if (target.next().length > 0) {
                target.next().remove();
            } else if (target.prev('.infi-section-title').length == 0) {
                //当删除的section不是第一个子节点,将上一个节点的与或按钮删除
                target.prev().remove();
            }
            target.remove();
        } else if (target.children().length > 2 && elemParent.prev('.infi-section-title').length == 0) {
            //删除的是详情的中间的节点
            elemParent.prev().remove();
            elemParent.remove();
        } else if (target.children().length > 2 && elemParent.prev('.infi-section-title').length > 0) {
            //删除的是详情的第一个节点并且此节点后面有其他节点，将下一个节点的与或按钮删除
            elemParent.next().remove();
            elemParent.remove();
        }
    })

    function checkGroups($target) {
        var $parent = $target.parent();
        if (getOptionSize($target) == 0) {
            //remove

            if ($target.prev()) {
                $target.prev().remove();
            }
            $target.remove();
            if ($parent) {
                checkGroups($parent);
            }
        }
    }

    function getOptionSize($target) {
        return $target.children('.options,.group').length;
    }

    //function

    /**
     *与或按钮点击
     */
    $(".node-outside").on('click', '.infi-logic-btn .btn', function () {
        $(this).addClass('active').siblings().removeClass('active');
    })

    /**
     * 筛选条件收藏按钮点击
     */
    $('#collectLogic').click(function () {
        var outContainer = $(".node-outside"),
            elem = outContainer.children(),
            filterData = [];
        elem.each(function () {
            getSectionData($(this), filterData);
        })
        console.log(filterData, 7)
    })

    /**
     * 得到一个section中的数据
     * @param ele
     * @param data
     */
    function getSectionData(ele, data) {
        //为与或容器，将选择的数据放入数组中
        if (ele.hasClass('infi-logic-btn')) {
            data.push(getLogicBtnData(ele));
        } else if (ele.hasClass('node-parent')) {
            var logicData = [];
            ele.children().each(function () {
                if ($(this).hasClass('infi-logic-btn')) {
                    logicData.push(getLogicBtnData($(this)));
                } else if ($(this).hasClass('infi-logic-detail')) {
                    logicData.push(getLogicDetailData($(this)));
                } else if ($(this).hasClass('node-parent')) {
                    getSectionData($(this), logicData);
                }
            })
            data.push(logicData);
        }
    }

    /**
     * 得到显示详情中的数据
     * @param ele
     * @returns {{value: *, values: Array}}
     */
    function getLogicDetailData(ele) {
        var logicDetailData = {
            value: ele.attr("id"),
            values: []
        };
        ele.children().each(function () {
            if ($(this).hasClass('infi-logic-detail-label')) {
                logicDetailData.label = $(this).text();
            } else if ($(this).hasClass('infi-logic-detail-equal')) {
                logicDetailData.isEqual = $(this).val();
            } else if ($(this).hasClass('infi-logic-detail-value')) {
                logicDetailData.values.push({
                    label: $(this).text(),
                    value: $(this).attr("id")
                })
            }
        })
        return logicDetailData;
    }

    /**
     * 获取页面中与或按钮的选中值
     * @param ele class=“infi-logic-btn”的div
     * @returns {{}}
     */
    function getLogicBtnData(ele) {
        var logicData = {};
        ele.children().each(function () {
            if ($(this).hasClass('active') && $(this).text() == "与") {
                logicData.logic = "and";
            } else if ($(this).hasClass('active') && $(this).text() == "或") {
                logicData.logic = "or";
            }
        })
        return logicData;
    }
}
