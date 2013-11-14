
/// <reference path="mtscui/Window.ts"/>
/// <reference path="mtscui/WindowManager.ts"/>
/// <reference path="mtscui/Page.ts"/>
/// <reference path="mtscui/Menu.ts"/>
/// <reference path="mtscui/AlertBox.ts"/>


function createSimpleTextComponent(text: String) {
    var node = document.createElement("h1");
    var title: String = text || "";
    var titleNode = document.createTextNode(title.toString());
    node.appendChild(titleNode);

    return new mtscui.Component(node);
}

function createMenu(mypage, title, position) {
    var page = document.createElement("h1");
    page.innerHTML = "Blubber";
    var mymenupage = new mtscui.Component(page);

    var icon = document.createElement("span");
    icon.setAttribute("class", "fa fa-align-justify");
    icon.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    var mymenuicon = new mtscui.Component(icon);

    new mtscui.Menu(mypage, mymenuicon, mymenupage, position);
}

function createWindow(title, content, modal) {
    var mywindow = new mtscui.Window(title);
    var mypage: mtscui.Page = mywindow.getActualPage();

    createMenu(mypage, "LEFT", "left");
    createMenu(mypage, "RIGHT", "right");

    mypage.add(createSimpleTextComponent(content));

    var link = document.createElement("div");
    link.setAttribute("class", "fa fa-arrow-right");
    link.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    link.innerHTML = "goto";
    link.onclick = function() {
        var newpage: mtscui.Page = mypage.getWindow().createPage("New Page");
        mypage.getWindow().navigateTo(newpage);

        var link = document.createElement("div");
        link.setAttribute("class", "fa fa-arrow-left");
        link.setAttribute("style", "font-size: 34px; padding-top: 4px;");
        link.innerHTML = "back";
        link.onclick = function() {
            newpage.getWindow().back();
        };
        newpage.add(new mtscui.Component(link));
    };
    mypage.add(new mtscui.Component(link));


    var linkmodal = document.createElement("div");
    linkmodal.setAttribute("class", "fa fa-arrow-up");
    linkmodal.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    linkmodal.innerHTML = "open modal";
    linkmodal.onclick = function() {
        createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd ", true);
    };
    mypage.add(new mtscui.Component(linkmodal));

    var linkalert = document.createElement("div");
    linkalert.setAttribute("class", "fa fa-arrow-up");
    linkalert.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    linkalert.innerHTML = "open AlertBox";
    linkalert.onclick = function() {
        new mtscui.AlertBox("Achtung", "Achtung text", function() {
            console.log("alert ok");
        });
    };
    mypage.add(new mtscui.Component(linkalert));

    if (modal) mtscui.WindowManager.openModal(mywindow);
    else mtscui.WindowManager.openFullscreen(mywindow);
}

window.onload = function() {
    createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd ", false);
    /*setTimeout(function(){createWindow("2", "jl hsdflkjhkjdaf kjds");}, 1000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds");}, 2000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds");}, 3000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds");}, 4000);*/
}