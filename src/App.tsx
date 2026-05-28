import React, { useRef, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "./hooks/useStore";
import { store, Settings, DEFAULT_SETTINGS } from "./store";
import TitleBar from "./components/scripting/titlebar";
import TabBar from "./components/scripting/TabBar";
import ScriptingView from "./components/scripting/workspace_view";
import SettingsView from "./components/scripting/settings_view";
import Login from "./components/login/login";

export default function App() {
  const { route } = useStore();
  const editorRef = useRef<any>(null);

  // Load settings + scripts on mount
  useEffect(() => {
    invoke<Settings>("load_settings")
      .then((s) => store.setSettings({ ...DEFAULT_SETTINGS, ...s }))
      .catch(() => store.setSettings({ ...DEFAULT_SETTINGS }));

    invoke<{ name: string; content: string; path: string }[]>("read_scripts_dir")
      .then((scripts) => store.setScripts(scripts))
      .catch(() => store.setScripts([]));
  }, []);

  // Save settings on close
  useEffect(() => {
    const handler = () => {
      invoke("save_settings", { settings: store.get().settings }).catch(() => {});
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // When switching back to scripting, trigger refit of xterm + Monaco layout.
  // We use multiple timeouts because the browser needs a few frames to fully
  // paint the newly-visible layout before measurements are accurate.
  useEffect(() => {
    if (route !== "scripting") return;
    const refitAll = () => {
      (window as any).__awpRefit?.();
    };
    // Fire at 0, 50, 150, 300ms to catch all layout phases
    const t1 = setTimeout(refitAll, 0);
    const t2 = setTimeout(refitAll, 50);
    const t3 = setTimeout(refitAll, 150);
    const t4 = setTimeout(refitAll, 300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [route]);

  const appendOutput = (text: string, type?: string) => {
    (window as any).__awpOutput?.appendOutput(text, type);
  };

  return (
    <div className="page-container">
      {route !== "login" && <TitleBar />}
      {route !== "login" && <TabBar />}

      <div className="scripting-content-group">
        {route === "login" ? (
          <Login />
        ) : (
          <>
            <div style={{ display: route === "scripting" ? "flex" : "none", width: "100%", height: "100%" }}>
              <ScriptingView />
            </div>
            <div style={{ display: route === "settings" ? "flex" : "none", width: "100%", height: "100%" }}>
              <SettingsView editorRef={editorRef} appendOutput={appendOutput} />
            </div>
          </>
        )}
      </div>
      <div id="awp-toaster" />
    </div>
  );
}