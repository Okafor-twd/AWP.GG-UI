import React, { useRef, useEffect, useCallback } from "react";
import type * as MonacoType from "monaco-editor";
import EditorPanel from "./editor";
import Output, { OutputHandle } from "./output";
import Workspace from "./workspace";
import Instances from "./instances";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";

export default function ScriptingView() {
  const { consoleOpen } = useStore();
  const editorRef       = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null);
  const outputRef       = useRef<OutputHandle | null>(null);
  const consolePanelRef = useRef<HTMLDivElement>(null);
  const editorWrapRef   = useRef<HTMLDivElement>(null);
  const panelGroupRef   = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const savedConsoleH   = useRef(153); // 153px xterm + 33px title bar = 186px total

  
  // Expose xterm output globally
  useEffect(() => { (window as any).__awpOutput = outputRef.current; });

  const appendOutput = useCallback((text: string, type?: string) => {
    outputRef.current?.appendOutput(text, type);
  }, []);
  const clearOutput = useCallback(() => { outputRef.current?.clearOutput(); }, []);

  // ── Core layout function — recalculates ALL panel heights ──────
  const relayout = useCallback(() => {
    const ep = editorWrapRef.current;
    const cp = consolePanelRef.current;
    const g  = panelGroupRef.current;
    if (!ep || !cp || !g) return;

    const gh = g.getBoundingClientRect().height;
    if (gh === 0) return; // still hidden, skip

    if (!store.get().consoleOpen) {
      ep.style.flex   = "1";
      ep.style.height = "";
      cp.style.height = "33px";
    } else {
      const ch = Math.min(savedConsoleH.current, gh - 80 - 6);
      const eh = Math.max(80, gh - ch - 6);
      ep.style.flex   = "none";
      ep.style.height = eh + "px";
      cp.style.height = ch + "px";
    }
    editorRef.current?.layout();
    // Tell xterm to refit via its ResizeObserver (fires automatically),
    // but also call directly in case the observer missed it
    (window as any).__awpXtermFit?.();
  }, []);

  // Expose refit globally so App.tsx can call it on route switch
  useEffect(() => {
    (window as any).__awpRefit = relayout;
    return () => { delete (window as any).__awpRefit; };
  }, [relayout]);

  // Re-layout when consoleOpen toggles
  useEffect(() => { relayout(); }, [consoleOpen, relayout]);

  // Re-layout on window resize
  useEffect(() => {
    window.addEventListener("resize", relayout);
    return () => window.removeEventListener("resize", relayout);
  }, [relayout]);


useEffect(() => {
  const handle = resizeHandleRef.current;

  if (handle) {
    handle.style.height = consoleOpen ? "6px" : "0px";
  }

}, [consoleOpen]); 

  //  Drag-to-resize handle
  useEffect(() => {
    const handle = resizeHandleRef.current;
    const ep     = editorWrapRef.current;
    const cp     = consolePanelRef.current;
    const g      = panelGroupRef.current;
    if (!handle || !ep || !cp || !g) return;

    let dragging = false, startY = 0, startEH = 0;

    const down = (e: MouseEvent) => {
      dragging = true;
      startY   = e.clientY;
      startEH  = ep.getBoundingClientRect().height;
      document.body.style.cssText = "cursor:ns-resize;user-select:none";
    };
    const move = (e: MouseEvent) => {
      if (!dragging) return;
      const newEH = Math.max(80, startEH + (e.clientY - startY));
      const newCH = Math.max(33, g.getBoundingClientRect().height - newEH - 6);
      ep.style.flex   = "none";
      ep.style.height = newEH + "px";
      cp.style.height = newCH + "px";
      if (store.get().consoleOpen) savedConsoleH.current = newCH;
      editorRef.current?.layout();
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.cssText = "";
    };

    handle.addEventListener("mousedown", down);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup",   up);
    return () => {
      handle.removeEventListener("mousedown", down);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup",   up);
    };
  }, []);

  return (
    <div id="scriptingView" style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>

      <div className="editor-console-container">
        <div className="resizeable-panel-group" id="panelGroup" ref={panelGroupRef}>

          <div ref={editorWrapRef}
            style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <EditorPanel editorRef={editorRef} appendOutput={appendOutput} clearOutput={clearOutput}/>
          </div>
          
          <div className="resizeable-panel-resize-handle" id="resizeHandle" ref={resizeHandleRef} />
          
          <div ref={consolePanelRef}
            style={{ height: "186px", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            <Output ref={outputRef} />
          </div>

        </div>
      </div>

      <div className="right-container">
        <Workspace />
        <Instances />
      </div>

    </div>
  );
 
}