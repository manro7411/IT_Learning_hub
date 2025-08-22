// src/disableReactDevTools.ts

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: { [key: string]: unknown };
  }
}

export function disableReactDevTools() {
  if (import.meta.env.MODE === 'production') {
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
      for (const [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] =
          typeof value === 'function' ? () => {} : null;
      }
    }
  }
}
