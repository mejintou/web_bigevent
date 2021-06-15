$(function() {
    //获取文章列表编辑传过来的Id值
    getData1()
        // var editID = $.Request('name');
        // console.log('editid', editID)
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件
    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length == 0) {
            return
        }
        // 根据文件创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';

    $('#btnSaveCaogao').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 基于 form 表单 快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态存到fd数组中
        fd.append('state', art_state);
        fd.forEach((item, key) => {
            console.log(key, item)
        })
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
            })
            // 上传服务器
        publishArticle(fd)
    })

    // 获取文章分类信息
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }

                var htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr);
                form.render()
            }
        })
    }

    // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是FormData 格式的数据，
            // 必须添加一下的两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功');
                // 发布成功后，跳转页面
                location.href = '/article/art_list.html'
            }
        })
    }


    function getData1() {
        const id = $.Request('name');
        console.log(typeof(id))
        if (id == 'null') {
            return
        }
        $.ajax({
            method: 'get',
            url: '/my/article/' + id,
            success: function(res) {
                console.log(res)
            }
        })
    }
})