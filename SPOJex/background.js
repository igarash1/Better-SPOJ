"use strict";

chrome.browserAction.onClicked.addListener(function(activeTab){
    chrome.tabs.create({ url: "https://www.spoj.com/" });
});
