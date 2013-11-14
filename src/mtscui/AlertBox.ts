/// <reference path="Window.ts"/>
/// <reference path="WindowManager.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="Popup.ts"/>

module mtscui {

    export class AlertBox extends Popup {
        constructor(title?: String, text?: String, callback?: Function) {
            var component: Component = new Component(document.createElement("div"));

            var textelem = document.createElement("p")
			var textnode = document.createTextNode("" + text);
            textelem.appendChild(textnode);

            component.add(new Component(textelem));

            super(title, component);
        }
    }

}