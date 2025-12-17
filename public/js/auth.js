// Authentication Module for Aegisight
// Version: 1

// Open authentication modal
function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    // Show login tab by default
    showLoginForm();
}

// Close authentication modal
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    clearForms();
}

// Show login form
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('signupTab').classList.remove('active');
}

// Show signup form
function showSignupForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupTab').classList.add('active');
}

// Clear form data
function clearForms() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupFirstName').value = '';
    document.getElementById('signupLastName').value = '';
    document.getElementById('loginError').textContent = '';
    document.getElementById('signupError').textContent = '';
}

// Handle Google login
function handleGoogleLogin() {
    window.location.href = '/api/auth/google';
}

// Handle email/password login
async function handleEmailLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    errorEl.textContent = '';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.error || 'Login failed';
            return;
        }

        // Redirect to dashboard
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Login error:', error);
        errorEl.textContent = 'Login failed. Please try again.';
    }
}

// Handle email/password signup
async function handleEmailSignup(event) {
    event.preventDefault();

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const errorEl = document.getElementById('signupError');

    errorEl.textContent = '';

    // Validation
    if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters';
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, firstName, lastName }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.error || 'Registration failed';
            return;
        }

        // Redirect to dashboard
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Signup error:', error);
        errorEl.textContent = 'Registration failed. Please try again.';
    }
}

// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data.user;
        }

        return null;
    } catch (error) {
        return null;
    }
}

// Logout
async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/';
    }
}

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
};
