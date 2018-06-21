# 控件开发说明

## 控件分类

* choser 选择控件
* choserinfo 选择结果显示控件
* stepviewer 进度步奏控件
* table 表格控件
* extractinfo 查看提取属性控件
* layout 布局控件
* nav 导航控件
* form 基础表单控件

### choser 选择控件

选择控件,需要包含显示全部,分类选择,关键词过滤,数值区间,前置条件,关联属性,
时间插件,关联属性中的个性化属性,关联属性中的检查参数以及检查症状等特性.


```js
var choser = {
  label: '',  // 标签中文名
  value: '',  // 标签id
  options: [  // 默认显示的标签
    {label: '',value: ''},
    {label: '',value: ''}
  ],
  more: '', // 如果是string存维表ID,如果是数组说明已经加载好对应的全部标签值
  tabs: [   // 分类选择
    {
      label: '',  // 分类中文名
      value: '',  // 分类id
      options: [  // 分类下具体的选项
        {label: '',value: ''},
        {label: '',value: ''}
      ]
    }
  ],
  filter: '', //维表ID
  range: [],  // 维表
  userRange: [],
  unit: '',   // 单位
  time:'',    // 时间控件
  type: '',
  context: [
    {label: '',value: '',type: '',options: []},
    {label: '',value: ''}
  ],
  relation: []    // choser
  parameter:[]    //检查参数
  symptom:[]      //检查症状
  individuation:[] //个性化属性
}
```


options,more,tabs.options,range,context,relations可以设置维表ID或者维表内


### logic 与或逻辑控件

```
var logic = [
    {element},
    { or and },
    {element},
    [
        {element},
        {or and},

    ]
]

```

element :
{
   label: ,value: ,choesd:  
    }

logic: 
{logic: or/and }
