var ts;
(function (ts) {
    (function (util) {
        var Stack = (function () {
            function Stack(in_array) {
                if (in_array)
                    this.array = in_array;
                else
                    this.array = new Array();
            }
            Stack.prototype.push = function (item) {
                this.array.push(item);
            };

            Stack.prototype.pop = function () {
                return this.array.pop();
            };

            Stack.prototype.peek = function () {
                if (this.empty())
                    return;
                return this.array[this.array.length - 1];
            };

            Stack.prototype.size = function () {
                return this.array.length;
            };

            Stack.prototype.empty = function () {
                return this.array.length == 0;
            };

            Stack.prototype.toArray = function () {
                return this.array;
            };
            return Stack;
        })();
        util.Stack = Stack;
    })(ts.util || (ts.util = {}));
    var util = ts.util;
})(ts || (ts = {}));
var ts;
(function (ts) {
    (function (ui) {
        // XMLHttpRequest for IE6, IE5
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
                    if (xhr.readyState == 4) {
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
    })(ts.ui || (ts.ui = {}));
    var ui = ts.ui;
})(ts || (ts = {}));
/// <reference path="ResourceLoader.ts"/>

var ts;
(function (ts) {
    (function (ui) {
        var TemplateCache = (function () {
            function TemplateCache() {
            }
            TemplateCache.put = function (key, element) {
                var styles = element.getElementsByTagName("style");

                for (var i = 0; i < styles.length; i++) {
                    document.head.appendChild(styles[i]);
                }
                for (var i = 0; i < styles.length; i++) {
                    element.removeChild(styles[i]);
                }

                TemplateCache.cache[key] = element.cloneNode(true);
            };

            TemplateCache.get = function (key) {
                var element = TemplateCache.cache[key];
                if (element) {
                    element = element.cloneNode(true);
                    return element;
                } else {
                    return null;
                }
            };
            TemplateCache.cache = new Array();
            return TemplateCache;
        })();

        var View = (function () {
            // you can construct your view with:
            // - HTMLElement
            // - Template HTMLElement, you will receive the content of the template Element in a new span
            // - Path (string) Content of this HTML File will be loaded inside a span element which will be you instance object
            function View(template, onload, data, match) {
                if (template.constructor === String) {
                    if (!template || template == "")
                        return false;

                    if (template.indexOf(".xsl") != -1) {
                        if (onload) {
                            var _this = this;
                            new ts.ui.ResourceLoader().loadXML(template, function (xsl) {
                                var xsltProcessor = new XSLTProcessor();
                                xsltProcessor.importStylesheet(xsl);
                                var xml = View.toXML(data, match);
                                _this.instance = xsltProcessor.transformToFragment(xml, document);
                                setTimeout(onload, 0);
                            });
                        } else {
                            var xsl = new ts.ui.ResourceLoader().loadXML(template);
                            var xsltProcessor = new XSLTProcessor();
                            xsltProcessor.importStylesheet(xsl);
                            var xml = View.toXML(data, match);
                            this.instance = xsltProcessor.transformToFragment(xml, document);
                        }
                    } else {
                        if (onload) {
                            var _this = this;

                            var instance = TemplateCache.get(template);
                            if (instance) {
                                this.instance = instance;
                            } else {
                                new ts.ui.ResourceLoader().load(template, function (content) {
                                    _this.instance = document.createElement("span");
                                    _this.instance.innerHTML = content;

                                    TemplateCache.put(template, _this.instance);

                                    setTimeout(onload, 0);
                                });
                            }
                        } else {
                            var instance = TemplateCache.get(template);
                            if (instance) {
                                this.instance = instance;
                            } else {
                                var content = new ts.ui.ResourceLoader().load(template);
                                this.instance = document.createElement("span");
                                this.instance.innerHTML = content;

                                TemplateCache.put(template, this.instance);
                            }
                        }
                    }
                } else if (template instanceof HTMLElement) {
                    if (template.nodeName == "TEMPLATE") {
                        this.instance = document.createElement("span");
                        this.instance.innerHTML = template.innerHTML;
                    } else if (template.parentNode == null) {
                        this.instance = template;
                    } else {
                        this.instance = template;
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

            View.prototype.append = function (parent) {
                if (parent && this.instance)
                    parent.appendChild(this.instance);
            };

            View.prototype.deinit = function () {
            };

            View.prototype.supplant = function (o) {
                this.instance.innerHTML = this.instance.innerHTML.replace(/\{([^{}]*)\}/g, function (a, b) {
                    var r = o[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                });
            };

            View.prototype.getHTMLElementsByName = function (name) {
                if (this.instance.querySelector) {
                    return this.instance.querySelectorAll("[name=" + name + "]");
                }

                var elements = new Array();
                this._traversAllChildNodes(function (element) {
                    if (element.getAttribute && element.getAttribute("name") == name)
                        elements.push(element);
                }, this.instance);
                return elements;
            };

            View.prototype.getHTMLElementsByAttribute = function (attribute, value) {
                if (this.instance.querySelector) {
                    if (attribute === "class")
                        return this.instance.querySelectorAll("." + value);
                    return this.instance.querySelectorAll("[" + attribute + "=" + value + "]");
                }

                var elements = new Array();
                this._traversAllChildNodes(function (element) {
                    if (element.getAttribute && element.getAttribute(attribute) == value)
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

            View.prototype.traversAllChildNodes = function (visitor, instance) {
                this._traversAllChildNodes(visitor, instance);
            };

            View.prototype.getHTMLElementById = function (id) {
                if (this.instance.querySelector) {
                    return this.instance.querySelector("#" + id);
                }

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

            View.toXML = function (obj, name) {
                if (!name)
                    name = "root";
                var xml = document.createElement("" + name);
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if (obj[prop] instanceof Array) {
                            for (var i = 0; i < obj[prop].length; i++) {
                                xml.appendChild(View.toXML(obj[prop][i], prop));
                            }
                        } else if (typeof obj[prop] == "object") {
                            xml.appendChild(View.toXML(obj[prop], prop));
                        } else if (typeof obj[prop] == "function") {
                        } else {
                            var element = document.createElement(prop);
                            var value = document.createTextNode("" + obj[prop]);
                            element.appendChild(value);
                            xml.appendChild(element);
                        }
                    }
                }
                return xml;
            };
            return View;
        })();
        ui.View = View;
    })(ts.ui || (ts.ui = {}));
    var ui = ts.ui;
})(ts || (ts = {}));
/// <reference path="List.ts"/>
var ts;
(function (ts) {
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
                        if (node.prev)
                            node.prev.next = node.next;
                        if (node.next)
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
    })(ts.util || (ts.util = {}));
    var util = ts.util;
})(ts || (ts = {}));
/// <reference path="../libts/util/List.ts"/>
/// <reference path="../libts/util/LinkedList.ts"/>
/// <reference path="../libts/ui/View.ts"/>
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
/// <reference path="../libts/ui/View.ts"/>
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
/// <reference path="../libts/ui/View.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Window.ts"/>
var mtsui;
(function (mtsui) {
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(window, title) {
            this.window = window;
            this.div = document.createElement("div");
            this.div.setAttribute("class", "mtsui page");

            var body = document.createElement("div");
            body.setAttribute("class", "mtsui content");

            _super.call(this, body);

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
        Page.prototype.getWindow = function () {
            return this.window;
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

        Page.prototype.getDom = function () {
            return this.div;
        };
        return Page;
    })(mtsui.Component);
    mtsui.Page = Page;
})(mtsui || (mtsui = {}));
/// <reference path="../libts/util/Stack.ts"/>
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
            // Remove window from body
            window.deinit();
            document.body.removeChild(window.getDom());

            if (window == WindowManager.windowStack.peek()) {
                WindowManager.windowStack.pop();
                var window = WindowManager.windowStack.peek();
                if (window)
                    window.getDom().className = window.getDom().className.replace(" hide", "");
            }
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
/// <reference path="../libts/util/Stack.ts"/>
/// <reference path="../libts/ui/View.ts"/>
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

            var page = new mtsui.Page(this, title);
            instance.appendChild(page.getDom());
            this.pageStack.push(page);
        }
        Window.prototype.getActualPage = function () {
            var page = this.pageStack.peek();

            return page;
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

            if (oldPage)
                oldPage.getDom().className += " transition " + transitiontype + " hide left";

            this.pageStack.push(page);
        };

        Window.prototype.back = function () {
            var oldPage = this.pageStack.pop();
            var page = this.pageStack.peek();

            oldPage.getDom().className += " transition slide hide right";

            var superdom = this.getDom();
            setTimeout(function () {
                page.getDom().className = page.getDom().className.replace(" transition slide hide left", " transition slide hide in");
            }, 0);

            setTimeout(function () {
                oldPage.getDom().className = oldPage.getDom().className.replace(" transition slide hide right", "");
                if (oldPage.getDom().parentNode == superdom)
                    superdom.removeChild(oldPage.getDom());

                page.getDom().className = page.getDom().className.replace(" transition slide hide in", "");
            }, 1000);
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
            } else if (value instanceof mtsui.Component) {
                _super.call(this, this.item);

                var tr = document.createElement("tr");
                var text = document.createElement("td");
                text.appendChild(value.getDom());
                tr.appendChild(text);
                _super.prototype.getDom.call(this).firstChild.appendChild(tr);
            } else if (value) {
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
                _super.prototype.getDom.call(this).firstChild.firstChild.insertBefore(icon, _super.prototype.getDom.call(this).firstChild.firstChild);
            else
                _super.prototype.getDom.call(this).firstChild.firstChild.appendChild(icon);
        }
        return ListItemDecorator;
    })(ListItem);
    mtsui.ListItemDecorator = ListItemDecorator;

    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            var list = document.createElement("div");
            list.setAttribute("class", "mtsui list");

            _super.call(this, list);
        }
        List.prototype.add = function (listItem) {
            _super.prototype.add.call(this, listItem);
        };

        List.prototype.remove = function (listItem) {
            _super.prototype.remove.call(this, listItem);
        };

        List.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return List;
    })(mtsui.Component);
    mtsui.List = List;
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
                        } else if (direction == "right") {
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
                    } else if (draging && direction == "left" && lastPos <= (width / 2)) {
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
                        } else if (direction == "right") {
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
                    } else if (draging && direction == "left" && lastPos <= (width / 2)) {
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
