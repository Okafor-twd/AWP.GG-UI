import React from "react";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import { IconWorkspace, IconFileAnimated } from "../../lib/icons";

export default function Workspace() {
  const { filteredScripts, workspaceOpen } = useStore();

  const toggle = () => store.setWorkspaceOpen(!store.get().workspaceOpen);

  const openScript = (name: string, content: string) => {
    const s = store.get();
    const existing = s.tabs.find((t) => t.title === name);
    if (existing) { store.setActiveTabId(existing.id); return; }
    const id = s.nextTabId;
    store.setNextTabId(id + 1);
    store.setTabs([...s.tabs, { id, title: name, content }]);
    store.setActiveTabId(id);
  };

  return (
    <div className="script-list">
      <div className="script-list-scroll-area">
        <div className="workspace-content">
          <div
            className="script-list-section"
            data-state={workspaceOpen ? "open" : "closed"}
            id="workspaceSection"
          >
            <div className="script-list-section-header" onClick={toggle}>
              <IconWorkspace />
              <h1 id="ws-section-title">Workspace</h1>
              <span id="ws-chevron" style={{ display: "flex", alignItems: "center", color: "#c5c5c5", transition: "transform 0.3s" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 15l6-6l6 6" />
                </svg>
              </span>
            </div>

            <div className="script-list-section-items" id="scriptItems">
              {workspaceOpen && filteredScripts.map((script) => {
                return (
                  <div
                    key={script.path}
                    className="script-list-item-container"
                    onClick={() => openScript(script.name, script.content)}
                  >
                    {/* key=script.path — fresh mount only when a new path appears,
                        so SMIL animation fires exactly once per script */}
                    <IconFileAnimated key={`ws-icon-${script.path}`} />
                    <span className="script-list-item">{script.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}