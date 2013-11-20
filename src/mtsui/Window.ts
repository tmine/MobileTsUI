/// <reference path="../ts/util/Stack.ts"/>
/// <reference path="../ts/ui/View.ts"/>
/// <reference path="Page.ts"/>

module mtsui {
    export class Window extends tsc.ui.View {
        private pageStack: tsc.util.Stack<Page>;

        constructor(title?: String) {
            this.pageStack = new tsc.util.Stack<Page>();

            var instance: HTMLElement = document.createElement("div");
            instance.setAttribute("class", "mtsui window");
            super(instance);

            var page: Page = this.createPage(title);
            instance.appendChild(page.getDom());
            this.pageStack.push(page);
        }

        public getActualPage(): Page {
            var page: Page = this.pageStack.peek();

            return page;
        }

        public deleteStack(): void{
            while(this.pageStack.size() > 0){
                var page: Page = this.pageStack.pop();
                if(page) this.getDom().removeChild(page.getDom());
            }
        }
        
        public createPage(title?: String): Page {
            return new Page(this, title);
        }

        public navigateTo(page: Page, transitiontype?: String): void {
            if(page.getDom().parentNode) return this.back();
            
            if(!transitiontype) transitiontype = "slide";
            
            var oldPage: Page = this.pageStack.peek();

            this.getDom().appendChild(page.getDom());
            page.getDom().className += " transition " + transitiontype + " hide right";

            setTimeout(function() {
                page.getDom().className = page.getDom().className.replace(" transition " + transitiontype + " hide right", " transition " + transitiontype + " hide in");
            }, 0);

            setTimeout(function() {
                page.getDom().className = page.getDom().className.replace(" transition " + transitiontype + " hide in", "");
            }, 1000);

            if(oldPage) oldPage.getDom().className += " transition " + transitiontype + " hide left";

            this.pageStack.push(page);
        }

        public back(): void {
            var oldPage: Page = this.pageStack.pop();
            var page: Page = this.pageStack.peek();

            oldPage.getDom().className += " transition slide hide right";

            var superdom = this.getDom();
            setTimeout(function() {
                page.getDom().className = page.getDom().className.replace(" transition slide hide left", " transition slide hide in");
            }, 0);

            setTimeout(function() {
                oldPage.getDom().className = oldPage.getDom().className.replace(" transition slide hide right", "");
                superdom.removeChild(oldPage.getDom());
                
                page.getDom().className = page.getDom().className.replace(" transition slide hide in", "");
            }, 1000);
        }

    }
}