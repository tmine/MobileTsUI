
all: tsc

tsc:
	tsc mtsui/*.ts -out mtsui.js -d

.PHONY: tsc