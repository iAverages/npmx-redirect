import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
    matches: ["*://*.npmjs.com/*"],
    run_at: "document_start",
};

const url = new URL(window.location.href);
const pathname = url.pathname;
const newUrl = `https://npmx.dev${pathname}${url.search}${url.hash}`;
window.location.replace(newUrl);
