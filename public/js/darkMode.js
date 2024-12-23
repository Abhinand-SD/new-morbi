
    // Get references to the toggle button and the body
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check and apply the user's saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
        themeToggle.checked = true; // Set the toggle to "on" for dark mode
    }

    // Toggle theme on change
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark-mode'); // Save the user's preference
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode'); // Save the user's preference
        }
    });

