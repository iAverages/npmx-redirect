import browser from "webextension-polyfill";
import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

const store = new Storage({
    area: "local",
    allCopied: true,
});

const SETTINGS_KEY = "settings";

const DEFAULT_SETTINGS = {
    enabled: true,
    packages: true,
    search: true,
    users: true,
    orgs: true,
};
export type Settings = typeof DEFAULT_SETTINGS;
export type SettingKeys = keyof typeof DEFAULT_SETTINGS;

export const getSettings = async () => {
    try {
        const stored = await store.get(SETTINGS_KEY);
        return Object.entries(stored).reduce<Settings>((acc, [key, value]) => {
            if (key in DEFAULT_SETTINGS) acc[key] = !!value;
            return acc;
        }, DEFAULT_SETTINGS);
    } catch {
        return DEFAULT_SETTINGS;
    }
};

const handleRulesetUpdates = async (settings: Settings) => {
    const { enableRulesetIds, disableRulesetIds } = Object.entries(settings).reduce(
        (acc, [ruleId, enabled]) => {
            // enabled is global, doesnt have a ruleset
            if (ruleId === "enabled") return acc;
            // if global toggle is disabled, disable all rules
            if (!settings.enabled) {
                acc.disableRulesetIds.push(ruleId);
                return acc;
            }
            if (enabled) acc.enableRulesetIds.push(ruleId);
            else acc.disableRulesetIds.push(ruleId);
            return acc;
        },
        { disableRulesetIds: [], enableRulesetIds: [] },
    );

    await Promise.all([
        browser.declarativeNetRequest.updateEnabledRulesets({
            enableRulesetIds,
        }),
        browser.declarativeNetRequest.updateEnabledRulesets({
            disableRulesetIds,
        }),
    ]);
};

export const setSettings = async (settings: Settings) => {
    const value = Object.entries(settings).reduce<Settings>((acc, [key, value]) => {
        if (key in DEFAULT_SETTINGS) acc[key] = !!value;
        return acc;
    }, DEFAULT_SETTINGS);

    await store.set(SETTINGS_KEY, value);
    handleRulesetUpdates(value);
};

export const useSettings = () => {
    const [storeSettings, setStoreSettings] = useStorage(
        {
            key: SETTINGS_KEY,
            instance: store,
        },
        (value) => (typeof value === "undefined" ? DEFAULT_SETTINGS : value),
    );

    const setSettings = async (settings: Settings) => {
        const value = Object.entries(settings).reduce<Settings>((acc, [key, value]) => {
            if (key in DEFAULT_SETTINGS) acc[key] = !!value;
            return acc;
        }, DEFAULT_SETTINGS);

        setStoreSettings(value);
        handleRulesetUpdates(value);
    };

    return [storeSettings, setSettings];
};
