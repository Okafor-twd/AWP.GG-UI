import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import { ShowToast } from "../../lib/toast";
import { IconCode } from "../../lib/icons";

interface EditorSettingsProps {
  editorRef: React.MutableRefObject<any>;
}

export default function EditorSettings({ editorRef }: EditorSettingsProps) {
  const { settings } = useStore();

  const save = async (partial: Partial<typeof settings>) => {
    const next = { ...settings, ...partial };
    store.updateSettings(partial);
    try { await invoke("save_settings", { settings: next }); } catch {}
  };

  const changeFontSize = (delta: number) => {
    const next = Math.max(8, Math.min(32, settings.fontSize + delta));
    save({ fontSize: next });
    editorRef.current?.updateOptions({ fontSize: next });
  };

  const toggleWordWrap = () => {
    const next = settings.wordWrap === "on" ? "off" : "on";
    save({ wordWrap: next });
    editorRef.current?.updateOptions({ wordWrap: next });
   // ShowToast.message(`Word wrap: ${next}`);
  };

  return (
    <>
      <div className="section-header">
        <IconCode />
        <h1>Editor</h1>
      </div>

      {/* Font Size */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Font Size</h2>
          <p className="setting-description">
            Increase or decrease the editor font size. Current: {settings.fontSize}px
          </p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => changeFontSize(-1)}><span>–</span></button>
          <button className="button" onClick={() => changeFontSize(1)}><span>+</span></button>
        </div>
      </div>

      {/* Word Wrap */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Word Wrap</h2>
          <p className="setting-description">
            Toggle word wrap in the editor. Currently: {settings.wordWrap === "on" ? "On" : "Off"}
          </p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={toggleWordWrap}><span>Toggle</span></button>
        </div>
      </div>
    </>
  );
}
