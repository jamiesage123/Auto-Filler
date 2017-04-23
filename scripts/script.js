/**
 * Initialise Auto Filler
 */
chrome.storage.sync.get(defaultSettings, function(settings) {
	// AutoFiller class instance
	var filler = new AutoFiller(settings);

	// Message listener
	chrome.runtime.onMessage.addListener(function(request) {
		if (typeof request.action !== "undefined") {
			switch (request.action) {
				case "fill": {
					filler.fill();
					break;
				}
				case "fill_once": {
                    var element = $(':focus');
                    if (filler.isValidInput(element)) {
                        filler.fillInput(element);
                    }
					break;
				}
			}
		}
	});
});