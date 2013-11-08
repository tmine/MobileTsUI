
all: compileTS

compileTS:
	tsc src/mobileTscUI.ts -out js/mtscui.js

.PHONY: compileTS