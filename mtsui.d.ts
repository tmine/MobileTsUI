/// <reference path="libts.d.ts" />
declare module mtsui {
    class Component extends ts.ui.View {
        private dom;
        constructor(template: any);
        add(component: Component): void;
        remove(component: Component): void;
        clear(): void;
        getDom(): HTMLElement;
    }
}
declare module mtsui {
    class Header extends ts.ui.View {
        private right;
        private middle;
        private left;
        constructor(left?: Component, middle?: Component, right?: Component);
        setLeft(comp: Component): void;
        setMiddle(comp: Component): void;
        setRight(comp: Component): void;
        getLeft(): Component;
        getMiddle(): Component;
        getRight(): Component;
    }
}
declare module mtsui {
    class Page extends Component {
        private title;
        private header;
        private body;
        private div;
        constructor(title?: String);
        beforeDisplay(): void;
        beforeHide(): void;
        addHeader(header: Header): void;
        getHeader(): Header;
        getDom(): HTMLElement;
    }
}
declare module mtsui {
    class WindowManager {
        private static windowStack;
        private static open(window);
        static getActiveWindow(): Window;
        static openFullscreen(window: Window): void;
        static openModal(window: Window, closable: boolean): void;
        static closeWindow(window: Window): void;
        static close(): void;
    }
}
declare module mtsui {
    class Window extends ts.ui.View {
        private pageStack;
        constructor(title?: String);
        getActualPage(): Page;
        setActualPage(page: Page): void;
        deleteStack(): void;
        close(): void;
        deinit(): void;
        navigateTo(page: Page, transitiontype?: String): void;
        back(): void;
    }
}
declare module mtsui {
    class Popup extends Window {
        constructor(closable: boolean, title?: String, component?: Component);
    }
}
declare module mtsui {
    class AlertBox extends Popup {
        constructor(title?: String, text?: String, callback?: Function);
    }
}
declare module mtsui {
    class Icon extends Component {
        private icon;
        constructor(type: String);
    }
}
declare module mtsui {
    class Button extends Component {
        private icon;
        private input;
        constructor(value: String, click_cb?: Function);
        setType(type: string): void;
        disable(): void;
        enable(): void;
        addIcon(icon_comp?: Icon, pos?: String): void;
    }
}
declare module mtsui {
    class ListItem extends Component {
        private value;
        private item;
        constructor(value?: any);
        getValue(): String;
        getItem(): HTMLElement;
        setOnclick(func: Function): void;
    }
    class ListItemDecorator extends ListItem {
        constructor(comp: Component, value?: any, position?: String);
    }
    class List extends Component {
        private list;
        constructor(value?: any);
    }
    class ListSwipeDecorator extends List {
        private value;
        private deleteIcon;
        private color;
        private static ELEMENT_SIZE;
        constructor(value: List, deleteIcon: Icon, color: String);
        add(listItem: Component, deleteCallback?: Function): void;
        remove(listItem: Component): void;
        clear(): void;
    }
}
interface TouchEvent extends Event {
    pageX: number;
    pageY: number;
}
declare var global_window: Window;
declare module mtsui {
    class Menu {
        private static OFFSET;
        private visible;
        private menu;
        private window;
        private position;
        private slide;
        constructor(window: Window, content: Component, position: string, slide?: boolean);
        deinit(): void;
        addTo(header: Header, icon: Component): void;
        toggle(): void;
        show(): void;
        hide(): void;
    }
}
