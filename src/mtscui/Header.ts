/// <reference path="../../tsc/ui/View.ts"/>
/// <reference path="Component.ts"/>

module mtscui {
	export class Header extends tsc.ui.View {
		private right : Component;
		private middle : Component;
		private left : Component;

		constructor(left? : Component, middle? : Component, right? : Component){
			var instance : HTMLElement = document.createElement("div");
			instance.setAttribute("class", "mtscui header");

			this.left = left;
			this.middle = middle;
			this.right = right;

			if(!this.left){
				var dom : HTMLElement = document.createElement("span");
				this.left = new Component(dom);
			}
			var dom : HTMLElement = this.left.getDom();
			dom.setAttribute("class", "mtscui left");
			instance.appendChild(dom);


			if(!this.middle){
				var dom : HTMLElement = document.createElement("span");
				this.middle = new Component(dom);
			}
			var dom : HTMLElement = this.middle.getDom();
			dom.setAttribute("class", "mtscui middle");
			instance.appendChild(dom); 

			if(!this.right){
				var dom : HTMLElement = document.createElement("span");
				this.right = new Component(dom);
			}
			var dom : HTMLElement = this.right.getDom();
			dom.setAttribute("class", "mtscui right");
			instance.appendChild(dom);

			super(instance);
		}

		public setLeft(comp : Component) : void {
			super.getDom().removeChild(this.left.getDom());

			this.left = comp;

			var dom = this.left.getDom();
			dom.setAttribute("class", "mtscui left");
			super.getDom().insertBefore(dom, this.middle.getDom()); 
		}

		public setMiddle(comp : Component) : void {
			super.getDom().removeChild(this.middle.getDom());

			this.middle = comp;

			var dom = this.middle.getDom();
			dom.setAttribute("class", "mtscui middle");
			super.getDom().insertBefore(dom, this.right.getDom()); 
		}

		public setRight(comp : Component) : void {
			super.getDom().removeChild(this.right.getDom());

			this.right = comp;

			var dom = this.right.getDom();
			dom.setAttribute("class", "mtscui right");
			super.getDom().appendChild(dom);
		}
	}
}