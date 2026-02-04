import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleRedirect } from "./lib";
import type { Settings } from "./settings";

describe("handleRedirect", () => {
    let mockRedirectCallback: () => void;

    beforeEach(() => {
        mockRedirectCallback = vi.fn();
    });

    const createSettings = (overrides: Partial<Settings> = {}): (() => Promise<Settings>) => {
        return async () => ({
            enabled: true,
            packages: true,
            search: true,
            users: true,
            orgs: true,
            ...overrides,
        });
    };

    describe("when enabled is false", () => {
        it("should not redirect", async () => {
            const settings = createSettings({ enabled: false });
            await handleRedirect(settings, "https://npmjs.com/package/react", mockRedirectCallback);
            expect(mockRedirectCallback).not.toHaveBeenCalled();
        });
    });

    describe("when enabled is true", () => {
        describe("package URLs", () => {
            it("should redirect when packages setting is enabled", async () => {
                const settings = createSettings({ packages: true });
                await handleRedirect(settings, "https://npmjs.com/package/react", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/package/react");
            });

            it("should not redirect when packages setting is disabled", async () => {
                const settings = createSettings({ packages: false });
                await handleRedirect(settings, "https://npmjs.com/package/react", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });

            it("should preserve query parameters", async () => {
                const settings = createSettings({ packages: true });
                await handleRedirect(
                    settings,
                    "https://npmjs.com/package/react?activeTab=versions",
                    mockRedirectCallback,
                );
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/package/react?activeTab=versions");
            });

            it("should preserve hash fragments", async () => {
                const settings = createSettings({ packages: true });
                await handleRedirect(settings, "https://npmjs.com/package/react#readme", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/package/react#readme");
            });

            it("should preserve both query and hash", async () => {
                const settings = createSettings({ packages: true });
                await handleRedirect(
                    settings,
                    "https://npmjs.com/package/react?tab=dependencies#readme",
                    mockRedirectCallback,
                );
                expect(mockRedirectCallback).toHaveBeenCalledWith(
                    "https://npmx.dev/package/react?tab=dependencies#readme",
                );
            });
        });

        describe("org URLs", () => {
            it("should redirect when orgs setting is enabled", async () => {
                const settings = createSettings({ orgs: true });
                await handleRedirect(settings, "https://npmjs.com/org/babel", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/org/babel");
            });

            it("should not redirect when orgs setting is disabled", async () => {
                const settings = createSettings({ orgs: false });
                await handleRedirect(settings, "https://npmjs.com/org/babel", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });
        });

        describe("search URLs", () => {
            it("should redirect when search setting is enabled", async () => {
                const settings = createSettings({ search: true });
                await handleRedirect(settings, "https://npmjs.com/search?q=react", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/search?q=react");
            });

            it("should not redirect when search setting is disabled", async () => {
                const settings = createSettings({ search: false });
                await handleRedirect(settings, "https://npmjs.com/search?q=react", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });
        });

        describe("user URLs", () => {
            it("should redirect when users setting is enabled", async () => {
                const settings = createSettings({ users: true });
                await handleRedirect(settings, "https://npmjs.com/~username", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/~username");
            });

            it("should not redirect when users setting is disabled", async () => {
                const settings = createSettings({ users: false });
                await handleRedirect(settings, "https://npmjs.com/~username", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });
        });

        describe("non-matching URLs", () => {
            it("should not redirect homepage", async () => {
                const settings = createSettings();
                await handleRedirect(settings, "https://npmjs.com/", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });

            it("should not redirect about page", async () => {
                const settings = createSettings();
                await handleRedirect(settings, "https://npmjs.com/about", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });

            it("should not redirect settings page", async () => {
                const settings = createSettings();
                await handleRedirect(settings, "https://npmjs.com/settings", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });
        });

        describe("mixed settings scenarios", () => {
            it("should only redirect enabled route types", async () => {
                const settings = createSettings({
                    packages: true,
                    orgs: false,
                    search: true,
                    users: false,
                });

                // Should redirect packages
                await handleRedirect(settings, "https://npmjs.com/package/react", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/package/react");
                mockRedirectCallback.mockClear();

                // Should not redirect orgs
                await handleRedirect(settings, "https://npmjs.com/org/babel", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
                mockRedirectCallback.mockClear();

                // Should redirect search
                await handleRedirect(settings, "https://npmjs.com/search?q=test", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/search?q=test");
                mockRedirectCallback.mockClear();

                // Should not redirect users
                await handleRedirect(settings, "https://npmjs.com/~user", mockRedirectCallback);
                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });

            it("should not redirect anything when all settings are disabled", async () => {
                const settings = createSettings({
                    packages: false,
                    orgs: false,
                    search: false,
                    users: false,
                });

                await handleRedirect(settings, "https://npmjs.com/package/react", mockRedirectCallback);
                await handleRedirect(settings, "https://npmjs.com/org/babel", mockRedirectCallback);
                await handleRedirect(settings, "https://npmjs.com/search", mockRedirectCallback);
                await handleRedirect(settings, "https://npmjs.com/~user", mockRedirectCallback);

                expect(mockRedirectCallback).not.toHaveBeenCalled();
            });
        });

        describe("edge cases", () => {
            it("should handle URLs with ports", async () => {
                const settings = createSettings({ packages: true });
                await handleRedirect(settings, "https://npmjs.com:443/package/react", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/package/react");
            });

            it("should handle package names with scopes", async () => {
                const settings = createSettings({ packages: true });
                await handleRedirect(settings, "https://npmjs.com/package/@babel/core", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/package/@babel/core");
            });

            it("should handle nested org paths", async () => {
                const settings = createSettings({ orgs: true });
                await handleRedirect(settings, "https://npmjs.com/org/babel/package", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/org/babel/package");
            });

            it("should handle user URLs with additional path segments", async () => {
                const settings = createSettings({ users: true });
                await handleRedirect(settings, "https://npmjs.com/~username/packages", mockRedirectCallback);
                expect(mockRedirectCallback).toHaveBeenCalledWith("https://npmx.dev/~username/packages");
            });
        });
    });
});
