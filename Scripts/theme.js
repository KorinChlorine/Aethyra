// Theme toggle functionality
(function () {
  const THEME_KEY = "theme";

  function getSystemPrefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    // update button icon/label
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const icon = btn.querySelector("i");
    if (!icon) return;

    if (theme === "dark") {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      btn.setAttribute("aria-label", "Switch to light mode");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      btn.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  function init() {
    const btn = document.getElementById("themeToggle");

    // Determine initial theme
    const saved = getSavedTheme();
    const initial = saved || (getSystemPrefersDark() ? "dark" : "light");
    applyTheme(initial === "dark" ? "dark" : "light");

    // Click handler
    if (btn) {
      btn.addEventListener("click", function () {
        const isDark =
          document.documentElement.getAttribute("data-theme") === "dark";
        const next = isDark ? "light" : "dark";
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {
          // ignore
        }
        applyTheme(next === "dark" ? "dark" : "light");
      });
    }

    // If system preference changes and user has not explicitly chosen, follow system
    try {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener &&
        mq.addEventListener("change", (e) => {
          if (!getSavedTheme()) {
            applyTheme(e.matches ? "dark" : "light");
          }
        });
    } catch (e) {
      // no-op
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
