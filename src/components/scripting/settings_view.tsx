import React from "react";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import GeneralSettings from "../settings/general";
import EditorSettings from "../settings/editor";
import ConsoleSettings from "../settings/ccnsole";
import { IconTool, IconCode, IconConsole } from "../../lib/icons";

interface SettingsViewProps {
  editorRef: React.MutableRefObject<any>;
  appendOutput: (text: string, type?: string) => void;
}

export default function SettingsView({ editorRef, appendOutput }: SettingsViewProps) {
  const { settingsTab } = useStore();

  const setTab = (t: "general" | "editor" | "console") => store.setSettingsTab(t);

  return (
    <div
      id="settingsView"
      style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}
    >
      <div className="settings-container">
        {/* Vertical icon tab bar */}
        <div className="settings-tabbar">
          <div
            className="settings-tab"
            data-status={settingsTab === "general" ? "active" : undefined}
            id="stab-general"
           
            onClick={() => setTab("general")}
          >
            <IconTool />
          </div>
          <div
            className="settings-tab"
            data-status={settingsTab === "editor" ? "active" : undefined}
            id="stab-editor"
           
            onClick={() => setTab("editor")}
          >
            <IconCode />
          </div>
          <div
            className="settings-tab"
            data-status={settingsTab === "console" ? "active" : undefined}
            id="stab-console"
           
            onClick={() => setTab("console")}
          >
            <IconConsole />
          </div>
        </div>

        {/* Tab content */}
        <div className="settings-content" id="settingsContent">
          {settingsTab === "general" && <GeneralSettings />}
          {settingsTab === "editor"  && <EditorSettings editorRef={editorRef} />}
          {settingsTab === "console" && <ConsoleSettings appendOutput={appendOutput} />}
        </div>
      </div>
    </div>
  );
}
