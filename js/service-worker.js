'use strict';

import {getFeedUrl} from '../js/get-feed-url.js';

const defaultIconPath = chrome.runtime.getURL('img/icon/16.png');
const grayscaleIconPath = chrome.runtime.getURL('img/icon/16-grayscale.png');
const SLACK_RSS_APP_URL = 'https://slack.com/apps/A0F81R7U7-rss';

function insertFeedUrlAndScrollIntoView(feedUrl) {
  document.getElementById('feed_url').value = feedUrl;
  document.querySelector('#settings + .card').scrollIntoView();
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();
  chrome.action.setIcon({
    path: grayscaleIconPath,
  });
});

chrome.runtime.onMessage.addListener(({feedUrl}, {tab}) => {
  if (typeof feedUrl === 'string') {
    chrome.action.enable(tab.id);
    chrome.action.setIcon({
      path: defaultIconPath,
      tabId: tab.id,
    });
  } else {
    chrome.action.disable(tab.id);
    chrome.action.setIcon({
      path: grayscaleIconPath,
      tabId: tab.id,
    });
  }
});

chrome.action.onClicked.addListener(async tab => {
  const injectionResult = await chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    func: getFeedUrl,
  });
  const feedUrl = injectionResult[0]?.result;

  if (typeof feedUrl !== 'string') {
    return;
  }

  const newTab = await chrome.tabs.create({
    url: SLACK_RSS_APP_URL,
  });

  chrome.scripting.executeScript({
    target: {
      tabId: newTab.id,
    },
    func: insertFeedUrlAndScrollIntoView,
    args: [
      feedUrl,
    ],
  });
});
