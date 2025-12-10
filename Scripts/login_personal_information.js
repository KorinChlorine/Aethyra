//* DOM ELEMENTS *\\

//* FORM SECTIONS
const personalForm = document.getElementById("personalInformationForm");
const settingsForm = document.getElementById("settingsForm");

//* BUTTONS
const backBtn = document.getElementById("backBtn");
const signOutBtn = document.getElementById("signOutBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

//* ICONS AND INPUTS
const passwordToggles = document.querySelectorAll(".password-toggle");
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

//* INITIALIZATION FUNCTIONS *\\

//* LOADS SAVED PERSONAL INFORMATION FROM DATABASE WHEN PAGE LOADS
function initializeForm() {
  // Fetch user data from backend
  fetch("../Backend/getUserData.php", { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const userData = data.data;
        // Fill form fields with user data from DB
        if (document.getElementById("firstName"))
          document.getElementById("firstName").value = userData.firstName || "";
        if (document.getElementById("middleName"))
          document.getElementById("middleName").value =
            userData.middleName || "";
        if (document.getElementById("lastName"))
          document.getElementById("lastName").value = userData.lastName || "";
        if (document.getElementById("email"))
          document.getElementById("email").value = userData.email || "";
        if (document.getElementById("gender"))
          document.getElementById("gender").value = userData.gender || "";
        if (document.getElementById("birthdate"))
          document.getElementById("birthdate").value = userData.birthdate || "";

        // Update styled date display
        if (userData.birthdate) {
          const selectedDate = new Date(userData.birthdate + "T00:00:00");
          const styledDateText = document.querySelector(".styled-date-text");
          if (styledDateText) {
            styledDateText.textContent = selectedDate.toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );
            const styledInput = document.querySelector(".styled-date-input");
            if (styledInput)
              styledInput.parentElement.classList.add("has-value");
          }
        }
      } else {
        console.error("Failed to load user data:", data.error);
        alert("Failed to load user data. Please log in again.");
        window.location.href = "login.html";
      }
    })
    .catch((err) => {
      console.error("Error loading user data:", err);
      alert("An error occurred while loading your data.");
    });
}

//* TAB NAVIGATION FUNCTIONALITY *\\

//* ENABLES SWITCHING BETWEEN PERSONAL INFORMATION AND SETTINGS TABS
function setupTabNavigation() {
  // Add a click event to each tab button
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get the tab name from the button's data attribute
      const tabName = this.getAttribute("data-tab");

      // Remove the "active" highlighting from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      // Remove the "active" state from all tab content
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add "active" to the clicked button to highlight it
      this.classList.add("active");
      // Add "active" to the corresponding tab content to show it
      document.getElementById(tabName + "-tab").classList.add("active");
    });
  });
}

//* PASSWORD VISIBILITY TOGGLE *\\

//* TOGGLES PASSWORD VISIBILITY AND UPDATES EYE ICON WHEN CLICKED
function setupPasswordToggle() {
  // Add a click event to each password visibility icon
  passwordToggles.forEach((icon) => {
    icon.addEventListener("click", function () {
      // Get the ID of the password input field linked to this icon
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);

      // Check if password is currently hidden
      if (input.type === "password") {
        // Show the password as text
        input.type = "text";
        // Update the icon to show it's now visible
        this.classList.remove("bi-eye-slash");
        this.classList.add("bi-eye");
      } else {
        // Hide the password
        input.type = "password";
        // Update the icon to show it's now hidden
        this.classList.add("bi-eye-slash");
        this.classList.remove("bi-eye");
      }
    });
  });
}

//* BACK BUTTON FUNCTIONALITY *\\

//* NAVIGATES BACK TO PREVIOUS PAGE IN BROWSER HISTORY
function setupBackButton() {
  backBtn.addEventListener("click", () => {
    // Go back to the previous page like clicking the browser's back button
    history.back();
  });
}

//* PERSONAL INFORMATION FORM SUBMISSION *\\

