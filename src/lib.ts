import type { SettingKeys, Settings } from "./settings";

const urlPatterns = {
    orgs: /^\/org\/.*$/,
    packages: /^\/package\/.*$/,
    search: /^\/search$/,
    users: /^\/~.*$/,
} satisfies Record<Exclude<SettingKeys, "enabled">, RegExp>;

const searchPrefixPattern = /^(?:(?:s|search)\s+|\?\s*)(.+)$/i;

export const getOmniboxRedirectUrl = (text: string) => {
    const query = text.trim();
    if (!query) return "https://npmx.dev";

    const searchMatch = query.match(searchPrefixPattern);
    if (searchMatch) return `https://npmx.dev/search?q=${encodeURIComponent(searchMatch[1].trim())}`;

    return `https://npmx.dev/package/${encodeURI(query)}`;
};

const escapeOmniboxText = (text: string) =>
    text.replace(/[&<>"']/g, (char) => {
        switch (char) {
            case "&":
                return "&amp;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case '"':
                return "&quot;";
            case "'":
                return "&#39;";
            default:
                return char;
        }
    });

export const getOmniboxSuggestions = (text: string): chrome.omnibox.SuggestResult[] => {
    const query = text.trim();
    if (!query) return [];

    const escapedQuery = escapeOmniboxText(query);
    return [
        {
            content: query,
            description: `Open package <match>${escapedQuery}</match> on npmx`,
        },
        {
            content: `search ${query}`,
            description: `Search npmx for <match>${escapedQuery}</match>`,
        },
    ];
};

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
