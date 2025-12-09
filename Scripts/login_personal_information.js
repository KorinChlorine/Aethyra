//* DOM ELEMENTS *\\

//* FORM SECTIONS
const personalForm = document.getElementById("personalInformationForm")
const settingsForm = document.getElementById("settingsForm")

//* BUTTONS
const backBtn = document.getElementById("backBtn")
const signOutBtn = document.getElementById("signOutBtn")
const deleteAccountBtn = document.getElementById("deleteAccountBtn")

//* ICONS AND INPUTS
const passwordToggles = document.querySelectorAll(".password-toggle")
const tabButtons = document.querySelectorAll(".tab-button")
const tabContents = document.querySelectorAll(".tab-content")

//* INITIALIZATION FUNCTIONS *\\

//* LOADS SAVED PERSONAL INFORMATION FROM BROWSER STORAGE WHEN PAGE LOADS
function initializeForm() {
    // Get the saved user data from browser's local storage
    const savedData = localStorage.getItem("userPersonalInfo")

    if (savedData) {
        // Convert the saved text back into an object format that JavaScript can use
        const data = JSON.parse(savedData)

        // Loop through each saved piece of information
        Object.keys(data).forEach((key) => {
        const input = document.getElementById(key)
        if (input) {
            // Fill the form input with the saved value
            input.value = data[key]
        }
        })
    }
}

//* TAB NAVIGATION FUNCTIONALITY *\\

//* ENABLES SWITCHING BETWEEN PERSONAL INFORMATION AND SETTINGS TABS
function setupTabNavigation() {
    // Add a click event to each tab button
    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
        // Get the tab name from the button's data attribute
        const tabName = this.getAttribute("data-tab")

        // Remove the "active" highlighting from all buttons
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        // Remove the "active" state from all tab content
        tabContents.forEach((content) => content.classList.remove("active"))

        // Add "active" to the clicked button to highlight it
        this.classList.add("active")
        // Add "active" to the corresponding tab content to show it
        document.getElementById(tabName + "-tab").classList.add("active")
        })
    })
}

//* PASSWORD VISIBILITY TOGGLE *\\

//* TOGGLES PASSWORD VISIBILITY AND UPDATES EYE ICON WHEN CLICKED
function setupPasswordToggle() {
    // Add a click event to each password visibility icon
    passwordToggles.forEach((icon) => {
        icon.addEventListener("click", function () {
        // Get the ID of the password input field linked to this icon
        const targetId = this.getAttribute("data-target")
        const input = document.getElementById(targetId)

        // Check if password is currently hidden
        if (input.type === "password") {
            // Show the password as text
            input.type = "text"
            // Update the icon to show it's now visible
            this.classList.remove("bi-eye-slash")
            this.classList.add("bi-eye")
        } else {
            // Hide the password
            input.type = "password"
            // Update the icon to show it's now hidden
            this.classList.add("bi-eye-slash")
            this.classList.remove("bi-eye")
        }
        })
    })
}

//* BACK BUTTON FUNCTIONALITY *\\

//* NAVIGATES BACK TO PREVIOUS PAGE IN BROWSER HISTORY
function setupBackButton() {
    backBtn.addEventListener("click", () => {
        // Go back to the previous page like clicking the browser's back button
        history.back()
    })
}

//* PERSONAL INFORMATION FORM SUBMISSION *\\

//* VALIDATES ALL PERSONAL INFO FIELDS AND SAVES THEM TO BROWSER STORAGE
function setupPersonalInfoForm() {
    if (personalForm) {
        personalForm.addEventListener("submit", (e) => {
        // Stop the form from submitting the traditional way
        e.preventDefault()

        // Collect all the personal information from the form inputs
        const formData = {
            firstName: document.getElementById("firstName").value,
            middleName: document.getElementById("middleName").value,
            lastName: document.getElementById("lastName").value,
            suffix: document.getElementById("suffix").value,
            email: document.getElementById("email").value,
            contactNumber: document.getElementById("contactNumber").value,
            birthdate: document.getElementById("birthdate").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
        }

        //* VALIDATION 1: CHECK IF ALL REQUIRED FIELDS ARE FILLED IN
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.contactNumber ||
            !formData.birthdate ||
            !formData.age ||
            !formData.gender
        ) {
            alert("⚠️ Please fill in all required fields!")
            return
        }

        //* VALIDATION 2: CHECK IF EMAIL IS IN CORRECT FORMAT
        // This checks if the email has a valid structure (example@email.com)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            alert("⚠️ Please enter a valid email address!")
            return
        }

        //* VALIDATION 3: CHECK IF CONTACT NUMBER IS VALID
        // This checks if the phone number has at least 7 digits with common formatting (some countries have/uses 7-digit)
        const phoneRegex = /^[\d\s\-+()]{7,}$/
        if (!phoneRegex.test(formData.contactNumber)) {
            alert("⚠️ Please enter a valid contact number!")
            return
        }

        //* CONFIRMATION BEFORE SAVING
        const confirmSave = confirm("Are you sure you want to save changes to your personal information?")
        if (!confirmSave) {
            // User canceled the save
            alert("Save cancelled. No changes were made.")
            return
        }

        //* ALL VALIDATIONS PASSED - SAVE THE DATA
        // Convert the form data object into text and save it to browser storage
        localStorage.setItem("userPersonalInfo", JSON.stringify(formData))

        // Show success message to user
        alert("✅ Personal information saved successfully!")
        })
    }
}

