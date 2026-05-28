import React, { useRef, useEffect, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import type * as MonacoType from "monaco-editor";
import { useStore } from "../../hooks/useStore";
import { store } from "../../store";
import Buttons from "./buttons";

interface EditorPanelProps {
  editorRef: React.MutableRefObject<MonacoType.editor.IStandaloneCodeEditor | null>;
  appendOutput: (text: string, type?: string) => void;
  clearOutput: () => void;
}

const LUA_KEYWORDS = [
  "and","break","do","else","elseif","end","false","for","function",
  "goto","if","in","local","nil","not","or","repeat","return",
  "then","true","until","while",
];

function setupMonaco(monaco: Monaco) {
  monaco.languages.register({ id: "lua" });
  monaco.languages.setMonarchTokensProvider("lua", {
    keywords: LUA_KEYWORDS,
    operators: ["+","-","*","/","%","^","#","==","~=","<=",">=","<",">","="],
    symbols: /[=><!~?:&|+\-*\/\^%#]+/,
    tokenizer: {
      root: [
        [/--\[=*\[/, "comment", "@bc"],
        [/--.*$/, "comment"],
        [/[a-zA-Z_]\w*/, { cases: { "@keywords": "keyword", "@default": "identifier" } }],
        [/"/, "string", "@sdq"],
        [/'/, "string", "@ssq"],
        [/\d+\.\d*/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+/, "number"],
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      ],
      bc:  [[/\]=*\]/, "comment", "@pop"], [/./, "comment"]],
      sdq: [[/[^\\"]+/, "string"], [/\\./, "string.escape"], [/"/, "string", "@pop"]],
      ssq: [[/[^\\']+/, "string"], [/\\./, "string.escape"], [/'/, "string", "@pop"]],
    },
  } as any);

  monaco.languages.registerCompletionItemProvider("lua", {
    provideCompletionItems(model, position) {
      const range: MonacoType.IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn: 1,
        endColumn: position.column,
      };
      const K = monaco.languages.CompletionItemKind;
      const R = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
      return { suggestions: [
        { label:"print",           kind:K.Function, insertText:"print(${1:v})",                                         insertTextRules:R, range },
        { label:"pairs",           kind:K.Function, insertText:"pairs(${1:t})",                                         insertTextRules:R, range },
        { label:"ipairs",          kind:K.Function, insertText:"ipairs(${1:t})",                                        insertTextRules:R, range },
        { label:"type",            kind:K.Function, insertText:"type(${1:v})",                                          insertTextRules:R, range },
        { label:"tostring",        kind:K.Function, insertText:"tostring(${1:v})",                                      insertTextRules:R, range },
        { label:"tonumber",        kind:K.Function, insertText:"tonumber(${1:v})",                                      insertTextRules:R, range },
        { label:"require",         kind:K.Function, insertText:'require("${1:mod}")',                                   insertTextRules:R, range },
        { label:"error",           kind:K.Function, insertText:"error(${1:msg})",                                       insertTextRules:R, range },
        { label:"pcall",           kind:K.Function, insertText:"pcall(${1:f})",                                         insertTextRules:R, range },
        { label:"string.format",   kind:K.Function, insertText:'string.format("${1:%s}",${2:v})',                       insertTextRules:R, range },
        { label:"string.sub",      kind:K.Function, insertText:"string.sub(${1:s},${2:i},${3:j})",                     insertTextRules:R, range },
        { label:"string.find",     kind:K.Function, insertText:'string.find(${1:s},"${2:p}")',                         insertTextRules:R, range },
        { label:"string.match",    kind:K.Function, insertText:'string.match(${1:s},"${2:p}")',                        insertTextRules:R, range },
        { label:"string.upper",    kind:K.Function, insertText:"string.upper(${1:s})",                                 insertTextRules:R, range },
        { label:"string.lower",    kind:K.Function, insertText:"string.lower(${1:s})",                                 insertTextRules:R, range },
        { label:"string.len",      kind:K.Function, insertText:"string.len(${1:s})",                                   insertTextRules:R, range },
        { label:"string.byte",     kind:K.Function, insertText:"string.byte(${1:s})",                                  insertTextRules:R, range },
        { label:"string.char",     kind:K.Function, insertText:"string.char(${1:...})",                                insertTextRules:R, range },
        { label:"string.gsub",     kind:K.Function, insertText:'string.gsub(${1:s},"${2:p}",${3:rep})',               insertTextRules:R, range },
        { label:"table.insert",    kind:K.Function, insertText:"table.insert(${1:t},${2:v})",                          insertTextRules:R, range },
        { label:"table.remove",    kind:K.Function, insertText:"table.remove(${1:t},${2:i})",                          insertTextRules:R, range },
        { label:"table.sort",      kind:K.Function, insertText:"table.sort(${1:t})",                                   insertTextRules:R, range },
        { label:"table.concat",    kind:K.Function, insertText:'table.concat(${1:t},"${2:sep}")',                      insertTextRules:R, range },
        { label:"math.abs",        kind:K.Function, insertText:"math.abs(${1:x})",                                     insertTextRules:R, range },
        { label:"math.floor",      kind:K.Function, insertText:"math.floor(${1:x})",                                   insertTextRules:R, range },
        { label:"math.ceil",       kind:K.Function, insertText:"math.ceil(${1:x})",                                    insertTextRules:R, range },
        { label:"math.sqrt",       kind:K.Function, insertText:"math.sqrt(${1:x})",                                    insertTextRules:R, range },
        { label:"math.random",     kind:K.Function, insertText:"math.random(${1:n})",                                  insertTextRules:R, range },
        { label:"math.max",        kind:K.Function, insertText:"math.max(${1:x},${2:y})",                              insertTextRules:R, range },
        { label:"math.min",        kind:K.Function, insertText:"math.min(${1:x},${2:y})",                              insertTextRules:R, range },
        { label:"math.pi",         kind:K.Constant, insertText:"math.pi",                                              insertTextRules:R, range },
        { label:"math.huge",       kind:K.Constant, insertText:"math.huge",                                            insertTextRules:R, range },
        { label:"function",        kind:K.Keyword,  insertText:"function ${1:name}(${2:args})\n\t${3}\nend",           insertTextRules:R, range },
        { label:"local function",  kind:K.Keyword,  insertText:"local function ${1:name}(${2:args})\n\t${3}\nend",     insertTextRules:R, range },
        { label:"if",              kind:K.Keyword,  insertText:"if ${1:cond} then\n\t${2}\nend",                       insertTextRules:R, range },
        { label:"if-else",         kind:K.Keyword,  insertText:"if ${1:cond} then\n\t${2}\nelse\n\t${3}\nend",         insertTextRules:R, range },
        { label:"for",             kind:K.Keyword,  insertText:"for ${1:i} = ${2:1}, ${3:10} do\n\t${4}\nend",         insertTextRules:R, range },
        { label:"for-in",          kind:K.Keyword,  insertText:"for ${1:k}, ${2:v} in pairs(${3:t}) do\n\t${4}\nend", insertTextRules:R, range },
        { label:"while",           kind:K.Keyword,  insertText:"while ${1:cond} do\n\t${2}\nend",                      insertTextRules:R, range },
        { label:"repeat",          kind:K.Keyword,  insertText:"repeat\n\t${1}\nuntil ${2:cond}",                      insertTextRules:R, range },
        { label:"local",           kind:K.Keyword,  insertText:"local ${1:n} = ${2:v}",                                insertTextRules:R, range },
        { label:"return",          kind:K.Keyword,  insertText:"return ${1:v}",                                        insertTextRules:R, range },
      ]};
    },
  });

  monaco.editor.defineTheme("awp-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background":                "#1e1e1e",
      "editor.lineHighlightBackground":   "#222222",
      "editorLineNumber.foreground":      "#c6c6c6",
      "editorLineNumber.activeForeground":"#c6c6c6",
    },
  });
}

export default function EditorPanel({ editorRef, appendOutput, clearOutput }: EditorPanelProps) {
  const { tabs, activeTabId, settings } = useStore();
  const prevTabId = useRef(activeTabId);

  const getEditorValue = useCallback(() => editorRef.current?.getValue() ?? "", [editorRef]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    (window as any).__awpEditor = editor; // expose globally for Clear button
    setupMonaco(monaco);
    monaco.editor.setTheme("awp-dark");

    const tab = store.get().tabs.find((t) => t.id === store.get().activeTabId);
    if (tab) editor.setValue(tab.content);

    editor.onDidChangeModelContent(() => {
      const s = store.get();
      const updated = s.tabs.map((t) =>
        t.id === s.activeTabId ? { ...t, content: editor.getValue() } : t
      );
      store.setTabs(updated);
    });
  };

  // Switch content when active tab changes
  useEffect(() => {
    if (!editorRef.current) return;
    if (prevTabId.current === activeTabId) return;
    prevTabId.current = activeTabId;
    const tab = store.get().tabs.find((t) => t.id === activeTabId);
    if (tab) editorRef.current.setValue(tab.content);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]); // tabs intentionally excluded — we read from store directly

  // Apply settings from Settings page
  useEffect(() => {
    editorRef.current?.updateOptions({
      fontSize: settings.fontSize,
      wordWrap: settings.wordWrap,
    });
  }, [settings.fontSize, settings.wordWrap]);

  return (
    <div className="text-editor" id="editorPanel" style={{ flex: 1, minHeight: 0 }}>
      <div className="editor-container">
        <Editor
          language="lua"
          theme="awp-dark"
          onMount={handleMount}
          options={{
            fontSize:                settings.fontSize,
            fontFamily:             'Consolas, "Courier New", monospace',
            fontLigatures:           false,
            minimap:                 { enabled: true },
            scrollBeyondLastLine:    false,
            lineNumbers:            "on",
            renderLineHighlight:    "line",
            tabSize:                 4,
            automaticLayout:         true,
            padding:                 { top: 8, bottom: 8 },
            smoothScrolling:         false,
            cursorBlinking:         "blink",
            cursorSmoothCaretAnimation: "off",
            wordWrap:                settings.wordWrap,
          }}
        />
      </div>

      <Buttons
        getEditorValue={getEditorValue}
        appendOutput={appendOutput}
        clearOutput={clearOutput}
      />
    </div>
  );
}