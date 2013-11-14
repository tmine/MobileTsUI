var tsc;
(function (tsc) {
    (function (util) {
        var Stack = (function () {
            function Stack() {
                this.array = new Array();
            }
            Stack.prototype.push = function (item) {
                this.array.push(item);
            };

            Stack.prototype.pop = function () {
                return this.array.pop();
            };

            Stack.prototype.peek = function () {
                var item = this.array.pop();
                this.array.push(item);
                return item;
            };

            Stack.prototype.size = function () {
                return this.array.length;
            };

            Stack.prototype.empty = function () {
                return this.array.length == 0;
            };
            return Stack;
        })();
        util.Stack = Stack;
    })(tsc.util || (tsc.util = {}));
    var util = tsc.util;
})(tsc || (tsc = {}));
var tsc;
(function (tsc) {
    (function (ui) {
        if (!XMLHttpRequest) {
            XMLHttpRequest = ActiveXObject("Microsoft.XMLHTTP");
        }

        var ResourceLoader = (function () {
            function ResourceLoader() {
            }
            ResourceLoader.prototype.load = function (path, callback) {
                return this._load(false, path, callback);
            };
            ResourceLoader.prototype.loadXML = function (path, callback) {
                return this._load(true, path, callback);
            };

            ResourceLoader.prototype._load = function (xml, path, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        if (callback) {
                            if (xml)
                                callback(xhr.responseXML);
else
                                callback(xhr.responseText);
                        }
                    }
                };
                xhr.open("GET", path, (callback != undefined));
                xhr.send();

                if (xml)
                    return xhr.responseXML;
else
                    return xhr.responseText;
            };
            return ResourceLoader;
        })();
        ui.ResourceLoader = ResourceLoader;
    })(tsc.ui || (tsc.ui = {}));
    var ui = tsc.ui;
})(tsc || (tsc = {}));
var tsc;
(function (tsc) {
    /// <reference path="ResourceLoader.ts"/>
    (function (ui) {
        var ResourceLoader = tsc.ui.ResourceLoader;

        var View = (function () {
            // you can construct your view with:
            // - HTMLElement (will be cloned)
            // - Template HTMLElement, you will receive the content of the template Element in a new span
            // - Path (string) Content of this HTML File will be loaded inside a span element which will be you instance object
            function View(template, onload) {
                if (template.constructor === String) {
                    if (!template || template == "") {
                        return false;
                    }

                    if (onload) {
                        var _this = this;
                        new ResourceLoader().load(template, function (content) {
                            _this.instance = document.createElement("span");
                            _this.instance.innerHTML = content;

                            setTimeout(onload, 0);
                        });
                    } else {
                        var content = new ResourceLoader().load(template);
                        this.instance = document.createElement("span");
                        this.instance.innerHTML = content;
                    }
                } else if (template instanceof HTMLElement) {
                    if (template.nodeName == "TEMPLATE") {
                        this.instance = document.createElement("span");
                        this.instance.innerHTML = template.innerHTML;
                    } else if (template.parentNode == null) {
                        this.instance = template;
                    } else {
                        this.instance = template.cloneNode(true);
                    }
                    if (onload)
                        setTimeout(onload, 0);
                } else {
                    return false;
                }
            }
            View.prototype.getDom = function () {
                return this.instance;
            };

            View.prototype.getHTMLElementsByName = function (name) {
                var elements = new Array();
                this._traversAllChildNodes(function (element) {
                    if (element.getAttribute && element.getAttribute("name") == name)
                        elements.push(element);
                }, this.instance);
                return elements;
            };

            View.prototype._traversAllChildNodes = function (visitor, instance) {
                visitor(instance);
                var childNodes = instance.childNodes;
                for (var i in childNodes) {
                    this._traversAllChildNodes(visitor, childNodes[i]);
                }
            };

            View.prototype.getHTMLElementById = function (id) {
                return this._getHTMLElementById(id, this.instance);
            };

            View.prototype._getHTMLElementById = function (id, instance) {
                if (instance.getAttribute("id") == id)
                    return instance;

                var childNodes = instance.childNodes;
                for (var i in childNodes) {
                    var instance = this._getHTMLElementById(id, childNodes[i]);
                    if (instance != null)
                        return instance;
                }

                return null;
            };
            return View;
        })();
        ui.View = View;
    })(tsc.ui || (tsc.ui = {}));
    var ui = tsc.ui;
})(tsc || (tsc = {}));
var tsc;
(function (tsc) {
    /// <reference path="List.ts"/>
    (function (util) {
        var ListNode = (function () {
            function ListNode(item) {
                this.item = item;
            }
            return ListNode;
        })();

        var LinkedList = (function () {
            function LinkedList() {
                this.listsize = 0;
            }
            LinkedList.prototype.add = function (item) {
                if (this.first == null)
                    this.first = new ListNode(item);

                var last = this.first;
                while (last.next != null) {
                    last = last.next;
                }
                last.next = new ListNode(item);
                last.next.prev = last;

                this.listsize++;
            };
            LinkedList.prototype.remove = function (item) {
                if (this.first == null)
                    return;

                var node = this.first;
                while (node.next != null) {
                    if (node.item == item) {
                        node.prev.next = node.next;
                        node.next.prev = node.prev;
                        break;
                    }
                    node = node.next;
                }

                this.listsize--;
            };
            LinkedList.prototype.get = function (index) {
                index++;
                if (index == 0)
                    return null;

                var node = this.first;
                for (var i = 0; i < index; i++) {
                    if (node.next == null)
                        return null;
else
                        node = node.next;
                }
                return node.item;
            };
            LinkedList.prototype.size = function () {
                return this.listsize;
            };
            return LinkedList;
        })();
        util.LinkedList = LinkedList;
    })(tsc.util || (tsc.util = {}));
    var util = tsc.util;
})(tsc || (tsc = {}));
/// <reference path="../tsc/util/List.ts"/>
/// <reference path="../tsc/util/LinkedList.ts"/>
/// <reference path="../tsc/ui/View.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mtscui;
(function (mtscui) {
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(template) {
            _super.call(this, template);
            this.components = new tsc.util.LinkedList();

            this.dom = document.createElement("div");
            this.dom.setAttribute("class", "mtscui component");
        }
        Component.prototype.add = function (component) {
            _super.prototype.getDom.call(this).appendChild(component.getDom());
        };

        Component.prototype.remove = function (component) {
            _super.prototype.getDom.call(this).removeChild(component.getDom());
        };

        Component.prototype.getDom = function () {
            this.dom.appendChild(_super.prototype.getDom.call(this));
            return this.dom;
        };
        return Component;
    })(tsc.ui.View);
    mtscui.Component = Component;
})(mtscui || (mtscui = {}));
/// <reference path="../tsc/ui/View.ts"/>
/// <reference path="Component.ts"/>
var mtscui;
(function (mtscui) {
    var Header = (function (_super) {
        __extends(Header, _super);
        function Header(left, middle, right) {
            var instance = document.createElement("div");
            instance.setAttribute("class", "mtscui header");

            this.left = left;
            this.middle = middle;
            this.right = right;

            if (!this.left) {
                var dom = document.createElement("span");
                this.left = new mtscui.Component(dom);
            }
            var dom = this.left.getDom();
            dom.setAttribute("class", "mtscui left");
            instance.appendChild(dom);

            if (!this.middle) {
                var dom = document.createElement("span");
                this.middle = new mtscui.Component(dom);
            }
            var dom = this.middle.getDom();
            dom.setAttribute("class", "mtscui middle");
            instance.appendChild(dom);

            if (!this.right) {
                var dom = document.createElement("span");
                this.right = new mtscui.Component(dom);
            }
            var dom = this.right.getDom();
            dom.setAttribute("class", "mtscui right");
            instance.appendChild(dom);

            _super.call(this, instance);
        }
        Header.prototype.setLeft = function (comp) {
            this.getDom().removeChild(this.left.getDom());

            this.left = comp;

            var dom = this.left.getDom();
            dom.setAttribute("class", "mtscui left");
            this.getDom().insertBefore(dom, this.middle.getDom());
        };

        Header.prototype.setMiddle = function (comp) {
            this.getDom().removeChild(this.middle.getDom());

            this.middle = comp;

            var dom = this.middle.getDom();
            dom.setAttribute("class", "mtscui middle");
            this.getDom().insertBefore(dom, this.right.getDom());
        };

        Header.prototype.setRight = function (comp) {
            this.getDom().removeChild(this.right.getDom());

            this.right = comp;

            var dom = this.right.getDom();
            dom.setAttribute("class", "mtscui right");
            this.getDom().appendChild(dom);
        };

        Header.prototype.getLeft = function () {
            return this.left;
        };

        Header.prototype.getMiddle = function () {
            return this.middle;
        };

        Header.prototype.getRight = function () {
            return this.right;
        };
        return Header;
    })(tsc.ui.View);
    mtscui.Header = Header;
})(mtscui || (mtscui = {}));
/// <reference path="../tsc/ui/View.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Window.ts"/>
var mtscui;
(function (mtscui) {
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(window, title) {
            this.window = window;

            this.div = document.createElement("div");
            this.div.setAttribute("class", "mtscui page");

            var body = document.createElement("div");
            body.setAttribute("class", "mtscui content");

            _super.call(this, body);

            this.div.appendChild(_super.prototype.getDom.call(this));

            this.title = title;
            if (this.title) {
                this.header = new mtscui.Header();
                this.div.appendChild(this.header.getDom());

                var node = document.createElement("h1");
                var title = this.title || "";
                var titleNode = document.createTextNode(title.toString());
                node.appendChild(titleNode);

                this.header.setMiddle(new mtscui.Component(node));
            }
        }
        Page.prototype.addHeader = function (header) {
            if (this.header)
                this.div.removeChild(this.header.getDom());

            if (this.header.getLeft().getDom().innerHTML != "<span></span>" && header.getLeft().getDom().innerHTML == "<span></span>")
                header.setLeft(this.header.getLeft());
            if (this.header.getMiddle().getDom().innerHTML != "<span></span>" && header.getMiddle().getDom().innerHTML == "<span></span>")
                header.setMiddle(this.header.getMiddle());
            if (this.header.getRight().getDom().innerHTML != "<span></span>" && header.getRight().getDom().innerHTML == "<span></span>")
                header.setRight(this.header.getRight());

            this.div.appendChild(header.getDom());
            this.header = header;
        };

        Page.prototype.getWindow = function () {
            return this.window;
        };

        Page.prototype.getDom = function () {
            return this.div;
        };
        return Page;
    })(mtscui.Component);
    mtscui.Page = Page;
})(mtscui || (mtscui = {}));
/// <reference path="../tsc/util/Stack.ts"/>
/// <reference path="../tsc/ui/View.ts"/>
/// <reference path="Page.ts"/>
var mtscui;
(function (mtscui) {
    var Window = (function (_super) {
        __extends(Window, _super);
        function Window(title) {
            this.pageStack = new tsc.util.Stack();

            var instance = document.createElement("div");
            instance.setAttribute("class", "mtscui window");
            _super.call(this, instance);

            var page = this.createPage(title);
            instance.appendChild(page.getDom());
            this.pageStack.push(page);
        }
        Window.prototype.getActualPage = function () {
            var page = this.pageStack.pop();
            this.pageStack.push(page);

            return page;
        };

        Window.prototype.createPage = function (title) {
            return new mtscui.Page(this, title);
        };

        Window.prototype.navigateTo = function (page, transitiontype) {
            if (!transitiontype)
                transitiontype = "slide";

            var oldPage = this.pageStack.pop();
            this.pageStack.push(oldPage);

            this.getDom().appendChild(page.getDom());
            page.getDom().className += " transition " + transitiontype + " hide right";

            setTimeout(function () {
                page.getDom().className = page.getDom().className.replace(" transition " + transitiontype + " hide right", " transition " + transitiontype + " hide in");
            }, 0);

            setTimeout(function () {
                page.getDom().className = page.getDom().className.replace(" transition " + transitiontype + " hide in", "");
            }, 1000);

            oldPage.getDom().className += " transition " + transitiontype + " hide left";

            this.pageStack.push(page);
        };

        Window.prototype.back = function () {
            var oldPage = this.pageStack.pop();
            var page = this.pageStack.pop();
            this.pageStack.push(page);

            oldPage.getDom().className += " transition slide hide right";

            var superdom = this.getDom();
            setTimeout(function () {
                page.getDom().className = page.getDom().className.replace(" transition slide hide left", " transition slide hide in");
            }, 0);

            setTimeout(function () {
                superdom.removeChild(oldPage.getDom());
                page.getDom().className = page.getDom().className.replace(" transition slide hide in", "");
            }, 1000);
        };
        return Window;
    })(tsc.ui.View);
    mtscui.Window = Window;
})(mtscui || (mtscui = {}));
/// <reference path="../tsc/util/Stack.ts"/>
/// <reference path="Window.ts"/>
var mtscui;
(function (mtscui) {
    var WindowManager = (function () {
        function WindowManager() {
        }
        WindowManager.open = function (window) {
            // hide other window if exist
            var old = WindowManager.windowStack.pop();
            if (old) {
                old.getDom().className += " hide";

                WindowManager.windowStack.push(old);
            }

            // Add new window to stack
            WindowManager.windowStack.push(window);

            // Append new window to body
            document.body.appendChild(window.getDom());
        };

        WindowManager.openFullscreen = function (window) {
            window.getDom().className += " fullscreen";
            WindowManager.open(window);
        };

        WindowManager.openModal = function (window, closable) {
            var temp = new mtscui.Window();

            temp.getDom().className += " modal";
            temp.getDom().appendChild(window.getDom());

            if (closable) {
                temp.getDom().onclick = function () {
                    WindowManager.close();
                };
            }

            window.getDom().onclick = function () {
                if (event.stopPropagation)
                    event.stopPropagation();
                if (event)
                    event.cancelBubble = true;
            };

            WindowManager.open(temp);
        };

        WindowManager.close = function () {
            var window = WindowManager.windowStack.pop();

            // Remove window from body
            document.body.removeChild(window.getDom());

            var window = WindowManager.windowStack.pop();
            window.getDom().className = window.getDom().className.replace(" hide", "");
            WindowManager.windowStack.push(window);
        };
        WindowManager.windowStack = new tsc.util.Stack();
        return WindowManager;
    })();
    mtscui.WindowManager = WindowManager;
})(mtscui || (mtscui = {}));
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Window.ts"/>
var mtscui;
(function (mtscui) {
    var Menu = (function () {
        function Menu(page, header, icon, content, position) {
            this.page = page;
            this.position = position;

            if (position === "left")
                header.setLeft(icon);
else if (position === "right")
                header.setRight(icon);

            this.menu = document.createElement("div");
            this.menu.setAttribute("class", "mtscui menu page " + position);
            this.menu.appendChild(content.getDom());

            var window = this.page.getWindow();
            window.getDom().appendChild(this.menu);

            var _this = this;
            icon.getDom().onclick = function () {
                _this.toggle();
            };
        }
        Menu.prototype.toggle = function () {
            if (this.visible)
                this.hide();
else
                this.show();
        };

        Menu.prototype.show = function () {
            if (this.menu.className.indexOf("show") == -1)
                this.menu.className += " show";
            if (this.page.getDom().className.indexOf("hide " + this.position) == -1)
                this.page.getDom().className += " hide " + this.position;

            var _this = this;
            setTimeout(function () {
                _this.page.getDom().onclick = function () {
                    _this.toggle();
                };
            }, 0);

            this.visible = true;
        };

        Menu.prototype.hide = function () {
            if (this.menu.className.indexOf(" show") != -1)
                this.menu.className = this.menu.className.replace(" show", "");
            if (this.page.getDom().className.indexOf(" hide " + this.position) != -1)
                this.page.getDom().className = this.page.getDom().className.replace(" hide " + this.position, "");

            this.page.getDom().onclick = function () {
            };

            this.visible = false;
        };
        return Menu;
    })();
    mtscui.Menu = Menu;
})(mtscui || (mtscui = {}));
/// <reference path="Window.ts"/>
/// <reference path="WindowManager.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
var mtscui;
(function (mtscui) {
    var Popup = (function (_super) {
        __extends(Popup, _super);
        function Popup(closable, title, component) {
            _super.call(this, title);

            var page = this.getActualPage();
            if (component)
                page.add(component);

            this.getDom().className += " popup";

            mtscui.WindowManager.openModal(this, closable);
        }
        return Popup;
    })(mtscui.Window);
    mtscui.Popup = Popup;
})(mtscui || (mtscui = {}));
/// <reference path="Window.ts"/>
/// <reference path="WindowManager.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="Popup.ts"/>
var mtscui;
(function (mtscui) {
    var AlertBox = (function (_super) {
        __extends(AlertBox, _super);
        function AlertBox(title, text, callback) {
            var component = new mtscui.Component(document.createElement("div"));

            var textelem = document.createElement("p");
            var textnode = document.createTextNode("" + text);
            textelem.appendChild(textnode);

            component.add(new mtscui.Component(textelem));

            var buttonelem = document.createElement("input");
            buttonelem.setAttribute("type", "button");
            buttonelem.setAttribute("value", "ok");
            buttonelem.onclick = function () {
                if (callback)
                    callback();
            };
            component.add(new mtscui.Component(buttonelem));

            _super.call(this, false, title, component);
        }
        return AlertBox;
    })(mtscui.Popup);
    mtscui.AlertBox = AlertBox;
})(mtscui || (mtscui = {}));
/// <reference path="mtscui/Window.ts"/>
/// <reference path="mtscui/WindowManager.ts"/>
/// <reference path="mtscui/Page.ts"/>
/// <reference path="mtscui/Menu.ts"/>
/// <reference path="mtscui/AlertBox.ts"/>
function createSimpleTextComponent(text) {
    var node = document.createElement("h1");
    var title = text || "";
    var titleNode = document.createTextNode(title.toString());
    node.appendChild(titleNode);

    return new mtscui.Component(node);
}

