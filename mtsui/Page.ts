/// <reference path="../libts.d.ts"/>
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

        constructor(window: mtsui.Window, title?: String) {
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
                super.getDom().insertBefore(this.header.getDom(), super.getDom().firstChild);
                
                var node = document.createElement("h1");
                var title: String = this.title || "";
                var titleNode = document.createTextNode(title.toString());
                node.appendChild(titleNode);
    
                this.header.setMiddle(new Component(node));
            }
        }
        
        public getWindow(): Window{
            return this.window;
        }
        
        public addHeader(header: Header): void{
            if(this.header) this.div.removeChild(this.header.getDom());
            
            // check if our header has already some elements, if true copy them to new header if it havn't got its own
            if(this.header && this.header.getLeft().getDom().innerHTML != "<span></span>" && header.getLeft().getDom().innerHTML == "<span></span>") header.setLeft(this.header.getLeft()); 
            if(this.header && this.header.getMiddle().getDom().innerHTML != "<span></span>" && header.getMiddle().getDom().innerHTML == "<span></span>") header.setMiddle(this.header.getMiddle());
            if(this.header && this.header.getRight().getDom().innerHTML != "<span></span>" && header.getRight().getDom().innerHTML == "<span></span>") header.setRight(this.header.getRight()); 
            
            super.getDom().insertBefore(header.getDom(), super.getDom().firstChild);
            this.header = header;
        }
        
        public getHeader(): Header{
            return this.header;
        }

        public getDom(): HTMLElement {
            return this.div;
        }

    }
}