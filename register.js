const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginButton = document.querySelector("label.login");
const signupButton = document.querySelector("label.signup");
const loginRedirect = document.querySelector("#submit-btn");
const signupLink = document.querySelector("form .signup-link a");

signupButton.onclick = (()=> {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});

loginButton.onclick = (()=>{
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});

signupLink.onclick = (()=>{
    signupButton.click();
    return false;
});

loginRedirect.onclick = (()=> {
    /* 
        use conditional logic to check if login text & login password exist in database 
        if password user doesn't exist in database, then render error banner
        else link to user's page
    */
    location.href = "user.html";
});