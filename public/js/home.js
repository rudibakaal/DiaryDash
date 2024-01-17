// public/js/home.js

document.addEventListener('DOMContentLoaded', () => {
  // Fetch user data when the page loads
  fetchUserData();

  // Function to fetch user data using AJAX
  function fetchUserData() {
    fetch('/home/user-data')
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
        const username = data.user.username; // Get the username from the fetched data

        // Update the username in the dropdown
        const userDropdownElement = document.getElementById('dropdownUser1');
        userDropdownElement.innerHTML = `
          <img src="https://images.rawpixel.com/image_png_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L3BmLWljb240LWppcjIwNjItcG9yLWwtam9iNzg4LnBuZw.png" alt="${username}" width="30" height="30" class="rounded-circle">
          <span class="d-none d-sm-inline mx-1">${username}</span>
        `;
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }
});
