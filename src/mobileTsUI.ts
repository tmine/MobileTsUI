
/// <reference path="mtsui/Window.ts"/>
/// <reference path="mtsui/WindowManager.ts"/>
/// <reference path="mtsui/Page.ts"/>
/// <reference path="mtsui/Menu.ts"/>
/// <reference path="mtsui/AlertBox.ts"/>


function createSimpleTextComponent(text: String) {
    var node = document.createElement("h1");
    var title: String = text || "";
    var titleNode = document.createTextNode(title.toString());
    node.appendChild(titleNode);

    return new mtsui.Component(node);
}

function createMenu(mypage, header, title, position) {    
    var page = document.createElement("h1");
    page.innerHTML = "Blubber";
    var mymenupage = new mtsui.Component(page);

    var icon = document.createElement("span");
    icon.setAttribute("class", "fa fa-align-justify");
    icon.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    var mymenuicon = new mtsui.Component(icon);

    new mtsui.Menu(mypage, header, mymenuicon, mymenupage, position);
}

function createWindow(title, content, modal) {
    var mywindow = new mtsui.Window(title);
    var mypage: mtsui.Page = mywindow.getActualPage();

    var header : mtsui.Header = new mtsui.Header();
    mypage.addHeader(header);
    
    createMenu(mypage, header, "LEFT", "left");
    createMenu(mypage, header, "RIGHT", "right");

    mypage.add(createSimpleTextComponent(content));

    var link = document.createElement("div");
    link.setAttribute("class", "fa fa-arrow-right");
    link.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    link.innerHTML = "goto";
    link.onclick = function() {
        var newpage: mtsui.Page = mypage.getWindow().createPage("New Page");
        mypage.getWindow().navigateTo(newpage);

        var link = document.createElement("div");
        link.setAttribute("class", "fa fa-arrow-left");
        link.setAttribute("style", "font-size: 34px; padding-top: 4px;");
        link.innerHTML = "back";
        link.onclick = function() {
            newpage.getWindow().back();
        };
        newpage.add(new mtsui.Component(link));
    };
    mypage.add(new mtsui.Component(link));


    var linkmodal = document.createElement("div");
    linkmodal.setAttribute("class", "fa fa-arrow-up");
    linkmodal.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    linkmodal.innerHTML = "open modal";
    linkmodal.onclick = function() {
        createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd ", true);
    };
    mypage.add(new mtsui.Component(linkmodal));

    var linkalert = document.createElement("div");
    linkalert.setAttribute("class", "fa fa-arrow-up");
    linkalert.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    linkalert.innerHTML = "open AlertBox";
    linkalert.onclick = function() {
        new mtsui.AlertBox("Achtung", "Achtung text", function() {
            mtsui.WindowManager.close();
        });
    };
    mypage.add(new mtsui.Component(linkalert));

    if (modal) mtsui.WindowManager.openModal(mywindow, true);
    else mtsui.WindowManager.openFullscreen(mywindow);
}

window.onload = function() {
    createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd ", false);
    /*setTimeout(function(){createWindow("2", "jl hsdflkjhkjdaf kjds", false);}, 1000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds", false);}, 2000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds", false);}, 3000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds", false);}, 4000);*/
}