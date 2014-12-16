/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Window.ts"/>

interface TouchEvent extends Event {
    pageX: number; 
    pageY: number;
}

var global_window = window;

module mtsui {
    export class Menu {
        private static OFFSET: number = 50;
        
        private visible: boolean;
        private menu: HTMLElement;
        private window: Window;
        private position: String;
        private slide: boolean;
        
        constructor(window: Window, content: Component, position: string, slide?: boolean) {
            this.window = window;
            this.position = position;
            this.slide = slide;

            this.menu = document.createElement("div");
            this.menu.setAttribute("class", "mtsui menu page " + position);
            this.menu.appendChild(content.getDom());

            // TODO: create gesture for slide in
            if(this.slide){
                this.menu.addEventListener('touchmove', function(in_e){
                    var e = <TouchEvent> in_e;
                    if(global_window.event) global_window.event.cancelBubble = true;
                    e.stopPropagation();
                }, false);
                
                var _this = this;
                var draging = false;
                var direction = "";
                var lastPos = 0;
                var visible = false;
                var width = 0;
                window.getDom().addEventListener('touchmove', function(in_e){
                    var page = _this.window.getActualPage();
                    var style: any = page.getDom().style;
                    
                    width = width || window.getDom().scrollWidth;
                    
                    var e = <TouchEvent> in_e;
                    if((draging && direction == position) || (position == "left" && e.pageX <= Menu.OFFSET) || (position == "right" && e.pageX >= (width-Menu.OFFSET))){
                        if(position == "left") direction = "left";
                        if(position == "right") direction = "right";
                        if(!draging){
                            draging = true;
                            style.transition = "none";
                        }
                        if(!visible && lastPos != 0){
                            _this.show();
                            visible = true;
                        }
                        
                        lastPos = e.pageX;
                        
                        if(direction == "left") {
                            style.webkitTransform = "translate3d("+e.pageX+"px, 0, 0)";
                            style.transform = "translate3d("+e.pageX+"px, 0, 0)";
                        } else if(direction == "right") {
                            style.webkitTransform = "translate3d("+(e.pageX-width)+"px, 0, 0)";
                            style.transform = "translate3d("+(e.pageX-width)+"px, 0, 0)";
                        }
                        
                        e.preventDefault();
                    }
                }, false);
                
                window.getDom().addEventListener('touchend', function(in_e){
                    var page = _this.window.getActualPage();
                    var style: any = page.getDom().style;
                    
                    if(draging && direction == "right" && lastPos >= (width/2)){
                        _this.hide();
                    } else if(draging && direction == "left" && lastPos <= (width/2)){
                        _this.hide();
                    }
                    
                    draging = false;
                    visible = false;
                    style.transition = "";
                    style.webkitTransform = "";
                    style.transform = "";
                    lastPos = 0;
                    direction = "";
                }, false);
            }
		}
        
        public deinit(): void {
            
        }
        
        public addTo(header: Header, icon: Component): void{
            this.window.getDom().appendChild(this.menu);
            
            if (this.position === "left") header.setLeft(icon);
            else if (this.position === "right") header.setRight(icon);
            
            var _this = this;
            icon.getDom().onclick = function() {
                _this.toggle();
            }
        }

        public toggle(): void {
            if (this.visible) this.hide();
            else this.show();
        }
        
        public show(): void {
            var page = this.window.getActualPage();
            var overlay = document.createElement("div");
            overlay.setAttribute("class", "mtsui page");
            
            if(this.slide){
                var _this = this;
                var draging = false;
                var direction = "";
                var lastPos = 0;
                var visible = false;
                var width = 0;
                overlay.addEventListener('touchmove', function(in_e){
                    var page = _this.window.getActualPage();
                    var style: any = page.getDom().style;
                    
                    width = width || overlay.scrollWidth;
                                    
                    var e = <TouchEvent> in_e;
                    if((draging && direction == _this.position) || (_this.position == "right" && e.pageX <= Menu.OFFSET) || (_this.position == "left" && e.pageX >= (width-Menu.OFFSET))){
                        if(_this.position == "left") direction = "left";
                        if(_this.position == "right") direction = "right";
                        if(!draging){
                            draging = true;
                            style.transition = "none";
                        }
                        if(!visible && lastPos != 0){
                            visible = true;
                        }
                        
                        lastPos = e.pageX;
                        
                        if(direction == "left") {
                            style.webkitTransform = "translate3d("+e.pageX+"px, 0, 0)";
                            style.transform = "translate3d("+e.pageX+"px, 0, 0)";
                        } else if(direction == "right") {
                            style.webkitTransform = "translate3d("+(e.pageX-width)+"px, 0, 0)";
                            style.transform = "translate3d("+(e.pageX-width)+"px, 0, 0)";
                        }
                        
                    }
                    e.preventDefault();
                    if(global_window.event) global_window.event.cancelBubble = true;
                    e.stopPropagation();
                }, false);
                
                overlay.addEventListener('touchend', function(in_e){
                    var page = _this.window.getActualPage();
                    var style: any = page.getDom().style;
                    
                    if(draging && direction == "right" && lastPos >= (width/2)){
                        _this.hide();
                    } else if(draging && direction == "left" && lastPos <= (width/2)){
                        _this.hide();
                    }
                    
                    draging = false;
                    visible = false;
                    style.transition = "";
                    style.webkitTransform = "";
                    style.transform = "";
                    lastPos = 0;
                    direction = "";
                }, false);
            }
            
            this.window.getDom().appendChild(overlay);
            
            if (this.menu.className.indexOf("show") == -1) this.menu.className += " show";
            if (page.getDom().className.indexOf("hide " + this.position) == -1) page.getDom().className += " hide " + this.position;
            if (overlay.className.indexOf(" menuoverlay hide " + this.position) == -1) overlay.className += " menuoverlay hide " + this.position;

            var _this = this;
            setTimeout(function() {
                overlay.onclick = function() {
                    _this.hide();
                }
			}, 0);

            this.visible = true;
        }

        public hide(): void {            
            var page = this.window.getActualPage();
            
            var overlay = this.window.getDom().querySelector(".menuoverlay");
            if(overlay) this.window.getDom().removeChild(overlay);
            
            if (page.getDom().className.indexOf(" hide " + this.position) != -1) page.getDom().className = page.getDom().className.replace(" hide " + this.position, "");
            
            var _this = this;
            setTimeout(function(){
                if (_this.menu.className.indexOf(" show") != -1) _this.menu.className = _this.menu.className.replace(" show", "");
            }, 500);

            page.getDom().onclick = function() { };

            this.visible = false;
        }

    }
}