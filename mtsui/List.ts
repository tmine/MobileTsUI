/// <reference path="Component.ts"/>

module mtsui {
    export class ListItem extends Component {
        private value: String;
        private item: HTMLElement;

        constructor(value?: any){
            this.value = value;

            this.item = document.createElement("table");
            this.item.setAttribute("class", "mtsui listitem");

            if(value instanceof ListItem) {
                this.item = value.getDom().firstChild;
                super(this.item);
            } else if(value instanceof Component) {
                super(this.item);

                var tr: HTMLElement = document.createElement("tr");
                var text: HTMLElement = document.createElement("td");
                text.appendChild(value.getDom());
                tr.appendChild(text);
                super.getDom().firstChild.appendChild(tr);
            } else if(value) {
                super(this.item);

                var tr: HTMLElement = document.createElement("tr");
                var text: HTMLElement = document.createElement("td");
                text.setAttribute("class", "mtsui listtext");
                text.appendChild(document.createTextNode("" + value));
                tr.appendChild(text);
                super.getDom().firstChild.appendChild(tr);
            }
        }

        public getValue(): String{
            return this.value;
        }

        public getItem(): HTMLElement {
            return this.item;
        }

        public setOnclick(func: Function): void{
            this.item.onclick = function(){
                func();
            };
        }
    }

    export class ListItemDecorator extends ListItem {
        // TODO : exchange comp and value       
        constructor(comp: Component, value?: any, position?: String){
            super(value);

            var compdom = comp.getDom();
            compdom.className += " " + position;

            var icon = document.createElement("td");
            icon.appendChild(compdom);

            if(position && position === "right") super.getDom().firstChild.firstChild.appendChild(icon);
            if(position && position === "left") super.getDom().firstChild.firstChild.insertBefore(icon, super.getDom().firstChild.firstChild.firstChild);
            else super.getDom().firstChild.firstChild.appendChild(icon);
        }
    }

    export class List extends Component {
        private static OFFSET: number = 50;

        private list: HTMLElement;

        constructor(value?){
            if(value instanceof List) {
                this.list = value.getDom().firstChild;
            } else {
                this.list = document.createElement("div");
                this.list.setAttribute("class", "mtsui list");
            }

            super(this.list);
        }

        public add(listItem: ListItem): void{
            super.add(listItem);
        }

        public remove(listItem: ListItem): void{
            super.remove(listItem);
        }

        public clear(): void{
            super.clear();
        }
    }

    export class ListSwipeDecorator extends List {
        private static ELEMENT_SIZE = 80;

        constructor(private value: List, private deleteIcon: Icon, private color: String){
            super(value);
        }

        public add(listItem: ListItem, deleteCallback?: Function): void{
            super.add(listItem);

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
            button.appendChild(this.deleteIcon.getDom());
            button.onclick = function(e){
                deleteCallback();
            };

            listItem.getDom().appendChild(button);

            var startPos = 0;
            var firstPos = 0;
            var state = "hidden";
            listItem.getItem().addEventListener('touchmove', function(in_e){
                var e = <TouchEvent> in_e;
                if(startPos == 0) startPos = e.pageX;
                var newPos = e.pageX - startPos;
                if(state == "visible") newPos -= ListSwipeDecorator.ELEMENT_SIZE;

                var style: any = listItem.getDom().style;
                style.webkitTransform = "translate3d(" + newPos + "px, 0, 0)";
                style.transform = "translate3d(" + newPos + "px, 0, 0)";

                e.preventDefault();
            }, false);

            listItem.getItem().addEventListener('touchend', function(in_e){
                var e = <TouchEvent> in_e;
                var newPos = e.pageX - startPos;

                if(state == "hidden" && -newPos >= ListSwipeDecorator.ELEMENT_SIZE) {
                    newPos = -ListSwipeDecorator.ELEMENT_SIZE;
                    state = "visible";
                } else if(state == "visible" && newPos <= ListSwipeDecorator.ELEMENT_SIZE) {
                    if(newPos > 0) {
                        newPos = 0;
                        state = "hidden";
                    } else {
                        newPos = -ListSwipeDecorator.ELEMENT_SIZE;
                    }
                } else {
                    newPos = 0;
                }
                startPos = 0;
                firstPos = 0;
                newPos = Math.min(0, newPos);

                var style: any = listItem.getDom().style;
                style.webkitTransform = "translate3d(" + newPos + "px, 0, 0)";
                style.transform = "translate3d(" + newPos + "px, 0, 0)";
            }, false);
        }
    }
}