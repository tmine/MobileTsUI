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

            var page: Page = new Page(title);
            instance.appendChild(page.getDom());
            this.pageStack.push(page);
        }

        private removePageFromDom(page: Page){
            page.deinit();
            this.getDom().removeChild(page.getDom());
        }

        public removePage(page: Page): void {
            if(this.pageStack.empty()) return;

            if(page == this.pageStack.peek()){
                this.removePageFromDom(page);
            } else {
                var pageStackArray = this.pageStack.toArray();
                this.pageStack = new ts.util.Stack<Page>(pageStackArray.splice(pageStackArray.indexOf(page, 1)));
                this.removePageFromDom(page);
            }
        }

        public getActualPage(): Page {
            return this.pageStack.peek();
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
                    this.removePageFromDom(page);
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

        public navigateTo(page: Page): void {
            var oldPage: Page = this.pageStack.peek();
            this.getDom().appendChild(page.getDom());

            page.hide("right", "transition slide");
            setTimeout(function() {
                page.show("transition slide");
            }, 0);

            oldPage.hide("left", "transition slide");

            this.pageStack.push(page);
        }

        public back(): void {
            var oldPage: Page = this.pageStack.pop();
            var page: Page = this.pageStack.peek();

            if(page) {
                page.show("transition slide");
            }

            oldPage.hide("right", "transition slide");
            setTimeout(function() {
                oldPage.deinit();
                oldPage.getDom().parentNode.removeChild(oldPage.getDom());
            }, 1000);

            if(this.pageStack.empty()) this.close();
        }

    }
}