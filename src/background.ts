import browser from "webextension-polyfill";
import { getOmniboxRedirectUrl, getOmniboxSuggestions, handleRedirect } from "./lib";
import { getSettings } from "./settings";

browser.webNavigation.onHistoryStateUpdated.addListener(({ url, frameId, tabId }) => {
    if (frameId === 0)
        handleRedirect(getSettings, url, (url) => browser.tabs.sendMessage(tabId, { type: "URL_CHANGED", url }));
});

chrome.omnibox.setDefaultSuggestion({
    description: "Open npm packages on npmx. Type a package name, or prefix with search.",
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    suggest(getOmniboxSuggestions(text));
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
    const url = getOmniboxRedirectUrl(text);

    if (disposition === "currentTab") {
        browser.tabs.update({ url });
        return;
    }

    browser.tabs.create({
        active: disposition !== "newBackgroundTab",
        url,
    });
});

export {};
