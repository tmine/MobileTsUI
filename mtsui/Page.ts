/// <reference path="../libts.d.ts"/>
/// <reference path="Header.ts"/>
/// <reference path="Component.ts"/>
/// <reference path="Window.ts"/>

module mtsui {

    export class Page extends Component {
        private title: String;
        private header: Header;
        private body: HTMLElement;
        private div: HTMLElement;

        constructor(title?: String) {
            this.div = document.createElement("div");
            this.div.setAttribute("class", "mtsui page");
            
            this.body = document.createElement("div");
            this.body.setAttribute("class", "mtsui content");

            super(this.body);

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

        public beforeDisplay(): void{
        }

        public beforeHide(): void {
        }

        public deinit(): void {
            this.beforeHide();
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

        public getContent(): HTMLElement {
            return this.body;
        }

        public getDom(): HTMLElement {
            return this.div;
        }

    }

    export class RefreshablePage extends Page {

        constructor(icon: Icon, color: String, text: String, title?: String){
            super(title);

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
            content.addEventListener("touchend", function(e){
                if(content.scrollTop < -50) {
                    refresh.style.position = "static";
                    refresh.style.height = "60px";
                    refresh.style.top = "0";
                    refresh.style.padding = "0.5em";
                    refresh.insertBefore(icon.getDom(), refresh.firstChild);

                    _this.onRefresh(function(){
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

        public onRefresh(func: Function): void {
            func();
        }
    }
}