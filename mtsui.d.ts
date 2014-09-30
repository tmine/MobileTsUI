/// <reference path="libts.d.ts" />
declare module mtsui {
    class Component extends ts.ui.View {
        private dom;
        constructor(template: any);
        public add(component: Component): void;
        public remove(component: Component): void;
        public clear(): void;
        public getDom(): HTMLElement;
    }
}
declare module mtsui {
    class Header extends ts.ui.View {
        private right;
        private middle;
        private left;
        constructor(left?: Component, middle?: Component, right?: Component);
        public setLeft(comp: Component): void;
        public setMiddle(comp: Component): void;
        public setRight(comp: Component): void;
        public getLeft(): Component;
        public getMiddle(): Component;
        public getRight(): Component;
    }
}
declare module mtsui {
    class Page extends Component {
        private title;
        private window;
        private header;
        private body;
        private div;
        constructor(window: Window, title?: String);
        public beforeDisplay(): void;
        public getWindow(): Window;
        public addHeader(header: Header): void;
        public getHeader(): Header;
        public getDom(): HTMLElement;
    }
}
declare module mtsui {
    class WindowManager {
        private static windowStack;
        private static open(window);
        static openFullscreen(window: Window): void;
        static openModal(window: Window, closable: boolean): void;
        static closeWindow(window: Window): void;
        static close(): void;
    }
}
declare module mtsui {
    class Window extends ts.ui.View {
        private pageStack;
        constructor(title?: any);
        public getActualPage(): Page;
        public setActualPage(page: Page): void;
        public deleteStack(): void;
        public close(): void;
        public deinit(): void;
        public navigateTo(page: Page, transitiontype?: String): void;
        public back(): void;
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
        public setType(type: string): void;
        public disable(): void;
        public enable(): void;
        public addIcon(icon_comp?: Icon, pos?: String): void;
    }
}
declare module mtsui {
    class ListItem extends Component {
        private value;
        private item;
        constructor(value?: any);
        public getValue(): String;
        public setOnclick(func: Function): void;
    }
    class ListItemDecorator extends ListItem {
        constructor(comp: Component, value?: any, position?: String);
    }
    class List extends Component {
        constructor();
        public add(listItem: ListItem): void;
        public remove(listItem: ListItem): void;
        public clear(): void;
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
        public deinit(): void;
        public addTo(header: Header, icon: Component): void;
        private toggle();
        public show(): void;
        public hide(): void;
    }
}
