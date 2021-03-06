// 每次调用$.get( ) 或 $.post() 或 $.ajax() 的时候，都会调用
// ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的Ajax请求前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // console.log(options.url)
    // 设置header请求头
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = './login.html'
        }
    }
})