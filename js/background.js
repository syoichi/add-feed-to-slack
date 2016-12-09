'use strict';

const SLACK_RSS_APP_URL = 'https://slack.com/apps/A0F81R7U7-rss';

let urlMap = new Map();

chrome.runtime.onMessage.addListener(({url}, {tab}) => {
  urlMap.set(tab.id, url);
  chrome.pageAction.show(tab.id);
});

chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.create({
    url: SLACK_RSS_APP_URL
  }, () => {
    chrome.tabs.executeScript(null, {
      code: `
        document.getElementById('feed_url').value = '${urlMap.get(tab.id)}';
        document.querySelector('#settings + .card').scrollIntoView()
      `,
      runAt: 'document_end'
    });
  });
});
