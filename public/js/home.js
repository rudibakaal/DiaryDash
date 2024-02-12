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

        const uname = document.getElementById('username'); 
        uname.innerHTML = `${username}`

        // Call fetchUserEntries after updating the username
        fetchUserEntries();
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }


  
  function fetchUserEntries() {
    fetch('/home/user-entries')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          // Redirect to the login page if not authenticated
          window.location.href = '/user-auth/login';
        } else {
          throw new Error('Failed to fetch user entries');
        }
      })
      .then(data => {
        // Handle the user entries data here
        console.log('User Entries:', data.entries);
      })
      .catch(error => {
        console.error('Error fetching user entries:', error);
      });
  }
});

