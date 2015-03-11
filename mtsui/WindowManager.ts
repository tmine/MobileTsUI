/// <reference path="../libts.d.ts"/>
/// <reference path="Window.ts"/>

module mtsui {
    export class WindowManager {
        private static windowStack: ts.util.Stack<Window> = new ts.util.Stack<Window>();

        private static open(window: Window): void {
            // hide other window if exist
            var old: Window = WindowManager.windowStack.peek();
            if (old) {
                old.getDom().className += " hide";
            }

            // Add new window to stack
            WindowManager.windowStack.push(window);
            // Append new window to body
            document.body.appendChild(window.getDom());
        }

        public static getActiveWindow(): mtsui.Window {
            return this.windowStack.peek();
        }

        public static openFullscreen(window: Window) {
            window.getDom().className += " fullscreen";
            WindowManager.open(window);
        }

        public static openModal(window: Window, closable: boolean) {
            var temp: Window = new Window();

            temp.getDom().className += " modal";
            temp.getDom().appendChild(window.getDom());

            if(closable){
                temp.getDom().onclick = function() {
                    WindowManager.close();
                }
            }

			window.getDom().onclick = function() {
                if (event.stopPropagation) event.stopPropagation()
				if (event) event.cancelBubble = true;
            };

			WindowManager.open(temp);
        }

        public static closeWindow(window: Window): void{
            if(window == this.windowStack.peek()){
                this.close();
            } else {
                var windowStackArray = this.windowStack.toArray();
                this.windowStack = new ts.util.Stack<Window>(windowStackArray.splice(windowStackArray.indexOf(window, 1)));
                // Remove window from body
                window.deinit();
                document.body.removeChild(window.getDom());
            }

            if(this.windowStack.empty()) history.back();
        }

        public static close(): void {
            var window: Window = WindowManager.windowStack.pop();
            // Remove window from body
            window.deinit();
            document.body.removeChild(window.getDom());

            var window: Window = WindowManager.windowStack.peek();
            if(window) window.getDom().className = window.getDom().className.replace(" hide", "");
        }

    }
}