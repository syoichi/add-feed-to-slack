'use strict';

try {
  chrome.runtime.sendMessage(null, {
    url: (new URL(
      document.querySelector(`
        link[rel="alternate"][type="application/rss+xml"][href],
        link[rel="alternate"][type="application/atom+xml"][href]
      `).href
    )).toString()
  });
} catch (err) {
  // do nothing
}
