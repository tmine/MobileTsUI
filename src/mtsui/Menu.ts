/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Window.ts"/>

module mtsui {
    export class Menu {
        private visible: boolean;
        private menu: HTMLElement;
        private window: Window;
        private position: String;

        constructor(window: Window, content: Component, position: String) {
            this.window = window;
            this.position = position;

            this.menu = document.createElement("div");
            this.menu.setAttribute("class", "mtsui menu page " + position);
            this.menu.appendChild(content.getDom());
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

        private toggle(): void {
            if (this.visible) this.hide();
            else this.show();
        }

        public show(): void {
            var page = this.window.getActualPage();
            
            if (this.menu.className.indexOf("show") == -1) this.menu.className += " show";
            if (page.getDom().className.indexOf("hide " + this.position) == -1) page.getDom().className += " hide " + this.position;

            var _this = this;
            setTimeout(function() {
                page.getDom().onclick = function() {
                    _this.toggle();
                }
			}, 0);

            this.visible = true;
        }

        public hide(): void {
            var page = this.window.getActualPage();
            
            if (this.menu.className.indexOf(" show") != -1) this.menu.className = this.menu.className.replace(" show", "");
            if (page.getDom().className.indexOf(" hide " + this.position) != -1) page.getDom().className = page.getDom().className.replace(" hide " + this.position, "");

            page.getDom().onclick = function() { };

            this.visible = false;
        }

    }
}