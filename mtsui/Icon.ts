/// <reference path="Component.ts"/>

module mtsui {    
    export class Icon extends Component {
        private icon: HTMLElement;
        
        constructor(type: String) {
            var icon: HTMLElement = document.createElement("span");
            icon.setAttribute("class", "" + type);
            super(icon);
        }
    }
}