document.addEventListener('DOMContentLoaded', () => {
  // Fetch user data when the page loads
  fetchUserData();

  // Function to fetch user data using AJAX
  function fetchUserData() {
    fetch('/index/user-data')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          // Redirect to the login page if not authenticated
          window.location.href = '/user-auth/login';
        } else {
          throw new Error('Failed to fetch user data');
        }
      })
      .then(data => {
        // Update the user information on the page
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }
});