//* SETTINGS FORM - CHANGE PASSWORD *\\

//* VALIDATES PASSWORD REQUIREMENTS AND SAVES PASSWORD CHANGE
function setupSettingsForm() {
    if (settingsForm) {
        // Get the Save Changes button in the settings form
        const saveButton = settingsForm.querySelector(".btn-primary")

        if (saveButton) {
        saveButton.addEventListener("click", (e) => {
            // Stop the default button action
            e.preventDefault()

            // Collect the password information from the form inputs
            const currentPassword = document.getElementById("currentPassword").value
            const newPassword = document.getElementById("newPassword").value
            const confirmPassword = document.getElementById("confirmPassword").value

            //* VALIDATION 1: CHECK IF ALL PASSWORD FIELDS ARE FILLED IN
            if (!currentPassword || !newPassword || !confirmPassword) {
            alert("⚠️ Please fill in all password fields!")
            return
            }

            //* VALIDATION 2: CHECK IF NEW PASSWORD IS STRONG ENOUGH
            // Password must be at least 8 characters for security
            if (newPassword.length < 8) {
            alert("⚠️ New password must be at least 8 characters long!")
            return
            }

            //* VALIDATION 3: CHECK IF NEW PASSWORD AND CONFIRM PASSWORD MATCH
            if (newPassword !== confirmPassword) {
            alert("⚠️ New password and confirm password do not match!")
            return
            }

            //* CONFIRMATION BEFORE SAVING PASSWORD
            const confirmSave = confirm("Are you sure you want to save the new password?")
            if (!confirmSave) {
                alert("Save cancelled. Password was not changed.")
                return
            }

            // Show success message to user
            alert("✅ Password changed successfully!")

            // Clear all password fields after successful change
            // This makes sure old passwords aren't left visible
            document.getElementById("currentPassword").value = ""
            document.getElementById("newPassword").value = ""
            document.getElementById("confirmPassword").value = ""
        })
        }
    }
}

//* SIGN OUT FUNCTIONALITY *\\

//* CLEARS USER DATA AND REDIRECTS TO LOGIN PAGE WITH CONFIRMATION
function setupSignOut() {
    if (signOutBtn) {
        signOutBtn.addEventListener("click", () => {
        // Ask the user to confirm they want to sign out
        const confirmSignOut = confirm("Are you sure you want to sign out?")

        if (confirmSignOut) {
            // User clicked OK - proceed with sign out
            // Delete all saved personal information from browser storage
            localStorage.removeItem("userPersonalInfo")

            // Show success message to user
            alert("✅ You have been signed out successfully!")

            // Redirect to login page
            // Actual login page URL
            window.location.href = "/login.html"
        } else {
            // User clicked Cancel - do nothing
        }
        })
    }
}

//* DELETE ACCOUNT FUNCTIONALITY *\\

//* REQUIRES DOUBLE CONFIRMATION BEFORE PERMANENTLY DELETING ACCOUNT
//* PREVENTS ACCIDENTAL ACCOUNT DELETION
function setupDeleteAccount() {
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", () => {
        //* FIRST CONFIRMATION DIALOG: WARNING MESSAGE
        const firstConfirm = confirm("⚠️ Are you sure you want to delete your account?\n\nThis action cannot be undone.")

        if (firstConfirm) {
            //* SECOND CONFIRMATION DIALOG: FINAL WARNING
            // This extra confirmation step prevents accidental deletion
            const secondConfirm = confirm(
            "🚨 WARNING: Deleting your account will permanently remove all your data.\n\nClick OK to confirm deletion, or Cancel to keep your account.",
            )

            if (secondConfirm) {
            //* USER CONFIRMED TWICE - PROCEED WITH DELETION
            // Delete all saved personal information from browser storage
            localStorage.removeItem("userPersonalInfo")

            // Show confirmation that account was deleted
            alert("✅ Your account has been deleted successfully.\n\nWe are redirecting you to the home page...")

            // Redirect to home page
            // Actual home page URL
            window.location.href = "/home.html"
            } else {
            //* USER CANCELLED ON SECOND CONFIRMATION - CANCEL DELETION
            alert("Account deletion cancelled. Your account is safe.")
            }
        } else {
            //* USER CANCELLED ON FIRST CONFIRMATION - CANCEL DELETION
            // Do nothing - user is still logged in
        }
        })
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
})