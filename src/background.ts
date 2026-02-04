import browser from "webextension-polyfill";
import { handleRedirect } from "./lib";
import { getSettings } from "./settings";

browser.webNavigation.onHistoryStateUpdated.addListener(({ url, frameId, tabId }) => {
    if (frameId === 0)
        handleRedirect(getSettings, url, (url) => browser.tabs.sendMessage(tabId, { type: "URL_CHANGED", url }));
});

export {};
