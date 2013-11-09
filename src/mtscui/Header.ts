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

			if(this.left){
				var dom = this.left.getDom();
				dom.setAttribute("class", "mtscui left");
				instance.appendChild(dom);
			}
			if(this.middle){
				var dom = this.middle.getDom();
				dom.setAttribute("class", "mtscui middle");
				instance.appendChild(dom);
			}
			if(this.right){
				var dom = this.right.getDom();
				dom.setAttribute("class", "mtscui right");
				instance.appendChild(dom);
			}

			super(instance);
		}

		public setLeft(comp : Component) : void {
			this.left = comp;

			var dom = this.left.getDom();
			dom.setAttribute("class", "mtscui left");
			if(this.middle) super.getDom().insertBefore(dom, this.middle.getDom()); 
			else if(this.right) super.getDom().insertBefore(dom, this.right.getDom()); 
			else super.getDom().appendChild(dom);
		}

		public setMiddle(comp : Component) : void {
			this.middle = comp;

			var dom = this.middle.getDom();
			dom.setAttribute("class", "mtscui middle");
			if(this.right) super.getDom().insertBefore(dom, this.right.getDom()); 
			else super.getDom().appendChild(dom);
		}

		public setRight(comp : Component) : void {
			this.right = comp;

			var dom = this.right.getDom();
			dom.setAttribute("class", "mtscui right");
			super.getDom().appendChild(dom);
		}
	}
}