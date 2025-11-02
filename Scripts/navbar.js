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

  // Scroll to top functionality
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  function toggleScrollTopButton() {
    if (!scrollTopBtn) return;

    // Check if we're at the very top (with a small threshold for mobile bounce effects)
    const isAtTop = window.scrollY < 50;

    // Add or remove visible class based on scroll position
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

  // Chatbot functionality
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

    // Hide floating buttons when chat opens
    toggleFloatingButtons(false);

    chatbotWindow = document.createElement("div");
    chatbotWindow.className = "chatbot-window";
    chatbotWindow.innerHTML = `
      <div class="chatbot-header">
        <h3>Explore AI Assistant</h3>
        <button class="chatbot-close" aria-label="Close chatbot">×</button>
      </div>
      <div class="chatbot-messages">
        <div class="message bot">
          Hello! I'm Explore's AI assistant. How can I help you today?
        </div>
      </div>
      <div class="chatbot-input">
        <input type="text" placeholder="Type your message..." aria-label="Chat message">
        <button>Send</button>
      </div>
    `;

    document.body.appendChild(chatbotWindow);

    // Add event listeners
    const closeBtn = chatbotWindow.querySelector(".chatbot-close");
    const input = chatbotWindow.querySelector("input");
    const sendBtn = chatbotWindow.querySelector("button");
    const messages = chatbotWindow.querySelector(".chatbot-messages");

    closeBtn.addEventListener("click", closeChatbot);

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      // Add user message
      const userMsg = document.createElement("div");
      userMsg.className = "message user";
      userMsg.textContent = text;
      messages.appendChild(userMsg);

      // Clear input
      input.value = "";

      // Scroll to bottom
      messages.scrollTop = messages.scrollHeight;

      // Simulate AI response (replace with actual AI implementation)
      setTimeout(() => {
        const botMsg = document.createElement("div");
        botMsg.className = "message bot";
        botMsg.textContent = `I understand you're asking about "${text}". How can I assist you further?`;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
      }, 1000);
    }

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    sendBtn.addEventListener("click", sendMessage);

    // Show chatbot window with animation
    requestAnimationFrame(() => {
      chatbotWindow.classList.add("open");
    });
  }

  function closeChatbot() {
    if (!chatbotWindow) return;

    chatbotWindow.classList.remove("open");

    // Show floating buttons when chat closes
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

  // Add a body class when we're on a 404 page (helps CSS adjustments)
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

  // Highlight the current nav link by comparing link hrefs to location
  function highlightCurrentNav() {
    const links = document.querySelectorAll(".nav-left a, .nav-right a");
    if (!links || !links.length) return;
    const current = window.location.pathname.replace(/\/+$/, "");
    links.forEach((link) => {
      try {
        const href = (link.getAttribute("href") || "").trim();

        // Ignore empty or anchor-only links (e.g. "", "#", "#section")
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

  // Run highlight after nav is inserted (navbar fetch appends navbar.js earlier)
  // Use a small timeout to ensure links exist
  setTimeout(highlightCurrentNav, 150);

  // Page loader functions: show when navigating to internal pages, hide on load/pageshow
  function showPageLoader() {
    const loader = document.getElementById("page-loader");
    if (!loader) return;
    // record show timestamp to enforce minimum visible duration
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
    // enforce minimum visible duration (1000ms)
    const minMs = 1000;
    const shownAt = loader._shownAt || 0;
    const elapsed = Date.now() - shownAt;
    const remaining = Math.max(0, minMs - elapsed);
    setTimeout(() => {
      loader.classList.remove("visible");
      loader.setAttribute("aria-hidden", "true");
    }, remaining);
  }

  // Intercept link clicks: for same-origin navigations, preflight the target
  // If the target exists navigate to it; otherwise route to the 404 page.
  document.addEventListener(
    "click",
    async function (e) {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return; // anchor-only
      if (a.target === "_blank") return; // open in new tab

      let url;
      try {
        url = new URL(href, location.href);
      } catch (err) {
        return; // malformed URL or unsupported scheme
      }

      // Only handle same-origin http(s) links (skip mailto:, tel:, external origins)
      if (url.origin !== location.origin) return;
      if (url.protocol !== "http:" && url.protocol !== "https:") return;

      // Prevent default navigation — we'll handle it after verifying the resource.
      e.preventDefault();

      // Show loader immediately
      showPageLoader();

      try {
        const resp = await fetch(url.href, {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        if (resp.ok) {
          // resource exists — navigate to it
          window.location.href = url.href;
          return;
        }
      } catch (err) {
        // network error — fall through to show 404
      }

      // If we reach here the page is missing or fetch failed — go to the site's 404 page
      // Use an absolute path that matches where 404.html lives in this repo
      window.location.href = "/Pages/404.html";
    },
    { capture: true }
  );

  // Hide loader once the page has loaded / been shown
  window.addEventListener("load", hidePageLoader);
  window.addEventListener("pageshow", hidePageLoader);

  updateResponsiveConfig();
  updateIconVisibility();
})();
