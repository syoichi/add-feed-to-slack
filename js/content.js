'use strict';

try {
  (async () => {
    const getFeedUrlPath = chrome.runtime.getURL('js/get-feed-url.js');
    const {getFeedUrl} = await import(getFeedUrlPath);

    chrome.runtime.sendMessage(null, {
      feedUrl: getFeedUrl(),
    });
  })();
} catch (err) {
  // do nothing
}
