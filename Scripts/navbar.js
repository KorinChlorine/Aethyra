(function () {
  const navbar = document.getElementById("site-navbar");
  const navbarInner = document.querySelector(".navbar-inner");

  const config = {
    shrinkAt: 200,
    initialMaxWidth: 1180,
    shrunkMaxWidth: 850,
    initialPadding: "16px 48px",
    shrunkPadding: "8px 28px",
    initialScale: 1,
    shrunkScale: 0.88,
  };

  const breakpoints = {
    mobile: 640,
    tablet: 800,
    desktop: 1024,
  };

  let lastKnownScroll = 0;
  let ticking = false;
  let currentBreakpoint = "desktop";

  function getBreakpoint() {
    const width = window.innerWidth;
    if (width <= breakpoints.mobile) return "mobile";
    if (width <= breakpoints.tablet) return "tablet";
    if (width <= breakpoints.desktop) return "desktop-small";
    return "desktop";
  }

  function updateResponsiveConfig() {
    const breakpoint = getBreakpoint();

    if (breakpoint !== currentBreakpoint) {
      currentBreakpoint = breakpoint;

      switch (breakpoint) {
        case "mobile":
          config.shrinkAt = 100;
          config.shrunkScale = 0.96;
          break;
        case "tablet":
          config.shrinkAt = 150;
          config.shrunkScale = 0.92;
          break;
        case "desktop-small":
          config.shrinkAt = 180;
          config.shrunkScale = 0.9;
          break;
        default:
          config.shrinkAt = 200;
          config.shrunkScale = 0.88;
      }

      onScroll();
    }
  }

  function updateNavbarSize(scrolled) {
    if (!navbarInner) return;

    if (scrolled) {
      navbar.classList.add("shrink");
      document.body.classList.add("scrolled");
      navbarInner.classList.add("hide-icons");
      navbarInner.style.maxWidth = `${config.shrunkMaxWidth}px`;
      navbarInner.style.padding = config.shrunkPadding;
      navbarInner.style.transform = `scale(${config.shrunkScale})`;
    } else {
      navbar.classList.remove("shrink");
      document.body.classList.remove("scrolled");
      navbarInner.classList.remove("hide-icons");
      navbarInner.style.maxWidth = `${config.initialMaxWidth}px`;
      navbarInner.style.padding = config.initialPadding;
      navbarInner.style.transform = `scale(${config.initialScale})`;
    }
  }

  function onScroll() {
    lastKnownScroll = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const shouldShrink = lastKnownScroll > config.shrinkAt;
        updateNavbarSize(shouldShrink);
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateIconVisibility() {
    const icons = document.querySelectorAll(".navbar-inner .icon");
    if (!icons.length) return;

    if (window.innerWidth <= 950) {
      icons.forEach((icon) => (icon.style.display = "none"));
    } else {
      icons.forEach((icon) => (icon.style.display = ""));
    }
  }

  (function initNavControls() {
    function closeAll() {
      document
        .querySelectorAll(".dropdown .dropdown-menu.show")
        .forEach((m) => m.classList.remove("show"));
    }

    document.addEventListener(
      "click",
      function (e) {
        const toggle = e.target.closest(".dropdown .dropdown-toggle");
        if (toggle) {
          const dropdown = toggle.closest(".dropdown");
          const menu = dropdown.querySelector(".dropdown-menu");
          const isShown = menu.classList.contains("show");
          closeAll();
          if (!isShown) menu.classList.add("show");
          e.preventDefault();
          return;
        }
        if (!e.target.closest(".dropdown")) closeAll();
      },
      { capture: false }
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAll();
        closeMobileMenu();
      }
    });

    const toggle = document.getElementById("navToggle");
    const navLeft = document.getElementById("navLeft");
    const navRight = document.getElementById("navRight");

    function closeMobileMenu() {
      if (toggle) {
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      }
      if (navLeft) navLeft.classList.remove("mobile-open");
      if (navRight) navRight.classList.remove("mobile-open");
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }

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

  const chatbotButton = document.getElementById("chatbotButton");
  let chatbotWindow = null;

  function toggleFloatingButtons(show) {
    const chatbotBtn = document.getElementById("chatbotButton");
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (chatbotBtn) {
      chatbotBtn.style.opacity = show ? "1" : "0";
      chatbotBtn.style.visibility = show ? "visible" : "hidden";
    }

    if (scrollTopBtn) {
      scrollTopBtn.style.opacity = show ? "1" : "0";
      scrollTopBtn.style.visibility = show ? "visible" : "hidden";
    }
  }

  function createChatbotWindow() {
    if (chatbotWindow) return;

    toggleFloatingButtons(false);

    chatbotWindow = document.createElement("div");
    chatbotWindow.className = "chatbot-window";
    chatbotWindow.innerHTML = `
      <div class="chatbot-header">
        <h3>Aethyra Assistant</h3>
        <button class="chatbot-close" aria-label="Close chatbot">×</button>
      </div>
      <div class="chatbot-messages">
        <div class="message bot">
          Hello! I'm Aethyra's AI assistant. How can I help you today?
        </div>
      </div>
      <div class="chatbot-input">
        <input type="text" placeholder="Type your message..." aria-label="Chat message">
        <button>Send</button>
      </div>
    `;

    document.body.appendChild(chatbotWindow);

    const closeBtn = chatbotWindow.querySelector(".chatbot-close");
    const input = chatbotWindow.querySelector("input");
    const sendBtn = chatbotWindow.querySelector("button");
    const messages = chatbotWindow.querySelector(".chatbot-messages");

    closeBtn.addEventListener("click", closeChatbot);

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      const userMsg = document.createElement("div");
      userMsg.className = "message user";
      userMsg.textContent = text;
      messages.appendChild(userMsg);

      input.value = "";
      messages.scrollTop = messages.scrollHeight;

      // Simple intent handling for common user actions (navigation & help).
      (function handleIntent(text) {
        const msg = text.toLowerCase().trim();

        function reply(content) {
          const botMsg = document.createElement("div");
          botMsg.className = "message bot";
          botMsg.textContent = content;
          messages.appendChild(botMsg);
          messages.scrollTop = messages.scrollHeight;
        }

        // 1) Navigation intent: "go to X" or "take me to X"
        const navMatch = msg.match(
          /^(?:go to|take me to|show me|open)\s+(?:the\s+)?(.+)$/i
        );
        if (navMatch) {
          const place = navMatch[1].trim();
          reply(`Taking you to destinations for "${place}"...`);
          // Navigate to the destinations page with a query param so the page can react if desired
          setTimeout(() => {
            const target = `destinations.html?q=${encodeURIComponent(place)}`;
            window.location.href = target;
          }, 700);
          return;
        }

        // 2) Browsing/help intent
        if (
          /\b(how to use destinations|how can i browse|how do i browse|how to browse|browse destinations|browse)\b/i.test(
            msg
          )
        ) {
          reply(
            "You can browse Destinations by clicking the 'Destinations' link in the navigation. On that page use filters or the search box (if available). Would you like me to take you there now?"
          );
          return;
        }

        // 3) Short/gibberish input handling
        if (
          msg.length < 3 ||
          /^[^a-zA-Z0-9 ]+$/.test(msg) ||
          /([a-z])\1{3,}/i.test(msg)
        ) {
          reply(
            "Sorry, I didn't understand that — could you rephrase or tell me the destination name again?"
          );
          return;
        }

        // 4) Fallback clarification (non-parroting)
        reply(
          "Thanks — could you give a bit more detail so I can help? For example, what destination or topic do you mean?"
        );
      })(text);
    }

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    sendBtn.addEventListener("click", sendMessage);

    requestAnimationFrame(() => {
      chatbotWindow.classList.add("open");
    });
  }

  function closeChatbot() {
    if (!chatbotWindow) return;

    chatbotWindow.classList.remove("open");
    toggleFloatingButtons(true);

    setTimeout(() => {
      chatbotWindow.remove();
      chatbotWindow = null;
    }, 300);
  }

  chatbotButton?.addEventListener("click", (e) => {
    e.preventDefault();
    if (chatbotWindow) {
      closeChatbot();
    } else {
      createChatbotWindow();
    }
  });

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
