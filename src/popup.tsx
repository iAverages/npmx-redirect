import { useSettings, type Settings } from "./settings";
import logo from "../assets/icon.png";
import "./style.css";

function IndexPopup() {
    const [settings, setSettings] = useSettings();

    const handleToggle = async (key: keyof Settings) => {
        setSettings({
            ...settings,
            [key]: !settings[key],
        });
    };

    return (
        <div className="w-80 bg-zinc-900 text-zinc-200 font-sans text-sm leading-normal">
            <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center gap-3">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#cb3837] to-[#e53e3e] rounded-lg flex items-center justify-center font-bold text-[10px] text-white tracking-wide">
                        <img src={logo} className="w-12 h-12" />
                    </div>
                </div>
                <h1 className="text-lg font-semibold text-zinc-50 tracking-tight">npmx Redirect</h1>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between gap-4 py-3 pb-4">
                    <div className="flex-1 flex flex-col gap-0.5">
                        <span className="font-medium text-zinc-50 text-sm">Enable Extension</span>
                        <span className="text-xs text-zinc-400">Master switch for all redirects</span>
                    </div>
                    <button
                        className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors ${
                            settings.enabled ? "bg-[#cb3837] hover:bg-[#e53e3e]" : "bg-zinc-700 hover:bg-zinc-600"
                        }`}
                        onClick={() => handleToggle("enabled")}
                        aria-label="Toggle extension"
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform ${
                                settings.enabled ? "translate-x-5" : ""
                            }`}
                        />
                    </button>
                </div>

                <div className="h-px bg-zinc-800 my-2" />

                <div className={`transition-opacity ${!settings.enabled ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="flex items-center justify-between gap-4 py-3">
                        <div className="flex-1 flex flex-col gap-0.5">
                            <span className="font-medium text-zinc-50 text-sm">Packages</span>
                            <span className="text-xs text-zinc-400">Redirect /package/* pages</span>
                        </div>
                        <button
                            className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                settings.packages ? "bg-[#cb3837] hover:bg-[#e53e3e]" : "bg-zinc-700 hover:bg-zinc-600"
                            }`}
                            onClick={() => handleToggle("packages")}
                            disabled={!settings.enabled}
                            aria-label="Toggle package redirects"
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform ${
                                    settings.packages ? "translate-x-5" : ""
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-3">
                        <div className="flex-1 flex flex-col gap-0.5">
                            <span className="font-medium text-zinc-50 text-sm">Search</span>
                            <span className="text-xs text-zinc-400">Redirect /search pages</span>
                        </div>
                        <button
                            className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                settings.search ? "bg-[#cb3837] hover:bg-[#e53e3e]" : "bg-zinc-700 hover:bg-zinc-600"
                            }`}
                            onClick={() => handleToggle("search")}
                            disabled={!settings.enabled}
                            aria-label="Toggle search redirects"
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform ${
                                    settings.search ? "translate-x-5" : ""
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-3">
                        <div className="flex-1 flex flex-col gap-0.5">
                            <span className="font-medium text-zinc-50 text-sm">Users</span>
                            <span className="text-xs text-zinc-400">Redirect ~user pages</span>
                        </div>
                        <button
                            className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                settings.users ? "bg-[#cb3837] hover:bg-[#e53e3e]" : "bg-zinc-700 hover:bg-zinc-600"
                            }`}
                            onClick={() => handleToggle("users")}
                            disabled={!settings.enabled}
                            aria-label="Toggle user redirects"
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform ${
                                    settings.users ? "translate-x-5" : ""
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-3">
                        <div className="flex-1 flex flex-col gap-0.5">
                            <span className="font-medium text-zinc-50 text-sm">Organizations</span>
                            <span className="text-xs text-zinc-400">Redirect /org/* pages</span>
                        </div>
                        <button
                            className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                settings.orgs ? "bg-[#cb3837] hover:bg-[#e53e3e]" : "bg-zinc-700 hover:bg-zinc-600"
                            }`}
                            onClick={() => handleToggle("orgs")}
                            disabled={!settings.enabled}
                            aria-label="Toggle organization redirects"
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform ${
                                    settings.orgs ? "translate-x-5" : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-3 px-5 bg-zinc-950 border-t border-zinc-800 text-center">
                <span className="text-xs text-zinc-500 font-medium">Redirects npmjs.com -{">"} npmx.dev</span>
            </div>
        </div>
    );
}

export default IndexPopup;
