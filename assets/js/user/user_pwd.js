$(function() {
    var form = layui.form;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {

            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样！'
            }
        },
        rePwd: function(value) {
            // console.log($('[name=newPwd]').val())
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                layui.layer.msg('重置密码成功');

                // 将jquery对象转为 原生document对象，调用表单重置reset()
                $('.layui-form')[0].reset()
            }
        })
    })

})