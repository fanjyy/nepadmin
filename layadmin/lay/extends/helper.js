layui.define(function(exports){
    var admin = layui.admin;
    var conf = layui.conf;
    var $ = layui.jquery;
    var self = {}

    self.qrcode = function(elem,params){
        if(elem instanceof $) elem = elem.get(0);
        if(!layui.qrcode) console.error('请先引入 qrcode 模块！');

        var defaultParams = {
            text: "",
            width:160,
            height:160,
            colorDark : "#000000",
            colorLight : "#ffffff"            
        }

        if(typeof params != 'object') params = {text:params}
        params = $.extend(defaultParams,params);
        
        if(admin.ie8){
            params.width += 20;
            params.height += 20;
        }
        var qrcode = new layui.qrcode(elem, params);
        if(admin.ie8) $(elem).find('table').css('margin',0);
        return qrcode;
    }
    self.upload = function(options){
        if(!layui.upload) console.error('请先引入 upload 模块！');
        var defaultHtml = '';
        var tipClass = 'helper-upload-done-tips';
        var tipClearCls = 'helper-upload-done-clear';
        var tipLinkCls = 'helper-upload-done-link';
        var tip = null;
        var elem = options.elem;
        var done = options.done;
        if(elem.nextAll('.'+tipClass).length == 0){
            tip = $('<span style="display:none" class="'+tipClass+' layui-word-aux layui-font-12">&nbsp;&nbsp;图片已上传&nbsp;&nbsp;<a class="'+tipLinkCls+'" href="#" target="_blank">查看</a>&nbsp;&nbsp;<a class="'+tipClearCls+'">清除</a></span>');
            elem.after(tip);
            tip.find('.'+tipClearCls).click(function(){
                tip.hide();
                elem.addClass('layui-btn-primary');
                if($.isFunction(options.clear)) options.clear();
            })
        }
        options.before = function(){
            defaultHtml = elem.html();
            elem.html('<i class="layui-icon '+(options.icon || 'layui-icon-loading')+' layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i>正在上传图片');
        }
        options.done = function(res){
            tip.show().find('.'+tipLinkCls);
            elem.removeClass('layui-btn-primary').html(defaultHtml);
            if($.isFunction(done)) done(res,function(url){
                tip.attr('href',url);
            },this.field);
        }
        options.error = function(res){
            elem.html(defaultHtml);
        }
        return layui.upload.render(options);
    }
    exports('helper',self);
})