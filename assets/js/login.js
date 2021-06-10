const url = 'http://api-breakingnews-web.itheima.net'; //接口地址

$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show()
    });

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide()
    });

    // 自定义Layui校验规则
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repsd: function(value) {
            // console.log(value)
            let psd = $('.reg-box [name=password]').val();
            // console.log(psd)
            if (psd !== value) {
                return '两次密码不一致'
            }
        }
    });

    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post(url + '/api/reguser', data).then(res => {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录');
            // 模拟人的点击事件
            $('#link_login').click();
        })

    })

    $('#form_login').submit(function(e) {
        e.preventDefault();
        axios({
            method: 'POST',
            url: url + '/api/login',
            data: $(this).serialize()
        }).then(res => {
            console.log(res)
            if (res.data.status !== 0) {
                return layer.msg('登录失败')
            }
            layer.msg('登录成功');
            // 将token保存到本地 localStorage
            localStorage.setItem('token', res.data.token);
            // 跳转后台主页
            location.href = './index.html'
        })
    })
})