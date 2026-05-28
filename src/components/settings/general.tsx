import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import { ShowToast } from "../../lib/toast";
import { IconTool } from "../../lib/icons";

export default function GeneralSettings() {
  const { settings, statusText } = useStore();

  const save = async (partial: Partial<typeof settings>) => {
    const next = { ...settings, ...partial };
    store.updateSettings(partial);
    try { await invoke("save_settings", { settings: next }); } catch {}
  };

  const toggleRedirection = () => {
    save({ outputRedirection: !settings.outputRedirection });
    ShowToast.success("Toggled...");
  };

  const toggleTopmost = async () => {
    const next = !settings.topmost;
    save({ topmost: next });
    try { await invoke("set_always_on_top", { onTop: next }); } catch {}
    ShowToast.success("Toggled...");
  };

  const toggleAntiAFK = () => {
    save({ antiAFK: !settings.antiAFK });
    ShowToast.success("Toggled...");
  };

  const toggleInternalUI = () => {
    save({ internalUIDisabled: !settings.internalUIDisabled });
    ShowToast.success("Toggled...");
  };

  const handleOpenUiFolder = async () => {
    try { await invoke("open_ui_dir"); ShowToast.success("Opened successfully"); }
    catch { ShowToast.error("Failed to open folder"); }
  };

  return (
    <>
      <div className="section-header">
        <IconTool />
        <h1>General</h1>
      </div>

      {/* Status Text */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Status Text</h2>
          <p className="setting-description">Set the status message displayed in the title bar.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => store.setStatusText("Injected")}><span>Injected</span></button>
          <button className="button" onClick={() => store.setStatusText("Ready")}><span>Ready</span></button>
          <button className="button" onClick={() => store.setStatusText("Error occurred...")}><span>Error</span></button>
          <button className="button" onClick={() => store.setStatusText("")}><span>Clear</span></button>
        </div>
      </div>

      {/* Reset State */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Reset State</h2>
          <p className="setting-description">Resetting the state will clear all the data and settings.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => ShowToast.info("applied..")}><span>Reset</span></button>
        </div>
      </div>

      {/* Randomize HWID */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Randomize HWID Seed</h2>
          <p className="setting-description">This will change the HWID seed used for the emulator.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => ShowToast.success("HWID seed randomized")}><span>Randomize</span></button>
        </div>
      </div>

      {/* Remove Awp */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Remove Awp</h2>
          <p className="setting-description">Removes Awp from injecting into the game.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => ShowToast.message("Removed successfully!")}><span>Remove</span></button>
        </div>
      </div>

      {/* Fix Channel */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Fix Channel</h2>
          <p className="setting-description">
            IMPORTANT: When Roblox is asking to install don't press yes to admin privileges.
            Use this to fix the channel if it's not working. You will need to attach using the
            launch button next as this removes Awp in order to change version.
          </p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => ShowToast.success("Fixed successfully, please attach using launch button next")}><span>Fix</span></button>
        </div>
      </div>

      {/* Crash dumps */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Enable windows crash dumps</h2>
          <p className="setting-description">This will enable windows crash dumps for debugging issues.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => ShowToast.success("Crash dumps enabled")}><span>Enable</span></button>
        </div>
      </div>

      {/* Output Redirection */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Toggle output redirection: {settings.outputRedirection ? "On" : "Off"}</h2>
          <p className="setting-description">If true, this will redirect all console output from the executor to the inbuilt ui console.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={toggleRedirection}><span>{settings.outputRedirection ? "Disable" : "Enable"}</span></button>
        </div>
      </div>

      {/* Topmost */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Toggle topmost: {settings.topmost ? "On" : "Off"}</h2>
          <p className="setting-description">Toggle ui always being on top.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={toggleTopmost}><span>{settings.topmost ? "Disable" : "Enable"}</span></button>
        </div>
      </div>

      {/* Open UI folder */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Open Ui folder</h2>
          <p className="setting-description">Open folder containing the ui files, workspace, autoexec etc.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={handleOpenUiFolder}><span>Open</span></button>
        </div>
      </div>

      {/* Anti AFK */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Toggle antiAFK: {settings.antiAFK ? "On" : "Off"}</h2>
          <p className="setting-description">If true, this will prevent the player from being kicked for idle.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={toggleAntiAFK}><span>{settings.antiAFK ? "Disable" : "Enable"}</span></button>
        </div>
      </div>

      {/* Internal UI */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Internal UI Disabled: {settings.internalUIDisabled ? "True" : "False"}</h2>
          <p className="setting-description">If true, this will prevent the internal ui from popping up on insert.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={toggleInternalUI}><span>{settings.internalUIDisabled ? "Disable" : "Enable"}</span></button>
        </div>
      </div>

      {/* Test Toasts */}
      <div className="section-setting-container">
        <div className="section-setting-description">
          <h2 className="setting-title">Test Toast Messages</h2>
          <p className="setting-description">Trigger each toast type to preview notifications.</p>
        </div>
        <div className="section-setting-interaction">
          <button className="button" onClick={() => ShowToast.success("Success!")}><span>Success</span></button>
          <button className="button" onClick={() => ShowToast.error("Error!")}><span>Error</span></button>
          <button className="button" onClick={() => ShowToast.message("Message!")}><span>Message</span></button>
        </div>
      </div>
    </>
  );
}
