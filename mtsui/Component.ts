/// <reference path="../libts.d.ts"/>

module mtsui {
    export class Component extends ts.ui.View {
        private dom: HTMLElement;
        private children: ts.util.LinkedList<Component> = new ts.util.LinkedList<Component>();

        constructor(template: any) {
            super(template);

            this.dom = document.createElement("div");
            this.dom.setAttribute("class", "mtsui component");
        }

        public add(component: Component): void {
            super.getDom().appendChild(component.getDom());
            this.children.add(component);
        }

        public remove(component: Component): void {
            super.getDom().removeChild(component.getDom());
            this.children.remove(component);
        }

        public getChildren(): ts.util.List<Component>{
            return this.children;
        }

        public clear(): void {
            super.getDom().innerHTML = "";
            this.children = new ts.util.LinkedList<Component>();
        }

        public getDom(): HTMLElement {
            this.dom.appendChild(super.getDom());
            return this.dom;
        }
    }
}