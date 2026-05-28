import React from "react";

// ── Login Icons ──────────────────────────────────────────────

export const IconLoginUser = ({ width = 16, height = 16, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={color} d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
  </svg>
);

export const IconLoginPassword = ({ width = 16, height = 16, color = "currentColor", id = "" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id={id}>
    <path fill={color} d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3" />
  </svg>
);

// ── IconFileCode (tabler) ──────────────────────────────────────────
export const IconFileCode = ({ width = 16, height = 16, stroke = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    <path d="M10 13l-1 2l1 2" />
    <path d="M14 13l1 2l-1 2" />
  </svg>
);

export const IconChevronDown = ({ width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6l6 -6" />
  </svg>
);

export const IconChevronUp = ({ width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 15l6-6l6 6" />
  </svg>
);

export const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5C5C5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
    <path d="M9 12h12l-3 -3" />
    <path d="M18 15l3 -3" />
  </svg>
);

export const IconMinimize = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 10 11" fill="none">
    <path d="M1.66699 8.83325H8.33366" stroke="#C5C5C5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconMaximize = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
  </svg>
);

export const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);

export const IconXSmall = ({ width = 11, height = 11 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);

export const IconPlus = ({ width = 13, height = 13 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5l0 14" />
    <path d="M5 12l14 0" />
  </svg>
);

export const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <path d="M21 21l-6 -6" />
  </svg>
);

export const IconWorkspace = () => (
  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="#c5c5c5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12.906 13.5V9.134c0-.612-.496-1.109-1.109-1.109H2.202c-.612 0-1.108.497-1.108 1.109V13.5m8.942-13H3.963a.784.784 0 0 0-.784.784v3.599c0 .433.351.784.784.784h6.073a.784.784 0 0 0 .784-.784V1.284A.784.784 0 0 0 10.036.5M7 5.667v2.358m-5.906 2.187h11.813" />
  </svg>
);

export const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </svg>
);

export const IconExecute = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 6c0-.852.986-1.297 1.623-.783l.084.076 6 6a1 1 0 0 1 .083 1.32l-.083.094-6 6-.094.083-.077.054-.096.054-.036.017-.067.027-.108.032-.053.01-.06.01-.057.004-.059.002-.059-.002-.058-.005-.06-.009-.052-.01-.108-.032-.067-.027-.132-.07-.09-.065-.081-.073-.083-.094-.054-.077-.054-.096-.017-.036-.027-.067-.032-.108-.01-.053-.01-.06-.004-.057-.002-12.059z" />
  </svg>
);

export const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7l16 0" />
    <path d="M10 11l0 6" />
    <path d="M14 11l0 6" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
  </svg>
);

export const IconFolderOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
  </svg>
);

export const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
    <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M14 4l0 4l-6 0l0 -4" />
  </svg>
);

export const IconRocket = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.59 14.37q.159.666.16 1.38a6 6 0 0 1-6 6v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.9 14.9 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.9 14.9 0 0 0-2.58 5.84m2.699 2.7q-.155.032-.311.06a15 15 0 0 1-2.448-2.448l.06-.312m-2.24 2.39a4.49 4.49 0 0 0-1.757 4.306q.341.054.696.054a4.5 4.5 0 0 0 3.61-1.812M16.5 9a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" />
  </svg>
);

export const PLUGS_DISCONNECTED_PATH = `M149.66 138.34a8 8 0 0 0-11.32 0L120 156.69L99.31 136l18.35-18.34a8 8 0 0 0-11.32-11.32L88 124.69l-18.34-18.35a8 8 0 0 0-11.32 11.32l6.35 6.34l-23.32 23.31a32 32 0 0 0 0 45.26l5.38 5.37l-28.41 28.4a8 8 0 0 0 11.32 11.32l28.4-28.41l5.37 5.38a32 32 0 0 0 45.26 0L132 191.31l6.34 6.35a8 8 0 0 0 11.32-11.32L131.31 168l18.35-18.34a8 8 0 0 0 0-11.32m-52.29 65a16 16 0 0 1-22.62 0l-22.06-22.09a16 16 0 0 1 0-22.62L76 135.31L120.69 180Zm140.29-185a8 8 0 0 0-11.32 0l-28.4 28.41l-5.37-5.38a32.05 32.05 0 0 0-45.26 0L124 64.69l-6.34-6.35a8 8 0 0 0-11.32 11.32l80 80a8 8 0 0 0 11.32-11.32l-6.35-6.34l23.32-23.31a32 32 0 0 0 0-45.26l-5.38-5.37l28.41-28.4a8 8 0 0 0 0-11.32m-34.35 79L180 120.69L135.31 76l23.32-23.31a16 16 0 0 1 22.62 0l22.06 22a16 16 0 0 1 0 22.68Z`;

