import React, { useRef, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import { ShowToast } from "../../lib/toast";
import {
  IconFileCode,
  IconChevronDown,
  IconLogout,
  IconMinimize,
  IconMaximize,
  IconClose,
} from "../../lib/icons";

export default function TitleBar() {
  const { route, statusText } = useStore();
  const [ddOpen, setDdOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const ddRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !ddRef.current?.contains(e.target as Node)
      ) {
        setDdOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const navTo = (r: "scripting" | "settings") => {
    setDdOpen(false);
    store.setRoute(r);
    if (r === "settings") store.setSettingsTab("general");
  };

  const handleMinimize = async () => {
    try { await invoke("minimize_window"); } catch { ShowToast.message("Minimizing..."); }
  };
  const handleMaximize = async () => {
    try { await invoke("maximize_window"); } catch { ShowToast.message("Maximizing..."); }
  };
  const handleClose = async () => {
    try { await invoke("close_window"); } catch { ShowToast.message("Closing..."); }
  };
  const handleLogout = () => store.setRoute("login") //ShowToast.message("Logging out...");

  const routeLabel = route === "scripting" ? "Scripting" : "Settings";

  return (
    <div className="title-bar" data-tauri-drag-region>
      <div className="heading" data-tauri-drag-region>
        {/* Branding */}
        <span className="branding" data-tauri-drag-region>
          AWP<span><span style={{ color: "#6a6a6a" }}>.</span>GG</span>
        </span>

        <div className="seperator" data-tauri-drag-region />

        {/* Route dropdown */}
        <div style={{ position: "relative" }}>
          <button
            ref={btnRef}
            className={`tab-dropdown-button${ddOpen ? " open" : ""}`}
            onClick={() => setDdOpen((o) => !o)}
          >
            <IconFileCode />
            <h1 className="label">{routeLabel}</h1>
            <span id="chevron" style={{ display: "flex", alignItems: "center" }}>
              <IconChevronDown />
            </span>
          </button>

          <div ref={ddRef} className={`DropdownMenuContent${ddOpen ? " open" : ""}`}>
            <div
              className="tab-dropdown-item"
              data-status={route === "scripting" ? "active" : undefined}
              onClick={() => navTo("scripting")}
            >
              <IconFileCode width={14} height={14} />
              <h1 className="item">Scripting</h1>
            </div>
            <div
              className="tab-dropdown-item"
              data-status={route === "settings" ? "active" : undefined}
              onClick={() => navTo("settings")}
            >
              <h1 className="item">Settings</h1>
            </div>
          </div>
        </div>

        {/* Logout */}
        <a
          onClick={handleLogout}
          style={{ paddingTop: 4, cursor: "pointer", display: "flex", alignItems: "center" }}
         
        >
          <IconLogout />
        </a>

        {/* Status text — fills the remaining space, drag region */}
        <h1 className="status-text" data-tauri-drag-region>{statusText}</h1>
      </div>

      {/* Window controls */}
      <div className="window-controls">
        <button className="control" onClick={handleMinimize}>
          <IconMinimize />
        </button>
        <button className="control" onClick={handleMaximize}>
          <IconMaximize />
        </button>
        <button className="control close-btn"  onClick={handleClose}>
          <IconClose />
        </button>
      </div>
    </div>
  );
}