(function () {
  const nav = document.getElementById("site-navbar");
  const shrinkAt = 100;
  let lastKnownScroll = 0;
  let ticking = false;

  function onScroll() {
    lastKnownScroll = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (lastKnownScroll > shrinkAt) {
          nav.classList.add("shrink");
          document.body.classList.add("scrolled");
        } else {
          nav.classList.remove("shrink");
          document.body.classList.remove("scrolled");
        }
        ticking = false;
      });
      ticking = true;
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
      if (e.key === "Escape") closeAll();
    });

    const toggle = document.getElementById("navToggle");
    const navLeft = document.getElementById("navLeft");
    const navRight = document.getElementById("navRight");
    if (toggle) {
      toggle.addEventListener("click", function () {
        const expanded = this.getAttribute("aria-expanded") === "true";
        this.setAttribute("aria-expanded", String(!expanded));
        if (navLeft) navLeft.classList.toggle("mobile-open");
        if (navRight) navRight.classList.toggle("mobile-open");
      });
    }
  })();

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
