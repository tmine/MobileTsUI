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
			var oldPage : Page = this.pageStack.pop();
			this.pageStack.push(oldPage);

			page.setWindow(this);
			super.getDom().appendChild(page.getDom());
			page.getDom().className += " transition slide hide right";

			setTimeout(function(){
				page.getDom().className = page.getDom().className.replace(" transition slide hide right", " transition slide hide in");
			}, 0);

			setTimeout(function(){
				page.getDom().className = page.getDom().className.replace(" transition slide hide in", "");
			}, 1000);

			oldPage.getDom().className += " transition slide hide left";

			this.pageStack.push(page);
		}

		public back() : void {
			var oldPage : Page = this.pageStack.pop();
			var page : Page = this.pageStack.pop();
			this.pageStack.push(page);

			oldPage.getDom().className += " transition slide hide right";

			var superdom = super.getDom();
			setTimeout(function(){
				page.getDom().className = page.getDom().className.replace(" transition slide hide left", " transition slide hide in");
			}, 0);

			setTimeout(function(){
				superdom.removeChild(oldPage.getDom());
				page.getDom().className = page.getDom().className.replace(" transition slide hide in", "");
			}, 1000);
		}

	}
}