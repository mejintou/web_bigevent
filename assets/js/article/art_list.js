$(function() {
    var layer = layui.layer;
    var form = layui.form;

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
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败')
                }
                // res.data = [{
                //         "Id": 1,
                //         "title": "abab",
                //         "pub_date": "2020-01-03 12:19:57.690",
                //         "state": "已发布",
                //         "cate_name": "最新"
                //     },
                //     {
                //         "Id": 2,
                //         "title": "666",
                //         "pub_date": "2020-01-03 12:20:19.817",
                //         "state": "已发布",
                //         "cate_name": "股市"
                //     }
                // ];
                var htmlstr = template('tap-table', res);
                $('tbody').html(htmlstr);

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

})