//* VALIDATES ALL PERSONAL INFO FIELDS AND SAVES THEM TO DATABASE
function setupPersonalInfoForm() {
  if (personalForm) {
    personalForm.addEventListener("submit", (e) => {
      // Stop the form from submitting the traditional way
      e.preventDefault();

      // Collect all the personal information from the form inputs
      const formData = {
        firstName: document.getElementById("firstName").value,
        middleName: document.getElementById("middleName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        gender: document.getElementById("gender").value,
        birthdate: document.getElementById("birthdate").value,
        age: document.getElementById("age").value,
        contactNumber: document.getElementById("contactNumber").value,
      };

      //* VALIDATION 1: CHECK IF AT LEAST ONE FIELD IS FILLED IN
      if (
        !formData.firstName &&
        !formData.lastName &&
        !formData.email &&
        !formData.contactNumber &&
        !formData.birthdate &&
        !formData.age &&
        !formData.gender
      ) {
        alert("⚠️ Please fill in at least one field!");
        return;
      }

      //* VALIDATION 2: IF EMAIL IS PROVIDED, CHECK IF IT'S IN CORRECT FORMAT
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        alert("⚠️ Please enter a valid email address!");
        return;
      }

      //* VALIDATION 3: IF CONTACT NUMBER IS PROVIDED, CHECK IF IT'S VALID
      if (
        formData.contactNumber &&
        !/^[\d\s\-+()]{7,}$/.test(formData.contactNumber)
      ) {
        alert("⚠️ Please enter a valid contact number!");
        return;
      }

      //* CONFIRMATION BEFORE SAVING
      const confirmSave = confirm(
        "Are you sure you want to save changes to your personal information?"
      );
      if (!confirmSave) {
        // User canceled the save
        alert("Save cancelled. No changes were made.");
        return;
      }

      //* ALL VALIDATIONS PASSED - SAVE TO DATABASE
      // Send data to backend
      const fd = new FormData();
      fd.append("firstName", formData.firstName);
      fd.append("middleName", formData.middleName);
      fd.append("lastName", formData.lastName);
      fd.append("email", formData.email);
      fd.append("gender", formData.gender);
      fd.append("birthdate", formData.birthdate);
      fd.append("age", formData.age);
      fd.append("contactNumber", formData.contactNumber);

      fetch("../Backend/updateProfile.php", { method: "POST", body: fd })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("✅ Personal information saved successfully!");
          } else {
            alert("⚠️ Error: " + (data.error || "Failed to save"));
          }
        })
        .catch((err) => {
          console.error("Update profile error:", err);
          alert("⚠️ An error occurred while saving your information");
        });
    });
  }
}

//* SETTINGS FORM - CHANGE PASSWORD *\\

//* VALIDATES PASSWORD REQUIREMENTS AND SAVES PASSWORD CHANGE TO DATABASE
function setupSettingsForm() {
  if (settingsForm) {
    // Get the Save Changes button in the settings form
    const saveButton = settingsForm.querySelector(".btn-primary");

    if (saveButton) {
      saveButton.addEventListener("click", (e) => {
        // Stop the default button action
        e.preventDefault();

        // Collect the password information from the form inputs
        const currentPassword =
          document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword =
          document.getElementById("confirmPassword").value;

        //* VALIDATION 1: CHECK IF ALL PASSWORD FIELDS ARE FILLED IN
        if (!currentPassword || !newPassword || !confirmPassword) {
          alert("⚠️ Please fill in all password fields!");
          return;
        }

        //* VALIDATION 2: CHECK IF NEW PASSWORD IS STRONG ENOUGH
        // Password must be at least 8 characters for security
        if (newPassword.length < 8) {
          alert("⚠️ New password must be at least 8 characters long!");
          return;
        }

        //* VALIDATION 3: CHECK IF NEW PASSWORD AND CONFIRM PASSWORD MATCH
        if (newPassword !== confirmPassword) {
          alert("⚠️ New password and confirm password do not match!");
          return;
        }

        //* CONFIRMATION BEFORE SAVING PASSWORD
        const confirmSave = confirm(
          "Are you sure you want to save the new password?"
        );
        if (!confirmSave) {
          alert("Save cancelled. Password was not changed.");
          return;
        }

        //* SEND PASSWORD CHANGE TO BACKEND
        const fd = new FormData();
        fd.append("currentPassword", currentPassword);
        fd.append("newPassword", newPassword);

        fetch("../Backend/changePassword.php", { method: "POST", body: fd })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert("✅ Password changed successfully!");
              // Clear all password fields after successful change
              document.getElementById("currentPassword").value = "";
              document.getElementById("newPassword").value = "";
              document.getElementById("confirmPassword").value = "";
            } else {
              alert("⚠️ Error: " + (data.error || "Failed to change password"));
            }
          })
          .catch((err) => {
            console.error("Change password error:", err);
            alert("⚠️ An error occurred while changing your password");
          });
      });
    }
  }
}

