//* FORM SECTIONS AND NAVIGATION LINKS
const loginForm = document.getElementById("loginForm")
const registerForm = document.getElementById("registerForm")
const resetPasswordForm = document.getElementById("resetPasswordForm")
const securityQuestionForm = document.getElementById("securityQuestionForm")
const loginLinks = document.querySelectorAll(".login-link")
const registerLinks = document.querySelectorAll(".register-link")
const forgotPasswordLinks = document.querySelectorAll(".forgot-password-link")

//* BACK BUTTONS IN ALL FORM SECTIONS
const backButtons = document.querySelectorAll(".back-btn")

//* TOGGLE PASSWORD (LOG-IN AND REGISTER FORM)
const passwordToggles = document.querySelectorAll(".password-toggle")

//* HIDDEN FORMS
function hideAllForms() {
    loginForm.classList.remove("slide")
    registerForm.classList.remove("slide")
    resetPasswordForm.classList.remove("slide")
    securityQuestionForm.classList.remove("slide")
}

//* SHOWS LOG-IN FORM (HIDES OTHERS)
function showLoginForm() { 
    hideAllForms()
    loginForm.classList.add("slide")
}

//* SHOWS REGISTER FORM (HIDES OTHERS)
function showRegisterForm() {
    hideAllForms()
    registerForm.classList.add("slide")
}

//* SHOWS RESET PASSWORD FORM (HIDES OTHERS)
function showResetPasswordForm() {
    hideAllForms()
    resetPasswordForm.classList.add("slide")
}

//* SHOWS SECURITY QUESTION FORM (HIDES OTHERS)
function showSecurityQuestionForm() {
    hideAllForms()
    securityQuestionForm.classList.add("slide")
}


//* NAVIGATION LINK EVENTS *\\

//* ENABLES FORM SWITCHING FROM LOG-IN TO REGISTER WHEN A "REGISTER" LINK IS CLICKED
registerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        showRegisterForm()
    })
})

//* ENABLES FORM SWITCHING FROM ANY FORM BACK TO LOG-IN WHEN A "LOGIN" LINK IS CLICKED
loginLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        showLoginForm()
    })
})

//* ENABLES FORM SWITCHING FROM LOG-IN TO RESET PASSWORD WHEN A "FORGOT PASSWORD" LINK IS CLICKED
forgotPasswordLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        showResetPasswordForm()
    })
})


//* FUNCTIONALITY OF BACK BUTTON *\\

//* ALWAYS RETURNS TO THE LOGIN FORM WHEN A BACK BUTTON IS CLICKED IN ANY FORM
backButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault()
        showLoginForm()
    })
})


//* TOGGLES PASSWORD VISIBILITY AND UPDATES EYE ICON (HIDDEN/VISIBLE) WHEN CLICKED *\\

passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
        //* IDENTIFY THE PASSWORD INPUT LINKED TO THE CLICKED ICON
        const targetId = this.getAttribute("data-target")
        const passwordInput = document.getElementById(targetId)
        //* SWITCHES INPUT TYPE AND ICON TO SHOW OR HIDE THE PASSWORD
        if (passwordInput.type === "password") {
            passwordInput.type = "text" // SHOW PASSWORD
            this.classList.remove("bi-eye-slash") // REMOVE SLASH ICON
            this.classList.add("bi-eye") // ADD EYE ICON
        } else {
            passwordInput.type = "password" // HIDE PASSWORD
            this.classList.remove("bi-eye") // REMOVE EYE ICON
            this.classList.add("bi-eye-slash") // ADD SLASH ICON
        }
    })
})


//* FORM VALIDATION *\\

