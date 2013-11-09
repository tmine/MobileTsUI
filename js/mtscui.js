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

            Stack.prototype.size = function () {
                return this.array.length;
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
/// <reference path="../../tsc/util/List.ts"/>
/// <reference path="../../tsc/util/LinkedList.ts"/>
/// <reference path="../../tsc/ui/View.ts"/>
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
        function Component(template, onload) {
            _super.call(this, template, onload);
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
/// <reference path="../../tsc/ui/View.ts"/>
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

            if (this.left) {
                var dom = this.left.getDom();
                dom.setAttribute("class", "mtscui left");
                instance.appendChild(dom);
            }
            if (this.middle) {
                var dom = this.middle.getDom();
                dom.setAttribute("class", "mtscui middle");
                instance.appendChild(dom);
            }
            if (this.right) {
                var dom = this.right.getDom();
                dom.setAttribute("class", "mtscui right");
                instance.appendChild(dom);
            }

            _super.call(this, instance);
        }
        Header.prototype.setLeft = function (comp) {
            this.left = comp;

            var dom = this.left.getDom();
            dom.setAttribute("class", "mtscui left");
            if (this.middle)
                _super.prototype.getDom.call(this).insertBefore(dom, this.middle.getDom());
else if (this.right)
                _super.prototype.getDom.call(this).insertBefore(dom, this.right.getDom());
else
                _super.prototype.getDom.call(this).appendChild(dom);
        };

        Header.prototype.setMiddle = function (comp) {
            this.middle = comp;

            var dom = this.middle.getDom();
            dom.setAttribute("class", "mtscui middle");
            if (this.right)
                _super.prototype.getDom.call(this).insertBefore(dom, this.right.getDom());
else
                _super.prototype.getDom.call(this).appendChild(dom);
        };

        Header.prototype.setRight = function (comp) {
            this.right = comp;

            var dom = this.right.getDom();
            dom.setAttribute("class", "mtscui right");
            _super.prototype.getDom.call(this).appendChild(dom);
        };
        return Header;
    })(tsc.ui.View);
    mtscui.Header = Header;
})(mtscui || (mtscui = {}));
/// <reference path="../../tsc/ui/View.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Window.ts"/>
var mtscui;
(function (mtscui) {
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(title) {
            this.header = new mtscui.Header();

            var body = document.createElement("div");
            body.setAttribute("class", "mtscui content");
            this.body = new mtscui.Component(body);

            var instance = document.createElement("div");
            instance.setAttribute("class", "mtscui page");

            instance.appendChild(this.header.getDom());
            instance.appendChild(this.body.getDom());

            _super.call(this, instance);

            this.title = title;

            var node = document.createElement("h1");
            var title = this.title || "";
            var titleNode = document.createTextNode(title.toString());
            node.appendChild(titleNode);

            this.header.setMiddle(new mtscui.Component(node));
        }
        Page.prototype.setWindow = function (window) {
            this.window = window;
        };

        Page.prototype.add = function (component) {
            this.body.add(component);
        };

        Page.prototype.remove = function (component) {
            this.body.remove(component);
        };

        Page.prototype.getHeader = function () {
            return this.header;
        };
        return Page;
    })(tsc.ui.View);
    mtscui.Page = Page;
})(mtscui || (mtscui = {}));
/// <reference path="../../tsc/util/Stack.ts"/>
/// <reference path="../../tsc/ui/View.ts"/>
/// <reference path="Page.ts"/>
var mtscui;
(function (mtscui) {
    var Window = (function (_super) {
        __extends(Window, _super);
        function Window(page) {
            this.pageStack = new tsc.util.Stack();

            var instance = document.createElement("div");
            instance.setAttribute("class", "mtscui window");

            if (page) {
                page.setWindow(this);
                instance.appendChild(page.getDom());
                this.pageStack.push(page);
            }

            _super.call(this, instance);
        }
        Window.prototype.navigateTo = function (page/* TODO: Transition */ ) {
        };
        return Window;
    })(tsc.ui.View);
    mtscui.Window = Window;
})(mtscui || (mtscui = {}));
/// <reference path="../../tsc/util/Stack.ts"/>
/// <reference path="Window.ts"/>
var mtscui;
(function (mtscui) {
    var WindowManager = (function () {
        function WindowManager() {
        }
        WindowManager.open = function (window/* TODO: Type (Modal, Fullscreen, normal) */ ) {
            // hide other window if exist
            var old = WindowManager.windowStack.pop();
            if (old) {
                old.getDom().className = "mtscui window hide";

                WindowManager.windowStack.push(old);
            }

            // Add new window to stack
            WindowManager.windowStack.push(window);

            // Append new window to body
            document.body.appendChild(window.getDom());
        };

        WindowManager.close = function () {
            var window = WindowManager.windowStack.pop();

            // Remove window from body
            document.body.removeChild(window.getDom());
        };
        WindowManager.windowStack = new tsc.util.Stack();
        return WindowManager;
    })();
    mtscui.WindowManager = WindowManager;
})(mtscui || (mtscui = {}));
/// <reference path="mtscui/Window.ts"/>
/// <reference path="mtscui/WindowManager.ts"/>
/// <reference path="mtscui/Page.ts"/>
function createSimpleTextComponent(text) {
    var node = document.createElement("h1");
    var title = text || "";
    var titleNode = document.createTextNode(title.toString());
    node.appendChild(titleNode);

    return new mtscui.Component(node);
}

function createWindow(title, content) {
    var mypage = new mtscui.Page(title);
    mypage.getHeader().setLeft(createSimpleTextComponent("LEFT"));
    mypage.getHeader().setRight(createSimpleTextComponent("RIGHT"));
    mypage.add(createSimpleTextComponent(content));

    var mywindow = new mtscui.Window(mypage);
    mtscui.WindowManager.open(mywindow);
}

window.onload = function () {
    createWindow("1", "sdkljfhlskdj hfkjshdf kjhsakjlf sdkaljhf kjlsd ");
    setTimeout(function () {
        createWindow("2", "jl hsdflkjhkjdaf kjds");
    }, 1000);
    setTimeout(function () {
        createWindow("3", "jl hsdflkjhkjdaf kjds");
    }, 2000);
    setTimeout(function () {
        createWindow("3", "jl hsdflkjhkjdaf kjds");
    }, 3000);
    setTimeout(function () {
        createWindow("3", "jl hsdflkjhkjdaf kjds");
    }, 4000);
};
