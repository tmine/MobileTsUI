/// <reference path="../../tsc/util/Stack.ts"/>
/// <reference path="../../tsc/ui/View.ts"/>
/// <reference path="Page.ts"/>

module mtscui {
	export class Window extends tsc.ui.View {
		private pageStack : tsc.util.Stack<Page>;

		constructor(page? : Page){
			this.pageStack = new tsc.util.Stack<Page>();

			var instance : HTMLElement = document.createElement("div");
			instance.setAttribute("class", "mtscui window");

			if(page) {
				page.setWindow(this);
				instance.appendChild(page.getDom());
				this.pageStack.push(page);
			}

			super(instance);
		}

		public navigateTo(page: Page /* TODO: Transition */) : void {

		}

	}
}