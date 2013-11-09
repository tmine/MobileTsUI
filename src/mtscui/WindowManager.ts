/// <reference path="../../tsc/util/Stack.ts"/>
/// <reference path="Window.ts"/>

module mtscui {
	export class WindowManager{
		private static windowStack : tsc.util.Stack<Window> = new tsc.util.Stack<Window>();

		public static open(window : Window /* TODO: Type (Modal, Fullscreen, normal) */) : void {
			// hide other window if exist
			var old : Window = WindowManager.windowStack.pop();
			if(old) {
				old.getDom().className = "mtscui window hide";

				WindowManager.windowStack.push(old);
			}

			// Add new window to stack
			WindowManager.windowStack.push(window);
			// Append new window to body
			document.body.appendChild(window.getDom());
		}

		public static close() : void {
			var window : Window = WindowManager.windowStack.pop();
			// Remove window from body
			document.body.removeChild(window.getDom());
		}

	}
}