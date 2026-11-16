interface MetaConsentOptions {
  enabled: boolean;
  pushConsent: (allowed: boolean) => void;
  load: (ready: () => void, failed: () => void) => void;
  initialize: () => void;
}

/** Do not queue a Pixel PageView while the SDK or the visitor decision is pending. */
export function createMetaConsent(options: MetaConsentOptions) {
  let allowed = false;
  let loading = false;
  let ready = false;
  let initialized = false;
  function initialize() {
    if (allowed && ready && !initialized) {
      initialized = true;
      options.initialize();
    }
  }
  return {
    apply(next: boolean) {
      if (!options.enabled) return;
      allowed = next === true;
      options.pushConsent(allowed);
      if (!allowed) return;
      if (ready) { initialize(); return; }
      if (loading) return;
      loading = true;
      const loaded = () => {
        loading = false;
        ready = true;
        options.pushConsent(allowed);
        initialize();
      };
      const failed = () => { loading = false; };
      try { options.load(loaded, failed); } catch { failed(); }
    },
  };
}
