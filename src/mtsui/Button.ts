/// <reference path="Component.ts"/>
/// <reference path="Icon.ts"/>

module mtsui {    
    export class Button extends Component {
        private icon: HTMLElement;
        
        constructor(value: String, click_cb?: Function) {
            var input: HTMLElement = document.createElement("button");
            input.setAttribute("class", "mtsui button");
            
            var text: HTMLElement = document.createElement("span");
            text.appendChild(document.createTextNode("" + value));
            
            input.appendChild(text);
            
            input.onclick = function(){
                if(click_cb) click_cb();
            }
            
            super(input);
        }
        
        public addIcon(icon_comp?: Icon, pos?: String): void {
            var icon: HTMLElement = icon_comp.getDom();
            icon.setAttribute("class", "mtsui icon " + pos);
            
            if(this.icon) this.getDom().firstChild.removeChild(this.icon);
            
            var input: HTMLElement = <HTMLElement> this.getDom().firstChild;
            var inputFirstChild: HTMLElement = <HTMLElement> this.getDom().firstChild.firstChild;
            
            if(!pos || pos === "right"){
                input.appendChild(icon);
                inputFirstChild.style.display = "inline";
            }
            
            if(pos === "left") {
                input.insertBefore(icon, inputFirstChild);
                inputFirstChild.style.display = "inline";
            }
            
            if(pos === "top") {
                inputFirstChild.style.display = "block";
                input.insertBefore(icon, inputFirstChild);
            }
            
            if(pos === "bottom") {
                inputFirstChild.style.display = "block";
                input.appendChild(icon);
            }
            
            this.icon = icon;
        }
    }
}