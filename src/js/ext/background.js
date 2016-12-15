chrome.browserAction.onClicked.addListener(function() {
	url = 'chrome-extension://' + chrome.runtime.id	+ '/ext.html';
	chrome.windows.create({'url': url}, function(window) {
	//'type': 'popup' 'width': 500, 'height':400
   });
});