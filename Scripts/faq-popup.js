// Support popup functionality
const supportConfig = {
  phone: "+1-800-EXPLORE",
  email: "support@explore.com",
  chat: "Click to start live chat",
  social: {
    facebook: "ExploreOfficial",
    instagram: "@explore.travel",
    twitter: "@explore",
  },
};

function openSupport() {
  // Create and add modal to body
  const modal = document.createElement("div");
  modal.className = "support-modal";
  modal.innerHTML = `
    <div class="support-modal-content">
      <h2>24/7 Customer Support</h2>
      <div class="support-options">
        <a href="tel:${supportConfig.phone.replace(
          /-/g,
          ""
        )}" class="support-option">
          <span>📞</span>
          <div>
            <h3>Call Us</h3>
            <p>${supportConfig.phone}</p>
          </div>
        </a>
        <a href="mailto:${supportConfig.email}" class="support-option">
          <span>📧</span>
          <div>
            <h3>Email Us</h3>
            <p>${supportConfig.email}</p>
          </div>
        </a>
        <button onclick="startLiveChat()" class="support-option">
          <span>💬</span>
          <div>
            <h3>Live Chat</h3>
            <p>${supportConfig.chat}</p>
          </div>
        </button>
      </div>
      <div class="social-options">
        <h3>Follow Us</h3>
        <div class="social-links">
          <a href="https://facebook.com/${
            supportConfig.social.facebook
          }" target="_blank" class="social-link">
            <span>📱</span> Facebook
          </a>
          <a href="https://instagram.com/${
            supportConfig.social.instagram
          }" target="_blank" class="social-link">
            <span>📸</span> Instagram
          </a>
          <a href="https://twitter.com/${
            supportConfig.social.twitter
          }" target="_blank" class="social-link">
            <span>🐦</span> Twitter
          </a>
        </div>
      </div>
      <button class="close-modal" onclick="closeSupport(this)">×</button>
    </div>
  `;

  // Add modal to body
  document.body.appendChild(modal);

  // Add event listener to close on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeSupport(modal);
    }
  });

  // Prevent scrolling while modal is open
  document.body.style.overflow = "hidden";

  // Add escape key listener
  document.addEventListener("keydown", handleEscapeKey);
}

function closeSupport(element) {
  const modal = element.closest(".support-modal");
  if (modal) {
    // Add closing animation
    modal.style.animation = "fadeOut 0.3s ease forwards";
    modal.querySelector(".support-modal-content").style.animation =
      "slideDown 0.3s ease forwards";

    // Remove modal after animation
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "";
    }, 300);
  }
  // Remove escape key listener
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === "Escape") {
    const modal = document.querySelector(".support-modal");
    if (modal) {
      closeSupport(modal);
    }
  }
}

function startLiveChat() {
  // Here you would integrate with your actual chat service
  const modal = document.querySelector(".support-modal");
  if (modal) {
    closeSupport(modal);
  }

  setTimeout(() => {
    const chatWindow = document.createElement("div");
    chatWindow.className = "chat-window";
    chatWindow.innerHTML = `
      <div class="chat-header">
        <h3>Live Chat</h3>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="chat-messages">
        <div class="message system">
          Connecting to support...
        </div>
        <div class="message agent">
          Hello! How can we help you today?
        </div>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Type your message..." 
               onkeypress="if(event.key === 'Enter') this.nextElementSibling.click()">
        <button onclick="sendMessage(this)">Send</button>
      </div>
    `;
    document.body.appendChild(chatWindow);
  }, 1000);
}

function sendMessage(button) {
  const input = button.previousElementSibling;
  const messages = document.querySelector(".chat-messages");
  if (input.value.trim()) {
    messages.innerHTML += `
      <div class="message user">
        ${input.value}
      </div>
    `;
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    // Simulate agent response
    setTimeout(() => {
      messages.innerHTML += `
        <div class="message agent">
          Thank you for your message. An agent will respond shortly.
        </div>
      `;
      messages.scrollTop = messages.scrollHeight;
    }, 1000);
  }
}
