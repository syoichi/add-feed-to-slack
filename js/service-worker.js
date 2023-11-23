'use strict';

const SLACK_RSS_APP_URL = 'https://slack.com/apps/A0F81R7U7-rss';

function getFeedUrl() {
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

function insertFeedUrlAndScrollIntoView(feedUrl) {
  document.getElementById('feed_url').value = feedUrl;
  document.querySelector('#settings + .card').scrollIntoView();
}

chrome.action.onClicked.addListener(async tab => {
  const injectionResult = await chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    func: getFeedUrl,
  });
  const feedUrl = injectionResult[0]?.result;

  if (typeof feedUrl !== 'string') {
    return;
  }

  const newTab = await chrome.tabs.create({
    url: SLACK_RSS_APP_URL
  });

  chrome.scripting.executeScript({
    target: {
      tabId: newTab.id
    },
    func: insertFeedUrlAndScrollIntoView,
    args: [
      feedUrl,
    ]
  });
});
