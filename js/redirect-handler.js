// Redirect Handler - Checks if user is logged in and redirects accordingly
function checkLoginAndRedirect(event, targetUrl) {
    event.preventDefault();
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        // User is logged in, redirect to dashboard (lms-portal.html)
        window.location.href = 'lms-portal.html';
    } else {
        // User not logged in, go to target URL (courses.html or lms-portal.html for login)
        window.location.href = targetUrl;
    }
}

// Initialize event listeners for login-check buttons
document.addEventListener('DOMContentLoaded', function() {
    // Get all buttons that need login check
    const loginCheckButtons = document.querySelectorAll('[data-login-check]');
    
    loginCheckButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const target = this.getAttribute('data-login-check') || 'courses.html';
            checkLoginAndRedirect(e, target);
        });
    });
});