// Getparam.js
(function($) {
    $.extend({
        //1、取值使用    $.Request("name")
        Request: function(name) {
            var sValue = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]*)(\&?)", "i"));
            //decodeURIComponent解码
            return sValue ? decodeURIComponent(sValue[1]) : decodeURIComponent(sValue);

        },
        //2、给url加参数    $.UrlUpdateParams(url, "add", 11111);
        UrlUpdateParams: function(url, name, value) {
            var r = url;
            if (r != null && r != 'undefined' && r != "") {
                value = encodeURIComponent(value);
                var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
                var tmp = name + "=" + value;
                if (url.match(reg) != null) {
                    r = url.replace(eval(reg), tmp);
                } else {
                    if (url.match("[\?]")) {
                        r = url + "&" + tmp;
                    } else {
                        r = url + "?" + tmp;
                    }
                }
            }
            return r;
        }


    });
})(jQuery);
// ————————————————
// 版权声明： 本文为CSDN博主「 面壁思过程」 的原创文章， 遵循CC 4.0 BY - SA版权协议， 转载请附上原文出处链接及本声明。
// 原文链接： https: //blog.csdn.net/Candy_mi/article/details/81040495