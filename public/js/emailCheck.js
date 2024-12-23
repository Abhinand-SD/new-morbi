document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission
  
    const email = document.getElementById('email-field').value;
  
    try {
      // Call the backend to check if the user exists
      const response = await fetch('/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (data.exists) {
        // Show pop-up alert
        Swal.fire({
          icon: 'info',
          title: 'User Exists',
          text: 'This email is already registered. Redirecting to login page...',
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          // Redirect to login page
          window.location.href = '/login';
        });
      } else {
        // Proceed with registration
        alert('Email is available. Proceeding with registration.');
        // Add further registration logic here
      }
    } catch (error) {
      console.error('Error checking user:', error);
      alert('Something went wrong. Please try again later.');
    }
  });
  