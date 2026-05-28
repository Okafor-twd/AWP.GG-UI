import React from "react";
import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import { ShowToast } from "../../lib/toast";
import {
  IconExecute,
  IconTrash,
  IconFolderOpen,
  IconFileCode,
  IconSave,
  IconRocket,
  PLUGS_DISCONNECTED_PATH,
  PLUGS_CONNECTED_PATH,
} from "../../lib/icons";

interface ButtonsProps {
  getEditorValue: () => string;
  appendOutput: (text: string, type?: string) => void;
  clearOutput: () => void;
}

export default function Buttons({ getEditorValue, appendOutput, clearOutput }: ButtonsProps) {
  const { selectedInstance, connected, tabs, activeTabId } = useStore();

  const hasInstance = !!selectedInstance;

  const handleExecute = () => {
    if (!selectedInstance) { ShowToast.error("No instance selected"); return; }
    const script = getEditorValue();
   // appendOutput(`Executing script on PID ${selectedInstance.id}...`, "info");

    // invoke("execute_script", { pid: selectedInstance.id, script });
  };

  const handleClear = () => {
    clearOutput();
   
    const editor = (window as any).__awpEditor;
    if (editor) editor.setValue("");
    // Keep the store tab content in sync
    const s = store.get();
    store.setTabs(s.tabs.map(t => t.id === s.activeTabId ? { ...t, content: "" } : t));
  };

  const handleOpen = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Lua Scripts", extensions: ["lua", "txt"] }],
      });
      if (!selected || Array.isArray(selected)) return;
      const content = await readTextFile(selected as string);
      const name = (selected as string).split(/[\\/]/).pop() || "script.lua";
      // Open as new tab
      const cur = store.get().tabs.find((t) => t.id === store.get().activeTabId);
      const s = store.get();
      const id = s.nextTabId;
      store.setNextTabId(id + 1);
      const newTabs = [...s.tabs, { id, title: name, content, filePath: selected as string }];
      store.setTabs(newTabs);
      store.setActiveTabId(id);
      ShowToast.success(`Opened: ${name}`);
    } catch (e: any) {
      if (e !== "cancelled") console.log("Failed to open file.");//ShowToast.error("Failed to open file");
    }
  };

  const handleExecuteFile = async () => {
    if (!selectedInstance) { ShowToast.error("No instance selected"); return; }
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Lua Scripts", extensions: ["lua", "txt"] }],
      });
      if (!selected || Array.isArray(selected)) return;
      const content = await readTextFile(selected as string);
      const name = (selected as string).split(/[\\/]/).pop() || "script.lua";
     // appendOutput(`Executing file: ${name} on ${selectedInstance.name}...`, "info");
     // ShowToast.message(`Executing file: ${name} on ${selectedInstance.name}...`);
    } catch (e: any) {
      if (e !== "cancelled") return;
    }
  };

  const handleSave = async () => {
    const s = store.get();
    const tab = s.tabs.find((t) => t.id === s.activeTabId);
    if (!tab) return;
    const content = getEditorValue();
    try {
      await invoke("save_script", { name: tab.title, content });
    //  ShowToast.success(`Saved: ${tab.title}`);
    } catch {
      //ShowToast.error("Failed to save script");
    }
  };

  const handleLaunch = () => {
    ShowToast.message("launch_rbxproc - main.rs");
    
    invoke("launch_rbxproc");
  };

  return (
    <div className="editor-controls-container">
      {/* Execute */}
      <button
        className="button"
        id="btnExecute"
        data-active={hasInstance ? "true" : "false"}
        disabled={!hasInstance}
        onClick={handleExecute}
      >
        <IconExecute />
        <span>Execute</span>
      </button>

      {/* Clear */}
      <button className="button" data-active="true" onClick={(e) => { e.stopPropagation(); handleClear(); }}>
        <IconTrash />
        <span>Clear</span>
      </button>

      {/* Open */}
      <button className="button" data-active="true" onClick={handleOpen}>
        <IconFolderOpen />
        <span>Open</span>
      </button>

      {/* Execute File */}
      <button
        className="button"
        id="btnExecFile"
        data-active={hasInstance ? "true" : "false"}
        disabled={!hasInstance}
        onClick={handleExecuteFile}
      >
        <IconFileCode />
        <span>Execute</span>
      </button>

      {/* Save */}
      <button className="button" data-active="true" onClick={handleSave}>
        <IconSave />
        <span>Save</span>
      </button>

      <div className="editor-controls-seperator" />

      {/* Process controls */}
      <div id="process-controls-container">
        {/* Plugs icon */}
        <span id="attach-icon" style={{ display: "flex", alignItems: "center", color: "gray", width: 24, height: 24 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
            <path d={connected ? PLUGS_CONNECTED_PATH : PLUGS_DISCONNECTED_PATH} />
          </svg>
        </span>

        {/* Launch */}
        <button id="launch-btn" onClick={handleLaunch}>
          <IconRocket />
        </button>
      </div>
    </div>
  );
}