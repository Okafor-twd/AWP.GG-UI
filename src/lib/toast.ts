const TOAST_ICONS: Record<string, string> = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>`,
  message: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>`,
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

let _toastId = 0;
const _toastTimers: Record<number, ReturnType<typeof setTimeout>> = {};
const _toasts: { id: number; el: HTMLElement }[] = [];

function _updateToasts() {
  const toaster = document.getElementById("awp-toaster");
  if (!toaster) return;
  const total = _toasts.length;
  _toasts.forEach(({ el }, i) => {
    el.dataset.front = (i === 0).toString();
    el.style.setProperty("--toasts-before", String(i));
    el.style.setProperty("--z-index", String(total - i));
  });
  if (_toasts.length > 0) {
    const h = _toasts[0].el.getBoundingClientRect().height;
    if (h > 0) toaster.style.setProperty("--front-toast-height", h + "px");
  } else {
    toaster.style.setProperty("--front-toast-height", "0px");
  }
}

function _showToast(type: string, msg: string | { title: string }, opts: { duration?: number; description?: string } = {}) {
  const id = ++_toastId;
  const duration = opts.duration ?? 4000;
  const toaster = document.getElementById("awp-toaster");
  if (!toaster) return id;

  const el = document.createElement("div");
  el.className = "awp-toast";
  el.dataset.id = String(id);
  el.dataset.mounted = "false";
  el.dataset.removed = "false";
  el.dataset.front = "true";

  const icon = type === "message" ? "" : (TOAST_ICONS[type] || "");
  const title = typeof msg === "string" ? msg : (msg?.title || "");
  const desc = opts.description || "";

  el.innerHTML = `
    ${icon ? `<div data-icon="" class="awp-toast-icon">${icon}</div>` : ""}
    <div data-content="" class="awp-toast-content">
      <div data-title="" class="awp-toast-title">${esc(title)}</div>
      ${desc ? `<div data-description="" class="awp-toast-desc">${esc(desc)}</div>` : ""}
    </div>
  `;

  toaster.insertBefore(el, toaster.firstChild);
  _toasts.unshift({ id, el });

  while (_toasts.length > 3) {
    const old = _toasts.pop()!;
    clearTimeout(_toastTimers[old.id]);
    delete _toastTimers[old.id];
    old.el.dataset.removed = "true";
    old.el.dataset.front = "false";
    const deadEl = old.el;
    setTimeout(() => deadEl.remove(), 300);
  }

  _updateToasts();

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      el.dataset.mounted = "true";
      setTimeout(_updateToasts, 60);
    })
  );

  if (duration > 0) {
    _toastTimers[id] = setTimeout(() => _dismissToast(id), duration);
  }
  return id;
}

function _dismissToast(id: number) {
  clearTimeout(_toastTimers[id]);
  delete _toastTimers[id];
  const idx = _toasts.findIndex((t) => t.id === id);
  if (idx === -1) return;
  const { el } = _toasts[idx];

  if (idx === 0) {
    // Front toast: original behavior unchanged
    el.dataset.removed = "true";
    _toasts.splice(idx, 1);
    _updateToasts();
    setTimeout(() => el.remove(), 500);
  } else {
    // Stacked toast: fade out in place, only reposition after it's gone
    el.style.transition = "opacity 300ms ease";
    el.style.opacity = "0";
    setTimeout(() => {
      const currentIdx = _toasts.findIndex((t) => t.id === id);
      if (currentIdx !== -1) _toasts.splice(currentIdx, 1);
      el.remove();
      _updateToasts();
    }, 300);
  }
}

export const ShowToast = {
  success: (msg: string, opts?: { description?: string }) => _showToast("success", msg, opts),
  error: (msg: string, opts?: { description?: string }) => _showToast("error", msg, opts),
  warning: (msg: string, opts?: { description?: string }) => _showToast("warning", msg, opts),
  info: (msg: string, opts?: { description?: string }) => _showToast("info", msg, opts),
  message: (msg: string, opts?: { description?: string }) => _showToast("message", msg, opts),
  dismiss: (id?: number) => {
    if (id) _dismissToast(id);
    else [..._toasts].forEach((t) => _dismissToast(t.id));
  },
  loading: (msg: string, opts?: { description?: string }) => _showToast("message", msg, { duration: 0, ...opts }),
  promise: <T>(
    promise: Promise<T>,
    opts: { loading?: string; success?: string | ((v: T) => string); error?: string | ((e: unknown) => string) } = {}
  ) => {
    const id = ShowToast.loading(opts.loading || "Loading...");
    promise
      .then((v) => {
        _dismissToast(id);
        ShowToast.success(typeof opts.success === "function" ? opts.success(v) : opts.success || "Done");
      })
      .catch((e) => {
        _dismissToast(id);
        ShowToast.error(typeof opts.error === "function" ? opts.error(e) : opts.error || "Error");
      });
    return id;
  },
};