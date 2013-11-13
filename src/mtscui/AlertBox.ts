/// <reference path="Window.ts"/>
/// <reference path="WindowManager.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>

module mtscui {
	export class Popup extends Window {
		constructor(title? : String, component? : Component){
			var page = new Page(title);
			if(component) page.add(component);
			super(page);

			this.getDom().className += " popup";

			WindowManager.openModal(this);
		}
	}

	export class AlertBox extends Popup {
		constructor(title? : String, text? : String, callback? : Function){
			var component : Component = new Component(document.createElement("div"));

			var textelem = document.createElement("p")
			var textnode = document.createTextNode("" + text);
			textelem.appendChild(textnode);

			component.add(new Component(textelem));

			super(title, component);
		}

	}

	
}