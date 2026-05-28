import React, { useState } from "react";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import {
  IconLoginUser,
  IconLoginPassword,
  IconMinimize,
  IconMaximize,
  IconClose,
} from "../../lib/icons";
import { appWindow } from "@tauri-apps/api/window";
import { ShowToast } from "../../lib/toast";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Login() {
  const { route } = useStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ── Window controls ─────────────────────────────────────────────────────
  const handleMinimize = () => appWindow.minimize();

  const handleMaximize = async () => {
    if (await appWindow.isMaximized()) {
      appWindow.unmaximize();
    } else {
      appWindow.maximize();
    }
  };

  const handleClose = () => appWindow.close();

  // ── Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (username == "failfetch") {
        return ShowToast.error("Failed to fetch");
    }
    store.setRoute("scripting");
  };

  // ── Render 
  return (
    <div className="page-container">

      {/* Title bar */}
      <div data-tauri-drag-region="true" className="title-bar">
        <div className="heading">
          <h1 className="branding">
            AWP<span style={{ color: "#6a6a6a" }}>.</span>GG
          </h1>
        </div>
        <div className="window-controls">
          <button className="control" onClick={handleMinimize}>
            <IconMinimize />
          </button>
          <button className="control" onClick={handleMaximize}>
            <IconMaximize />
          </button>
          <button className="control" onClick={handleClose}>
            <IconClose />
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form className="login-content" onSubmit={handleLogin}>
        <div className="login-column">
          <h1 id="title">Login</h1>

          {/* Username / Email */}
          <div className="input-container">
            <div className="iconify">
              <IconLoginUser width={19} height={19} color="gray" />
            </div>
            <input 
              
              name="emailOrUsername"
              type="text"
              placeholder="Username or Email..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="input-container">
            <div id="password-icon" className="iconify">
              <IconLoginPassword width={18} height={18} color="gray" />
            </div>
            <input
              name="password"
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="button"
            style={{
              textDecoration: "none",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       "14px",
              cursor:         "pointer",
            }}
          >
            <span>Continue</span>
          </button>
        </div>
      </form>
    </div>
  );
}