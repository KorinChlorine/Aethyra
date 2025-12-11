// Chatbot-related navbar hooks removed

    function openMobileMenu() {
      if (toggle) {
        toggle.classList.add("active");
        toggle.setAttribute("aria-expanded", "true");
      }
      if (navLeft) navLeft.classList.add("mobile-open");
      if (navRight) navRight.classList.add("mobile-open");
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    }

    if (toggle) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        const expanded = this.getAttribute("aria-expanded") === "true";

        if (expanded) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 640) {
        const isNavClick = e.target.closest("#site-navbar");
        const isMenuOpen =
          navLeft?.classList.contains("mobile-open") ||
          navRight?.classList.contains("mobile-open");

        if (!isNavClick && isMenuOpen) {
          closeMobileMenu();
        }
      }
    });

    document.querySelectorAll(".nav-left a, .nav-right a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 640) {
          closeMobileMenu();
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) {
        closeMobileMenu();
      }
    });

    window.closeMobileMenu = closeMobileMenu;
  })();

  // Public API for navbar controls
  window.navbarControls = {
    setShrinkThreshold: (pixels) => {
      config.shrinkAt = pixels;
      onScroll();
    },
    setShrunkSize: (maxWidth, padding = null) => {
      config.shrunkMaxWidth = maxWidth;
      if (padding) config.shrunkPadding = padding;
      if (lastKnownScroll > config.shrinkAt) {
        updateNavbarSize(true);
      }
    },
    setInitialSize: (maxWidth, padding = null) => {
      config.initialMaxWidth = maxWidth;
      if (padding) config.initialPadding = padding;
      if (lastKnownScroll <= config.shrinkAt) {
        updateNavbarSize(false);
      }
    },
    setShrunkScale: (scale) => {
      config.shrunkScale = scale;
      if (lastKnownScroll > config.shrinkAt) {
        updateNavbarSize(true);
      }
    },
    getConfig: () => ({ ...config }),
    forceShrink: () => updateNavbarSize(true),
    forceExpand: () => updateNavbarSize(false),
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  let resizeTimeout;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateResponsiveConfig();
        updateIconVisibility();
        onScroll();
      }, 150);
    },
    { passive: true }
  );

  const scrollTopBtn = document.getElementById("scrollTopBtn");

  function toggleScrollTopButton() {
    if (!scrollTopBtn) return;

    const isAtTop = window.scrollY < 50;

    if (isAtTop) {
      scrollTopBtn.classList.remove("visible");
    } else {
      scrollTopBtn.classList.add("visible");
    }
  }

  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", toggleScrollTopButton, { passive: true });
  toggleScrollTopButton();
  

  try {
    if (
      window.location.pathname &&
      window.location.pathname.indexOf("404") !== -1
    ) {
      document.body.classList.add("page-404");
    }
  } catch (e) {
    /* ignore */
  }

  function highlightCurrentNav() {
    const links = document.querySelectorAll(".nav-left a, .nav-right a");
    if (!links || !links.length) return;
    const current = window.location.pathname.replace(/\/+$/, "");
    links.forEach((link) => {
      try {
        const href = (link.getAttribute("href") || "").trim();

        if (!href || href.startsWith("#")) {
          link.classList.remove("active-link");
          link.removeAttribute("aria-current");
          return;
        }

        const url = new URL(href, location.href);
        const path = url.pathname.replace(/\/+$/, "");
        if (path === current) {
          link.classList.add("active-link");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("active-link");
          link.removeAttribute("aria-current");
        }
      } catch (err) {
        // ignore malformed hrefs
      }
    });
  }

  setTimeout(highlightCurrentNav, 150);

  function showPageLoader() {
    const loader = document.getElementById("page-loader");
    if (!loader) return;
    loader.classList.add("visible");
    loader.setAttribute("aria-hidden", "false");
    try {
      loader._shownAt = Date.now();
    } catch (e) {
      // ignore
    }
  }

  function hidePageLoader() {
    const loader = document.getElementById("page-loader");
    if (!loader) return;
    // Enforce minimum visible duration (1000ms)
    const minMs = 1000;
    const shownAt = loader._shownAt || 0;
    const elapsed = Date.now() - shownAt;
    const remaining = Math.max(0, minMs - elapsed);
    setTimeout(() => {
      loader.classList.remove("visible");
      loader.setAttribute("aria-hidden", "true");
    }, remaining);
  }

  // Intercept internal navigation to verify page exists before navigating
  document.addEventListener(
    "click",
    async function (e) {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (a.target === "_blank") return;

      let url;
      try {
        url = new URL(href, location.href);
      } catch (err) {
        return;
      }

      if (url.origin !== location.origin) return;
      if (url.protocol !== "http:" && url.protocol !== "https:") return;

      e.preventDefault();
      showPageLoader();

      try {
        const resp = await fetch(url.href, {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        if (resp.ok) {
          window.location.href = url.href;
          return;
        }
      } catch (err) {
        // network error — fall through to show 404
      }

      window.location.href = "/Pages/404.html";
    },
    { capture: true }
  );

  window.addEventListener("load", hidePageLoader);
  window.addEventListener("pageshow", hidePageLoader);

  updateResponsiveConfig();
  updateIconVisibility();
})();
