/// <reference path="../ts/ui/View.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Window.ts"/>

module mtsui {
    export class Page extends Component {
        private title: String;
        private window: Window;
        private header: Header;
        private body: Component;
        private div: HTMLElement;

        constructor(window: Window, title?: String) {
            this.window = window;

            this.div = document.createElement("div");
            this.div.setAttribute("class", "mtsui page");
            
            var body: HTMLElement = document.createElement("div");
            body.setAttribute("class", "mtsui content");

            super(body);

            this.div.appendChild(super.getDom());
            
            
            this.title = title;
            if(this.title){
                this.header = new Header();
                this.div.appendChild(this.header.getDom());
                
                var node = document.createElement("h1");
                var title: String = this.title || "";
                var titleNode = document.createTextNode(title.toString());
                node.appendChild(titleNode);
    
                this.header.setMiddle(new Component(node));
            }
        }

        public addHeader(header: Header): void{
            if(this.header) this.div.removeChild(this.header.getDom());
            
            // check if our header has already some elements, if true copy them to new header if it havn't got its own
            if(this.header.getLeft().getDom().innerHTML != "<span></span>" && header.getLeft().getDom().innerHTML == "<span></span>") header.setLeft(this.header.getLeft()); 
            if(this.header.getMiddle().getDom().innerHTML != "<span></span>" && header.getMiddle().getDom().innerHTML == "<span></span>") header.setMiddle(this.header.getMiddle());
            if(this.header.getRight().getDom().innerHTML != "<span></span>" && header.getRight().getDom().innerHTML == "<span></span>") header.setRight(this.header.getRight()); 
            
            this.div.appendChild(header.getDom());
            this.header = header;
        }
        
        public getWindow(): Window {
            return this.window;
        }

        public getDom(): HTMLElement {
            return this.div;
        }

    }
}