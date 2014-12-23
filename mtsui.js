/// <reference path="../libts.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mtsui;
(function (mtsui) {
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(template) {
            _super.call(this, template);
            this.dom = document.createElement("div");
            this.dom.setAttribute("class", "mtsui component");
        }
        Component.prototype.add = function (component) {
            _super.prototype.getDom.call(this).appendChild(component.getDom());
        };
        Component.prototype.remove = function (component) {
            _super.prototype.getDom.call(this).removeChild(component.getDom());
        };
        Component.prototype.clear = function () {
            _super.prototype.getDom.call(this).innerHTML = "";
        };
        Component.prototype.getDom = function () {
            this.dom.appendChild(_super.prototype.getDom.call(this));
            return this.dom;
        };
        return Component;
    })(ts.ui.View);
    mtsui.Component = Component;
})(mtsui || (mtsui = {}));
/// <reference path="../libts.d.ts"/>
/// <reference path="Component.ts"/>
var mtsui;
(function (mtsui) {
    var Header = (function (_super) {
        __extends(Header, _super);
        function Header(left, middle, right) {
            var instance = document.createElement("div");
            instance.setAttribute("class", "mtsui header");
            this.left = left;
            this.middle = middle;
            this.right = right;
            if (!this.left) {
                var dom = document.createElement("span");
                this.left = new mtsui.Component(dom);
            }
            var dom = this.left.getDom();
            dom.setAttribute("class", "mtsui left");
            instance.appendChild(dom);
            if (!this.middle) {
                var dom = document.createElement("span");
                this.middle = new mtsui.Component(dom);
            }
            var dom = this.middle.getDom();
            dom.setAttribute("class", "mtsui middle");
            instance.appendChild(dom);
            if (!this.right) {
                var dom = document.createElement("span");
                this.right = new mtsui.Component(dom);
            }
            var dom = this.right.getDom();
            dom.setAttribute("class", "mtsui right");
            instance.appendChild(dom);
            _super.call(this, instance);
        }
        Header.prototype.setLeft = function (comp) {
            this.getDom().removeChild(this.left.getDom());
            this.left = comp;
            var dom = this.left.getDom();
            dom.setAttribute("class", "mtsui left");
            this.getDom().insertBefore(dom, this.middle.getDom());
        };
        Header.prototype.setMiddle = function (comp) {
            this.getDom().removeChild(this.middle.getDom());
            this.middle = comp;
            var dom = this.middle.getDom();
            dom.setAttribute("class", "mtsui middle");
            this.getDom().insertBefore(dom, this.right.getDom());
        };
        Header.prototype.setRight = function (comp) {
            this.getDom().removeChild(this.right.getDom());
            this.right = comp;
            var dom = this.right.getDom();
            dom.setAttribute("class", "mtsui right");
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
    })(ts.ui.View);
    mtsui.Header = Header;
})(mtsui || (mtsui = {}));
/// <reference path="../libts.d.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Window.ts"/>
var mtsui;
(function (mtsui) {
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(title) {
            this.div = document.createElement("div");
            this.div.setAttribute("class", "mtsui page");
            this.body = document.createElement("div");
            this.body.setAttribute("class", "mtsui content");
            _super.call(this, this.body);
            this.div.appendChild(_super.prototype.getDom.call(this));
            this.title = title;
            if (this.title) {
                this.header = new mtsui.Header();
                _super.prototype.getDom.call(this).insertBefore(this.header.getDom(), _super.prototype.getDom.call(this).firstChild);
                var node = document.createElement("h1");
                var title = this.title || "";
                var titleNode = document.createTextNode(title.toString());
                node.appendChild(titleNode);
                this.header.setMiddle(new mtsui.Component(node));
            }
        }
        Page.prototype.beforeDisplay = function () {
        };
        Page.prototype.beforeHide = function () {
        };
        Page.prototype.deinit = function () {
            this.beforeHide();
        };
        Page.prototype.addHeader = function (header) {
            if (this.header)
                this.div.removeChild(this.header.getDom());
            // check if our header has already some elements, if true copy them to new header if it havn't got its own
            if (this.header && this.header.getLeft().getDom().innerHTML != "<span></span>" && header.getLeft().getDom().innerHTML == "<span></span>")
                header.setLeft(this.header.getLeft());
            if (this.header && this.header.getMiddle().getDom().innerHTML != "<span></span>" && header.getMiddle().getDom().innerHTML == "<span></span>")
                header.setMiddle(this.header.getMiddle());
            if (this.header && this.header.getRight().getDom().innerHTML != "<span></span>" && header.getRight().getDom().innerHTML == "<span></span>")
                header.setRight(this.header.getRight());
            _super.prototype.getDom.call(this).insertBefore(header.getDom(), _super.prototype.getDom.call(this).firstChild);
            this.header = header;
        };
        Page.prototype.getHeader = function () {
            return this.header;
        };
        Page.prototype.getContent = function () {
            return this.body;
        };
        Page.prototype.getDom = function () {
            return this.div;
        };
        return Page;
    })(mtsui.Component);
    mtsui.Page = Page;
    var RefreshablePage = (function (_super) {
        __extends(RefreshablePage, _super);
        function RefreshablePage(icon, color, text, title) {
            _super.call(this, title);
            var refresh = document.createElement("div");
            refresh.textContent = text.toString();
            refresh.style.position = "relative";
            refresh.style.height = "0";
            refresh.style.top = "-25px";
            refresh.style.padding = "0";
            refresh.style.textAlign = "center";
            refresh.style.color = color.toString();
            var _this = this;
            var content = this.getContent();
            content.addEventListener("touchend", function () {
                if (content.scrollTop < -50) {
                    refresh.style.position = "static";
                    refresh.style.height = "40px";
                    refresh.style.top = "0";
                    refresh.style.padding = "0.5em";
                    refresh.insertBefore(icon.getDom(), refresh.firstChild);
                    _this.onRefresh(function () {
                        refresh.style.position = "relative";
                        refresh.style.height = "0";
                        refresh.style.top = "-25px";
                        refresh.style.padding = "0";
                        refresh.removeChild(icon.getDom());
                    });
                }
            });
            content.insertBefore(refresh, content.firstChild);
        }
        RefreshablePage.prototype.onRefresh = function (func) {
        };
        return RefreshablePage;
    })(Page);
    mtsui.RefreshablePage = RefreshablePage;
})(mtsui || (mtsui = {}));
/// <reference path="../libts.d.ts"/>
/// <reference path="Window.ts"/>
var mtsui;
(function (mtsui) {
    var WindowManager = (function () {
        function WindowManager() {
        }
        WindowManager.open = function (window) {
            // hide other window if exist
            var old = WindowManager.windowStack.peek();
            if (old) {
                old.getDom().className += " hide";
            }
            // Add new window to stack
            WindowManager.windowStack.push(window);
            // Append new window to body
            document.body.appendChild(window.getDom());
        };
        WindowManager.getActiveWindow = function () {
            return this.windowStack.peek();
        };
        WindowManager.openFullscreen = function (window) {
            window.getDom().className += " fullscreen";
            WindowManager.open(window);
        };
        WindowManager.openModal = function (window, closable) {
            var temp = new mtsui.Window();
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
        WindowManager.closeWindow = function (window) {
            if (window == WindowManager.windowStack.peek()) {
                this.close();
            }
            else {
                var windowStackArray = this.windowStack.toArray();
                this.windowStack = new ts.util.Stack(windowStackArray.splice(windowStackArray.indexOf(window, 1)));
                // Remove window from body
                window.deinit();
                document.body.removeChild(window.getDom());
            }
            if (this.windowStack.empty())
                history.back();
        };
        WindowManager.close = function () {
            var window = WindowManager.windowStack.pop();
            // Remove window from body
            window.deinit();
            document.body.removeChild(window.getDom());
            var window = WindowManager.windowStack.peek();
            if (window)
                window.getDom().className = window.getDom().className.replace(" hide", "");
        };
        WindowManager.windowStack = new ts.util.Stack();
        return WindowManager;
    })();
    mtsui.WindowManager = WindowManager;
})(mtsui || (mtsui = {}));
/// <reference path="../libts.d.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="WindowManager.ts"/>
var mtsui;
(function (mtsui) {
    var Window = (function (_super) {
        __extends(Window, _super);
        function Window(title) {
            this.pageStack = new ts.util.Stack();
            var instance = document.createElement("div");
            instance.setAttribute("class", "mtsui window");
            _super.call(this, instance);
            var page = new mtsui.Page(title);
            instance.appendChild(page.getDom());
            this.pageStack.push(page);
        }
        Window.prototype.getActualPage = function () {
            var page = this.pageStack.peek();
            return page;
        };
        Window.prototype.setActualPage = function (page) {
            var oldPage = this.pageStack.pop();
            this.pageStack.push(page);
            this.getDom().replaceChild(page.getDom(), oldPage.getDom());
        };
        Window.prototype.deleteStack = function () {
            while (this.pageStack.size() > 0) {
                var page = this.pageStack.pop();
                if (page) {
                    page.deinit();
                    this.getDom().removeChild(page.getDom());
                }
            }
        };
        Window.prototype.close = function () {
            mtsui.WindowManager.closeWindow(this);
        };
        Window.prototype.deinit = function () {
            this.deleteStack();
            _super.prototype.deinit.call(this);
        };
        Window.prototype.navigateTo = function (page, transitiontype) {
            if (!transitiontype)
                transitiontype = "slide";
            var oldPage = this.pageStack.peek();
            this.getDom().appendChild(page.getDom());
            page.getDom().className += " transition " + transitiontype + " hide right";
            setTimeout(function () {
                page.getDom().className = page.getDom().className.replace(" transition " + transitiontype + " hide right", " transition " + transitiontype + " hide in");
            }, 0);
            setTimeout(function () {
                page.getDom().className = page.getDom().className.replace(" transition " + transitiontype + " hide in", "");
            }, 1000);
            if (oldPage) {
                oldPage.beforeHide();
                oldPage.getDom().className += " transition " + transitiontype + " hide left";
            }
            this.pageStack.push(page);
        };
        Window.prototype.back = function () {
            var oldPage = this.pageStack.pop();
            var page = this.pageStack.peek();
            if (page) {
                page.beforeDisplay();
                var superdom = this.getDom();
                setTimeout(function () {
                    page.getDom().className = page.getDom().className.replace(" transition slide hide left", " transition slide hide in");
                }, 0);
            }
            oldPage.getDom().className += " transition slide hide right";
            setTimeout(function () {
                oldPage.getDom().className = oldPage.getDom().className.replace(" transition slide hide right", "");
                oldPage.deinit();
                if (oldPage.getDom().parentNode == superdom)
                    superdom.removeChild(oldPage.getDom());
                page.getDom().className = page.getDom().className.replace(" transition slide hide in", "");
            }, 1000);
            if (this.pageStack.empty())
                this.close();
        };
        return Window;
    })(ts.ui.View);
    mtsui.Window = Window;
})(mtsui || (mtsui = {}));
/// <reference path="Window.ts"/>
/// <reference path="WindowManager.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
var mtsui;
(function (mtsui) {
    var Popup = (function (_super) {
        __extends(Popup, _super);
        function Popup(closable, title, component) {
            _super.call(this, title);
            var page = this.getActualPage();
            if (component)
                page.add(component);
            this.getDom().className += " popup";
            mtsui.WindowManager.openModal(this, closable);
        }
        return Popup;
    })(mtsui.Window);
    mtsui.Popup = Popup;
})(mtsui || (mtsui = {}));
/// <reference path="Window.ts"/>
/// <reference path="WindowManager.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="Popup.ts"/>
var mtsui;
(function (mtsui) {
    var AlertBox = (function (_super) {
        __extends(AlertBox, _super);
        function AlertBox(title, text, callback) {
            var component = new mtsui.Component(document.createElement("div"));
            var textelem = document.createElement("p");
            var textnode = document.createTextNode("" + text);
            textelem.appendChild(textnode);
            component.add(new mtsui.Component(textelem));
            var buttonelem = document.createElement("input");
            buttonelem.setAttribute("type", "button");
            buttonelem.setAttribute("value", "ok");
            buttonelem.onclick = function () {
                if (callback)
                    callback();
            };
            component.add(new mtsui.Component(buttonelem));
            _super.call(this, false, title, component);
        }
        return AlertBox;
    })(mtsui.Popup);
    mtsui.AlertBox = AlertBox;
})(mtsui || (mtsui = {}));
/// <reference path="Component.ts"/>
var mtsui;
(function (mtsui) {
    var Icon = (function (_super) {
        __extends(Icon, _super);
        function Icon(type) {
            var icon = document.createElement("span");
            icon.setAttribute("class", "" + type);
            _super.call(this, icon);
        }
        return Icon;
    })(mtsui.Component);
    mtsui.Icon = Icon;
})(mtsui || (mtsui = {}));
/// <reference path="Component.ts"/>
/// <reference path="Icon.ts"/>
var mtsui;
(function (mtsui) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(value, click_cb) {
            this.input = document.createElement("button");
            this.input.setAttribute("class", "mtsui button");
            var text = document.createElement("span");
            text.appendChild(document.createTextNode("" + value));
            this.input.appendChild(text);
            this.input.onclick = function () {
                if (click_cb)
                    click_cb();
            };
            _super.call(this, this.input);
        }
        Button.prototype.setType = function (type) {
            this.input.setAttribute("type", type);
        };
        Button.prototype.disable = function () {
            this.input.disabled = true;
        };
        Button.prototype.enable = function () {
            this.input.disabled = false;
        };
        Button.prototype.addIcon = function (icon_comp, pos) {
            var icon = icon_comp.getDom();
            icon.setAttribute("class", "mtsui icon " + pos);
            if (this.icon)
                this.getDom().firstChild.removeChild(this.icon);
            var input = this.getDom().firstChild;
            var inputFirstChild = this.getDom().firstChild.firstChild;
            if (!pos || pos === "right") {
                input.appendChild(icon);
                icon.style.display = "inline";
                inputFirstChild.style.display = "inline";
            }
            if (pos === "left") {
                input.insertBefore(icon, inputFirstChild);
                icon.style.display = "inline";
                inputFirstChild.style.display = "inline";
            }
            if (pos === "top") {
                inputFirstChild.style.display = "block";
                input.insertBefore(icon, inputFirstChild);
            }
            if (pos === "bottom") {
                inputFirstChild.style.display = "block";
                input.appendChild(icon);
            }
            this.icon = icon;
        };
        return Button;
    })(mtsui.Component);
    mtsui.Button = Button;
})(mtsui || (mtsui = {}));
/// <reference path="Component.ts"/>
var mtsui;
(function (mtsui) {
    var ListItem = (function (_super) {
        __extends(ListItem, _super);
        function ListItem(value) {
            this.value = value;
            this.item = document.createElement("table");
            this.item.setAttribute("class", "mtsui listitem");
            if (value instanceof ListItem) {
                this.item = value.getDom().firstChild;
                _super.call(this, this.item);
            }
            else if (value instanceof mtsui.Component) {
                _super.call(this, this.item);
                var tr = document.createElement("tr");
                var text = document.createElement("td");
                text.appendChild(value.getDom());
                tr.appendChild(text);
                _super.prototype.getDom.call(this).firstChild.appendChild(tr);
            }
            else if (value) {
                _super.call(this, this.item);
                var tr = document.createElement("tr");
                var text = document.createElement("td");
                text.setAttribute("class", "mtsui listtext");
                text.appendChild(document.createTextNode("" + value));
                tr.appendChild(text);
                _super.prototype.getDom.call(this).firstChild.appendChild(tr);
            }
        }
        ListItem.prototype.getValue = function () {
            return this.value;
        };
        ListItem.prototype.getItem = function () {
            return this.item;
        };
        ListItem.prototype.setOnclick = function (func) {
            this.item.onclick = function () {
                func();
            };
        };
        return ListItem;
    })(mtsui.Component);
    mtsui.ListItem = ListItem;
    var ListItemDecorator = (function (_super) {
        __extends(ListItemDecorator, _super);
        // TODO : exchange comp and value       
        function ListItemDecorator(comp, value, position) {
            _super.call(this, value);
            var compdom = comp.getDom();
            compdom.className += " " + position;
            var icon = document.createElement("td");
            icon.appendChild(compdom);
            if (position && position === "right")
                _super.prototype.getDom.call(this).firstChild.firstChild.appendChild(icon);
            if (position && position === "left")
                _super.prototype.getDom.call(this).firstChild.firstChild.insertBefore(icon, _super.prototype.getDom.call(this).firstChild.firstChild.firstChild);
            else
                _super.prototype.getDom.call(this).firstChild.firstChild.appendChild(icon);
        }
        return ListItemDecorator;
    })(ListItem);
    mtsui.ListItemDecorator = ListItemDecorator;
    var List = (function (_super) {
        __extends(List, _super);
        function List(value) {
            if (value instanceof List) {
                this.list = value.getDom().firstChild;
            }
            else {
                this.list = document.createElement("div");
                this.list.setAttribute("class", "mtsui list");
            }
            _super.call(this, this.list);
        }
        return List;
    })(mtsui.Component);
    mtsui.List = List;
    var ListSwipeDecorator = (function (_super) {
        __extends(ListSwipeDecorator, _super);
        function ListSwipeDecorator(value, deleteIcon, color) {
            _super.call(this, value);
            this.value = value;
            this.deleteIcon = deleteIcon;
            this.color = color;
        }
        ListSwipeDecorator.prototype.add = function (listItem, deleteCallback) {
            this.value.add(listItem);
            var style = listItem.getDom().style;
            style.position = "relative";
            var button = document.createElement("div");
            button.style.position = "absolute";
            button.style.right = "-" + ListSwipeDecorator.ELEMENT_SIZE + "px";
            button.style.width = ListSwipeDecorator.ELEMENT_SIZE + "px";
            button.style.height = "100%";
            button.style.backgroundColor = this.color.toString();
            button.style.textAlign = "center";
            button.style.paddingTop = "40%";
            button.style.paddingTop = "6%";
            button.style.color = "white";
            button.style.fontSize = "1.8em";
            button.appendChild(this.deleteIcon.getDom().cloneNode(true));
            button.onclick = function (e) {
                deleteCallback();
            };
            listItem.getDom().appendChild(button);
            var startPos = 0;
            var firstPos = 0;
            var state = "hidden";
            listItem.getItem().addEventListener('touchmove', function (in_e) {
                var e = in_e;
                if (startPos == 0)
                    startPos = e.pageX;
                var newPos = e.pageX - startPos;
                if (state == "visible")
                    newPos -= ListSwipeDecorator.ELEMENT_SIZE;
                var style = listItem.getDom().style;
                style.webkitTransform = "translate3d(" + newPos + "px, 0, 0)";
                style.transform = "translate3d(" + newPos + "px, 0, 0)";
                e.preventDefault();
            }, false);
            listItem.getItem().addEventListener('touchend', function (in_e) {
                var e = in_e;
                var newPos = e.pageX - startPos;
                if (state == "hidden" && -newPos >= ListSwipeDecorator.ELEMENT_SIZE) {
                    newPos = -ListSwipeDecorator.ELEMENT_SIZE;
                    state = "visible";
                }
                else if (state == "visible" && newPos <= ListSwipeDecorator.ELEMENT_SIZE) {
                    if (newPos > 0) {
                        newPos = 0;
                        state = "hidden";
                    }
                    else {
                        newPos = -ListSwipeDecorator.ELEMENT_SIZE;
                    }
                }
                else {
                    newPos = 0;
                }
                startPos = 0;
                firstPos = 0;
                newPos = Math.min(0, newPos);
                var style = listItem.getDom().style;
                style.webkitTransform = "translate3d(" + newPos + "px, 0, 0)";
                style.transform = "translate3d(" + newPos + "px, 0, 0)";
            }, false);
        };
        ListSwipeDecorator.prototype.remove = function (listItem) {
            this.value.remove(listItem);
        };
        ListSwipeDecorator.prototype.clear = function () {
            this.value.clear();
        };
        ListSwipeDecorator.ELEMENT_SIZE = 80;
        return ListSwipeDecorator;
    })(List);
    mtsui.ListSwipeDecorator = ListSwipeDecorator;
})(mtsui || (mtsui = {}));
/// <reference path="Component.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Window.ts"/>
var global_window = window;
var mtsui;
(function (mtsui) {
    var Menu = (function () {
        function Menu(window, content, position, slide) {
            this.window = window;
            this.position = position;
            this.slide = slide;
            this.menu = document.createElement("div");
            this.menu.setAttribute("class", "mtsui menu page " + position);
            this.menu.appendChild(content.getDom());
            // TODO: create gesture for slide in
            if (this.slide) {
                this.menu.addEventListener('touchmove', function (in_e) {
                    var e = in_e;
                    if (global_window.event)
                        global_window.event.cancelBubble = true;
                    e.stopPropagation();
                }, false);
                var _this = this;
                var draging = false;
                var direction = "";
                var lastPos = 0;
                var visible = false;
                var width = 0;
                window.getDom().addEventListener('touchmove', function (in_e) {
                    var page = _this.window.getActualPage();
                    var style = page.getDom().style;
                    width = width || window.getDom().scrollWidth;
                    var e = in_e;
                    if ((draging && direction == position) || (position == "left" && e.pageX <= Menu.OFFSET) || (position == "right" && e.pageX >= (width - Menu.OFFSET))) {
                        if (position == "left")
                            direction = "left";
                        if (position == "right")
                            direction = "right";
                        if (!draging) {
                            draging = true;
                            style.transition = "none";
                        }
                        if (!visible && lastPos != 0) {
                            _this.show();
                            visible = true;
                        }
                        lastPos = e.pageX;
                        if (direction == "left") {
                            style.webkitTransform = "translate3d(" + e.pageX + "px, 0, 0)";
                            style.transform = "translate3d(" + e.pageX + "px, 0, 0)";
                        }
                        else if (direction == "right") {
                            style.webkitTransform = "translate3d(" + (e.pageX - width) + "px, 0, 0)";
                            style.transform = "translate3d(" + (e.pageX - width) + "px, 0, 0)";
                        }
                        e.preventDefault();
                    }
                }, false);
                window.getDom().addEventListener('touchend', function (in_e) {
                    var page = _this.window.getActualPage();
                    var style = page.getDom().style;
                    if (draging && direction == "right" && lastPos >= (width / 2)) {
                        _this.hide();
                    }
                    else if (draging && direction == "left" && lastPos <= (width / 2)) {
                        _this.hide();
                    }
                    draging = false;
                    visible = false;
                    style.transition = "";
                    style.webkitTransform = "";
                    style.transform = "";
                    lastPos = 0;
                    direction = "";
                }, false);
            }
        }
        Menu.prototype.deinit = function () {
            this.window.getDom().removeChild(this.menu);
        };
        Menu.prototype.addTo = function (header, icon) {
            this.window.getDom().appendChild(this.menu);
            if (this.position === "left")
                header.setLeft(icon);
            else if (this.position === "right")
                header.setRight(icon);
            var _this = this;
            icon.getDom().onclick = function () {
                _this.toggle();
            };
        };
        Menu.prototype.toggle = function () {
            if (this.visible)
                this.hide();
            else
                this.show();
        };
        Menu.prototype.show = function () {
            var page = this.window.getActualPage();
            var overlay = document.createElement("div");
            overlay.setAttribute("class", "mtsui page");
            if (this.slide) {
                var _this = this;
                var draging = false;
                var direction = "";
                var lastPos = 0;
                var visible = false;
                var width = 0;
                overlay.addEventListener('touchmove', function (in_e) {
                    var page = _this.window.getActualPage();
                    var style = page.getDom().style;
                    width = width || overlay.scrollWidth;
                    var e = in_e;
                    if ((draging && direction == _this.position) || (_this.position == "right" && e.pageX <= Menu.OFFSET) || (_this.position == "left" && e.pageX >= (width - Menu.OFFSET))) {
                        if (_this.position == "left")
                            direction = "left";
                        if (_this.position == "right")
                            direction = "right";
                        if (!draging) {
                            draging = true;
                            style.transition = "none";
                        }
                        if (!visible && lastPos != 0) {
                            visible = true;
                        }
                        lastPos = e.pageX;
                        if (direction == "left") {
                            style.webkitTransform = "translate3d(" + e.pageX + "px, 0, 0)";
                            style.transform = "translate3d(" + e.pageX + "px, 0, 0)";
                        }
                        else if (direction == "right") {
                            style.webkitTransform = "translate3d(" + (e.pageX - width) + "px, 0, 0)";
                            style.transform = "translate3d(" + (e.pageX - width) + "px, 0, 0)";
                        }
                    }
                    e.preventDefault();
                    if (global_window.event)
                        global_window.event.cancelBubble = true;
                    e.stopPropagation();
                }, false);
                overlay.addEventListener('touchend', function (in_e) {
                    var page = _this.window.getActualPage();
                    var style = page.getDom().style;
                    if (draging && direction == "right" && lastPos >= (width / 2)) {
                        _this.hide();
                    }
                    else if (draging && direction == "left" && lastPos <= (width / 2)) {
                        _this.hide();
                    }
                    draging = false;
                    visible = false;
                    style.transition = "";
                    style.webkitTransform = "";
                    style.transform = "";
                    lastPos = 0;
                    direction = "";
                }, false);
            }
            this.window.getDom().appendChild(overlay);
            if (this.menu.className.indexOf("show") == -1)
                this.menu.className += " show";
            if (page.getDom().className.indexOf("hide " + this.position) == -1)
                page.getDom().className += " hide " + this.position;
            if (overlay.className.indexOf(" menuoverlay hide " + this.position) == -1)
                overlay.className += " menuoverlay hide " + this.position;
            var _this = this;
            setTimeout(function () {
                overlay.onclick = function () {
                    _this.hide();
                };
            }, 0);
            this.visible = true;
        };
        Menu.prototype.hide = function () {
            var page = this.window.getActualPage();
            var overlay = this.window.getDom().querySelector(".menuoverlay");
            if (overlay)
                this.window.getDom().removeChild(overlay);
            if (page.getDom().className.indexOf(" hide " + this.position) != -1)
                page.getDom().className = page.getDom().className.replace(" hide " + this.position, "");
            var _this = this;
            setTimeout(function () {
                if (_this.menu.className.indexOf(" show") != -1)
                    _this.menu.className = _this.menu.className.replace(" show", "");
            }, 500);
            page.getDom().onclick = function () {
            };
            this.visible = false;
        };
        Menu.OFFSET = 50;
        return Menu;
    })();
    mtsui.Menu = Menu;
})(mtsui || (mtsui = {}));
