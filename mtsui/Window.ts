/// <reference path="../libts.d.ts"/>
/// <reference path="Page.ts"/>
/// <reference path="WindowManager.ts"/>

module mtsui {
    export class Window extends ts.ui.View {
        private pageStack: ts.util.Stack<Page>;

        constructor(title?: String) {
            this.pageStack = new ts.util.Stack<Page>();

            var instance: HTMLElement = document.createElement("div");
            instance.setAttribute("class", "mtsui window");
            super(instance);

            var page: Page = new Page(this, title);
            instance.appendChild(page.getDom());
            this.pageStack.push(page);
        }

        public getActualPage(): Page {
            var page: Page = this.pageStack.peek();

            return page;
        }

        public setActualPage(page: Page): void {
            var oldPage = this.pageStack.pop();
            this.pageStack.push(page);

            this.getDom().replaceChild(page.getDom(), oldPage.getDom());
        }

        public deleteStack(): void{
            while(this.pageStack.size() > 0){
                var page: Page = this.pageStack.pop();
                if(page){
                    page.deinit();
                    this.getDom().removeChild(page.getDom());
                } 
            }
        }
        
        public close(): void{
            WindowManager.closeWindow(this);
        }
        
        public deinit(): void{
            this.deleteStack();
            super.deinit();
        }

        public navigateTo(page: Page, transitiontype?: String): void {            
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

            if(page) {
                page.beforeDisplay();
                var superdom = this.getDom();
                setTimeout(function(){
                    page.getDom().className = page.getDom().className.replace(" transition slide hide left", " transition slide hide in");
                }, 0);
            }

            oldPage.getDom().className += " transition slide hide right";
            setTimeout(function() {
                oldPage.getDom().className = oldPage.getDom().className.replace(" transition slide hide right", "");
                if(oldPage.getDom().parentNode == superdom) superdom.removeChild(oldPage.getDom());
                
                page.getDom().className = page.getDom().className.replace(" transition slide hide in", "");
            }, 1000);

            if(this.pageStack.empty()) this.close();
        }

    }
}