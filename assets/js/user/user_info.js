$(function() {
    var form = layui.form;
    var layer = layui.layer;
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // console.log('用户信息', userInfo)

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    form.val('formUserInfo', userInfo);

    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        form.val('formUserInfo', userInfo);
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();

        let val = $(this).serializeArray();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }

                layer.msg('更新用户信息成功');
                // 调用父页中的方法，重新渲染用户头像和信息
                // window.parent.getUserInfo();
                val.forEach((item) => {
                        if (item.name == 'nickname') {
                            userInfo.nickname = item.value
                        } else if (item.name == 'email') {
                            userInfo.email = item.value
                        }
                    })
                    // console.log(userInfo)
                    // localStorage.setItem('userInfo', JSON.stringify(userInfo));
                window.parent.renderAvatar(userInfo)
            }
        })
    })
})