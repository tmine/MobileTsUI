
/// <reference path="../tsc/util/Stack.ts"/>
/// <reference path="../tsc/util/List.ts"/>
/// <reference path="../tsc/util/LinkedList.ts"/>
/// <reference path="../tsc/ui/View.ts"/>

module mtscui {
	export class Window extends tsc.ui.View {
		private pageStack : tsc.util.Stack<Page>;

		constructor(page? : Page){
			this.pageStack = new tsc.util.Stack<Page>();

			if(page) {
				page.setWindow(this);
				this.pageStack.push(page);
			}

			var instance : HTMLElement = document.createElement("div");
			instance.setAttribute("class", "mtscui window");

			super(instance);
		}

		public getDom() : HTMLElement {
			var instance = super.getDom();

			var page = this.pageStack.pop();
			if(page) {
				instance.appendChild(page.getDom());
				this.pageStack.push(page);
			}

			return instance;
		}

		public navigateTo(page: Page /* Transition */) : void {

		}

	}

	export class Header extends tsc.ui.View {
		private right : Component;
		private middle : Component;
		private left : Component;

		constructor(left? : Component, middle? : Component, right? : Component){
			var instance : HTMLElement = document.createElement("div");
			instance.setAttribute("class", "mtscui header");

			super(instance);

			this.left = left;
			this.middle = middle;
			this.right = right;
		}

		public setLeft(comp : Component) : void {
			this.left = comp;

			this.left.getDom().setAttribute("class", "mtscui left");
		}

		public setMiddle(comp : Component) : void {
			this.middle = comp;

			this.middle.getDom().setAttribute("class", "mtscui middle");
		}

		public setRight(comp : Component) : void {
			this.right = comp;
		}

		public getDom() : HTMLElement {
			var instance = super.getDom();

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

			return instance;
		}
	}

	export class Component extends tsc.ui.View{
		private components : tsc.util.List<Component>;

		constructor(template : any, onload? : Function){
			super(template, onload);
			this.components = new tsc.util.LinkedList<Component>();
		}

		public add(component : Component) : void {
			this.components.add(component);
		}

		public remove(component : Component) : void {
			this.components.remove(component);
		}

		public getDom() : HTMLElement {
			var instance : HTMLElement = document.createElement("div");
			instance.setAttribute("class", "mtscui component");

			var dom = super.getDom();

			for(var i: number = 0; i < this.components.size(); i++){
				var component : Component = this.components.get(i);
				dom.appendChild(component.getDom());
			}

			instance.appendChild(dom);

			return instance;
		}
	}

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

		public getDom() : HTMLElement {
			var instance : HTMLElement = super.getDom();

			instance.appendChild(this.header.getDom());
			instance.appendChild(this.body.getDom());

			return instance;
		}
	}

	export class WindowManager{
		private static windowStack : tsc.util.Stack<Window> = new tsc.util.Stack<Window>();

		public static open(window : Window) : void {
			// hide other window if exist
			var old : Window = WindowManager.windowStack.pop();
			if(old) {
				old.getDom().className = "mtscui window hide";
				WindowManager.windowStack.push(old);
			}

			// Add new window to stack
			WindowManager.windowStack.push(window);
			// Append new window to body
			document.body.appendChild(window.getDom());
		}

		public static close() : void {
			var window : Window = WindowManager.windowStack.pop();
			// Remove window from body
			document.body.removeChild(window.getDom());
		}

	}
}

function createSimpleTextComponent(text : String){
	var node = document.createElement("h1");
	var title : String = text || "";
	var titleNode = document.createTextNode(title.toString());
	node.appendChild(titleNode);

	return new mtscui.Component(node);
}

function createWindow(title, content){
	var mypage = new mtscui.Page(title);
	mypage.getHeader().setLeft(createSimpleTextComponent("LEFT"));
	mypage.getHeader().setRight(createSimpleTextComponent("RIGHT"));
	mypage.add(createSimpleTextComponent(content));

	var mywindow = new mtscui.Window(mypage);
	mtscui.WindowManager.open(mywindow);
}

window.onload = function(){
	createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd");
	setTimeout(function(){createWindow("2", "jl hsdflkjhkjdaf kjds");}, 1000);
}