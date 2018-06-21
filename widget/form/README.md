# 表单控件说明

## 基础表单

### 代码结构

basic.js    对外提供的directive
test        测试相关的代码
--basic.json    测试使用的数据
--basic.html    测试使用样例的页面
--basic.js      测试使用的js代码，为directive提供数据

### 表单控制
#### 使用方式
    需要注入inputs数据即可，
    <input-template inputs="inputs"></input-template>

### 单值输入

#### 使用方式
    需要注入inputs数据即可，无其他动作
    <input-text input="inputs"></input-text>

#### 输入数据
    {
        "label":"上报医院",
        "value":"某医院",
        "name":"reportHospital",
        "type":"小文本输入",  //该type指定了input的种类
        "changed":true,    //是否改变，对比功能中需要标明
        "notNull":true,    //是否必选，未必选字段的话需要标明
        "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
    }

#### 输出
    一个表单，如果是有默认值的情况下则无法更改数据，其他可以自由更改数据    




### 单值输入-数值

#### 使用方式
    需要注入input数据即可，无其他动作
    <input-number input="inputs"></input-number>

#### 输入数据
    {
        "label":"年龄",
        "value":"18",
        "name":"year",
        "type":"小文本输入-数值",  //该type指定了input的种类
        "changed":false,    //是否改变，对比功能中需要标明
        "notNull":true,    //是否必选，未必选字段的话需要标明
        "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
    }

#### 输出
    一个表单，如果是有默认值的情况下则无法更改数据，其他可以自由更改数据，此表单只允许填写数值，使用checkNum filter进行过滤

### 时间

#### 使用方式
    需要注入input数据即可，无其他动作
    <input-date input="inputs"></input-date>

#### 输入数据
    {
        "label":"出生日期",
        "value":"",
        "name":"year",
        "type":"时间-年月日",  //该type指定了input的种类
        "changed":true,    //是否改变，对比功能中需要标明
        "notNull":false,    //是否必选，未必选字段的话需要标明
        "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
        "format":"yyyy-mm-dd"   //这个属性限制了控件的格式
    }

#### 输出
    一个表单，点击表单会弹出bootstrap的弹出框，选择对应的时间即可




### 单选

#### 使用方式
    需要注入input数据即可，无其他动作
    <input-radio input="inputs"></input-radio>

#### 输入数据
    {
        "label":"性别",
        "value":"",
        "name":"sex",
        "type":"单选",  //该type指定了input的种类
        "changed":false,    //是否改变，对比功能中需要标明
        "notNull":false,    //是否必选，未必选字段的话需要标明
        "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
        "dimension":{    //直属的radio们放在dimension中
            options:[
                {
                    "label":"男",
                    "value":"男"
                },
                {
                    "label":"女",
                    "value":"女"
                },
                {
                    "label":"其他",
                    "value":"其他"
                }
            ]
        }，
        "children": [
            {
                "label":"其他性别",
                "value":"",
                "name":"sex",
                "type":"小文本输入",  //该type指定了input的种类
                "changed":false,    //是否改变，对比功能中需要标明
                "notNull":false,    //是否必选，未必选字段的话需要标明
                "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
                "parent":"其他"  //parent指明了在扩充输入中这个表单隶属于那个radio
            }
        ]
    }

#### 输出
    一个单选组。具备控制功能
    控制功能：如果选中的input与children的数据想匹配则将children中的数据拼接在该表单的后面以显示，取消选择则删除添加的数据




### 单选+扩充输入

#### 使用方式
    需要注入input数据即可，无其他动作
    <input-radio input="inputs"></input-radio>

#### 输入数据
    {
        "label":"性别",
        "value":"",
        "name":"sex",
        "type":"单选",  //该type指定了input的种类
        "changed":false,    //是否改变，对比功能中需要标明
        "notNull":false,    //是否必选，未必选字段的话需要标明
        "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
        "dimension":{    //直属的radio们放在dimension中
            options:[
                {
                    "label":"男",
                    "value":"男"
                },
                {
                    "label":"女",
                    "value":"女"
                },
                {
                    "label":"其他",
                    "value":"其他"
                }
            ]
        }，
        "children": [
            {
                "label":"其他性别",
                "value":"",
                "name":"sex",
                "type":"小文本输入",  //该type指定了input的种类
                "changed":false,    //是否改变，对比功能中需要标明
                "notNull":false,    //是否必选，未必选字段的话需要标明
                "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
                "parent":"其他"  //parent指明了在扩充输入中这个表单隶属于那个radio
            }
        ]
    }

#### 输出
    一个单选组，会有扩充输入或者控制功能
    扩充输入：点击其他会根据用户的输入在原有dimension中拼接自定义的数据，并默认选中新加的表单
    控制功能：如果选中的input与children的数据想匹配则将children中的数据拼接在该表单的后面以显示，取消选择则删除添加的数据




### 多选

#### 使用方式
    需要注入input数据即可，无其他动作
    <input-checkbox input="inputs"></input-checkbox>

