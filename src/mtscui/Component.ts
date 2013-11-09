/// <reference path="../../tsc/util/List.ts"/>
/// <reference path="../../tsc/util/LinkedList.ts"/>
/// <reference path="../../tsc/ui/View.ts"/>

module mtscui {
	export class Component extends tsc.ui.View{
		private components : tsc.util.List<Component>;
		private dom : HTMLElement ;

		constructor(template : any, onload? : Function){
			super(template, onload);
			this.components = new tsc.util.LinkedList<Component>();

			this.dom = document.createElement("div");
			this.dom.setAttribute("class", "mtscui component");
		}

		public add(component : Component) : void {
			super.getDom().appendChild(component.getDom());
		}

		public remove(component : Component) : void {
			super.getDom().removeChild(component.getDom());
		}

		public getDom() : HTMLElement {
			this.dom.appendChild(super.getDom());
			return this.dom;
		}
	}
}