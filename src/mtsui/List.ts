/// <reference path="Component.ts"/>

module mtsui {
    export class ListItem extends Component {
        private value: String;
        private item: HTMLElement;
        
        constructor(value?: any) {
            this.value = value;
            
            this.item = document.createElement("table");
            this.item.setAttribute("class", "mtsui listitem");
            
            if(value instanceof ListItem){
                this.item = value.getDom().firstChild; 
                super(this.item);
            } else if(value instanceof Component){
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
        
        public setOnclick(func: Function): void {
            this.item.onclick = function(){func();};
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
            if(position && position === "left") super.getDom().firstChild.firstChild.insertBefore(icon, super.getDom().firstChild.firstChild);
            else super.getDom().firstChild.firstChild.appendChild(icon);
        }
    }
    
    export class List extends Component {
        constructor() {
            var list: HTMLElement = document.createElement("div");
            list.setAttribute("class", "mtsui list");
            
            super(list);
        }
        
        public add(listItem: ListItem): void {
            super.add(listItem);
        }
        
        public remove(listItem: ListItem) : void {
            super.remove(listItem);
        }
    }
}