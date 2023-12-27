// public/js/auth.js
document.getElementById('login-logout-btn').addEventListener('click', function() {
  fetch('/auth/logout', { method: 'GET' })
    .then(response => {
      if (response.redirected) {
        // Redirect to the login page upon successful logout
        window.location.href = response.url;
      }
    })
    .catch(error => console.error('Error:', error));
});