#### 输入数据
    {
        "label":"情感",
        "value":"",
        "name":"mind",
        "type":"多选",  //该type指定了input的种类
        "changed":false,    //是否改变，对比功能中需要标明
        "notNull":false,    //是否必选，未必选字段的话需要标明
        "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
        "dimension":{    //直属的radio们放在dimension中
            options:[
                {
                    "label":"情感高涨",
                    "value":"情感高涨"
                },
                {
                    "label":"情感脆弱",
                    "value":"情感脆弱"
                },
                {
                    "label":"情感麻木",
                    "value":"情感麻木"
                },
                {
                    "label":"其他",
                    "value":"其他"
                }
            ]
        }，
        "children": [
            {
                "label":"其他情感",
                "value":"",
                "name":"mind",
                "type":"小文本输入",  //该type指定了input的种类
                "changed":false,    //是否改变，对比功能中需要标明
                "notNull":false,    //是否必选，未必选字段的话需要标明
                "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
                "parent":"其他"  //parent指明了在扩充输入中这个表单隶属于那个radio
            }
        ]
    }

#### 输出
    一个多选组，控制功能
    控制功能：如果选中的input与children的数据想匹配则将children中的数据拼接在该表单的后面以显示，取消选择则删除添加的数据




### 多选+扩充输入

#### 使用方式
    需要注入input数据即可，无其他动作
    <input-checkbox input="inputs"></input-checkbox>

#### 输入数据
    {
        "label":"情感",
        "value":"",
        "name":"mind",
        "type":"多选",  //该type指定了input的种类
        "changed":false,    //是否改变，对比功能中需要标明
        "notNull":false,    //是否必选，未必选字段的话需要标明
        "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
        "dimension":{    //直属的radio们放在dimension中
            options:[
                {
                    "label":"情感高涨",
                    "value":"情感高涨"
                },
                {
                    "label":"情感脆弱",
                    "value":"情感脆弱"
                },
                {
                    "label":"情感麻木",
                    "value":"情感麻木"
                },
                {
                    "label":"其他",
                    "value":"其他"
                }
            ]
        }，
        "children": [
            {
                "label":"其他情感",
                "value":"",
                "name":"mind",
                "type":"小文本输入",  //该type指定了input的种类
                "changed":false,    //是否改变，对比功能中需要标明
                "notNull":false,    //是否必选，未必选字段的话需要标明
                "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
                "parent":"其他"  //parent指明了在扩充输入中这个表单隶属于那个radio
            }
        ]
    }

#### 输出
    一个单选组，会有扩充输入或者控制功能
    扩充输入：点击其他会根据用户的输入在原有dimension中拼接自定义的数据，并默认选中新加的表单
    控制功能：如果选中的input与children的数据想匹配则将children中的数据拼接在该表单的后面以显示，取消选择则删除添加的数据



### 大文本输入

#### 使用方式
    需要注入inputs数据即可，无其他动作
    <input-textarea input="inputs"></input-textarea>

#### 输入数据
    {
        "label":"精神情况",
        "value":"",
        "name":"mindState",
        "type":"大文本输入",  //该type指定了input的种类
        "changed":false,    //是否改变，对比功能中需要标明
        "notNull":true,    //是否必选，未必选字段的话需要标明
        "unit":"",      //非空的话则显示unit的内容作为单位拼接在表单后面
    }

#### 输出
    一个表单，可以输入大量文字，其他可以自由更改数据    



### 图片上传

#### 使用方式
    需要注入input数据即可，无其他动作
    <input-img-file-template input="inputs"></input-img-file-template>

    图片上传进度模态框以及图片详情查看模态框
    <div img-modal></div>
    <div img-load datas="datas" stopload="stopload" upls="upls"></div>

#### 输入数据
    {
            "id": null,
            "name": "picIds",
            "bizName": "医学影像",
            "label": "医学影像",
            "type": "图片上传-多张",
            "parent": "附件上传",
            "group": null,
            "order": 77,
            "description": "每幅图dpi≮300",
            "filterTag": null,
            "exportTag": null,
            "hasNecessary": false,
            "unit": null,
            "width": null,
            "notNull": false,
            "value": null,            //value字段会存储代表图片id的字符串
            "changed": false,
            "fileType": "PICTURES",
            "suffix": [
                "jpg"
            ],
            "remote":true,
            "limitMaxBytes": 20480,
            "limitMaxSize": null,
            "fileTypeStr": "PICTURES",
            "children": [
                
            ]
        }

#### 输出
    1.图片可以多个上传以及单个上传，上传之后获取图片信息的数组，该数组会进行转换成id的字符串存储到value字段中，
    2.点击图片缩略图会进入图片详情查看页面，图片详情查看页面可以进行图片旋转放大缩小以及切换，以及dicom信息展示功能




### 文件上传

#### 使用方式
    需要注入input数据即可，无其他动作
    <input-file-template input="inputs"></input-file-template>

    图片上传进度模态框
    <div img-load datas="datas" stopload="stopload" upls="upls"></div>

#### 输入数据
    {
        "id": null,
        "name": "fileIds",
        "bizName": "上传其他附件",
        "label": "上传其他附件",
        "type": "文件上传",
        "parent": "附件上传",
        "group": null,
        "order": 78,
        "description": null,
        "filterTag": null,
        "exportTag": null,
        "hasNecessary": false,
        "unit": null,
        "width": null,
        "notNull": false,
        "value": null,
        "changed": false,
        "fileType": "FILE",
        "suffix": [
            "txt",
            "doc",
            "docx",
            "xls",
            "xlsx"
        ],
        "remote":true,
        "limitMaxBytes": 20480,
        "limitMaxSize": null,
        "fileTypeStr": "FILE",
        "children": [
            
        ]
    }

#### 输出
    1.文件可以多个上传以及单个上传，上传之后获取图片信息的数组，该数组会进行转换成id的字符串存储到value字段中，
    2.点击上传提示可以进行下载