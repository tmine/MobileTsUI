/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Window.ts"/>

module mtscui {
    export class Menu {
        private visible: boolean;
        private menu: HTMLElement;
        private page: Page;
        private position: String;

        constructor(page: Page, icon: Component, content: Component, position: String) {
            this.page = page;
            this.position = position;

            var header: Header = this.page.getHeader();
            if (position === "left") header.setLeft(icon);
            else if (position === "right") header.setRight(icon);

            this.menu = document.createElement("div");
            this.menu.setAttribute("class", "mtscui menu page " + position);
            this.menu.appendChild(content.getDom());

            var window: Window = this.page.getWindow();
            window.getDom().appendChild(this.menu);

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
            if (this.menu.className.indexOf("show") == -1) this.menu.className += " show";
            if (this.page.getDom().className.indexOf("hide " + this.position) == -1) this.page.getDom().className += " hide " + this.position;

            var _this = this;
            setTimeout(function() {
                _this.page.getDom().onclick = function() {
                    _this.toggle();
                }
				}, 0);

            this.visible = true;
        }

        public hide(): void {
            if (this.menu.className.indexOf(" show") != -1) this.menu.className = this.menu.className.replace(" show", "");
            if (this.page.getDom().className.indexOf(" hide " + this.position) != -1) this.page.getDom().className = this.page.getDom().className.replace(" hide " + this.position, "");

            this.page.getDom().onclick = function() { };

            this.visible = false;
        }
    }
}