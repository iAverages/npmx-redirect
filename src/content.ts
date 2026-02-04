import browser from "webextension-polyfill";
import type { PlasmoCSConfig } from "plasmo";
import { handleRedirect } from "./lib";

export const config: PlasmoCSConfig = {
    matches: ["*://*.npmjs.com/*"],
    run_at: "document_start",
};

browser.runtime.onMessage.addListener((message, _, __) => {
    if (
        typeof message === "object" &&
        "type" in message &&
        message.type === "URL_CHANGED" &&
        "url" in message &&
        typeof message.url === "string"
    ) {
        window.location.replace(message.url);
    }
    return true;
});

handleRedirect(window.location.href, (url) => window.location.replace(url));
