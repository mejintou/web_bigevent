$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义template模板 美化时间样式的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear(),
            m = padZero(dt.getMonth() + 1),
            d = padZero(dt.getDate()),
            hh = padZero(dt.getHours()),
            mm = padZero(dt.getMinutes()),
            ss = padZero(dt.getSeconds())

        function padZero(n) {
            return n > 9 ? n : '0' + n
        }

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    //向服务器发送请的 数据
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }

    initTable();
    initCate();


    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log('获取文章列表', res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败')
                }
                res.data = [{
                        "Id": 1,
                        "title": "abab",
                        "pub_date": "2020-01-03 12:19:57.690",
                        "state": "已发布",
                        "cate_name": "最新"
                    },
                    {
                        "Id": 2,
                        "title": "666",
                        "pub_date": "2020-01-03 12:20:19.817",
                        "state": "已发布",
                        "cate_name": "股市"
                    }
                ];

                res.total = 7;
                var htmlstr = template('tap-table', res);
                $('tbody').html(htmlstr);
                // 渲染分页
                renderPage(res.total);
            }
        })
    }


    //获取筛选分类目录
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文分类表数据失败')
                }

                var htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr);
                // 重新渲染页面
                form.render()
            }
        })
    }


    //绑定筛选sbumit事件 获取筛选后文章列表
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 赋值给 q 查询对象
        q.cate_id = cate_id;
        q.state = state;
        console.log(q)
            // 根据最新的筛选条件 重新获取数据
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            limits: [2, 3, 5, 10],
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr)
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            }
        })

    }

    // 通过代理的形式 ，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取当前页面的删除按钮的个数
        var len = $('.btn-delete').length
            // 获取到文章的id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('is not?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值 -1 之后再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果len 的值等于1 ，证明删除完毕之后，页码上就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })


    // 通过代理的形式 ，为编辑按钮绑定点击事件
    $('tbody').on('click', ".btn-edit", function() {
        var id = $(this).attr('data-id')
            // 页面传参
        window.location.href = '/article/art_pub.html?name=' + id
    })
})