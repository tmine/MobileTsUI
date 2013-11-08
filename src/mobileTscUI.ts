
/// <reference path="../tsc/util/Stack.ts"/>
/// <reference path="../tsc/util/List.ts"/>
/// <reference path="../tsc/util/LinkedList.ts"/>
/// <reference path="../tsc/ui/View.ts"/>

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

	export class WindowManager{
		public static debugViewStackPadding = 0;
		private static windowStack : tsc.util.Stack<Window> = new tsc.util.Stack<Window>();

		public static open(window : Window) : void {
			// hide other window if exist
			var old : Window = WindowManager.windowStack.pop();
			if(old) {
				old.getDom().className = "mtscui window hide";

				WindowManager.windowStack.push(old);
			}

			var windowdom = window.getDom();

			// debug code to see view stack
			windowdom.style.left = WindowManager.windowStack.size() * (WindowManager.debugViewStackPadding || 0) + "px";
			windowdom.style.top = WindowManager.windowStack.size() * (WindowManager.debugViewStackPadding || 0) + "px";
			windowdom.style.right = -WindowManager.windowStack.size() * (WindowManager.debugViewStackPadding || 0) + "px";
			windowdom.style.bottom = -WindowManager.windowStack.size() * (WindowManager.debugViewStackPadding || 0) + "px";

			// Add new window to stack
			WindowManager.windowStack.push(window);
			// Append new window to body
			document.body.appendChild(windowdom);
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
	mtscui.WindowManager.debugViewStackPadding = 20;
	createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd");
	setTimeout(function(){createWindow("2", "jl hsdflkjhkjdaf kjds");}, 1000);
	setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds");}, 2000);
}