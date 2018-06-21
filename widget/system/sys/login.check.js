/**
 * Created by geqimeng on 17-11-23.
 */
//页面初始化时校验是否登录
function checkLogin() {
    //session中的user有时为null,有时为undefined
    if(!window.localStorage.getItem('user')||window.localStorage.getItem('user') == "undefined"){
        goToLogin();
    }
}
//跳转到用户系统登录页面
function goToLogin() {
    var path = 'http://'+window.location.hostname+':'+window.location.port;
    window.location.href = path + '/' + 'system-management/#/login';
}
checkLogin();
