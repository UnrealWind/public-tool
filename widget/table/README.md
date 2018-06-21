#table模块开发

*table控件页面：table.html
*directive名称：infiTable
*引用directive需要传两个参数（1）columns表格标题（2）content表格内容
传过来的content需要在directive中做格式转换，将mapping格式转换成json格式


##columns格式
、、、js
[
    {
        "label":"",//标题中文名
        "name":""//标题name值
    },{
        "label":"",//标题中文名
        "name":""//标题name值
    }
]
、、、

##content格式
、、、js
{
    "page":{
        "content":[
            {
                "id": "",
                "patientId": "",
                "visitId": ""
            },{
                "id": "",
                "patientId": "",
                "visitId": ""
            }
        ],
        "sort": [
            {
            }
        ],
        "totalPages": "",
        "firstPage": "",
        "lastPage": "",
        "numberOfElements": "",
        "totalElements": "",
        "size": "",
        "number": ""
    }
}
、、、

