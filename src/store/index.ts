// ─────────────────────────────────────────────
//  AWP.GG – Global state (no external library)
// ─────────────────────────────────────────────

export interface Tab {
  id: number;
  title: string;
  content: string;
  filePath?: string;
}

export interface ScriptFile {
  name: string;
  content: string;
  path: string;
}

export interface Instance {
  id: number;
  name: string;
}

export interface Settings {
  outputRedirection: boolean;
  topmost: boolean;
  antiAFK: boolean;
  internalUIDisabled: boolean;
  fontSize: number;
  wordWrap: "on" | "off";
}

export const DEFAULT_SETTINGS: Settings = {
  outputRedirection: true,
  topmost: false,
  antiAFK: true,
  internalUIDisabled: false,
  fontSize: 14,
  wordWrap: "off",
};

// ── Pub/sub ────────────────────────────────────────────────────────
type Listener = () => void;
const _listeners = new Set<Listener>();

export function subscribeStore(fn: Listener) {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

function notify() { _listeners.forEach((l) => l()); }

// ── State ──────────────────────────────────────────────────────────
const _state = {
  route:            "login" as "login" | "scripting" | "settings",
  tabs:             [{ id: 1, title: "Untitled Tab", content: "-- Welcome to AWP!" }] as Tab[],
  activeTabId:      1,
  nextTabId:        2,
  scripts:          [] as ScriptFile[],
  filteredScripts:  [] as ScriptFile[],
  instances:        [] as Instance[],
  selectedInstance: null as Instance | null,
  settings:         { ...DEFAULT_SETTINGS } as Settings,
  statusText:       "",
  consoleOpen:      true,
  workspaceOpen:    true,
  settingsTab:      "general" as "general" | "editor" | "console",
  connected:        false,
};

function set<K extends keyof typeof _state>(key: K, value: (typeof _state)[K]) {
  (_state as any)[key] = value;
  notify();
}

// ── Public API ────────────────────────────────────────────────────
export const store = {
  get: () => _state,

  setRoute:            (r: typeof _state.route)            => set("route", r),
  setTabs:             (tabs: Tab[])                        => set("tabs", tabs),
  setActiveTabId:      (id: number)                         => set("activeTabId", id),
  setNextTabId:        (id: number)                         => set("nextTabId", id),

  setScripts: (scripts: ScriptFile[]) => {
    set("scripts", scripts);
    set("filteredScripts", scripts);
  },
  setFilteredScripts:  (s: ScriptFile[])                    => set("filteredScripts", s),

  setInstances:        (i: Instance[])                      => set("instances", i),
  setSelectedInstance: (i: Instance | null)                 => set("selectedInstance", i),

  setSettings:         (s: Settings)                        => set("settings", s),
  updateSettings: (partial: Partial<Settings>) =>
    set("settings", { ..._state.settings, ...partial }),

  setStatusText:       (s: string)                          => set("statusText", s),
  setConsoleOpen:      (o: boolean)                         => set("consoleOpen", o),
  setWorkspaceOpen:    (o: boolean)                         => set("workspaceOpen", o),
  setSettingsTab:      (t: typeof _state.settingsTab)       => set("settingsTab", t),
  setConnected:        (c: boolean)                         => set("connected", c),
};
