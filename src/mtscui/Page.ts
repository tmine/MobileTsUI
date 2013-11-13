/// <reference path="../../tsc/ui/View.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Window.ts"/>

module mtscui {
	export class Page extends Component{
		private title : String;
		private window : Window;
		private header : Header;
		private body : Component;
		private div : HTMLElement;

		constructor(title? : String){
			this.header = new Header();

			this.div = document.createElement("div");
			this.div.setAttribute("class", "mtscui page");

			this.div.appendChild(this.header.getDom());

			var body : HTMLElement = document.createElement("div");
			body.setAttribute("class", "mtscui content");

			super(body);

			this.div.appendChild(super.getDom());

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
		public getHeader() : Header {
			return this.header;
		}

		public getWindow() : Window {
			return this.window;
		}

		public getDom() : HTMLElement {
			return this.div;
		}
	}
}