//* HANDLES LOGIN FORM SUBMISSION AND CHECKS IF EMAIL AND PASSWORD ARE FILLED IN
document.getElementById("loginFormElement").addEventListener("submit", (e) => {
    e.preventDefault() // PREVENT ACTUAL FORM SUBMISSION

    //* GETS THE USER'S EMAIL AND PASSWORD FROM THE FORM
    const email = document.getElementById("login_email").value
    const password = document.getElementById("login_password").value
    //* VALIDATION
    if (email && password) {
        console.log("Login attempt:", { email, password })
        alert("You have successfully logged in!")
    } else {
        alert("Please fill in all fields")
    }
})

//* HANDLES REGISTER FORM SUBMISSION AND VALIDATES ALL FIELDS INCLUDING PASSWORD MATCH
document.getElementById("registerFormElement").addEventListener("submit", (e) => {
    e.preventDefault() 

    //* COLLECTS ALL INPUTS FROM THE REGISTRATION FORM
    const firstName = document.getElementById("register_first_name").value
    const middleName = document.getElementById("register_middle_name").value
    const lastName = document.getElementById("register_last_name").value
    const gender = document.getElementById("register_gender").value
    const birthdate = document.getElementById("register_birthdate").value
    const email = document.getElementById("register_email").value
    const password = document.getElementById("register_password").value
    const confirmPassword = document.getElementById("register_confirmPassword").value
    const securityQuestion = document.getElementById("register_security_question").value
    const securityAnswer = document.getElementById("register_security_answer").value
    const termsAccepted = document.getElementById("termsConditions").checked

    //* VALIDATES IF PASSWORD AND CONFIRM PASSWORD MATCH
    if (password !== confirmPassword) {
        alert("Passwords do not match!")
        return
    }

    //* VALIDATES IF THE USER ACCEPTED THE TERMS AND CONDITIONS
    if (!termsAccepted) {
        alert("You must agree to the Terms and Conditions")
        return
    }

    //* VALIDATES THAT ALL REQUIRED REGISTRATION FIELDS ARE FILLED IN
    if (firstName && lastName && email && password && securityQuestion && securityAnswer) {
        console.log("Registration attempt:", {
            firstName,
            middleName,
            lastName,
            gender,
            birthdate,
            email,
            securityQuestion,
            securityAnswer,
        })
        alert("You've registered successfully! You can now log in to your account.")
        showLoginForm() // REDIRECT TO LOGIN AFTER SUCCESSFUL REGISTRATION
    } else { 
        alert("Please fill in all required fields")
    }
})

//* HANDLES RESET PASSWORD SUBMISSION AND CHECKS IF THE EMAIL IS VALID BEFORE STARTING THE RESET PROCESS
document.getElementById("resetPasswordFormElement").addEventListener("submit", (e) => {
    e.preventDefault() 

    //* GETS THE EMAIL ENTERED IN THE RESET FORM
    const email = document.getElementById("reset_email").value

    //* VALIDATES IF THE USER ENTERED AN EMAIL BEFORE STARTING THE RESET PROCESS
    if (email) {
        console.log("Password reset requested for:", email)
        alert("Password reset link would be sent to: " + email)
        showSecurityQuestionForm()
    } else {
        alert("Please enter your email address")
    }
})

//* HANDLES SECURITY QUESTION SUBMISSION AND CHECKS IF THE ANSWER IS CORRECT BEFORE ALLOWING PASSWORD RESET
document.getElementById("securityQuestionFormElement").addEventListener("submit", (e) => {
    e.preventDefault()

    //* GETS THE SECURITY ANSWER ENTERED BY THE USER
    const securityAnswer = document.getElementById("security_answer").value

    //* VALIDATES IF THE USER ENTERED A SECURITY ANSWER BEFORE CONTINUING
    if (securityAnswer) {
        console.log("Security answer provided:", securityAnswer)
        alert("Security answer verified! You can now reset your password.")
        showLoginForm()
    } else {
        alert("Please enter your security answer")
    }
})


//* INITIALIZATION *\\

//* INITIALIZES THE PAGE BY DISPLAYING THE LOGIN FORM ON LOAD
document.addEventListener("DOMContentLoaded", () => {
    showLoginForm()
    console.log("Login/Register system initialized")
})
