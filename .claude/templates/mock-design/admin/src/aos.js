// Scroll-reveal observer + helpers with fallback
(function () {
  if (typeof window === 'undefined') return;

  const supportsIO = 'IntersectionObserver' in window;

  const reveal = (el) => {
    el.classList.add('aos-in');
    el.classList.remove('aos-init');
  };
  const init = (el) => {
    if (!el.classList.contains('aos-in') && !el.classList.contains('aos-init')) {
      el.classList.add('aos-init');
    }
  };

  let observer = null;
  if (supportsIO) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          reveal(e.target);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -20px 0px' });
  }

  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || document.documentElement.clientHeight) &&
           r.bottom > 0 &&
           r.width > 0 && r.height > 0;
  }

  function scan(root = document) {
    const els = root.querySelectorAll('[data-aos]:not(.aos-in)');
    els.forEach(el => {
      init(el);
      // If already in viewport, reveal immediately via rAF
      if (isInViewport(el)) {
        requestAnimationFrame(() => reveal(el));
        return;
      }
      if (observer) observer.observe(el);
      else reveal(el); // no-IO fallback
    });
    // Safety net: anything still hidden after 600ms gets force-revealed
    setTimeout(() => {
      root.querySelectorAll('[data-aos]:not(.aos-in)').forEach(el => reveal(el));
    }, 600);
  }

  window.__aosScan = scan;
  const mo = new MutationObserver(() => scan());
  mo.observe(document.body, { childList: true, subtree: true });
  scan();

  window.__aosReset = () => {
    // Keep content visible during screen transitions — force-reveal all in one frame
    document.querySelectorAll('[data-aos]').forEach(el => reveal(el));
  };
})();
