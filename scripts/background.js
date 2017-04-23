/**
 * Listener for commands
 */
chrome.commands.onCommand.addListener(function(command) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {action: command});
	});
});

/**
 * Listener for browser action click
 */
chrome.browserAction.onClicked.addListener(function() {
    if (chrome.runtime.openOptionsPage) {
		// New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
    } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('pages/options/index.html'));
    }
});