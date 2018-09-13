layui.define(['jquery'],function(exports){
    var $ = layui.jquery;
    var CLS_MENU = 'layui-menu';
    var CLS_MENU_RIGHT = 'layui-menu-direright';
    var CLS_SELECT = 'layui-menu-select';
    var CLS_OPTION = 'layui-menu-option';
    var CLS_TITLE = 'layui-menu-title';
    var CLS_ARROW = 'layadmin-arrow-up'
    var HTML_MENU = '<div class="'+CLS_MENU+'">奥术大师大所<div>';
    var DEPTH = 0;

    var Class = function(config){
        this.config = $.extend({},this.config,config);
        this.render(config);
    };
    Class.prototype.config = {
        width:150,
        trigger:'click'
    }
    Class.prototype.menuElem = '';
    Class.prototype.exists = false;
    Class.prototype.depth = 0;
    Class.prototype.render = function(config){
        var self = this;
        /*
        var HTML_SELECT = '<div class="'+CLS_SELECT+'">';
        layui.each(config.options,function(i,option){
            HTML_SELECT += '<div lay-name='+option.name+' class="'+CLS_OPTION+' layui-elip"><span class="layui-icon '+option.icon+'"></span>'+option.title;
            HTML_SELECT += createChildsHtml(option) + '</div>';
        })
        HTML_SELECT += '</div>';
        */




        
        $(document).on('click',this.config.elem,function(){

            if(self.menuElem == ''){
                var menu = $(HTML_MENU);
                menu.html(self.createOptionsHtml(config));
                $('body').prepend(menu);
                menu.on('click','.'+CLS_OPTION,function(e){
                    if($.isFunction(config.click)){
                        config.click($(this).attr('lay-name'),$(this),e);
                    }
                });

                /**
                $(document).one(function(e){
                    var menu = $(e.target).parents('.layui-menu');
                    if(menu.length == 0){
                        $('.layui-menu').hide();
                    }
                })
                 */

                self.menuElem = menu;
                self.menuSelect = menu.find('.'+CLS_SELECT);
            }
            var menu = self.menuElem;
            var top = $(this).offset().top + $(this).height() + 12;
            var left = $(this).offset().left;
            menu.css('top',top);
            var offsetWidth = (self.depth + 1) * self.config.width;

            if($(this).offset().left + offsetWidth > $(window).width()){
                menu.addClass('layui-menu-right').css('left',left - menu.width() + $(this).width());
                self.menuSelect.css({left:'auto',right:self.config.width});
            }else{
                menu.removeClass('layui-menu-right').css('left',left);
                self.menuSelect.css({right:'auto',left:self.config.width});
            }
            menu.show();
        })
    }
    Class.prototype.createOptionsHtml = function(data,depth){
        depth = depth || 0;
        var self = this;
        var width = self.config.width + 'px;';
        var html = '<div class="'+CLS_SELECT+'" style="width:'+ width + (depth > 0 ? 'left:'+width :'')+'">';
        if(depth == 0){
            html += '<div class="'+CLS_ARROW+'"></div>';
        }
        layui.each(data.options,function(i,option){
            var options = option.options || [];
            html += '<div lay-name='+option.name+' class="'+CLS_OPTION+'"><p class="'+CLS_TITLE+' layui-elip"><span class="layui-icon '+option.icon+'"></span>'+option.title+'</p>' + (options.length>0?'<i class="layui-icon layui-icon-right"></i>':'');
            option.options = option.options || [];
            if(option.options.length > 0) html += self.createOptionsHtml(option,depth + 1);
            html += '</div>';
            if(self.depth < depth) self.depth = depth;
        });
        html += '</div>';
        return html;
    }

    var self = {
        render:function(config){
            new Class(config);
        }
    }
    exports('menu',self);
})