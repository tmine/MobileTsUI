/// <reference path="../ts/ui/View.ts"/>
/// <reference path="Component.ts"/>

module mtsui {
    export class Header extends tsc.ui.View {
        private right: Component;
        private middle: Component;
        private left: Component;

        constructor(left?: Component, middle?: Component, right?: Component) {
            var instance: HTMLElement = document.createElement("div");
            instance.setAttribute("class", "mtsui header");

            this.left = left;
            this.middle = middle;
            this.right = right;

            if (!this.left) {
                var dom: HTMLElement = document.createElement("span");
                this.left = new Component(dom);
            }
            var dom: HTMLElement = this.left.getDom();
            dom.setAttribute("class", "mtsui left");
            instance.appendChild(dom);


            if (!this.middle) {
                var dom: HTMLElement = document.createElement("span");
                this.middle = new Component(dom);
            }
            var dom: HTMLElement = this.middle.getDom();
            dom.setAttribute("class", "mtsui middle");
            instance.appendChild(dom);

            if (!this.right) {
                var dom: HTMLElement = document.createElement("span");
                this.right = new Component(dom);
            }
            var dom: HTMLElement = this.right.getDom();
            dom.setAttribute("class", "mtsui right");
            instance.appendChild(dom);

            super(instance);
        }

        public setLeft(comp: Component): void {
            this.getDom().removeChild(this.left.getDom());

            this.left = comp;

            var dom = this.left.getDom();
            dom.setAttribute("class", "mtsui left");
            this.getDom().insertBefore(dom, this.middle.getDom());
        }

        public setMiddle(comp: Component): void {
            this.getDom().removeChild(this.middle.getDom());

            this.middle = comp;

            var dom = this.middle.getDom();
            dom.setAttribute("class", "mtsui middle");
            this.getDom().insertBefore(dom, this.right.getDom());
        }

        public setRight(comp: Component): void {
            this.getDom().removeChild(this.right.getDom());

            this.right = comp;

            var dom = this.right.getDom();
            dom.setAttribute("class", "mtsui right");
            this.getDom().appendChild(dom);
        }
        
        public getLeft(): Component {
            return this.left;
        }

        public getMiddle(): Component {
            return this.middle;
        }

        public getRight(): Component {
            return this.right;
        }
        
    }
}