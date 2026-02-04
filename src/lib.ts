import { type SettingKeys, type Settings } from "./settings";

const urlPatterns = {
    orgs: /^\/org\/.*$/,
    packages: /^\/package\/.*$/,
    search: /^\/search$/,
    users: /^\/~.*$/,
} satisfies Record<Exclude<SettingKeys, "enabled">, RegExp>;

export const handleRedirect = async (
    getSettings: () => Promise<Settings>,
    path: string,
    redirectCallback: (url: string) => void,
) => {
    const settings = await getSettings();
    if (!settings.enabled) return;

    const url = new URL(path);
    const pathname = url.pathname;
    const newUrl = `https://npmx.dev${pathname}${url.search}${url.hash}`;
    for (const [type, pattern] of Object.entries(urlPatterns)) {
        if (pattern.test(pathname) && type in settings && settings[type]) {
            redirectCallback(newUrl);
        }
    }
};