function createMenu(mypage, header, title, position) {
    var page = document.createElement("h1");
    page.innerHTML = "Blubber";
    var mymenupage = new mtscui.Component(page);

    var icon = document.createElement("span");
    icon.setAttribute("class", "fa fa-align-justify");
    icon.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    var mymenuicon = new mtscui.Component(icon);

    new mtscui.Menu(mypage, header, mymenuicon, mymenupage, position);
}

function createWindow(title, content, modal) {
    var mywindow = new mtscui.Window(title);
    var mypage = mywindow.getActualPage();

    var header = new mtscui.Header();
    mypage.addHeader(header);

    createMenu(mypage, header, "LEFT", "left");
    createMenu(mypage, header, "RIGHT", "right");

    mypage.add(createSimpleTextComponent(content));

    var link = document.createElement("div");
    link.setAttribute("class", "fa fa-arrow-right");
    link.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    link.innerHTML = "goto";
    link.onclick = function () {
        var newpage = mypage.getWindow().createPage("New Page");
        mypage.getWindow().navigateTo(newpage);

        var link = document.createElement("div");
        link.setAttribute("class", "fa fa-arrow-left");
        link.setAttribute("style", "font-size: 34px; padding-top: 4px;");
        link.innerHTML = "back";
        link.onclick = function () {
            newpage.getWindow().back();
        };
        newpage.add(new mtscui.Component(link));
    };
    mypage.add(new mtscui.Component(link));

    var linkmodal = document.createElement("div");
    linkmodal.setAttribute("class", "fa fa-arrow-up");
    linkmodal.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    linkmodal.innerHTML = "open modal";
    linkmodal.onclick = function () {
        createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd ", true);
    };
    mypage.add(new mtscui.Component(linkmodal));

    var linkalert = document.createElement("div");
    linkalert.setAttribute("class", "fa fa-arrow-up");
    linkalert.setAttribute("style", "font-size: 34px; padding-top: 4px;");
    linkalert.innerHTML = "open AlertBox";
    linkalert.onclick = function () {
        new mtscui.AlertBox("Achtung", "Achtung text", function () {
            mtscui.WindowManager.close();
        });
    };
    mypage.add(new mtscui.Component(linkalert));

    if (modal)
        mtscui.WindowManager.openModal(mywindow, true);
else
        mtscui.WindowManager.openFullscreen(mywindow);
}

window.onload = function () {
    createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd ", false);
    /*setTimeout(function(){createWindow("2", "jl hsdflkjhkjdaf kjds", false);}, 1000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds", false);}, 2000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds", false);}, 3000);
    setTimeout(function(){createWindow("3", "jl hsdflkjhkjdaf kjds", false);}, 4000);*/
};
