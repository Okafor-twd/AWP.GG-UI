import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import { ShowToast } from "../../lib/toast";
import { IconConsole } from "../../lib/icons";

interface ConsoleSettingsProps {
  appendOutput: (text: string, type?: string) => void;
}

export default function ConsoleSettings({ appendOutput }: ConsoleSettingsProps) {
  const { settings } = useStore();

  const save = async (partial: Partial<typeof settings>) => {
    const next = { ...settings, ...partial };
    store.updateSettings(partial);
    try { await invoke("save_settings", { settings: next }); } catch {}
  };

  const toggleRedirection = () => {
    save({ outputRedirection: !settings.outputRedirection });
    ShowToast.success("Toggled...");
  };

  return (
    <>
      <div className="section-header">
        <IconConsole />
        <h1>Console</h1>
      </div>

      {/* Output Redirection */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">
            Toggle output redirection: {settings.outputRedirection ? "On" : "Off"}
          </h2>
          <p className="setting-description">
            If true, redirects all console output from the executor to the inbuilt ui console.
          </p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={toggleRedirection}>
            <span>{settings.outputRedirection ? "Disable" : "Enable"}</span>
          </button>
        </div>
      </div>

      {/* Test Output */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Test Output Messages</h2>
          <p className="setting-description">
            Trigger each output type to preview how messages appear in the console.
          </p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => appendOutput("This is an error message.", "error")}>
            <span>Error</span>
          </button>
          <button className="button" onClick={() => appendOutput("This is a warning message.", "warn")}>
            <span>Warning</span>
          </button>
          <button className="button" onClick={() => appendOutput("This is an info message.", "info")}>
            <span>Info</span>
          </button>
          <button className="button" onClick={() => appendOutput("This is a print message.")}>
            <span>Message</span>
          </button>
        </div>
      </div>
    </>
  );
}
