/** The existing CIFRA CMP is the sole source of analytics permission. */
export function installCifraConsent({ window: win, document: doc, loadRuntime } = {}) {
  if (!['cifrainssdeobras.com.br', 'www.cifrainssdeobras.com.br'].includes(win.location.hostname)) return;
  let runtime;
  let loading;
  let sessionPermission;
  const allowed = () => {
    if (sessionPermission !== undefined) return sessionPermission;
    if (win.__cifraConsent) return win.__cifraConsent.analytics === true;
    try { return JSON.parse(win.localStorage.getItem('cifra-cookie-consent-v2'))?.analytics === true; } catch { return false; }
  };
  const load = loadRuntime || (async () => {
    const { startMeasurement } = await import('./measurement/bootstrap.mjs');
    return startMeasurement({ consentAdapter: 'manual' });
  });
  function clearCookies() {
    for (const cookie of doc.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
      for (const domain of ['', win.location.hostname, '.cifrainssdeobras.com.br']) doc.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain ? '; Domain=' + domain : ''}`;
    }
  }
  function sync() {
    if (!allowed()) { runtime?.setConsent(false); clearCookies(); return Promise.resolve(); }
    if (runtime) { runtime.setConsent(true); return Promise.resolve(); }
    if (!loading) loading = load().then(api => {
      if (!api) throw new Error('Measurement unavailable');
      runtime = api;
      runtime.setConsent(allowed());
    }).catch(() => { loading = null; });
    return loading;
  }
  win.addEventListener('cifra:consent-change', event => {
    sessionPermission = event.detail?.analytics === true;
    return sync();
  });
  void sync();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') installCifraConsent({ window, document });
