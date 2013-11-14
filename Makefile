
all: compileTS

compileTS:
	tsc src/mobileTsUI.ts -out js/mtsui.js

.PHONY: compileTS