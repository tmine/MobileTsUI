/// <reference path="Window.ts"/>
/// <reference path="WindowManager.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>

module mtscui {

    export class Popup extends Window {
        constructor(title?: String, component?: Component) {
            super(title);

            var page: Page = this.getActualPage();
            if (component) page.add(component);

            this.getDom().className += " popup";

            WindowManager.openModal(this);
        }
    }
}