export const PLUGS_CONNECTED_PATH = `M237.66 18.34a8 8 0 0 0-11.32 0l-52.4 52.41l-5.37-5.38a32.05 32.05 0 0 0-45.26 0L100 88.69l-6.34-6.35a8 8 0 0 0-11.32 11.32l6.35 6.34l-23.32 23.31a32 32 0 0 0 0 45.26l5.38 5.37l-52.41 52.4a8 8 0 0 0 11.32 11.32l52.4-52.41l5.37 5.38a32 32 0 0 0 45.26 0L156 167.31l6.34 6.35a8 8 0 0 0 11.32-11.32l-6.35-6.34l23.32-23.31a32 32 0 0 0 0-45.26l-5.38-5.37l52.41-52.4a8 8 0 0 0 0-11.32m-116.29 161a16 16 0 0 1-22.62 0l-22.06-22.09a16 16 0 0 1 0-22.62L100 111.31L144.69 156Zm57.94-57.94L156 144.69L111.31 100l23.32-23.31a16 16 0 0 1 22.62 0l22.06 22a16 16 0 0 1 0 22.68ZM88.57 35a8 8 0 0 1 14.86-6l8 20a8 8 0 0 1-14.86 6Zm-64 58A8 8 0 0 1 35 88.57l20 8a8 8 0 0 1-6 14.86l-20-8A8 8 0 0 1 24.57 93m206.86 70a8 8 0 0 1-10.4 4.46l-20-8a8 8 0 0 1 5.97-14.89l20 8a8 8 0 0 1 4.43 10.43m-64 58.06a8 8 0 0 1-14.86 5.94l-8-20a8 8 0 0 1 14.86-6Z`;

export const IconTool = () => (
  <svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor">
    <path d="M865.3 244.7c-.3-.3-61.1 59.8-182.1 180.6l-84.9-84.9l180.9-180.9c-95.2-57.3-217.5-42.6-296.8 36.7A244.42 244.42 0 0 0 419 432l1.8 6.7l-283.5 283.4c-6.2 6.2-6.2 16.4 0 22.6l141.4 141.4c6.2 6.2 16.4 6.2 22.6 0l283.3-283.3l6.7 1.8c83.7 22.3 173.6-.9 236-63.3c79.4-79.3 94.1-201.6 38-296.6" />
  </svg>
);

export const IconCode = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 8l-4 4l4 4m8 0l4-4l-4-4m-2-3l-4 14" />
  </svg>
);

export const IconConsole = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 19V7H4v12zm0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-7 14v-2h5v2zm-3.42-4L5.57 9H8.4l3.3 3.3c.39.39.39 1.03 0 1.42L8.42 17H5.59z" />
  </svg>
);


export const SVG_FILE_STATIC_HTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24"><g stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="none" d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"></path><path fill="gray" d="M14 3.5l0 4.5l4.5 0Z"></path></g></svg>`;
export const SVG_FILE_ANIMATED_HTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24"><g stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="none" stroke-dasharray="62" d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="62;0"></animate></path><path fill="gray" d="M14 3.5l0 4.5l4.5 0Z" opacity="0"><set fill="freeze" attributeName="opacity" begin="0.6s" to="1"></set><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M14 3.5l2.25 2.25l2.25 2.25Z;M14 3.5l0 4.5l4.5 0Z"></animate></path></g></svg>`;

export const IconFile = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img"
    style={{ flexShrink: 0 }}>
    <g stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path fill="none" d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z" />
      <path fill="gray" d="M14 3.5l0 4.5l4.5 0Z" />
    </g>
  </svg>
);


export const IconFileAnimated = () => {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = SVG_FILE_ANIMATED_HTML;
    }
  }, []);
  return (
    <span
      ref={ref}
      style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
    />
  );
};