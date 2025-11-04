// FAQ support popup script
// Exposes `openSupport()` globally so inline `onclick="openSupport()"` works from the HTML.

(function () {
  function createSupportModal() {
    const modal = document.createElement("div");
    modal.className = "explore-support-modal";
    modal.innerHTML = `
			<div class="explore-support-modal-content">
				<h2>24/7 Customer Support</h2>
				<div class="explore-support-options">
					<a href="tel:+18003569345" class="explore-support-option">
						<span>📞</span>
						<div>
							<h3>Call Us</h3>
							<p>+1-800-AETHYRIA</p>
						</div>
					</a>
					<a href="mailto:support@explore.com" class="explore-support-option">
						<span>📧</span>
						<div>
							<h3>Email Us</h3>
							<p>support@aethyria.com</p>
						</div>
					</a>
					<button type="button" class="explore-support-option" id="explore-start-chat">
						<span>💬</span>
						<div>
							<h3>Live Chat</h3>
							<p>Start a chat with our assistants</p>
						</div>
					</button>
				</div>
				<button class="explore-support-close" aria-label="Close support">×</button>
			</div>
		`;

    // background click closes
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeSupport(modal);
    });

    return modal;
  }

  function injectStyles() {
    if (document.getElementById("explore-support-styles")) return;
    const s = document.createElement("style");
    s.id = "explore-support-styles";
    s.textContent = `
      .explore-support-modal{position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);display:grid;place-items:center;z-index:120000;animation:explore-support-fade .22s ease}
      .explore-support-modal-content{background:linear-gradient(135deg,#6b7b8a 0%,#7a8a99 100%);padding:28px;border-radius:16px;width:92%;max-width:520px;position:relative;color:#fff}
      .explore-support-modal-content h2{color:#f9b233;text-align:center;margin:0 0 18px;font-size:1.6rem}
      .explore-support-options{display:grid;gap:12px}
      .explore-support-option{display:flex;align-items:center;justify-content:flex-start;gap:12px;padding:14px;border-radius:10px;background:rgba(255,255,255,0.06);color:#fff;text-decoration:none;border:none;cursor:pointer}
      .explore-support-option > div{flex:1;text-align:left}
      .explore-support-option h3{margin:0;color:#f9b233;font-size:1rem;text-align:left}
      .explore-support-option p{margin:2px 0 0;font-size:.9rem;opacity:.95;text-align:left}
      .explore-support-option span{font-size:1.5rem}
      .explore-support-close{position:absolute;right:12px;top:12px;background:none;border:none;color:#fff;font-size:20px;width:36px;height:36px;border-radius:50%;cursor:pointer}
      @keyframes explore-support-fade{from{opacity:0}to{opacity:1}}
      @media (max-width:600px){.explore-support-modal-content{padding:18px;border-radius:12px}}
    `;
    document.head.appendChild(s);
  }

  function openSupport() {
    injectStyles();

    if (document.querySelector(".explore-support-modal")) return;

    const modal = createSupportModal();
    document.body.appendChild(modal);

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const closeBtn = modal.querySelector(".explore-support-close");
    closeBtn.addEventListener("click", function () {
      closeSupport(modal);
    });

    const startChat = modal.querySelector("#explore-start-chat");
    if (startChat)
      startChat.addEventListener("click", function () {
        closeSupport(modal);

        if (typeof window.createChatbotWindow === "function") {
          window.createChatbotWindow();
        } else if (typeof window.openAIChat === "function") {
          window.openAIChat();
        } else {
          alert("Connecting to live chat...");
        }
      });

    function escHandler(e) {
      if (e.key === "Escape") closeSupport(modal);
    }
    document.addEventListener("keydown", escHandler);

    modal._escHandler = escHandler;
  }

  function closeSupport(modalEl) {
    const modal = modalEl || document.querySelector(".explore-support-modal");
    if (!modal) return;

    modal.remove();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (modal._escHandler)
      document.removeEventListener("keydown", modal._escHandler);
  }

  window.openSupport = openSupport;
  window.closeSupport = closeSupport;

  window.startLiveChat = function () {
    if (typeof window.createChatbotWindow === "function") {
      window.createChatbotWindow();
    } else {
      alert("Connecting to live chat...");
    }
  };
})();
