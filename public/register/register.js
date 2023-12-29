
const input = document.querySelector('input')
const firstName = document.getElementById('first_name');
const lastName = document.getElementById('last_name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm_password');
const emailErrorContainer = document.querySelector(".input-control-email .error");
const emailInputDiv = document.querySelector(".input-control-email");

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

document
    .querySelector("#register-form")
    .addEventListener('submit', async(event) => {
       let formError = false;
        event.preventDefault();
        
        validateInputs();
        const inputControlDiv = document.querySelectorAll('.input-control')

        inputControlDiv.forEach((field) => {
            if(field.classList.contains("error")){
                formError = true
            }
        })

        if(formError){
            return;
        }

        const form = event.target;


        let formObject = {
            firstName: form.first_name.value,
            lastName: form.last_name.value,
            email: form.email.value,
            password: form.password.value
        }
   

    const res = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject) //convert JS object to JSON format
    })

    const result = await res.json()

    if(res.status === 200){
        form.reset();
        swalWithBootstrapButtons.fire({
            title: "Registration succeed!",
            text: "You can choose to login or go back to main page.",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Login",
            cancelButtonText: "Go Back to Main Page"
          }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/owner/owner-studio.html"
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
                window.location.href = "/index.html"
                }
          });
        
    }else{
        emailInputDiv.classList.add('error')
        emailErrorContainer.classList.add('active')
        emailErrorContainer.innerText = `${result.message}`
    }

   
});


// Display Error Message when error  
const setError = (element,message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    const errorActive = errorDisplay.classList.add('active')

    errorDisplay.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
    
}

// Remove Error Message when no issue
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    const errorActive = errorDisplay.classList.remove('active')

    errorDisplay.innerHTML = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

// Regular expression to validate Email
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Regular expression to validate Password
const isValidPassword = password =>{
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return re.test(password)
}


// Function to set rules to validate user input value
const validateInputs = () => {
    //Removes whitespace from both sides of user input
    const firstNameValue = firstName.value.trim();
    const lastNameValue = lastName.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    if(firstNameValue === ''){
        setError(firstName,'First name is required.')
    }else{
        setSuccess(firstName)
    }

    if(lastNameValue === ''){
        setError(lastName,'Last name is required.')
    }else{
        setSuccess(lastName)
    }

    if(emailValue === ''){
        setError(email,'Email is required.')
    }else if (!isValidEmail(emailValue)){
        setError(email, 'Provide a valid email address')
    }else{
        setSuccess(email)
    }

    if(passwordValue === ''){
        setError(password,'Password is required.');
    }else if (!isValidPassword(passwordValue)){
        setError(password,'Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters');
    }else{
        setSuccess(password)
    }

    if(confirmPasswordValue === ''){
        setError(confirmPassword,'Password confirm your password.');
    }else if (confirmPasswordValue !== passwordValue){
        setError(confirmPassword,'Passwords do not match');
    }else{
        setSuccess(confirmPassword)
    }

}





