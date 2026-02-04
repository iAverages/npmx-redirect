import { Storage } from "@plasmohq/storage";

const store = new Storage({
    area: "local",
});

const SETTINGS_KEY = "settings";

const DEFAULT_SETTINGS = {
    enabled: true,
    packages: true,
    search: true,
    users: true,
    orgs: true,
} as const;
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

export const setSettings = async (settings: Settings) => {
    const value = Object.entries(settings).reduce<Record<string, boolean>>((acc, [key, value]) => {
        if (key in DEFAULT_SETTINGS) acc[key] = !!value;
        return acc;
    }, DEFAULT_SETTINGS);

    await store.set(SETTINGS_KEY, value);
};

export const useSettings = () => {};
