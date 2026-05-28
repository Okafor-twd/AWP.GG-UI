import React, {
  useRef, useEffect, useImperativeHandle, forwardRef, useCallback
} from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { store } from "../../store";
import { useStore } from "../../hooks/useStore";
import ScriptingView from "./workspace_view";

export interface OutputHandle {
  appendOutput: (text: string, type?: string) => void;
  clearOutput:  () => void;
}

const Output = forwardRef<OutputHandle>((_, ref) => {
  const { consoleOpen } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef     = useRef<HTMLDivElement>(null);
  const termRef      = useRef<Terminal | null>(null);
  const fitRef       = useRef<FitAddon | null>(null);

  const doFit = useCallback(() => {
    const fit = fitRef.current;
    const el  = containerRef.current;
    if (!fit || !el) return;
    // Skip if the container has no visible size (hidden via display:none)
    if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
    try { fit.fit(); } catch {}
  }, []);

  // ── Init xterm once ───────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || termRef.current) return;

    const term = new Terminal({
      theme: {
        background:    "#191818",
        foreground:    "#ffffff",
        cursor:        "#ffffff",
        black:         "#2e2e2e",
        brightBlack:   "#555753",
        red:           "#cc0000",
        brightRed:     "#ef2929",
        green:         "#4e9a06",
        brightGreen:   "#8ae234",
        yellow:        "#c4a000",
        brightYellow:  "#fce94f",
        blue:          "#3465a4",
        brightBlue:    "#729fcf",
        magenta:       "#75507b",
        brightMagenta: "#ad7fa8",
        cyan:          "#06989a",
        brightCyan:    "#34e2e2",
        white:         "#d3d7cf",
        brightWhite:   "#eeeeec",
      },
      fontFamily:       '"Courier New", Courier, monospace',
      fontSize:          15,
      lineHeight:        1,
      scrollback:        1000,
      convertEol:        true,
      disableStdin:      true,
      cursorBlink:       false,
      allowTransparency: true,
      scrollSensitivity: 1,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    requestAnimationFrame(doFit);

    termRef.current = term;
    fitRef.current  = fit;

    // Expose fit globally so workspace_view can call it after relayout
    (window as any).__awpXtermFit = doFit;

    // ResizeObserver — fires on ANY size change of the output box
    const ro = new ResizeObserver(() => requestAnimationFrame(doFit));
    if (outerRef.current) ro.observe(outerRef.current);

    // Window resize
    window.addEventListener("resize", doFit);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", doFit);
      delete (window as any).__awpXtermFit;
      term.dispose();
      termRef.current = null;
      fitRef.current  = null;
    };
  }, [doFit]);

  // Fit when console opens (after panel height is set by workspace_view)
  useEffect(() => {
    if (!consoleOpen) return;
    // Multiple frames to catch the full layout sequence
    const t1 = requestAnimationFrame(doFit);
    const t2 = setTimeout(doFit, 50);
    const t3 = setTimeout(doFit, 150);
    return () => { cancelAnimationFrame(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [consoleOpen, doFit]);

  // ── Output helpers ────────────────────────────────────────────
  const appendOutput = useCallback((txt: string, type?: string) => {
    const term = termRef.current;
    if (!term) return;
    const ts = `\x1B[30;1m${new Date().toLocaleTimeString()}\x1B[0m`;
    let line: string;
    if      (type === "error"   || type === "err")    line = `${ts} \x1B[31mERROR\x1B[0m: ${txt}`;
    else if (type === "warn"    || type === "warning") line = `${ts} \x1B[33mWARNING\x1B[0m: ${txt}`;
    else if (type === "info")                          line = `${ts} \x1B[34mINFO\x1B[0m: ${txt}`;
    else                                               line = `${ts} ${txt}`;
    term.writeln(line);
    if (!store.get().consoleOpen) store.setConsoleOpen(true);
  }, []);

  const clearOutput = useCallback(() => {
    const term = termRef.current;
    if (!term) return;
    term.write('\x1b[2J\x1b[3J\x1b[H');
  }, []);

  useImperativeHandle(ref, () => ({ appendOutput, clearOutput }), [appendOutput, clearOutput]);

  const toggle = () => store.setConsoleOpen(!store.get().consoleOpen); 

  return (
    <div className={`console${consoleOpen ? "" : " minimized"}`} id="consolePanel">
      <div className="console-title-bar">
        <h2 id="output-title">Output</h2>
        <span
          id="console-chevron"
          data-state={consoleOpen ? "open" : "closed"}
          onClick={toggle}
          
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 15l6-6l6 6"/>
          </svg>
        </span>
      </div>
      <div className="output-box" ref={outerRef}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
});

Output.displayName = "Output";
export default Output;