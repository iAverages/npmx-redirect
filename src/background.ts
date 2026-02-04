import browser from "webextension-polyfill";
import { handleRedirect } from "./lib";

browser.webNavigation.onHistoryStateUpdated.addListener(({ url, frameId, tabId }) => {
    if (frameId === 0) handleRedirect(url, (url) => browser.tabs.sendMessage(tabId, { type: "URL_CHANGED", url }));
});

export {};
