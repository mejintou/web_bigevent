const url = 'http://api-breakingnews-web.itheima.net'; //接口地址
const layer = layui.layer
$(function() {
    getUserInfo();

    // 退出登录
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token');
            location.href = './login.html';

            layer.close(index);
        });
    })
})




// 向服务器端获取用户登录信息
function getUserInfo() {
    // axios({
    //     method: 'get',
    //     url: url + '/my/userinfo',
    //     headers: {
    //         Authorization: localStorage.getItem('token') || ''
    //     }
    // }).then(res => {
    //     console.log(res);
    //     if (res.data.status !== 0) {
    //         return layer.msg(res.data.message)
    //     }
    //     // res.data.data.user_pic = './assets/images/sample2.jpg';
    //     renderAvatar(res.data.data);
    // })
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function(res) {
            // console.log(res)
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // res.data.data.user_pic = './assets/images/sample2.jpg';
            renderAvatar(res.data);
        },

        //不论成功或失败，最终都会调用complete 回调函数
        // complete: function(res) {
        //     // console.log(res)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = './login.html'
        //     }
        // }

    })


}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    if (user.user_pic == null) {
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    } else {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    }

}