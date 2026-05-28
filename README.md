# AWP.GG – UI (Tauri)

Full Tauri + React + TypeScript port of the AWP.GG scripting HTML UI.

RECONSTRUCTED WITH UI DUMP, FROM AWP.GG ORIGINAL UI.

put "failfetch" in the username box and click confirm to test toast "failed to fetch" toast error messsage.
---

## Prerequisites

| Tool | Install |
|------|---------|
| [Node.js 18+](https://nodejs.org) | `winget install OpenJS.NodeJS` |
| [Rust + Cargo](https://rustup.rs) | `rustup-init.exe` |
| [Tauri CLI prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) | Windows: WebView2 (comes with Win10+) |

---

## Project Structure

```
AWP.GG-UI/
├── src/                          # React frontend
│   ├── App.tsx                   # Root – loads settings/scripts on mount
│   ├── main.tsx
│   ├── store/index.ts            # Global state (custom pub-sub, no zustand)
│   ├── hooks/useStore.ts         # React hook that re-renders on state change
│   ├── lib/
│   │   ├── icons.tsx             # Every SVG icon (identical to HTML originals)
│   │   └── toast.ts              # Sonner-faithful toast system
│   ├── styles/globals.css        # All CSS – exact 1:1 port from HTML
│   └── components/
        ├── login/
        │   └── login.tsx         # Main Login route (no backend implemented)
│       └── scripting/
│       │   ├── titlebar.tsx      # Branding, route dropdown, logout, window controls
│       │   ├── TabBar.tsx        # Tabs + drag reorder + scrollbar + search bar
│       │   ├── editor.tsx        # Monaco editor (Lua language, awp-dark theme)
│       │   ├── buttons.tsx       # Execute/Clear/Open/Save/Launch controls row
│       │   ├── output.tsx        # xterm.js console with ANSI colour output
│       │   ├── workspace.tsx     # Right sidebar script list
│       │   ├── instances.tsx     # Instance selector dropdown
│       │   ├── workspace_view.tsx# Scripting layout (editor+console+sidebar)
│       │   └── settings_view.tsx # Settings layout wrapper
│       └── settings/
│           ├── general.tsx       # General settings tab
│           ├── editor.tsx        # Editor settings tab
│           └── ccnsole.tsx       # Console settings tab
├── src-tauri/
│   ├── src/main.rs               # Tauri commands: fs, settings, window ops
│   ├── Cargo.toml
│   ├── build.rs
│   └── tauri.conf.json
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Runtime Folders (next to the .exe)

```
ui.exe
scripts/          ← .lua / .txt files auto-loaded into the workspace sidebar
settings/
  settings.json   ← written on close, read on launch
```

Both folders are created automatically on first run.

---

## Development

```bash
npm install
npm run tauri dev
```

## Production Build

```bash
npm run tauri build
# output: src-tauri/target/release/ui.exe (+ installer in bundle/)
```

---

## Tauri Commands (src-tauri/src/main.rs)

| Command | Description |
|---------|-------------|
| `read_scripts_dir` | Scans `<exe_dir>/scripts/` for .lua/.txt files |
| `read_script_file(path)` | Reads a single file |
| `save_script(name, content)` | Saves to `<exe_dir>/scripts/<name>` |
| `load_settings` | Reads `<exe_dir>/settings/settings.json` |
| `save_settings(settings)` | Writes settings JSON |
| `minimize_window` | Minimizes the window |
| `maximize_window` | Toggles maximize |
| `close_window` | Closes the app |
| `set_always_on_top(onTop)` | Topmost toggle |
| `open_scripts_folder` | Opens scripts dir in Explorer |

---

## Adding Real Instances / Script Execution

In `src/store/index.ts`, add instances via:
```typescript
store.setInstances([{ id: 12345, name: "any name here" }]);
store.setInstances([{ id: 12345, name: "12345" }]);

store.removeInstances([{name: "12345"}]);
```

Wire up a Tauri event listener in `src/App.tsx`:
```typescript
import { listen } from "@tauri-apps/api/event";
listen("instance-attach", (e) => store.setInstances([...store.get().instances, e.payload]));
listen("script-output", (e) => (window as any).__awpOutput?.appendOutput(e.payload.msg, e.payload.type));
```
