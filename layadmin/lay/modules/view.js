//视图路由
layui.define(['jquery','laytpl','element','form'],function(exports){
    var $ = layui.jquery;
    var laytpl = layui.laytpl;
    var conf = layui.conf;
    var self = {
        ie8:navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0" ? true : false,
        container:$('#'+conf.container),
        containerBody:null
    }
    /**
     * 字符串是否含有html标签的检测
     * @param htmlStr
     */
    self.checkHtml = function(htmlStr) {
        var reg = /<[^>]+>/g;
        return reg.test(htmlStr);
    }
    self.parse = function(container){
        if(container == undefined) container = self.containerBody
        var template = container.get(0).tagName == 'SCRIPT' ? container : container.find('[template]');
        

        var renderTemplate = function(template,data,callback){
            laytpl(template.html()).render(data, function(html){
                html = $(self.checkHtml(html) ? html : '<span>'+html+'</span>');
                html.attr('is-template',true);
                template.after(html);
                if($.isFunction(callback)) callback(html);
            });
        }


        layui.each(template,function(index,tem){
            var tem = $(tem);
            var url = tem.attr('lay-url') || '';
            var api = tem.attr('lay-api') || '';
            var type = tem.attr('lay-type') || 'get';
            var data = new Function('return '+ tem.attr('lay-data'))();
            var done = tem.attr('lay-done') || '';

            if(url || api){
                //进行AJAX请求
                self.request({
                    url:url,
                    api:api,
                    type:type,
                    data:data,
                    success:function(res){
                        templateData = data;
                        renderTemplate(tem,res[conf.response.dataName]);
                        if(done) new Function(done)();
                    }
                })
            }else{
                renderTemplate(tem,{},self.ie8 ? function(elem){
                    if(elem[0] && elem[0].tagName != 'LINK') return;
                    container.hide();
                    elem.load(function(){
                        container.show();
                    });
                } : null);
                if(done) new Function(done)();
            }

        })
    }
    self.loading = function(elem) {
        elem.append(this.elemLoad = $('<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading layadmin-loading"></i>'))
    }
    self.loadend = function() {
        this.elemLoad && this.elemLoad.remove()
    }

    self.setTitle = function(title){
        $(document).attr({  title:title + ' - ' + conf.name });
    }
    self.clear = function(){
        self.containerBody.html('');
    }
    self.delHeadSymbol = function(symbol,str){
        if(str.indexOf(symbol) === 0) return str.substring(1,str.length);
        return str;
    }
    self.loadHtml = function(url,callback){
        var queryIndex = url.indexOf('?');
        if(queryIndex !== -1) url = url.slice(0,queryIndex);

        url = self.delHeadSymbol('#',url);
        url = (url.indexOf(conf.base) === 0 ? '' : conf.views) + url + conf.engine + '?v=' + layui.cache.version;
        $.ajax({
            url:url,
            type:'get',
            dataType:'html',
            success:function(html){
                callback(html);
            },
            error:function(res){
                self.log("请求视图文件异常\n文件路径："+ url +"\n状态：" + res.status);
            }
        })
    }
    self.render = function(url,callback){
        if(!url || url == '/') url = conf.entry;

        self.loadHtml(url,function(html){

            var htmlElem = $("<div>" + html + "</div>");
            var title = htmlElem.find('title').text() || '';
            
            if(title){
                self.setTitle(title);
                htmlElem.find('title').remove();
            }

            var container = self.containerBody || self.container;
            container.html(htmlElem.html());
            self.parse(container)
            

            //重新对面包屑进行渲染
            layui.element.render('breadcrumb','layadmin-breadcrumb');

            if($.isFunction(callback)){
                callback({
                    title: title,
                    body: html
                })
            }

        })
    }
    //加载layout文件
    self.renderLayout = function(callback,url){
        if(url == undefined) url = 'layout'
        self.containerBody = null;
        self.render(url,function(res){
            self.containerBody = $('#'+conf.containerBody);
            layui.admin.appBody = self.containerBody;
            if($.isFunction(callback)) callback();
        });
    };
    //加载单页面
    self.renderIndPage = function(url,callback){
        self.renderLayout(function(){
            self.containerBody = null;
            if($.isFunction(callback)) callback();
        },url)
    };
    self.log = function(msg,type){
        if(conf.debug === false) return;
        if(type == undefined) type = 'error';
        console.error(msg);
    }
    self.createRequestParams = function(params){
        var success = params.success;
        var error = params.error;

        if(params.api){
            if(!layui.api[params.api]){
                self.log('请求错误 api.'+ params.api +' 不存在');
                return;
            }
            params.url = conf.requestUrl + layui.api[params.api];
        }else if(params.url){
            params.url = conf.requestUrl + params.url;
        }
        

        var defaultParams = {
            timeout:5000,
            type:'get',
            dataType: 'json',
            headers: conf.requestHeaders || {},
            success:function(res){
                var status = res[conf.response.statusName];
                if(status != conf.response.statusCode.ok){
                    if(status == conf.response.statusCode.logout){
                        layui.admin.logout();
                    }else{
                        self.log('返回状态码异常：' + res[conf.response.statusName] + '\n请求URL：' + params.url);
                    }
                }
                if($.isFunction(success)) success(res);
            },
            error:function(res){
                if(res.status == conf.logoutHttpCode ){
                    layui.admin.logout() 
                }else{
                    layer.msg('请检查您的网络连接');
                    self.log('请检查您的网络连接，错误信息：' + JSON.stringify(res));
                }
                
                if($.isFunction(error)) error(res);
            }
        }
        
        if(self.ie8){
            if(conf.debug) $.support.cors = true;
            defaultParams.cache = false
        }
        if(conf.tokenName){
            var token = layui.admin.getLoginToken();
            if(token) defaultParams.headers[conf.tokenName] = token;
        }
        delete params.success;
        delete params.error;

        return $.extend(defaultParams,params);
    }
    self.request = function(params){
        params = self.createRequestParams(params);
        $.ajax(params);
    }
    
    exports('view',self);
})