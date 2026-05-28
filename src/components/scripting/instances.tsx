import React, { useRef, useEffect, useState } from "react";
import { useStore } from "../../hooks/useStore";
import { store, Instance } from "../../store";
import { IconUser } from "../../lib/icons";

// Usage from Rust via eval / from JS:
//   window.__awp.addInstance(12345)
//   window.__awp.removeInstance(12345)
if (typeof window !== "undefined") {
  (window as any).__awp = (window as any).__awp ?? {};

  (window as any).__awp.addInstance = (pid: number, name?: string) => {
    const s = store.get();
    if (s.instances.find((i) => i.id === pid)) return; // no dupes
    const label = name || `RobloxPlayerBeta.exe (PID ${pid})`;
    const newInst = { id: pid, name: label };
    const newList = [...s.instances, newInst];
    store.setInstances(newList);
    // Auto-select if this is the first instance
    if (newList.length === 1) {
      store.setSelectedInstance(newInst);
      store.setConnected(true);
    }
  };

  (window as any).__awp.removeInstance = (pid: number) => {
    const s = store.get();
    const next = s.instances.filter((i) => i.id !== pid);
    store.setInstances(next);
    // If the removed instance was selected, pick another or go to none
    if (s.selectedInstance?.id === pid) {
      if (next.length > 0) {
        store.setSelectedInstance(next[0]);
        store.setConnected(true);
      } else {
        store.setSelectedInstance(null);
        store.setConnected(false);
      }
    }
  };
}

export default function Instances() {
  const { instances, selectedInstance } = useStore();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const selectInstance = (inst: Instance) => {
    store.setSelectedInstance(inst);
    store.setConnected(true);
    setOpen(false);
  };

  return (
    <div className="instance-selector-container">
      <div
        ref={triggerRef}
        className="instance-selector-trigger"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
      >
        <IconUser />
        <span id="inst-title">{selectedInstance ? selectedInstance.name : "None"}</span>

        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, marginLeft: "auto", transition: "transform 0.2s", transform: open ? "rotate(180deg)" :  "rotate(180deg)" }}
        >
          <path d="m6 15l6-6l6 6" />
        </svg>

        {/* Dropdown */}
        <div className={`instance-dropdown${open ? " open" : ""}`}>
          {instances.map((inst) => (
            <div
              key={inst.id}
              className="instance-dropdown-item"
              data-status={selectedInstance?.id === inst.id ? "active" : undefined}
              onClick={(e) => { e.stopPropagation(); selectInstance(inst); }}
            >
              {inst.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}