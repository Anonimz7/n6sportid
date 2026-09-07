(() => {
  const headerMount = document.getElementById('site-header');
  const footerMount = document.getElementById('site-footer');

  if (!headerMount && !footerMount) return;

  const script = document.currentScript;
  if (!script || !script.src) return;

  const assetsBaseUrl = new URL('../', script.src);

  const loadPartial = async (mountEl, partialName) => {
    if (!mountEl) return;
    const partialUrl = new URL(`partials/${partialName}`, assetsBaseUrl);
    const response = await fetch(partialUrl.href);
    if (!response.ok) {
      throw new Error(`Failed to load partial: ${partialName}`);
    }
    mountEl.innerHTML = await response.text();
  };

  Promise.all([
    loadPartial(headerMount, 'header.html'),
    loadPartial(footerMount, 'footer.html')
  ]).then(() => {
    // Let other scripts re-run initialization after the layout is injected.
    document.dispatchEvent(new CustomEvent('layout:loaded'));
  }).catch((error) => {
    console.error(error);
  });
})();
