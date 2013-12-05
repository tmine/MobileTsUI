/// <reference path="../ts/util/List.ts"/>
/// <reference path="../ts/util/LinkedList.ts"/>
/// <reference path="../ts/ui/View.ts"/>

module mtsui {
    export class Component extends tsc.ui.View {
        private dom: HTMLElement;

        constructor(template: any) {
            super(template);

            this.dom = document.createElement("div");
            this.dom.setAttribute("class", "mtsui component");
        }

        public add(component: Component): void {
            super.getDom().appendChild(component.getDom());
        }

        public remove(component: Component): void {
            super.getDom().removeChild(component.getDom());
        }
        
        public clear(): void {
            super.getDom().innerHTML = "";
        }

        public getDom(): HTMLElement {
            this.dom.appendChild(super.getDom());
            return this.dom;
        }
    }
}