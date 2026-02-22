document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navCollapse = document.getElementById('mainNavbar');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) {
                bsCollapse.hide(); // close menu first
            }
        });
    });

    // Scroll fade-in animation
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.2 };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));

    // ======== CONTACT FORM ========
    const contactForm = document.getElementById("contactForm");
    const contactModalEl = document.getElementById("contactModal");
    const contactModalOk = document.getElementById("contactModalOk");

    if (contactForm && contactModalEl) {

        const contactModal = new bootstrap.Modal(contactModalEl);

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            contactModal.show();
        });

        if (contactModalOk) {
            contactModalOk.addEventListener("click", () => {
                contactForm.reset();
            });
        }
    }

    // ======== SUBSCRIPTION FORM ========
    const subscribeForm = document.getElementById("subscribeForm");
    const subscribeModalEl = document.getElementById("subscribeModal");
    const subscribeButton = document.getElementById("subscribeBtn");

    if (subscribeForm && subscribeModalEl) {

        const subscribeModal = new bootstrap.Modal(subscribeModalEl);

        subscribeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            subscribeModal.show();

            if (subscribeButton) {
                subscribeButton.textContent = "Subscribed";
                subscribeButton.disabled = true;
            }
        });
    }
});


// =================== Signup Form Validation ===================
const form = document.getElementById("signupForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Form submit reload stop

        let isValid = true;

        // Form fields
        const fullName = document.getElementById("fullName");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const city = document.getElementById("city");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");

        // Clear previous errors
        document.querySelectorAll(".error").forEach(el => el.textContent = "");

        // -------- Validation --------
        if (fullName.value.trim() === "") {
            showError(fullName, "Full Name is required");
            isValid = false;
        }

        if (!validateEmail(email.value.trim())) {
            showError(email, "Enter valid email");
            isValid = false;
        }

        if (!/^[0-9]{10}$/.test(phone.value.trim())) {
            showError(phone, "Enter valid 10 digit number");
            isValid = false;
        }

        if (city.value.trim() === "") {
            showError(city, "City is required");
            isValid = false;
        }

        if (password.value.length < 6) {
            showError(password, "Password must be at least 6 characters");
            isValid = false;
        }

        if (confirmPassword.value !== password.value) {
            showError(confirmPassword, "Passwords do not match");
            isValid = false;
        }

        if (!isValid) return; // Stop if any error

        // ===== Store user in localStorage =====
        let users = JSON.parse(localStorage.getItem("users")) || [];

        const newUser = {
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            city: city.value.trim(),
            password: password.value
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // Reset form
        form.reset();

        // ======= Alert popup success =======
        alert("Your Account Created Successfully! Redirecting.....");

        // Redirect to SignIn.html
        window.location.href = "SignIn.html";
    });

    // ===== Helper functions =====
    function showError(input, message) {
        const error = input.parentElement.querySelector(".error");
        if (error) error.textContent = message;
    }

    function validateEmail(email) {
        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        return pattern.test(email);
    }
}

// =================== Toggle Password Show/Hide ===================
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input.type === 'password') {
            input.type = 'text';
            this.textContent = 'Hide';
        } else {
            input.type = 'password';
            this.textContent = 'Show';
        }
    });
});

// ======= SignIn Form Validation =======
const signinForm = document.getElementById('signinForm');

if (signinForm) {
    signinForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Stop page reload

        // Clear previous errors
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        let valid = true;

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (email === '') {
            document.getElementById('emailError').textContent = 'Email is required';
            valid = false;
        } else if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Invalid email format';
            valid = false;
        }

        // Password validation
        if (password === '') {
            document.getElementById('passwordError').textContent = 'Password is required';
            valid = false;
        }

        if (!valid) return; // Stop if validation fails

        // ======= Check against stored Signup users =======
        let users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            alert('Login Successful!'); // Success alert
            // Redirect to home page
            window.location.href = 'index travelapp.html';
        } else {
            alert('Invalid Email or Password');
            document.getElementById('password').value = ''; // Clear password
        }
    });
}