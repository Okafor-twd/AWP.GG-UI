import React, { useRef, useEffect, useCallback } from "react";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import { IconPlus, IconSearch, IconXSmall, IconFileAnimated } from "../../lib/icons";

export default function TabBar() {
  const { tabs, activeTabId, route } = useStore();
  const barRef         = useRef<HTMLDivElement>(null);
  const thumbRef       = useRef<HTMLDivElement>(null);
  const updateThumbRef = useRef<() => void>(() => {});

  // -- Custom ScrollBar -------------------------------------------------
  // Depends on `route` so it fully re-initialises when the user navigates
  // back — `return null` below unmounts the DOM, making refs null until
  // the component renders again with route === "scripting".
  useEffect(() => {
    if (route !== "scripting") return;
    const bar   = barRef.current;
    const thumb = thumbRef.current;
    if (!bar || !thumb) return;

    const updateThumb = () => {
      const { scrollLeft, scrollWidth, clientWidth } = bar;
      if (scrollWidth <= clientWidth) { thumb.style.width = "0"; return; }
      const ratio  = clientWidth / scrollWidth;
      const thumbW = Math.max(30, ratio * clientWidth);
      const thumbX = (scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - thumbW);
      thumb.style.width = thumbW + "px";
      thumb.style.left  = thumbX + "px";
    };

    updateThumbRef.current = updateThumb;
    updateThumb(); // paint immediately on (re-)mount

    bar.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);

    let dragging = false, startX = 0, startScroll = 0;
    const onThumbDown = (e: MouseEvent) => {
      dragging = true; startX = e.clientX; startScroll = bar.scrollLeft;
      document.body.style.userSelect = "none"; e.preventDefault();
    };
    const onDocMove = (e: MouseEvent) => {
      if (!dragging) return;
      const { scrollWidth, clientWidth } = bar;
      const thumbW = parseFloat(thumb.style.width);
      bar.scrollLeft = startScroll + ((e.clientX - startX) / (clientWidth - thumbW)) * (scrollWidth - clientWidth);
    };
    const onDocUp = () => { dragging = false; document.body.style.userSelect = ""; };

    thumb.addEventListener("mousedown", onThumbDown);
    document.addEventListener("mousemove", onDocMove);
    document.addEventListener("mouseup", onDocUp);

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) { e.preventDefault(); bar.scrollLeft += e.deltaY; }
    };
    bar.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      bar.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
      thumb.removeEventListener("mousedown", onThumbDown);
      document.removeEventListener("mousemove", onDocMove);
      document.removeEventListener("mouseup", onDocUp);
      bar.removeEventListener("wheel", onWheel);
    };
  }, [route]);

  // Re-calculate thumb whenever tabs are added / removed / reordered
  useEffect(() => {
    requestAnimationFrame(() => updateThumbRef.current());
  }, [tabs]);

  // Tab Actions
  const switchTab = (id: number) => store.setActiveTabId(id);

  const addTab = () => {
    const s = store.get();
    const id = s.nextTabId;
    store.setNextTabId(id + 1);
    store.setTabs([...s.tabs, { id, title: "Untitled Tab", content: "" }]);
    store.setActiveTabId(id);
  };

  const closeTab = (id: number) => {
    const s = store.get();
    if (s.tabs.length === 1) {
      store.setTabs([{ ...s.tabs[0], title: "Untitled Tab", content: "" }]);
      store.setActiveTabId(s.tabs[0].id);
      return;
    }
    const idx     = s.tabs.findIndex((t) => t.id === id);
    const newTabs = s.tabs.filter((t) => t.id !== id);
    store.setTabs(newTabs);
    if (s.activeTabId === id)
      store.setActiveTabId(newTabs[Math.min(idx, newTabs.length - 1)].id);
  };

  // ── Mouse-based drag reorder
  const dragState = useRef<{
    fromId: number;
    startX: number;
    startY: number;
    moved: boolean;
    ghost: HTMLElement | null;
  } | null>(null);

  const onTabMouseDown = useCallback((e: React.MouseEvent, tabId: number) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest(".close-tab-btn")) return;

    e.preventDefault();
    dragState.current = { fromId: tabId, startX: e.clientX, startY: e.clientY, moved: false, ghost: null };

    const onMouseMove = (ev: MouseEvent) => {
      const ds = dragState.current;
      if (!ds) return;

      const dx = Math.abs(ev.clientX - ds.startX);
      const dy = Math.abs(ev.clientY - ds.startY);

      if (!ds.moved && dx < 4 && dy < 4) return;
      ds.moved = true;

      const sourceEl = document.querySelector(`[data-tab-id="${ds.fromId}"]`) as HTMLElement | null;
      if (sourceEl) sourceEl.style.opacity = "0.5";

      const bar = barRef.current;
      if (!bar) return;
      const tabs = Array.from(bar.querySelectorAll(".tab")) as HTMLElement[];

      tabs.forEach((t) => t.classList.remove("drag-over"));

      for (const tab of tabs) {
        const rect = tab.getBoundingClientRect();
        if (ev.clientX >= rect.left && ev.clientX <= rect.right) {
          const hoverId = parseInt(tab.dataset.tabId || "0");
          if (hoverId !== ds.fromId) tab.classList.add("drag-over");
          break;
        }
      }
    };

    const onMouseUp = (ev: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      const ds = dragState.current;
      dragState.current = null;
      if (!ds) return;

      const sourceEl = document.querySelector(`[data-tab-id="${ds.fromId}"]`) as HTMLElement | null;
      if (sourceEl) sourceEl.style.opacity = "";
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("drag-over"));

      if (!ds.moved) {
        switchTab(ds.fromId);
        return;
      }

      const bar = barRef.current;
      if (!bar) return;
      const tabEls = Array.from(bar.querySelectorAll(".tab")) as HTMLElement[];
      let toId: number | null = null;
      for (const tab of tabEls) {
        const rect = tab.getBoundingClientRect();
        if (ev.clientX >= rect.left && ev.clientX <= rect.right) {
          const hid = parseInt(tab.dataset.tabId || "0");
          if (hid !== ds.fromId) { toId = hid; break; }
        }
      }

      if (toId === null) return;

      const s = store.get();
      const fromIdx = s.tabs.findIndex((t) => t.id === ds.fromId);
      const toIdx   = s.tabs.findIndex((t) => t.id === toId);
      if (fromIdx === -1 || toIdx === -1) return;
      const newTabs = [...s.tabs];
      const [moved] = newTabs.splice(fromIdx, 1);
      newTabs.splice(toIdx, 0, moved);
      store.setTabs(newTabs);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  const filterScripts = (q: string) => {
    const s = store.get();
    store.setFilteredScripts(
      q.trim() ? s.scripts.filter((sc) => sc.name.toLowerCase().includes(q.toLowerCase())) : s.scripts
    );
  };

  if (route !== "scripting") return null;

  return (
    <div className="tab-bar-search" id="tabBarRow">
      <div className="tab-bar-wrapper">
        <div className="tab-bar" id="tabBar" ref={barRef}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="tab"
              data-active={tab.id === activeTabId ? "true" : "false"}
              data-tab-id={tab.id}
              onMouseDown={(e) => onTabMouseDown(e, tab.id)}
            >
              <IconFileAnimated key={`tab-icon-${tab.id}`} />
              <span className="tab-title">{tab.title}</span>
              <button
                className="close-tab-btn"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
              >
                <IconXSmall width={13} height={13} />
              </button>
            </div>
          ))}

          <span id="new-tab" onClick={addTab}>
            <IconPlus />
          </span>
        </div>

        <div className="tab-bar-scrollbar" id="tabScrollbar">
          <div className="tab-bar-scrollbar-thumb" id="tabScrollThumb" ref={thumbRef} />
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-container">
          <IconSearch />
          <input
            type="text"
            placeholder="Search..."
            onInput={(e) => filterScripts((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>
    </div>
  );
}