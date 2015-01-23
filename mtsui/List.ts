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
    }

    export class ListSwipeDecorator extends List {
        private static ELEMENT_SIZE = 80;

        constructor(private value: List, private deleteIcon: Icon, private color: String){
            super(value);
        }

        public add(listItem: Component, deleteCallback?: Function): void{
            this.value.add(listItem);

            var style = listItem.getDom().style;
            style.position = "relative";
            style.overflow = "visible";

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
            button.appendChild(this.deleteIcon.getDom().cloneNode(true));
            button.onclick = function(e){
                deleteCallback();
            };

            listItem.getDom().appendChild(button);

            var startPos = 0;
            var pos = 0;
            var state = "hidden";

            (<ListItem>listItem).getItem().addEventListener('touchmove', function(in_e){
                var e = <TouchEvent> in_e;
                if(startPos == 0) startPos = e.pageX;
                var delta = startPos - e.pageX; // minus = right, plus = left

                var direction = delta / Math.abs(delta);
                if(isNaN(direction)) direction = 0;

                delta = Math.abs(delta);
                delta = Math.min(delta, ListSwipeDecorator.ELEMENT_SIZE);
                pos = -1 * direction * delta;
                if(state == "visible") pos = -ListSwipeDecorator.ELEMENT_SIZE + pos;

                var style: any = listItem.getDom().style;
                style.webkitTransform = "translate3d(" + (pos) + "px, 0, 0)";
                style.transform = "translate3d(" + (pos) + "px, 0, 0)";

                e.preventDefault();
            }, false);

            (<ListItem>listItem).getItem().addEventListener('touchend', function(in_e){
                if(pos <= -ListSwipeDecorator.ELEMENT_SIZE/2) {
                    state = "visible";
                    pos = -ListSwipeDecorator.ELEMENT_SIZE;
                } else if(pos >= -ListSwipeDecorator.ELEMENT_SIZE/2) {
                    state = "hidden";
                    pos = 0;
                }

                var style: any = listItem.getDom().style;
                style.webkitTransform = "translate3d(" + pos + "px, 0, 0)";
                style.transform = "translate3d(" + pos + "px, 0, 0)";

                startPos = 0;
            }, false);
        }

        public remove(listItem: Component): void{
            this.value.remove(listItem);
        }

        public clear(): void{
            this.value.clear();
        }
    }
}