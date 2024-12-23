var nameError = document.getElementById('name-error');
    var emailError = document.getElementById('email-error');
    var passwordError = document.getElementById('password-error');
    var confirmPasswordError = document.getElementById('confirm-password-error');
    var submitError = document.getElementById('submit-error');

    // Validate Name
    function validateName() {
      var name = document.getElementById('name-field').value;
      if (name.length == 0) {
        nameError.innerHTML = 'Name is required';
        return false;
      }

      if (!name.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)) {
        nameError.innerHTML = 'Write full name';
        return false;
      }
      nameError.innerHTML = '';
      return true;
    }

    // Validate Email
    function validateEmail() {
      var email = document.getElementById('email-field').value;
      if (email.length == 0) {
        emailError.innerHTML = 'Email is required';
        return false;
      }
      if (!email.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
        emailError.innerHTML = 'Email invalid';
        return false;
      }

      emailError.innerHTML = '';
      return true;
    }

    // Validate Password
    function validatePassword() {
      var password = document.getElementById('password-field').value;
      if (password.length == 0) {
        passwordError.innerHTML = 'Password is required';
        return false;
      } 

      // if (password.length < 6 || password.length > 20) {
      //   passwordError.innerHTML = 'Password length must be between 6 and 20 characters';
      //   return false;
      // }

      // if (!/[0-9]/.test(password)) {
      //   passwordError.innerHTML = 'Password must contain at least one number';
      //   return false;
      // }

      // if (!/[a-z]/.test(password)) {
      //   passwordError.innerHTML = 'Password must contain at least one lowercase letter';
      //   return false;
      // }

      // if (!/[A-Z]/.test(password)) {
      //   passwordError.innerHTML = 'Password must contain at least one uppercase letter';
      //   return false;
      // }

      // if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      //   passwordError.innerHTML = 'Password must contain at least one special character';
      //   return false;
      // }
      passwordError.innerHTML = '';
      validateConfirmPassword(); // Revalidate confirm password
      return true;
    }

    // Validate Confirm Password
    function validateConfirmPassword() {
      var password = document.getElementById('password-field').value;
      var confirmPassword = document.getElementById('confirm-password-field').value;

      if (confirmPassword.length == 0) {
        confirmPasswordError.innerHTML = 'Please confirm your password';
        return false;
      }

      if (password !== confirmPassword) {
        confirmPasswordError.innerHTML = 'Passwords do not match';
        return false;
      }
      confirmPasswordError.innerHTML = ' ';
      return true;
    }

    // Submit Validation
    function submitForm() {
      if (!validateName() || !validateEmail() || !validatePassword() || !validateConfirmPassword()) {
        // submitError.style.display = 'block';
        // submitError.innerHTML = 'Please enter valid information';
        // setTimeout(function () {
        //   submitError.style.display = 'none';
        // }, 3000);

        return false;
      }
    }

    // login Validation
    function submitFormLogin() {
      if (!validateEmail() || !validatePassword()) {
        // submitError.style.display = 'block';
        // submitError.innerHTML = 'Please enter valid information';
        // setTimeout(function () {
        //   submitError.style.display = 'none';
        // }, 3000);

        return false;
      }
    }



    