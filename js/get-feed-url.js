'use strict';

export function getFeedUrl() {
  try {
    return (new URL(
      document.querySelector(`
        link[rel="alternate"][type="application/rss+xml"][href],
        link[rel="alternate"][type="application/atom+xml"][href]
      `).href
    )).toString();
  } catch (err) {
    return null;
  }
}
