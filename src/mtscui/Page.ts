/// <reference path="../../tsc/ui/View.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Window.ts"/>

module mtscui {
	export class Page extends tsc.ui.View{
		private title : String;
		private window : Window;
		private header : Header;
		private body : Component;

		constructor(title? : String){
			this.header = new Header();

			var body : HTMLElement = document.createElement("div");
			body.setAttribute("class", "mtscui content");
			this.body = new Component(body);

			var instance : HTMLElement = document.createElement("div");
			instance.setAttribute("class", "mtscui page");

			instance.appendChild(this.header.getDom());
			instance.appendChild(this.body.getDom());

			super(instance);

			this.title = title;

			var node = document.createElement("h1");
			var title : String = this.title || "";
			var titleNode = document.createTextNode(title.toString());
			node.appendChild(titleNode);

			this.header.setMiddle(new Component(node));
		}

		public setWindow(window : Window){
			this.window = window;
		}

		public add(component : Component) : void {
			this.body.add(component);
		}

		public remove(component : Component) : void {
			this.body.remove(component);
		}

		public getHeader() : Header {
			return this.header;
		}
	}
}