$(function() {
    var layer = layui.layer;
    var form = layui.form;

    getList();

    var indexAdd = null
        // 为添加类别按钮绑定点击事件
    $('#bindAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式，为 form-add 表单绑定 submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('增加分类失败')
                }

                layer.msg('增加分类成功');
                // 关闭弹窗
                layer.close(indexAdd);
                getList()
            }
        })
    })

    var indexEdit = null;
    // 通过代理的形式，为template模板内 btn-edit 绑定事件
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        // console.log(id)
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res)
                form.val('form-edit', res.data)
            }
        })
    })


    // 编辑提交表单 更新数据
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }

                layer.msg('更新成功')
                layer.close(indexEdit);
                getList()
            }
        })
    })

    // 删除按钮 更新数据
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-Id');
        // 弹出确认框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res)
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }

                    layer.msg('删除成功');
                    layer.close(index);
                    getList()
                }
            })


        });
    })

})

function getList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            // console.log(res)
            var htmlstr = template('tpl-table', res);
            $('tbody').html(htmlstr)
        }
    })
}