//* SIGN OUT FUNCTIONALITY *\\

//* CLEARS SESSION AND REDIRECTS TO LOGIN PAGE WITH CONFIRMATION
function setupSignOut() {
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      // Ask the user to confirm they want to sign out
      const confirmSignOut = confirm("Are you sure you want to sign out?");

      if (confirmSignOut) {
        // User clicked OK - proceed with sign out
        // Destroy session on backend
        fetch("../Backend/logout.php", { method: "POST" })
          .then((res) => res.json())
          .then((data) => {
            // Show success message to user
            alert("✅ You have been signed out successfully!");
            // Redirect to login page
            window.location.href = "login.html";
          })
          .catch((err) => {
            console.error("Logout error:", err);
            // Redirect anyway
            window.location.href = "login.html";
          });
      } else {
        // User clicked Cancel - do nothing
      }
    });
  }
}

//* DELETE ACCOUNT FUNCTIONALITY *\\

//* REQUIRES DOUBLE CONFIRMATION BEFORE PERMANENTLY DELETING ACCOUNT
//* PREVENTS ACCIDENTAL ACCOUNT DELETION
function setupDeleteAccount() {
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {
      //* FIRST CONFIRMATION DIALOG: WARNING MESSAGE
      const firstConfirm = confirm(
        "⚠️ Are you sure you want to delete your account?\n\nThis action cannot be undone."
      );

      if (firstConfirm) {
        //* SECOND CONFIRMATION DIALOG: FINAL WARNING
        // This extra confirmation step prevents accidental deletion
        const secondConfirm = confirm(
          "🚨 WARNING: Deleting your account will permanently remove all your data.\n\nClick OK to confirm deletion, or Cancel to keep your account."
        );

        if (secondConfirm) {
          //* USER CONFIRMED TWICE - PROCEED WITH DELETION
          fetch("../Backend/deleteAccount.php", { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                alert(
                  "✅ Your account has been deleted successfully.\n\nWe are redirecting you to the home page..."
                );
                window.location.href = "home.html";
              } else {
                alert(
                  "⚠️ Error: " + (data.error || "Failed to delete account")
                );
              }
            })
            .catch((err) => {
              console.error("Delete account error:", err);
              alert("⚠️ An error occurred while deleting your account");
            });
        } else {
          //* USER CANCELLED ON SECOND CONFIRMATION - CANCEL DELETION
          alert("Account deletion cancelled. Your account is safe.");
        }
      } else {
        //* USER CANCELLED ON FIRST CONFIRMATION - CANCEL DELETION
        // Do nothing - user is still logged in
      }
    });
  }
}

//* SELECT PLACEHOLDER STYLING *\\
function setupSelectPlaceholders() {
  document.querySelectorAll(".input-box select").forEach((sel) => {
    function updateSelectColor() {
      if (sel.value === "") {
        sel.classList.add("select-placeholder");
      } else {
        sel.classList.remove("select-placeholder");
      }
    }
    updateSelectColor();
    sel.addEventListener("change", updateSelectColor);
  });
}

//* STYLED BIRTHDATE INPUT *\\
function setupStyledDateInput() {
  const birthdateInput = document.getElementById("birthdate");
  const styledDateInput = document.querySelector(".styled-date-input");
  const styledDateText = document.querySelector(".styled-date-text");

  if (!birthdateInput || !styledDateInput || !styledDateText) return;

  styledDateInput.addEventListener("click", () => {
    birthdateInput.showPicker(); // Open native date picker
  });

  birthdateInput.addEventListener("change", () => {
    if (birthdateInput.value) {
      const selectedDate = new Date(birthdateInput.value);
      styledDateText.textContent = selectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      styledDateInput.parentElement.classList.add("has-value");
    }
  });
}

//* PAGE INITIALIZATION ON LOAD *\\

//* RUNS ALL SETUP FUNCTIONS WHEN PAGE FINISHES LOADING
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the form with saved user data
  initializeForm();

  // Setup all interactive features
  setupTabNavigation();
  setupPasswordToggle();
  setupBackButton();
  setupPersonalInfoForm();
  setupSettingsForm();
  setupSignOut();
  setupDeleteAccount();
  setupSelectPlaceholders();
  setupStyledDateInput();
});
