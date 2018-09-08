layui.define(function (exports) {
    exports('conf', {
        //容器ID
        container: 'app',
        //容器内容ID
        containerBody: 'app-body',
        //版本号
        v:layui.cache.version,
        //记录layuiAdmin文件夹所在路径
        base: layui.cache.base,
        css: layui.cache.base + "css/",
        //视图所在目录
        views: layui.cache.base + 'views/',
        //公用加载的样式
        style: [
            layui.cache.base + "css/admin.css"
        ],
        //是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息
        debug: layui.cache.debug,
        //默认视图文件名
        entry: 'index', 
        //视图文件后缀名
        engine: '.html', 
        eventName:'layadmin-event',
        name: 'LayuiAdmin',
        //本地存储表名
        tableName: 'layuiAdmin', 
        //作用于 table upload request 时带上的 headers
        requestHeaders:{
            'PP-User-Agent':'os=3;ver=0.0.1;ctype=2;imei='
        },
        //request 基础URL
        //requestUrl:'http://192.168.0.0/',
        requestUrl:'',
        //图片基础URL
        imageUrl:'http://192.168.3.191/',
        //独立页面路由，可随意添加（无需写参数） 前面不能带 /
        indPage: [
            '/user/login', //登入页
            '/user/reg', //注册页
            '/user/forget' //找回密码
        ],
        //登录页面，当未登录或登录失效时进入
        loginPage:'/user/login',
        //登录 token 名称，request 请求的时候会带上此参数到 header
        tokenName: 'token',
        //是否要检查登录状态， 使用tokenName进行登录验证，不通过的话会返回 loginPage 页面
        loginCheck:true,
        //检查登录状态之后，是否在登录页URL 保存上一页的地址参数， 如果为 false 不保存
        loginCheckName:'back_url',
        //自定义响应字段
        response: {
            //数据状态的字段名称
            statusName: 'code',
            statusCode: {
                //数据状态一切正常的状态码
                ok: 0,
                //登录过期状态码
                logout:100004
            },
            msgName: 'msg', //状态信息的字段名称
            dataName: 'data', //数据详情的字段名称
            countName:'dataCount',  //数据条数的字段名称，用于 table 
        },
        //全局 table 配置，调用 admin.table()生成表格有效， 不能配置 url、headers、response
        table:{
            page:true,
            //每页显示的条数
            limit:20,
            //是否显示加载条
            loading:true,
            //用于对分页请求的参数：page、limit重新设定名称
            request: {
                pageName: 'page', //页码的参数名称，默认：page
                limitName: 'size' //每页数据量的参数名，默认：limit
            }
        },
        //登录过期 HTTP 状态，设置为false不通过http返回码检查
        logoutHttpCode:'401',
        //第三方扩展
        extend:{
            //后台根据业务需求扩展的方法
            helper:'lay/extends/helper',
            //生成二维码
            qrcode:'lay/extends/qrcode',
            //生成 MD5 加密
            md5:'lay/extends/md5',
            //生成图表
            echarts:'lay/extends/echarts',
            echartsTheme:'lay/extends/echartsTheme',
        }
    });
});
