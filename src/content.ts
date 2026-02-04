import type { PlasmoCSConfig } from "plasmo";
import { getSettings, type SettingKeys } from "./settings";

export const config: PlasmoCSConfig = {
    matches: ["*://*.npmjs.com/*"],
    run_at: "document_start",
};

const urlPatterns = {
    orgs: /^\/org\/.*$/,
    packages: /^\/package\/.*$/,
    search: /^\/search$/,
    users: /^~.*$/,
} satisfies Record<Exclude<SettingKeys, "enabled">, RegExp>;

const main = async () => {
    const settings = await getSettings();
    if (!settings.enabled) return;

    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const newUrl = `https://npmx.dev${pathname}${url.search}${url.hash}`;
    for (const [type, pattern] of Object.entries(urlPatterns)) {
        if (pattern.test(pathname) && type in settings && settings[type]) {
            window.location.replace(newUrl);
        }
    }
};

main();
