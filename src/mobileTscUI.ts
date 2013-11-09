
/// <reference path="mtscui/Window.ts"/>
/// <reference path="mtscui/WindowManager.ts"/>
/// <reference path="mtscui/Page.ts"/>


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
	createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd ");
	setTimeout(function(){createWindow("2", "jl hsdflkjhkjdaf kjds");}, 1000);
	setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds");}, 2000);
	setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds");}, 3000);
	setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds");}, 4000);
}